import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/seedData';

const AUTH_STORAGE_KEY = 'smartrestaurant_auth_user';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getInitialUser(): User {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default to Owner role for full access and demonstration
    return INITIAL_USERS[0];
  }

  public getDemoUsers(): User[] {
    return INITIAL_USERS;
  }

  public switchUserByRole(role: UserRole): User {
    const user = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  public setUser(user: User): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  public canAccessView(role: UserRole, view: string): boolean {
    if (role === 'owner' || role === 'admin') return true;
    if (role === 'waiter') {
      return ['floor', 'orders_qr', 'reservations', 'kitchen', 'monitor'].includes(view);
    }
    if (role === 'kitchen') {
      return ['kitchen', 'orders_qr', 'monitor'].includes(view);
    }
    if (role === 'customer') {
      return ['orders_qr', 'reservations', 'menu', 'monitor'].includes(view);
    }
    return true;
  }
}

export const authService = AuthService.getInstance();
