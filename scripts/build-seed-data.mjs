import fs from 'fs';

const branches = JSON.parse(fs.readFileSync('scripts/branches.json', 'utf8'));
const masterDishes = JSON.parse(fs.readFileSync('scripts/master_dishes.json', 'utf8'));

// 1. Restaurants: Aura Mestiza (brand-aura) and Sora (brand-sora)
const RESTAURANTS = [
  {
    id: 'brand-aura',
    name: 'Aura Mestiza',
    slug: 'aura-mestiza',
    tagline: {
      es: 'Cocina de Origen & Fuego Vivo',
      en: 'Ancestral Fire & Earth Cuisine',
      pt: 'Cozinha de Origem e Fogo Vivo',
      fr: 'Cuisine d’Origine & Flamme Vivante',
      ja: '大地の恵みと炭火料理の伝統',
    },
    cuisine: {
      es: 'Cocina de Origen & Brasa',
      en: 'Ancestral Grill & Earth Roots',
      pt: 'Grelhados e Cozinha de Origem',
      fr: 'Grillades au feu de bois & cuisine de terroir',
      ja: '産地直材料理・薪火グリル',
    },
    description: {
      es: 'Homenaje a los ingredientes autóctonos de cada tierra, preparados al calor de la brasa viva y técnicas ancestrales.',
      en: 'A tribute to indigenous ingredients of each territory, cooked over open coals with ancestral techniques.',
      pt: 'Homenagem aos ingredientes nativos de cada terra, preparados ao calor da brasa viva e técnicas ancestrais.',
      fr: 'Hommage aux terroirs et aux ingrédients indigènes, magnifiés par la braise vivante et des techniques séculaires.',
      ja: '大地の恵みと各国の旬の食材を厳選。炭火と薪の炎で豪快かつ繊細に仕上げる美食体験。',
    },
    story: {
      es: 'Nacida de la pasión por el fuego y la biodiversidad, Aura Mestiza rescata recetas tradicionales con un toque contemporáneo.',
      en: 'Born from a passion for fire and biodiversity, Aura Mestiza brings ancestral recipes into modern fine dining.',
      pt: 'Nascida da paixão pelo fogo e pela biodiversidade, a Aura Mestiza resgata receitas tradicionais com um toque contemporâneo.',
      fr: 'Née d’une passion pour le feu et les terroirs vivants, Aura Mestiza réinterprète les recettes ancestrales avec modernité.',
      ja: '自然の恵みと炎への敬意から誕生。古来の調理技法を受け継ぎ、現代の洗練された一皿へと昇華させます。',
    },
    operatingCountries: ['CO', 'BR', 'US', 'FR', 'JP'],
    rating: 4.9,
    reviewCount: 348,
    priceRange: '$$$',
    heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80',
    ],
    logo: '🔥',
    contactEmail: 'contacto@auramestiza.com',
    phone: '+57 310 450 8920',
  },
  {
    id: 'brand-sora',
    name: 'Sora',
    slug: 'sora',
    tagline: {
      es: 'Alta Cocina Nikkei & Tradición Tokio',
      en: 'Contemporary Nikkei & Tokyo Craft',
      pt: 'Alta Gastronomia Nikkei e Tradição de Tóquio',
      fr: 'Haute Gastronomie Nikkei & Maîtrise de Tokyo',
      ja: '宙 (Sora) 日系創作料理と江戸前伝統の融合',
    },
    cuisine: {
      es: 'Nikkei & Japonesa Contemporánea',
      en: 'Nikkei & Contemporary Japanese',
      pt: 'Nikkei e Japonesa Contemporânea',
      fr: 'Nikkei & Gastronomie Japonaise Contemporaine',
      ja: '日系フュージョン・現代和食',
    },
    description: {
      es: 'Precisión nipona y vibrantes ingredientes locales. Cortes milimétricos, fermentaciones pausadas y caldos umami reconfortantes.',
      en: 'Japanese culinary precision meets vibrant local produce. Knife mastery, aged ferments and soul-warming umami broths.',
      pt: 'Precisão nipônica e ingredientes locais vibrantes. Cortes milimétricos, fermentações lentas e caldos umami reconfortantes.',
      fr: 'Précision japonaise et fraîcheur des produits locaux. Maîtrise des découpes, fermentations douces et bouillons umami.',
      ja: '日本の卓越した包丁技法と出汁文化に、各国の極上素材を調和させた新時代の現代和食。',
    },
    story: {
      es: 'Fundada en el corazón de Ginza, Sora viaja por el mundo reinterpretando la cultura culinaria japonesa con los mejores pescados y productos de proximidad.',
      en: 'Founded in the heart of Ginza, Sora journeys across the globe blending Tokyo tradition with coastal seafood of each region.',
      pt: 'Fundada em Ginza, a Sora cruza fronteiras reinterpretando a cultura gastronômica japonesa com os melhores insumos locais.',
      fr: 'Fondée à Ginza, Sora célèbre les rencontres culinaires en mariant les traditions de Tokyo aux meilleurs produits marins.',
      ja: '東京・銀座で創業。熟成赤酢の握り、本格出汁ラーメン、旬魚の創作料理を世界五大都市で展開しています。',
    },
    operatingCountries: ['CO', 'BR', 'US', 'FR', 'JP'],
    rating: 4.8,
    reviewCount: 412,
    priceRange: '$$$$',
    heroImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    ],
    logo: '🌊',
    contactEmail: 'contact@sorarestaurant.com',
    phone: '+81 3-6264-5588',
  },
];

// 2. Users (Mapped cleanly across all 5 countries, starting unauthenticated)
const USERS = [
  {
    id: 'user-owner',
    name: 'Carlos Mendoza',
    email: 'carlos.owner@smartrestaurant.io',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    country: 'CO',
    language: 'es',
  },
  {
    id: 'user-admin-co',
    name: 'Elena Rostova',
    email: 'elena.admin@smartrestaurant.io',
    role: 'branch_admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'br-aura-co-chapinero',
    country: 'CO',
    language: 'es',
  },
  {
    id: 'user-admin-br',
    name: 'Thiago Silva',
    email: 'thiago.admin@smartrestaurant.io',
    role: 'branch_admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'br-aura-br-pinheiros',
    country: 'BR',
    language: 'pt',
  },
  {
    id: 'user-admin-us',
    name: 'Michael Vance',
    email: 'michael.admin@smartrestaurant.io',
    role: 'branch_admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'br-aura-us-manhattan',
    country: 'US',
    language: 'en',
  },
  {
    id: 'user-admin-fr',
    name: 'Camille Dupont',
    email: 'camille.admin@smartrestaurant.io',
    role: 'branch_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'br-aura-fr-marais',
    country: 'FR',
    language: 'fr',
  },
  {
    id: 'user-admin-jp',
    name: 'Kenji Sato',
    email: 'kenji.admin@smartrestaurant.io',
    role: 'branch_admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'br-aura-jp-shibuya',
    country: 'JP',
    language: 'ja',
  },
  {
    id: 'user-waiter-1',
    name: 'Mateo Gómez',
    email: 'mateo.waiter@smartrestaurant.io',
    role: 'waiter',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'br-aura-co-chapinero',
    country: 'CO',
    language: 'es',
  },
  {
    id: 'user-kitchen-1',
    name: 'Chef Andrés Salgado',
    email: 'andres.kitchen@smartrestaurant.io',
    role: 'kitchen',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'br-aura-co-chapinero',
    country: 'CO',
    language: 'es',
  },
  {
    id: 'user-courier-1',
    name: 'Felipe Moreno',
    email: 'felipe.courier@smartrestaurant.io',
    role: 'courier',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    assignedBranchId: 'br-aura-co-chapinero',
    country: 'CO',
    language: 'es',
  },
  {
    id: 'user-platform-admin',
    name: 'Directorio Central',
    email: 'root@smartrestaurant.io',
    role: 'platform_admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    country: 'CO',
    language: 'es',
  },
  {
    id: 'user-customer-co',
    name: 'Valentina Morales',
    email: 'valentina.morales@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    country: 'CO',
    language: 'es',
  },
  {
    id: 'user-customer-br',
    name: 'Camila Santos',
    email: 'camila.santos@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    country: 'BR',
    language: 'pt',
  },
  {
    id: 'user-customer-us',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    country: 'US',
    language: 'en',
  },
  {
    id: 'user-customer-fr',
    name: 'Juliette Moreau',
    email: 'juliette.moreau@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    country: 'FR',
    language: 'fr',
  },
  {
    id: 'user-customer-jp',
    name: 'Yuki Takahashi',
    email: 'yuki.takahashi@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    country: 'JP',
    language: 'ja',
  },
];

// 3. Tables for all 20 branches (8 to 12 tables each)
const TABLES = [];
for (const b of branches) {
  const count = b.totalTables || 10;
  for (let i = 1; i <= count; i++) {
    const zone = i <= 4 ? 'indoor' : i <= 7 ? 'terrace' : i <= 9 ? 'vip' : 'bar';
    const capacity = i === 1 ? 2 : i === 2 ? 4 : i === 3 ? 6 : i <= 6 ? 4 : 2;
    TABLES.push({
      id: `tbl-${b.id}-${i}`,
      branchId: b.id,
      number: i,
      capacity,
      zone,
      status: i === 2 ? 'occupied' : i === 3 ? 'reserved' : 'available',
      currentGuestsCount: i === 2 ? 3 : 0,
    });
  }
}

// 4. Build MenuItems for all branches by associating branchId
const MENU_ITEMS = [];
for (const b of branches) {
  const branchDishes = masterDishes.filter(d => d.countryCode === b.country && d.restaurantId === b.restaurantId);
  // Also include the lunch of the day and drinks
  const sharedDishes = masterDishes.filter(d => d.countryCode === b.country && (d.isLunchOfTheDay || d.category === 'drinks'));
  const allForBranch = [...branchDishes, ...sharedDishes];
  
  for (const d of allForBranch) {
    MENU_ITEMS.push({
      ...d,
      id: `${b.id}-${d.id}`,
      branchId: b.id,
    });
  }
}

console.log('Seed tables created:', TABLES.length);
console.log('Seed menu items created:', MENU_ITEMS.length);

fs.writeFileSync('scripts/seed_restaurants.json', JSON.stringify(RESTAURANTS, null, 2));
fs.writeFileSync('scripts/seed_users.json', JSON.stringify(USERS, null, 2));
fs.writeFileSync('scripts/seed_tables.json', JSON.stringify(TABLES, null, 2));
fs.writeFileSync('scripts/seed_menu_items.json', JSON.stringify(MENU_ITEMS, null, 2));
