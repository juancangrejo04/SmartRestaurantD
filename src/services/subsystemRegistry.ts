import { broker } from '../core/broker';
import { authService } from './authService';
import { restaurantService } from './restaurantService';
import { reservationService } from './reservationService';
import { orderService } from './orderService';
import { kitchenService } from './kitchenService';
import { dispatchService } from './dispatchService';
import { paymentGatewayService } from './paymentGatewayService';
import { billingService } from './billingService';
import { notificationService } from './notificationService';
import { fxService } from './fxService';
import { analyticsService } from './analyticsService';
import { auditService } from './auditService';

let initialized = false;

/**
 * Ensures all 11 independent domain subsystems are booted and subscribed to the unified broker.
 */
export function initAllSubsystems(): void {
  if (initialized) return;
  initialized = true;

  // Reference instances so constructors register their broker subscriptions
  void authService;
  void restaurantService;
  void reservationService;
  void orderService;
  void kitchenService;
  void dispatchService;
  void paymentGatewayService;
  void billingService;
  void notificationService;
  void fxService;
  void analyticsService;
  void auditService;

  broker.subscribe('ORDER_CREATED', 'kitchen-service', async (event) => {
    return { ticketQueued: true, orderId: event.payload?.orderId };
  });

  broker.subscribe('ORDER_CREATED', 'notification-service', async (event) => {
    notificationService.createFromEvent(event);
    return { notified: true };
  });

  broker.subscribe('SAGA_COMPENSATED', 'notification-service', async (event) => {
    notificationService.createFromEvent(event);
    return { notified: true };
  });
}
