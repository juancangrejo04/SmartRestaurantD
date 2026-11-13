export type CountryCode = 'CO' | 'BR' | 'US' | 'FR' | 'JP';

export type Language = 'es' | 'pt' | 'en' | 'fr' | 'ja';

export type CurrencyCode = 'COP' | 'BRL' | 'USD' | 'EUR' | 'JPY';

export type UserRole =
  | 'customer'
  | 'owner'
  | 'branch_admin'
  | 'admin'
  | 'waiter'
  | 'kitchen'
  | 'courier'
  | 'cashier'
  | 'platform_admin';

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  city?: string;
  branchId?: string;
  assignedRestaurantId?: string;
  assignedBranchId?: string;
  assignedBranchIds?: string[];
  country: CountryCode;
  language?: Language;
  preferredLanguage?: Language;
  timeZone?: string;
  homeRegion?: CountryCode;
  status?: 'active' | 'pending' | 'inactive';
  passwordHash?: string;
  passwordSalt?: string;
  mustChangePasswordOnLogin?: boolean;
  mustChangePasswordOnFirstLogin?: boolean;
  createdAtUtc?: string;
  consentAcceptedAtUtc?: string;
  consentVersion?: string;
  // Courier specific fields
  isOnline?: boolean;
  currentLocation?: { lat: number; lng: number; latitude?: number; longitude?: number };
  activeDeliveriesCount?: number;
  completedDeliveriesCount?: number;
  courierRating?: number;
  vehicleType?: 'bicycle' | 'motorcycle' | 'car' | 'electric_scooter';
  earningsMinorUnits?: number;
}

export type MeasurementSystem = 'metric' | 'imperial';
export type FirstDayOfWeek = 0 | 1; // 0 = Sunday, 1 = Monday
export type ClockFormat = '12h' | '24h';
export type NameOrder = 'given_family' | 'family_given';

export interface AddressField {
  key: string;
  labelKey: string;
  required: boolean;
  type?: 'text' | 'select';
  options?: { value: string; labelKey: string }[];
  placeholderKey?: string;
  regex?: string;
}

export interface TaxRule {
  id: string;
  appliesTo: 'prepared_food' | 'alcohol' | 'packaged_food' | 'delivery_fee';
  orderType: 'dine_in' | 'delivery' | 'takeaway' | '*';
  jurisdiction?: string;
  rateBps: number; // basis points, e.g. 800 for 8%, 1900 for 19%
  labelKey: string;
  source: string;
  verifiedAt: string | null;
}

export interface TipPolicy {
  mode: 'voluntary' | 'optional' | 'prompted' | 'included' | 'none';
  suggestionsBps: number[]; // e.g. [1500, 1800, 2000, 2500] for 15%, 18%, 20%, 25%
  defaultBps: number;
  showWidget: boolean;
}

export interface ReceiptConfig {
  documentTypeKey: string;
  officialAuthority: string;
  fiscalNumberLabelKey: string;
  requiresFiscalIdOnReceipt: boolean;
  electronicInvoiceSystem: string;
  footerLegalTextKey: string;
}

export interface PaymentMethodConfig {
  id: string;
  labelKey: string;
  iconName: string;
  kind: 'card' | 'wallet' | 'bank_transfer' | 'cash' | 'voucher';
  isElectronic: boolean;
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  nameKey: string;
  isNational: boolean;
}

export interface DataResidencyConfig {
  dataRegion: string;
  applicableLaw: string;
  legalBasis: string;
  retentionMonths: number;
}

export interface RegionRevenueModel {
  platformCommissionBps: number; // e.g. 1500 = 15%
  baseDeliveryFeeMinorUnits: number; // in minor units (e.g. 5000 COP, 490 USD cents)
  sponsoredListingFeeMinorUnits?: number; // monthly advertising/sponsored slot fee in local minor units
}

export interface RegionProfile {
  code: CountryCode;
  nameKey: string;
  nativeName: string;
  pilotCity: string;
  pilotCityKey: string;
  flagEmoji: string;
  defaultLanguage: Language;
  supportedLanguages: Language[];
  currency: CurrencyCode;
  currencySymbol: string;
  currencySymbolOverride?: string;
  symbolPosition: 'before' | 'after';
  symbolSpacing: boolean; // whether there is a space between symbol and number
  fractionDigits: number; // 0 for COP/JPY, 2 for BRL/USD/EUR
  thousandSeparator: string; // '.', ',', '\u202F' (narrow no-break space)
  decimalSeparator: string; // ',', '.'
  dateFormatPattern: 'dd/mm/aaaa' | 'mm/dd/aaaa' | 'aaaa/mm/dd';
  clockFormat: ClockFormat;
  timeZone: string;
  hasDaylightSaving: boolean;
  firstDayOfWeek: FirstDayOfWeek;
  measurementSystem: MeasurementSystem;
  distanceUnit: 'km' | 'mi';
  phonePrefix: string;
  phoneFormatPlaceholder: string;
  phoneRegex: string;
  postalCodeMask: string;
  postalCodeRegex: string;
  nameOrder: NameOrder;
  addressFields: AddressField[];
  taxRules: TaxRule[];
  tipPolicy: TipPolicy;
  receipt: ReceiptConfig;
  paymentMethods: PaymentMethodConfig[];
  holidays: Holiday[];
  dataResidency: DataResidencyConfig;
  domain: string;
  revenueModel: RegionRevenueModel;
  ui: {
    showTipWidget: boolean;
    serviceIncludedNotice: boolean;
    addressInLocalOrder: boolean;
  };
}

export interface Money {
  amount: number; // strictly integer in minor units (cents or zero-decimal currency units)
  currency: CurrencyCode;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  tagline: Record<Language, string>;
  cuisine: Record<Language, string>;
  description: Record<Language, string>;
  story?: Record<Language, string>;
  operatingCountries: CountryCode[];
  rating: number;
  reviewCount: number;
  priceRange: '$$' | '$$$' | '$$$$';
  heroImage: string;
  gallery?: string[];
  logo?: string;
  contactEmail: string;
  phone: string;
  country?: CountryCode;
  countryCode?: CountryCode;
}

export interface Branch {
  id: string;
  restaurantId: string;
  name: string;
  localizedName?: Record<Language, string>;
  city: string;
  localizedCity?: Record<Language, string>;
  neighborhood?: string;
  address: string;
  country: CountryCode;
  phone: string;
  openingHours: string;
  totalTables: number;
  active: boolean;
  heroImage?: string;
  photo?: string;
  currency: CurrencyCode;
  timeZone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  deliveryRadiusKmOrMi: number;
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
  activeCallWaiter?: boolean;
  waiterCallReason?: string;
  waiterCallTimestamp?: string;
  currentGuestsCount?: number;
  billRequested?: boolean;
}

export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'drinks' | 'specials';

export interface MenuItem {
  id: string;
  restaurantId: string;
  branchId?: string;
  countryCode: CountryCode;
  name: Record<Language, string>;
  description: Record<Language, string>;
  category: MenuCategory;
  priceMinorUnits: number; // INTEGER in minor units (cents for USD/BRL/EUR, whole units for COP/JPY)
  pricesByCountry?: Partial<Record<CountryCode, number>>;
  price?: number; // legacy alias
  basePriceUSD?: number; // legacy alias
  isLunchOfTheDay?: boolean;
  prepTimeMinutes: number;
  available: boolean;
  image: string;
  imageAlt?: Record<Language, string>;
  fallbackEmoji?: string;
  fallbackGradient?: string;
  dietary?: ('vegetarian' | 'vegan' | 'gluten_free' | 'spicy' | 'chef_special')[];
  popular?: boolean;
}

export interface ReviewReply {
  text: Record<Language, string> | string;
  repliedAt?: string;
  createdAt?: string;
  repliedBy?: string;
  userRole?: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  branchId: string;
  orderId?: string;
  reservationId?: string;
  userId?: string;
  userName?: string;
  customerName?: string; // legacy alias
  customerEmail?: string; // legacy alias
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: Record<Language, string> | string;
  dishesRating?: { menuItemId: string; dishName: string; rating: number }[];
  dishRatings?: { menuItemId: string; dishName: string; rating: number }[];
  reply?: ReviewReply;
  status?: 'approved' | 'hidden';
  hidden?: boolean;
  originalLanguage?: Language;
  createdAt: string;
}

export interface CartItem {
  menuItemId: string;
  name: Record<Language, string> | string;
  quantity: number;
  unitPriceMinorUnits: number;
  subtotalMinorUnits: number;
  image?: string;
}

export interface DeliveryCart {
  branchId: string;
  restaurantId: string;
  items: CartItem[];
}

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'rejected'
  | 'completed'
  | 'no_show';

export interface Reservation {
  id: string;
  code: string;
  branchId: string;
  restaurantId: string;
  userId?: string;
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
  name: string; // localized name at time of order
  quantity: number;
  unitPriceMinorUnits?: number; // integer
  subtotalMinorUnits?: number; // integer
  unitPrice?: number; // legacy alias
  subtotal?: number; // legacy alias
  price?: number; // fallback alias
  notes?: string;
}

export type OrderType = 'dine_in' | 'delivery' | 'takeaway';
export type OrderStatus = 'created' | 'received' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'paid' | 'refunded';

export interface DeliveryAddress {
  streetLine: string;
  suiteOrApt?: string;
  neighborhood?: string;
  city: string;
  stateOrPrefecture?: string;
  postalCode: string;
  country: CountryCode;
}

export interface TaxBreakdownItem {
  id: string;
  labelKey: string;
  rateBps: number;
  amountMinorUnits: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  branchId: string;
  restaurantId: string;
  userId?: string;
  orderType?: OrderType;
  tableId?: string;
  tableNumber?: number;
  deliveryAddress?: DeliveryAddress;
  courierId?: string;
  courierName?: string;
  deliveryPin?: string; // 4-digit verification code
  fiscalNumber?: string; // Regional electronic invoice CUFE / NF-e / receipt code
  taxBreakdown?: TaxBreakdownItem[];
  items: OrderItem[];
  subtotalMinorUnits?: number;
  taxAmountMinorUnits?: number;
  tipAmountMinorUnits?: number;
  deliveryFeeMinorUnits?: number;
  totalMinorUnits?: number;
  subtotal?: number; // legacy alias
  taxRate?: number;
  taxAmount?: number; // legacy alias
  tipAmount?: number; // legacy alias
  total?: number; // legacy alias
  currency: CurrencyCode;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus?: PaymentStatus;
  billRequested?: boolean;
  createdAt: string;
  updatedAt: string;
  estimatedReadyMinutes?: number;
  preparationTimeMinutes?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  kitchenNotes?: string;
  cancellationReason?: string;
  dishStatuses?: Record<string, 'queued' | 'preparing' | 'ready' | 'served'>;
  commerceRating?: { rating: number; comment?: string; ratedAt: string };
  courierRating?: { rating: number; comment?: string; ratedAt: string };
}

export interface AppNotification {
  id: string;
  type: 'reservation' | 'order' | 'kitchen' | 'system';
  titleKey?: string;
  messageKey?: string;
  messageParams?: Record<string, string | number>;
  title?: string; // legacy alias
  message?: string; // legacy alias
  timestamp: string;
  instantUtc?: string;
  read: boolean;
  targetRole?: UserRole;
  targetBranchId?: string;
  targetUserId?: string;
  metadata?: Record<string, unknown>;
}

export type Notification = AppNotification;

export interface CountryConfig {
  code: CountryCode;
  name: string;
  nativeName: string;
  language: Language;
  currency: CurrencyCode;
  symbol: string;
  flagEmoji: string;
  timeZone: string;
  taxRate: number;
  taxName: string;
  locale: string;
  hasDecimals: boolean;
  ratePerUSD: number;
  profile: RegionProfile;
}

export type ServiceName =
  | 'auth-service'
  | 'restaurant-service'
  | 'reservation-service'
  | 'order-service'
  | 'kitchen-service'
  | 'dispatch-service'
  | 'payments-service'
  | 'billing-service'
  | 'notification-service'
  | 'fx-service'
  | 'analytics-service';

export type ServiceStatus = 'up' | 'healthy' | 'degraded' | 'down';

export interface ServiceHealth {
  id?: ServiceName;
  service?: ServiceName; // legacy alias
  name?: string; // legacy alias
  description?: string; // legacy alias
  nameKey?: string;
  descriptionKey?: string;
  status: ServiceStatus;
  latencyMs?: number;
  processedCount?: number;
  processedEventsCount?: number; // legacy alias
  failedCount?: number;
  failedEventsCount?: number; // legacy alias
  uptimePercent?: number;
}

export type EventType =
  | 'USER_LOGGED_IN'
  | 'USER_LOGGED_OUT'
  | 'PRODUCT_AVAILABILITY_CHANGED'
  | 'RESTAURANT_UPDATED'
  | 'CATALOG_CACHE_INVALIDATED'
  | 'REGION_PROFILE_UPDATED'
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
  | 'ORDER_COURIER_ASSIGNED'
  | 'ORDER_DELIVERING'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'ORDER_BILL_REQUESTED'
  | 'ORDER_STATUS_CHANGED'
  | 'COURIER_ASSIGNED'
  | 'DISPATCH_RELEASE_LEASE'
  | 'PAYMENT_PROCESSED'
  | 'PAYMENT_AUTHORIZE_REQUEST'
  | 'PAYMENT_AUTHORIZED'
  | 'PAYMENT_CAPTURE_REQUEST'
  | 'PAYMENT_CAPTURED'
  | 'PAYMENT_VOID_REQUEST'
  | 'PAYMENT_REFUND_REQUEST'
  | 'PAYMENT_REFUNDED'
  | 'INVOICE_GENERATED'
  | 'SAGA_COMPENSATED'
  | 'DATA_ERASURE_REQUESTED'
  | 'FX_RATES_UPDATED'
  | 'NODE_FAILOVER_PROMOTED'
  | 'NODE_PRIMARY_RESTORED'
  | 'REPLICA_SYNC_COMPLETED'
  | 'AUDIT_RECORD'
  | 'REVIEW_CREATED'
  | 'REVIEW_REPLIED'
  | 'WAITER_CALLED'
  | 'WAITER_CALL_RESOLVED'
  | 'TABLE_OPENED'
  | 'TABLE_CLEARED'
  | 'METRICS_AGGREGATED';

export type EventStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface EventAttemptRecord {
  attempt: number;
  status: EventStatus;
  timestampUtc: string;
  backoffMs?: number;
  detail?: string;
}

export interface DistributedEvent {
  id: string;
  type: EventType;
  eventType?: EventType; // legacy alias
  version?: string;
  region?: CountryCode;
  traceId?: string;
  lamport?: number;
  lamportClock?: number;
  payload: Record<string, any>;
  timestamp: string;
  createdAtUtc?: string;
  processedAtUtc?: string;
  sourceService: ServiceName;
  targetService: ServiceName | 'broadcast' | 'event-bus';
  status: EventStatus;
  attempts: number;
  maxAttempts: number;
  idempotencyKey: string;
  correlationId: string;
  headers?: {
    locale: Language;
    timeZone: string;
  };
  attemptHistory?: EventAttemptRecord[];
  error?: string;
  errorDetails?: string; // legacy alias
  latencyMs?: number;
  processedAt?: string; // legacy alias
  isDuplicateIgnored?: boolean; // legacy alias
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

export interface RegionalNodeState {
  nodeId: string; // e.g. 'node-co'
  country: CountryCode;
  partitionKey: string; // e.g. 'smartrestaurant_v4_partition_CO'
  replicaPartitionKey: string;
  primaryStatus: 'up' | 'down';
  replicaStatus: 'up' | 'down';
  activeLeader: 'primary' | 'replica';
  term: number;
  replicationLagMs: number;
  pendingReplicationCount: number;
  lastHeartbeatUtc: string;
  lastReplicationUtc: string;
  ntpOffsetMs: number;
  writesCount: number;
}

export interface NameDirectoryEntry {
  service: ServiceName;
  region: CountryCode;
  logicalName: string; // e.g. 'payments-service.CO'
  endpoint: string; // e.g. 'payments.co.smartrestaurant.co:8443'
  protocol: string;
  ttlSeconds: number;
  resolvedAtUtc: string;
  expiresAtMs: number;
  leaderTarget: 'primary' | 'replica';
  fromCache: boolean;
}

export interface FailureTestResult {
  id: string;
  testKey: string;
  region: CountryCode;
  startedAtUtc: string;
  completedAtUtc: string;
  passed: boolean;
  stepsLog: string[];
  summary: string;
}

export interface SimulatedCountryDraft {
  code: string; // e.g. 'DE'
  name: Record<Language, string>;
  currency: string;
  timeZone: string;
  enabled: boolean;
  registeredAtUtc: string;
}

export interface CustomRole {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  permissions: string[];
  createdBy: string;
  branchId?: string;
  createdAtUtc: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action:
    | 'USER_CREATED'
    | 'USER_UPDATED'
    | 'USER_DEACTIVATED'
    | 'USER_REACTIVATED'
    | 'USER_PASSWORD_RESET'
    | 'USER_DELETED'
    | 'ROLE_CREATED'
    | 'COMMERCE_APPROVED'
    | 'COURIER_APPROVED'
    | 'DATA_EXPORTED'
    | 'DATA_ERASURE_REQUESTED'
    | 'AUTH_LOGIN'
    | 'AUTH_LOGOUT'
    | 'AUTH_FAILED';
  targetId?: string;
  targetName?: string;
  details: string;
  timestampUtc: string;
  region?: CountryCode;
}

export interface DispatchOffer {
  id: string;
  orderId: string;
  courierId: string;
  courierName?: string;
  branchId?: string;
  distanceKmOrMi?: number;
  distanceKm?: number;
  score?: number;
  earningsMinorUnits?: number;
  expiresAtUtc?: string;
  expiresAt?: string;
  createdAt?: string;
  status: 'offered' | 'accepted' | 'rejected' | 'expired' | 'pending';
}

export type SagaStepName =
  | 'ORDER_CREATED'
  | 'PAYMENT_AUTHORIZED'
  | 'COMMERCE_CONFIRMED'
  | 'COURIER_ASSIGNED'
  | 'PAYMENT_CAPTURED'
  | 'COMPENSATED'
  | 'create_order'
  | 'authorize_payment'
  | 'confirm_commerce'
  | 'assign_courier'
  | 'capture_payment'
  | 'completed';

export interface SagaStep {
  name?: SagaStepName;
  stepName?: SagaStepName | string;
  status: 'pending' | 'completed' | 'failed' | 'compensated' | 'executing';
  timestampUtc?: string;
  completedAt?: string;
  idempotencyKey?: string;
  error?: string;
}

export interface OrderSagaRecord {
  id?: string;
  orderId: string;
  currentStep: SagaStepName | string;
  status: 'running' | 'completed' | 'failed' | 'compensated' | 'executing' | 'compensating';
  steps: SagaStep[];
  startedAtUtc?: string;
  completedAtUtc?: string;
  createdAt?: string;
  updatedAt?: string;
  failureReason?: string;
}

