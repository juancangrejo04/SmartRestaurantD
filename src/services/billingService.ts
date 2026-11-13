import { CountryCode, Order, RegionProfile, TaxBreakdownItem } from '../types';
import { getRegionProfile } from '../data/regions';
import { broker } from '../core/broker';

export interface BillingReceiptSnapshot {
  orderId: string;
  orderNumber: string;
  fiscalNumber: string;
  region: CountryCode;
  documentTypeKey: string;
  officialAuthority: string;
  electronicInvoiceSystem: string;
  issuedAtUtc: string;
  subtotalMinorUnits: number;
  deliveryFeeMinorUnits: number;
  taxBreakdown: TaxBreakdownItem[];
  totalTaxMinorUnits: number;
  tipAmountMinorUnits: number;
  totalMinorUnits: number;
  platformCommissionMinorUnits: number;
}

/**
 * Billing & Tax Subsystem (`billing-service`).
 * Strictly decoupled: calculates fiscal documents and tax breakdowns from RegionProfile rules.
 */
export class BillingService {
  private static instance: BillingService;

  private constructor() {
    broker.subscribe('ORDER_PAID', 'billing-service', async (event) => {
      if (event.payload?.orderId) {
        await broker.publish({
          sourceService: 'billing-service',
          type: 'INVOICE_GENERATED',
          region: event.region || 'CO',
          targetServices: ['notification-service', 'analytics-service'],
          correlationId: event.correlationId,
          payload: {
            orderId: event.payload.orderId,
            fiscalNumber: event.payload.fiscalNumber || `FE-${Date.now().toString(36)}`,
            issuedAtUtc: new Date().toISOString().replace('.000Z', 'Z'),
          },
        });
      }
    });
  }

  public static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  public generateFiscalReceiptSnapshot(order: Order, region: CountryCode): BillingReceiptSnapshot {
    const profile: RegionProfile = getRegionProfile(region);
    const subtotal = order.subtotalMinorUnits ?? 0;
    const deliveryFee = order.deliveryFeeMinorUnits ?? 0;
    const totalTax = order.taxAmountMinorUnits ?? 0;
    const tip = order.tipAmountMinorUnits ?? 0;
    const total = order.totalMinorUnits ?? subtotal + deliveryFee + totalTax + tip;
    const commissionMinorUnits = Math.round(
      (subtotal * (profile.revenueModel.platformCommissionBps || 1500)) / 10000
    );

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      fiscalNumber: order.fiscalNumber || `${profile.code}-FE-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      region,
      documentTypeKey: profile.receipt.documentTypeKey,
      officialAuthority: profile.receipt.officialAuthority,
      electronicInvoiceSystem: profile.receipt.electronicInvoiceSystem,
      issuedAtUtc: (order.createdAt || new Date().toISOString()).replace('.000Z', 'Z'),
      subtotalMinorUnits: subtotal,
      deliveryFeeMinorUnits: deliveryFee,
      taxBreakdown: order.taxBreakdown || [],
      totalTaxMinorUnits: totalTax,
      tipAmountMinorUnits: tip,
      totalMinorUnits: total,
      platformCommissionMinorUnits: commissionMinorUnits,
    };
  }
}

export const billingService = BillingService.getInstance();
