import { User, DispatchOffer } from '../types';
import { haversineDistanceKm } from '../core/geo';
import { broker } from '../core/broker';

const STORAGE_OFFERS_KEY = 'smartrestaurant_v4_dispatch_offers';
const STORAGE_LEASES_KEY = 'smartrestaurant_v4_dispatch_leases';

export interface OrderLease {
  orderId: string;
  courierId: string;
  expiresAt: number; // timestamp ms
}

export class DispatchService {
  private static instance: DispatchService;

  private constructor() {
    broker.subscribe('DISPATCH_RELEASE_LEASE', 'dispatch-service', async (event) => {
      if (event.payload?.orderId) {
        this.releaseLease(String(event.payload.orderId), event.payload.courierId ? String(event.payload.courierId) : undefined);
        return { released: true, orderId: event.payload.orderId };
      }
      return { released: false };
    });
  }

  public static getInstance(): DispatchService {
    if (!DispatchService.instance) {
      DispatchService.instance = new DispatchService();
    }
    return DispatchService.instance;
  }

  private loadOffers(): Record<string, DispatchOffer> {
    try {
      const data = localStorage.getItem(STORAGE_OFFERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveOffers(offers: Record<string, DispatchOffer>): void {
    try {
      localStorage.setItem(STORAGE_OFFERS_KEY, JSON.stringify(offers));
    } catch {
      // fallback
    }
  }

  private loadLeases(): Record<string, OrderLease> {
    try {
      const data = localStorage.getItem(STORAGE_LEASES_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveLeases(leases: Record<string, OrderLease>): void {
    try {
      localStorage.setItem(STORAGE_LEASES_KEY, JSON.stringify(leases));
    } catch {
      // fallback
    }
  }

  /**
   * Acquire a distributed mutual exclusion lease on an order for a courier
   */
  public acquireLease(orderId: string, courierId: string, durationSeconds: number = 30): boolean {
    const leases = this.loadLeases();
    const now = Date.now();
    const existing = leases[orderId];

    if (existing && existing.expiresAt > now && existing.courierId !== courierId) {
      return false; // Already locked by another courier
    }

    leases[orderId] = {
      orderId,
      courierId,
      expiresAt: now + durationSeconds * 1000,
    };
    this.saveLeases(leases);
    return true;
  }

  public releaseLease(orderId: string, courierId?: string): void {
    const leases = this.loadLeases();
    if (!courierId || leases[orderId]?.courierId === courierId) {
      delete leases[orderId];
      this.saveLeases(leases);
    }
  }

  /**
   * Rank eligible couriers by distance + active load:
   * Score = (distanceKm * 10) + (activeDeliveries * 25)
   * Lower score is better.
   */
  public rankCouriers(
    couriers: User[],
    branchCoords: { latitude: number; longitude: number },
    excludedCourierIds: string[] = []
  ): { courier: User; distanceKm: number; score: number }[] {
    const eligible = couriers.filter(
      (c) =>
        c.role === 'courier' &&
        c.status === 'active' &&
        c.isOnline &&
        !excludedCourierIds.includes(c.id)
    );

    const scored = eligible.map((courier) => {
      const courierCoords = courier.currentLocation || branchCoords;
      const distanceKm = haversineDistanceKm(branchCoords, courierCoords);
      const activeLoad = courier.activeDeliveriesCount || 0;
      const score = distanceKm * 10 + activeLoad * 25;
      return { courier, distanceKm, score };
    });

    return scored.sort((a, b) => a.score - b.score);
  }

  /**
   * Dispatch an offer to the next best courier for an order
   */
  public createDispatchOffer(params: {
    orderId: string;
    branchId: string;
    branchCoords: { latitude: number; longitude: number };
    deliveryCoords: { latitude: number; longitude: number };
    couriers: User[];
    earningsMinorUnits: number;
    timeoutSeconds?: number;
  }): DispatchOffer | null {
    const offers = this.loadOffers();
    const existingOffersForOrder = Object.values(offers).filter((o) => o.orderId === params.orderId);
    const rejectedOrExpiredIds = existingOffersForOrder
      .filter((o) => o.status === 'rejected' || o.status === 'expired')
      .map((o) => o.courierId);

    // Active pending offer check
    const pendingOffer = existingOffersForOrder.find((o) => o.status === 'pending');
    if (pendingOffer) {
      const now = new Date().toISOString();
      const exp = pendingOffer.expiresAt || pendingOffer.expiresAtUtc || '';
      if (exp > now) {
        return pendingOffer;
      } else {
        pendingOffer.status = 'expired';
        this.saveOffers(offers);
        this.releaseLease(params.orderId, pendingOffer.courierId);
      }
    }

    const ranked = this.rankCouriers(params.couriers, params.branchCoords, rejectedOrExpiredIds);
    if (ranked.length === 0) {
      return null; // No available couriers right now
    }

    const best = ranked[0];
    const timeout = params.timeoutSeconds || 20;
    const expiresAt = new Date(Date.now() + timeout * 1000).toISOString();
    const offerId = `off_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    // Try acquire lease
    const locked = this.acquireLease(params.orderId, best.courier.id, timeout);
    if (!locked) {
      return null;
    }

    const newOffer: DispatchOffer = {
      id: offerId,
      orderId: params.orderId,
      courierId: best.courier.id,
      courierName: best.courier.firstName && best.courier.lastName
        ? `${best.courier.firstName} ${best.courier.lastName}`
        : best.courier.name,
      branchId: params.branchId,
      status: 'pending',
      earningsMinorUnits: params.earningsMinorUnits,
      distanceKm: best.distanceKm,
      distanceKmOrMi: best.distanceKm,
      score: best.score,
      createdAt: new Date().toISOString(),
      expiresAt,
      expiresAtUtc: expiresAt,
    };

    offers[offerId] = newOffer;
    this.saveOffers(offers);

    broker.publish('COURIER_ASSIGNED', {
      orderId: params.orderId,
      courierId: best.courier.id,
      status: 'offer_sent',
      offerId,
      expiresAt,
    });

    return newOffer;
  }

  /**
   * Courier accepts offer with mutual exclusion lease verification
   */
  public acceptOffer(offerId: string, courierId: string): { success: boolean; offer?: DispatchOffer; error?: string } {
    const offers = this.loadOffers();
    const offer = offers[offerId];

    if (!offer) {
      return { success: false, error: 'Offer not found' };
    }
    if (offer.courierId !== courierId) {
      return { success: false, error: 'Offer not assigned to this courier' };
    }
    if (offer.status !== 'pending' && offer.status !== 'offered') {
      return { success: false, error: `Offer is already ${offer.status}` };
    }
    const expStr = offer.expiresAt || offer.expiresAtUtc || '';
    if (expStr && new Date(expStr) < new Date()) {
      offer.status = 'expired';
      this.saveOffers(offers);
      this.releaseLease(offer.orderId, courierId);
      return { success: false, error: 'Offer has expired' };
    }

    // Extend lease to hold courier until delivery completes
    this.acquireLease(offer.orderId, courierId, 3600); // 1 hour lease during delivery

    offer.status = 'accepted';
    this.saveOffers(offers);

    broker.publish('COURIER_ASSIGNED', {
      orderId: offer.orderId,
      courierId: courierId,
      status: 'accepted',
      offerId,
    });

    return { success: true, offer };
  }

  /**
   * Courier rejects offer
   */
  public rejectOffer(offerId: string, courierId: string): { success: boolean; offer?: DispatchOffer } {
    const offers = this.loadOffers();
    const offer = offers[offerId];

    if (!offer || offer.courierId !== courierId) {
      return { success: false };
    }

    offer.status = 'rejected';
    this.saveOffers(offers);
    this.releaseLease(offer.orderId, courierId);

    broker.publish('COURIER_ASSIGNED', {
      orderId: offer.orderId,
      courierId,
      status: 'rejected',
      offerId,
    });

    return { success: true, offer };
  }

  public getActiveLeases(): OrderLease[] {
    const leases = this.loadLeases();
    const now = Date.now();
    return Object.values(leases).filter((l) => l.expiresAt > now);
  }

  public getPendingOffersForCourier(courierId: string): DispatchOffer[] {
    const offers = this.loadOffers();
    const now = new Date().toISOString();
    return Object.values(offers).filter((o) => {
      const exp = o.expiresAt || o.expiresAtUtc || '';
      return o.courierId === courierId && (o.status === 'pending' || o.status === 'offered') && exp > now;
    });
  }

  public getOffersForOrder(orderId: string): DispatchOffer[] {
    const offers = this.loadOffers();
    return Object.values(offers).filter((o) => o.orderId === orderId);
  }
}

export const dispatchService = DispatchService.getInstance();
