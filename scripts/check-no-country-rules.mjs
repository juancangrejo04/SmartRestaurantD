import fs from 'fs';
import path from 'path';

// Files and directories allowed to define country codes and profiles
const ALLOWED_PATHS = [
  'src/data/regions',
  'src/i18n',
  'src/types',
  'src/data/seedData.ts',
  'src/data/dishCatalog.ts',
];

const FORBIDDEN_PATTERNS = [
  /===\s*['"]CO['"]/g,
  /===\s*['"]BR['"]/g,
  /===\s*['"]US['"]/g,
  /===\s*['"]FR['"]/g,
  /===\s*['"]JP['"]/g,
  /case\s*['"](CO|BR|US|FR|JP)['"]:/g,
  /country\s*===\s*['"][A-Z]{2}['"]/g,
  /region\s*===\s*['"][A-Z]{2}['"]/g,
  /currency\s*===\s*['"][A-Z]{3}['"]/g,
];

let violations = 0;

function checkFile(filePath) {
  const normPath = filePath.replace(/\\/g, '/');
  for (const allowed of ALLOWED_PATHS) {
    if (normPath.includes(allowed)) {
      return;
    }
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const pattern of FORBIDDEN_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      console.error(`[check-no-country-rules] Violation in ${normPath}: found "${matches.join(', ')}"`);
      violations++;
    }
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      checkFile(full);
    }
  }
}

scanDir('src');

if (violations > 0) {
  console.error(`[check-no-country-rules] FAILED: Found ${violations} country branching violations.`);
  process.exit(1);
} else {
  console.log('[check-no-country-rules] SUCCESS: Zero country conditional branching rules found in business code.');
}
