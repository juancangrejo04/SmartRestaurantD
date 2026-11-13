import { CountryCode, RegionProfile, SimulatedCountryDraft } from '../types';
import { CO_PROFILE } from '../data/regions/CO';
import { BR_PROFILE } from '../data/regions/BR';
import { US_PROFILE } from '../data/regions/US';
import { FR_PROFILE } from '../data/regions/FR';
import { JP_PROFILE } from '../data/regions/JP';

const STORAGE_PROFILES_KEY = 'smartrestaurant_v4_region_profiles';
const STORAGE_SIMULATED_COUNTRY_KEY = 'smartrestaurant_v4_simulated_country_draft';

const BASE_PROFILES: Record<CountryCode, RegionProfile> = {
  CO: {
    ...CO_PROFILE,
    revenueModel: { ...CO_PROFILE.revenueModel, sponsoredListingFeeMinorUnits: CO_PROFILE.revenueModel.sponsoredListingFeeMinorUnits ?? 180000 },
  },
  BR: {
    ...BR_PROFILE,
    revenueModel: { ...BR_PROFILE.revenueModel, sponsoredListingFeeMinorUnits: BR_PROFILE.revenueModel.sponsoredListingFeeMinorUnits ?? 29900 },
  },
  US: {
    ...US_PROFILE,
    revenueModel: { ...US_PROFILE.revenueModel, sponsoredListingFeeMinorUnits: US_PROFILE.revenueModel.sponsoredListingFeeMinorUnits ?? 4900 },
  },
  FR: {
    ...FR_PROFILE,
    revenueModel: { ...FR_PROFILE.revenueModel, sponsoredListingFeeMinorUnits: FR_PROFILE.revenueModel.sponsoredListingFeeMinorUnits ?? 4500 },
  },
  JP: {
    ...JP_PROFILE,
    revenueModel: { ...JP_PROFILE.revenueModel, sponsoredListingFeeMinorUnits: JP_PROFILE.revenueModel.sponsoredListingFeeMinorUnits ?? 7500 },
  },
};

const listeners = new Set<() => void>();

function loadOverrides(): Partial<Record<CountryCode, RegionProfile>> {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Partial<Record<CountryCode, RegionProfile>>): void {
  try {
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(overrides));
    listeners.forEach((cb) => cb());
  } catch {
    // Ignore storage quota errors
  }
}

export function subscribeRegionProfiles(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getAllRegionProfilesMap(): Record<CountryCode, RegionProfile> {
  const overrides = loadOverrides();
  const result = {} as Record<CountryCode, RegionProfile>;
  (Object.keys(BASE_PROFILES) as CountryCode[]).forEach((code) => {
    const base = BASE_PROFILES[code];
    const custom = overrides[code];
    result[code] = custom
      ? {
          ...base,
          ...custom,
          revenueModel: { ...base.revenueModel, ...(custom.revenueModel || {}) },
          tipPolicy: { ...base.tipPolicy, ...(custom.tipPolicy || {}) },
          receipt: { ...base.receipt, ...(custom.receipt || {}) },
          dataResidency: { ...base.dataResidency, ...(custom.dataResidency || {}) },
          ui: { ...base.ui, ...(custom.ui || {}) },
        }
      : base;
  });
  return result;
}

export function getStoredRegionProfile(code: CountryCode): RegionProfile {
  const map = getAllRegionProfilesMap();
  return map[code] || BASE_PROFILES.CO;
}

export function updateStoredRegionProfile(
  code: CountryCode,
  updater: Partial<RegionProfile> | ((current: RegionProfile) => RegionProfile)
): RegionProfile {
  const current = getStoredRegionProfile(code);
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  const overrides = loadOverrides();
  overrides[code] = next;
  saveOverrides(overrides);
  return next;
}

export function resetStoredRegionProfiles(): void {
  try {
    localStorage.removeItem(STORAGE_PROFILES_KEY);
    localStorage.removeItem(STORAGE_SIMULATED_COUNTRY_KEY);
    listeners.forEach((cb) => cb());
  } catch {
    // Safe fallback
  }
}

export function getSimulatedCountryDraft(): SimulatedCountryDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_SIMULATED_COUNTRY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function registerSimulatedCountryDraft(): SimulatedCountryDraft {
  const draft: SimulatedCountryDraft = {
    code: 'DE',
    name: {
      es: 'Alemania (Borrador desactivado)',
      en: 'Germany (Disabled draft)',
      pt: 'Alemanha (Rascunho desativado)',
      fr: 'Allemagne (Brouillon désactivé)',
      ja: 'ドイツ（無効ドラフト）',
    },
    currency: 'EUR',
    timeZone: 'Europe/Berlin',
    enabled: false,
    registeredAtUtc: new Date().toISOString().replace('.000Z', 'Z'),
  };
  try {
    localStorage.setItem(STORAGE_SIMULATED_COUNTRY_KEY, JSON.stringify(draft));
    listeners.forEach((cb) => cb());
  } catch {
    // Safe fallback
  }
  return draft;
}

export function clearSimulatedCountryDraft(): void {
  try {
    localStorage.removeItem(STORAGE_SIMULATED_COUNTRY_KEY);
    listeners.forEach((cb) => cb());
  } catch {
    // Safe fallback
  }
}
