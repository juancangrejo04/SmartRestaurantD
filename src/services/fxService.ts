import { CurrencyCode, RegionProfile } from '../types';
import { broker } from '../core/broker';

export interface FxRateSnapshot {
  baseCurrency: 'USD';
  sourceName: string;
  sourceUrl: string;
  updatedAtUtc: string;
  ratesPerUsd: Record<CurrencyCode, number>;
}

const FX_STORAGE_KEY = 'smartrestaurant_v4_fx_rates';

const DEFAULT_FX_SNAPSHOT: FxRateSnapshot = {
  baseCurrency: 'USD',
  sourceName: 'European Central Bank & Federal Reserve Reference Snapshot (H.10 / Eurofxref)',
  sourceUrl: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
  updatedAtUtc: '2026-11-12T16:00:00Z',
  ratesPerUsd: {
    USD: 1.0,
    COP: 4100,
    BRL: 5.6,
    EUR: 0.92,
    JPY: 155,
  },
};

export class FxService {
  private static instance: FxService;
  private listeners = new Set<() => void>();

  private constructor() {
    broker.subscribe('FX_RATES_UPDATED', 'fx-service', async () => {
      this.listeners.forEach((cb) => cb());
    });
  }

  public static getInstance(): FxService {
    if (!FxService.instance) {
      FxService.instance = new FxService();
    }
    return FxService.instance;
  }

  public getSnapshot(): FxRateSnapshot {
    try {
      const raw = localStorage.getItem(FX_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FxRateSnapshot;
        return {
          ...DEFAULT_FX_SNAPSHOT,
          ...parsed,
          ratesPerUsd: { ...DEFAULT_FX_SNAPSHOT.ratesPerUsd, ...(parsed.ratesPerUsd || {}) },
        };
      }
    } catch {
      // Safe fallback
    }
    return DEFAULT_FX_SNAPSHOT;
  }

  public updateRates(
    rates: Partial<Record<CurrencyCode, number>>,
    sourceName?: string
  ): FxRateSnapshot {
    const current = this.getSnapshot();
    const next: FxRateSnapshot = {
      ...current,
      sourceName: sourceName || current.sourceName,
      updatedAtUtc: new Date().toISOString().replace('.000Z', 'Z'),
      ratesPerUsd: {
        ...current.ratesPerUsd,
        ...rates,
        USD: 1.0,
      },
    };
    try {
      localStorage.setItem(FX_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota errors
    }
    this.listeners.forEach((cb) => cb());
    broker.publish({
      sourceService: 'fx-service',
      type: 'FX_RATES_UPDATED',
      targetServices: ['analytics-service'],
      payload: {
        updatedAtUtc: next.updatedAtUtc,
        ratesPerUsd: next.ratesPerUsd,
      },
    });
    return next;
  }

  public resetSnapshot(): FxRateSnapshot {
    localStorage.removeItem(FX_STORAGE_KEY);
    this.listeners.forEach((cb) => cb());
    return DEFAULT_FX_SNAPSHOT;
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  /**
   * Converts integer minor units in a local currency (e.g. COP 25900, BRL 2590 cents, JPY 2590)
   * into integer USD cents for consolidated reporting only (never shown to local customers).
   */
  public convertMinorUnitsToUsdCents(amountMinorUnits: number, profile: RegionProfile): number {
    const snapshot = this.getSnapshot();
    const ratePerUsd = snapshot.ratesPerUsd[profile.currency] || 1;
    const majorUnits =
      profile.fractionDigits === 0
        ? amountMinorUnits
        : amountMinorUnits / Math.pow(10, profile.fractionDigits);
    const usdAmount = majorUnits / ratePerUsd;
    return Math.round(usdAmount * 100);
  }

  public formatUsdCents(usdCents: number): string {
    const dollars = usdCents / 100;
    return `$${dollars.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

export const fxService = FxService.getInstance();
