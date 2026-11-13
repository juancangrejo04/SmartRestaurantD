import { CurrencyCode, Money, RegionProfile } from '../types';

/**
 * Money utilities using integer arithmetic on minor units.
 * No floats, no rounding surprises, full precision.
 */
export const MoneyUtils = {
  create(amountMinorUnits: number, currency: CurrencyCode): Money {
    return {
      amount: Math.round(amountMinorUnits),
      currency,
    };
  },

  add(a: Money, b: Money): Money {
    if (a.currency !== b.currency) {
      throw new Error(`Cannot add mismatched currencies: ${a.currency} and ${b.currency}`);
    }
    return {
      amount: a.amount + b.amount,
      currency: a.currency,
    };
  },

  sub(a: Money, b: Money): Money {
    if (a.currency !== b.currency) {
      throw new Error(`Cannot subtract mismatched currencies: ${a.currency} and ${b.currency}`);
    }
    return {
      amount: a.amount - b.amount,
      currency: a.currency,
    };
  },

  mulBps(money: Money, rateBps: number): Money {
    // 10,000 bps = 100%
    const multiplied = Math.round((money.amount * rateBps) / 10000);
    return {
      amount: multiplied,
      currency: money.currency,
    };
  },

  splitEvenly(money: Money, parts: number): Money[] {
    if (parts <= 0) return [money];
    const base = Math.floor(money.amount / parts);
    const remainder = money.amount % parts;
    const result: Money[] = [];
    for (let i = 0; i < parts; i++) {
      result.push({
        amount: base + (i < remainder ? 1 : 0),
        currency: money.currency,
      });
    }
    return result;
  },

  format(money: Money, profile: RegionProfile): string {
    const isZeroDecimal = profile.fractionDigits === 0;
    const displayValue = isZeroDecimal
      ? money.amount
      : money.amount / Math.pow(10, profile.fractionDigits);

    // Format with exact regional thousand and decimal separators defined in the profile
    const parts = displayValue.toFixed(profile.fractionDigits).split('.');
    let intPart = parts[0];
    const decPart = parts[1];

    // Insert thousands separator
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, profile.thousandSeparator);

    const formattedNumber = isZeroDecimal || !decPart
      ? intPart
      : `${intPart}${profile.decimalSeparator}${decPart}`;

    const symbol = profile.currencySymbolOverride || profile.currencySymbol;
    const space = profile.symbolSpacing ? ' ' : '';

    if (profile.symbolPosition === 'before') {
      return `${symbol}${space}${formattedNumber}`;
    } else {
      return `${formattedNumber}${space}${symbol}`;
    }
  },
};

/**
 * Format a given minor-units integer price according to the active RegionProfile.
 */
export function formatMinorUnits(amountMinorUnits: number, profile: RegionProfile): string {
  return MoneyUtils.format({ amount: amountMinorUnits, currency: profile.currency }, profile);
}

/**
 * Format an ISO UTC date string according to the active RegionProfile's timeZone and format
 */
export function formatRegionalDate(utcIsoString: string, profile: RegionProfile): string {
  try {
    const date = new Date(utcIsoString);
    if (isNaN(date.getTime())) return utcIsoString;

    const formatter = new Intl.DateTimeFormat(profile.defaultLanguage, {
      timeZone: profile.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const parts = formatter.formatToParts(date);
    const y = parts.find((p) => p.type === 'year')?.value || '2026';
    const m = parts.find((p) => p.type === 'month')?.value || '01';
    const d = parts.find((p) => p.type === 'day')?.value || '01';

    if (profile.dateFormatPattern === 'dd/mm/aaaa') {
      return `${d}/${m}/${y}`;
    }
    if (profile.dateFormatPattern === 'mm/dd/aaaa') {
      return `${m}/${d}/${y}`;
    }
    return `${y}/${m}/${d}`;
  } catch {
    return utcIsoString;
  }
}

/**
 * Format regional time (12h or 24h) based on RegionProfile
 */
export function formatRegionalTime(utcIsoString: string, profile: RegionProfile): string {
  try {
    const date = new Date(utcIsoString);
    if (isNaN(date.getTime())) return utcIsoString;

    return date.toLocaleTimeString(profile.defaultLanguage, {
      timeZone: profile.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: profile.clockFormat === '12h',
    });
  } catch {
    return utcIsoString;
  }
}
