export type CountryCode = 'CO' | 'MX' | 'US' | 'BR' | 'JP';

export type UserRole = 'owner' | 'admin' | 'waiter' | 'kitchen' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  assignedRestaurantId?: string;
  assignedBranchId?: string;
}

export interface CountryConfig {
  code: CountryCode;
  name: string;
  nativeName: string;
  language: 'es' | 'en' | 'pt' | 'ja';
  currency: 'COP' | 'MXN' | 'USD' | 'BRL' | 'JPY';
  symbol: string;
  flagEmoji: string;
  timeZone: string;
  taxRate: number; // e.g. 0.08 for 8%
  taxName: string;
  locale: string;
  ratePerUSD: number; // for currency conversion calculations
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  country: CountryCode;
  cuisine: string;
  description: string;
  rating: number;
  contactEmail: string;
  phone: string;
}

export interface Branch {
  id: string;
  restaurantId: string;
  name: string;
  address: string;
  city: string;
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
  activeReservationId?: string;
}

export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'drinks' | 'specials';

export interface LocalizedString {
  es: string;
  en: string;
  pt: string;
  ja: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: LocalizedString;
  description: LocalizedString;
  category: MenuCategory;
  basePriceUSD: number;
  prepTimeMinutes: number;
  available: boolean;
  image: string;
  dietary?: string[];
  popular?: boolean;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export interface Reservation {
  id: string;
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
export type PaymentStatus = 'pending' | 'paid';

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
  paymentStatus: PaymentStatus;
  paymentMethod?: 'card' | 'cash' | 'qr_transfer';
  createdAt: string;
  updatedAt: string;
  estimatedReadyMinutes?: number;
  customerName?: string;
}

export interface Notification {
  id: string;
  type: 'reservation' | 'order' | 'kitchen' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  metadata?: Record<string, any>;
}

export type ServiceName =
  | 'auth-service'
  | 'restaurant-service'
  | 'reservation-service'
  | 'order-service'
  | 'kitchen-service'
  | 'notification-service'
  | 'analytics-service';

export type EventType =
  | 'USER_ROLE_CHANGED'
  | 'RESERVATION_CREATED'
  | 'RESERVATION_CONFIRMED'
  | 'RESERVATION_CANCELLED'
  | 'ORDER_PLACED'
  | 'ORDER_RECEIVED_BY_KITCHEN'
  | 'ORDER_PREPARATION_STARTED'
  | 'ORDER_READY_FOR_PICKUP'
  | 'ORDER_DELIVERED'
  | 'PRODUCT_AVAILABILITY_CHANGED'
  | 'TABLE_STATUS_CHANGED'
  | 'PAYMENT_PROCESSED'
  | 'METRICS_AGGREGATED';

export type EventStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface DistributedEvent {
  id: string;
  timestamp: string;
  sourceService: ServiceName;
  targetService: ServiceName | 'event-bus' | 'broadcast';
  eventType: EventType;
  payload: Record<string, any>;
  status: EventStatus;
  attempts: number;
  maxAttempts: number;
  idempotencyKey: string;
  errorDetails?: string;
  latencyMs?: number;
}

export interface ServiceHealth {
  id: ServiceName;
  name: string;
  description: string;
  status: 'healthy' | 'degraded' | 'down';
  uptimePercent: number;
  processedEventsCount: number;
  failedEventsCount: number;
  avgLatencyMs: number;
}
