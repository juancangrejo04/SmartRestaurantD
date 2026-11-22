// Levanta broker + 4 subsistemas + 5 nodos regionales como PROCESOS y ejecuta las pruebas de falla.
const { spawn } = require('child_process'); const http = require('http'); const path = require('path');
const procs = {}; const S = f => path.join(__dirname, '..', 'services', f);
const start = (name, file, env) => { procs[name] = spawn('node', [S(file)], { env: { ...process.env, BROKER: 'http://127.0.0.1:4000', ...env }, stdio: 'ignore' }); };
const stop = name => new Promise(r => { procs[name].once('exit', r); procs[name].kill('SIGKILL'); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const req = (method, port, p, body) => new Promise((res, rej) => { const d = body ? JSON.stringify(body) : '';
  const r = http.request({ host: '127.0.0.1', port, path: p, method, headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(d) } },
    x => { let b = ''; x.on('data', c => b += c); x.on('end', () => res(JSON.parse(b || '{}'))); }); r.on('error', rej); r.end(d); });
const ports = { co: 4101, br: 4102, us: 4103, fr: 4104, jp: 4105 };
const items = [{ price: 25900, qty: 2 }];            // caso: dos almuerzos (subtotal 51.800 en COP)
const results = []; const ok = (name, cond, detail) => { results.push({ name, ok: !!cond, detail }); console.log((cond ? 'PASS ' : 'FAIL ') + name + ' | ' + detail); };
const waitStatus = async (reg, id, st, ms = 9000) => { const t = Date.now(); let o; while (Date.now() - t < ms) { o = await req('GET', ports[reg], '/orders/' + id); if (o.status === st) return o; await sleep(200); } return o; };
(async () => {
  start('broker', 'broker.js', { PORT: 4000 }); await sleep(500);
  start('payments', 'payments.js', {}); start('logistics', 'logistics.js', {}); start('notifications', 'notifications.js', {});
  for (const r of Object.keys(ports)) start('node-' + r, 'order-node.js', { REGION: r });
  await sleep(1500);
  // T0: el mismo pedido en las 5 regiones
  for (const r of Object.keys(ports)) { const o = await req('POST', ports[r], '/orders', { items: r === 'co' ? items : [{ price: r === 'jp' ? 2590 : 2590, qty: 2 }] }); const f = await waitStatus(r, o.id, 'completed');
    ok(`T0 ${r}: pedido completado en su región`, f.status === 'completed', `${f.currency} total=${f.total} estado=${f.status}`); }
  // F1: cae pagos; el pedido espera y se completa al volver (reentrega del broker)
  await stop('payments'); const o1 = await req('POST', ports.br, '/orders', { items }); await sleep(1500);
  const mid = await req('GET', ports.br, '/orders/' + o1.id); start('payments', 'payments.js', {});
  const f1 = await waitStatus('br', o1.id, 'completed');
  ok('F1 caída de pagos y recuperación', mid.status === 'pending' && f1.status === 'completed', `durante la caída=${mid.status}; tras reiniciar=${f1.status}`);
  // F2: cae un nodo regional; las demás regiones siguen
  await stop('node-co'); const o2 = await req('POST', ports.fr, '/orders', { items }); const f2 = await waitStatus('fr', o2.id, 'completed');
  let down = false; try { await req('GET', ports.co, '/health'); } catch { down = true; }
  start('node-co', 'order-node.js', { REGION: 'co' }); await sleep(1000); const h = await req('GET', ports.co, '/health');
  ok('F2 caída del nodo node-co; node-fr sigue y node-co vuelve', down && f2.status === 'completed' && h.status === 'up', `node-co caído=${down}; pedido FR=${f2.status}; node-co tras reinicio=${h.status}`);
  // F3: sin repartidor => compensación (Saga) con reembolso
  const o3 = await req('POST', ports.us, '/orders', { items, forceNoCourier: true }); const f3 = await waitStatus('us', o3.id, 'cancelled'); await sleep(800);
  const f3b = await req('GET', ports.us, '/orders/' + o3.id);
  ok('F3 sin repartidor: compensación y reembolso', f3.status === 'cancelled' && f3b.refunded === true, `estado=${f3b.status}; motivo=${f3b.reason}; reembolsado=${f3b.refunded}`);
  // F4: mensaje duplicado
  const before = (await req('GET', 4010, '/state')).duplicatesIgnored;
  const dup = { orderId: 'DUP-1', region: 'jp', total: 1 }; const pub = require('../lib/client');
  process.env.BROKER = 'http://127.0.0.1:4000'; await pub.publish('order.created', dup); await pub.publish('order.created', dup); await sleep(1200);
  const st = await req('GET', 4010, '/state');
  ok('F4 evento duplicado: un solo cobro', st.duplicatesIgnored === before + 1 && !!st.authorized['DUP-1'], `duplicados ignorados=${st.duplicatesIgnored - before}`);
  // F5: tiempo de espera de pedido sin servicio de logística => cancelación por timeout
  await stop('logistics'); const o5 = await req('POST', ports.jp, '/orders', { items: [{ price: 2590, qty: 2 }] });
  const f5 = await waitStatus('jp', o5.id, 'cancelled', 12000); start('logistics', 'logistics.js', {});
  ok('F5 logística no responde: cancelación por tiempo de espera', f5.status === 'cancelled', `estado=${f5.status}; motivo=${f5.reason}`);
  // T6: sexto país solo con configuración (perfil "de" en lib/profiles.json, sin cambiar código)
  ports.de = 4106; start('node-de', 'order-node.js', { REGION: 'de' }); await sleep(1000);
  const o6 = await req('POST', 4106, '/orders', { items: [{ price: 2590, qty: 2 }] }); const f6 = await waitStatus('de', o6.id, 'completed');
  ok('T6 sexto país (Alemania) por configuración', f6.status === 'completed', `${f6.currency} total=${f6.total} estado=${f6.status}`);
  const stats = await req('GET', 4000, '/stats'); console.log('broker:', JSON.stringify(stats));
  const pass = results.filter(r => r.ok).length; console.log(`\nRESULTADO: ${pass}/${results.length} aprobadas`);
  for (const p of Object.values(procs)) p.kill('SIGKILL'); process.exit(pass === results.length ? 0 : 1);
})().catch(e => { console.error(e); for (const p of Object.values(procs)) p.kill('SIGKILL'); process.exit(2); });
