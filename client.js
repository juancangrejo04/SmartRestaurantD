// Cliente mínimo del intermediario: publicar y suscribirse (SSE + confirmación).
const http = require('http');
const BROKER = process.env.BROKER || 'http://127.0.0.1:4000';
const u = new URL(BROKER);
function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body || {});
    const r = http.request({ host: u.hostname, port: u.port, path, method: 'POST',
      headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(data) } }, res => {
      let b = ''; res.on('data', c => b += c); res.on('end', () => resolve(b ? JSON.parse(b) : {}));
    });
    r.on('error', reject); r.end(data);
  });
}
async function publish(topic, payload) {
  for (let i = 0; i < 5; i++) {            // reintento con espera creciente
    try { return await post('/publish', { topic, payload }); }
    catch (e) { await new Promise(r => setTimeout(r, 250 * 2 ** i)); }
  }
  throw new Error('broker no disponible');
}
function subscribe(name, topics, handler) {
  const connect = () => {
    const req = http.get(`${BROKER}/subscribe?name=${name}&topics=${topics.join(',')}`, res => {
      let buf = '';
      res.on('data', chunk => {
        buf += chunk;
        let i;
        while ((i = buf.indexOf('\n\n')) >= 0) {
          const line = buf.slice(0, i); buf = buf.slice(i + 2);
          if (!line.startsWith('data: ')) continue;
          const m = JSON.parse(line.slice(6));
          Promise.resolve(handler(m.topic, m.payload, m))
            .then(() => post('/ack', { name, id: m.id })).catch(e => console.error(name, 'handler', e.message));
        }
      });
      res.on('end', () => setTimeout(connect, 500));
    });
    req.on('error', () => setTimeout(connect, 500));
  };
  connect();
}
function serve(port, routes) {
  http.createServer((req, res) => {
    let b = ''; req.on('data', c => b += c);
    req.on('end', () => {
      const h = routes[req.method + ' ' + req.url.split('?')[0]] ||
        Object.entries(routes).find(([k]) => k.endsWith('/') && (req.method + ' ' + req.url).startsWith(k))?.[1];
      if (!h) { res.writeHead(404); return res.end('{}'); }
      Promise.resolve(h(b ? JSON.parse(b) : {}, req)).then(out => {
        res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(out));
      }).catch(e => { res.writeHead(500); res.end(JSON.stringify({ error: e.message })); });
    });
  }).listen(port, () => console.log('listening', port));
}
module.exports = { publish, subscribe, serve };
