import { Branch, CountryCode, CountryConfig, Language, MenuItem } from '../types';
import { REGION_PROFILES } from '../data/regions';
import { formatMinorUnits } from '../core/money';

export { type CountryConfig } from '../types';

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  CO: {
    code: 'CO',
    name: 'Colombia',
    nativeName: REGION_PROFILES.CO.nativeName,
    language: REGION_PROFILES.CO.defaultLanguage,
    currency: REGION_PROFILES.CO.currency,
    symbol: REGION_PROFILES.CO.currencySymbol,
    flagEmoji: REGION_PROFILES.CO.flagEmoji,
    timeZone: REGION_PROFILES.CO.timeZone,
    taxRate: (REGION_PROFILES.CO.taxRules[0]?.rateBps ?? 800) / 10000,
    taxName: `${REGION_PROFILES.CO.receipt.officialAuthority} (${((REGION_PROFILES.CO.taxRules[0]?.rateBps ?? 800) / 100).toFixed(0)}%)`,
    locale: 'es-CO',
    hasDecimals: REGION_PROFILES.CO.fractionDigits > 0,
    ratePerUSD: 4100,
    profile: REGION_PROFILES.CO,
  },
  BR: {
    code: 'BR',
    name: 'Brasil',
    nativeName: REGION_PROFILES.BR.nativeName,
    language: REGION_PROFILES.BR.defaultLanguage,
    currency: REGION_PROFILES.BR.currency,
    symbol: REGION_PROFILES.BR.currencySymbol,
    flagEmoji: REGION_PROFILES.BR.flagEmoji,
    timeZone: REGION_PROFILES.BR.timeZone,
    taxRate: (REGION_PROFILES.BR.taxRules[0]?.rateBps ?? 1000) / 10000,
    taxName: `${REGION_PROFILES.BR.receipt.officialAuthority} (${((REGION_PROFILES.BR.taxRules[0]?.rateBps ?? 1000) / 100).toFixed(0)}%)`,
    locale: 'pt-BR',
    hasDecimals: REGION_PROFILES.BR.fractionDigits > 0,
    ratePerUSD: 5.6,
    profile: REGION_PROFILES.BR,
  },
  US: {
    code: 'US',
    name: 'Estados Unidos',
    nativeName: REGION_PROFILES.US.nativeName,
    language: REGION_PROFILES.US.defaultLanguage,
    currency: REGION_PROFILES.US.currency,
    symbol: REGION_PROFILES.US.currencySymbol,
    flagEmoji: REGION_PROFILES.US.flagEmoji,
    timeZone: REGION_PROFILES.US.timeZone,
    taxRate: (REGION_PROFILES.US.taxRules[0]?.rateBps ?? 888) / 10000,
    taxName: `${REGION_PROFILES.US.receipt.officialAuthority} (${((REGION_PROFILES.US.taxRules[0]?.rateBps ?? 888) / 100).toFixed(3)}%)`,
    locale: 'en-US',
    hasDecimals: REGION_PROFILES.US.fractionDigits > 0,
    ratePerUSD: 1.0,
    profile: REGION_PROFILES.US,
  },
  FR: {
    code: 'FR',
    name: 'Francia',
    nativeName: REGION_PROFILES.FR.nativeName,
    language: REGION_PROFILES.FR.defaultLanguage,
    currency: REGION_PROFILES.FR.currency,
    symbol: REGION_PROFILES.FR.currencySymbol,
    flagEmoji: REGION_PROFILES.FR.flagEmoji,
    timeZone: REGION_PROFILES.FR.timeZone,
    taxRate: (REGION_PROFILES.FR.taxRules[0]?.rateBps ?? 1000) / 10000,
    taxName: `${REGION_PROFILES.FR.receipt.officialAuthority} (${((REGION_PROFILES.FR.taxRules[0]?.rateBps ?? 1000) / 100).toFixed(0)}%)`,
    locale: 'fr-FR',
    hasDecimals: REGION_PROFILES.FR.fractionDigits > 0,
    ratePerUSD: 0.92,
    profile: REGION_PROFILES.FR,
  },
  JP: {
    code: 'JP',
    name: 'Japón',
    nativeName: REGION_PROFILES.JP.nativeName,
    language: REGION_PROFILES.JP.defaultLanguage,
    currency: REGION_PROFILES.JP.currency,
    symbol: REGION_PROFILES.JP.currencySymbol,
    flagEmoji: REGION_PROFILES.JP.flagEmoji,
    timeZone: REGION_PROFILES.JP.timeZone,
    taxRate: (REGION_PROFILES.JP.taxRules[0]?.rateBps ?? 1000) / 10000,
    taxName: `${REGION_PROFILES.JP.receipt.officialAuthority} (${((REGION_PROFILES.JP.taxRules[0]?.rateBps ?? 1000) / 100).toFixed(0)}%)`,
    locale: 'ja-JP',
    hasDecimals: REGION_PROFILES.JP.fractionDigits > 0,
    ratePerUSD: 155,
    profile: REGION_PROFILES.JP,
  },
};

/**
 * Format currency strictly driven by target country's RegionProfile
 */
export function formatCurrency(
  amount: number,
  countryCode: CountryCode,
  isBaseUSD: boolean = true
): string {
  const config = COUNTRIES[countryCode] || COUNTRIES.CO;
  const profile = config.profile;
  const valueMinorUnits = isBaseUSD && amount > 0 && amount < 500
    ? Math.round(amount * config.ratePerUSD * Math.pow(10, profile.fractionDigits))
    : Math.round(amount);
  return formatMinorUnits(valueMinorUnits, profile);
}

/**
 * Formats a dish price dynamically into the target country currency.
 * Prioritizes pre-calculated country prices, integer minor units, or converts basePriceUSD.
 */
export function formatDishPrice(
  itemOrPrice:
    | number
    | MenuItem
    | {
        basePriceUSD?: number;
        price?: number;
        priceMinorUnits?: number;
        pricesByCountry?: Partial<Record<CountryCode, number>>;
        country?: CountryCode;
        countryCode?: CountryCode;
      }
    | undefined
    | null,
  targetCountry: CountryCode
): string {
  const config = COUNTRIES[targetCountry] || COUNTRIES.CO;
  const profile = config.profile;

  if (itemOrPrice === undefined || itemOrPrice === null) {
    return formatMinorUnits(0, profile);
  }

  if (typeof itemOrPrice === 'number') {
    return formatMinorUnits(Math.round(itemOrPrice), profile);
  }

  if (itemOrPrice.pricesByCountry && itemOrPrice.pricesByCountry[targetCountry] !== undefined) {
    return formatMinorUnits(itemOrPrice.pricesByCountry[targetCountry]!, profile);
  }

  if (itemOrPrice.priceMinorUnits !== undefined) {
    return formatMinorUnits(itemOrPrice.priceMinorUnits, profile);
  }

  if (itemOrPrice.price !== undefined) {
    return formatMinorUnits(Math.round(itemOrPrice.price), profile);
  }

  if (itemOrPrice.basePriceUSD !== undefined) {
    const minorUnits = Math.round(
      itemOrPrice.basePriceUSD * config.ratePerUSD * Math.pow(10, profile.fractionDigits)
    );
    return formatMinorUnits(minorUnits, profile);
  }

  return formatMinorUnits(0, profile);
}

/**
 * Helper to get a branch's localized display name
 */
export function getBranchName(branch: Branch | undefined | null, lang: Language): string {
  if (!branch) return '';
  if (branch.localizedName && branch.localizedName[lang]) {
    return branch.localizedName[lang];
  }
  return branch.name;
}

/**
 * Helper to get a branch's localized city name
 */
export function getBranchCity(branch: Branch | undefined | null, lang: Language): string {
  if (!branch) return '';
  if (branch.localizedCity && branch.localizedCity[lang]) {
    return branch.localizedCity[lang];
  }
  return branch.city;
}

/**
 * Format regional date/time in the target country's timezone
 */
export function formatDateTime(isoString: string | Date, countryCode: CountryCode): string {
  const config = COUNTRIES[countryCode] || COUNTRIES.CO;
  const date = typeof isoString === 'string' ? new Date(isoString) : isoString;
  try {
    return new Intl.DateTimeFormat(config.locale, {
      timeZone: config.timeZone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

/**
 * Format regional time only (HH:mm)
 */
export function formatTime(isoString: string | Date, countryCode: CountryCode): string {
  const config = COUNTRIES[countryCode] || COUNTRIES.CO;
  const date = typeof isoString === 'string' ? new Date(isoString) : isoString;
  try {
    return new Intl.DateTimeFormat(config.locale, {
      timeZone: config.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: config.profile.clockFormat === '12h',
    }).format(date);
  } catch {
    return date.toLocaleTimeString();
  }
}

/**
 * Live time string with seconds in the country's timezone
 */
export function getLiveTime(countryCode: CountryCode): string {
  const config = COUNTRIES[countryCode] || COUNTRIES.CO;
  try {
    return new Intl.DateTimeFormat(config.locale, {
      timeZone: config.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: config.profile.clockFormat === '12h',
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString();
  }
}

export const formatRegionalDateTime = formatDateTime;
export const getLiveTimeInTimezone = getLiveTime;
