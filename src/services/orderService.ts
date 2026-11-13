import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  CountryCode,
  DeliveryAddress,
  OrderType,
  TaxBreakdownItem,
} from '../types';
import { getRegionProfile } from '../data/regions';
import { broker } from '../core/broker';

export class OrderService {
  private static instance: OrderService;

  private constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * Calculate taxes based on the RegionProfile's tax rules for the order type and jurisdiction
   */
  public calculateTaxes(
    subtotalMinorUnits: number,
    deliveryFeeMinorUnits: number,
    countryCode: CountryCode,
    orderType: OrderType = 'delivery',
    jurisdictionHint?: string
  ): { taxBreakdown: TaxBreakdownItem[]; totalTaxMinorUnits: number } {
    const profile = getRegionProfile(countryCode);
    const breakdown: TaxBreakdownItem[] = [];
    let totalTax = 0;

    const matchingRules = profile.taxRules.filter(
      (rule) => rule.orderType === '*' || rule.orderType === orderType
    );

    // Group rules by appliesTo so competing jurisdiction rules (e.g., NY vs NJ) pick best match
    const normalizedHint = (jurisdictionHint || '').trim().toUpperCase();
    const preparedFoodRules = matchingRules.filter((r) => r.appliesTo === 'prepared_food');
    let selectedFoodRules = preparedFoodRules;

    if (preparedFoodRules.length > 1) {
      const exactMatch = normalizedHint
        ? preparedFoodRules.find(
            (r) =>
              r.jurisdiction &&
              (r.jurisdiction.toUpperCase() === normalizedHint ||
                r.jurisdiction.toUpperCase().includes(normalizedHint) ||
                normalizedHint.includes(r.jurisdiction.toUpperCase()))
          )
        : undefined;
      selectedFoodRules = [exactMatch || preparedFoodRules[0]];
    }

    const activeRules = [
      ...selectedFoodRules,
      ...matchingRules.filter((r) => r.appliesTo !== 'prepared_food'),
    ];

    for (const rule of activeRules) {
      let taxableAmount = 0;
      if (rule.appliesTo === 'prepared_food') {
        taxableAmount += subtotalMinorUnits;
      }
      if (rule.appliesTo === 'delivery_fee' && orderType === 'delivery') {
        taxableAmount += deliveryFeeMinorUnits;
      }

      if (taxableAmount > 0) {
        const amount = Math.round((taxableAmount * rule.rateBps) / 10000);
        breakdown.push({
          id: rule.id,
          labelKey: rule.labelKey,
          rateBps: rule.rateBps,
          amountMinorUnits: amount,
        });
        totalTax += amount;
      }
    }

    return { taxBreakdown: breakdown, totalTaxMinorUnits: totalTax };
  }

  /**
   * Calculate tip based on basis points (e.g. 1000 = 10%)
   */
  public calculateTip(subtotalMinorUnits: number, tipBps: number): number {
    return Math.round((subtotalMinorUnits * tipBps) / 10000);
  }

  /**
   * Create a comprehensive delivery or table order
   */
  public createOrder(params: {
    branchId: string;
    restaurantId: string;
    items: OrderItem[];
    countryCode: CountryCode;
    orderType?: OrderType;
    tableId?: string;
    tableNumber?: number;
    deliveryAddress?: DeliveryAddress;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    tipBps?: number;
    tipPercentage?: number;
    paymentMethod?: string;
    userId?: string;
    kitchenNotes?: string;
    createdAtUtcOverride?: string;
    deliveryFeeMinorUnitsOverride?: number;
  }): Order {
    const profile = getRegionProfile(params.countryCode);
    const orderType = params.orderType || (params.tableNumber ? 'dine_in' : 'delivery');

    // Calculate subtotal in minor units
    let subtotalMinorUnits = 0;
    for (const item of params.items) {
      const itemSubtotal =
        item.subtotalMinorUnits ??
        (item.unitPriceMinorUnits !== undefined
          ? item.unitPriceMinorUnits * item.quantity
          : item.subtotal !== undefined
          ? Math.round(item.subtotal)
          : 0);
      subtotalMinorUnits += itemSubtotal;
    }

    // Delivery fee (only for delivery orders)
    const deliveryFeeMinorUnits =
      orderType === 'delivery'
        ? (params.deliveryFeeMinorUnitsOverride ?? profile.revenueModel.baseDeliveryFeeMinorUnits)
        : 0;

    // Tip
    const tipBps =
      params.tipBps ??
      (params.tipPercentage !== undefined
        ? Math.round(params.tipPercentage * 100)
        : profile.tipPolicy.defaultBps);
    const tipAmountMinorUnits = this.calculateTip(subtotalMinorUnits, tipBps);

    // Taxes (jurisdiction-aware for delivery destination)
    const { taxBreakdown, totalTaxMinorUnits } = this.calculateTaxes(
      subtotalMinorUnits,
      deliveryFeeMinorUnits,
      params.countryCode,
      orderType,
      params.deliveryAddress?.stateOrPrefecture || params.deliveryAddress?.city
    );

    // Grand total
    const totalMinorUnits =
      subtotalMinorUnits + deliveryFeeMinorUnits + totalTaxMinorUnits + tipAmountMinorUnits;

    // Generate random 4-digit delivery PIN for courier verification
    const deliveryPin = Math.floor(1000 + Math.random() * 9000).toString();

    // Fiscal receipt number (CUFE / NF-e format)
    const fiscalSuffix = Math.floor(100000 + Math.random() * 900000);
    const fiscalNumber = `${profile.code}-FE-2026-${fiscalSuffix}`;

    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    const orderNumber = orderType === 'delivery' ? `DOM-${randomSuffix}` : `CMD-${randomSuffix}`;
    const now = params.createdAtUtcOverride || new Date().toISOString().replace('.000Z', 'Z');

    // Initialize dishStatuses
    const dishStatuses: Record<string, 'queued' | 'preparing' | 'ready' | 'served'> = {};
    params.items.forEach((item, idx) => {
      dishStatuses[`dish_${idx}_${item.menuItemId}`] = 'queued';
    });

    const isZeroDecimal = profile.fractionDigits === 0;
    const divisor = isZeroDecimal ? 1 : Math.pow(10, profile.fractionDigits);

    const order: Order = {
      id: `ord_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      orderNumber,
      branchId: params.branchId,
      restaurantId: params.restaurantId,
      userId: params.userId,
      orderType,
      tableId: params.tableId,
      tableNumber: params.tableNumber,
      deliveryAddress: params.deliveryAddress,
      deliveryPin: orderType === 'delivery' ? deliveryPin : undefined,
      fiscalNumber,
      taxBreakdown,
      items: params.items,
      subtotalMinorUnits,
      deliveryFeeMinorUnits,
      taxAmountMinorUnits: totalTaxMinorUnits,
      tipAmountMinorUnits,
      totalMinorUnits,
      subtotal: subtotalMinorUnits / divisor,
      taxAmount: totalTaxMinorUnits / divisor,
      tipAmount: tipAmountMinorUnits / divisor,
      total: totalMinorUnits / divisor,
      currency: profile.currency,
      status: 'received',
      paymentMethod: params.paymentMethod || 'card',
      paymentStatus: 'pending',
      createdAt: now,
      updatedAt: now,
      estimatedReadyMinutes: 20,
      preparationTimeMinutes: 20,
      customerName: params.customerName || (params.tableNumber ? `Mesa ${params.tableNumber}` : 'Cliente'),
      customerPhone: params.customerPhone,
      customerEmail: params.customerEmail,
      kitchenNotes: params.kitchenNotes,
      dishStatuses,
    };

    broker.publish('ORDER_CREATED', {
      orderId: order.id,
      branchId: order.branchId,
      orderType: order.orderType,
      totalMinorUnits: order.totalMinorUnits,
      currency: order.currency,
    });

    return order;
  }

  public updateOrderStatus(orders: Order[], orderId: string, status: OrderStatus): Order[] {
    return orders.map((o) => {
      if (o.id === orderId) {
        const updated = {
          ...o,
          status,
          updatedAt: new Date().toISOString(),
        };

        broker.publish('ORDER_STATUS_CHANGED', {
          orderId,
          status,
          branchId: o.branchId,
        });

        return updated;
      }
      return o;
    });
  }

  public updateDishStatus(
    orders: Order[],
    orderId: string,
    dishKey: string,
    dishStatus: 'queued' | 'preparing' | 'ready' | 'served'
  ): Order[] {
    return orders.map((o) => {
      if (o.id === orderId) {
        const statuses = { ...(o.dishStatuses || {}) };
        statuses[dishKey] = dishStatus;
        return {
          ...o,
          dishStatuses: statuses,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
  }

  public assignCourier(orders: Order[], orderId: string, courierId: string, courierName: string): Order[] {
    return orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          courierId,
          courierName,
          status: 'delivering' as OrderStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
  }

  public cancelOrder(orders: Order[], orderId: string, reason: string): Order[] {
    return orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'cancelled' as OrderStatus,
          cancellationReason: reason,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
  }

  public submitReview(
    orders: Order[],
    orderId: string,
    params: {
      commerceRating?: { rating: number; comment?: string };
      courierRating?: { rating: number; comment?: string };
    }
  ): Order[] {
    const now = new Date().toISOString();
    return orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          commerceRating: params.commerceRating ? { ...params.commerceRating, ratedAt: now } : o.commerceRating,
          courierRating: params.courierRating ? { ...params.courierRating, ratedAt: now } : o.courierRating,
          updatedAt: now,
        };
      }
      return o;
    });
  }

  public processPayment(
    orders: Order[],
    orderId: string,
    method: string
  ): Order[] {
    return orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus: 'paid' as PaymentStatus,
          paymentMethod: method,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
  }
}

export const orderService = OrderService.getInstance();
