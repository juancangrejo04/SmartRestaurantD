import { CountryCode, EventType, ServiceName, User } from '../types';
import { broker } from './broker';
import { nameService } from './nameService';
import { distributedClock } from './clock';
import { isSessionValid, StoredSession } from './security';

export interface GatewayMetrics {
  totalRequests: number;
  blockedRateLimit: number;
  blockedAuth: number;
  lastResolvedEndpoint: string;
}

const SESSION_STORAGE_KEY = 'smartrestaurant_v4_session';

/**
 * Simulated API Gateway fronting all UI requests to the 11 logical subsystems.
 * Performs simulated rate limiting, session signature validation, NameService resolution,
 * and serialized message routing over the broker.
 */
class SimulatedApiGateway {
  private static instance: SimulatedApiGateway;
  private requestTimestamps: number[] = [];
  private readonly maxRequestsPerWindow = 40;
  private readonly windowMs = 5000;
  private totalRequests = 0;
  private blockedRateLimit = 0;
  private blockedAuth = 0;
  private lastResolvedEndpoint = '';

  private constructor() {}

  public static getInstance(): SimulatedApiGateway {
    if (!SimulatedApiGateway.instance) {
      SimulatedApiGateway.instance = new SimulatedApiGateway();
    }
    return SimulatedApiGateway.instance;
  }

  /**
   * Simulated HMAC-like token check over stored session integrity.
   */
  public verifySignedToken(user: User | null): { valid: boolean; reason?: string } {
    if (!user) return { valid: true };
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return { valid: false, reason: 'Missing signed session token' };
      const session: StoredSession = JSON.parse(raw);
      if (!isSessionValid(session)) {
        this.blockedAuth += 1;
        return { valid: false, reason: 'Expired token rejected by Gateway' };
      }
      if (session.userId !== user.id || session.role !== user.role) {
        this.blockedAuth += 1;
        return { valid: false, reason: 'Tampered token claim rejected by Gateway' };
      }
      return { valid: true };
    } catch {
      this.blockedAuth += 1;
      return { valid: false, reason: 'Invalid session token' };
    }
  }

  public checkRateLimit(): boolean {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter((ts) => now - ts < this.windowMs);
    if (this.requestTimestamps.length >= this.maxRequestsPerWindow) {
      this.blockedRateLimit += 1;
      return false;
    }
    this.requestTimestamps.push(now);
    return true;
  }

  public async dispatchCommand<T = unknown>(params: {
    targetService: ServiceName;
    eventType: EventType;
    payload: Record<string, any>;
    region: CountryCode;
    actor?: User | null;
    idempotencyKey?: string;
  }): Promise<{ ok: boolean; statusCode: number; endpoint: string; data?: T; error?: string }> {
    this.totalRequests += 1;

    if (!this.checkRateLimit()) {
      return {
        ok: false,
        statusCode: 429,
        endpoint: '',
        error: '429 Too Many Requests (Rate limit protection active)',
      };
    }

    if (params.actor) {
      const tokenCheck = this.verifySignedToken(params.actor);
      if (!tokenCheck.valid) {
        return {
          ok: false,
          statusCode: 401,
          endpoint: '',
          error: tokenCheck.reason,
        };
      }
    }

    const resolved = nameService.resolveService(params.targetService, params.region);
    this.lastResolvedEndpoint = resolved.endpoint;

    const res = await broker.request<T>({
      sourceService: 'order-service',
      targetService: params.targetService,
      eventType: params.eventType,
      payload: params.payload,
      region: params.region,
      idempotencyKey: params.idempotencyKey,
    });

    return {
      ok: res.ok,
      statusCode: res.ok ? 200 : 503,
      endpoint: resolved.endpoint,
      data: res.data,
      error: res.error,
    };
  }

  /**
   * Simulates an abusive traffic burst to demonstrate Gateway Rate Limiting (429 protection)
   * without bringing down backend nodes.
   */
  public simulateRateLimitBurst(): { sent: number; accepted: number; blocked429: number } {
    let accepted = 0;
    let blocked = 0;
    const totalBurst = 55;
    for (let i = 0; i < totalBurst; i++) {
      this.totalRequests += 1;
      if (this.checkRateLimit()) {
        accepted += 1;
      } else {
        blocked += 1;
      }
    }
    return { sent: totalBurst, accepted, blocked429: blocked };
  }

  public resetRateLimiter(): void {
    this.requestTimestamps = [];
  }

  public getMetrics(): GatewayMetrics & { lamport: number } {
    return {
      totalRequests: this.totalRequests,
      blockedRateLimit: this.blockedRateLimit,
      blockedAuth: this.blockedAuth,
      lastResolvedEndpoint: this.lastResolvedEndpoint,
      lamport: distributedClock.getLamport(),
    };
  }
}

export const apiGateway = SimulatedApiGateway.getInstance();
