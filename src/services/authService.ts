import { User, UserRole, Language, CountryCode, CustomRole, Order, Reservation, Review } from '../types';
import { SEED_USERS } from '../data/seedData';
import {
  hashPasswordWithSalt,
  createUserSession,
  isSessionValid,
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginRateLimit,
  StoredSession,
  generateSalt,
  validatePasswordStrength,
} from '../core/security';
import { auditStore as auditService } from '../core/auditStore';
import { broker } from '../core/broker';
import { Permission, validatePrivilegeEscalation } from '../core/permissions';
import { getRegionProfile } from '../data/regions';

const USERS_STORAGE_KEY = 'smartrestaurant_v4_users';
const SESSION_STORAGE_KEY = 'smartrestaurant_v4_session';
const CURRENT_USER_KEY = 'smartrestaurant_v4_auth_user';
const CUSTOM_ROLES_KEY = 'smartrestaurant_v4_custom_roles';

export interface LoginResult {
  success: boolean;
  user?: User;
  session?: StoredSession;
  messageKey?: string;
  locked?: boolean;
  remainingSeconds?: number;
}

export interface PersonalDataExport {
  exportedAtUtc: string;
  homeRegion: CountryCode;
  dataRegion: string;
  applicableLaw: string;
  legalBasis: string;
  retentionMonths: number;
  internationalTransferRestricted: boolean;
  profile: {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    role: UserRole | string;
    preferredLanguage?: Language;
    timeZone?: string;
    country: CountryCode;
    homeRegion: CountryCode;
    createdAtUtc?: string;
    consentAcceptedAtUtc?: string;
    consentVersion?: string;
  };
  orders: Order[];
  reservations: Reservation[];
  reviews: Review[];
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getUsers(): User[] {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    try {
      const parsed: User[] = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  }

  public saveUsers(users: User[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  public getCurrentSession(): StoredSession | null {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    try {
      const session: StoredSession = JSON.parse(raw);
      if (isSessionValid(session)) {
        return session;
      }
      this.clearSession();
      return null;
    } catch {
      this.clearSession();
      return null;
    }
  }

  public getInitialUser(): User | null {
    const session = this.getCurrentSession();
    if (!session) return null;
    const users = this.getUsers();
    const user = users.find((u) => u.id === session.userId && u.status === 'active');
    return user || null;
  }

  public async login(email: string, password: string): Promise<LoginResult> {
    const cleanEmail = email.trim().toLowerCase();

    const rateLimit = checkLoginRateLimit(cleanEmail);
    if (rateLimit.locked) {
      return {
        success: false,
        locked: true,
        remainingSeconds: rateLimit.remainingSeconds,
        messageKey: 'auth_err_rate_limited',
      };
    }

    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      recordFailedLogin(cleanEmail);
      auditService.record({
        actorId: 'anonymous',
        actorName: cleanEmail,
        actorRole: 'anonymous',
        action: 'AUTH_FAILED',
        details: 'Login failed: account not found.',
      });
      return { success: false, messageKey: 'auth_err_invalid_credentials' };
    }

    if (user.status === 'pending') {
      return { success: false, messageKey: 'auth_err_pending_approval' };
    }
    if (user.status === 'inactive') {
      return { success: false, messageKey: 'auth_err_account_deactivated' };
    }

    let passwordMatches = false;
    if (user.passwordHash && user.passwordSalt) {
      const computedHash = await hashPasswordWithSalt(password, user.passwordSalt);
      passwordMatches = computedHash === user.passwordHash;
    }

    if (!passwordMatches) {
      const failState = recordFailedLogin(cleanEmail);
      auditService.record({
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: 'AUTH_FAILED',
        details: `Invalid password attempt #${failState.attempts}.`,
        region: user.country,
      });

      if (failState.locked) {
        return {
          success: false,
          locked: true,
          remainingSeconds: failState.remainingSeconds,
          messageKey: 'auth_err_rate_limited',
        };
      }

      return { success: false, messageKey: 'auth_err_invalid_credentials' };
    }

    clearLoginRateLimit(cleanEmail);
    const session = createUserSession(user);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    auditService.record({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'AUTH_LOGIN',
      details: 'Authenticated with salted SHA-256 hash; 8h session issued.',
      region: user.country,
    });

    return {
      success: true,
      user,
      session,
    };
  }

  public async changeOwnPassword(userId: string, newPassword: string): Promise<User> {
    const pwdCheck = validatePasswordStrength(newPassword);
    if (!pwdCheck.valid) {
      throw new Error(pwdCheck.messageKey || 'auth_err_pwd_short');
    }

    const users = this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) throw new Error('ERR_USER_NOT_FOUND');

    const salt = generateSalt(16);
    target.passwordHash = await hashPasswordWithSalt(newPassword, salt);
    target.passwordSalt = salt;
    target.mustChangePasswordOnFirstLogin = false;
    target.mustChangePasswordOnLogin = false;
    this.saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(target));

    auditService.record({
      actorId: target.id,
      actorName: target.name,
      actorRole: target.role,
      action: 'USER_PASSWORD_RESET',
      targetId: target.id,
      targetName: target.name,
      details: 'User updated initial temporary password.',
      region: target.country,
    });

    return target;
  }

  public logout(): void {
    const session = this.getCurrentSession();
    if (session) {
      auditService.record({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: 'AUTH_LOGOUT',
        details: 'Voluntary sign out.',
      });
    }
    this.clearSession();
  }

  public clearSession(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  public async registerCustomer(params: {
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    password: string;
    country: CountryCode;
    preferredLanguage: Language;
    consentAccepted: boolean;
  }): Promise<{ user: User; session: StoredSession }> {
    const pwdCheck = validatePasswordStrength(params.password);
    if (!pwdCheck.valid) {
      throw new Error(pwdCheck.messageKey || 'auth_err_pwd_short');
    }

    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === params.email.trim().toLowerCase());
    if (existing) {
      throw new Error('ERR_EMAIL_EXISTS');
    }

    const profile = getRegionProfile(params.country);
    const salt = generateSalt(16);
    const hash = await hashPasswordWithSalt(params.password, salt);
    const nowUtc = new Date().toISOString();

    const newUser: User = {
      id: `usr-cust-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: params.name.trim(),
      firstName: params.firstName?.trim(),
      lastName: params.lastName?.trim(),
      email: params.email.trim().toLowerCase(),
      phone: params.phone.trim(),
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      country: params.country,
      preferredLanguage: params.preferredLanguage,
      language: params.preferredLanguage,
      timeZone: profile.timeZone,
      homeRegion: params.country,
      status: 'active',
      passwordHash: hash,
      passwordSalt: salt,
      createdAtUtc: nowUtc,
      consentAcceptedAtUtc: params.consentAccepted ? nowUtc : undefined,
      consentVersion: 'v2026.1',
    };

    const updated = [newUser, ...users];
    this.saveUsers(updated);

    const session = createUserSession(newUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    auditService.record({
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: 'customer',
      action: 'USER_CREATED',
      details: `Customer self-registration in ${profile.dataResidency.dataRegion} (${profile.dataResidency.applicableLaw}) with explicit consent.`,
      region: params.country,
    });

    return { user: newUser, session };
  }

  public async registerPendingCommerce(params: {
    commerceName: string;
    ownerName: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    country: CountryCode;
    city: string;
    address: string;
    cuisine: string;
    password: string;
  }): Promise<User> {
    const pwdCheck = validatePasswordStrength(params.password);
    if (!pwdCheck.valid) {
      throw new Error(pwdCheck.messageKey || 'auth_err_pwd_short');
    }

    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === params.email.trim().toLowerCase());
    if (existing) throw new Error('ERR_EMAIL_EXISTS');

    const profile = getRegionProfile(params.country);
    const salt = generateSalt(16);
    const hash = await hashPasswordWithSalt(params.password, salt);
    const nowUtc = new Date().toISOString();

    const newOwner: User = {
      id: `usr-comm-${Date.now().toString(36)}`,
      name: params.ownerName.trim(),
      firstName: params.firstName?.trim(),
      lastName: params.lastName?.trim(),
      email: params.email.trim().toLowerCase(),
      phone: params.phone.trim(),
      role: 'owner',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      country: params.country,
      city: params.city.trim(),
      preferredLanguage: profile.defaultLanguage,
      language: profile.defaultLanguage,
      timeZone: profile.timeZone,
      homeRegion: params.country,
      status: 'pending',
      passwordHash: hash,
      passwordSalt: salt,
      createdAtUtc: nowUtc,
    };

    this.saveUsers([newOwner, ...users]);

    auditService.record({
      actorId: newOwner.id,
      actorName: newOwner.name,
      actorRole: 'owner',
      action: 'USER_CREATED',
      targetName: params.commerceName.trim(),
      details: `Pending commerce application "${params.commerceName}" in ${params.city} (${params.country}).`,
      region: params.country,
    });

    return newOwner;
  }

  public async registerPendingCourier(params: {
    courierName: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    country: CountryCode;
    city: string;
    vehicleType: 'bicycle' | 'motorcycle' | 'car' | 'electric_scooter';
    password: string;
  }): Promise<User> {
    const pwdCheck = validatePasswordStrength(params.password);
    if (!pwdCheck.valid) {
      throw new Error(pwdCheck.messageKey || 'auth_err_pwd_short');
    }

    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === params.email.trim().toLowerCase());
    if (existing) throw new Error('ERR_EMAIL_EXISTS');

    const profile = getRegionProfile(params.country);
    const salt = generateSalt(16);
    const hash = await hashPasswordWithSalt(params.password, salt);
    const nowUtc = new Date().toISOString();

    const newCourier: User = {
      id: `usr-cour-${Date.now().toString(36)}`,
      name: params.courierName.trim(),
      firstName: params.firstName?.trim(),
      lastName: params.lastName?.trim(),
      email: params.email.trim().toLowerCase(),
      phone: params.phone.trim(),
      role: 'courier',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      country: params.country,
      city: params.city.trim(),
      preferredLanguage: profile.defaultLanguage,
      language: profile.defaultLanguage,
      timeZone: profile.timeZone,
      homeRegion: params.country,
      status: 'pending',
      vehicleType: params.vehicleType,
      isOnline: false,
      activeDeliveriesCount: 0,
      completedDeliveriesCount: 0,
      courierRating: 5.0,
      earningsMinorUnits: 0,
      passwordHash: hash,
      passwordSalt: salt,
      createdAtUtc: nowUtc,
    };

    this.saveUsers([newCourier, ...users]);

    auditService.record({
      actorId: newCourier.id,
      actorName: newCourier.name,
      actorRole: 'courier',
      action: 'USER_CREATED',
      details: `Pending courier application (${params.vehicleType}) in ${params.city} (${params.country}).`,
      region: params.country,
    });

    return newCourier;
  }

  public approveUser(actor: User, targetUserId: string): boolean {
    const users = this.getUsers();
    const target = users.find((u) => u.id === targetUserId);
    if (!target) return false;

    if (actor.role !== 'platform_admin' && actor.role !== 'owner' && actor.role !== 'branch_admin') {
      throw new Error('ERR_FORBIDDEN');
    }
    if (actor.role === 'branch_admin') {
      if (target.role !== 'courier' || target.country !== actor.country) {
        throw new Error('ERR_FORBIDDEN');
      }
    }
    if (actor.role === 'owner' && target.role === 'owner') {
      throw new Error('ERR_FORBIDDEN');
    }

    target.status = 'active';
    this.saveUsers(users);

    const action = target.role === 'courier' ? 'COURIER_APPROVED' : 'COMMERCE_APPROVED';
    auditService.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action,
      targetId: target.id,
      targetName: target.name,
      details: `Approved ${target.role} account for ${target.name}.`,
      region: target.country,
    });

    return true;
  }

  public rejectUser(actor: User, targetUserId: string): boolean {
    const users = this.getUsers();
    const target = users.find((u) => u.id === targetUserId);
    if (!target) return false;

    if (actor.role !== 'platform_admin' && actor.role !== 'owner' && actor.role !== 'branch_admin') {
      throw new Error('ERR_FORBIDDEN');
    }
    if (actor.role === 'branch_admin' && (target.role !== 'courier' || target.country !== actor.country)) {
      throw new Error('ERR_FORBIDDEN');
    }

    target.status = 'inactive';
    this.saveUsers(users);

    auditService.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'USER_DEACTIVATED',
      targetId: target.id,
      targetName: target.name,
      details: `Rejected pending application for ${target.name} (${target.role}).`,
      region: target.country,
    });
    return true;
  }

  public async createTeamUser(
    actor: User,
    data: {
      name: string;
      firstName?: string;
      lastName?: string;
      email: string;
      phone: string;
      role: UserRole | string;
      assignedBranchId?: string;
      assignedRestaurantId?: string;
      country: CountryCode;
      password: string;
      mustChangePasswordOnFirstLogin?: boolean;
    }
  ): Promise<User> {
    const customRoles = this.getCustomRoles();
    const customRoleMatch = customRoles.find((r) => r.id === data.role);
    const targetPerms = customRoleMatch?.permissions as Permission[] | undefined;

    const escalationCheck = validatePrivilegeEscalation(
      actor,
      data.role,
      data.assignedBranchId || actor.assignedBranchId,
      targetPerms
    );
    if (!escalationCheck.allowed) {
      throw new Error(escalationCheck.errorMessageKey || 'ERR_FORBIDDEN');
    }

    const pwdCheck = validatePasswordStrength(data.password);
    if (!pwdCheck.valid) {
      throw new Error(pwdCheck.messageKey || 'auth_err_pwd_short');
    }

    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      throw new Error('ERR_EMAIL_EXISTS');
    }

    const profile = getRegionProfile(data.country);
    const salt = generateSalt(16);
    const hash = await hashPasswordWithSalt(data.password, salt);
    const nowUtc = new Date().toISOString();

    const newUser: User = {
      id: `usr-team-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: data.name.trim(),
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role: data.role as UserRole,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      assignedRestaurantId: data.assignedRestaurantId || actor.assignedRestaurantId || 'brand-aura',
      assignedBranchId: data.assignedBranchId || actor.assignedBranchId,
      country: data.country,
      preferredLanguage: profile.defaultLanguage,
      language: profile.defaultLanguage,
      timeZone: profile.timeZone,
      homeRegion: data.country,
      status: 'active',
      passwordHash: hash,
      passwordSalt: salt,
      mustChangePasswordOnFirstLogin: Boolean(data.mustChangePasswordOnFirstLogin),
      createdAtUtc: nowUtc,
    };

    this.saveUsers([newUser, ...users]);

    auditService.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'USER_CREATED',
      targetId: newUser.id,
      targetName: newUser.name,
      details: `Team member created with role "${data.role}" for branch "${newUser.assignedBranchId || 'all'}".`,
      region: data.country,
    });

    return newUser;
  }

  public updateTeamUser(
    actor: User,
    targetUserId: string,
    updates: {
      name?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      role?: UserRole | string;
      assignedBranchId?: string;
      country?: CountryCode;
    }
  ): User {
    const users = this.getUsers();
    const target = users.find((u) => u.id === targetUserId);
    if (!target) throw new Error('ERR_USER_NOT_FOUND');

    const targetRole = (updates.role ?? target.role) as string;
    const targetBranch = updates.assignedBranchId ?? target.assignedBranchId;
    const customRoles = this.getCustomRoles();
    const customRoleMatch = customRoles.find((r) => r.id === targetRole);

    const escalationCheck = validatePrivilegeEscalation(
      actor,
      targetRole,
      targetBranch,
      customRoleMatch?.permissions as Permission[] | undefined
    );
    if (!escalationCheck.allowed) {
      throw new Error(escalationCheck.errorMessageKey || 'ERR_FORBIDDEN');
    }
    if (actor.role === 'branch_admin' && target.assignedBranchId !== actor.assignedBranchId) {
      throw new Error('err_branch_scope_violation');
    }

    if (updates.name !== undefined) target.name = updates.name.trim();
    if (updates.firstName !== undefined) target.firstName = updates.firstName.trim();
    if (updates.lastName !== undefined) target.lastName = updates.lastName.trim();
    if (updates.phone !== undefined) target.phone = updates.phone.trim();
    if (updates.role !== undefined) target.role = updates.role as UserRole;
    if (updates.assignedBranchId !== undefined) target.assignedBranchId = updates.assignedBranchId;
    if (updates.country !== undefined) {
      target.country = updates.country;
      target.homeRegion = updates.country;
      const profile = getRegionProfile(updates.country);
      target.timeZone = profile.timeZone;
    }

    this.saveUsers(users);

    auditService.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'USER_UPDATED',
      targetId: target.id,
      targetName: target.name,
      details: `Updated user "${target.name}" (${target.role}) at branch "${target.assignedBranchId || 'all'}".`,
      region: target.country,
    });

    return target;
  }

  public deactivateUser(actor: User, targetUserId: string): boolean {
    const users = this.getUsers();
    const target = users.find((u) => u.id === targetUserId);
    if (!target) return false;
    if (target.id === actor.id) throw new Error('ERR_FORBIDDEN');

    const check = validatePrivilegeEscalation(actor, target.role, target.assignedBranchId);
    if (!check.allowed) {
      throw new Error(check.errorMessageKey || 'ERR_FORBIDDEN');
    }

    target.status = 'inactive';
    this.saveUsers(users);

    auditService.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'USER_DEACTIVATED',
      targetId: target.id,
      targetName: target.name,
      details: `Deactivated account for ${target.name}.`,
      region: target.country,
    });

    return true;
  }

  public reactivateUser(actor: User, targetUserId: string): boolean {
    const users = this.getUsers();
    const target = users.find((u) => u.id === targetUserId);
    if (!target) return false;

    const check = validatePrivilegeEscalation(actor, target.role, target.assignedBranchId);
    if (!check.allowed) {
      throw new Error(check.errorMessageKey || 'ERR_FORBIDDEN');
    }

    target.status = 'active';
    this.saveUsers(users);

    auditService.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'USER_REACTIVATED',
      targetId: target.id,
      targetName: target.name,
      details: `Reactivated account for ${target.name}.`,
      region: target.country,
    });

    return true;
  }

  public async resetUserPassword(actor: User, targetUserId: string, newPassword?: string): Promise<string> {
    const users = this.getUsers();
    const target = users.find((u) => u.id === targetUserId);
    if (!target) throw new Error('ERR_USER_NOT_FOUND');

    const check = validatePrivilegeEscalation(actor, target.role, target.assignedBranchId);
    if (!check.allowed) {
      throw new Error(check.errorMessageKey || 'ERR_FORBIDDEN');
    }

    const generatedPwd = newPassword || `Sr#${Math.floor(Math.random() * 8999 + 1000)}!`;
    const pwdCheck = validatePasswordStrength(generatedPwd);
    if (!pwdCheck.valid) {
      throw new Error(pwdCheck.messageKey || 'auth_err_pwd_short');
    }

    const salt = generateSalt(16);
    target.passwordHash = await hashPasswordWithSalt(generatedPwd, salt);
    target.passwordSalt = salt;
    target.mustChangePasswordOnFirstLogin = true;
    this.saveUsers(users);

    auditService.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'USER_PASSWORD_RESET',
      targetId: target.id,
      targetName: target.name,
      details: `Temporary password issued for ${target.name} (rotation required on next sign in).`,
      region: target.country,
    });

    return generatedPwd;
  }

  public deleteUser(actor: User, targetUserId: string): boolean {
    const users = this.getUsers();
    const target = users.find((u) => u.id === targetUserId);
    if (!target) return false;
    if (target.id === actor.id) throw new Error('ERR_FORBIDDEN');

    const check = validatePrivilegeEscalation(actor, target.role, target.assignedBranchId);
    if (!check.allowed) {
      throw new Error(check.errorMessageKey || 'ERR_FORBIDDEN');
    }

    const filtered = users.filter((u) => u.id !== targetUserId);
    this.saveUsers(filtered);

    auditService.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'USER_DELETED',
      targetId: target.id,
      targetName: target.name,
      details: `Deleted account ${target.name} (${target.role}).`,
      region: target.country,
    });

    return true;
  }

  public updateCourierState(
    courierId: string,
    patch: Partial<
      Pick<
        User,
        | 'isOnline'
        | 'activeDeliveriesCount'
        | 'completedDeliveriesCount'
        | 'courierRating'
        | 'earningsMinorUnits'
        | 'currentLocation'
      >
    >
  ): User | null {
    const users = this.getUsers();
    const target = users.find((u) => u.id === courierId);
    if (!target) return null;

    Object.assign(target, patch);
    this.saveUsers(users);

    const active = this.getCurrentSession();
    if (active?.userId === courierId) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(target));
    }
    return target;
  }

  public getPersonalDataForUser(
    userId: string,
    collections: { orders: Order[]; reservations: Reservation[]; reviews: Review[] }
  ): PersonalDataExport | null {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) return null;

    const homeRegion = target.homeRegion || target.country;
    const profile = getRegionProfile(homeRegion);

    const ownOrders = collections.orders.filter(
      (o) =>
        o.userId === target.id ||
        (o.customerEmail && o.customerEmail.toLowerCase() === target.email.toLowerCase())
    );
    const ownReservations = collections.reservations.filter(
      (r) =>
        r.userId === target.id ||
        (r.customerEmail && r.customerEmail.toLowerCase() === target.email.toLowerCase())
    );
    const ownReviews = collections.reviews.filter(
      (rv) =>
        rv.userId === target.id ||
        (rv.customerEmail && rv.customerEmail.toLowerCase() === target.email.toLowerCase())
    );

    auditService.record({
      actorId: target.id,
      actorName: target.name,
      actorRole: target.role,
      action: 'DATA_EXPORTED',
      targetId: target.id,
      targetName: target.name,
      details: `Personal data exported strictly from homeRegion=${homeRegion} (${profile.dataResidency.dataRegion}).`,
      region: homeRegion,
    });

    return {
      exportedAtUtc: new Date().toISOString(),
      homeRegion,
      dataRegion: profile.dataResidency.dataRegion,
      applicableLaw: profile.dataResidency.applicableLaw,
      legalBasis: profile.dataResidency.legalBasis,
      retentionMonths: profile.dataResidency.retentionMonths,
      internationalTransferRestricted: true,
      profile: {
        id: target.id,
        name: target.name,
        firstName: target.firstName,
        lastName: target.lastName,
        email: target.email,
        phone: target.phone,
        role: target.role,
        preferredLanguage: target.preferredLanguage || target.language,
        timeZone: target.timeZone || profile.timeZone,
        country: target.country,
        homeRegion,
        createdAtUtc: target.createdAtUtc,
        consentAcceptedAtUtc: target.consentAcceptedAtUtc,
        consentVersion: target.consentVersion,
      },
      orders: ownOrders,
      reservations: ownReservations,
      reviews: ownReviews,
    };
  }

  public requestDataErasure(userId: string): boolean {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) return false;

    target.name = 'Anonymized User';
    target.firstName = 'Anonymized';
    target.lastName = 'User';
    target.email = `anonymized_${userId}@privacy.smartrestaurant.app`;
    target.phone = '0000000000';
    target.avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
    target.status = 'inactive';
    this.saveUsers(users);

    auditService.record({
      actorId: userId,
      actorName: 'Data Subject',
      actorRole: 'customer',
      action: 'DATA_ERASURE_REQUESTED',
      targetId: userId,
      targetName: 'Anonymized User',
      details: 'Personal attributes anonymized while preserving fiscal records per regional law.',
      region: target.homeRegion || target.country,
    });

    this.logout();
    return true;
  }

  public getCustomRoles(): CustomRole[] {
    const raw = localStorage.getItem(CUSTOM_ROLES_KEY);
    if (!raw) {
      const defaultCustom: CustomRole[] = [
        {
          id: 'cashier',
          name: {
            es: 'Cajero',
            en: 'Cashier',
            pt: 'Caixa',
            fr: 'Caissier',
            ja: 'レジ担当',
          },
          description: {
            es: 'Cobro de cuentas en mesa, propinas y cierre de caja sin descuentos.',
            en: 'Table billing, tips, and register close without discounts.',
            pt: 'Cobrança de mesas, gorjetas e fechamento de caixa.',
            fr: 'Encaissement des tables, pourboires et clôture de caisse.',
            ja: 'テーブル会計、チップ処理、レジ締め（割引権限なし）。',
          },
          permissions: ['tables.bill', 'orders.acceptDelivery', 'notifications.view', 'orders.create', 'tables.view'],
          createdBy: 'usr-owner-01',
          branchId: 'br-aura-co-chapinero',
          createdAtUtc: '2026-11-10T14:30:00.000Z',
        },
      ];
      localStorage.setItem(CUSTOM_ROLES_KEY, JSON.stringify(defaultCustom));
      return defaultCustom;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public createCustomRole(
    actor: User,
    data: {
      id: string;
      name: Record<Language, string>;
      description: Record<Language, string>;
      permissions: string[];
      branchId?: string;
    }
  ): CustomRole {
    const escalationCheck = validatePrivilegeEscalation(
      actor,
      data.id,
      data.branchId || actor.assignedBranchId,
      data.permissions as Permission[]
    );
    if (!escalationCheck.allowed) {
      throw new Error(escalationCheck.errorMessageKey || 'ERR_FORBIDDEN');
    }

    const roles = this.getCustomRoles();
    const cleanId = data.id.toLowerCase().trim().replace(/\s+/g, '_');

    const newRole: CustomRole = {
      id: cleanId,
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      createdBy: actor.id,
      branchId: data.branchId || actor.assignedBranchId,
      createdAtUtc: new Date().toISOString(),
    };

    const updated = [newRole, ...roles.filter((r) => r.id !== cleanId)];
    localStorage.setItem(CUSTOM_ROLES_KEY, JSON.stringify(updated));

    auditService.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'ROLE_CREATED',
      targetId: newRole.id,
      targetName: data.name.en || data.name.es,
      details: `Custom role "${cleanId}" created with ${data.permissions.length} permissions.`,
      region: actor.country,
    });

    return newRole;
  }

  public setUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  public clearUser(): void {
    this.clearSession();
  }
}

export const authService = AuthService.getInstance();
