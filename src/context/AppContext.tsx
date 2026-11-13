import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import {
  CountryCode,
  Language,
  User,
  Restaurant,
  Branch,
  Table,
  TableStatus,
  TableZone,
  MenuItem,
  Reservation,
  ReservationStatus,
  Order,
  OrderStatus,
  OrderItem,
  Notification,
  DistributedEvent,
  ServiceHealth,
  ServiceName,
  ServiceStatus,
  Review,
  RegionProfile,
  DeliveryCart,
  DeliveryAddress,
} from '../types';
import {
  INITIAL_RESTAURANTS,
  INITIAL_BRANCHES,
  INITIAL_TABLES,
  INITIAL_MENU_ITEMS,
  INITIAL_RESERVATIONS,
  INITIAL_ORDERS,
  INITIAL_SERVICES,
  INITIAL_EVENTS,
  INITIAL_REVIEWS,
  INITIAL_SERVICE_HEALTH,
} from '../data/seedData';
import {
  COUNTRIES,
  formatDishPrice,
  formatRegionalDateTime,
  getBranchName,
  getBranchCity,
} from '../i18n/countries';
import { getTranslation, loc } from '../i18n/translations';
import {
  getRegionProfile,
  subscribeRegionProfiles,
  resetStoredRegionProfiles,
} from '../data/regions';
import { broker } from '../core/broker';
import { regionNodes } from '../core/regionNodes';
import { distributedClock } from '../core/clock';
import { initAllSubsystems } from '../services/subsystemRegistry';
import { fxService } from '../services/fxService';
import { authService, LoginResult } from '../services/authService';
import { restaurantService } from '../services/restaurantService';
import { reservationService } from '../services/reservationService';
import { orderService } from '../services/orderService';
import { kitchenService } from '../services/kitchenService';
import { notificationService, KeyedNotificationParams } from '../services/notificationService';
import { orderSagaService } from '../services/orderSagaService';
import { paymentGatewayService } from '../services/paymentGatewayService';
import { dispatchService } from '../services/dispatchService';
import { StoredSession } from '../core/security';

initAllSubsystems();

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface PlaceDeliveryOrderParams {
  branch: Branch;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  deliveryCoords?: { latitude: number; longitude: number };
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  tipBps?: number;
  paymentMethod: string;
  kitchenNotes?: string;
  simulatePaymentFailure?: boolean;
}

interface AppContextType {
  country: CountryCode;
  setCountry: (c: CountryCode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  profile: RegionProfile;
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  refreshUsers: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<LoginResult>;
  registerCustomerAccount: (params: {
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    password: string;
    country: CountryCode;
    preferredLanguage: Language;
    consentAccepted: boolean;
  }) => Promise<{ user: User; session: StoredSession }>;
  updateCurrentUser: (user: User | null) => void;
  refreshAuthFromSession: () => void;
  logoutUser: () => void;
  activeBranchId: string;
  setActiveBranchId: (id: string) => void;
  restaurants: Restaurant[];
  branches: Branch[];
  tables: Table[];
  menuItems: MenuItem[];
  reservations: Reservation[];
  orders: Order[];
  reviews: Review[];
  notifications: Notification[];
  events: DistributedEvent[];
  servicesHealth: ServiceHealth[];
  toasts: ToastState[];
  deliveryCart: DeliveryCart | null;
  addToDeliveryCart: (
    branch: Branch,
    item: MenuItem,
    quantity?: number,
    forceReplace?: boolean
  ) => { ok: boolean; conflict?: boolean };
  updateDeliveryCartQty: (menuItemId: string, quantity: number) => void;
  removeFromDeliveryCart: (menuItemId: string) => void;
  clearDeliveryCart: () => void;
  isDemoRunning: boolean;
  demoStep: number;
  demoStepMessage: string;
  // Tables & Waiter
  addTable: (capacity: number, zone: TableZone) => void;
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  openTable: (tableId: string, guestsCount?: number) => void;
  clearTable: (tableId: string) => void;
  callWaiter: (tableId: string, reason?: string) => void;
  resolveWaiterCall: (tableId: string) => void;
  requestBill: (tableId: string) => void;
  // Reservations
  createReservation: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    date: string;
    time: string;
    guestsCount: number;
    tableId: string;
    notes?: string;
  }) => { success: boolean; error?: string; reservation?: Reservation };
  updateReservationStatus: (reservationId: string, status: ReservationStatus) => void;
  // Orders & Delivery & Kitchen
  createOrder: (
    tableId: string,
    items: OrderItem[],
    tipPercent?: number,
    customerName?: string,
    specialInstructions?: string
  ) => Promise<Order>;
  placeDeliveryOrder: (
    params: PlaceDeliveryOrderParams
  ) => Promise<{ success: boolean; order: Order; errorKey?: string }>;
  acceptDeliveryOrder: (orderId: string, prepMinutes: number) => void;
  rejectDeliveryOrder: (orderId: string, reason: string) => Promise<void>;
  advanceKitchenOrder: (orderId: string) => void;
  advanceDishStatus: (
    orderId: string,
    dishKey: string,
    nextStatus: 'queued' | 'preparing' | 'ready' | 'served'
  ) => void;
  assignCourierToOrder: (orderId: string, courierId: string, courierName: string) => void;
  updateDeliveryOrderStatus: (orderId: string, status: OrderStatus) => void;
  completeDeliveryWithPin: (
    orderId: string,
    pin: string,
    courierId: string
  ) => { success: boolean; errorKey?: string };
  cancelOrderWithCompensation: (orderId: string, reason: string) => Promise<void>;
  markOrderBillPaid: (orderId: string, method: string) => void;
  submitOrderRatings: (
    orderId: string,
    params: {
      commerceRating?: { rating: number; comment?: string };
      courierRating?: { rating: number; comment?: string };
    }
  ) => boolean;
  // Reviews
  addReview: (reviewData: {
    branchId: string;
    restaurantId: string;
    customerName: string;
    customerEmail: string;
    rating: number;
    comment: string;
    orderId?: string;
    reservationId?: string;
    dishesRating?: { menuItemId: string; dishName: string; rating: number }[];
  }) => Review;
  replyReview: (reviewId: string, replyText: string) => void;
  toggleHideReview: (reviewId: string) => void;
  // Menu
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemAvailability: (id: string) => void;
  // Notifications & Chaos
  pushKeyedNotification: (params: KeyedNotificationParams) => void;
  markNotificationsRead: () => void;
  toggleServiceHealth: (serviceId: ServiceName) => void;
  retryFailedEvents: () => Promise<void>;
  clearEvents: () => void;
  appendOrders: (newOrders: Order[]) => void;
  runFullDistributedDemo: () => Promise<void>;
  resetToFactoryDefaults: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  // Helpers
  t: (key: string, params?: Record<string, string | number>) => string;
  loc: (record: Record<Language, string> | string | undefined | null) => string;
  formatPrice: (
    itemOrAmount?:
      | number
      | MenuItem
      | {
          basePriceUSD?: number;
          price?: number;
          priceMinorUnits?: number;
          pricesByCountry?: Partial<Record<CountryCode, number>>;
          country?: CountryCode;
          countryCode?: CountryCode;
        }
      | null,
    overrideCountry?: CountryCode
  ) => string;
  formatDate: (iso: string | Date) => string;
  getBranchDisplayName: (branch?: Branch | null) => string;
  getBranchCityName: (branch?: Branch | null) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'smartrestaurant_v4_';
const VERSION_KEY = 'smartrestaurant_v4_version';
const CURRENT_VERSION = '4.0.0';
const DEFAULT_BRANCH_ID = 'br-aura-co-chapinero';

(function initStorageCheck() {
  try {
    const savedVer = localStorage.getItem(VERSION_KEY);
    if (savedVer !== CURRENT_VERSION) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (
          k &&
          (k.startsWith('smartrestaurant_v1_') ||
            k.startsWith('smartrestaurant_v2_') ||
            k.startsWith('smartrestaurant_v3_') ||
            k.startsWith('smartrestaurant:'))
        ) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }
  } catch (e) {
    console.warn('Storage init check failed:', e);
  }
})();

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const [country, setCountryState] = useState<CountryCode>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}country`) as CountryCode;
    return saved && COUNTRIES[saved] ? saved : 'CO';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}language`) as Language;
    if (saved && ['es', 'en', 'pt', 'fr', 'ja'].includes(saved)) return saved;
    return COUNTRIES[country]?.language || 'es';
  });

  const [users, setUsers] = useState<User[]>(() => authService.getUsers());

  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    return authService.getInitialUser();
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(authService.getInitialUser());
  });

  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}restaurants`);
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANTS;
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}branches`);
    if (!saved) return INITIAL_BRANCHES;
    try {
      const parsed: Branch[] = JSON.parse(saved);
      return parsed.map((b) => {
        const seedMatch = INITIAL_BRANCHES.find((ib: Branch) => ib.id === b.id);
        return seedMatch
          ? {
              ...seedMatch,
              ...b,
              localizedName: seedMatch.localizedName || b.localizedName,
              localizedCity: seedMatch.localizedCity || b.localizedCity,
            }
          : b;
      });
    } catch {
      return INITIAL_BRANCHES;
    }
  });

  const [activeBranchId, setActiveBranchIdState] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}activeBranchId`);
    if (saved && INITIAL_BRANCHES.some((b) => b.id === saved)) {
      return saved;
    }
    return DEFAULT_BRANCH_ID;
  });

  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}tables`);
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}menuItems`);
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}reservations`);
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<DistributedEvent[]>(() => {
    const stored = broker.getStoredEvents();
    return stored.length > 0 ? stored : INITIAL_EVENTS;
  });

  const [servicesHealth, setServicesHealth] = useState<ServiceHealth[]>(() => {
    const brokerHealth = broker.getAllServiceHealth();
    return INITIAL_SERVICE_HEALTH.map((svc) => {
      const id = (svc.id || svc.service) as ServiceName;
      return {
        ...svc,
        status: brokerHealth[id] || svc.status || 'up',
      };
    });
  });

  const [profileVersion, setProfileVersion] = useState(0);

  const [deliveryCart, setDeliveryCart] = useState<DeliveryCart | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}cart`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoStepMessage, setDemoStepMessage] = useState('');

  useEffect(() => {
    const unsubProfiles = subscribeRegionProfiles(() => {
      setProfileVersion((v) => v + 1);
    });
    const unsubEvents = broker.onEventsChange((nextEvents) => {
      setEvents(nextEvents);
    });
    const unsubHealth = broker.onHealthChange((healthMap) => {
      setServicesHealth((prev) =>
        prev.map((svc) => {
          const id = (svc.id || svc.service) as ServiceName;
          return id && healthMap[id] ? { ...svc, status: healthMap[id] } : svc;
        })
      );
    });
    return () => {
      unsubProfiles();
      unsubEvents();
      unsubHealth();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}country`, country);
  }, [country]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}language`, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}isAuthenticated`, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}currentUser`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}restaurants`, JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}branches`, JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}activeBranchId`, activeBranchId);
  }, [activeBranchId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}tables`, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}menuItems`, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}reservations`, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}servicesHealth`, JSON.stringify(servicesHealth));
  }, [servicesHealth]);

  useEffect(() => {
    if (deliveryCart) {
      localStorage.setItem(`${STORAGE_PREFIX}cart`, JSON.stringify(deliveryCart));
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}cart`);
    }
  }, [deliveryCart]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4500);
  }, []);

  const broadcastStateChange = useCallback((patch: Record<string, unknown>) => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'STATE_SYNC',
        payload: patch,
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('smartrestaurant_v4_channel');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'STATE_SYNC') {
          if (payload.tables) setTables(payload.tables);
          if (payload.orders) setOrders(payload.orders);
          if (payload.reservations) setReservations(payload.reservations);
          if (payload.reviews) setReviews(payload.reviews);
          if (payload.notifications) setNotifications(payload.notifications);
          if (payload.users) setUsers(payload.users);
        } else if (type === 'WAITER_CALL') {
          showToast(
            getTranslation(language, 'toast_waiter_call', { table: payload.tableNumber }),
            'warning'
          );
        } else if (type === 'ORDER_READY') {
          showToast(
            getTranslation(language, 'toast_order_ready', { order: payload.orderNumber }),
            'info'
          );
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [language, showToast]);

  const refreshUsers = useCallback(() => {
    const latest = authService.getUsers();
    setUsers(latest);
    if (currentUser) {
      const refreshedMe = latest.find((u) => u.id === currentUser.id);
      if (refreshedMe) {
        setCurrentUserState(refreshedMe);
      }
    }
  }, [currentUser]);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem(`${STORAGE_PREFIX}language`, newLang);
  }, []);

  const setCountry = useCallback(
    (newCountry: CountryCode) => {
      setCountryState(newCountry);
      const newLang = COUNTRIES[newCountry].language;
      setLanguageState(newLang);
      localStorage.setItem(`${STORAGE_PREFIX}country`, newCountry);
      localStorage.setItem(`${STORAGE_PREFIX}language`, newLang);

      const matchBranch = branches.find((b) => b.country === newCountry);
      if (matchBranch) {
        setActiveBranchIdState(matchBranch.id);
        localStorage.setItem(`${STORAGE_PREFIX}activeBranchId`, matchBranch.id);
      }

      showToast(
        getTranslation(newLang, 'toast_market_switched', {
          country: getTranslation(newLang, COUNTRIES[newCountry].profile.nameKey),
          currency: COUNTRIES[newCountry].currency,
        }),
        'info'
      );
    },
    [branches, showToast]
  );

  const setActiveBranchId = useCallback(
    (id: string) => {
      setActiveBranchIdState(id);
      localStorage.setItem(`${STORAGE_PREFIX}activeBranchId`, id);
      const branch = branches.find((b) => b.id === id);
      if (branch) {
        setCountryState(branch.country);
        const branchLang = COUNTRIES[branch.country]?.language || 'es';
        setLanguageState(branchLang);
        localStorage.setItem(`${STORAGE_PREFIX}language`, branchLang);
        localStorage.setItem(`${STORAGE_PREFIX}country`, branch.country);

        if (branch.id !== activeBranchId) {
          const branchName = branch.localizedName?.[branchLang] || branch.name;
          showToast(
            getTranslation(branchLang, 'toast_branch_switched', {
              branch: branchName,
              currency: COUNTRIES[branch.country].currency,
            }),
            'info'
          );
        }
      }
    },
    [activeBranchId, branches, showToast]
  );

  // Real Authenticated Flows
  const loginWithCredentials = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      const res = await authService.login(email, password);
      if (res.success && res.user) {
        setCurrentUserState(res.user);
        setIsAuthenticated(true);
        setUsers(authService.getUsers());

        const userLang = res.user.preferredLanguage || res.user.language || COUNTRIES[res.user.country]?.language || 'es';
        setLanguageState(userLang);
        setCountryState(res.user.country);
        if (res.user.assignedBranchId) {
          setActiveBranchIdState(res.user.assignedBranchId);
        }
      }
      return res;
    },
    []
  );

  const registerCustomerAccount = useCallback(
    async (params: {
      name: string;
      firstName?: string;
      lastName?: string;
      email: string;
      phone: string;
      password: string;
      country: CountryCode;
      preferredLanguage: Language;
      consentAccepted: boolean;
    }): Promise<{ user: User; session: StoredSession }> => {
      const res = await authService.registerCustomer(params);
      setCurrentUserState(res.user);
      setIsAuthenticated(true);
      setUsers(authService.getUsers());
      setLanguageState(params.preferredLanguage);
      setCountryState(params.country);
      return res;
    },
    []
  );

  const updateCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(user);
    setIsAuthenticated(Boolean(user));
    setUsers(authService.getUsers());
  }, []);

  const refreshAuthFromSession = useCallback(() => {
    const user = authService.getInitialUser();
    setCurrentUserState(user);
    setIsAuthenticated(Boolean(user));
    setUsers(authService.getUsers());
  }, []);

  const logoutUser = useCallback(() => {
    authService.logout();
    setCurrentUserState(null);
    setIsAuthenticated(false);
    localStorage.removeItem(`${STORAGE_PREFIX}currentUser`);
    localStorage.removeItem(`${STORAGE_PREFIX}isAuthenticated`);
    showToast(getTranslation(language, 'toast_logged_out'), 'info');
  }, [language, showToast]);

  const pushKeyedNotification = useCallback((params: KeyedNotificationParams) => {
    const notif = notificationService.createKeyedNotification(params);
    setNotifications((prev) => {
      const next = [notif, ...prev];
      broadcastStateChange({ notifications: next });
      return next;
    });
  }, [broadcastStateChange]);

  const updateSingleEvent = useCallback((updated: DistributedEvent) => {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  }, []);

  const recordAndDispatchEvent = useCallback(
    async (
      sourceService: ServiceName,
      targetService: ServiceName | 'event-bus' | 'broadcast',
      eventType: any,
      payload: Record<string, any>
    ) => {
      const region = branches.find((b) => b.id === activeBranchId)?.country || country;
      const envelope = broker.createEventEnvelope({
        sourceService,
        targetService,
        eventType,
        payload,
        region,
      });

      const processed = await broker.dispatchEvent(envelope, servicesHealth, (ev) => {
        updateSingleEvent(ev);
      });

      setServicesHealth((prev) =>
        prev.map((s) => {
          if ((s.id || s.service) === sourceService || (s.id || s.service) === targetService) {
            return {
              ...s,
              processedEventsCount: (s.processedEventsCount || 0) + 1,
              failedEventsCount:
                processed.status === 'failed'
                  ? (s.failedEventsCount || 0) + 1
                  : (s.failedEventsCount || 0),
            };
          }
          return s;
        })
      );

      const notif = notificationService.createFromEvent(processed);
      if (notif) {
        setNotifications((prev) => [notif, ...prev]);
        if (currentUser && currentUser.role !== 'customer' && notif.titleKey) {
          showToast(getTranslation(language, notif.titleKey, notif.messageParams), 'info');
        }
      }

      return processed;
    },
    [activeBranchId, branches, country, currentUser, language, servicesHealth, showToast, updateSingleEvent]
  );

  // DELIVERY CART
  const addToDeliveryCart = useCallback(
    (
      branch: Branch,
      item: MenuItem,
      quantity: number = 1,
      forceReplace: boolean = false
    ): { ok: boolean; conflict?: boolean } => {
      if (deliveryCart && deliveryCart.branchId !== branch.id && deliveryCart.items.length > 0 && !forceReplace) {
        return { ok: false, conflict: true };
      }

      const unitPriceMinorUnits = item.priceMinorUnits ?? Math.round(item.price ?? 0);
      const baseCart: DeliveryCart =
        deliveryCart && deliveryCart.branchId === branch.id && !forceReplace
          ? deliveryCart
          : {
              branchId: branch.id,
              restaurantId: branch.restaurantId,
              items: [],
            };

      const existingIdx = baseCart.items.findIndex((c) => c.menuItemId === item.id);
      let nextItems = [...baseCart.items];
      if (existingIdx >= 0) {
        const cur = nextItems[existingIdx];
        const nextQty = cur.quantity + quantity;
        nextItems[existingIdx] = {
          ...cur,
          quantity: nextQty,
          subtotalMinorUnits: unitPriceMinorUnits * nextQty,
        };
      } else {
        nextItems.push({
          menuItemId: item.id,
          name: item.name,
          quantity,
          unitPriceMinorUnits,
          subtotalMinorUnits: unitPriceMinorUnits * quantity,
          image: item.image,
        });
      }

      setDeliveryCart({ ...baseCart, items: nextItems });
      showToast(getTranslation(language, 'cart_added_toast'), 'success');
      return { ok: true };
    },
    [deliveryCart, language, showToast]
  );

  const updateDeliveryCartQty = useCallback((menuItemId: string, quantity: number) => {
    setDeliveryCart((prev) => {
      if (!prev) return null;
      if (quantity <= 0) {
        const remaining = prev.items.filter((i) => i.menuItemId !== menuItemId);
        return remaining.length > 0 ? { ...prev, items: remaining } : null;
      }
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.menuItemId === menuItemId
            ? { ...i, quantity, subtotalMinorUnits: i.unitPriceMinorUnits * quantity }
            : i
        ),
      };
    });
  }, []);

  const removeFromDeliveryCart = useCallback((menuItemId: string) => {
    setDeliveryCart((prev) => {
      if (!prev) return null;
      const remaining = prev.items.filter((i) => i.menuItemId !== menuItemId);
      return remaining.length > 0 ? { ...prev, items: remaining } : null;
    });
  }, []);

  const clearDeliveryCart = useCallback(() => {
    setDeliveryCart(null);
  }, []);

  // TABLES ACTIONS
  const addTable = useCallback(
    (capacity: number, zone: TableZone) => {
      const newTbl = restaurantService.createNewTable({
        branchId: activeBranchId,
        existingTables: tables,
        capacity,
        zone,
      });
      const nextTables = [...tables, newTbl];
      setTables(nextTables);
      broadcastStateChange({ tables: nextTables });
      showToast(
        getTranslation(language, 'toast_table_created', { table: newTbl.number }),
        'success'
      );

      recordAndDispatchEvent('restaurant-service', 'analytics-service', 'TABLE_STATUS_CHANGED', {
        tableId: newTbl.id,
        number: newTbl.number,
        action: 'CREATED',
        zone,
      });
    },
    [activeBranchId, tables, language, showToast, broadcastStateChange, recordAndDispatchEvent]
  );

  const updateTableStatus = useCallback(
    (tableId: string, status: TableStatus) => {
      const updated = restaurantService.updateTableStatus(tables, tableId, status);
      setTables(updated);
      broadcastStateChange({ tables: updated });
      const tbl = tables.find((item) => item.id === tableId);
      showToast(
        getTranslation(language, 'toast_table_status_updated', { table: tbl?.number || '' }),
        'info'
      );

      recordAndDispatchEvent('restaurant-service', 'order-service', 'TABLE_STATUS_CHANGED', {
        tableId,
        number: tbl?.number,
        newStatus: status,
      });
    },
    [tables, broadcastStateChange, language, showToast, recordAndDispatchEvent]
  );

  const openTable = useCallback(
    (tableId: string, guestsCount: number = 2) => {
      const updated = tables.map((item) =>
        item.id === tableId
          ? { ...item, status: 'occupied' as TableStatus, currentGuestsCount: guestsCount }
          : item
      );
      setTables(updated);
      broadcastStateChange({ tables: updated });
      const tbl = tables.find((item) => item.id === tableId);
      showToast(
        getTranslation(language, 'toast_table_opened', {
          table: tbl?.number || '',
          guests: guestsCount,
        }),
        'success'
      );

      recordAndDispatchEvent('restaurant-service', 'order-service', 'TABLE_OPENED', {
        tableId,
        number: tbl?.number,
        guestsCount,
      });
    },
    [tables, broadcastStateChange, language, showToast, recordAndDispatchEvent]
  );

  const clearTable = useCallback(
    (tableId: string) => {
      const updated = tables.map((item) =>
        item.id === tableId
          ? {
              ...item,
              status: 'available' as TableStatus,
              currentOrderId: undefined,
              currentGuestsCount: undefined,
              activeCallWaiter: false,
              waiterCallReason: undefined,
              waiterCallTimestamp: undefined,
              billRequested: false,
            }
          : item
      );
      setTables(updated);
      broadcastStateChange({ tables: updated });
      const tbl = tables.find((item) => item.id === tableId);
      showToast(
        getTranslation(language, 'toast_table_cleared', { table: tbl?.number || '' }),
        'info'
      );

      recordAndDispatchEvent('restaurant-service', 'order-service', 'TABLE_CLEARED', {
        tableId,
        number: tbl?.number,
      });
    },
    [tables, broadcastStateChange, language, showToast, recordAndDispatchEvent]
  );

  const callWaiter = useCallback(
    (tableId: string, reason?: string) => {
      const nowIso = new Date().toISOString();
      const updated = tables.map((item) =>
        item.id === tableId
          ? {
              ...item,
              activeCallWaiter: true,
              waiterCallReason: reason || getTranslation(language, 'call_waiter'),
              waiterCallTimestamp: nowIso,
            }
          : item
      );
      setTables(updated);
      broadcastStateChange({ tables: updated });
      const tbl = tables.find((item) => item.id === tableId);

      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'WAITER_CALL',
          payload: { tableNumber: tbl?.number || 1, reason },
        });
      }

      pushKeyedNotification({
        type: 'system',
        titleKey: 'notif_waiter_call_title',
        messageKey: 'notif_waiter_call_msg',
        messageParams: { table: tbl?.number || 1 },
        targetBranchId: tbl?.branchId,
        targetRole: 'waiter',
      });

      showToast(
        getTranslation(language, 'toast_waiter_alerted', { table: tbl?.number || '' }),
        'success'
      );
    },
    [tables, broadcastStateChange, language, pushKeyedNotification, showToast]
  );

  const resolveWaiterCall = useCallback(
    (tableId: string) => {
      const updated = tables.map((item) =>
        item.id === tableId
          ? {
              ...item,
              activeCallWaiter: false,
              waiterCallReason: undefined,
              waiterCallTimestamp: undefined,
            }
          : item
      );
      setTables(updated);
      broadcastStateChange({ tables: updated });
      const tbl = tables.find((item) => item.id === tableId);

      recordAndDispatchEvent('restaurant-service', 'notification-service', 'WAITER_CALL_RESOLVED', {
        tableId,
        tableNumber: tbl?.number,
      });

      showToast(
        getTranslation(language, 'toast_waiter_resolved', { table: tbl?.number || '' }),
        'info'
      );
    },
    [tables, broadcastStateChange, language, recordAndDispatchEvent, showToast]
  );

  const requestBill = useCallback(
    (tableId: string) => {
      const tbl = tables.find((item) => item.id === tableId);
      const updatedTables = tables.map((item) =>
        item.id === tableId ? { ...item, billRequested: true } : item
      );
      setTables(updatedTables);

      if (tbl?.currentOrderId) {
        setOrders((prev) =>
          prev.map((o) => (o.id === tbl.currentOrderId ? { ...o, billRequested: true } : o))
        );
      }

      broadcastStateChange({ tables: updatedTables });

      pushKeyedNotification({
        type: 'order',
        titleKey: 'notif_bill_requested_title',
        messageKey: 'notif_bill_requested_msg',
        messageParams: { table: tbl?.number || 1 },
        targetBranchId: tbl?.branchId,
        targetRole: 'waiter',
      });

      showToast(
        getTranslation(language, 'toast_bill_requested', { table: tbl?.number || '' }),
        'success'
      );
    },
    [tables, broadcastStateChange, language, pushKeyedNotification, showToast]
  );

  // RESERVATIONS ACTIONS
  const createReservation = useCallback(
    (data: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      date: string;
      time: string;
      guestsCount: number;
      tableId: string;
      notes?: string;
    }) => {
      const collisionCheck = reservationService.checkTableCollision(
        reservations,
        data.tableId,
        data.date,
        data.time
      );

      if (collisionCheck.hasCollision) {
        return {
          success: false,
          error: getTranslation(language, 'conflict_error_msg', {
            time: collisionCheck.conflictingReservation?.time || '',
          }),
        };
      }

      const table = tables.find((item) => item.id === data.tableId);
      if (!table) {
        return { success: false, error: getTranslation(language, 'error') };
      }

      const branch = branches.find((b) => b.id === table.branchId);

      const newRes = reservationService.createReservation({
        branchId: table.branchId,
        restaurantId: branch?.restaurantId || 'brand-aura',
        userId: currentUser?.id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        date: data.date,
        time: data.time,
        guestsCount: data.guestsCount,
        table,
        notes: data.notes,
      });

      const nextReservations = [newRes, ...reservations];
      setReservations(nextReservations);

      const today = new Date().toISOString().split('T')[0];
      if (data.date === today) {
        const nextTables = tables.map((item) =>
          item.id === table.id && item.status === 'available'
            ? { ...item, status: 'reserved' as TableStatus }
            : item
        );
        setTables(nextTables);
        broadcastStateChange({ reservations: nextReservations, tables: nextTables });
      } else {
        broadcastStateChange({ reservations: nextReservations });
      }

      recordAndDispatchEvent('reservation-service', 'notification-service', 'RESERVATION_CREATED', {
        reservationId: newRes.id,
        code: newRes.code,
        branchId: newRes.branchId,
        userId: newRes.userId,
        customerName: newRes.customerName,
        customerEmail: newRes.customerEmail,
        tableNumber: newRes.tableNumber,
        guestsCount: newRes.guestsCount,
        date: newRes.date,
        time: newRes.time,
      });

      showToast(getTranslation(language, 'reservation_confirmed_title'), 'success');
      return { success: true, reservation: newRes };
    },
    [reservations, tables, branches, currentUser?.id, language, broadcastStateChange, recordAndDispatchEvent, showToast]
  );

  const updateReservationStatus = useCallback(
    (reservationId: string, status: ReservationStatus) => {
      const nextReservations = reservationService.updateStatus(reservations, reservationId, status);
      setReservations(nextReservations);
      broadcastStateChange({ reservations: nextReservations });

      const res = reservations.find((r) => r.id === reservationId);

      recordAndDispatchEvent(
        'reservation-service',
        'notification-service',
        status === 'confirmed' ? 'RESERVATION_CONFIRMED' : 'RESERVATION_CANCELLED',
        {
          reservationId,
          code: res?.code,
          branchId: res?.branchId,
          userId: res?.userId,
          customerName: res?.customerName,
          status,
        }
      );
      showToast(getTranslation(language, 'success'), 'info');
    },
    [reservations, broadcastStateChange, language, recordAndDispatchEvent, showToast]
  );

  // DINE-IN ORDER
  const createOrder = useCallback(
    async (
      tableId: string,
      items: OrderItem[],
      tipPercent: number = 10,
      customerName?: string,
      specialInstructions?: string
    ): Promise<Order> => {
      const table = tables.find((item) => item.id === tableId);
      const branch = branches.find((b) => b.id === (table?.branchId || activeBranchId));
      const branchCountry = branch?.country || country;

      const newOrder = orderService.createOrder({
        branchId: branch?.id || activeBranchId,
        restaurantId: branch?.restaurantId || 'brand-aura',
        userId: currentUser?.id,
        orderType: 'dine_in',
        tableId,
        tableNumber: table?.number || 1,
        items,
        countryCode: branchCountry,
        tipPercentage: tipPercent,
        customerName: customerName || currentUser?.name || 'Guest',
        customerEmail: currentUser?.email,
        kitchenNotes: specialInstructions,
      });

      const nextOrders = [newOrder, ...orders];
      const nextTables = tables.map((item) =>
        item.id === tableId ? { ...item, status: 'occupied' as TableStatus, currentOrderId: newOrder.id } : item
      );

      setOrders(nextOrders);
      setTables(nextTables);
      broadcastStateChange({ orders: nextOrders, tables: nextTables });

      await recordAndDispatchEvent('order-service', 'kitchen-service', 'ORDER_PLACED', {
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        branchId: newOrder.branchId,
        userId: newOrder.userId,
        tableNumber: newOrder.tableNumber,
        itemsCount: newOrder.items.length,
        totalMinorUnits: newOrder.totalMinorUnits,
        currency: newOrder.currency,
      });

      return newOrder;
    },
    [tables, branches, activeBranchId, country, currentUser, orders, broadcastStateChange, recordAndDispatchEvent]
  );

  // DELIVERY ORDER WITH 5-STEP SAGA + REVERSE COMPENSATIONS
  const placeDeliveryOrder = useCallback(
    async (
      params: PlaceDeliveryOrderParams
    ): Promise<{ success: boolean; order: Order; errorKey?: string }> => {
      const order = orderService.createOrder({
        branchId: params.branch.id,
        restaurantId: params.branch.restaurantId,
        userId: currentUser?.id,
        orderType: 'delivery',
        deliveryAddress: params.deliveryAddress,
        items: params.items,
        countryCode: params.branch.country,
        tipBps: params.tipBps,
        paymentMethod: params.paymentMethod,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
        customerEmail: params.customerEmail,
        kitchenNotes: params.kitchenNotes,
      });

      orderSagaService.startSaga(order.id);

      const authRes = await paymentGatewayService.authorizePayment({
        orderId: order.id,
        amountMinorUnits: order.totalMinorUnits ?? 0,
        currency: order.currency,
        paymentMethod: params.paymentMethod,
        simulateFailure: Boolean(params.simulatePaymentFailure),
      });

      if (!authRes.success) {
        await orderSagaService.executeCompensations(
          order.id,
          'authorize_payment',
          authRes.error || 'Payment authorization declined'
        );
        const failedOrder: Order = {
          ...order,
          status: 'cancelled',
          paymentStatus: 'failed',
          cancellationReason: authRes.error || 'Payment declined',
          updatedAt: new Date().toISOString(),
        };
        const nextOrders = [failedOrder, ...orders];
        setOrders(nextOrders);
        broadcastStateChange({ orders: nextOrders });
        return { success: false, order: failedOrder, errorKey: 'checkout_err_payment_declined' };
      }

      orderSagaService.advanceStep(order.id, 'authorize_payment', 'confirm_commerce');

      const paidOrder: Order = {
        ...order,
        status: 'received',
        paymentStatus: 'paid',
        updatedAt: new Date().toISOString(),
      };

      const capRes = await paymentGatewayService.capturePayment(authRes.transaction.id);
      if (!capRes.success) {
        await orderSagaService.executeCompensations(
          order.id,
          'capture_payment',
          capRes.error || 'Payment capture error'
        );
        const compensatedOrder: Order = {
          ...paidOrder,
          status: 'cancelled',
          paymentStatus: 'refunded',
          cancellationReason: capRes.error || 'Payment capture compensated',
          updatedAt: new Date().toISOString(),
        };
        const nextOrders = [compensatedOrder, ...orders];
        setOrders(nextOrders);
        broadcastStateChange({ orders: nextOrders });
        return { success: false, order: compensatedOrder, errorKey: 'checkout_err_payment_declined' };
      }

      const nextOrders = [paidOrder, ...orders];
      setOrders(nextOrders);
      setDeliveryCart(null);
      broadcastStateChange({ orders: nextOrders });

      // Trigger first dispatch offer automatically if couriers are online in region
      const branchCoords = {
        latitude: params.branch.coordinates.lat,
        longitude: params.branch.coordinates.lng,
      };
      const regionCouriers = users.filter(
        (u) => u.role === 'courier' && u.country === params.branch.country
      );
      dispatchService.createDispatchOffer({
        orderId: paidOrder.id,
        branchId: params.branch.id,
        branchCoords,
        deliveryCoords: params.deliveryCoords || branchCoords,
        couriers: regionCouriers,
        earningsMinorUnits: Math.max(100, Math.round((paidOrder.deliveryFeeMinorUnits ?? 0) * 0.85)),
        timeoutSeconds: 20,
      });

      await recordAndDispatchEvent('order-service', 'kitchen-service', 'ORDER_CREATED', {
        orderId: paidOrder.id,
        orderNumber: paidOrder.orderNumber,
        branchId: paidOrder.branchId,
        userId: paidOrder.userId,
        itemsCount: paidOrder.items.length,
        totalMinorUnits: paidOrder.totalMinorUnits,
        currency: paidOrder.currency,
      });

      return { success: true, order: paidOrder };
    },
    [currentUser?.id, orders, users, broadcastStateChange, recordAndDispatchEvent]
  );

  const acceptDeliveryOrder = useCallback(
    (orderId: string, prepMinutes: number) => {
      orderSagaService.advanceStep(orderId, 'confirm_commerce', 'assign_courier');
      const target = orders.find((o) => o.id === orderId);
      const nextOrders = orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'preparing' as OrderStatus,
              estimatedReadyMinutes: prepMinutes,
              preparationTimeMinutes: prepMinutes,
              updatedAt: new Date().toISOString(),
            }
          : o
      );
      setOrders(nextOrders);
      broadcastStateChange({ orders: nextOrders });

      // Ensure dispatch offer exists if not yet assigned
      if (target && !target.courierId) {
        const branch = branches.find((b) => b.id === target.branchId);
        if (branch) {
          const branchCoords = { latitude: branch.coordinates.lat, longitude: branch.coordinates.lng };
          const regionCouriers = users.filter((u) => u.role === 'courier' && u.country === branch.country);
          dispatchService.createDispatchOffer({
            orderId: target.id,
            branchId: branch.id,
            branchCoords,
            deliveryCoords: branchCoords,
            couriers: regionCouriers,
            earningsMinorUnits: Math.max(100, Math.round((target.deliveryFeeMinorUnits ?? 0) * 0.85)),
            timeoutSeconds: 20,
          });
        }
      }

      pushKeyedNotification({
        type: 'kitchen',
        titleKey: 'notif_order_accepted_title',
        messageKey: 'notif_order_accepted_msg',
        messageParams: { order: target?.orderNumber || orderId, minutes: prepMinutes },
        targetUserId: target?.userId,
        targetBranchId: target?.branchId,
      });
    },
    [orders, branches, users, broadcastStateChange, pushKeyedNotification]
  );

  const rejectDeliveryOrder = useCallback(
    async (orderId: string, reason: string) => {
      const target = orders.find((o) => o.id === orderId);
      await orderSagaService.executeCompensations(orderId, 'confirm_commerce', reason);
      await paymentGatewayService.refundPayment({ orderId, reason });

      const nextOrders = orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'cancelled' as OrderStatus,
              paymentStatus: 'refunded' as const,
              cancellationReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : o
      );
      setOrders(nextOrders);
      broadcastStateChange({ orders: nextOrders });

      pushKeyedNotification({
        type: 'order',
        titleKey: 'notif_order_rejected_title',
        messageKey: 'notif_order_rejected_msg',
        messageParams: { order: target?.orderNumber || orderId, reason },
        targetUserId: target?.userId,
        targetBranchId: target?.branchId,
      });
    },
    [orders, broadcastStateChange, pushKeyedNotification]
  );

  const advanceKitchenOrder = useCallback(
    async (orderId: string) => {
      const targetOrder = orders.find((o) => o.id === orderId);
      if (!targetOrder) return;

      const nextStatus = kitchenService.getNextStatus(targetOrder.status);
      if (!nextStatus) return;

      const nextOrders = orderService.updateOrderStatus(orders, orderId, nextStatus);
      setOrders(nextOrders);
      broadcastStateChange({ orders: nextOrders });

      if (nextStatus === 'preparing') {
        await recordAndDispatchEvent('kitchen-service', 'notification-service', 'ORDER_PREPARATION_STARTED', {
          orderId,
          orderNumber: targetOrder.orderNumber,
          branchId: targetOrder.branchId,
          userId: targetOrder.userId,
          tableNumber: targetOrder.tableNumber,
        });
      } else if (nextStatus === 'ready') {
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: 'ORDER_READY',
            payload: { orderNumber: targetOrder.orderNumber, tableNumber: targetOrder.tableNumber },
          });
        }
        await recordAndDispatchEvent('kitchen-service', 'order-service', 'ORDER_READY_FOR_PICKUP', {
          orderId,
          orderNumber: targetOrder.orderNumber,
          branchId: targetOrder.branchId,
          userId: targetOrder.userId,
          tableNumber: targetOrder.tableNumber,
        });
      } else if (nextStatus === 'delivered') {
        await recordAndDispatchEvent('kitchen-service', 'notification-service', 'ORDER_DELIVERED', {
          orderId,
          orderNumber: targetOrder.orderNumber,
          branchId: targetOrder.branchId,
          userId: targetOrder.userId,
          tableNumber: targetOrder.tableNumber,
        });
      }
    },
    [orders, broadcastStateChange, recordAndDispatchEvent]
  );

  const advanceDishStatus = useCallback(
    (orderId: string, dishKey: string, nextStatus: 'queued' | 'preparing' | 'ready' | 'served') => {
      const nextOrders = orderService.updateDishStatus(orders, orderId, dishKey, nextStatus);
      setOrders(nextOrders);
      broadcastStateChange({ orders: nextOrders });
    },
    [orders, broadcastStateChange]
  );

  const assignCourierToOrder = useCallback(
    (orderId: string, courierId: string, courierName: string) => {
      const target = orders.find((o) => o.id === orderId);
      orderSagaService.advanceStep(orderId, 'assign_courier', 'capture_payment');
      orderSagaService.advanceStep(orderId, 'capture_payment');

      const nextOrders = orderService.assignCourier(orders, orderId, courierId, courierName);
      setOrders(nextOrders);

      const courier = users.find((u) => u.id === courierId);
      if (courier) {
        authService.updateCourierState(courierId, {
          activeDeliveriesCount: (courier.activeDeliveriesCount || 0) + 1,
        });
        setUsers(authService.getUsers());
      }

      broadcastStateChange({ orders: nextOrders });

      pushKeyedNotification({
        type: 'order',
        titleKey: 'notif_courier_assigned_title',
        messageKey: 'notif_courier_assigned_msg',
        messageParams: { order: target?.orderNumber || orderId, courier: courierName },
        targetUserId: target?.userId,
        targetBranchId: target?.branchId,
      });
    },
    [orders, users, broadcastStateChange, pushKeyedNotification]
  );

  const updateDeliveryOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      const target = orders.find((o) => o.id === orderId);
      const nextOrders = orderService.updateOrderStatus(orders, orderId, status);
      setOrders(nextOrders);
      broadcastStateChange({ orders: nextOrders });

      if (status === 'delivering' && target) {
        pushKeyedNotification({
          type: 'order',
          titleKey: 'notif_order_delivering_title',
          messageKey: 'notif_order_delivering_msg',
          messageParams: { order: target.orderNumber },
          targetUserId: target.userId,
          targetBranchId: target.branchId,
        });
      }
    },
    [orders, broadcastStateChange, pushKeyedNotification]
  );

  const completeDeliveryWithPin = useCallback(
    (orderId: string, pin: string, courierId: string): { success: boolean; errorKey?: string } => {
      const target = orders.find((o) => o.id === orderId);
      if (!target) return { success: false, errorKey: 'error' };
      if (target.deliveryPin && pin.trim() !== target.deliveryPin.trim()) {
        return { success: false, errorKey: 'courier_pin_mismatch' };
      }

      const nextOrders = orderService.updateOrderStatus(orders, orderId, 'delivered');
      setOrders(nextOrders);

      dispatchService.releaseLease(orderId, courierId);
      const courier = users.find((u) => u.id === courierId);
      if (courier) {
        const fee = Math.max(100, Math.round((target.deliveryFeeMinorUnits ?? 0) * 0.85));
        const updatedCourier = authService.updateCourierState(courierId, {
          activeDeliveriesCount: Math.max(0, (courier.activeDeliveriesCount || 1) - 1),
          completedDeliveriesCount: (courier.completedDeliveriesCount || 0) + 1,
          earningsMinorUnits: (courier.earningsMinorUnits || 0) + fee,
        });
        if (updatedCourier && currentUser?.id === courierId) {
          setCurrentUserState(updatedCourier);
        }
        setUsers(authService.getUsers());
      }

      broadcastStateChange({ orders: nextOrders });

      pushKeyedNotification({
        type: 'order',
        titleKey: 'notif_order_delivered_title',
        messageKey: 'notif_order_delivered_msg',
        messageParams: { order: target.orderNumber },
        targetUserId: target.userId,
        targetBranchId: target.branchId,
      });

      return { success: true };
    },
    [orders, users, currentUser?.id, broadcastStateChange, pushKeyedNotification]
  );

  const cancelOrderWithCompensation = useCallback(
    async (orderId: string, reason: string) => {
      const target = orders.find((o) => o.id === orderId);
      await orderSagaService.executeCompensations(orderId, 'confirm_commerce', reason);
      await paymentGatewayService.refundPayment({ orderId, reason });

      const nextOrders = orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'cancelled' as OrderStatus,
              paymentStatus: 'refunded' as const,
              cancellationReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : o
      );
      setOrders(nextOrders);
      broadcastStateChange({ orders: nextOrders });

      pushKeyedNotification({
        type: 'order',
        titleKey: 'notif_order_cancelled_title',
        messageKey: 'notif_order_cancelled_msg',
        messageParams: { order: target?.orderNumber || orderId },
        targetUserId: target?.userId,
        targetBranchId: target?.branchId,
      });
    },
    [orders, broadcastStateChange, pushKeyedNotification]
  );

  const markOrderBillPaid = useCallback(
    (orderId: string, method: string) => {
      const nextOrders = orderService.processPayment(orders, orderId, method);
      setOrders(nextOrders);
      broadcastStateChange({ orders: nextOrders });
      showToast(getTranslation(language, 'success'), 'success');
    },
    [orders, broadcastStateChange, language, showToast]
  );

  const submitOrderRatings = useCallback(
    (
      orderId: string,
      params: {
        commerceRating?: { rating: number; comment?: string };
        courierRating?: { rating: number; comment?: string };
      }
    ): boolean => {
      const target = orders.find((o) => o.id === orderId);
      if (!target) return false;
      if (target.commerceRating && target.courierRating) return false;

      const nextOrders = orderService.submitReview(orders, orderId, params);
      setOrders(nextOrders);

      if (params.commerceRating && !target.commerceRating) {
        const newRev: Review = {
          id: `rev-${Date.now().toString(36)}`,
          branchId: target.branchId,
          restaurantId: target.restaurantId,
          userId: currentUser?.id,
          userName: target.customerName || currentUser?.name || 'Guest',
          customerName: target.customerName || currentUser?.name,
          customerEmail: target.customerEmail || currentUser?.email,
          rating: params.commerceRating.rating,
          comment: params.commerceRating.comment || '',
          orderId: target.id,
          status: 'approved',
          originalLanguage: language,
          createdAt: new Date().toISOString(),
        };
        setReviews((prev) => [newRev, ...prev]);
      }

      if (params.courierRating && target.courierId && !target.courierRating) {
        const courier = users.find((u) => u.id === target.courierId);
        if (courier) {
          const prevCount = courier.completedDeliveriesCount || 1;
          const prevAvg = courier.courierRating || 5.0;
          const nextAvg = Number(
            (((prevAvg * prevCount) + params.courierRating.rating) / (prevCount + 1)).toFixed(2)
          );
          authService.updateCourierState(courier.id, { courierRating: nextAvg });
          setUsers(authService.getUsers());
        }
      }

      broadcastStateChange({ orders: nextOrders });
      showToast(getTranslation(language, 'review_submitted_toast'), 'success');
      return true;
    },
    [orders, currentUser, users, language, broadcastStateChange, showToast]
  );

  // REVIEWS ACTIONS
  const addReview = useCallback(
    (reviewData: {
      branchId: string;
      restaurantId: string;
      customerName: string;
      customerEmail: string;
      rating: number;
      comment: string;
      orderId?: string;
      reservationId?: string;
      dishesRating?: { menuItemId: string; dishName: string; rating: number }[];
    }): Review => {
      const newReview: Review = {
        id: `rev-${Date.now().toString(36)}`,
        branchId: reviewData.branchId,
        restaurantId: reviewData.restaurantId,
        userId: currentUser?.id,
        userName: reviewData.customerName,
        customerName: reviewData.customerName,
        customerEmail: reviewData.customerEmail,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date().toISOString(),
        orderId: reviewData.orderId,
        reservationId: reviewData.reservationId,
        dishesRating: reviewData.dishesRating,
        status: 'approved',
        originalLanguage: language,
      };

      const nextReviews = [newReview, ...reviews];
      setReviews(nextReviews);
      broadcastStateChange({ reviews: nextReviews });

      recordAndDispatchEvent('analytics-service', 'broadcast', 'REVIEW_CREATED', {
        reviewId: newReview.id,
        restaurantId: newReview.restaurantId,
        branchId: newReview.branchId,
        rating: newReview.rating,
        customerName: newReview.customerName,
      });

      showToast(getTranslation(language, 'review_submitted_toast'), 'success');
      return newReview;
    },
    [currentUser?.id, language, reviews, broadcastStateChange, recordAndDispatchEvent, showToast]
  );

  const replyReview = useCallback(
    (reviewId: string, replyText: string) => {
      const nextReviews = reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              reply: {
                text: replyText,
                createdAt: new Date().toISOString(),
                userRole: currentUser?.role || 'branch_admin',
              },
            }
          : r
      );
      setReviews(nextReviews);
      broadcastStateChange({ reviews: nextReviews });
      showToast(getTranslation(language, 'success'), 'success');
    },
    [reviews, currentUser?.role, broadcastStateChange, language, showToast]
  );

  const toggleHideReview = useCallback(
    (reviewId: string) => {
      const nextReviews = reviews.map((r) =>
        r.id === reviewId
          ? { ...r, status: (r.status === 'approved' ? 'hidden' : 'approved') as 'approved' | 'hidden' }
          : r
      );
      setReviews(nextReviews);
      broadcastStateChange({ reviews: nextReviews });
      showToast(getTranslation(language, 'success'), 'info');
    },
    [reviews, broadcastStateChange, language, showToast]
  );

  // MENU ACTIONS
  const addMenuItem = useCallback(
    (item: Omit<MenuItem, 'id'>) => {
      const newItem: MenuItem = {
        ...item,
        id: `menu-item-${Date.now().toString(36)}`,
      };
      setMenuItems((prev) => [newItem, ...prev]);
      showToast(getTranslation(language, 'success'), 'success');
    },
    [language, showToast]
  );

  const updateMenuItem = useCallback(
    (id: string, updates: Partial<MenuItem>) => {
      setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
      showToast(getTranslation(language, 'success'), 'info');
    },
    [language, showToast]
  );

  const deleteMenuItem = useCallback(
    (id: string) => {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      showToast(getTranslation(language, 'success'), 'warning');
    },
    [language, showToast]
  );

  const toggleMenuItemAvailability = useCallback(
    (id: string) => {
      let updatedItem: MenuItem | undefined;
      setMenuItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            updatedItem = { ...item, available: !item.available };
            return updatedItem;
          }
          return item;
        })
      );
      if (updatedItem) {
        recordAndDispatchEvent('restaurant-service', 'broadcast', 'PRODUCT_AVAILABILITY_CHANGED', {
          productId: id,
          branchId: updatedItem.branchId,
          productName: loc(updatedItem.name, language),
          available: updatedItem.available,
        });
        showToast(getTranslation(language, 'success'), 'info');
      }
    },
    [language, recordAndDispatchEvent, showToast]
  );

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => notificationService.markAllAsRead(prev));
  }, []);

  // FAULT TOLERANCE & CHAOS (Private Admin / Staff Monitor)
  const toggleServiceHealth = useCallback(
    (serviceId: ServiceName) => {
      const current = broker.getServiceHealth(serviceId);
      const isCurrentlyUp = current === 'up' || current === 'healthy';
      const nextStatus: ServiceStatus = isCurrentlyUp ? 'down' : 'up';
      broker.setServiceHealth(serviceId, nextStatus);
      setServicesHealth((prev) =>
        prev.map((s) => {
          if ((s.id || s.service) === serviceId) {
            return { ...s, status: nextStatus };
          }
          return s;
        })
      );
      showToast(`${serviceId}: ${nextStatus.toUpperCase()}`, nextStatus === 'down' ? 'error' : 'success');
    },
    [showToast]
  );

  const retryFailedEvents = useCallback(async () => {
    const retried = await broker.retryAllFailed();
    if (retried > 0) {
      showToast(getTranslation(language, 'success'), 'success');
    }
  }, [language, showToast]);

  const clearEvents = useCallback(() => {
    broker.clearQueue();
  }, []);

  const appendOrders = useCallback(
    (newOrders: Order[]) => {
      setOrders((prev) => {
        const merged = [...newOrders, ...prev];
        broadcastStateChange({ orders: merged });
        return merged;
      });
    },
    [broadcastStateChange]
  );

  const runFullDistributedDemo = useCallback(async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setDemoStep(1);
    setDemoStepMessage(getTranslation(language, 'demo_step_1'));

    await new Promise((r) => setTimeout(r, 700));
    setDemoStep(2);
    setDemoStepMessage(getTranslation(language, 'demo_step_2'));

    const demoTable = tables.find((tbl) => tbl.branchId === activeBranchId) || tables[0];
    const branch = branches.find((b) => b.id === activeBranchId);
    const demoRes = reservationService.createReservation({
      branchId: activeBranchId,
      restaurantId: branch?.restaurantId || 'brand-aura',
      customerName: 'Guest Demo',
      customerEmail: 'demo@smartrestaurant.app',
      customerPhone: '+57 312 000 1234',
      date: new Date().toISOString().split('T')[0],
      time: '20:00',
      guestsCount: 4,
      table: demoTable,
    });
    setReservations((prev) => [demoRes, ...prev]);

    await recordAndDispatchEvent('reservation-service', 'notification-service', 'RESERVATION_CREATED', {
      reservationId: demoRes.id,
      branchId: demoRes.branchId,
      customerName: demoRes.customerName,
      tableNumber: demoRes.tableNumber,
      guestsCount: demoRes.guestsCount,
    });

    await new Promise((r) => setTimeout(r, 700));
    setDemoStep(3);
    setDemoStepMessage(getTranslation(language, 'demo_step_3'));

    const demoOrder = orderService.createOrder({
      branchId: activeBranchId,
      restaurantId: branch?.restaurantId || 'brand-aura',
      tableId: demoTable?.id,
      tableNumber: demoTable?.number || 1,
      items: [
        { menuItemId: 'dish-co-aura-01', name: 'Empanadas Bogotanas', quantity: 2, unitPriceMinorUnits: 24000, subtotalMinorUnits: 48000 },
      ],
      countryCode: country,
      tipPercentage: 10,
      customerName: 'Guest Demo',
    });
    setOrders((prev) => [demoOrder, ...prev]);

    await recordAndDispatchEvent('order-service', 'kitchen-service', 'ORDER_CREATED', {
      orderId: demoOrder.id,
      orderNumber: demoOrder.orderNumber,
      branchId: demoOrder.branchId,
      tableNumber: demoOrder.tableNumber,
      itemsCount: 1,
    });

    setDemoStepMessage(getTranslation(language, 'success'));
    setTimeout(() => {
      setIsDemoRunning(false);
      setDemoStep(0);
      setDemoStepMessage('');
    }, 1500);
  }, [isDemoRunning, activeBranchId, tables, branches, country, language, recordAndDispatchEvent]);

  const resetToFactoryDefaults = useCallback(() => {
    localStorage.clear();
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    resetStoredRegionProfiles();
    regionNodes.resetAllNodes();
    distributedClock.resetLamport(100);
    distributedClock.syncAllNtpClocks();
    fxService.resetSnapshot();
    broker.resetBroker();
    setCountryState('CO');
    setLanguageState('es');
    setCurrentUserState(null);
    setIsAuthenticated(false);
    authService.clearUser();
    setUsers(authService.getUsers());
    setRestaurants(INITIAL_RESTAURANTS);
    setBranches(INITIAL_BRANCHES);
    setActiveBranchIdState(DEFAULT_BRANCH_ID);
    setTables(INITIAL_TABLES);
    setMenuItems(INITIAL_MENU_ITEMS);
    setReservations(INITIAL_RESERVATIONS);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setNotifications([]);
    setEvents(INITIAL_EVENTS);
    setServicesHealth(INITIAL_SERVICE_HEALTH);
    setDeliveryCart(null);
    showToast(getTranslation(language, 'success'), 'success');
  }, [language, showToast]);

  void profileVersion;
  const profile = getRegionProfile(country);

  const locHelper = useCallback(
    (record: Record<Language, string> | string | undefined | null): string => {
      return loc(record, language);
    },
    [language]
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      return getTranslation(language, key, params);
    },
    [language]
  );

  const formatPrice = useCallback(
    (
      itemOrAmount?:
        | number
        | MenuItem
        | {
            basePriceUSD?: number;
            price?: number;
            priceMinorUnits?: number;
            pricesByCountry?: Partial<Record<CountryCode, number>>;
            country?: CountryCode;
            countryCode?: CountryCode;
          }
        | null,
      overrideCountry?: CountryCode
    ): string => {
      const targetCountry = overrideCountry || country;
      return formatDishPrice(itemOrAmount, targetCountry);
    },
    [country]
  );

  const formatDate = useCallback(
    (iso: string | Date): string => {
      return formatRegionalDateTime(iso, country);
    },
    [country]
  );

  const getBranchDisplayName = useCallback(
    (branch?: Branch | null): string => {
      return getBranchName(branch, language);
    },
    [language]
  );

  const getBranchCityName = useCallback(
    (branch?: Branch | null): string => {
      return getBranchCity(branch, language);
    },
    [language]
  );

  return (
    <AppContext.Provider
      value={{
        country,
        setCountry,
        language,
        setLanguage,
        profile,
        currentUser,
        isAuthenticated,
        users,
        refreshUsers,
        loginWithCredentials,
        registerCustomerAccount,
        updateCurrentUser,
        refreshAuthFromSession,
        logoutUser,
        activeBranchId,
        setActiveBranchId,
        restaurants,
        branches,
        tables,
        menuItems,
        reservations,
        orders,
        reviews,
        notifications,
        events,
        servicesHealth,
        toasts,
        deliveryCart,
        addToDeliveryCart,
        updateDeliveryCartQty,
        removeFromDeliveryCart,
        clearDeliveryCart,
        isDemoRunning,
        demoStep,
        demoStepMessage,
        addTable,
        updateTableStatus,
        openTable,
        clearTable,
        callWaiter,
        resolveWaiterCall,
        requestBill,
        createReservation,
        updateReservationStatus,
        createOrder,
        placeDeliveryOrder,
        acceptDeliveryOrder,
        rejectDeliveryOrder,
        advanceKitchenOrder,
        advanceDishStatus,
        assignCourierToOrder,
        updateDeliveryOrderStatus,
        completeDeliveryWithPin,
        cancelOrderWithCompensation,
        markOrderBillPaid,
        submitOrderRatings,
        addReview,
        replyReview,
        toggleHideReview,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemAvailability,
        pushKeyedNotification,
        markNotificationsRead,
        toggleServiceHealth,
        retryFailedEvents,
        clearEvents,
        appendOrders,
        runFullDistributedDemo,
        resetToFactoryDefaults,
        showToast,
        t,
        loc: locHelper,
        formatPrice,
        formatDate,
        getBranchDisplayName,
        getBranchCityName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
