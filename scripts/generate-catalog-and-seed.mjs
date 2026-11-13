import fs from 'fs';

const masterDishes = JSON.parse(fs.readFileSync('scripts/master_dishes.json', 'utf8'));
const branches = JSON.parse(fs.readFileSync('scripts/branches.json', 'utf8'));

// 1. Write src/data/dishCatalog.ts cleanly
const dishCatalogFileContent = `import { CountryCode, Language, MenuCategory, MenuItem } from '../types';

export interface CatalogDish {
  id: string;
  restaurantId: string;
  countryCode: CountryCode;
  category: MenuCategory;
  name: Record<Language, string>;
  description: Record<Language, string>;
  priceMinorUnits: number; // Integer in minor units
  price: number; // legacy alias
  basePriceUSD: number;
  prepTimeMinutes: number;
  available: boolean;
  image: string;
  imageAlt: Record<Language, string>;
  fallbackEmoji: string;
  popular?: boolean;
  isLunchOfTheDay?: boolean;
  dietary?: ('vegetarian' | 'vegan' | 'gluten_free' | 'spicy' | 'chef_special')[];
}

export const DISH_CATALOG: CatalogDish[] = ${JSON.stringify(masterDishes, null, 2)};

export function getDishesForCountry(countryCode: CountryCode): CatalogDish[] {
  return DISH_CATALOG.filter((d) => d.countryCode === countryCode);
}

export function buildMenuItemsForBranch(branchId: string, countryCode: CountryCode): MenuItem[] {
  return DISH_CATALOG.filter((d) => d.countryCode === countryCode).map((d) => ({
    ...d,
    branchId,
  }));
}
`;

fs.writeFileSync('src/data/dishCatalog.ts', dishCatalogFileContent, 'utf8');
console.log('Successfully wrote src/data/dishCatalog.ts with 50 unique dishes');
