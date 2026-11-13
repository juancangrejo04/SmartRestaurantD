import { AppNotification, DistributedEvent, UserRole } from '../types';

export interface KeyedNotificationParams {
  type: AppNotification['type'];
  titleKey: string;
  messageKey: string;
  messageParams?: Record<string, string | number>;
  targetRole?: UserRole;
  targetBranchId?: string;
  targetUserId?: string;
  metadata?: Record<string, unknown>;
}

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public createKeyedNotification(params: KeyedNotificationParams): AppNotification {
    const id = `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const nowUtc = new Date().toISOString();

    return {
      id,
      type: params.type,
      titleKey: params.titleKey,
      messageKey: params.messageKey,
      messageParams: params.messageParams || {},
      timestamp: nowUtc,
      instantUtc: nowUtc,
      read: false,
      targetRole: params.targetRole,
      targetBranchId: params.targetBranchId,
      targetUserId: params.targetUserId,
      metadata: params.metadata,
    };
  }

  public createFromEvent(event: DistributedEvent): AppNotification | null {
    const eventType = (event.eventType || event.type) as string;
    const payload = event.payload || {};

    switch (eventType) {
      case 'RESERVATION_CREATED':
        return this.createKeyedNotification({
          type: 'reservation',
          titleKey: 'notif_res_created_title',
          messageKey: 'notif_res_created_msg',
          messageParams: {
            customer: String(payload.customerName || ''),
            table: String(payload.tableNumber || ''),
            guests: String(payload.guestsCount || 2),
          },
          targetBranchId: payload.branchId,
          targetRole: 'waiter',
          metadata: payload,
        });

      case 'RESERVATION_CONFIRMED':
        return this.createKeyedNotification({
          type: 'reservation',
          titleKey: 'notif_res_confirmed_title',
          messageKey: 'notif_res_confirmed_msg',
          messageParams: {
            code: String(payload.code || payload.reservationId || ''),
          },
          targetUserId: payload.userId,
          targetBranchId: payload.branchId,
          metadata: payload,
        });

      case 'RESERVATION_CANCELLED':
        return this.createKeyedNotification({
          type: 'reservation',
          titleKey: 'notif_res_cancelled_title',
          messageKey: 'notif_res_cancelled_msg',
          messageParams: {
            code: String(payload.code || payload.reservationId || ''),
          },
          targetUserId: payload.userId,
          targetBranchId: payload.branchId,
          metadata: payload,
        });

      case 'ORDER_PLACED':
      case 'ORDER_CREATED':
        return this.createKeyedNotification({
          type: 'order',
          titleKey: 'notif_order_created_title',
          messageKey: 'notif_order_created_msg',
          messageParams: {
            order: String(payload.orderNumber || payload.orderId || ''),
            items: String(payload.itemsCount || 1),
          },
          targetBranchId: payload.branchId,
          targetRole: 'kitchen',
          metadata: payload,
        });

      case 'ORDER_PREPARATION_STARTED':
      case 'ORDER_PREPARING':
        return this.createKeyedNotification({
          type: 'kitchen',
          titleKey: 'notif_order_kitchen_title',
          messageKey: 'notif_order_kitchen_msg',
          messageParams: {
            order: String(payload.orderNumber || payload.orderId || ''),
          },
          targetUserId: payload.userId,
          targetBranchId: payload.branchId,
          metadata: payload,
        });

      case 'ORDER_READY_FOR_PICKUP':
      case 'ORDER_READY':
        return this.createKeyedNotification({
          type: 'kitchen',
          titleKey: 'notif_order_ready_title',
          messageKey: 'notif_order_ready_msg',
          messageParams: {
            order: String(payload.orderNumber || payload.orderId || ''),
          },
          targetUserId: payload.userId,
          targetBranchId: payload.branchId,
          targetRole: 'waiter',
          metadata: payload,
        });

      case 'ORDER_COURIER_ASSIGNED':
      case 'COURIER_ASSIGNED':
        return this.createKeyedNotification({
          type: 'order',
          titleKey: 'notif_courier_assigned_title',
          messageKey: 'notif_courier_assigned_msg',
          messageParams: {
            order: String(payload.orderNumber || payload.orderId || ''),
            courier: String(payload.courierName || ''),
          },
          targetUserId: payload.userId,
          targetBranchId: payload.branchId,
          metadata: payload,
        });

      case 'ORDER_DELIVERED':
        return this.createKeyedNotification({
          type: 'order',
          titleKey: 'notif_order_delivered_title',
          messageKey: 'notif_order_delivered_msg',
          messageParams: {
            order: String(payload.orderNumber || payload.orderId || ''),
          },
          targetUserId: payload.userId,
          targetBranchId: payload.branchId,
          metadata: payload,
        });

      case 'PRODUCT_AVAILABILITY_CHANGED':
        return this.createKeyedNotification({
          type: 'system',
          titleKey: 'notif_product_availability_title',
          messageKey: payload.available
            ? 'notif_product_available_msg'
            : 'notif_product_unavailable_msg',
          messageParams: {
            product: String(payload.productName || ''),
          },
          targetBranchId: payload.branchId,
          metadata: payload,
        });

      default:
        return null;
    }
  }

  public markAllAsRead(notifications: AppNotification[]): AppNotification[] {
    return notifications.map((n) => ({ ...n, read: true }));
  }

  public getUnreadCount(notifications: AppNotification[]): number {
    return notifications.filter((n) => !n.read).length;
  }
}

export const notificationService = NotificationService.getInstance();
