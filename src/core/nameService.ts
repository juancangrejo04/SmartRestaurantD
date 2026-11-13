import { CountryCode, NameDirectoryEntry, ServiceName } from '../types';
import { getRegionProfile, getAllRegionProfiles } from '../data/regions';
import { regionNodes } from './regionNodes';

const DEFAULT_TTL_SECONDS = 60;

export const ALL_SUBSYSTEM_SERVICES: ServiceName[] = [
  'auth-service',
  'restaurant-service',
  'reservation-service',
  'order-service',
  'kitchen-service',
  'dispatch-service',
  'payments-service',
  'billing-service',
  'notification-service',
  'fx-service',
  'analytics-service',
];

/**
 * Simulated NameService (DNS + Service Discovery Directory with TTL cache).
 * Resolves logical names (`service.region`) into simulated regional node endpoints.
 */
class DistributedNameService {
  private static instance: DistributedNameService;
  private cache: Map<string, NameDirectoryEntry> = new Map();
  private hits = 0;
  private misses = 0;

  private constructor() {}

  public static getInstance(): DistributedNameService {
    if (!DistributedNameService.instance) {
      DistributedNameService.instance = new DistributedNameService();
    }
    return DistributedNameService.instance;
  }

  private getServiceHostSlug(service: ServiceName): string {
    return service.replace('-service', '');
  }

  public resolveService(service: ServiceName, region: CountryCode): NameDirectoryEntry {
    const cacheKey = `${service}:${region}`;
    const nowMs = Date.now();
    const cached = this.cache.get(cacheKey);
    const node = regionNodes.getNode(region);

    if (cached && cached.expiresAtMs > nowMs && cached.leaderTarget === node.activeLeader) {
      this.hits += 1;
      return { ...cached, fromCache: true };
    }

    this.misses += 1;
    const profile = getRegionProfile(region);
    const slug = this.getServiceHostSlug(service);
    const leaderSuffix = node.activeLeader === 'replica' ? 'replica.' : '';
    const endpoint = `${slug}.${leaderSuffix}${region.toLowerCase()}.${profile.domain}:8443`;

    const entry: NameDirectoryEntry = {
      service,
      region,
      logicalName: `${service}.${region}`,
      endpoint,
      protocol: 'HTTPS/JSON-UTF8',
      ttlSeconds: DEFAULT_TTL_SECONDS,
      resolvedAtUtc: new Date().toISOString().replace('.000Z', 'Z'),
      expiresAtMs: nowMs + DEFAULT_TTL_SECONDS * 1000,
      leaderTarget: node.activeLeader,
      fromCache: false,
    };

    this.cache.set(cacheKey, entry);
    return entry;
  }

  public getDirectorySnapshot(): NameDirectoryEntry[] {
    const entries: NameDirectoryEntry[] = [];
    const profiles = getAllRegionProfiles();
    for (const profile of profiles) {
      for (const svc of ALL_SUBSYSTEM_SERVICES) {
        const key = `${svc}:${profile.code}`;
        const existing = this.cache.get(key);
        if (existing && existing.expiresAtMs > Date.now()) {
          entries.push({ ...existing, fromCache: true });
        } else {
          entries.push(this.resolveService(svc, profile.code));
        }
      }
    }
    return entries;
  }

  public invalidateCache(): void {
    this.cache.clear();
  }

  public getCacheStats(): { hits: number; misses: number; size: number; hitRatePct: number; ttlSeconds: number } {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      hitRatePct: total > 0 ? Math.round((this.hits / total) * 100) : 100,
      ttlSeconds: DEFAULT_TTL_SECONDS,
    };
  }
}

export const nameService = DistributedNameService.getInstance();
