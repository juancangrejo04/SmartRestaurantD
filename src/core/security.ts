/**
 * Security and Cryptographic Utilities (Simulated browser-based environment)
 * - SHA-256 password hashing with unique salt
 * - Session token generation and validation with 8-hour expiry
 * - Failed login attempt tracking and 60-second rate-limiting lockout
 * - Password complexity enforcement
 */

export interface PasswordHashResult {
  hash: string;
  salt: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  role: string;
  email: string;
  name: string;
  createdAtUtc: string;
  expiresAtUtc: string;
}

export interface RateLimitState {
  attempts: number;
  lockedUntilUtc: string | null;
  lastAttemptUtc: string;
}

const SESSION_DURATION_HOURS = 8;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;
const RATE_LIMIT_PREFIX = 'sr_ratelimit_';

/**
 * Generate a random cryptographic salt hex string
 */
export function generateSalt(bytes: number = 16): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash a password with salt using Web Crypto API SHA-256
 */
export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:smartrestaurant_pepper_2026`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Pre-computes synchronous hash for known demo passwords during initial bootstrap
 * (fallback algorithm matching SHA-256 digest format)
 */
export async function createPasswordCredentials(password: string): Promise<PasswordHashResult> {
  const salt = generateSalt(16);
  const hash = await hashPasswordWithSalt(password, salt);
  return { hash, salt };
}

/**
 * Check password strength
 * Requires at least 8 chars, 1 uppercase, 1 number, 1 special character
 */
export function validatePasswordStrength(password: string): { valid: boolean; messageKey?: string } {
  if (!password || password.length < 8) {
    return { valid: false, messageKey: 'auth_err_pwd_short' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, messageKey: 'auth_err_pwd_upper' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, messageKey: 'auth_err_pwd_digit' };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, messageKey: 'auth_err_pwd_symbol' };
  }
  return { valid: true };
}

/**
 * Generate a cryptographically secure random session token
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return 'sr_tok_' + Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a new user session with 8-hour expiry
 */
export function createUserSession(user: { id: string; role: string; email: string; name: string }): StoredSession {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

  return {
    token: generateSessionToken(),
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    createdAtUtc: now.toISOString(),
    expiresAtUtc: expiresAt.toISOString(),
  };
}

/**
 * Check if a stored session is still valid
 */
export function isSessionValid(session: StoredSession | null | undefined): boolean {
  if (!session || !session.token || !session.expiresAtUtc) return false;
  const expiry = new Date(session.expiresAtUtc).getTime();
  return Date.now() < expiry;
}

/**
 * Check rate limit for an email; returns { locked: boolean, remainingSeconds: number }
 */
export function checkLoginRateLimit(email: string): { locked: boolean; remainingSeconds: number } {
  const key = `${RATE_LIMIT_PREFIX}${email.toLowerCase().trim()}`;
  const raw = localStorage.getItem(key);
  if (!raw) return { locked: false, remainingSeconds: 0 };

  try {
    const state: RateLimitState = JSON.parse(raw);
    if (state.lockedUntilUtc) {
      const lockUntil = new Date(state.lockedUntilUtc).getTime();
      const now = Date.now();
      if (now < lockUntil) {
        return { locked: true, remainingSeconds: Math.ceil((lockUntil - now) / 1000) };
      }
    }
  } catch {
    // Ignore corrupt state
  }

  return { locked: false, remainingSeconds: 0 };
}

/**
 * Record a failed login attempt; locks for 60s after 5 consecutive failures
 */
export function recordFailedLogin(email: string): { locked: boolean; remainingSeconds: number; attempts: number } {
  const key = `${RATE_LIMIT_PREFIX}${email.toLowerCase().trim()}`;
  const now = new Date();
  let state: RateLimitState = { attempts: 0, lockedUntilUtc: null, lastAttemptUtc: now.toISOString() };

  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      state = JSON.parse(raw);
    } catch {
      // reset
    }
  }

  state.attempts += 1;
  state.lastAttemptUtc = now.toISOString();

  if (state.attempts >= MAX_FAILED_ATTEMPTS) {
    const lockUntil = new Date(now.getTime() + LOCKOUT_SECONDS * 1000);
    state.lockedUntilUtc = lockUntil.toISOString();
    localStorage.setItem(key, JSON.stringify(state));
    return { locked: true, remainingSeconds: LOCKOUT_SECONDS, attempts: state.attempts };
  }

  localStorage.setItem(key, JSON.stringify(state));
  return { locked: false, remainingSeconds: 0, attempts: state.attempts };
}

/**
 * Clear rate limit on successful login
 */
export function clearLoginRateLimit(email: string): void {
  const key = `${RATE_LIMIT_PREFIX}${email.toLowerCase().trim()}`;
  localStorage.removeItem(key);
}
