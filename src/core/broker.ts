import {
  CountryCode,
  DistributedEvent,
  EventAttemptRecord,
  EventType,
  Language,
  ServiceHealth,
  ServiceName,
  ServiceStatus,
} from '../types';
import { distributedClock } from './clock';
import { getRegionProfile } from '../data/regions';
import { regionNodes } from './regionNodes';

export type BrokerSubscriber = (event: DistributedEvent) => Promise<unknown> | unknown;

const STORAGE_KEY_EVENTS = 'smartrestaurant_v4_broker_events';
const STORAGE_KEY_SERVICES = 'smartrestaurant_v4_broker_services';
const STORAGE_KEY_CONSUMED = 'smartrestaurant_v4_broker_consumed_keys';
const BROADCAST_CHANNEL_NAME = 'smartrestaurant_broker_v4';

const DEFAULT_HEALTH_MAP: Record<ServiceName, ServiceStatus> = {
  'auth-service': 'up',
  'restaurant-service': 'up',
  'reservation-service': 'up',
  'order-service': 'up',
  'kitchen-service': 'up',
  'dispatch-service': 'up',
  'payments-service': 'up',
  'billing-service': 'up',
  'notification-service': 'up',
  'fx-service': 'up',
  'analytics-service': 'up',
};

/**
 * Canonical UTF-8 JSON serializer enforcing zero shared-memory references across subsystem boundaries.
 */
function serializeJsonBoundary<T>(data: T): T {
  const jsonUtf8 = JSON.stringify(data);
  return JSON.parse(jsonUtf8) as T;
}

/**
 * Unified Simulated Distributed Message Broker (Pub/Sub + Request-Reply + At-Least-Once + Backoff + Idempotency + DLQ + Cross-Tab BroadcastChannel).
 */
export class SimulatedDistributedBroker {
  private static instance: SimulatedDistributedBroker;
  private subscribers: Map<EventType, Map<ServiceName, BrokerSubscriber>> = new Map();
  private consumedKeys: Set<string> = new Set(); // Format: `${targetService}:${idempotencyKey}`
  private channel: BroadcastChannel | null = null;
  private serviceHealth: Record<ServiceName, ServiceStatus> = { ...DEFAULT_HEALTH_MAP };
  private eventListeners: ((events: DistributedEvent[]) => void)[] = [];
  private healthListeners: ((health: Record<ServiceName, ServiceStatus>) => void)[] = [];

  private constructor() {
    this.initBroadcastChannel();
    this.loadState();
  }

  public static getInstance(): SimulatedDistributedBroker {
    if (!SimulatedDistributedBroker.instance) {
      SimulatedDistributedBroker.instance = new SimulatedDistributedBroker();
    }
    return SimulatedDistributedBroker.instance;
  }

  private initBroadcastChannel(): void {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.channel.onmessage = (msgEvent) => {
          if (msgEvent.data?.type === 'BROKER_SYNC') {
            this.loadState();
            this.notifyEventListeners();
            this.notifyHealthListeners();
          }
        };
      } catch {
        // Fallback to window storage events
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_EVENTS || e.key === STORAGE_KEY_SERVICES) {
          this.loadState();
          this.notifyEventListeners();
          this.notifyHealthListeners();
        }
      });
    }
  }

  private loadState(): void {
    try {
      const savedHealth = localStorage.getItem(STORAGE_KEY_SERVICES);
      if (savedHealth) {
        this.serviceHealth = { ...DEFAULT_HEALTH_MAP, ...JSON.parse(savedHealth) };
      }
      const savedConsumed = localStorage.getItem(STORAGE_KEY_CONSUMED);
      if (savedConsumed) {
        this.consumedKeys = new Set(JSON.parse(savedConsumed));
      }
      const events = this.getStoredEvents();
      events.forEach((ev) => {
        if (ev.status === 'completed' && !ev.isDuplicateIgnored) {
          this.consumedKeys.add(`${ev.targetService}:${ev.idempotencyKey}`);
        }
      });
    } catch {
      // Safe fallback
    }
  }

  private persistConsumedKeys(): void {
    try {
      const list = Array.from(this.consumedKeys).slice(-600);
      localStorage.setItem(STORAGE_KEY_CONSUMED, JSON.stringify(list));
    } catch {
      // Ignore quota errors
    }
  }

  public getStoredEvents(): DistributedEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public saveEvents(events: DistributedEvent[]): void {
    try {
      const trimmed = events.slice(0, 400);
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(trimmed));
      this.channel?.postMessage({ type: 'BROKER_SYNC' });
      this.notifyEventListeners();
    } catch {
      // Ignore storage quota errors
    }
  }

  public appendEvents(newEvents: DistributedEvent[]): void {
    const current = this.getStoredEvents();
    this.saveEvents([...newEvents, ...current]);
  }

  public updateEventStatus(eventId: string, patch: Partial<DistributedEvent>): void {
    const current = this.getStoredEvents();
    const updated = current.map((e) => (e.id === eventId ? { ...e, ...patch } : e));
    this.saveEvents(updated);
  }

  public getServiceHealth(id: ServiceName): ServiceStatus {
    return this.serviceHealth[id] || 'up';
  }

  public getAllServiceHealth(): Record<ServiceName, ServiceStatus> {
    return { ...this.serviceHealth };
  }

  public setServiceHealth(id: ServiceName, status: ServiceStatus): void {
    this.serviceHealth[id] = status;
    try {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(this.serviceHealth));
    } catch {
      // Ignore
    }
    this.channel?.postMessage({ type: 'BROKER_SYNC' });
    this.notifyHealthListeners();
  }

  public resetAllServices(): void {
    (Object.keys(DEFAULT_HEALTH_MAP) as ServiceName[]).forEach((k) => {
      this.serviceHealth[k] = 'up';
    });
    try {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(this.serviceHealth));
    } catch {
      // Ignore
    }
    this.channel?.postMessage({ type: 'BROKER_SYNC' });
    this.notifyHealthListeners();
  }

  public onEventsChange(cb: (events: DistributedEvent[]) => void): () => void {
    this.eventListeners.push(cb);
    cb(this.getStoredEvents());
    return () => {
      this.eventListeners = this.eventListeners.filter((item) => item !== cb);
    };
  }

  public onHealthChange(cb: (health: Record<ServiceName, ServiceStatus>) => void): () => void {
    this.healthListeners.push(cb);
    cb(this.getAllServiceHealth());
    return () => {
      this.healthListeners = this.healthListeners.filter((item) => item !== cb);
    };
  }

  private notifyEventListeners(): void {
    const events = this.getStoredEvents();
    this.eventListeners.forEach((cb) => cb(events));
  }

  private notifyHealthListeners(): void {
    const snapshot = this.getAllServiceHealth();
    this.healthListeners.forEach((cb) => cb(snapshot));
  }

  public subscribe(eventType: EventType, serviceName: ServiceName, handler: BrokerSubscriber): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Map());
    }
    this.subscribers.get(eventType)!.set(serviceName, handler);
    return () => {
      this.subscribers.get(eventType)?.delete(serviceName);
    };
  }

  private computeSimulatedLatencyMs(source: ServiceName, target: ServiceName | 'broadcast' | 'event-bus'): number {
    // Inter-region global coordination services vs intra-region fast services
    const globalServices: ServiceName[] = ['analytics-service', 'fx-service'];
    if (globalServices.includes(source) || (target !== 'broadcast' && target !== 'event-bus' && globalServices.includes(target))) {
      return 95 + Math.floor(Math.random() * 65); // Inter-region latency
    }
    return 18 + Math.floor(Math.random() * 28); // Intra-region latency
  }

  public createEventEnvelope(params: {
    sourceService: ServiceName;
    targetService: ServiceName | 'event-bus' | 'broadcast';
    eventType: EventType;
    payload: Record<string, any>;
    region?: CountryCode;
    locale?: Language;
    idempotencyKey?: string;
    correlationId?: string;
    traceId?: string;
    maxAttempts?: number;
  }): DistributedEvent {
    const region = params.region || 'CO';
    const profile = getRegionProfile(region);
    const lamport = distributedClock.tick();
    const nowUtc = new Date().toISOString().replace('.000Z', 'Z');
    const id = `evt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const correlationId = params.correlationId || `corr-${id}`;
    const traceId = params.traceId || `tr-${Math.random().toString(36).substring(2, 8)}`;
    const idempotencyKey = params.idempotencyKey || `idemp-${params.eventType.toLowerCase()}-${params.targetService}-${id}`;

    // Strict JSON UTF-8 serialization boundary (no shared object references)
    const serializedPayload = serializeJsonBoundary(params.payload || {});

    return {
      id,
      version: '1.0',
      region,
      traceId,
      correlationId,
      lamport,
      lamportClock: lamport,
      idempotencyKey,
      sourceService: params.sourceService,
      targetService: params.targetService,
      type: params.eventType,
      eventType: params.eventType,
      status: 'pending',
      attempts: 0,
      maxAttempts: params.maxAttempts ?? 3,
      timestamp: nowUtc,
      createdAtUtc: nowUtc,
      payload: serializedPayload,
      headers: {
        locale: params.locale || profile.defaultLanguage,
        timeZone: profile.timeZone,
      },
      attemptHistory: [],
      latencyMs: this.computeSimulatedLatencyMs(params.sourceService, params.targetService),
    };
  }

  /**
   * Publish an event onto the broker (pub-sub fanout across subscribers, persisted & broadcast).
   */
  public async publish(
    typeOrParams:
      | EventType
      | {
          sourceService: ServiceName;
          type: EventType;
          payload: Record<string, any>;
          targetServices?: ServiceName[];
          region?: CountryCode;
          locale?: Language;
          correlationId?: string;
          traceId?: string;
          idempotencyKey?: string;
          maxAttempts?: number;
        },
    optionalPayload?: Record<string, any>
  ): Promise<DistributedEvent[]> {
    const params =
      typeof typeOrParams === 'string'
        ? {
            sourceService: 'order-service' as ServiceName,
            type: typeOrParams as EventType,
            payload: optionalPayload || {},
          }
        : typeOrParams;

    const correlationId =
      params.correlationId || `corr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const traceId = params.traceId || `tr-${Math.random().toString(36).substring(2, 8)}`;
    const registeredMap = this.subscribers.get(params.type);
    const targetList: ServiceName[] =
      params.targetServices ||
      (registeredMap && registeredMap.size > 0 ? Array.from(registeredMap.keys()) : ['notification-service']);

    const envelopes = targetList.map((targetService) =>
      this.createEventEnvelope({
        sourceService: params.sourceService,
        targetService,
        eventType: params.type,
        payload: params.payload,
        region: params.region || (params.payload?.region as CountryCode) || 'CO',
        locale: params.locale,
        correlationId,
        traceId,
        maxAttempts: params.maxAttempts,
        idempotencyKey: params.idempotencyKey
          ? `${params.idempotencyKey}`
          : undefined,
      })
    );

    this.appendEvents(envelopes);

    for (const env of envelopes) {
      await this.dispatchEnvelopeWithRetries(env);
    }

    return envelopes.map((env) => this.getStoredEvents().find((s) => s.id === env.id) || env);
  }

  /**
   * Request-Reply over serialized broker envelope so subsystems never directly import one another.
   */
  public async request<T = unknown>(params: {
    sourceService: ServiceName;
    targetService: ServiceName;
    eventType: EventType;
    payload: Record<string, any>;
    region?: CountryCode;
    idempotencyKey?: string;
    correlationId?: string;
  }): Promise<{ ok: boolean; data?: T; event: DistributedEvent; error?: string }> {
    const envelope = this.createEventEnvelope({
      sourceService: params.sourceService,
      targetService: params.targetService,
      eventType: params.eventType,
      payload: params.payload,
      region: params.region,
      idempotencyKey: params.idempotencyKey,
      correlationId: params.correlationId,
      maxAttempts: 3,
    });

    this.appendEvents([envelope]);
    const result = await this.dispatchEnvelopeWithRetries(envelope);
    const latestEvent = this.getStoredEvents().find((e) => e.id === envelope.id) || envelope;

    return {
      ok: latestEvent.status === 'completed',
      data: result as T | undefined,
      event: latestEvent,
      error: latestEvent.error || latestEvent.errorDetails,
    };
  }

  /**
   * Legacy-compatible dispatch wrapper used by AppContext alongside ServiceHealth state array.
   */
  public async dispatchEvent(
    event: DistributedEvent,
    servicesHealthList: ServiceHealth[],
    onUpdateEvent: (updated: DistributedEvent) => void
  ): Promise<DistributedEvent> {
    // Sync serviceHealth statuses provided from UI state
    for (const s of servicesHealthList) {
      const sName = (s.id || s.service) as ServiceName;
      if (sName) {
        this.serviceHealth[sName] = s.status === 'healthy' ? 'up' : s.status;
      }
    }

    const exists = this.getStoredEvents().some((e) => e.id === event.id);
    if (!exists) {
      this.appendEvents([event]);
    }

    await this.dispatchEnvelopeWithRetries(event, onUpdateEvent);
    const updated = this.getStoredEvents().find((e) => e.id === event.id) || event;
    onUpdateEvent(updated);
    return updated;
  }

  /**
   * Executes delivery with consumer idempotency, exponential backoff retries,
   * Lamport clock receive increment, and Dead Letter Queue transition on exhaustion.
   */
  public async dispatchEnvelopeWithRetries(
    event: DistributedEvent,
    onUpdate?: (ev: DistributedEvent) => void,
    options?: { fastRetry?: boolean }
  ): Promise<unknown> {
    let working = serializeJsonBoundary(event);
    const history: EventAttemptRecord[] = [...(working.attemptHistory || [])];
    const target = working.targetService;
    const consumerKey = `${target}:${working.idempotencyKey}`;

    // Idempotency guard per consumer
    if (this.consumedKeys.has(consumerKey) && working.status !== 'failed') {
      const doneAt = new Date().toISOString().replace('.000Z', 'Z');
      working = {
        ...working,
        status: 'completed',
        isDuplicateIgnored: true,
        processedAt: doneAt,
        processedAtUtc: doneAt,
        error: undefined,
        errorDetails: 'Duplicate ignored by consumer idempotency guard',
      };
      this.updateEventStatus(working.id, working);
      onUpdate?.(working);
      return { duplicateIgnored: true };
    }

    const maxAttempts = working.maxAttempts || 3;
    const baseDelay = options?.fastRetry ? 60 : 120;

    for (let attempt = (working.attempts || 0) + 1; attempt <= maxAttempts; attempt++) {
      const nowTry = new Date().toISOString().replace('.000Z', 'Z');
      working = {
        ...working,
        status: 'processing',
        attempts: attempt,
        lamport: distributedClock.receive(working.lamport || 0),
      };
      this.updateEventStatus(working.id, working);
      onUpdate?.(working);

      // Simulate intra/inter-region network transit + exponential backoff
      const waitMs = attempt === 1 ? Math.min(80, working.latencyMs || 40) : baseDelay * Math.pow(2, attempt - 2);
      await new Promise((r) => setTimeout(r, waitMs));

      const health = target !== 'broadcast' && target !== 'event-bus' ? this.getServiceHealth(target) : 'up';
      if (health === 'down') {
        const failReason = `Target [${target}] DOWN / heartbeat missed (attempt ${attempt}/${maxAttempts})`;
        history.push({
          attempt,
          status: attempt < maxAttempts ? 'processing' : 'failed',
          timestampUtc: new Date().toISOString().replace('.000Z', 'Z'),
          backoffMs: baseDelay * Math.pow(2, attempt - 1),
          detail: failReason,
        });

        working = {
          ...working,
          attemptHistory: history,
          error: failReason,
          errorDetails: failReason,
        };

        if (attempt >= maxAttempts) {
          working.status = 'failed';
          this.updateEventStatus(working.id, working);
          onUpdate?.(working);
          return undefined;
        }
        this.updateEventStatus(working.id, working);
        onUpdate?.(working);
        continue;
      }

      // Target up: execute registered subsystem handler on a freshly serialized JSON copy
      const handler =
        target !== 'broadcast' && target !== 'event-bus'
          ? this.subscribers.get(working.eventType || working.type)?.get(target)
          : undefined;

      try {
        const handlerResult = handler ? await handler(serializeJsonBoundary(working)) : undefined;
        const doneUtc = new Date().toISOString().replace('.000Z', 'Z');

        this.consumedKeys.add(consumerKey);
        this.persistConsumedKeys();

        // Mirror event record into region isolated storage partition
        if (working.region) {
          regionNodes.writeToPartition(working.region, working.type, working.id, {
            correlationId: working.correlationId,
            lamport: working.lamport,
            source: working.sourceService,
            target: working.targetService,
          });
        }

        history.push({
          attempt,
          status: 'completed',
          timestampUtc: doneUtc,
          detail: 'Processed cleanly over UTF-8 JSON boundary',
        });

        working = {
          ...working,
          status: 'completed',
          processedAt: doneUtc,
          processedAtUtc: doneUtc,
          attemptHistory: history,
          error: undefined,
          errorDetails: undefined,
        };
        this.updateEventStatus(working.id, working);
        onUpdate?.(working);
        return handlerResult;
      } catch (err: any) {
        const errMsg = err?.message || 'Consumer handler failed';
        history.push({
          attempt,
          status: attempt < maxAttempts ? 'processing' : 'failed',
          timestampUtc: new Date().toISOString().replace('.000Z', 'Z'),
          backoffMs: baseDelay * Math.pow(2, attempt - 1),
          detail: errMsg,
        });
        working = {
          ...working,
          attemptHistory: history,
          error: errMsg,
          errorDetails: errMsg,
        };
        if (attempt >= maxAttempts) {
          working.status = 'failed';
          this.updateEventStatus(working.id, working);
          onUpdate?.(working);
          return undefined;
        }
      }
    }

    return undefined;
  }

  public async retryEvent(eventId: string): Promise<DistributedEvent | undefined> {
    const events = this.getStoredEvents();
    const target = events.find((e) => e.id === eventId);
    if (!target) return undefined;

    const reset: DistributedEvent = {
      ...target,
      status: 'pending',
      attempts: 0,
      error: undefined,
      errorDetails: undefined,
    };
    this.updateEventStatus(eventId, reset);
    await this.dispatchEnvelopeWithRetries(reset, undefined, { fastRetry: true });
    return this.getStoredEvents().find((e) => e.id === eventId);
  }

  public async retryAllFailed(): Promise<number> {
    const failed = this.getStoredEvents().filter((e) => e.status === 'failed');
    for (const ev of failed) {
      await this.retryEvent(ev.id);
    }
    return failed.length;
  }

  public clearQueue(): void {
    this.saveEvents([]);
  }

  public resetBroker(): void {
    this.consumedKeys.clear();
    localStorage.removeItem(STORAGE_KEY_CONSUMED);
    this.resetAllServices();
    this.clearQueue();
  }
}

export const broker = SimulatedDistributedBroker.getInstance();
