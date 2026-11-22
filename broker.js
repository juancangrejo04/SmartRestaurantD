// Intermediario de mensajes como proceso aparte: publicación-suscripción con cola por suscriptor,
// confirmación (ack), reentrega con tope de 3 intentos y cola de mensajes fallidos (DLQ).
const http = require('http');
const PORT = +process.env.PORT || 4000;
const subs = new Map(); const dlq = []; let published = 0, seq = 0;
const deliver = (s, m) => { if (!s.res) return; m.attempts++; m.t = Date.now(); s.res.write('data: ' + JSON.stringify({ id: m.id, topic: m.topic, payload: m.payload }) + '\n\n'); };
setInterval(() => {
  for (const s of subs.values()) {
    if (!s.res) continue;
    for (const [id, m] of s.queue) {
      if (m.attempts === 0 || Date.now() - m.t > 1000) {
        if (m.attempts >= 3) { dlq.push({ sub: s.name, ...m }); s.queue.delete(id); } else deliver(s, m);
      }
    }
  }
}, 300);
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let body = ''; req.on('data', c => body += c);
  req.on('end', () => {
    const json = o => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };
    if (url.pathname === '/subscribe') {
      const name = url.searchParams.get('name'); const topics = new Set(url.searchParams.get('topics').split(','));
      const s = subs.get(name) || { name, queue: new Map() }; s.topics = topics; s.res = res; subs.set(name, s);
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' }); res.write(':ok\n\n');
      res.on('close', () => { if (s.res === res) s.res = null; });
    } else if (req.method === 'POST' && url.pathname === '/publish') {
      const { topic, payload } = JSON.parse(body); published++;
      for (const s of subs.values()) if (s.topics.has(topic)) s.queue.set(++seq, { id: seq, topic, payload, attempts: 0, t: 0 });
      json({ ok: true });
    } else if (req.method === 'POST' && url.pathname === '/ack') {
      const { name, id } = JSON.parse(body); subs.get(name)?.queue.delete(id); json({ ok: true });
    } else if (url.pathname === '/stats') {
      json({ published, dlq: dlq.length, subs: Object.fromEntries([...subs].map(([n, s]) => [n, { connected: !!s.res, pending: s.queue.size }])) });
    } else if (req.method === 'POST' && url.pathname === '/dlq/replay') {
      const n = dlq.length; for (const m of dlq.splice(0)) { const s = subs.get(m.sub); if (s) { m.attempts = 0; s.queue.set(m.id, m); } } json({ replayed: n });
    } else json({ status: 'up', role: 'broker' });
  });
}).listen(PORT, () => console.log('broker', PORT));
