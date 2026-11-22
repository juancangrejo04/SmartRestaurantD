// Nodo regional: la MISMA imagen para los cinco países; solo cambia REGION (perfil regional).
const { publish, subscribe, serve } = require('../lib/client');
const profiles = require('../lib/profiles.json');
const REGION = process.env.REGION; const P = profiles[REGION];
if (!P) throw new Error('REGION inválida: ' + REGION);
const orders = {}; let n = 0; const TIMEOUT = +process.env.ORDER_TIMEOUT_MS || 8000;
const cancel = async (o, reason) => {
  if (o.status === 'completed' || o.status === 'cancelled') return;
  o.status = 'cancelled'; o.reason = reason; o.compensated = true;
  await publish('order.cancelled', { orderId: o.id, region: REGION, reason });
};
subscribe('order-' + REGION, ['payment.authorized', 'delivery.assigned', 'delivery.failed', 'payment.refunded'], async (topic, p) => {
  const o = orders[p.orderId]; if (!o || p.region !== REGION) return;
  if (topic === 'payment.authorized' && o.status === 'pending') o.status = 'paid';
  if (topic === 'delivery.assigned' && o.status !== 'cancelled') { o.status = 'completed'; o.courier = p.courier; await publish('order.completed', { orderId: o.id, region: REGION }); }
  if (topic === 'delivery.failed') await cancel(o, p.reason);
  if (topic === 'payment.refunded') o.refunded = true;
});
serve(P.port, {
  'GET /health': () => ({ status: 'up', role: 'order-node', region: REGION, currency: P.currency }),
  'POST /orders': async body => {
    const subtotal = body.items.reduce((s, i) => s + i.price * i.qty, 0);
    const r = x => Math.round(x); const tax = r(subtotal * P.taxRate), tip = r(subtotal * P.tipRate);
    const o = { id: `${REGION.toUpperCase()}-${Date.now()}-${++n}`, region: REGION, currency: P.currency, subtotal, delivery: P.deliveryFee, tax, tip,
      total: subtotal + P.deliveryFee + tax + tip, status: 'pending', createdAtUtc: new Date().toISOString() };
    orders[o.id] = o;
    await publish('order.created', { orderId: o.id, region: REGION, total: o.total, noCourier: !!body.forceNoCourier });
    setTimeout(() => { if (o.status !== 'completed') cancel(o, 'tiempo de espera agotado').catch(() => {}); }, TIMEOUT);
    return o;
  },
  'GET /orders/': (_, req) => orders[req.url.split('/').pop()] || { error: 'no existe' },
});
