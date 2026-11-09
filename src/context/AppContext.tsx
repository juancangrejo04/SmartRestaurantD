import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  CountryCode,
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
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  activeBranchId: string;
  setActiveBranchId: (id: string) => void;
  restaurants: Restaurant[];
  branches: Branch[];
  tables: Table[];
  menuItems: MenuItem[];
  reservations: Reservation[];
  orders: Order[];
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
  createReservation: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    date: string;
    time: string;
    guestsCount: number;
    tableId: string;
    notes?: string;
  }) => { success: boolean; error?: string };
  updateReservationStatus: (reservationId: string, status: ReservationStatus) => void;
  createOrder: (tableId: string, items: OrderItem[], tipPercent?: number, customerName?: string) => Promise<Order>;
  advanceKitchenOrder: (orderId: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemAvailability: (id: string) => void;
  markNotificationsRead: () => void;
  toggleServiceHealth: (serviceId: ServiceName) => void;
  retryFailedEvents: () => Promise<void>;
  clearEvents: () => void;
  runFullDistributedDemo: () => Promise<void>;
  resetToFactoryDefaults: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  // Helpers
  t: (key: string) => string;
  formatPrice: (amountUSD: number) => string;
  formatDate: (iso: string | Date) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'smartrestaurant_v1_';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or use initial seed
  const [country, setCountryState] = useState<CountryCode>(() => {
    return (localStorage.getItem(`${STORAGE_PREFIX}country`) as CountryCode) || 'CO';
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
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
    return saved || 'branch-co-01';
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

  // Persist items on changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}country`, country);
  }, [country]);

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
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}servicesHealth`, JSON.stringify(servicesHealth));
  }, [servicesHealth]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // When switching country, also switch active branch to one from that country
  const setCountry = useCallback(
    (newCountry: CountryCode) => {
      setCountryState(newCountry);
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

  const switchUserRole = useCallback(
    (role: UserRole) => {
      const user = authService.switchUserByRole(role);
      setCurrentUserState(user);
      showToast(`Sesión cambiada a rol: ${user.name} (${user.role.toUpperCase()})`, 'info');
    },
    [showToast]
  );

  const setActiveBranchId = useCallback((id: string) => {
    setActiveBranchIdState(id);
  }, []);

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

      // Add to events state immediately
      setEvents((prev) => [envelope, ...prev]);

      // Dispatch async
      const processed = await eventBus.dispatchEvent(envelope, servicesHealth, (ev) => {
        updateSingleEvent(ev);
      });

      // Update service metrics
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

      // Create notification if target is notification-service or broadcast
      const notif = notificationService.createFromEvent(processed);
      if (notif) {
        setNotifications((prev) => [notif, ...prev]);
        showToast(notif.title || 'Nueva notificación', 'info');
      }

      return processed;
    },
    [servicesHealth, showToast, updateSingleEvent]
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
      setTables((prev) => [...prev, newTbl]);
      showToast(`Mesa #${newTbl.number} creada en zona ${zone}`, 'success');

      recordAndDispatchEvent('restaurant-service', 'analytics-service', 'TABLE_STATUS_CHANGED', {
        tableId: newTbl.id,
        number: newTbl.number,
        action: 'CREATED',
        zone,
      });
    },
    [activeBranchId, tables, showToast, recordAndDispatchEvent]
  );

  const updateTableStatus = useCallback(
    (tableId: string, status: TableStatus) => {
      const updated = restaurantService.updateTableStatus(tables, tableId, status);
      setTables(updated);
      const tbl = tables.find((t) => t.id === tableId);
      showToast(`Mesa #${tbl?.number || ''} ahora está ${status.toUpperCase()}`, 'info');

      recordAndDispatchEvent('restaurant-service', 'order-service', 'TABLE_STATUS_CHANGED', {
        tableId,
        number: tbl?.number,
        newStatus: status,
      });
    },
    [tables, showToast, recordAndDispatchEvent]
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
      // 1. Check table collision
      const collisionCheck = reservationService.checkTableCollision(
        reservations,
        data.tableId,
        data.date,
        data.time
      );

      if (collisionCheck.hasCollision) {
        return {
          success: false,
          error: `Conflicto detectado: La mesa ya tiene una reserva activa a las ${collisionCheck.conflictingReservation?.time} (ventana ±90 min). Por favor elija otra mesa u horario.`,
        };
      }

      const table = tables.find((t) => t.id === data.tableId);
      if (!table) {
        return { success: false, error: 'Mesa seleccionada no encontrada.' };
      }

      const branch = branches.find((b) => b.id === table.branchId);

      const newRes = reservationService.createReservation({
        branchId: table.branchId,
        restaurantId: branch?.restaurantId || 'rest-co-01',
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        date: data.date,
        time: data.time,
        guestsCount: data.guestsCount,
        table,
        notes: data.notes,
      });

      setReservations((prev) => [newRes, ...prev]);

      // If reservation is for today, mark table as reserved
      const today = new Date().toISOString().split('T')[0];
      if (data.date === today) {
        setTables((prev) =>
          prev.map((t) => (t.id === table.id && t.status === 'available' ? { ...t, status: 'reserved' } : t))
        );
      }

      // Emit distributed event
      recordAndDispatchEvent('reservation-service', 'notification-service', 'RESERVATION_CREATED', {
        reservationId: newRes.id,
        customerName: newRes.customerName,
        customerEmail: newRes.customerEmail,
        tableNumber: newRes.tableNumber,
        guestsCount: newRes.guestsCount,
        date: newRes.date,
        time: newRes.time,
      });

      showToast('¡Reservación creada y procesada por el Event Bus!', 'success');
      return { success: true };
    },
    [reservations, tables, branches, recordAndDispatchEvent, showToast]
  );

  const updateReservationStatus = useCallback(
    (reservationId: string, status: ReservationStatus) => {
      setReservations((prev) => reservationService.updateStatus(prev, reservationId, status));
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
    [reservations, recordAndDispatchEvent, showToast]
  );

  // ORDERS ACTIONS
  const createOrder = useCallback(
    async (
      tableId: string,
      items: OrderItem[],
      tipPercent: number = 10,
      customerName?: string
    ): Promise<Order> => {
      const table = tables.find((t) => t.id === tableId);
      const branch = branches.find((b) => b.id === (table?.branchId || activeBranchId));

      const newOrder = orderService.createOrder({
        branchId: branch?.id || activeBranchId,
        restaurantId: branch?.restaurantId || 'rest-co-01',
        tableId,
        tableNumber: table?.number || 1,
        items,
        countryCode: country,
        tipPercentage: tipPercent,
        customerName,
      });

      setOrders((prev) => [newOrder, ...prev]);

      // Update table to occupied
      setTables((prev) =>
        prev.map((t) => (t.id === tableId ? { ...t, status: 'occupied', currentOrderId: newOrder.id } : t))
      );

      // Distributed Events:
      // 1. Order Placed -> Kitchen Service
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
    [tables, branches, activeBranchId, country, recordAndDispatchEvent]
  );

  const advanceKitchenOrder = useCallback(
    async (orderId: string) => {
      const targetOrder = orders.find((o) => o.id === orderId);
      if (!targetOrder) return;

      const nextStatus = kitchenService.getNextStatus(targetOrder.status);
      if (!nextStatus) return;

      setOrders((prev) => orderService.updateOrderStatus(prev, orderId, nextStatus));

      if (nextStatus === 'preparing') {
        await recordAndDispatchEvent('kitchen-service', 'notification-service', 'ORDER_PREPARATION_STARTED', {
          orderId,
          orderNumber: targetOrder.orderNumber,
          tableNumber: targetOrder.tableNumber,
        });
      } else if (nextStatus === 'ready') {
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
    [orders, recordAndDispatchEvent]
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

  // CHAOS & FAULT TOLERANCE
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
      showToast('No hay eventos fallidos pendientes en la cola Dead Letter Queue.', 'info');
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

  // ACADEMIC DEMONSTRATION FLOW
  const runFullDistributedDemo = useCallback(async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setDemoStep(1);
    setDemoStepMessage('Paso 1: Cliente interactúa desde su teléfono para agendar una reserva...');
    showToast('Iniciando Demostración Guiada de Flujo Distribuido...', 'info');

    await new Promise((r) => setTimeout(r, 1200));

    // Step 1: Customer creates reservation
    setDemoStep(2);
    setDemoStepMessage('Paso 2: Reservation Service genera evento [RESERVATION_CREATED] con clave de idempotencia...');
    const demoRes = reservationService.createReservation({
      branchId: activeBranchId,
      restaurantId: 'rest-co-01',
      customerName: 'Dra. Camila Morales (Demo Académica)',
      customerEmail: 'profesor.evaluador@universidad.edu',
      customerPhone: '+57 312 000 1234',
      date: new Date().toISOString().split('T')[0],
      time: '19:45',
      guestsCount: 4,
      table: tables[0] || { id: 'tbl-co-1', number: 1, capacity: 4, zone: 'indoor', status: 'available', branchId: activeBranchId },
      notes: 'Demostración de consistencia eventual y entrega de eventos.',
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

    // Step 2: Event bus routes to Analytics Service
    setDemoStep(3);
    setDemoStepMessage('Paso 3: Event Bus distribuye a Analytics Service para consolidar métricas OLAP...');
    await recordAndDispatchEvent('notification-service', 'analytics-service', 'METRICS_AGGREGATED', {
      sourceEventId: ev1.id,
      metric: 'DAILY_RESERVATIONS',
      increment: 1,
    });

    await new Promise((r) => setTimeout(r, 1400));

    // Step 3: Order placement simulation
    setDemoStep(4);
    setDemoStepMessage('Paso 4: Comensales en mesa escanean QR y Order Service publica [ORDER_PLACED] hacia Cocina...');
    const demoOrder = orderService.createOrder({
      branchId: activeBranchId,
      restaurantId: 'rest-co-01',
      tableId: tables[0]?.id || 'tbl-co-1',
      tableNumber: tables[0]?.number || 1,
      items: [
        { menuItemId: 'menu-item-3', name: 'Bife de Chorizo Angus', quantity: 2, unitPrice: 24.0, subtotal: 48.0 },
        { menuItemId: 'menu-item-8', name: 'Cóctel Andino de Maracuyá', quantity: 2, unitPrice: 8.0, subtotal: 16.0 },
      ],
      countryCode: country,
      tipPercentage: 10,
      customerName: 'Mesa Demo Académica',
    });
    setOrders((prev) => [demoOrder, ...prev]);

    await recordAndDispatchEvent('order-service', 'kitchen-service', 'ORDER_PLACED', {
      orderId: demoOrder.id,
      orderNumber: demoOrder.orderNumber,
      tableNumber: demoOrder.tableNumber,
      itemsCount: demoOrder.items.length,
    });

    await new Promise((r) => setTimeout(r, 1400));

    // Step 5: Kitchen advances
    setDemoStep(5);
    setDemoStepMessage('Paso 5: Kitchen Service procesa la orden, emite [ORDER_PREPARATION_STARTED] y sincroniza estados...');
    setOrders((prev) => orderService.updateOrderStatus(prev, demoOrder.id, 'preparing'));
    await recordAndDispatchEvent('kitchen-service', 'notification-service', 'ORDER_PREPARATION_STARTED', {
      orderId: demoOrder.id,
      orderNumber: demoOrder.orderNumber,
      tableNumber: demoOrder.tableNumber,
    });

    setDemoStepMessage('¡Flujo distribuido completado con éxito! Todos los servicios sincronizados.');
    showToast('¡Demostración de flujo distribuido completada exitosamente!', 'success');
    setTimeout(() => {
      setIsDemoRunning(false);
      setDemoStep(0);
      setDemoStepMessage('');
    }, 4000);
  }, [isDemoRunning, activeBranchId, tables, country, recordAndDispatchEvent, showToast]);

  const resetToFactoryDefaults = useCallback(() => {
    localStorage.clear();
    setCountryState('CO');
    setCurrentUserState(INITIAL_USERS[0]);
    setRestaurants(INITIAL_RESTAURANTS);
    setBranches(INITIAL_BRANCHES);
    setActiveBranchIdState('branch-co-01');
    setTables(INITIAL_TABLES);
    setMenuItems(INITIAL_MENU_ITEMS);
    setReservations(INITIAL_RESERVATIONS);
    setOrders(INITIAL_ORDERS);
    setNotifications([]);
    setEvents(INITIAL_EVENTS);
    setServicesHealth(INITIAL_SERVICES);
    showToast('Todos los datos han sido restaurados al estado original de fábrica.', 'success');
  }, [showToast]);

  const t = useCallback(
    (key: string): string => {
      const lang = COUNTRIES[country].language;
      return getTranslation(lang, key as any);
    },
    [country]
  );

  const formatPrice = useCallback(
    (amountUSD: number): string => {
      return formatCurrency(amountUSD, country);
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
        currentUser,
        switchUserRole,
        activeBranchId,
        setActiveBranchId,
        restaurants,
        branches,
        tables,
        menuItems,
        reservations,
        orders,
        notifications,
        events,
        servicesHealth,
        toasts,
        isDemoRunning,
        demoStep,
        demoStepMessage,
        addTable,
        updateTableStatus,
        createReservation,
        updateReservationStatus,
        createOrder,
        advanceKitchenOrder,
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
