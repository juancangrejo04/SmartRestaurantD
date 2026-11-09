import {
  DistributedEvent,
  EventType,
  ServiceName,
  EventStatus,
  ServiceStatus,
} from '../types';

export type EventSubscriber = (event: DistributedEvent) => Promise<void> | void;

const STORAGE_KEY_EVENTS = 'smartrestaurant:v2:events';
const STORAGE_KEY_SERVICES = 'smartrestaurant:v2:services';
const BROADCAST_CHANNEL_NAME = 'smartrestaurant_sync_v2';

export class SimulatedEventBus {
  private static instance: SimulatedEventBus;
  private subscribers: Map<EventType, Map<ServiceName, EventSubscriber>> = new Map();
  private processedIdempotencyKeys: Set<string> = new Set();
  private channel: BroadcastChannel | null = null;
  private serviceHealth: Record<ServiceName, ServiceStatus> = {
    'auth-service': 'up',
    'restaurant-service': 'up',
    'reservation-service': 'up',
    'order-service': 'up',
    'kitchen-service': 'up',
    'notification-service': 'up',
    'analytics-service': 'up',
  };

  private listeners: ((events: DistributedEvent[]) => void)[] = [];

  private constructor() {
    this.initBroadcastChannel();
    this.loadState();
  }

  public static getInstance(): SimulatedEventBus {
    if (!SimulatedEventBus.instance) {
      SimulatedEventBus.instance = new SimulatedEventBus();
    }
    return SimulatedEventBus.instance;
  }

  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.channel.onmessage = (msgEvent) => {
          if (msgEvent.data?.type === 'BUS_SYNC') {
            this.notifyListeners();
          }
        };
      } catch {
        // Fallback to storage event
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_EVENTS || e.key === STORAGE_KEY_SERVICES) {
          this.loadState();
          this.notifyListeners();
        }
      });
    }
  }

  private loadState() {
    try {
      const savedServices = localStorage.getItem(STORAGE_KEY_SERVICES);
      if (savedServices) {
        this.serviceHealth = JSON.parse(savedServices);
      }
      const savedEvents = this.getStoredEvents();
      savedEvents.forEach((e) => {
        if (e.status === 'completed') {
          this.processedIdempotencyKeys.add(e.idempotencyKey);
        }
      });
    } catch {
      // Ignored
    }
  }

  public getStoredEvents(): DistributedEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_EVENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveEvents(events: DistributedEvent[]) {
    try {
      const trimmed = events.slice(0, 500); // Keep last 500
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(trimmed));
      this.channel?.postMessage({ type: 'BUS_SYNC' });
      this.notifyListeners();
    } catch {
      // Storage full protection
    }
  }

  public getServiceHealth(id: ServiceName): ServiceStatus {
    return this.serviceHealth[id] || 'up';
  }

  public getAllServiceHealth(): Record<ServiceName, ServiceStatus> {
    return { ...this.serviceHealth };
  }

  public setServiceHealth(id: ServiceName, status: ServiceStatus) {
    this.serviceHealth[id] = status;
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(this.serviceHealth));
    this.channel?.postMessage({ type: 'BUS_SYNC' });
    this.notifyListeners();
  }

  public resetAllServices() {
    (Object.keys(this.serviceHealth) as ServiceName[]).forEach((k) => {
      this.serviceHealth[k] = 'up';
    });
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(this.serviceHealth));
    this.channel?.postMessage({ type: 'BUS_SYNC' });
    this.notifyListeners();
  }

  public onEventsChange(callback: (events: DistributedEvent[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.getStoredEvents());
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notifyListeners() {
    const events = this.getStoredEvents();
    this.listeners.forEach((cb) => cb(events));
  }

  /**
   * Register subscriber by event type and service
   */
  public subscribe(eventType: EventType, serviceName: ServiceName, handler: EventSubscriber) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Map());
    }
    this.subscribers.get(eventType)!.set(serviceName, handler);
  }

  /**
   * Publish an event. If multiple target services listen to this event, fan-out
   * creates an independent message per destination so they can succeed or fail independently.
   */
  public async publish(params: {
    sourceService: ServiceName;
    type: EventType;
    payload: Record<string, any>;
    targetServices?: ServiceName[];
    correlationId?: string;
    idempotencyKey?: string;
  }): Promise<DistributedEvent[]> {
    const correlationId = params.correlationId || `corr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const registeredServices = this.subscribers.get(params.type);
    const targetList: ServiceName[] =
      params.targetServices ||
      (registeredServices ? Array.from(registeredServices.keys()) : ['notification-service']);

    const generatedEvents: DistributedEvent[] = targetList.map((targetService) => {
      const id = `evt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const idempotencyKey = params.idempotencyKey || `idemp-${params.type.toLowerCase()}-${targetService}-${correlationId}`;
      return {
        id,
        type: params.type,
        payload: params.payload,
        timestamp: new Date().toISOString(),
        sourceService: params.sourceService,
        targetService,
        status: 'pending',
        attempts: 0,
        maxAttempts: 3,
        idempotencyKey,
        correlationId,
      };
    });

    // Append to storage
    const currentEvents = this.getStoredEvents();
    this.saveEvents([...generatedEvents, ...currentEvents]);

    // Asynchronous dispatch (does not block caller)
    generatedEvents.forEach((ev) => {
      this.dispatchWithAsyncDelay(ev);
    });

    return generatedEvents;
  }

  private async dispatchWithAsyncDelay(event: DistributedEvent) {
    // 1. Mark as processing after simulated network queue (300-600ms)
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 300));
    this.updateEventStatus(event.id, {
      status: 'processing',
      attempts: event.attempts + 1,
    });

    // 2. Check Idempotency Guard
    if (this.processedIdempotencyKeys.has(event.idempotencyKey)) {
      await new Promise((r) => setTimeout(r, 200));
      this.updateEventStatus(event.id, {
        status: 'completed',
        isDuplicateIgnored: true,
        processedAt: new Date().toISOString(),
      });
      return;
    }

    // 3. Check Target Service Health (Fault tolerance simulation)
    const targetHealth = this.getServiceHealth(event.targetService as ServiceName);
    if (targetHealth === 'down') {
      await new Promise((r) => setTimeout(r, 300));
      this.updateEventStatus(event.id, {
        status: 'failed',
        error: `Servicio [${event.targetService}] FUERA DE LÍNEA. Mensaje encolado en Dead Letter Queue.`,
      });
      return;
    }

    // 4. Execute consumer subscriber
    const serviceHandler = this.subscribers.get(event.type)?.get(event.targetService as ServiceName);
    try {
      if (serviceHandler) {
        await serviceHandler(event);
      }
      this.processedIdempotencyKeys.add(event.idempotencyKey);
      this.updateEventStatus(event.id, {
        status: 'completed',
        processedAt: new Date().toISOString(),
        error: undefined,
      });
    } catch (err: any) {
      this.updateEventStatus(event.id, {
        status: 'failed',
        error: err?.message || 'Error en el consumidor del servicio.',
      });
    }
  }

  public updateEventStatus(eventId: string, patch: Partial<DistributedEvent>) {
    const events = this.getStoredEvents();
    const updated = events.map((e) => (e.id === eventId ? { ...e, ...patch } : e));
    this.saveEvents(updated);
  }

  public async retryEvent(eventId: string) {
    const events = this.getStoredEvents();
    const target = events.find((e) => e.id === eventId);
    if (!target) return;

    this.updateEventStatus(eventId, { status: 'pending', error: undefined });
    await this.dispatchWithAsyncDelay(target);
  }

  public async retryAllFailed() {
    const events = this.getStoredEvents();
    const failed = events.filter((e) => e.status === 'failed');
    for (const ev of failed) {
      await this.retryEvent(ev.id);
    }
  }

  public clearQueue() {
    this.saveEvents([]);
  }
}

export const eventBus = SimulatedEventBus.getInstance();
