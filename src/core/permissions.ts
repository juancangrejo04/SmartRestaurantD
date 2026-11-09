import { UserRole } from '../types';
import { useApp } from '../context/AppContext';

export type Permission =
  | 'orders.create'
  | 'orders.markDelivered'
  | 'orders.cancel'
  | 'kitchen.view'
  | 'kitchen.advance'
  | 'menu.view'
  | 'menu.edit'
  | 'menu.toggleAvailability'
  | 'reservations.view'
  | 'reservations.manage'
  | 'reviews.view'
  | 'reviews.reply'
  | 'reviews.moderate'
  | 'analytics.view'
  | 'revenue.view'
  | 'branches.manage'
  | 'monitor.view'
  | 'staff.manage'
  | 'tables.view'
  | 'tables.manage'
  | 'tables.bill';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    'orders.create',
    'orders.markDelivered',
    'orders.cancel',
    'kitchen.view',
    'kitchen.advance',
    'menu.view',
    'menu.edit',
    'menu.toggleAvailability',
    'reservations.view',
    'reservations.manage',
    'reviews.view',
    'reviews.reply',
    'reviews.moderate',
    'analytics.view',
    'revenue.view',
    'branches.manage',
    'monitor.view',
    'staff.manage',
    'tables.view',
    'tables.manage',
    'tables.bill',
  ],
  admin: [
    'orders.create',
    'orders.markDelivered',
    'orders.cancel',
    'kitchen.view',
    'kitchen.advance',
    'menu.view',
    'menu.edit',
    'menu.toggleAvailability',
    'reservations.view',
    'reservations.manage',
    'reviews.view',
    'reviews.reply',
    'analytics.view',
    'tables.view',
    'tables.manage',
    'tables.bill',
  ],
  waiter: [
    'orders.create',
    'orders.markDelivered',
    'reservations.view',
    'reservations.manage',
    'tables.view',
    'tables.manage',
    'tables.bill',
  ],
  kitchen: [
    'kitchen.view',
    'kitchen.advance',
    'menu.toggleAvailability',
  ],
  customer: [
    'orders.create',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * React hook to check if the active user role has a specific permission
 */
export function useCan(permission: Permission): boolean {
  const { currentUser } = useApp();
  return hasPermission(currentUser.role, permission);
}
