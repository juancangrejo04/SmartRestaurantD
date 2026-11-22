const { publish, subscribe, serve } = require('../lib/client');
const COURIERS = +process.env.COURIERS_PER_REGION || 3;
const busy = {}; const leases = {};
subscribe('logistics', ['payment.authorized', 'order.cancelled'], async (topic, p) => {
  if (topic === 'payment.authorized') {
    if (leases[p.orderId]) return;
    busy[p.region] = busy[p.region] || 0;
    if (busy[p.region] >= COURIERS || p.noCourier) return publish('delivery.failed', { orderId: p.orderId, region: p.region, reason: 'sin repartidor' });
    busy[p.region]++; leases[p.orderId] = p.region;
    await publish('delivery.assigned', { orderId: p.orderId, region: p.region, courier: `${p.region}-rep${busy[p.region]}` });
  } else if (leases[p.orderId]) { busy[leases[p.orderId]]--; delete leases[p.orderId]; }
});
serve(+process.env.PORT || 4011, { 'GET /health': () => ({ status: 'up', role: 'logistics' }), 'GET /state': () => ({ busy, leases }) });
