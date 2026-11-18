import fs from 'fs';
import path from 'path';

const localesDir = path.resolve('src/i18n/locales');
const regionsDir = path.resolve('src/data/regions');
const langs = ['es', 'en', 'pt', 'fr', 'ja'];
const keysByLang = {};

for (const lang of langs) {
  const filePath = path.join(localesDir, `${lang}.ts`);
  if (!fs.existsSync(filePath)) {
    console.error(`[check-i18n] Missing locale file: ${filePath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const jsonMatch = content.match(/=\s*(\{[\s\S]*?\});/);
  if (!jsonMatch) {
    console.error(`[check-i18n] Could not parse translation object in ${filePath}`);
    process.exit(1);
  }
  try {
    keysByLang[lang] = JSON.parse(jsonMatch[1]);
  } catch (err) {
    console.error(`[check-i18n] JSON parse error in ${filePath}:`, err);
    process.exit(1);
  }
}

// 1. Compare keys across all 5 languages & reject untranslated snake_case placeholders
const esKeys = Object.keys(keysByLang.es).sort();
let hasError = false;

for (const lang of langs) {
  const langKeys = Object.keys(keysByLang[lang]).sort();
  if (langKeys.length !== esKeys.length) {
    console.error(`[check-i18n] Key count mismatch in ${lang}: ${langKeys.length} vs ES ${esKeys.length}`);
    hasError = true;
  }
  for (const k of esKeys) {
    const val = keysByLang[lang][k];
    if (!val || typeof val !== 'string' || val.trim() === '') {
      console.error(`[check-i18n] Missing or empty key "${k}" in locale ${lang}`);
      hasError = true;
    } else if (val === k || /^[a-z0-9]+(_[a-z0-9]+)+$/.test(val)) {
      console.error(`[check-i18n] Untranslated snake_case value for "${k}" ("${val}") in locale ${lang}`);
      hasError = true;
    }
  }
}

// 2. Verify all labelKey / nameKey / region translation references in src/data/regions/*
if (fs.existsSync(regionsDir)) {
  const regionFiles = fs
    .readdirSync(regionsDir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts');

  const regionKeyRegex =
    /(?:labelKey|nameKey|pilotCityKey|documentTypeKey|fiscalNumberLabelKey|footerLegalTextKey|placeholderKey)\s*:\s*['"]([^'"]+)['"]/g;

  for (const rf of regionFiles) {
    const raw = fs.readFileSync(path.join(regionsDir, rf), 'utf8');
    let match;
    while ((match = regionKeyRegex.exec(raw)) !== null) {
      const refKey = match[1];
      for (const lang of langs) {
        if (!keysByLang[lang][refKey]) {
          console.error(`[check-i18n] Region file "${rf}" references missing key "${refKey}" in locale "${lang}"`);
          hasError = true;
        }
      }
    }
  }
}

if (hasError) {
  console.error('[check-i18n] FAILED: Missing, placeholder, or unverified translation keys.');
  process.exit(1);
} else {
  console.log(`[check-i18n] SUCCESS: All 5 locales have exactly ${esKeys.length} non-empty, translated keys (including all region profile keys).`);
}
