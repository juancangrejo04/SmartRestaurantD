const { subscribe, serve } = require('../lib/client');
const log = [];
subscribe('notifications', ['order.created', 'payment.authorized', 'payment.refunded', 'delivery.assigned', 'delivery.failed', 'order.completed', 'order.cancelled'],
  async (topic, p) => { log.push({ at: new Date().toISOString(), topic, orderId: p.orderId, region: p.region }); if (log.length > 500) log.shift(); });
serve(+process.env.PORT || 4012, { 'GET /health': () => ({ status: 'up', role: 'notifications' }), 'GET /log': () => log });
