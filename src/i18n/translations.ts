import { Language } from '../types';
import { TranslationKey } from './types';
import { ES_TRANSLATIONS } from './locales/es';
import { EN_TRANSLATIONS } from './locales/en';
import { PT_TRANSLATIONS } from './locales/pt';
import { FR_TRANSLATIONS } from './locales/fr';
import { JA_TRANSLATIONS } from './locales/ja';

export const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  es: ES_TRANSLATIONS,
  en: EN_TRANSLATIONS,
  pt: PT_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
  ja: JA_TRANSLATIONS,
};

export { TRANSLATION_KEYS } from './types';
export type { TranslationKey } from './types';

/**
 * Universal safe translation function with strict fallback:
 * language -> en -> human-readable key
 * Never Spanish as default fallback, never throws raw keys without warning in dev.
 */
export function getTranslation(
  lang: Language,
  key: string,
  params?: Record<string, string | number>
): string {
  const currentCatalog = TRANSLATIONS[lang] as Record<string, string> | undefined;
  const enCatalog = TRANSLATIONS.en as Record<string, string>;

  let text = currentCatalog?.[key];

  let result = text || enCatalog?.[key] || key.replace(/_/g, ' ');

  if (params && Object.keys(params).length > 0) {
    Object.entries(params).forEach(([paramKey, val]) => {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
    });
  }

  return result;
}

/**
 * Domain localization helper.
 * Safely extracts localized string from Record<Language, string> with fallback.
 */
export function loc(
  record: Record<Language, string> | string | undefined | null,
  lang: Language
): string {
  if (!record) return '';
  if (typeof record === 'string') return record;
  return record[lang] || record.en || record.es || Object.values(record)[0] || '';
}

/**
 * CLDR-compliant pluralization helper
 */
export function plural(
  count: number,
  lang: Language,
  forms: { one: string; other: string; zero?: string }
): string {
  // French rules: 0 and 1 are singular
  if (lang === 'fr') {
    if (count <= 1) return forms.one;
    return forms.other;
  }
  // Japanese has no grammatical plural
  if (lang === 'ja') {
    return forms.other;
  }
  if (count === 0 && forms.zero) {
    return forms.zero;
  }
  if (count === 1) {
    return forms.one;
  }
  return forms.other;
}
