import { Notification, DistributedEvent } from '../types';

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public createFromEvent(event: DistributedEvent): Notification | null {
    const id = `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = new Date().toISOString();

    const eventType = event.eventType || event.type;
    switch (eventType as any) {
      case 'RESERVATION_CREATED':
        return {
          id,
          type: 'reservation',
          title: 'Nueva Reservación Recibida',
          message: `Cliente ${event.payload.customerName || 'Invitado'} agendó Mesa #${event.payload.tableNumber} para ${event.payload.guestsCount || 2} personas.`,
          timestamp,
          read: false,
          metadata: event.payload,
        };

      case 'RESERVATION_CONFIRMED':
        return {
          id,
          type: 'reservation',
          title: 'Reservación Confirmada',
          message: `La reserva #${event.payload.reservationId} fue confirmada por el restaurante.`,
          timestamp,
          read: false,
          metadata: event.payload,
        };

      case 'ORDER_PLACED':
        return {
          id,
          type: 'order',
          title: `Nueva Comanda #${event.payload.orderNumber || ''}`,
          message: `Mesa #${event.payload.tableNumber} ha enviado un pedido con ${event.payload.itemsCount || 1} producto(s).`,
          timestamp,
          read: false,
          metadata: event.payload,
        };

      case 'ORDER_PREPARATION_STARTED':
        return {
          id,
          type: 'kitchen',
          title: 'Cocina en Marcha',
          message: `Comanda de Mesa #${event.payload.tableNumber} entró en preparación.`,
          timestamp,
          read: false,
          metadata: event.payload,
        };

      case 'ORDER_READY_FOR_PICKUP':
        return {
          id,
          type: 'kitchen',
          title: '¡Platos Listos en Cocina!',
          message: `Comanda de Mesa #${event.payload.tableNumber} lista para ser servida por el mesero.`,
          timestamp,
          read: false,
          metadata: event.payload,
        };

      case 'ORDER_DELIVERED':
        return {
          id,
          type: 'order',
          title: 'Pedido Entregado',
          message: `Comanda de Mesa #${event.payload.tableNumber} fue entregada en mesa.`,
          timestamp,
          read: false,
          metadata: event.payload,
        };

      case 'PRODUCT_AVAILABILITY_CHANGED':
        return {
          id,
          type: 'system',
          title: 'Disponibilidad de Carta Actualizada',
          message: `El producto "${event.payload.productName}" ahora está ${event.payload.available ? 'Disponible' : 'Agotado'}.`,
          timestamp,
          read: false,
          metadata: event.payload,
        };

      default:
        return null;
    }
  }

  public markAllAsRead(notifications: Notification[]): Notification[] {
    return notifications.map((n) => ({ ...n, read: true }));
  }

  public getUnreadCount(notifications: Notification[]): number {
    return notifications.filter((n) => !n.read).length;
  }
}

export const notificationService = NotificationService.getInstance();
