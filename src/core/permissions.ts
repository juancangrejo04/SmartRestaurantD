import { User, UserRole, CustomRole } from '../types';
import { useApp } from '../context/AppContext';

export type Permission =
  // Section 5.3 permissions
  | 'global.console'
  | 'regions.edit'
  | 'approvals.manage'
  | 'dashboard.consolidated'
  | 'dashboard.branch'
  | 'analytics.view'
  | 'branches.manage'
  | 'team.manage'
  | 'menu.edit'
  | 'menu.toggleAvailability'
  | 'orders.acceptDelivery'
  | 'kitchen.operate'
  | 'reservations.manage'
  | 'floor.operate'
  | 'tables.bill'
  | 'discounts.refunds'
  | 'orders.cancelDish'
  | 'courier.deliver'
  | 'reviews.moderate'
  | 'notifications.view'
  // Legacy aliases
  | 'orders.create'
  | 'orders.markDelivered'
  | 'orders.cancel'
  | 'kitchen.view'
  | 'kitchen.advance'
  | 'menu.view'
  | 'reservations.view'
  | 'reviews.view'
  | 'reviews.reply'
  | 'revenue.view'
  | 'monitor.view'
  | 'staff.manage'
  | 'tables.view'
  | 'tables.manage';

export const ROLE_DEFAULT_PERMISSIONS: Record<string, Permission[]> = {
  platform_admin: [
    'global.console',
    'regions.edit',
    'approvals.manage',
    'dashboard.consolidated',
    'dashboard.branch',
    'analytics.view',
    'branches.manage',
    'team.manage',
    'menu.edit',
    'menu.toggleAvailability',
    'orders.acceptDelivery',
    'kitchen.operate',
    'reservations.manage',
    'floor.operate',
    'tables.bill',
    'discounts.refunds',
    'orders.cancelDish',
    'courier.deliver',
    'reviews.moderate',
    'notifications.view',
    'orders.create',
    'orders.markDelivered',
    'orders.cancel',
    'kitchen.view',
    'kitchen.advance',
    'menu.view',
    'reservations.view',
    'reviews.view',
    'reviews.reply',
    'revenue.view',
    'monitor.view',
    'staff.manage',
    'tables.view',
    'tables.manage',
  ],
  owner: [
    'dashboard.consolidated',
    'dashboard.branch',
    'analytics.view',
    'branches.manage',
    'team.manage',
    'menu.edit',
    'menu.toggleAvailability',
    'orders.acceptDelivery',
    'kitchen.operate',
    'reservations.manage',
    'floor.operate',
    'tables.bill',
    'discounts.refunds',
    'orders.cancelDish',
    'reviews.moderate',
    'notifications.view',
    'orders.create',
    'orders.markDelivered',
    'orders.cancel',
    'kitchen.view',
    'kitchen.advance',
    'menu.view',
    'reservations.view',
    'reviews.view',
    'reviews.reply',
    'revenue.view',
    'monitor.view',
    'staff.manage',
    'tables.view',
    'tables.manage',
  ],
  branch_admin: [
    'dashboard.branch',
    'analytics.view',
    'branches.manage',
    'team.manage',
    'menu.edit',
    'menu.toggleAvailability',
    'orders.acceptDelivery',
    'kitchen.operate',
    'reservations.manage',
    'floor.operate',
    'tables.bill',
    'discounts.refunds',
    'orders.cancelDish',
    'reviews.moderate',
    'notifications.view',
    'approvals.manage', // for couriers of their branch
    'orders.create',
    'orders.markDelivered',
    'orders.cancel',
    'kitchen.view',
    'kitchen.advance',
    'menu.view',
    'reservations.view',
    'reviews.view',
    'reviews.reply',
    'revenue.view',
    'staff.manage',
    'tables.view',
    'tables.manage',
    'monitor.view',
  ],
  admin: [
    'dashboard.branch',
    'analytics.view',
    'branches.manage',
    'team.manage',
    'menu.edit',
    'menu.toggleAvailability',
    'orders.acceptDelivery',
    'kitchen.operate',
    'reservations.manage',
    'floor.operate',
    'tables.bill',
    'discounts.refunds',
    'orders.cancelDish',
    'reviews.moderate',
    'notifications.view',
    'orders.create',
    'orders.markDelivered',
    'orders.cancel',
    'kitchen.view',
    'kitchen.advance',
    'menu.view',
    'reservations.view',
    'reviews.view',
    'reviews.reply',
    'staff.manage',
    'tables.view',
    'tables.manage',
    'monitor.view',
  ],
  waiter: [
    'dashboard.branch',
    'floor.operate',
    'orders.acceptDelivery',
    'reservations.manage',
    'tables.bill',
    'orders.cancelDish',
    'notifications.view',
    'orders.create',
    'orders.markDelivered',
    'reservations.view',
    'tables.view',
    'tables.manage',
  ],
  kitchen: [
    'kitchen.operate',
    'menu.toggleAvailability',
    'notifications.view',
    'kitchen.view',
    'kitchen.advance',
  ],
  courier: [
    'courier.deliver',
    'notifications.view',
    'orders.markDelivered',
  ],
  cashier: [
    'tables.bill',
    'orders.acceptDelivery',
    'notifications.view',
    'orders.create',
    'tables.view',
  ],
  customer: [
    'notifications.view',
    'orders.create',
  ],
};

export interface PermissionContext {
  branchId?: string;
  brandId?: string;
  isKitchenStarted?: boolean;
}

const CUSTOM_ROLES_KEY = 'smartrestaurant_v4_custom_roles';

function getStoredCustomRoles(): CustomRole[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ROLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Core permission check function: can(user, permission, ctx?)
 */
export function can(user: User | null | undefined, permission: Permission, ctx?: PermissionContext): boolean {
  if (!user) return false;
  if (user.status === 'inactive' || user.status === 'pending') return false;

  // Platform admin has universal access
  if (user.role === 'platform_admin') return true;

  // Context branch scoping for branch_admin, waiter, kitchen
  const branchScope = user.assignedBranchId || user.branchId;
  if (ctx?.branchId && branchScope && user.role !== 'owner') {
    if (branchScope !== ctx.branchId) {
      return false;
    }
  }

  // Special constraint: cancel dish only before kitchen starts if waiter
  if (permission === 'orders.cancelDish' && user.role === 'waiter' && ctx?.isKitchenStarted) {
    return false;
  }

  // Check role default permissions
  const rolePerms = ROLE_DEFAULT_PERMISSIONS[user.role] || [];
  if (rolePerms.includes(permission)) return true;

  // Check custom roles stored in localStorage
  const customRole = getStoredCustomRoles().find((r) => r.id === user.role);
  if (customRole && customRole.permissions.includes(permission)) {
    return true;
  }

  return false;
}

/**
 * React hook for declarative UI permission checks
 */
export function useCan(permission: Permission, ctx?: PermissionContext): boolean {
  const { currentUser, activeBranchId } = useApp();
  return can(currentUser, permission, ctx || { branchId: activeBranchId });
}

/**
 * Backward-compatible hasPermission alias
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const perms = ROLE_DEFAULT_PERMISSIONS[role] || [];
  return perms.includes(permission);
}

/**
 * Anti-privilege escalation validator:
 * Validates if an actor is allowed to create or modify a user with a given role and permissions.
 */
export function validatePrivilegeEscalation(
  actor: User,
  targetRole: string,
  targetBranchId?: string,
  targetPermissions?: Permission[]
): { allowed: boolean; errorCode?: string; errorMessageKey?: string } {
  if (actor.status !== 'active') {
    return { allowed: false, errorCode: 'ERR_FORBIDDEN', errorMessageKey: 'err_forbidden_inactive' };
  }

  // Platform admin can create/manage anyone
  if (actor.role === 'platform_admin') {
    return { allowed: true };
  }

  // Owner cannot create platform_admin or another owner
  if (actor.role === 'owner') {
    if (targetRole === 'platform_admin' || targetRole === 'owner') {
      return { allowed: false, errorCode: 'ERR_FORBIDDEN', errorMessageKey: 'err_cannot_create_higher_role' };
    }
    // Permissions must be a subset of owner's permissions
    if (targetPermissions && targetPermissions.length > 0) {
      const actorPerms = ROLE_DEFAULT_PERMISSIONS.owner || [];
      const hasExtra = targetPermissions.some((p) => !actorPerms.includes(p));
      if (hasExtra) {
        return { allowed: false, errorCode: 'ERR_FORBIDDEN', errorMessageKey: 'err_cannot_grant_extra_permissions' };
      }
    }
    return { allowed: true };
  }

  // Branch admin can only create for their own branch, and cannot create platform_admin or owner
  if (actor.role === 'branch_admin' || actor.role === 'admin') {
    if (targetRole === 'platform_admin' || targetRole === 'owner') {
      return { allowed: false, errorCode: 'ERR_FORBIDDEN', errorMessageKey: 'err_cannot_create_higher_role' };
    }
    if (targetBranchId && targetBranchId !== actor.assignedBranchId) {
      return { allowed: false, errorCode: 'ERR_FORBIDDEN', errorMessageKey: 'err_branch_scope_violation' };
    }
    if (targetPermissions && targetPermissions.length > 0) {
      const actorPerms = ROLE_DEFAULT_PERMISSIONS.branch_admin || [];
      const hasExtra = targetPermissions.some((p) => !actorPerms.includes(p));
      if (hasExtra) {
        return { allowed: false, errorCode: 'ERR_FORBIDDEN', errorMessageKey: 'err_cannot_grant_extra_permissions' };
      }
    }
    return { allowed: true };
  }

  // Other roles cannot create users
  return { allowed: false, errorCode: 'ERR_FORBIDDEN', errorMessageKey: 'err_forbidden_action' };
}
