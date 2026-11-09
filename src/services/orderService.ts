import { Order, OrderItem, OrderStatus, PaymentStatus, CountryCode } from '../types';
import { COUNTRIES } from '../i18n/countries';

export class OrderService {
  private static instance: OrderService;

  private constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  public createOrder(params: {
    branchId: string;
    restaurantId: string;
    tableId: string;
    tableNumber: number;
    items: OrderItem[];
    countryCode: CountryCode;
    tipPercentage?: number; // e.g. 10 for 10%
    customerName?: string;
  }): Order {
    const countryConfig = COUNTRIES[params.countryCode];
    const subtotal = params.items.reduce((sum, item) => sum + item.subtotal, 0);
    const taxRate = countryConfig.taxRate;
    const taxAmount = Number((subtotal * taxRate).toFixed(2));
    const tipRate = (params.tipPercentage || 0) / 100;
    const tipAmount = Number((subtotal * tipRate).toFixed(2));
    const total = Number((subtotal + taxAmount + tipAmount).toFixed(2));

    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    const orderNumber = `CMD-${randomSuffix}`;

    return {
      id: `ord-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      orderNumber,
      branchId: params.branchId,
      restaurantId: params.restaurantId,
      tableId: params.tableId,
      tableNumber: params.tableNumber,
      items: params.items,
      subtotal,
      taxRate,
      taxAmount,
      tipAmount,
      total,
      currency: countryConfig.currency,
      status: 'received',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedReadyMinutes: 15,
      customerName: params.customerName || `Mesa ${params.tableNumber}`,
    };
  }

  public updateOrderStatus(orders: Order[], orderId: string, status: OrderStatus): Order[] {
    return orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
  }

  public processPayment(
    orders: Order[],
    orderId: string,
    method: 'card' | 'cash' | 'qr_transfer'
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
