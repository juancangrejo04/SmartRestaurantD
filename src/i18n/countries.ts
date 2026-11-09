import { CountryCode, CountryConfig } from '../types';

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  CO: {
    code: 'CO',
    name: 'Colombia',
    nativeName: 'Colombia',
    language: 'es',
    currency: 'COP',
    symbol: '$ COP',
    flagEmoji: '🇨🇴',
    timeZone: 'America/Bogota',
    taxRate: 0.08,
    taxName: 'Impoconsumo (8%)',
    locale: 'es-CO',
    hasDecimals: false,
    ratePerUSD: 4100,
  },
  MX: {
    code: 'MX',
    name: 'México',
    nativeName: 'México',
    language: 'es',
    currency: 'MXN',
    symbol: '$ MXN',
    flagEmoji: '🇲🇽',
    timeZone: 'America/Mexico_City',
    taxRate: 0.16,
    taxName: 'IVA (16%)',
    locale: 'es-MX',
    hasDecimals: true,
    ratePerUSD: 18.5,
  },
  US: {
    code: 'US',
    name: 'Estados Unidos',
    nativeName: 'United States',
    language: 'en',
    currency: 'USD',
    symbol: '$ USD',
    flagEmoji: '🇺🇸',
    timeZone: 'America/New_York',
    taxRate: 0.08875,
    taxName: 'Sales Tax (8.875%)',
    locale: 'en-US',
    hasDecimals: true,
    ratePerUSD: 1.0,
  },
  BR: {
    code: 'BR',
    name: 'Brasil',
    nativeName: 'Brasil',
    language: 'pt',
    currency: 'BRL',
    symbol: 'R$ BRL',
    flagEmoji: '🇧🇷',
    timeZone: 'America/Sao_Paulo',
    taxRate: 0.10,
    taxName: 'Taxa de Serviço / ICMS (10%)',
    locale: 'pt-BR',
    hasDecimals: true,
    ratePerUSD: 5.6,
  },
  JP: {
    code: 'JP',
    name: 'Japón',
    nativeName: '日本',
    language: 'ja',
    currency: 'JPY',
    symbol: '¥ JPY',
    flagEmoji: '🇯🇵',
    timeZone: 'Asia/Tokyo',
    taxRate: 0.10,
    taxName: '消費税 (10%)',
    locale: 'ja-JP',
    hasDecimals: false,
    ratePerUSD: 155,
  },
};

/**
 * Format currency with Intl.NumberFormat according to regional rules:
 * COP and JPY without decimals; USD, MXN and BRL with 2 decimals.
 */
export function formatCurrency(amount: number, countryCode: CountryCode): string {
  const config = COUNTRIES[countryCode] || COUNTRIES.CO;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: config.hasDecimals ? 2 : 0,
    maximumFractionDigits: config.hasDecimals ? 2 : 0,
  }).format(amount);
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
      hour12: false,
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
      hour12: false,
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString();
  }
}

export const formatRegionalDateTime = formatDateTime;
export const getLiveTimeInTimezone = getLiveTime;

