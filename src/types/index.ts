export type CountryCode = 'CO' | 'MX' | 'US' | 'BR' | 'JP';

export type Language = 'es' | 'en' | 'pt' | 'ja';

export type UserRole = 'owner' | 'admin' | 'waiter' | 'kitchen' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  assignedRestaurantId?: string;
  assignedBranchId?: string;
  country: CountryCode;
}

export interface CountryConfig {
  code: CountryCode;
  name: string;
  nativeName: string;
  language: Language;
  currency: 'COP' | 'MXN' | 'USD' | 'BRL' | 'JPY';
  symbol: string;
  flagEmoji: string;
  timeZone: string;
  taxRate: number; // e.g. 0.08
  taxName: string;
  locale: string;
  hasDecimals: boolean;
  ratePerUSD?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  tagline: Record<Language, string>;
  cuisine: Record<Language, string>;
  description: Record<Language, string>;
  country: CountryCode;
  rating: number;
  reviewCount: number;
  priceRange: '$$' | '$$$' | '$$$$';
  heroImage: string;
  logo?: string;
  contactEmail: string;
  phone: string;
}

export interface Branch {
  id: string;
  restaurantId: string;
  name: string;
  city: string;
  address: string;
  country: CountryCode;
  phone: string;
  openingHours: string;
  totalTables: number;
  active: boolean;
}

export type TableZone = 'indoor' | 'terrace' | 'vip' | 'bar';
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface Table {
  id: string;
  branchId: string;
  number: number;
  capacity: number;
  zone: TableZone;
  status: TableStatus;
  currentOrderId?: string;
}

export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'drinks' | 'specials';

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  category: MenuCategory;
  price: number; // in local currency
  basePriceUSD?: number;
  prepTimeMinutes: number;
  available: boolean;
  image: string;
  dietary?: ('vegetarian' | 'vegan' | 'gluten_free' | 'spicy' | 'chef_special')[];
  popular?: boolean;
}

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'rejected'
  | 'completed'
  | 'no_show'
  | 'no-show';

export interface Reservation {
  id: string;
  code: string;
  branchId: string;
  restaurantId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  guestsCount: number;
  tableId: string;
  tableNumber: number;
  status: ReservationStatus;
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

export type OrderStatus = 'created' | 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentMethod = 'card' | 'cash' | 'digital_wallet' | 'qr_transfer';
export type PaymentStatus = 'pending' | 'completed' | 'paid' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  branchId: string;
  restaurantId: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  tipAmount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  estimatedReadyMinutes?: number;
  customerName?: string;
}

export interface AppNotification {
  id: string;
  type: 'reservation' | 'order' | 'kitchen' | 'system';
  title?: string;
  message?: string;
  metadata?: any;
  translationKey?: string;
  translationParams?: Record<string, string | number>;
  timestamp: string;
  read: boolean;
  targetRole?: UserRole;
  targetBranchId?: string;
}

export type Notification = AppNotification;

export type ServiceName =
  | 'auth-service'
  | 'restaurant-service'
  | 'reservation-service'
  | 'order-service'
  | 'kitchen-service'
  | 'notification-service'
  | 'analytics-service';

export type ServiceStatus = 'up' | 'healthy' | 'degraded' | 'down';

export interface ServiceHealth {
  id?: ServiceName;
  service?: ServiceName;
  name?: string;
  description?: string;
  nameKey?: string;
  descriptionKey?: string;
  status: ServiceStatus;
  latencyMs?: number;
  errorRate?: number;
  lastPing?: string;
  processedCount?: number;
  processedEventsCount?: number;
  failedCount?: number;
  failedEventsCount?: number;
  uptimePercent?: number;
  publishes?: EventType[];
  consumes?: EventType[];
}

export type EventType =
  | 'USER_LOGGED_IN'
  | 'USER_LOGGED_OUT'
  | 'PRODUCT_AVAILABILITY_CHANGED'
  | 'RESTAURANT_UPDATED'
  | 'RESERVATION_CREATED'
  | 'RESERVATION_CONFIRMED'
  | 'RESERVATION_CANCELLED'
  | 'RESERVATION_REJECTED'
  | 'RESERVATION_COMPLETED'
  | 'RESERVATION_NO_SHOW'
  | 'ORDER_CREATED'
  | 'ORDER_PAID'
  | 'ORDER_RECEIVED_BY_KITCHEN'
  | 'ORDER_PREPARING'
  | 'ORDER_READY'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'METRICS_AGGREGATED';

export type EventStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface DistributedEvent {
  id: string;
  type: EventType;
  eventType?: EventType;
  payload: Record<string, any>;
  timestamp: string;
  sourceService: ServiceName;
  targetService: ServiceName | 'broadcast' | 'event-bus';
  status: EventStatus;
  attempts: number;
  maxAttempts: number;
  idempotencyKey: string;
  correlationId: string;
  error?: string;
  errorDetails?: string;
  latencyMs?: number;
  processedAt?: string;
  isDuplicateIgnored?: boolean;
}

export interface ServiceDefinition {
  id: ServiceName;
  nameKey: string;
  descriptionKey: string;
  status: ServiceStatus;
  publishes: EventType[];
  consumes: EventType[];
  processedCount: number;
  failedCount: number;
}

