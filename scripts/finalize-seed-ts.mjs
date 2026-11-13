import fs from 'fs';

const restaurants = JSON.parse(fs.readFileSync('scripts/seed_restaurants.json', 'utf8'));
const branches = JSON.parse(fs.readFileSync('scripts/branches.json', 'utf8'));
const users = JSON.parse(fs.readFileSync('scripts/seed_users.json', 'utf8'));
const tables = JSON.parse(fs.readFileSync('scripts/seed_tables.json', 'utf8'));
const menuItems = JSON.parse(fs.readFileSync('scripts/seed_menu_items.json', 'utf8'));
const reviews = JSON.parse(fs.readFileSync('scripts/seed_reviews.json', 'utf8'));

// Initial orders and reservations relative to current date
const now = new Date();
const todayIso = now.toISOString().split('T')[0];
const tomorrow = new Date(now.getTime() + 86400000);
const tomorrowIso = tomorrow.toISOString().split('T')[0];

const INITIAL_RESERVATIONS = [
  {
    id: 'res-co-1',
    code: 'RES-BOG-101',
    branchId: 'br-aura-co-chapinero',
    restaurantId: 'brand-aura',
    userId: 'user-customer-co',
    customerName: 'Valentina Morales',
    customerEmail: 'valentina.morales@gmail.com',
    customerPhone: '+57 310 998 7766',
    date: todayIso,
    time: '19:30',
    guestsCount: 2,
    tableId: 'tbl-br-aura-co-chapinero-3',
    tableNumber: 3,
    status: 'confirmed',
    notes: 'Mesa cerca a la terraza si es posible.',
    createdAt: new Date(now.getTime() - 3600000 * 5).toISOString(),
  },
  {
    id: 'res-br-1',
    code: 'RES-SAO-202',
    branchId: 'br-aura-br-pinheiros',
    restaurantId: 'brand-aura',
    userId: 'user-customer-br',
    customerName: 'Camila Santos',
    customerEmail: 'camila.santos@gmail.com',
    customerPhone: '+55 11 98765-4321',
    date: todayIso,
    time: '20:00',
    guestsCount: 4,
    tableId: 'tbl-br-aura-br-pinheiros-2',
    tableNumber: 2,
    status: 'confirmed',
    notes: 'Comemoração de aniversário.',
    createdAt: new Date(now.getTime() - 3600000 * 12).toISOString(),
  },
  {
    id: 'res-us-1',
    code: 'RES-NYC-303',
    branchId: 'br-aura-us-manhattan',
    restaurantId: 'brand-aura',
    userId: 'user-customer-us',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@gmail.com',
    customerPhone: '+1 212 555 0199',
    date: tomorrowIso,
    time: '13:00',
    guestsCount: 2,
    tableId: 'tbl-br-aura-us-manhattan-1',
    tableNumber: 1,
    status: 'pending',
    notes: 'Window booth requested.',
    createdAt: new Date(now.getTime() - 3600000 * 2).toISOString(),
  },
  {
    id: 'res-fr-1',
    code: 'RES-PAR-404',
    branchId: 'br-aura-fr-marais',
    restaurantId: 'brand-aura',
    userId: 'user-customer-fr',
    customerName: 'Juliette Moreau',
    customerEmail: 'juliette.moreau@gmail.com',
    customerPhone: '+33 6 12 34 56 78',
    date: tomorrowIso,
    time: '20:30',
    guestsCount: 2,
    tableId: 'tbl-br-aura-fr-marais-2',
    tableNumber: 2,
    status: 'confirmed',
    notes: 'Dîner d’affaires au calme.',
    createdAt: new Date(now.getTime() - 3600000 * 4).toISOString(),
  },
  {
    id: 'res-jp-1',
    code: 'RES-TYO-505',
    branchId: 'br-aura-jp-shibuya',
    restaurantId: 'brand-aura',
    userId: 'user-customer-jp',
    customerName: 'Yuki Takahashi',
    customerEmail: 'yuki.takahashi@gmail.com',
    customerPhone: '+81 90-1234-5678',
    date: todayIso,
    time: '19:00',
    guestsCount: 2,
    tableId: 'tbl-br-aura-jp-shibuya-3',
    tableNumber: 3,
    status: 'confirmed',
    notes: '静かな席を希望します。',
    createdAt: new Date(now.getTime() - 3600000 * 6).toISOString(),
  },
];

const INITIAL_ORDERS = [
  {
    id: 'ord-co-1',
    orderNumber: 'CMD-101',
    branchId: 'br-aura-co-chapinero',
    restaurantId: 'brand-aura',
    userId: 'user-customer-co',
    orderType: 'dine_in',
    tableId: 'tbl-br-aura-co-chapinero-2',
    tableNumber: 2,
    items: [
      {
        menuItemId: 'br-aura-co-chapinero-dish-co-aura-01',
        name: 'Empanadas Bogotanas con Ají Casero',
        quantity: 1,
        unitPriceMinorUnits: 24000,
        subtotalMinorUnits: 24000,
        unitPrice: 24000,
        subtotal: 24000,
      },
      {
        menuItemId: 'br-aura-co-chapinero-dish-co-lunch',
        name: 'Almuerzo del Día: Pechuga a la Brasa con Arroz de Coco',
        quantity: 2,
        unitPriceMinorUnits: 25900,
        subtotalMinorUnits: 51800,
        unitPrice: 25900,
        subtotal: 51800,
      },
    ],
    subtotalMinorUnits: 75800,
    taxAmountMinorUnits: 6064,
    tipAmountMinorUnits: 7580,
    deliveryFeeMinorUnits: 0,
    totalMinorUnits: 89444,
    subtotal: 75800,
    taxAmount: 6064,
    tipAmount: 7580,
    total: 89444,
    currency: 'COP',
    status: 'preparing',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: new Date(now.getTime() - 15 * 60000).toISOString(),
    updatedAt: new Date(now.getTime() - 10 * 60000).toISOString(),
    estimatedReadyMinutes: 20,
    customerName: 'Valentina Morales',
  },
];

const INITIAL_HEALTH = [
  { id: 'auth-service', service: 'auth-service', nameKey: 'service_auth', descriptionKey: 'service_auth', status: 'healthy', latencyMs: 12, processedCount: 120, processedEventsCount: 120, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.98 },
  { id: 'restaurant-service', service: 'restaurant-service', nameKey: 'service_restaurant', descriptionKey: 'service_restaurant', status: 'healthy', latencyMs: 18, processedCount: 340, processedEventsCount: 340, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.95 },
  { id: 'reservation-service', service: 'reservation-service', nameKey: 'service_reservation', descriptionKey: 'service_reservation', status: 'healthy', latencyMs: 25, processedCount: 88, processedEventsCount: 88, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.99 },
  { id: 'order-service', service: 'order-service', nameKey: 'service_order', descriptionKey: 'service_order', status: 'healthy', latencyMs: 22, processedCount: 210, processedEventsCount: 210, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.94 },
  { id: 'kitchen-service', service: 'kitchen-service', nameKey: 'service_kitchen', descriptionKey: 'service_kitchen', status: 'healthy', latencyMs: 15, processedCount: 195, processedEventsCount: 195, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.96 },
  { id: 'notification-service', service: 'notification-service', nameKey: 'service_notification', descriptionKey: 'service_notification', status: 'healthy', latencyMs: 9, processedCount: 450, processedEventsCount: 450, failedCount: 0, failedEventsCount: 0, uptimePercent: 100 },
  { id: 'analytics-service', service: 'analytics-service', nameKey: 'service_analytics', descriptionKey: 'service_analytics', status: 'healthy', latencyMs: 30, processedCount: 160, processedEventsCount: 160, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.91 },
];

const seedFileContent = `import {
  Restaurant,
  Branch,
  Table,
  MenuItem,
  User,
  Reservation,
  Order,
  AppNotification,
  DistributedEvent,
  ServiceDefinition,
  ServiceHealth,
  Review,
} from '../types';

export const SEED_RESTAURANTS: Restaurant[] = ${JSON.stringify(restaurants, null, 2)};
export const SEED_BRANCHES: Branch[] = ${JSON.stringify(branches, null, 2)};
export const SEED_USERS: User[] = ${JSON.stringify(users, null, 2)};
export const SEED_TABLES: Table[] = ${JSON.stringify(tables, null, 2)};
export const SEED_MENU_ITEMS: MenuItem[] = ${JSON.stringify(menuItems, null, 2)};
export const SEED_REVIEWS: Review[] = ${JSON.stringify(reviews, null, 2)};
export const SEED_RESERVATIONS: Reservation[] = ${JSON.stringify(INITIAL_RESERVATIONS, null, 2)};
export const SEED_ORDERS: Order[] = ${JSON.stringify(INITIAL_ORDERS, null, 2)};
export const SEED_NOTIFICATIONS: AppNotification[] = [];
export const SEED_EVENTS: DistributedEvent[] = [];
export const SEED_SERVICES: ServiceDefinition[] = [
  { id: 'auth-service', nameKey: 'service_auth', descriptionKey: 'service_auth', status: 'healthy', publishes: ['USER_LOGGED_IN', 'USER_LOGGED_OUT'], consumes: [], processedCount: 120, failedCount: 0 },
  { id: 'restaurant-service', nameKey: 'service_restaurant', descriptionKey: 'service_restaurant', status: 'healthy', publishes: ['PRODUCT_AVAILABILITY_CHANGED', 'RESTAURANT_UPDATED'], consumes: [], processedCount: 340, failedCount: 0 },
  { id: 'reservation-service', nameKey: 'service_reservation', descriptionKey: 'service_reservation', status: 'healthy', publishes: ['RESERVATION_CREATED', 'RESERVATION_CONFIRMED', 'RESERVATION_CANCELLED'], consumes: [], processedCount: 88, failedCount: 0 },
  { id: 'order-service', nameKey: 'service_order', descriptionKey: 'service_order', status: 'healthy', publishes: ['ORDER_CREATED', 'ORDER_PAID', 'ORDER_DELIVERED'], consumes: ['PRODUCT_AVAILABILITY_CHANGED'], processedCount: 210, failedCount: 0 },
  { id: 'kitchen-service', nameKey: 'service_kitchen', descriptionKey: 'service_kitchen', status: 'healthy', publishes: ['ORDER_PREPARING', 'ORDER_READY'], consumes: ['ORDER_CREATED'], processedCount: 195, failedCount: 0 },
  { id: 'notification-service', nameKey: 'service_notification', descriptionKey: 'service_notification', status: 'healthy', publishes: [], consumes: ['ORDER_CREATED', 'RESERVATION_CREATED'], processedCount: 450, failedCount: 0 },
  { id: 'analytics-service', nameKey: 'service_analytics', descriptionKey: 'service_analytics', status: 'healthy', publishes: ['METRICS_AGGREGATED'], consumes: ['ORDER_PAID', 'RESERVATION_COMPLETED'], processedCount: 160, failedCount: 0 },
];
export const SEED_SERVICE_HEALTH: ServiceHealth[] = ${JSON.stringify(INITIAL_HEALTH, null, 2)};
`;

fs.writeFileSync('src/data/seedData.ts', seedFileContent, 'utf8');
console.log('Successfully wrote src/data/seedData.ts with clean 5-country data');
