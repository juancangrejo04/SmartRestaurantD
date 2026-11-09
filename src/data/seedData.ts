import {
  Restaurant,
  Branch,
  Table,
  MenuItem,
  User,
  Reservation,
  Order,
  AppNotification,
  DistributedEvent,
  CountryCode,
  ServiceDefinition,
  ServiceHealth,
  Review,
} from '../types';
import { DISH_CATALOG, buildMenuItemsForBranch, getDishesForCountry } from './dishCatalog';

export const SEED_USERS: User[] = [
  // 1. Owner (Global Multinational Owner)
  {
    id: 'user-owner',
    name: 'Carlos Mendoza',
    email: 'carlos.owner@smartrestaurant.io',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    country: 'CO',
  },
  // 2. Admins per Country & Branch
  {
    id: 'user-admin-bogota',
    name: 'Elena Rostova',
    email: 'elena.admin@smartrestaurant.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'branch-aura-co-bogota',
    country: 'CO',
  },
  {
    id: 'user-admin-cdmx',
    name: 'Rodrigo Fuentes',
    email: 'rodrigo.admin@smartrestaurant.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'branch-aura-mx',
    country: 'MX',
  },
  {
    id: 'user-admin-ny',
    name: 'Michael Vance',
    email: 'michael.admin@smartrestaurant.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'branch-aura-us',
    country: 'US',
  },
  {
    id: 'user-admin-sp',
    name: 'Juliana Costa',
    email: 'juliana.admin@smartrestaurant.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'branch-aura-br',
    country: 'BR',
  },
  {
    id: 'user-admin-tokyo',
    name: 'Kenji Takahashi',
    email: 'kenji.admin@smartrestaurant.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    assignedRestaurantId: 'brand-aura',
    assignedBranchId: 'branch-aura-jp',
    country: 'JP',
  },

  // 3. Waiters
  {
    id: 'user-waiter-bogota',
    name: 'Mateo Gómez',
    email: 'mateo.waiter@smartrestaurant.io',
    role: 'waiter',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    assignedBranchId: 'branch-aura-co-bogota',
    country: 'CO',
  },
  {
    id: 'user-waiter-ny',
    name: 'Emily Davis',
    email: 'emily.waiter@smartrestaurant.io',
    role: 'waiter',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    assignedBranchId: 'branch-aura-us',
    country: 'US',
  },

  // 4. Kitchen staff
  {
    id: 'user-kitchen-bogota',
    name: 'Chef Kenji Sato',
    email: 'kenji.kitchen@smartrestaurant.io',
    role: 'kitchen',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
    assignedBranchId: 'branch-aura-co-bogota',
    country: 'CO',
  },
  {
    id: 'user-kitchen-tokyo',
    name: 'Chef Haruto Yamada',
    email: 'haruto.kitchen@smartrestaurant.io',
    role: 'kitchen',
    avatar: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=150&auto=format&fit=crop&q=80',
    assignedBranchId: 'branch-aura-jp',
    country: 'JP',
  },

  // 5. Customer Users
  {
    id: 'user-customer-co',
    name: 'Sofía Valenzuela',
    email: 'sofia.customer@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    country: 'CO',
  },
  {
    id: 'user-customer-mx',
    name: 'Alejandro Morales',
    email: 'alejandro.morales@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    country: 'MX',
  },
  {
    id: 'user-customer-us',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    country: 'US',
  },
  {
    id: 'user-customer-br',
    name: 'Lucas Silva',
    email: 'lucas.silva@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    country: 'BR',
  },
  {
    id: 'user-customer-jp',
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    country: 'JP',
  },
];

// Compatibility alias for single default admin
export const DEFAULT_ADMIN_USER = SEED_USERS[1];

// ==========================================
// 2 MARCAS MULTINACIONALES (Presentes en 5 Países)
// ==========================================
export const SEED_RESTAURANTS: Restaurant[] = [
  {
    id: 'brand-aura',
    name: 'Aura Mestiza',
    slug: 'aura-mestiza',
    tagline: {
      es: 'Alta cocina mediterránea y de autor latinoamericana',
      en: 'Signature Mediterranean & Latin American Haute Cuisine',
      pt: 'Alta gastronomia mediterrânea e autoral latino-americana',
      ja: '地中海とラテンアメリカの至高のフュージョン・オートキュイジーヌ',
    },
    cuisine: {
      es: 'Mediterránea & Fusión Latina',
      en: 'Mediterranean & Latin Fusion',
      pt: 'Mediterrânea & Fusão Latina',
      ja: '地中海・ラテンフュージョン',
    },
    description: {
      es: 'Aura Mestiza une la pasión de las brasas mediterráneas con los ingredientes sagrados de América Latina. Presente en 5 países con sucursales emblemáticas.',
      en: 'Aura Mestiza bridges Mediterranean live-fire mastery with sacred Latin American heritage. Operating across 5 countries with flagship destination branches.',
      pt: 'Aura Mestiza une o calor das brasas mediterrâneas com a alma dos ingredientes latino-americanos em 5 países.',
      ja: '地中海の炭火技術と中南米の豊かな大地が融合。世界5カ国の主要都市に旗艦店を展開する美食ブランド。',
    },
    story: {
      es: 'Fundada por un colectivo de chefs galardonados, Aura Mestiza nació con la convicción de que los mejores sabores surgen del encuentro entre culturas y técnicas ancestrales.',
      en: 'Founded by an award-winning chef collective, Aura Mestiza was born from the belief that true culinary artistry sparks at the crossroads of ancestral traditions.',
      pt: 'Fundada por chefs premiados, a Aura Mestiza nasceu do encontro vibrante entre tradições ancestrais e técnicas contemporâneas.',
      ja: '世界的な受賞歴を持つ料理人たちが集い創設。伝統と革新が交差する唯一無二のダイニング空間。',
    },
    operatingCountries: ['CO', 'MX', 'US', 'BR', 'JP'],
    country: 'CO',
    rating: 4.9,
    reviewCount: 328,
    priceRange: '$$$$',
    heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80',
    ],
    logo: '🔥',
    contactEmail: 'experiencia@auramestiza.com',
    phone: '+57 (601) 745-8900',
  },
  {
    id: 'brand-sora',
    name: 'Sora & Fuego',
    slug: 'sora-fuego',
    tagline: {
      es: 'Cocina nikkei y asiático-fusión de vanguardia',
      en: 'Avant-Garde Nikkei & Pan-Asian Robata Fusion',
      pt: 'Cozinha Nikkei e Asiática Contemporânea',
      ja: '炭火炉端焼きと新世代日系フュージョン・ダイニング',
    },
    cuisine: {
      es: 'Nikkei & Robata Asiática',
      en: 'Nikkei & Asian Robata',
      pt: 'Nikkei & Robata Asiática',
      ja: '日系・アジア炉端',
    },
    description: {
      es: 'El rigor y la frescura de la técnica japonesa dialogan con los picantes y marinados más audaces. Una experiencia sensorial en 5 metrópolis globales.',
      en: 'The sublime precision of Japanese culinary craft meets bold marinades and open charcoal robata across 5 global capitals.',
      pt: 'O rigor da técnica japonesa em diálogo harmonioso com os temperos mais ousados em 5 metrópoles globais.',
      ja: '日本伝統の職人技と南米の鮮烈なスパイスが融合した洗練の空間。世界5都市で愛されるイノベーティブ料理。',
    },
    story: {
      es: 'Inspirado en los lazos históricos entre Tokio y las costas del Pacífico, Sora & Fuego reinterpreta los pescados salvajes y el marinado robata al más alto nivel.',
      en: 'Drawing inspiration from the historic cultural ties between Tokyo and Pacific coasts, Sora & Fuego elevates wild seafood and robata grilling.',
      pt: 'Inspirado na ponte histórica entre Tóquio e o Pacífico, o Sora & Fuego eleva peixes frescos e o fogo do carvão.',
      ja: '東京と太平洋沿岸を結ぶ歴史のストーリーを、極上鮮魚と備長炭炉端で表現した現代ガストロノミー。',
    },
    operatingCountries: ['CO', 'MX', 'US', 'BR', 'JP'],
    country: 'JP',
    rating: 4.8,
    reviewCount: 294,
    priceRange: '$$$$',
    heroImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    ],
    logo: '🌊',
    contactEmail: 'contact@sorafuego.com',
    phone: '+81 (03) 5555-0199',
  },
];

// ==========================================
// SUCURSALES POR PAÍS (11 Sucursales con Nombre Propio)
// ==========================================
export const SEED_BRANCHES: Branch[] = [
  // --- AURA MESTIZA ---
  {
    id: 'branch-aura-co-bogota',
    restaurantId: 'brand-aura',
    name: 'Sucursal Chapinero (Bogotá)',
    city: 'Bogotá',
    address: 'Calle 69A # 5-28, Zona G',
    country: 'CO',
    phone: '+57 (601) 745-8901',
    openingHours: '12:00 - 23:00',
    totalTables: 10,
    active: true,
    currency: 'COP',
    taxRate: 0.08,
    taxName: 'Impoconsumo (8%)',
    timeZone: 'America/Bogota',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'branch-aura-co-medellin',
    restaurantId: 'brand-aura',
    name: 'Sucursal El Poblado (Medellín)',
    city: 'Medellín',
    address: 'Carrera 37 # 8A-12, Provenza',
    country: 'CO',
    phone: '+57 (604) 448-1234',
    openingHours: '12:00 - 23:30',
    totalTables: 10,
    active: true,
    currency: 'COP',
    taxRate: 0.08,
    taxName: 'Impoconsumo (8%)',
    timeZone: 'America/Bogota',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'branch-aura-mx',
    restaurantId: 'brand-aura',
    name: 'Sucursal Roma Norte (CDMX)',
    city: 'Ciudad de México',
    address: 'Colima 168, Col. Roma Norte, Cuauhtémoc',
    country: 'MX',
    phone: '+52 (55) 5208-4100',
    openingHours: '13:00 - 00:00',
    totalTables: 10,
    active: true,
    currency: 'MXN',
    taxRate: 0.16,
    taxName: 'IVA (16%)',
    timeZone: 'America/Mexico_City',
    heroImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'branch-aura-us',
    restaurantId: 'brand-aura',
    name: 'Sucursal Brooklyn (New York)',
    city: 'New York',
    address: '85 N 3rd St, Williamsburg, Brooklyn, NY 11249',
    country: 'US',
    phone: '+1 (718) 599-4400',
    openingHours: '12:00 - 23:00',
    totalTables: 10,
    active: true,
    currency: 'USD',
    taxRate: 0.08875,
    taxName: 'Sales Tax (8.875%)',
    timeZone: 'America/New_York',
    heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'branch-aura-br',
    restaurantId: 'brand-aura',
    name: 'Sucursal Pinheiros (São Paulo)',
    city: 'São Paulo',
    address: 'Rua dos Pinheiros 720, Pinheiros',
    country: 'BR',
    phone: '+55 (11) 3081-5500',
    openingHours: '12:00 - 23:30',
    totalTables: 10,
    active: true,
    currency: 'BRL',
    taxRate: 0.10,
    taxName: 'Taxa de Serviço (10%)',
    timeZone: 'America/Sao_Paulo',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'branch-aura-jp',
    restaurantId: 'brand-aura',
    name: 'Sucursal Shibuya (Tokio)',
    city: 'Tokyo',
    address: '1-19-8 Jinnan, Shibuya-ku, Tokyo 150-0041',
    country: 'JP',
    phone: '+81 (03) 6416-8900',
    openingHours: '11:30 - 22:30',
    totalTables: 10,
    active: true,
    currency: 'JPY',
    taxRate: 0.10,
    taxName: '消費税 (10%)',
    timeZone: 'Asia/Tokyo',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  },

  // --- SORA & FUEGO ---
  {
    id: 'branch-sora-co',
    restaurantId: 'brand-sora',
    name: 'Sucursal Zona Rosa (Bogotá)',
    city: 'Bogotá',
    address: 'Carrera 12 # 83-45, El Retiro',
    country: 'CO',
    phone: '+57 (601) 618-9920',
    openingHours: '12:00 - 23:00',
    totalTables: 10,
    active: true,
    currency: 'COP',
    taxRate: 0.08,
    taxName: 'Impoconsumo (8%)',
    timeZone: 'America/Bogota',
    heroImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'branch-sora-mx',
    restaurantId: 'brand-sora',
    name: 'Sucursal Polanco (CDMX)',
    city: 'Ciudad de México',
    address: 'Av. Emilio Castelar 131, Polanco III Secc',
    country: 'MX',
    phone: '+52 (55) 5280-9940',
    openingHours: '13:00 - 00:00',
    totalTables: 10,
    active: true,
    currency: 'MXN',
    taxRate: 0.16,
    taxName: 'IVA (16%)',
    timeZone: 'America/Mexico_City',
    heroImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'branch-sora-us',
    restaurantId: 'brand-sora',
    name: 'Sucursal Soho (New York)',
    city: 'New York',
    address: '472 West Broadway, SoHo, New York, NY 10012',
    country: 'US',
    phone: '+1 (212) 966-8800',
    openingHours: '12:00 - 23:30',
    totalTables: 10,
    active: true,
    currency: 'USD',
    taxRate: 0.08875,
    taxName: 'Sales Tax (8.875%)',
    timeZone: 'America/New_York',
    heroImage: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'branch-sora-br',
    restaurantId: 'brand-sora',
    name: 'Sucursal Jardins (São Paulo)',
    city: 'São Paulo',
    address: 'Rua Oscar Freire 1052, Cerqueira César',
    country: 'BR',
    phone: '+55 (11) 3062-7710',
    openingHours: '12:00 - 23:30',
    totalTables: 10,
    active: true,
    currency: 'BRL',
    taxRate: 0.10,
    taxName: 'Taxa de Serviço (10%)',
    timeZone: 'America/Sao_Paulo',
    heroImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'branch-sora-jp',
    restaurantId: 'brand-sora',
    name: 'Sucursal Ginza (Tokio)',
    city: 'Tokyo',
    address: '5-7-10 Ginza, Chuo-ku, Tokyo 104-0061',
    country: 'JP',
    phone: '+81 (03) 3571-0080',
    openingHours: '11:30 - 22:30',
    totalTables: 10,
    active: true,
    currency: 'JPY',
    taxRate: 0.10,
    taxName: '消費税 (10%)',
    timeZone: 'Asia/Tokyo',
    heroImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
  },
];

// ==========================================
// GENERADOR DE MESAS (8-10 mesas por sucursal)
// ==========================================
export function generateSeedTables(): Table[] {
  const tables: Table[] = [];
  const capacities = [2, 2, 4, 4, 4, 6, 6, 8];
  const zones: ('indoor' | 'terrace' | 'vip' | 'bar')[] = [
    'indoor',
    'indoor',
    'terrace',
    'indoor',
    'terrace',
    'vip',
    'indoor',
    'vip',
  ];

  for (const branch of SEED_BRANCHES) {
    for (let i = 0; i < capacities.length; i++) {
      const tableNumber = i + 1;
      // Default table 3 occupied for live demo testing
      const isTable3 = tableNumber === 3;
      tables.push({
        id: `table-${branch.id}-${tableNumber}`,
        branchId: branch.id,
        number: tableNumber,
        capacity: capacities[i],
        zone: zones[i],
        status: isTable3 ? 'occupied' : i === 4 ? 'reserved' : 'available',
        currentOrderId: isTable3 ? `ord-${branch.id}-demo` : undefined,
        activeGuests: isTable3 ? 3 : undefined,
      });
    }
  }

  // Backward compatibility alias for demo Mesa 3
  tables.push({
    id: 'table-co-01-03',
    branchId: 'branch-aura-co-bogota',
    number: 3,
    capacity: 4,
    zone: 'indoor',
    status: 'occupied',
    currentOrderId: 'ord-co-init-01',
    activeGuests: 3,
  });

  return tables;
}

// ==========================================
// MENÚ COMPLETO (Basado en el Catálogo Verificado)
// ==========================================
export function generateSeedMenuItems(): MenuItem[] {
  const items: MenuItem[] = [];
  for (const branch of SEED_BRANCHES) {
    const branchItems = buildMenuItemsForBranch(branch.restaurantId, branch.id, branch.country);
    items.push(...branchItems);
  }
  return items;
}

export const SEED_MENU_ITEMS: MenuItem[] = generateSeedMenuItems();

// ==========================================
// RESERVAS (Historial dinámico de 30 días y hoy)
// ==========================================
export function generateSeedReservations(): Reservation[] {
  const reservations: Reservation[] = [];
  const customerNames = [
    'Guillermo Arango',
    'Valeria Morales',
    'Santiago Duque',
    'Camila Osorio',
    'Fernando Cárdenas',
    'Lucía Herrera',
    'Andrés Restrepo',
    'Mariana Echeverry',
    'Nicolás Zuluaga',
    'Isabella Cardona',
  ];

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  for (let i = 0; i < SEED_BRANCHES.length; i++) {
    const branch = SEED_BRANCHES[i];
    const customer = customerNames[i % customerNames.length];

    // Today's active reservation
    reservations.push({
      id: `res-${branch.id}-today`,
      code: `RES-${7000 + i}`,
      branchId: branch.id,
      restaurantId: branch.restaurantId,
      customerName: customer,
      customerEmail: `comensal.${i + 1}@gmail.com`,
      customerPhone: '+57 300 123 4567',
      date: todayStr,
      time: '20:00',
      guestsCount: 4,
      tableId: `table-${branch.id}-5`,
      tableNumber: 5,
      status: 'confirmed',
      notes: 'Mesa con buena vista para aniversario',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    });

    // Past completed reservation
    const pastDate = new Date(Date.now() - 86400000 * (i + 2)).toISOString().split('T')[0];
    reservations.push({
      id: `res-${branch.id}-past`,
      code: `RES-${5000 + i}`,
      branchId: branch.id,
      restaurantId: branch.restaurantId,
      customerName: customerNames[(i + 3) % customerNames.length],
      customerEmail: `cliente.${i + 1}@gmail.com`,
      customerPhone: '+57 311 987 6543',
      date: pastDate,
      time: '19:30',
      guestsCount: 2,
      tableId: `table-${branch.id}-2`,
      tableNumber: 2,
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000 * (i + 4)).toISOString(),
    });
  }

  return reservations;
}

// ==========================================
// COMANDAS (Activas en Cocina y Completadas)
// ==========================================
export function generateSeedOrders(): Order[] {
  const orders: Order[] = [];

  for (let i = 0; i < SEED_BRANCHES.length; i++) {
    const branch = SEED_BRANCHES[i];
    const dishes = getDishesForCountry(branch.country);
    const d1 = dishes[0] || dishes[0];
    const d2 = dishes[4] || dishes[1];

    const subtotal = d1.price * 2 + d2.price;
    const taxAmount = Number((subtotal * branch.taxRate!).toFixed(2));
    const tipAmount = Number((subtotal * 0.1).toFixed(2));
    const total = Number((subtotal + taxAmount + tipAmount).toFixed(2));

    // Active order for Table 3
    orders.push({
      id: `ord-${branch.id}-demo`,
      orderNumber: `CMD-${3000 + i}`,
      branchId: branch.id,
      restaurantId: branch.restaurantId,
      tableId: `table-${branch.id}-3`,
      tableNumber: 3,
      items: [
        {
          menuItemId: `${branch.id}-${d1.id}`,
          name: d1.name.es,
          quantity: 2,
          unitPrice: d1.price,
          subtotal: d1.price * 2,
        },
        {
          menuItemId: `${branch.id}-${d2.id}`,
          name: d2.name.es,
          quantity: 1,
          unitPrice: d2.price,
          subtotal: d2.price,
        },
      ],
      subtotal,
      taxRate: branch.taxRate!,
      taxAmount,
      tipAmount,
      total,
      currency: branch.currency!,
      status: i % 2 === 0 ? 'preparing' : 'received',
      paymentMethod: 'card',
      paymentStatus: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      customerName: 'Familia Valenzuela',
    });
  }

  // Preload a ready-to-serve order for testing the Waiter chime & pickup
  const bogotaBranch = SEED_BRANCHES[0];
  orders.push({
    id: 'ord-ready-sample',
    orderNumber: 'CMD-8888',
    branchId: bogotaBranch.id,
    restaurantId: bogotaBranch.restaurantId,
    tableId: `table-${bogotaBranch.id}-4`,
    tableNumber: 4,
    items: [
      {
        menuItemId: `${bogotaBranch.id}-dish-co-05`,
        name: 'Bandeja Paisa de Hacienda',
        quantity: 2,
        unitPrice: 58000,
        subtotal: 116000,
      },
    ],
    subtotal: 116000,
    taxRate: 0.08,
    taxAmount: 9280,
    tipAmount: 11600,
    total: 136880,
    currency: 'COP',
    status: 'ready',
    paymentMethod: 'card',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    customerName: 'Dr. Guillermo Arango',
  });

  return orders;
}

// ==========================================
// RESEÑAS REALISTAS (40-50 Reseñas por Sucursal)
// ==========================================
export function generateSeedReviews(): Review[] {
  const reviews: Review[] = [
    {
      id: 'rev-01',
      restaurantId: 'brand-aura',
      branchId: 'branch-aura-co-bogota',
      userId: 'user-customer-co',
      userName: 'Sofía Valenzuela',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Una experiencia gastronómica sublime en Chapinero. La cocción de las carnes a la brasa y la atención de Mateo en mesa fueron impecables. El menú QR es comodísimo.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      reply: {
        text: '¡Muchísimas gracias Sofía! Nos alegra profundamente que hayas disfrutado la sobremesa en la Zona G. Te esperamos pronto de regreso.',
        repliedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        repliedBy: 'Elena Rostova (Gerente de Sede)',
      },
    },
    {
      id: 'rev-02',
      restaurantId: 'brand-aura',
      branchId: 'branch-aura-co-medellin',
      userId: 'user-customer-co-2',
      userName: 'Santiago Restrepo',
      rating: 5,
      comment: 'El ambiente en Provenza es increíble. Las arepitas de choclo y el ceviche del pacífico son de otro mundo. Sin duda el mejor restaurante de la ciudad.',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'rev-03',
      restaurantId: 'brand-aura',
      branchId: 'branch-aura-mx',
      userId: 'user-customer-mx',
      userName: 'Alejandro Morales',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Los tacos al pastor al carbón en Roma Norte superaron toda expectativa. La salsa de mole poblano tiene una complejidad digna de estrella Michelin.',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      reply: {
        text: '¡Gracias Alejandro! Seleccionamos los maíces criollos y cacaos con el mayor rigor para brindar esa autenticidad. ¡Un honor recibirte!',
        repliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        repliedBy: 'Rodrigo Fuentes (Administrador)',
      },
    },
    {
      id: 'rev-04',
      restaurantId: 'brand-aura',
      branchId: 'branch-aura-us',
      userId: 'user-customer-us',
      userName: 'Sarah Jenkins',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'The Brooklyn branch in Williamsburg is pure perfection. The prime smash burger with lacy crust and the NY cheesecake are the best in town.',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      reply: {
        text: 'Thank you Sarah! We take pride in our 100% pasture-fed Angus blend. See you again in Williamsburg soon!',
        repliedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        repliedBy: 'Michael Vance (General Manager)',
      },
    },
    {
      id: 'rev-05',
      restaurantId: 'brand-aura',
      branchId: 'branch-aura-br',
      userId: 'user-customer-br',
      userName: 'Lucas Silva',
      userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'A picanha na chapa em Pinheiros é fantástica, derrete na boca! Os pães de queijo quentinhos na entrada fecharam com chave de ouro.',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
    {
      id: 'rev-06',
      restaurantId: 'brand-aura',
      branchId: 'branch-aura-jp',
      userId: 'user-customer-jp',
      userName: 'Yuki Tanaka',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: '渋谷店で家族の誕生日ディナーをいただきました。特上握りととんこつラーメンの出汁の深さに驚きました。スタッフの心遣いも素晴らしいです。',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      reply: {
        text: '田中様、温かいお言葉をいただき心より感謝申し上げます。またのご来店をスタッフ一同お待ち申し上げております。',
        repliedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        repliedBy: 'Kenji Takahashi (マネージャー)',
      },
    },
    {
      id: 'rev-07',
      restaurantId: 'brand-sora',
      branchId: 'branch-sora-jp',
      userId: 'user-customer-jp-2',
      userName: 'Kenjiro Sato',
      rating: 5,
      comment: '銀座で本物のロボタ焼きと日系フュージョンを味わえる名店。ワインと日本酒のペアリングが絶妙でした。',
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
    {
      id: 'rev-08',
      restaurantId: 'brand-sora',
      branchId: 'branch-sora-co',
      userId: 'user-customer-co-3',
      userName: 'Mariana Duque',
      rating: 4,
      comment: 'Increíble diseño en la Zona Rosa. Los cortes de pescado fresco y la robata son espectaculares. Recomiendo reservar con anticipación porque se llena.',
      createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    },
  ];

  return reviews;
}

// ==========================================
// NOTIFICACIONES
// ==========================================
export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'reservation',
    title: 'Nueva Reservación en Sede Chapinero',
    message: 'Reserva #RES-7000 confirmada para 4 comensales a las 20:00 hrs.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
    targetRole: 'admin',
    targetBranchId: 'branch-aura-co-bogota',
  },
  {
    id: 'notif-2',
    type: 'kitchen',
    title: '¡Comanda Lista para Servir!',
    message: 'Comanda #CMD-8888 de Mesa #4 lista en barra para entrega inmediata.',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    read: false,
    targetRole: 'waiter',
    targetBranchId: 'branch-aura-co-bogota',
  },
];

// ==========================================
// EVENTOS DISTRIBUIDOS INICIALES
// ==========================================
export const SEED_EVENTS: DistributedEvent[] = [
  {
    id: 'evt-init-1',
    type: 'RESERVATION_CREATED',
    payload: { reservationCode: 'RES-7000', table: 5, guests: 4, customer: 'Guillermo Arango' },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    sourceService: 'reservation-service',
    targetService: 'notification-service',
    status: 'completed',
    attempts: 1,
    maxAttempts: 3,
    idempotencyKey: 'idemp-res-7000-notif',
    correlationId: 'corr-init-res-7000',
    processedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'evt-init-2',
    type: 'ORDER_CREATED',
    payload: { orderNumber: 'CMD-3000', tableNumber: 3, total: 116000 },
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    sourceService: 'order-service',
    targetService: 'kitchen-service',
    status: 'completed',
    attempts: 1,
    maxAttempts: 3,
    idempotencyKey: 'idemp-cmd-3000-kitchen',
    correlationId: 'corr-init-ord-3000',
    processedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'evt-init-3',
    type: 'ORDER_READY',
    payload: { orderNumber: 'CMD-8888', tableNumber: 4 },
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    sourceService: 'kitchen-service',
    targetService: 'order-service',
    status: 'completed',
    attempts: 1,
    maxAttempts: 3,
    idempotencyKey: 'idemp-cmd-8888-ready',
    correlationId: 'corr-init-ord-8888',
    processedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 'evt-init-4',
    type: 'PRODUCT_AVAILABILITY_CHANGED',
    payload: { menuItemId: 'dish-co-07', available: true, branchId: 'branch-aura-co-bogota' },
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    sourceService: 'restaurant-service',
    targetService: 'broadcast',
    status: 'completed',
    attempts: 1,
    maxAttempts: 3,
    idempotencyKey: 'idemp-prod-avail-07',
    correlationId: 'corr-init-prod-07',
    processedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

export const SEED_TABLES: Table[] = generateSeedTables();
export const SEED_RESERVATIONS: Reservation[] = generateSeedReservations();
export const SEED_ORDERS: Order[] = generateSeedOrders();
export const SEED_REVIEWS: Review[] = generateSeedReviews();

export const SEED_SERVICES: ServiceHealth[] = [
  {
    id: 'auth-service',
    service: 'auth-service',
    name: 'Auth Service',
    nameKey: 'service_auth',
    description: 'Gestión de sesiones, tokens de rol y control RBAC granular',
    descriptionKey: 'service_auth_desc',
    status: 'up',
    processedEventsCount: 142,
    failedEventsCount: 0,
    processedCount: 142,
    failedCount: 0,
    uptimePercent: 99.9,
    latencyMs: 14,
    errorRate: 0,
    lastPing: new Date().toISOString(),
    publishes: ['USER_LOGGED_IN', 'USER_LOGGED_OUT'],
    consumes: [],
  },
  {
    id: 'restaurant-service',
    service: 'restaurant-service',
    name: 'Restaurant Service',
    nameKey: 'service_restaurant',
    description: 'Catálogo multinacional de marcas, sucursales, mesas y disponibilidad de carta',
    descriptionKey: 'service_restaurant_desc',
    status: 'up',
    processedEventsCount: 96,
    failedEventsCount: 0,
    processedCount: 96,
    failedCount: 0,
    uptimePercent: 99.8,
    latencyMs: 18,
    errorRate: 0,
    lastPing: new Date().toISOString(),
    publishes: ['PRODUCT_AVAILABILITY_CHANGED', 'RESTAURANT_UPDATED', 'TABLE_OPENED', 'TABLE_CLEARED'],
    consumes: ['WAITER_CALLED'],
  },
  {
    id: 'reservation-service',
    service: 'reservation-service',
    name: 'Reservation Service',
    nameKey: 'service_reservation',
    description: 'Agenda de reservas, detección de colisiones ±90min y pases QR',
    descriptionKey: 'service_reservation_desc',
    status: 'up',
    processedEventsCount: 310,
    failedEventsCount: 0,
    processedCount: 310,
    failedCount: 0,
    uptimePercent: 99.9,
    latencyMs: 22,
    errorRate: 0,
    lastPing: new Date().toISOString(),
    publishes: [
      'RESERVATION_CREATED',
      'RESERVATION_CONFIRMED',
      'RESERVATION_CANCELLED',
      'RESERVATION_REJECTED',
      'RESERVATION_COMPLETED',
      'RESERVATION_NO_SHOW',
    ],
    consumes: [],
  },
  {
    id: 'order-service',
    service: 'order-service',
    name: 'Order Service',
    nameKey: 'service_order',
    description: 'Comandas de salón y QR, desglose de impuestos regionales y pagos',
    descriptionKey: 'service_order_desc',
    status: 'up',
    processedEventsCount: 425,
    failedEventsCount: 0,
    processedCount: 425,
    failedCount: 0,
    uptimePercent: 99.7,
    latencyMs: 28,
    errorRate: 0,
    lastPing: new Date().toISOString(),
    publishes: ['ORDER_CREATED', 'ORDER_PAID', 'ORDER_DELIVERED', 'ORDER_CANCELLED', 'ORDER_BILL_REQUESTED'],
    consumes: ['ORDER_READY'],
  },
  {
    id: 'kitchen-service',
    service: 'kitchen-service',
    name: 'Kitchen Service',
    nameKey: 'service_kitchen',
    description: 'Tablero KDS en tiempo real, cronómetros de cocción y despacho',
    descriptionKey: 'service_kitchen_desc',
    status: 'up',
    processedEventsCount: 412,
    failedEventsCount: 0,
    processedCount: 412,
    failedCount: 0,
    uptimePercent: 99.5,
    latencyMs: 35,
    errorRate: 0,
    lastPing: new Date().toISOString(),
    publishes: ['ORDER_RECEIVED_BY_KITCHEN', 'ORDER_PREPARING', 'ORDER_READY'],
    consumes: ['ORDER_CREATED', 'PRODUCT_AVAILABILITY_CHANGED'],
  },
  {
    id: 'notification-service',
    service: 'notification-service',
    name: 'Notification Service',
    nameKey: 'service_notification',
    description: 'Distribución multicanal de alertas a meseros, cocina y comensales',
    descriptionKey: 'service_notification_desc',
    status: 'up',
    processedEventsCount: 520,
    failedEventsCount: 0,
    processedCount: 520,
    failedCount: 0,
    uptimePercent: 99.9,
    latencyMs: 12,
    errorRate: 0,
    lastPing: new Date().toISOString(),
    publishes: [],
    consumes: ['RESERVATION_CREATED', 'RESERVATION_CONFIRMED', 'ORDER_CREATED', 'ORDER_READY', 'WAITER_CALLED'],
  },
  {
    id: 'analytics-service',
    service: 'analytics-service',
    name: 'Analytics Service',
    nameKey: 'service_analytics',
    description: 'Agregación de ventas, analítica por sucursal, reseñas y exportación CSV',
    descriptionKey: 'service_analytics_desc',
    status: 'up',
    processedEventsCount: 680,
    failedEventsCount: 0,
    processedCount: 680,
    failedCount: 0,
    uptimePercent: 99.9,
    latencyMs: 40,
    errorRate: 0,
    lastPing: new Date().toISOString(),
    publishes: ['METRICS_AGGREGATED'],
    consumes: ['RESERVATION_CREATED', 'RESERVATION_CONFIRMED', 'ORDER_PAID', 'ORDER_DELIVERED', 'REVIEW_CREATED'],
  },
];

// Compatibility aliases
export const INITIAL_USERS = SEED_USERS;
export const INITIAL_RESTAURANTS = SEED_RESTAURANTS;
export const INITIAL_BRANCHES = SEED_BRANCHES;
export const INITIAL_TABLES = SEED_TABLES;
export const INITIAL_MENU_ITEMS = SEED_MENU_ITEMS;
export const INITIAL_RESERVATIONS = SEED_RESERVATIONS;
export const INITIAL_ORDERS = SEED_ORDERS;
export const INITIAL_REVIEWS = SEED_REVIEWS;
export const INITIAL_SERVICES = SEED_SERVICES;
export const INITIAL_EVENTS = SEED_EVENTS;
