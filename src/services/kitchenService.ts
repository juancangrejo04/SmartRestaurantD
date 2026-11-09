import { Order, OrderStatus } from '../types';

export class KitchenService {
  private static instance: KitchenService;

  private constructor() {}

  public static getInstance(): KitchenService {
    if (!KitchenService.instance) {
      KitchenService.instance = new KitchenService();
    }
    return KitchenService.instance;
  }

  public getKitchenOrders(orders: Order[], branchId?: string): {
    received: Order[];
    preparing: Order[];
    ready: Order[];
    delivered: Order[];
  } {
    const filtered = branchId ? orders.filter((o) => o.branchId === branchId) : orders;
    return {
      received: filtered.filter((o) => o.status === 'received'),
      preparing: filtered.filter((o) => o.status === 'preparing'),
      ready: filtered.filter((o) => o.status === 'ready'),
      delivered: filtered.filter((o) => o.status === 'delivered').slice(-10), // keep recent 10 delivered
    };
  }

  public getElapsedMinutes(isoCreatedAt: string): number {
    const diffMs = Date.now() - new Date(isoCreatedAt).getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  }

  public getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    switch (currentStatus) {
      case 'received':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'delivered';
      default:
        return null;
    }
  }
}

export const kitchenService = KitchenService.getInstance();
