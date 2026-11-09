import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import {
  CountryCode,
  Language,
  User,
  UserRole,
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
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_RESTAURANTS,
  INITIAL_BRANCHES,
  INITIAL_TABLES,
  INITIAL_MENU_ITEMS,
  INITIAL_RESERVATIONS,
  INITIAL_ORDERS,
  INITIAL_SERVICES,
  INITIAL_EVENTS,
  INITIAL_REVIEWS,
} from '../data/seedData';
import { COUNTRIES, formatCurrency, formatRegionalDateTime } from '../i18n/countries';
import { getTranslation } from '../i18n/translations';
import { eventBus } from '../services/eventBus';
import { authService } from '../services/authService';
import { restaurantService } from '../services/restaurantService';
import { reservationService } from '../services/reservationService';
import { orderService } from '../services/orderService';
import { kitchenService } from '../services/kitchenService';
import { notificationService } from '../services/notificationService';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  country: CountryCode;
  setCountry: (c: CountryCode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: User;
  isAuthenticated: boolean;
  switchUserRole: (role: UserRole) => void;
  registerCustomer: (name: string, email: string, phone: string, password?: string) => User;
  loginUser: (email: string, password?: string) => boolean;
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
  isDemoRunning: boolean;
  demoStep: number;
  demoStepMessage: string;
  // Actions
  addTable: (capacity: number, zone: TableZone) => void;
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  openTable: (tableId: string, guestsCount?: number) => void;
  clearTable: (tableId: string) => void;
  callWaiter: (tableId: string, reason?: string) => void;
  resolveWaiterCall: (tableId: string) => void;
  requestBill: (tableId: string) => void;
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
  createOrder: (tableId: string, items: OrderItem[], tipPercent?: number, customerName?: string, specialInstructions?: string) => Promise<Order>;
  advanceKitchenOrder: (orderId: string) => void;
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
  markNotificationsRead: () => void;
  toggleServiceHealth: (serviceId: ServiceName) => void;
  retryFailedEvents: () => Promise<void>;
  clearEvents: () => void;
  runFullDistributedDemo: () => Promise<void>;
  resetToFactoryDefaults: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  // Helpers
  t: (key: string) => string;
  formatPrice: (amountUSD: number, overrideCountry?: CountryCode) => string;
  formatDate: (iso: string | Date) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'smartrestaurant_v3_';
const VERSION_KEY = 'smartrestaurant_v3_version';
const CURRENT_VERSION = '3.0.0';

// Migration & cleanup check
(function initStorageCheck() {
  try {
    const savedVer = localStorage.getItem(VERSION_KEY);
    if (savedVer !== CURRENT_VERSION) {
      // Clean previous versions
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('smartrestaurant_v1_') || k.startsWith('smartrestaurant_v2_') || k.startsWith('smartrestaurant:'))) {
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
  // Cross-Tab BroadcastChannel
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const [country, setCountryState] = useState<CountryCode>(() => {
    return (localStorage.getItem(`${STORAGE_PREFIX}country`) as CountryCode) || 'CO';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}language`) as Language;
    return saved || COUNTRIES[country]?.language || 'es';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}isAuthenticated`);
    return saved ? JSON.parse(saved) : true;
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}currentUser`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return authService.getInitialUser();
  });

  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}restaurants`);
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANTS;
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}branches`);
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [activeBranchId, setActiveBranchIdState] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}activeBranchId`);
    return saved || 'branch-aura-co-bogota';
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
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [servicesHealth, setServicesHealth] = useState<ServiceHealth[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}servicesHealth`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoStepMessage, setDemoStepMessage] = useState('');

  // Persist state to localStorage
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

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  // Broadcast cross-tab sync
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('smartrestaurant_v3_channel');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'STATE_SYNC') {
          if (payload.tables) setTables(payload.tables);
          if (payload.orders) setOrders(payload.orders);
          if (payload.reservations) setReservations(payload.reservations);
          if (payload.reviews) setReviews(payload.reviews);
        } else if (type === 'WAITER_CALL') {
          showToast(`¡Llamada al mesero en Mesa #${payload.tableNumber}!`, 'warning');
        } else if (type === 'ORDER_READY') {
          showToast(`¡Comanda #${payload.orderNumber} lista para servir!`, 'info');
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [showToast]);

  const broadcastStateChange = useCallback((patch: Record<string, any>) => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'STATE_SYNC',
        payload: patch,
      });
    }
  }, []);

  // Language management
  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem(`${STORAGE_PREFIX}language`, newLang);
  }, []);

  // Country & Market switcher
  const setCountry = useCallback(
    (newCountry: CountryCode) => {
      setCountryState(newCountry);
      // Auto-sync default language for that country
      setLanguageState(COUNTRIES[newCountry].language);
      const matchBranch = branches.find((b) => b.country === newCountry);
      if (matchBranch) {
        setActiveBranchIdState(matchBranch.id);
      }
      showToast(
        `Mercado cambiado a ${COUNTRIES[newCountry].name} (${COUNTRIES[newCountry].currency})`,
        'info'
      );
    },
    [branches, showToast]
  );

  // Active branch selector (governs local country/currency/tax)
  const setActiveBranchId = useCallback((id: string) => {
    setActiveBranchIdState(id);
    const branch = branches.find((b) => b.id === id);
    if (branch && branch.country !== country) {
      setCountryState(branch.country);
    }
  }, [branches, country]);

  // Auth & Roles
  const switchUserRole = useCallback(
    (role: UserRole) => {
      const user = authService.switchUserByRole(role);
      setCurrentUserState(user);
      setIsAuthenticated(true);
      showToast(`Sesión activa: ${user.name} (${user.role.toUpperCase()})`, 'info');
    },
    [showToast]
  );

  const registerCustomer = useCallback(
    (name: string, email: string, phone: string, password?: string): User => {
      const newUser: User = {
        id: `usr-cust-${Date.now().toString(36)}`,
        name,
        email,
        phone,
        role: 'customer',
        country,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      };
      authService.setUser(newUser);
      setCurrentUserState(newUser);
      setIsAuthenticated(true);
      showToast(`¡Bienvenido(a), ${name}! Tu cuenta de comensal está lista.`, 'success');
      return newUser;
    },
    [country, showToast]
  );

  const loginUser = useCallback(
    (email: string, password?: string): boolean => {
      const found = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUserState(found);
        setIsAuthenticated(true);
        showToast(`Sesión iniciada como ${found.name}`, 'success');
        return true;
      }
      // Quick fallback customer
      const fallbackUser: User = {
        id: `usr-cust-${Date.now().toString(36)}`,
        name: email.split('@')[0] || 'Comensal',
        email,
        role: 'customer',
        country,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      };
      setCurrentUserState(fallbackUser);
      setIsAuthenticated(true);
      showToast(`Sesión iniciada con éxito`, 'success');
      return true;
    },
    [country, showToast]
  );

  const logoutUser = useCallback(() => {
    const visitor: User = {
      id: 'usr-guest',
      name: 'Invitado',
      email: 'invitado@smartrestaurant.io',
      role: 'customer',
      country,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setCurrentUserState(visitor);
    setIsAuthenticated(false);
    showToast('Has cerrado sesión.', 'info');
  }, [country, showToast]);

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

  // Helper to record events through Event Bus
  const recordAndDispatchEvent = useCallback(
    async (
      sourceService: ServiceName,
      targetService: ServiceName | 'event-bus' | 'broadcast',
      eventType: any,
      payload: Record<string, any>
    ) => {
      const envelope = eventBus.createEventEnvelope({
        sourceService,
        targetService,
        eventType,
        payload,
      });

      setEvents((prev) => [envelope, ...prev]);

      const processed = await eventBus.dispatchEvent(envelope, servicesHealth, (ev) => {
        updateSingleEvent(ev);
      });

      setServicesHealth((prev) =>
        prev.map((s) => {
          if ((s.id || s.service) === sourceService || (s.id || s.service) === targetService) {
            return {
              ...s,
              processedEventsCount: (s.processedEventsCount || 0) + 1,
              failedEventsCount: processed.status === 'failed' ? (s.failedEventsCount || 0) + 1 : (s.failedEventsCount || 0),
            };
          }
          return s;
        })
      );

      const notif = notificationService.createFromEvent(processed);
      if (notif) {
        setNotifications((prev) => [notif, ...prev]);
        // Only show toast if user is staff or relevant
        if (currentUser.role !== 'customer') {
          showToast(notif.title || 'Nueva notificación operativa', 'info');
        }
      }

      return processed;
    },
    [currentUser.role, servicesHealth, showToast, updateSingleEvent]
  );

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
      showToast(`Mesa #${newTbl.number} creada en zona ${zone}`, 'success');

      recordAndDispatchEvent('restaurant-service', 'analytics-service', 'TABLE_STATUS_CHANGED', {
        tableId: newTbl.id,
        number: newTbl.number,
        action: 'CREATED',
        zone,
      });
    },
    [activeBranchId, tables, showToast, broadcastStateChange, recordAndDispatchEvent]
  );

  const updateTableStatus = useCallback(
    (tableId: string, status: TableStatus) => {
      const updated = restaurantService.updateTableStatus(tables, tableId, status);
      setTables(updated);
      broadcastStateChange({ tables: updated });
      const tbl = tables.find((t) => t.id === tableId);
      showToast(`Mesa #${tbl?.number || ''} ahora está ${status.toUpperCase()}`, 'info');

      recordAndDispatchEvent('restaurant-service', 'order-service', 'TABLE_STATUS_CHANGED', {
        tableId,
        number: tbl?.number,
        newStatus: status,
      });
    },
    [tables, broadcastStateChange, showToast, recordAndDispatchEvent]
  );

  const openTable = useCallback(
    (tableId: string, guestsCount: number = 2) => {
      const updated = tables.map((t) =>
        t.id === tableId
          ? { ...t, status: 'occupied' as TableStatus, currentGuestsCount: guestsCount }
          : t
      );
      setTables(updated);
      broadcastStateChange({ tables: updated });
      const tbl = tables.find((t) => t.id === tableId);
      showToast(`Mesa #${tbl?.number || ''} abierta para ${guestsCount} comensales`, 'success');

      recordAndDispatchEvent('restaurant-service', 'order-service', 'TABLE_OPENED', {
        tableId,
        number: tbl?.number,
        guestsCount,
      });
    },
    [tables, broadcastStateChange, showToast, recordAndDispatchEvent]
  );

  const clearTable = useCallback(
    (tableId: string) => {
      const updated = tables.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status: 'available' as TableStatus,
              currentOrderId: undefined,
              currentGuestsCount: undefined,
              activeCallWaiter: false,
              waiterCallReason: undefined,
              waiterCallTimestamp: undefined,
              billRequested: false,
            }
          : t
      );
      setTables(updated);
      broadcastStateChange({ tables: updated });
      const tbl = tables.find((t) => t.id === tableId);
      showToast(`Mesa #${tbl?.number || ''} liberada y lista para nuevos clientes`, 'info');

      recordAndDispatchEvent('restaurant-service', 'order-service', 'TABLE_CLEARED', {
        tableId,
        number: tbl?.number,
      });
    },
    [tables, broadcastStateChange, showToast, recordAndDispatchEvent]
  );

  const callWaiter = useCallback(
    (tableId: string, reason?: string) => {
      const nowIso = new Date().toISOString();
      const updated = tables.map((t) =>
        t.id === tableId
          ? {
              ...t,
              activeCallWaiter: true,
              waiterCallReason: reason || 'Atención en mesa solicitada por el comensal',
              waiterCallTimestamp: nowIso,
            }
          : t
      );
      setTables(updated);
      broadcastStateChange({ tables: updated });
      const tbl = tables.find((t) => t.id === tableId);

      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'WAITER_CALL',
          payload: { tableNumber: tbl?.number || 1, reason },
        });
      }

      recordAndDispatchEvent('restaurant-service', 'notification-service', 'WAITER_CALLED', {
        tableId,
        tableNumber: tbl?.number,
        reason: reason || 'Atención en mesa',
        timestamp: nowIso,
      });

      showToast(`¡Mesero alertado para la Mesa #${tbl?.number || ''}! Se aproximará a la brevedad.`, 'success');
    },
    [tables, broadcastStateChange, recordAndDispatchEvent, showToast]
  );

  const resolveWaiterCall = useCallback(
    (tableId: string) => {
      const updated = tables.map((t) =>
        t.id === tableId
          ? {
              ...t,
              activeCallWaiter: false,
              waiterCallReason: undefined,
              waiterCallTimestamp: undefined,
            }
          : t
      );
      setTables(updated);
      broadcastStateChange({ tables: updated });
      const tbl = tables.find((t) => t.id === tableId);

      recordAndDispatchEvent('restaurant-service', 'notification-service', 'WAITER_CALL_RESOLVED', {
        tableId,
        tableNumber: tbl?.number,
      });

      showToast(`Llamada de Mesa #${tbl?.number || ''} atendida y resuelta.`, 'info');
    },
    [tables, broadcastStateChange, recordAndDispatchEvent, showToast]
  );

  const requestBill = useCallback(
    (tableId: string) => {
      const tbl = tables.find((t) => t.id === tableId);
      const updatedTables = tables.map((t) =>
        t.id === tableId ? { ...t, billRequested: true } : t
      );
      setTables(updatedTables);

      if (tbl?.currentOrderId) {
        setOrders((prev) =>
          prev.map((o) => (o.id === tbl.currentOrderId ? { ...o, billRequested: true } : o))
        );
      }

      broadcastStateChange({ tables: updatedTables });

      recordAndDispatchEvent('order-service', 'notification-service', 'ORDER_BILL_REQUESTED', {
        tableId,
        tableNumber: tbl?.number,
        orderId: tbl?.currentOrderId,
      });

      showToast(`Cuenta solicitada para Mesa #${tbl?.number || ''}. El mesero llevará la cuenta.`, 'success');
    },
    [tables, broadcastStateChange, recordAndDispatchEvent, showToast]
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
          error: `Conflicto de horario: La mesa seleccionada ya tiene una reservación a las ${collisionCheck.conflictingReservation?.time} (ventana de ±90 min). Por favor elija otra mesa u horario.`,
        };
      }

      const table = tables.find((t) => t.id === data.tableId);
      if (!table) {
        return { success: false, error: 'Mesa seleccionada no encontrada.' };
      }

      const branch = branches.find((b) => b.id === table.branchId);

      const newRes = reservationService.createReservation({
        branchId: table.branchId,
        restaurantId: branch?.restaurantId || 'brand-aura',
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
        const nextTables = tables.map((t) =>
          t.id === table.id && t.status === 'available' ? { ...t, status: 'reserved' as TableStatus } : t
        );
        setTables(nextTables);
        broadcastStateChange({ reservations: nextReservations, tables: nextTables });
      } else {
        broadcastStateChange({ reservations: nextReservations });
      }

      recordAndDispatchEvent('reservation-service', 'notification-service', 'RESERVATION_CREATED', {
        reservationId: newRes.id,
        customerName: newRes.customerName,
        customerEmail: newRes.customerEmail,
        tableNumber: newRes.tableNumber,
        guestsCount: newRes.guestsCount,
        date: newRes.date,
        time: newRes.time,
      });

      showToast('¡Reservación confirmada exitosamente!', 'success');
      return { success: true, reservation: newRes };
    },
    [reservations, tables, branches, broadcastStateChange, recordAndDispatchEvent, showToast]
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
          customerName: res?.customerName,
          status,
        }
      );
      showToast(`Reserva #${reservationId.slice(-4)} marcada como ${status.toUpperCase()}`, 'info');
    },
    [reservations, broadcastStateChange, recordAndDispatchEvent, showToast]
  );

  // ORDERS ACTIONS
  const createOrder = useCallback(
    async (
      tableId: string,
      items: OrderItem[],
      tipPercent: number = 10,
      customerName?: string,
      specialInstructions?: string
    ): Promise<Order> => {
      const table = tables.find((t) => t.id === tableId);
      const branch = branches.find((b) => b.id === (table?.branchId || activeBranchId));
      const branchCountry = branch?.country || country;

      const newOrder = orderService.createOrder({
        branchId: branch?.id || activeBranchId,
        restaurantId: branch?.restaurantId || 'brand-aura',
        tableId,
        tableNumber: table?.number || 1,
        items,
        countryCode: branchCountry,
        tipPercentage: tipPercent,
        customerName: customerName || currentUser.name || 'Comensal en Mesa',
      });

      if (specialInstructions) {
        newOrder.kitchenNotes = specialInstructions;
      }

      const nextOrders = [newOrder, ...orders];
      const nextTables = tables.map((t) =>
        t.id === tableId ? { ...t, status: 'occupied' as TableStatus, currentOrderId: newOrder.id } : t
      );

      setOrders(nextOrders);
      setTables(nextTables);
      broadcastStateChange({ orders: nextOrders, tables: nextTables });

      await recordAndDispatchEvent('order-service', 'kitchen-service', 'ORDER_PLACED', {
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        tableNumber: newOrder.tableNumber,
        itemsCount: newOrder.items.length,
        totalUSD: newOrder.total,
        currency: newOrder.currency,
      });

      return newOrder;
    },
    [tables, branches, activeBranchId, country, currentUser.name, orders, broadcastStateChange, recordAndDispatchEvent]
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
          tableNumber: targetOrder.tableNumber,
        });
      } else if (nextStatus === 'delivered') {
        await recordAndDispatchEvent('kitchen-service', 'notification-service', 'ORDER_DELIVERED', {
          orderId,
          orderNumber: targetOrder.orderNumber,
          tableNumber: targetOrder.tableNumber,
        });
      }
    },
    [orders, broadcastStateChange, recordAndDispatchEvent]
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
        customerName: reviewData.customerName,
        customerEmail: reviewData.customerEmail,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date().toISOString(),
        orderId: reviewData.orderId,
        reservationId: reviewData.reservationId,
        dishesRating: reviewData.dishesRating,
        status: 'approved',
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

      showToast('¡Gracias por tu reseña! Tu opinión ayuda a enriquecer la experiencia culinaria.', 'success');
      return newReview;
    },
    [reviews, broadcastStateChange, recordAndDispatchEvent, showToast]
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
                userRole: currentUser.role,
              },
            }
          : r
      );
      setReviews(nextReviews);
      broadcastStateChange({ reviews: nextReviews });

      recordAndDispatchEvent('analytics-service', 'notification-service', 'REVIEW_REPLIED', {
        reviewId,
        replyText,
        repliedBy: currentUser.name,
      });

      showToast('Respuesta publicada con éxito.', 'success');
    },
    [reviews, currentUser, broadcastStateChange, recordAndDispatchEvent, showToast]
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
      const target = nextReviews.find((r) => r.id === reviewId);
      showToast(`Reseña marcada como ${target?.status === 'approved' ? 'Visible' : 'Oculta'}`, 'info');
    },
    [reviews, broadcastStateChange, showToast]
  );

  // MENU ACTIONS
  const addMenuItem = useCallback(
    (item: Omit<MenuItem, 'id'>) => {
      const newItem: MenuItem = {
        ...item,
        id: `menu-item-${Date.now().toString(36)}`,
      };
      setMenuItems((prev) => [newItem, ...prev]);
      showToast(`Plato "${newItem.name.es}" añadido al menú`, 'success');
    },
    [showToast]
  );

  const updateMenuItem = useCallback(
    (id: string, updates: Partial<MenuItem>) => {
      setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
      showToast('Producto actualizado exitosamente', 'info');
    },
    [showToast]
  );

  const deleteMenuItem = useCallback(
    (id: string) => {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      showToast('Producto eliminado del menú', 'warning');
    },
    [showToast]
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
          productName: updatedItem.name.es,
          available: updatedItem.available,
        });
        showToast(
          `Producto "${updatedItem.name.es}" marcado como ${updatedItem.available ? 'Disponible' : 'Agotado'}`,
          'info'
        );
      }
    },
    [recordAndDispatchEvent, showToast]
  );

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => notificationService.markAllAsRead(prev));
  }, []);

  // FAULT TOLERANCE & CHAOS
  const toggleServiceHealth = useCallback(
    (serviceId: ServiceName) => {
      setServicesHealth((prev) =>
        prev.map((s) => {
          if ((s.id || s.service) === serviceId) {
            const isCurrentlyUp = s.status === 'up' || s.status === 'healthy';
            const nextStatus: ServiceStatus = isCurrentlyUp ? 'down' : 'up';
            showToast(
              `Servicio [${s.name || s.id || s.service}] cambiado a: ${nextStatus.toUpperCase()}`,
              nextStatus === 'down' ? 'error' : 'success'
            );
            return { ...s, status: nextStatus };
          }
          return s;
        })
      );
    },
    [showToast]
  );

  const retryFailedEvents = useCallback(async () => {
    const failed = events.filter((e) => e.status === 'failed');
    if (failed.length === 0) {
      showToast('No hay eventos pendientes en la Dead Letter Queue.', 'info');
      return;
    }
    showToast(`Reintentando ${failed.length} evento(s) fallido(s)...`, 'info');

    for (const ev of failed) {
      await eventBus.dispatchEvent(ev, servicesHealth, (updated) => {
        updateSingleEvent(updated);
      });
    }
    showToast('Procesamiento de reintentos finalizado.', 'success');
  }, [events, servicesHealth, showToast, updateSingleEvent]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    showToast('Cola de eventos reiniciada.', 'info');
  }, [showToast]);

  // FULL DISTRIBUTED DEMO
  const runFullDistributedDemo = useCallback(async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setDemoStep(1);
    setDemoStepMessage('Paso 1: Cliente genera una reservación desde el portal público...');
    showToast('Iniciando Demostración de Flujo Distribuido...', 'info');

    await new Promise((r) => setTimeout(r, 1200));

    setDemoStep(2);
    setDemoStepMessage('Paso 2: Reservation Service publica evento con clave de idempotencia...');
    const demoRes = reservationService.createReservation({
      branchId: activeBranchId,
      restaurantId: 'brand-aura',
      customerName: 'Dra. Camila Morales',
      customerEmail: 'profesor.evaluador@universidad.edu',
      customerPhone: '+57 312 000 1234',
      date: new Date().toISOString().split('T')[0],
      time: '20:00',
      guestsCount: 4,
      table: tables[0] || { id: 'tbl-co-bogota-1', number: 1, capacity: 4, zone: 'indoor', status: 'available', branchId: activeBranchId },
      notes: 'Demostración de consistencia eventual.',
    });
    setReservations((prev) => [demoRes, ...prev]);

    const ev1 = await recordAndDispatchEvent(
      'reservation-service',
      'notification-service',
      'RESERVATION_CREATED',
      {
        reservationId: demoRes.id,
        customerName: demoRes.customerName,
        tableNumber: demoRes.tableNumber,
        guestsCount: demoRes.guestsCount,
      }
    );

    await new Promise((r) => setTimeout(r, 1400));

    setDemoStep(3);
    setDemoStepMessage('Paso 3: Event Bus distribuye a Analytics Service para consolidar métricas...');
    await recordAndDispatchEvent('notification-service', 'analytics-service', 'METRICS_AGGREGATED', {
      sourceEventId: ev1.id,
      metric: 'DAILY_RESERVATIONS',
      increment: 1,
    });

    await new Promise((r) => setTimeout(r, 1400));

    setDemoStep(4);
    setDemoStepMessage('Paso 4: Comanda en mesa activa Order Service y publica hacia Cocina...');
    const demoOrder = orderService.createOrder({
      branchId: activeBranchId,
      restaurantId: 'brand-aura',
      tableId: tables[0]?.id || 'tbl-co-bogota-1',
      tableNumber: tables[0]?.number || 1,
      items: [
        { menuItemId: 'dish-co-01', name: 'Posta Negra Cartagenera', quantity: 2, unitPrice: 28.0, subtotal: 56.0 },
        { menuItemId: 'dish-co-05', name: 'Limonada de Coco y Jengibre', quantity: 2, unitPrice: 6.5, subtotal: 13.0 },
      ],
      countryCode: country,
      tipPercentage: 10,
      customerName: 'Mesa de Demostración',
    });
    setOrders((prev) => [demoOrder, ...prev]);

    await recordAndDispatchEvent('order-service', 'kitchen-service', 'ORDER_PLACED', {
      orderId: demoOrder.id,
      orderNumber: demoOrder.orderNumber,
      tableNumber: demoOrder.tableNumber,
      itemsCount: demoOrder.items.length,
    });

    await new Promise((r) => setTimeout(r, 1400));

    setDemoStep(5);
    setDemoStepMessage('Paso 5: Kitchen Service procesa la orden, emite [ORDER_PREPARATION_STARTED]...');
    setOrders((prev) => orderService.updateOrderStatus(prev, demoOrder.id, 'preparing'));
    await recordAndDispatchEvent('kitchen-service', 'notification-service', 'ORDER_PREPARATION_STARTED', {
      orderId: demoOrder.id,
      orderNumber: demoOrder.orderNumber,
      tableNumber: demoOrder.tableNumber,
    });

    setDemoStepMessage('¡Flujo completado con éxito! Servicios sincronizados.');
    showToast('¡Demostración completada con éxito!', 'success');
    setTimeout(() => {
      setIsDemoRunning(false);
      setDemoStep(0);
      setDemoStepMessage('');
    }, 3500);
  }, [isDemoRunning, activeBranchId, tables, country, recordAndDispatchEvent, showToast]);

  const resetToFactoryDefaults = useCallback(() => {
    localStorage.clear();
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    setCountryState('CO');
    setLanguageState('es');
    setCurrentUserState(INITIAL_USERS[0]);
    setIsAuthenticated(true);
    setRestaurants(INITIAL_RESTAURANTS);
    setBranches(INITIAL_BRANCHES);
    setActiveBranchIdState('branch-aura-co-bogota');
    setTables(INITIAL_TABLES);
    setMenuItems(INITIAL_MENU_ITEMS);
    setReservations(INITIAL_RESERVATIONS);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setNotifications([]);
    setEvents(INITIAL_EVENTS);
    setServicesHealth(INITIAL_SERVICES);
    showToast('Datos reiniciados al estado original v3.', 'success');
  }, [showToast]);

  const t = useCallback(
    (key: string): string => {
      return getTranslation(language, key as any);
    },
    [language]
  );

  const formatPrice = useCallback(
    (amountUSD: number, overrideCountry?: CountryCode): string => {
      return formatCurrency(amountUSD, overrideCountry || country);
    },
    [country]
  );

  const formatDate = useCallback(
    (iso: string | Date): string => {
      return formatRegionalDateTime(iso, country);
    },
    [country]
  );

  return (
    <AppContext.Provider
      value={{
        country,
        setCountry,
        language,
        setLanguage,
        currentUser,
        isAuthenticated,
        switchUserRole,
        registerCustomer,
        loginUser,
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
        advanceKitchenOrder,
        addReview,
        replyReview,
        toggleHideReview,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemAvailability,
        markNotificationsRead,
        toggleServiceHealth,
        retryFailedEvents,
        clearEvents,
        runFullDistributedDemo,
        resetToFactoryDefaults,
        showToast,
        t,
        formatPrice,
        formatDate,
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
