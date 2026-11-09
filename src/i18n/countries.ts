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
    taxRate: 0.08, // Impuesto Nacional al Consumo
    taxName: 'Impoconsumo (8%)',
    locale: 'es-CO',
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
    taxRate: 0.16, // IVA
    taxName: 'IVA (16%)',
    locale: 'es-MX',
    ratePerUSD: 19.5,
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
    taxRate: 0.08875, // NY Sales Tax
    taxName: 'Sales Tax (8.875%)',
    locale: 'en-US',
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
    taxRate: 0.10, // Taxa de Serviço / ICMS
    taxName: 'Taxa de Serviço (10%)',
    locale: 'pt-BR',
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
    taxRate: 0.10, // 消費税
    taxName: '消費税 (10%)',
    locale: 'ja-JP',
    ratePerUSD: 152,
  },
};

/**
 * Formats a monetary amount in the target country's currency and locale
 */
export function formatCurrency(amountUSD: number, countryCode: CountryCode): string {
  const config = COUNTRIES[countryCode];
  const localAmount = amountUSD * config.ratePerUSD;

  if (countryCode === 'CO') {
    // Format COP rounded to nearest thousand or hundred
    return `${Math.round(localAmount).toLocaleString('es-CO')} COP`;
  }
  if (countryCode === 'JP') {
    return `¥${Math.round(localAmount).toLocaleString('ja-JP')}`;
  }
  if (countryCode === 'BR') {
    return `R$ ${localAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (countryCode === 'MX') {
    return `$${localAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
  }
  return `$${localAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formats a date & time taking into account the country's timezone
 */
export function formatRegionalDateTime(isoString: string | Date, countryCode: CountryCode): string {
  const config = COUNTRIES[countryCode];
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
 * Returns the current time formatted in the country's timezone
 */
export function getLiveTimeInTimezone(countryCode: CountryCode): string {
  const config = COUNTRIES[countryCode];
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
