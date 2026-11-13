import { CountryCode, OrderSagaRecord, SagaStep } from '../types';
import { broker } from '../core/broker';

const STORAGE_KEY = 'smartrestaurant_v4_order_sagas';

/**
 * Distributed Order Saga Coordinator (within `order-service`).
 * Zero cross-service imports: executes compensating actions strictly through serialized broker messages.
 */
export class OrderSagaService {
  private static instance: OrderSagaService;

  private constructor() {}

  public static getInstance(): OrderSagaService {
    if (!OrderSagaService.instance) {
      OrderSagaService.instance = new OrderSagaService();
    }
    return OrderSagaService.instance;
  }

  private loadSagas(): Record<string, OrderSagaRecord> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveSagas(sagas: Record<string, OrderSagaRecord>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sagas));
    } catch {
      // Fallback
    }
  }

  public startSaga(orderId: string, region: CountryCode = 'CO'): OrderSagaRecord {
    const sagas = this.loadSagas();
    const now = new Date().toISOString().replace('.000Z', 'Z');

    const initialSteps: SagaStep[] = [
      {
        stepName: 'create_order',
        status: 'completed',
        idempotencyKey: `saga-${orderId}-create`,
        completedAt: now,
      },
      {
        stepName: 'authorize_payment',
        status: 'pending',
        idempotencyKey: `saga-${orderId}-auth`,
      },
      {
        stepName: 'confirm_commerce',
        status: 'pending',
        idempotencyKey: `saga-${orderId}-commerce`,
      },
      {
        stepName: 'assign_courier',
        status: 'pending',
        idempotencyKey: `saga-${orderId}-courier`,
      },
      {
        stepName: 'capture_payment',
        status: 'pending',
        idempotencyKey: `saga-${orderId}-capture`,
      },
    ];

    const saga: OrderSagaRecord = {
      orderId,
      status: 'executing',
      currentStep: 'authorize_payment',
      steps: initialSteps,
      createdAt: now,
      updatedAt: now,
    };

    sagas[orderId] = saga;
    this.saveSagas(sagas);

    broker.publish({
      sourceService: 'order-service',
      type: 'ORDER_CREATED',
      region,
      targetServices: ['notification-service', 'analytics-service'],
      payload: {
        orderId,
        sagaStep: 'create_order',
        sagaStatus: 'confirmed',
      },
    });

    return saga;
  }

  public advanceStep(
    orderId: string,
    stepName: SagaStep['stepName'],
    nextStep?: SagaStep['stepName'],
    region: CountryCode = 'CO'
  ): OrderSagaRecord | null {
    const sagas = this.loadSagas();
    const saga = sagas[orderId];
    if (!saga) return null;

    const step = saga.steps.find((s) => s.stepName === stepName);
    if (step) {
      step.status = 'completed';
      step.completedAt = new Date().toISOString().replace('.000Z', 'Z');
    }

    if (nextStep) {
      saga.currentStep = nextStep;
      const next = saga.steps.find((s) => s.stepName === nextStep);
      if (next && next.status === 'pending') {
        next.status = 'executing';
      }
    } else if (stepName === 'capture_payment') {
      saga.status = 'completed';
      saga.currentStep = 'completed';
    }

    saga.updatedAt = new Date().toISOString().replace('.000Z', 'Z');
    sagas[orderId] = saga;
    this.saveSagas(sagas);

    broker.publish({
      sourceService: 'order-service',
      type: 'ORDER_STATUS_CHANGED',
      region,
      targetServices: ['notification-service', 'analytics-service'],
      payload: {
        orderId,
        sagaStep: stepName,
        sagaStatus: 'confirmed',
        nextStep,
      },
    });

    return saga;
  }

  /**
   * Backward Saga Compensation strictly over serialized broker messages (zero inter-service imports).
   */
  public async executeCompensations(
    orderId: string,
    failedStep: SagaStep['stepName'],
    failureReason: string,
    region: CountryCode = 'CO'
  ): Promise<OrderSagaRecord | null> {
    const sagas = this.loadSagas();
    const saga = sagas[orderId];
    if (!saga) return null;

    saga.status = 'compensating';
    saga.failureReason = failureReason;

    const failed = saga.steps.find((s) => s.stepName === failedStep);
    if (failed) {
      failed.status = 'failed';
    }

    const completedSteps = saga.steps
      .filter((s) => s.status === 'completed')
      .map((s) => s.stepName);

    // 1. Compensate assign_courier via broker request to dispatch-service
    if (completedSteps.includes('assign_courier')) {
      await broker.request({
        sourceService: 'order-service',
        targetService: 'dispatch-service',
        eventType: 'DISPATCH_RELEASE_LEASE',
        region,
        payload: { orderId, reason: failureReason },
      });
      const step = saga.steps.find((s) => s.stepName === 'assign_courier');
      if (step) step.status = 'compensated';

      await broker.publish({
        sourceService: 'dispatch-service',
        type: 'COURIER_ASSIGNED',
        region,
        targetServices: ['notification-service'],
        payload: {
          orderId,
          status: 'released_compensation',
          reason: failureReason,
        },
      });
    }

    // 2. Compensate payment capture/authorization via broker request to payments-service
    if (completedSteps.includes('capture_payment')) {
      await broker.request({
        sourceService: 'order-service',
        targetService: 'payments-service',
        eventType: 'PAYMENT_REFUND_REQUEST',
        region,
        payload: {
          orderId,
          reason: `Saga compensation: ${failureReason}`,
        },
      });
      const step = saga.steps.find((s) => s.stepName === 'capture_payment');
      if (step) step.status = 'compensated';
    } else if (completedSteps.includes('authorize_payment')) {
      await broker.request({
        sourceService: 'order-service',
        targetService: 'payments-service',
        eventType: 'PAYMENT_REFUND_REQUEST',
        region,
        payload: {
          orderId,
          reason: `Saga void/refund compensation: ${failureReason}`,
        },
      });
      const step = saga.steps.find((s) => s.stepName === 'authorize_payment');
      if (step) step.status = 'compensated';
    }

    // 3. Compensate confirm_commerce
    if (completedSteps.includes('confirm_commerce')) {
      const step = saga.steps.find((s) => s.stepName === 'confirm_commerce');
      if (step) step.status = 'compensated';
    }

    // 4. Compensate create_order
    const createStep = saga.steps.find((s) => s.stepName === 'create_order');
    if (createStep) {
      createStep.status = 'compensated';
    }

    saga.status = 'compensated';
    saga.updatedAt = new Date().toISOString().replace('.000Z', 'Z');
    sagas[orderId] = saga;
    this.saveSagas(sagas);

    await broker.publish({
      sourceService: 'order-service',
      type: 'SAGA_COMPENSATED',
      region,
      targetServices: ['notification-service', 'analytics-service'],
      payload: {
        orderId,
        sagaStatus: 'compensated',
        failureReason,
        reversedSteps: completedSteps.reverse(),
      },
    });

    return saga;
  }

  public getSagaRecord(orderId: string): OrderSagaRecord | null {
    const sagas = this.loadSagas();
    return sagas[orderId] || null;
  }

  public getAllSagas(): OrderSagaRecord[] {
    const sagas = this.loadSagas();
    return Object.values(sagas);
  }
}

export const orderSagaService = OrderSagaService.getInstance();
