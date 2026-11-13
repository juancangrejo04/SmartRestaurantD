import { CurrencyCode } from '../types';
import { broker } from '../core/broker';

export type PaymentGatewayStatus = 'authorized' | 'captured' | 'failed' | 'refunded' | 'voided';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  idempotencyKey: string;
  amountMinorUnits: number;
  currency: CurrencyCode;
  paymentMethod: string;
  status: PaymentGatewayStatus;
  authorizationCode: string;
  failureReason?: string;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'smartrestaurant_v4_payments';

export class PaymentGatewayService {
  private static instance: PaymentGatewayService;

  private constructor() {
    broker.subscribe('PAYMENT_AUTHORIZE_REQUEST', 'payments-service', async (event) => {
      const p = event.payload || {};
      return this.authorizePayment({
        orderId: String(p.orderId),
        amountMinorUnits: Number(p.amountMinorUnits || 0),
        currency: (p.currency || 'USD') as CurrencyCode,
        paymentMethod: String(p.paymentMethod || 'card'),
        idempotencyKey: p.idempotencyKey ? String(p.idempotencyKey) : event.idempotencyKey,
        simulateFailure: Boolean(p.simulateFailure),
      });
    });

    broker.subscribe('PAYMENT_CAPTURE_REQUEST', 'payments-service', async (event) => {
      return this.capturePayment(String(event.payload?.paymentId || ''));
    });

    broker.subscribe('PAYMENT_VOID_REQUEST', 'payments-service', async (event) => {
      const p = event.payload || {};
      return this.voidAuthorization(String(p.paymentId || ''), String(p.reason || 'Order cancelled'));
    });

    broker.subscribe('PAYMENT_REFUND_REQUEST', 'payments-service', async (event) => {
      const p = event.payload || {};
      return this.refundPayment({
        orderId: String(p.orderId || ''),
        paymentId: p.paymentId ? String(p.paymentId) : undefined,
        reason: String(p.reason || 'Saga compensation'),
      });
    });
  }

  public static getInstance(): PaymentGatewayService {
    if (!PaymentGatewayService.instance) {
      PaymentGatewayService.instance = new PaymentGatewayService();
    }
    return PaymentGatewayService.instance;
  }

  private loadTransactions(): Record<string, PaymentTransaction> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveTransactions(txs: Record<string, PaymentTransaction>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
    } catch {
      // fallback
    }
  }

  /**
   * Authorize a payment hold.
   * If simulateFailure is true or payment method triggers a mock failure, returns failed transaction.
   */
  public async authorizePayment(params: {
    orderId: string;
    amountMinorUnits: number;
    currency: CurrencyCode;
    paymentMethod: string;
    idempotencyKey?: string;
    simulateFailure?: boolean;
  }): Promise<{ success: boolean; transaction: PaymentTransaction; error?: string }> {
    const txs = this.loadTransactions();
    const idempotencyKey = params.idempotencyKey || `idem-${params.orderId}-auth`;

    // Idempotency check: return existing if processed
    const existing = Object.values(txs).find((t) => t.idempotencyKey === idempotencyKey);
    if (existing) {
      return {
        success: existing.status === 'authorized' || existing.status === 'captured',
        transaction: existing,
      };
    }

    const txId = `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    if (params.simulateFailure) {
      const failedTx: PaymentTransaction = {
        id: txId,
        orderId: params.orderId,
        idempotencyKey,
        amountMinorUnits: params.amountMinorUnits,
        currency: params.currency,
        paymentMethod: params.paymentMethod,
        status: 'failed',
        authorizationCode: '',
        failureReason: 'Simulated issuer decline (insufficient funds)',
        createdAt: now,
        updatedAt: now,
      };
      txs[txId] = failedTx;
      this.saveTransactions(txs);

      broker.publish('PAYMENT_PROCESSED', {
        orderId: params.orderId,
        paymentId: txId,
        status: 'failed',
        amount: params.amountMinorUnits,
        currency: params.currency,
        reason: failedTx.failureReason,
      });

      return { success: false, transaction: failedTx, error: failedTx.failureReason };
    }

    const authTx: PaymentTransaction = {
      id: txId,
      orderId: params.orderId,
      idempotencyKey,
      amountMinorUnits: params.amountMinorUnits,
      currency: params.currency,
      paymentMethod: params.paymentMethod,
      status: 'authorized',
      authorizationCode: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: now,
      updatedAt: now,
    };

    txs[txId] = authTx;
    this.saveTransactions(txs);

    broker.publish('PAYMENT_PROCESSED', {
      orderId: params.orderId,
      paymentId: txId,
      status: 'authorized',
      amount: params.amountMinorUnits,
      currency: params.currency,
    });

    return { success: true, transaction: authTx };
  }

  /**
   * Capture a previously authorized payment
   */
  public async capturePayment(paymentId: string): Promise<{ success: boolean; transaction?: PaymentTransaction; error?: string }> {
    const txs = this.loadTransactions();
    const tx = txs[paymentId];

    if (!tx) {
      return { success: false, error: 'Transaction not found' };
    }

    if (tx.status !== 'authorized') {
      return { success: false, error: `Cannot capture transaction in status ${tx.status}` };
    }

    tx.status = 'captured';
    tx.updatedAt = new Date().toISOString();
    txs[paymentId] = tx;
    this.saveTransactions(txs);

    broker.publish('PAYMENT_PROCESSED', {
      orderId: tx.orderId,
      paymentId: tx.id,
      status: 'captured',
      amount: tx.amountMinorUnits,
      currency: tx.currency,
    });

    return { success: true, transaction: tx };
  }

  /**
   * Void an authorization before capture
   */
  public async voidAuthorization(paymentId: string, reason: string = 'Order cancelled'): Promise<{ success: boolean; transaction?: PaymentTransaction }> {
    const txs = this.loadTransactions();
    const tx = txs[paymentId];

    if (!tx) {
      return { success: false };
    }

    tx.status = 'voided';
    tx.failureReason = reason;
    tx.updatedAt = new Date().toISOString();
    txs[paymentId] = tx;
    this.saveTransactions(txs);

    broker.publish('PAYMENT_PROCESSED', {
      orderId: tx.orderId,
      paymentId: tx.id,
      status: 'voided',
      reason,
    });

    return { success: true, transaction: tx };
  }

  /**
   * Refund a captured payment (e.g. order cancelled after capture or customer dispute)
   */
  public async refundPayment(params: {
    orderId: string;
    paymentId?: string;
    reason: string;
  }): Promise<{ success: boolean; transaction?: PaymentTransaction; error?: string }> {
    const txs = this.loadTransactions();
    let tx: PaymentTransaction | undefined;

    if (params.paymentId && txs[params.paymentId]) {
      tx = txs[params.paymentId];
    } else {
      tx = Object.values(txs).find((t) => t.orderId === params.orderId && (t.status === 'captured' || t.status === 'authorized'));
    }

    if (!tx) {
      return { success: false, error: 'No capturable/refundable payment found for this order' };
    }

    tx.status = 'refunded';
    tx.refundReason = params.reason;
    tx.updatedAt = new Date().toISOString();
    txs[tx.id] = tx;
    this.saveTransactions(txs);

    broker.publish('PAYMENT_PROCESSED', {
      orderId: tx.orderId,
      paymentId: tx.id,
      status: 'refunded',
      amount: tx.amountMinorUnits,
      currency: tx.currency,
      reason: params.reason,
    });

    return { success: true, transaction: tx };
  }

  public getTransaction(paymentId: string): PaymentTransaction | null {
    const txs = this.loadTransactions();
    return txs[paymentId] || null;
  }

  public getTransactionByOrder(orderId: string): PaymentTransaction | null {
    const txs = this.loadTransactions();
    return Object.values(txs).find((t) => t.orderId === orderId) || null;
  }
}

export const paymentGatewayService = PaymentGatewayService.getInstance();
