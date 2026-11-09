import { DistributedEvent, EventType, ServiceName, EventStatus, ServiceHealth } from '../types';

export type EventSubscriber = (event: DistributedEvent) => Promise<void> | void;

export class SimulatedEventBus {
  private static instance: SimulatedEventBus;
  private subscribers: Map<EventType, EventSubscriber[]> = new Map();
  private processedIdempotencyKeys: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): SimulatedEventBus {
    if (!SimulatedEventBus.instance) {
      SimulatedEventBus.instance = new SimulatedEventBus();
    }
    return SimulatedEventBus.instance;
  }

  public subscribe(eventType: EventType, subscriber: EventSubscriber): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(subscriber);
    return () => {
      const subs = this.subscribers.get(eventType) || [];
      this.subscribers.set(
        eventType,
        subs.filter((s) => s !== subscriber)
      );
    };
  }

  /**
   * Generates a unique event and processes it asynchronously through the bus
   */
  public createEventEnvelope(params: {
    sourceService: ServiceName;
    targetService: ServiceName | 'event-bus' | 'broadcast';
    eventType: EventType;
    payload: Record<string, any>;
    idempotencyKey?: string;
  }): DistributedEvent {
    const id = `evt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const idempotencyKey = params.idempotencyKey || `idemp-${params.eventType.toLowerCase()}-${id}`;

    return {
      id,
      timestamp: new Date().toISOString(),
      sourceService: params.sourceService,
      targetService: params.targetService,
      eventType: params.eventType,
      payload: params.payload,
      status: 'pending',
      attempts: 0,
      maxAttempts: 3,
      idempotencyKey,
      latencyMs: Math.floor(Math.random() * 25) + 15,
    };
  }

  /**
   * Dispatches the event with simulated latency, checking service health and idempotency
   */
  public async dispatchEvent(
    event: DistributedEvent,
    servicesHealth: ServiceHealth[],
    onUpdateEvent: (updated: DistributedEvent) => void
  ): Promise<DistributedEvent> {
    // 1. Mark as processing
    let currentEvent: DistributedEvent = {
      ...event,
      status: 'processing',
      attempts: event.attempts + 1,
    };
    onUpdateEvent(currentEvent);

    // Simulate async network transit delay (250ms)
    await new Promise((resolve) => setTimeout(resolve, 250));

    // 2. Check Idempotency
    if (this.processedIdempotencyKeys.has(event.idempotencyKey) && event.status === 'completed') {
      currentEvent = {
        ...currentEvent,
        status: 'completed',
        errorDetails: 'Idempotent duplicate: Event already committed by bus. Skipped replay.',
      };
      onUpdateEvent(currentEvent);
      return currentEvent;
    }

    // 3. Check Target Service Health (Chaos / Failure Injection)
    if (event.targetService !== 'broadcast' && event.targetService !== 'event-bus') {
      const targetHealth = servicesHealth.find((s) => s.id === event.targetService);
      if (targetHealth && targetHealth.status === 'down') {
        currentEvent = {
          ...currentEvent,
          status: 'failed',
          errorDetails: `Destino inaccesible: Servicio [${targetHealth.name}] se encuentra FUERA DE LÍNEA. Guardado en Dead Letter Queue para reintento.`,
        };
        onUpdateEvent(currentEvent);
        return currentEvent;
      }
    }

    // 4. Execute all registered domain subscribers
    const handlers = this.subscribers.get(event.eventType) || [];
    try {
      for (const handler of handlers) {
        await handler(currentEvent);
      }
      this.processedIdempotencyKeys.add(event.idempotencyKey);
      currentEvent = {
        ...currentEvent,
        status: 'completed',
        errorDetails: undefined,
      };
    } catch (err: any) {
      currentEvent = {
        ...currentEvent,
        status: 'failed',
        errorDetails: err?.message || 'Error durante la ejecución del suscriptor de servicio.',
      };
    }

    onUpdateEvent(currentEvent);
    return currentEvent;
  }
}

export const eventBus = SimulatedEventBus.getInstance();
