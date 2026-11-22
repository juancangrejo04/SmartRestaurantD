const { publish, subscribe, serve } = require('../lib/client');
const seen = new Set(); const authorized = {}; let duplicates = 0;
subscribe('payments', ['order.created', 'order.cancelled'], async (topic, p) => {
  if (topic === 'order.created') {
    if (seen.has(p.orderId)) { duplicates++; return; }          // idempotencia por clave de pedido
    seen.add(p.orderId); authorized[p.orderId] = 'tx_' + p.orderId;
    await publish('payment.authorized', { orderId: p.orderId, region: p.region, txId: authorized[p.orderId], amount: p.total, noCourier: p.noCourier });
  } else if (authorized[p.orderId]) {
    authorized[p.orderId] = 'refunded'; await publish('payment.refunded', { orderId: p.orderId, region: p.region });
  }
});
serve(+process.env.PORT || 4010, { 'GET /health': () => ({ status: 'up', role: 'payments' }),
  'GET /state': () => ({ authorizations: seen.size, duplicatesIgnored: duplicates, authorized }) });
