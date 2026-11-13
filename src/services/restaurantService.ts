import {
  Restaurant,
  Branch,
  Table,
  TableStatus,
  TableZone,
  MenuItem,
} from '../types';
import { broker } from '../core/broker';

interface CatalogCacheEntry {
  items: MenuItem[];
  expiresAtMs: number;
  cachedAtUtc: string;
}

const CATALOG_CACHE_TTL_MS = 45 * 1000; // 45s simulated TTL cache

export class RestaurantService {
  private static instance: RestaurantService;
  private menuCache: Map<string, CatalogCacheEntry> = new Map();
  private cacheHits = 0;
  private cacheMisses = 0;

  private constructor() {
    broker.subscribe('PRODUCT_AVAILABILITY_CHANGED', 'restaurant-service', async (ev) => {
      this.invalidateCatalogCache(ev.payload?.branchId);
    });
    broker.subscribe('CATALOG_CACHE_INVALIDATED', 'restaurant-service', async (ev) => {
      this.invalidateCatalogCache(ev.payload?.branchId);
    });
  }

  public static getInstance(): RestaurantService {
    if (!RestaurantService.instance) {
      RestaurantService.instance = new RestaurantService();
    }
    return RestaurantService.instance;
  }

  /**
   * Reads menu items for a restaurant/branch using a simulated TTL cache with live hit/miss metrics.
   */
  public getMenuWithCache(
    restaurantId: string,
    allMenuItems: MenuItem[],
    countryCode?: string
  ): { items: MenuItem[]; fromCache: boolean } {
    const cacheKey = `${restaurantId}:${countryCode || 'ALL'}`;
    const now = Date.now();
    const cached = this.menuCache.get(cacheKey);

    if (cached && cached.expiresAtMs > now) {
      this.cacheHits += 1;
      return { items: cached.items, fromCache: true };
    }

    this.cacheMisses += 1;
    const filtered = allMenuItems.filter(
      (item) =>
        item.restaurantId === restaurantId &&
        (!countryCode || item.countryCode === countryCode)
    );

    this.menuCache.set(cacheKey, {
      items: filtered,
      expiresAtMs: now + CATALOG_CACHE_TTL_MS,
      cachedAtUtc: new Date().toISOString().replace('.000Z', 'Z'),
    });

    return { items: filtered, fromCache: false };
  }

  public invalidateCatalogCache(scopeKey?: string): void {
    if (!scopeKey) {
      this.menuCache.clear();
      return;
    }
    for (const key of Array.from(this.menuCache.keys())) {
      if (key.includes(scopeKey)) {
        this.menuCache.delete(key);
      }
    }
  }

  public getCatalogCacheStats(): {
    hits: number;
    misses: number;
    hitRatePct: number;
    cachedBuckets: number;
    ttlSeconds: number;
  } {
    const total = this.cacheHits + this.cacheMisses;
    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRatePct: total > 0 ? Math.round((this.cacheHits / total) * 100) : 100,
      cachedBuckets: this.menuCache.size,
      ttlSeconds: CATALOG_CACHE_TTL_MS / 1000,
    };
  }

  public getAvailableTables(tables: Table[], branchId: string): Table[] {
    return tables.filter((t) => t.branchId === branchId && t.status === 'available');
  }

  public getTableOccupancyRate(tables: Table[], branchId?: string): number {
    const targetTables = branchId ? tables.filter((t) => t.branchId === branchId) : tables;
    if (targetTables.length === 0) return 0;
    const occupied = targetTables.filter((t) => t.status === 'occupied').length;
    return Math.round((occupied / targetTables.length) * 100);
  }

  public updateTableStatus(
    tables: Table[],
    tableId: string,
    newStatus: TableStatus,
    currentOrderId?: string
  ): Table[] {
    return tables.map((t) => {
      if (t.id === tableId) {
        return {
          ...t,
          status: newStatus,
          currentOrderId: newStatus === 'available' ? undefined : currentOrderId ?? t.currentOrderId,
        };
      }
      return t;
    });
  }

  public createNewTable(params: {
    branchId: string;
    existingTables: Table[];
    capacity: number;
    zone: TableZone;
  }): Table {
    const branchTables = params.existingTables.filter((t) => t.branchId === params.branchId);
    const nextNumber = branchTables.length > 0 ? Math.max(...branchTables.map((t) => t.number)) + 1 : 1;
    return {
      id: `tbl-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      branchId: params.branchId,
      number: nextNumber,
      capacity: params.capacity,
      zone: params.zone,
      status: 'available',
    };
  }

  public createRestaurant(data: Omit<Restaurant, 'id'>): Restaurant {
    return {
      id: `rest-${Date.now().toString(36)}`,
      ...data,
    };
  }

  public createBranch(data: Omit<Branch, 'id'>): Branch {
    return {
      id: `branch-${Date.now().toString(36)}`,
      ...data,
    };
  }
}

export const restaurantService = RestaurantService.getInstance();
