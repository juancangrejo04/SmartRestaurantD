import fs from 'fs';
import path from 'path';

const localesDir = path.resolve('src/i18n/locales');
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

// Compare keys across all 5 languages
const esKeys = Object.keys(keysByLang.es).sort();
let hasError = false;

for (const lang of langs) {
  const langKeys = Object.keys(keysByLang[lang]).sort();
  if (langKeys.length !== esKeys.length) {
    console.error(`[check-i18n] Key count mismatch in ${lang}: ${langKeys.length} vs ES ${esKeys.length}`);
    hasError = true;
  }
  for (const k of esKeys) {
    if (!keysByLang[lang][k]) {
      console.error(`[check-i18n] Missing or empty key "${k}" in locale ${lang}`);
      hasError = true;
    }
  }
}

if (hasError) {
  console.error('[check-i18n] FAILED: Missing or inconsistent translation keys.');
  process.exit(1);
} else {
  console.log(`[check-i18n] SUCCESS: All 5 locales have exactly ${esKeys.length} non-empty keys.`);
}
