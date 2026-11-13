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
  ServiceDefinition,
  ServiceHealth,
  Review,
} from '../types';

export const SEED_RESTAURANTS: Restaurant[] = [
  {
    "id": "brand-aura",
    "name": "Aura Mestiza",
    "slug": "aura-mestiza",
    "tagline": {
      "es": "Cocina de Origen & Fuego Vivo",
      "en": "Ancestral Fire & Earth Cuisine",
      "pt": "Cozinha de Origem e Fogo Vivo",
      "fr": "Cuisine d’Origine & Flamme Vivante",
      "ja": "大地の恵みと炭火料理の伝統"
    },
    "cuisine": {
      "es": "Cocina de Origen & Brasa",
      "en": "Ancestral Grill & Earth Roots",
      "pt": "Grelhados e Cozinha de Origem",
      "fr": "Grillades au feu de bois & cuisine de terroir",
      "ja": "産地直材料理・薪火グリル"
    },
    "description": {
      "es": "Homenaje a los ingredientes autóctonos de cada tierra, preparados al calor de la brasa viva y técnicas ancestrales.",
      "en": "A tribute to indigenous ingredients of each territory, cooked over open coals with ancestral techniques.",
      "pt": "Homenagem aos ingredientes nativos de cada terra, preparados ao calor da brasa viva e técnicas ancestrais.",
      "fr": "Hommage aux terroirs et aux ingrédients indigènes, magnifiés par la braise vivante et des techniques séculaires.",
      "ja": "大地の恵みと各国の旬の食材を厳選。炭火と薪の炎で豪快かつ繊細に仕上げる美食体験。"
    },
    "story": {
      "es": "Nacida de la pasión por el fuego y la biodiversidad, Aura Mestiza rescata recetas tradicionales con un toque contemporáneo.",
      "en": "Born from a passion for fire and biodiversity, Aura Mestiza brings ancestral recipes into modern fine dining.",
      "pt": "Nascida da paixão pelo fogo e pela biodiversidade, a Aura Mestiza resgata receitas tradicionais com um toque contemporâneo.",
      "fr": "Née d’une passion pour le feu et les terroirs vivants, Aura Mestiza réinterprète les recettes ancestrales avec modernité.",
      "ja": "自然の恵みと炎への敬意から誕生。古来の調理技法を受け継ぎ、現代の洗練された一皿へと昇華させます。"
    },
    "operatingCountries": [
      "CO",
      "BR",
      "US",
      "FR",
      "JP"
    ],
    "rating": 4.9,
    "reviewCount": 348,
    "priceRange": "$$$",
    "heroImage": "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80"
    ],
    "logo": "🔥",
    "contactEmail": "contacto@auramestiza.com",
    "phone": "+57 310 450 8920"
  },
  {
    "id": "brand-sora",
    "name": "Sora",
    "slug": "sora",
    "tagline": {
      "es": "Alta Cocina Nikkei & Tradición Tokio",
      "en": "Contemporary Nikkei & Tokyo Craft",
      "pt": "Alta Gastronomia Nikkei e Tradição de Tóquio",
      "fr": "Haute Gastronomie Nikkei & Maîtrise de Tokyo",
      "ja": "宙 (Sora) 日系創作料理と江戸前伝統の融合"
    },
    "cuisine": {
      "es": "Nikkei & Japonesa Contemporánea",
      "en": "Nikkei & Contemporary Japanese",
      "pt": "Nikkei e Japonesa Contemporânea",
      "fr": "Nikkei & Gastronomie Japonaise Contemporaine",
      "ja": "日系フュージョン・現代和食"
    },
    "description": {
      "es": "Precisión nipona y vibrantes ingredientes locales. Cortes milimétricos, fermentaciones pausadas y caldos umami reconfortantes.",
      "en": "Japanese culinary precision meets vibrant local produce. Knife mastery, aged ferments and soul-warming umami broths.",
      "pt": "Precisão nipônica e ingredientes locais vibrantes. Cortes milimétricos, fermentações lentas e caldos umami reconfortantes.",
      "fr": "Précision japonaise et fraîcheur des produits locaux. Maîtrise des découpes, fermentations douces et bouillons umami.",
      "ja": "日本の卓越した包丁技法と出汁文化に、各国の極上素材を調和させた新時代の現代和食。"
    },
    "story": {
      "es": "Fundada en el corazón de Ginza, Sora viaja por el mundo reinterpretando la cultura culinaria japonesa con los mejores pescados y productos de proximidad.",
      "en": "Founded in the heart of Ginza, Sora journeys across the globe blending Tokyo tradition with coastal seafood of each region.",
      "pt": "Fundada em Ginza, a Sora cruza fronteiras reinterpretando a cultura gastronômica japonesa com os melhores insumos locais.",
      "fr": "Fondée à Ginza, Sora célèbre les rencontres culinaires en mariant les traditions de Tokyo aux meilleurs produits marins.",
      "ja": "東京・銀座で創業。熟成赤酢の握り、本格出汁ラーメン、旬魚の創作料理を世界五大都市で展開しています。"
    },
    "operatingCountries": [
      "CO",
      "BR",
      "US",
      "FR",
      "JP"
    ],
    "rating": 4.8,
    "reviewCount": 412,
    "priceRange": "$$$$",
    "heroImage": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&auto=format&fit=crop&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80"
    ],
    "logo": "🌊",
    "contactEmail": "contact@sorarestaurant.com",
    "phone": "+81 3-6264-5588"
  }
];
export const SEED_BRANCHES: Branch[] = [
  {
    "id": "br-aura-co-chapinero",
    "restaurantId": "brand-aura",
    "name": "Aura Mestiza Chapinero",
    "localizedName": {
      "es": "Aura Mestiza — Chapinero Alto",
      "en": "Aura Mestiza — Chapinero Alto",
      "pt": "Aura Mestiza — Chapinero Alto",
      "fr": "Aura Mestiza — Chapinero Alto",
      "ja": "オーラ・メスティーサ チャピネロ店"
    },
    "city": "Bogotá",
    "localizedCity": {
      "es": "Bogotá",
      "en": "Bogota",
      "pt": "Bogotá",
      "fr": "Bogota",
      "ja": "ボゴタ"
    },
    "neighborhood": "Chapinero Alto",
    "address": "Calle 69A # 4-15",
    "country": "CO",
    "phone": "+57 310 450 8920",
    "openingHours": "12:00 - 23:00",
    "totalTables": 10,
    "active": true,
    "currency": "COP",
    "timeZone": "America/Bogota",
    "coordinates": {
      "lat": 4.6534,
      "lng": -74.0583
    },
    "deliveryRadiusKmOrMi": 8,
    "heroImage": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-aura-co-usaquen",
    "restaurantId": "brand-aura",
    "name": "Aura Mestiza Usaquén",
    "localizedName": {
      "es": "Aura Mestiza — Usaquén Colonial",
      "en": "Aura Mestiza — Historic Usaquen",
      "pt": "Aura Mestiza — Usaquén Histórico",
      "fr": "Aura Mestiza — Usaquén Colonial",
      "ja": "オーラ・メスティーサ ウサケン店"
    },
    "city": "Bogotá",
    "localizedCity": {
      "es": "Bogotá",
      "en": "Bogota",
      "pt": "Bogotá",
      "fr": "Bogota",
      "ja": "ボゴタ"
    },
    "neighborhood": "Usaquén",
    "address": "Carrera 6 # 118-20",
    "country": "CO",
    "phone": "+57 312 890 1144",
    "openingHours": "12:00 - 23:00",
    "totalTables": 12,
    "active": true,
    "currency": "COP",
    "timeZone": "America/Bogota",
    "coordinates": {
      "lat": 4.6978,
      "lng": -74.0312
    },
    "deliveryRadiusKmOrMi": 9,
    "heroImage": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-sora-co-chico",
    "restaurantId": "brand-sora",
    "name": "Sora Nikkei Chicó",
    "localizedName": {
      "es": "Sora Nikkei & Fusión — Chicó",
      "en": "Sora Nikkei & Fusion — Chico",
      "pt": "Sora Nikkei — Chicó",
      "fr": "Sora Nikkei — Chicó",
      "ja": "宙 (Sora) 日系フュージョン チコ店"
    },
    "city": "Bogotá",
    "localizedCity": {
      "es": "Bogotá",
      "en": "Bogota",
      "pt": "Bogotá",
      "fr": "Bogota",
      "ja": "ボゴタ"
    },
    "neighborhood": "El Chicó",
    "address": "Calle 90 # 11-45",
    "country": "CO",
    "phone": "+57 314 620 3388",
    "openingHours": "12:30 - 23:30",
    "totalTables": 10,
    "active": true,
    "currency": "COP",
    "timeZone": "America/Bogota",
    "coordinates": {
      "lat": 4.6738,
      "lng": -74.0489
    },
    "deliveryRadiusKmOrMi": 8,
    "heroImage": "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-sora-co-zonag",
    "restaurantId": "brand-sora",
    "name": "Sora Nikkei Zona G",
    "localizedName": {
      "es": "Sora Nikkei — Zona G Gastronómica",
      "en": "Sora Nikkei — Zona G Dining District",
      "pt": "Sora Nikkei — Zona G",
      "fr": "Sora Nikkei — Zona G",
      "ja": "宙 (Sora) 日系フュージョン ソナG店"
    },
    "city": "Bogotá",
    "localizedCity": {
      "es": "Bogotá",
      "en": "Bogota",
      "pt": "Bogotá",
      "fr": "Bogota",
      "ja": "ボゴタ"
    },
    "neighborhood": "Zona G",
    "address": "Carrera 5 # 69-26",
    "country": "CO",
    "phone": "+57 311 772 9010",
    "openingHours": "12:30 - 23:30",
    "totalTables": 8,
    "active": true,
    "currency": "COP",
    "timeZone": "America/Bogota",
    "coordinates": {
      "lat": 4.6519,
      "lng": -74.0562
    },
    "deliveryRadiusKmOrMi": 7,
    "heroImage": "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-aura-br-pinheiros",
    "restaurantId": "brand-aura",
    "name": "Aura Mestiza Pinheiros",
    "localizedName": {
      "es": "Aura Mestiza — Pinheiros",
      "en": "Aura Mestiza — Pinheiros",
      "pt": "Aura Mestiza — Pinheiros",
      "fr": "Aura Mestiza — Pinheiros",
      "ja": "オーラ・メスティーサ ピニェイロス店"
    },
    "city": "São Paulo",
    "localizedCity": {
      "es": "São Paulo",
      "en": "Sao Paulo",
      "pt": "São Paulo",
      "fr": "São Paulo",
      "ja": "サンパウロ"
    },
    "neighborhood": "Pinheiros",
    "address": "Rua dos Pinheiros, 740",
    "country": "BR",
    "phone": "+55 11 98711-2040",
    "openingHours": "12:00 - 23:30",
    "totalTables": 10,
    "active": true,
    "currency": "BRL",
    "timeZone": "America/Sao_Paulo",
    "coordinates": {
      "lat": -23.5658,
      "lng": -46.6874
    },
    "deliveryRadiusKmOrMi": 8,
    "heroImage": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-aura-br-jardins",
    "restaurantId": "brand-aura",
    "name": "Aura Mestiza Jardins",
    "localizedName": {
      "es": "Aura Mestiza — Jardins",
      "en": "Aura Mestiza — Jardins District",
      "pt": "Aura Mestiza — Jardins",
      "fr": "Aura Mestiza — Jardins",
      "ja": "オーラ・メスティーサ ジャルジンス店"
    },
    "city": "São Paulo",
    "localizedCity": {
      "es": "São Paulo",
      "en": "Sao Paulo",
      "pt": "São Paulo",
      "fr": "São Paulo",
      "ja": "サンパウロ"
    },
    "neighborhood": "Jardins",
    "address": "Rua Oscar Freire, 1020",
    "country": "BR",
    "phone": "+55 11 99823-4411",
    "openingHours": "12:00 - 23:30",
    "totalTables": 12,
    "active": true,
    "currency": "BRL",
    "timeZone": "America/Sao_Paulo",
    "coordinates": {
      "lat": -23.5615,
      "lng": -46.6698
    },
    "deliveryRadiusKmOrMi": 9,
    "heroImage": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-sora-br-liberdade",
    "restaurantId": "brand-sora",
    "name": "Sora Liberdade",
    "localizedName": {
      "es": "Sora — Bairro Liberdade",
      "en": "Sora — Liberdade District",
      "pt": "Sora — Liberdade Oriental",
      "fr": "Sora — Quartier Liberdade",
      "ja": "宙 (Sora) リベルダーデ店"
    },
    "city": "São Paulo",
    "localizedCity": {
      "es": "São Paulo",
      "en": "Sao Paulo",
      "pt": "São Paulo",
      "fr": "São Paulo",
      "ja": "サンパウロ"
    },
    "neighborhood": "Liberdade",
    "address": "Rua Galvão Bueno, 380",
    "country": "BR",
    "phone": "+55 11 97600-8812",
    "openingHours": "12:00 - 23:00",
    "totalTables": 10,
    "active": true,
    "currency": "BRL",
    "timeZone": "America/Sao_Paulo",
    "coordinates": {
      "lat": -23.5583,
      "lng": -46.6349
    },
    "deliveryRadiusKmOrMi": 8,
    "heroImage": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-sora-br-itaim",
    "restaurantId": "brand-sora",
    "name": "Sora Itaim Bibi",
    "localizedName": {
      "es": "Sora — Itaim Bibi Alta Cocina",
      "en": "Sora — Itaim Bibi Dining",
      "pt": "Sora — Itaim Bibi",
      "fr": "Sora — Itaim Bibi",
      "ja": "宙 (Sora) イタイ・ビビ店"
    },
    "city": "São Paulo",
    "localizedCity": {
      "es": "São Paulo",
      "en": "Sao Paulo",
      "pt": "São Paulo",
      "fr": "São Paulo",
      "ja": "サンパウロ"
    },
    "neighborhood": "Itaim Bibi",
    "address": "Rua Pedroso Alvarenga, 810",
    "country": "BR",
    "phone": "+55 11 96510-7744",
    "openingHours": "12:00 - 23:00",
    "totalTables": 10,
    "active": true,
    "currency": "BRL",
    "timeZone": "America/Sao_Paulo",
    "coordinates": {
      "lat": -23.5839,
      "lng": -46.6781
    },
    "deliveryRadiusKmOrMi": 9,
    "heroImage": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-aura-us-manhattan",
    "restaurantId": "brand-aura",
    "name": "Aura Mestiza Manhattan",
    "localizedName": {
      "es": "Aura Mestiza — Midtown Manhattan",
      "en": "Aura Mestiza — Midtown Manhattan",
      "pt": "Aura Mestiza — Midtown Manhattan",
      "fr": "Aura Mestiza — Midtown Manhattan",
      "ja": "オーラ・メスティーサ マンハッタン店"
    },
    "city": "New York",
    "localizedCity": {
      "es": "Nueva York",
      "en": "New York",
      "pt": "Nova York",
      "fr": "New York",
      "ja": "ニューヨーク"
    },
    "neighborhood": "Midtown Manhattan",
    "address": "450 Lexington Ave",
    "country": "US",
    "phone": "+1 212 555 0184",
    "openingHours": "11:30 - 22:30",
    "totalTables": 12,
    "active": true,
    "currency": "USD",
    "timeZone": "America/New_York",
    "coordinates": {
      "lat": 40.7527,
      "lng": -73.9755
    },
    "deliveryRadiusKmOrMi": 5,
    "heroImage": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-aura-us-brooklyn",
    "restaurantId": "brand-aura",
    "name": "Aura Mestiza DUMBO",
    "localizedName": {
      "es": "Aura Mestiza — Brooklyn DUMBO",
      "en": "Aura Mestiza — Brooklyn DUMBO",
      "pt": "Aura Mestiza — Brooklyn DUMBO",
      "fr": "Aura Mestiza — Brooklyn DUMBO",
      "ja": "オーラ・メスティーサ ブルックリン・ダンボ店"
    },
    "city": "New York",
    "localizedCity": {
      "es": "Nueva York",
      "en": "New York",
      "pt": "Nova York",
      "fr": "New York",
      "ja": "ニューヨーク"
    },
    "neighborhood": "DUMBO, Brooklyn",
    "address": "55 Water St",
    "country": "US",
    "phone": "+1 718 555 0192",
    "openingHours": "11:30 - 22:30",
    "totalTables": 10,
    "active": true,
    "currency": "USD",
    "timeZone": "America/New_York",
    "coordinates": {
      "lat": 40.7033,
      "lng": -73.9903
    },
    "deliveryRadiusKmOrMi": 6,
    "heroImage": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-sora-us-soho",
    "restaurantId": "brand-sora",
    "name": "Sora SoHo",
    "localizedName": {
      "es": "Sora — SoHo Historic District",
      "en": "Sora — SoHo Historic District",
      "pt": "Sora — SoHo",
      "fr": "Sora — SoHo",
      "ja": "宙 (Sora) ソーホー店"
    },
    "city": "New York",
    "localizedCity": {
      "es": "Nueva York",
      "en": "New York",
      "pt": "Nova York",
      "fr": "New York",
      "ja": "ニューヨーク"
    },
    "neighborhood": "SoHo, Manhattan",
    "address": "472 West Broadway",
    "country": "US",
    "phone": "+1 212 555 0133",
    "openingHours": "12:00 - 23:00",
    "totalTables": 10,
    "active": true,
    "currency": "USD",
    "timeZone": "America/New_York",
    "coordinates": {
      "lat": 40.7259,
      "lng": -74.0003
    },
    "deliveryRadiusKmOrMi": 5,
    "heroImage": "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-sora-us-williamsburg",
    "restaurantId": "brand-sora",
    "name": "Sora Williamsburg",
    "localizedName": {
      "es": "Sora — Williamsburg Waterfront",
      "en": "Sora — Williamsburg Waterfront",
      "pt": "Sora — Williamsburg",
      "fr": "Sora — Williamsburg",
      "ja": "宙 (Sora) ウィリアムズバーグ店"
    },
    "city": "New York",
    "localizedCity": {
      "es": "Nueva York",
      "en": "New York",
      "pt": "Nova York",
      "fr": "New York",
      "ja": "ニューヨーク"
    },
    "neighborhood": "Williamsburg, Brooklyn",
    "address": "110 Kent Ave",
    "country": "US",
    "phone": "+1 718 555 0177",
    "openingHours": "12:00 - 23:00",
    "totalTables": 10,
    "active": true,
    "currency": "USD",
    "timeZone": "America/New_York",
    "coordinates": {
      "lat": 40.7196,
      "lng": -73.9631
    },
    "deliveryRadiusKmOrMi": 5,
    "heroImage": "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-aura-fr-marais",
    "restaurantId": "brand-aura",
    "name": "Aura Mestiza Le Marais",
    "localizedName": {
      "es": "Aura Mestiza — Le Marais",
      "en": "Aura Mestiza — Le Marais District",
      "pt": "Aura Mestiza — Le Marais",
      "fr": "Aura Mestiza — Le Marais",
      "ja": "オーラ・メスティーサ マレ地区店"
    },
    "city": "Paris",
    "localizedCity": {
      "es": "París",
      "en": "Paris",
      "pt": "Paris",
      "fr": "Paris",
      "ja": "パリ"
    },
    "neighborhood": "Le Marais (4e)",
    "address": "22 Rue des Francs-Bourgeois",
    "country": "FR",
    "phone": "+33 1 42 68 55 10",
    "openingHours": "12:00 - 23:00",
    "totalTables": 10,
    "active": true,
    "currency": "EUR",
    "timeZone": "Europe/Paris",
    "coordinates": {
      "lat": 48.8575,
      "lng": 2.3601
    },
    "deliveryRadiusKmOrMi": 7,
    "heroImage": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-aura-fr-saintgermain",
    "restaurantId": "brand-aura",
    "name": "Aura Mestiza Saint-Germain",
    "localizedName": {
      "es": "Aura Mestiza — Saint-Germain-des-Prés",
      "en": "Aura Mestiza — Saint-Germain",
      "pt": "Aura Mestiza — Saint-Germain",
      "fr": "Aura Mestiza — Saint-Germain-des-Prés",
      "ja": "オーラ・メスティーサ サン＝ジェルマン店"
    },
    "city": "Paris",
    "localizedCity": {
      "es": "París",
      "en": "Paris",
      "pt": "Paris",
      "fr": "Paris",
      "ja": "パリ"
    },
    "neighborhood": "Saint-Germain (6e)",
    "address": "38 Boulevard Saint-Germain",
    "country": "FR",
    "phone": "+33 1 43 25 11 90",
    "openingHours": "12:00 - 23:00",
    "totalTables": 12,
    "active": true,
    "currency": "EUR",
    "timeZone": "Europe/Paris",
    "coordinates": {
      "lat": 48.8519,
      "lng": 2.3486
    },
    "deliveryRadiusKmOrMi": 7,
    "heroImage": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-sora-fr-opera",
    "restaurantId": "brand-sora",
    "name": "Sora Opéra Sainte-Anne",
    "localizedName": {
      "es": "Sora — Quartier Japonais Opéra",
      "en": "Sora — Opera Sainte-Anne",
      "pt": "Sora — Opéra Sainte-Anne",
      "fr": "Sora — Opéra Sainte-Anne",
      "ja": "宙 (Sora) パリ・オペラ通り店"
    },
    "city": "Paris",
    "localizedCity": {
      "es": "París",
      "en": "Paris",
      "pt": "Paris",
      "fr": "Paris",
      "ja": "パリ"
    },
    "neighborhood": "Quartier Sainte-Anne (2e)",
    "address": "55 Rue Sainte-Anne",
    "country": "FR",
    "phone": "+33 1 47 03 44 22",
    "openingHours": "12:00 - 22:30",
    "totalTables": 10,
    "active": true,
    "currency": "EUR",
    "timeZone": "Europe/Paris",
    "coordinates": {
      "lat": 48.8682,
      "lng": 2.3364
    },
    "deliveryRadiusKmOrMi": 8,
    "heroImage": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-sora-fr-montparnasse",
    "restaurantId": "brand-sora",
    "name": "Sora Montparnasse",
    "localizedName": {
      "es": "Sora — Montparnasse Rive Gauche",
      "en": "Sora — Montparnasse Left Bank",
      "pt": "Sora — Montparnasse",
      "fr": "Sora — Montparnasse",
      "ja": "宙 (Sora) モンパルナス店"
    },
    "city": "Paris",
    "localizedCity": {
      "es": "París",
      "en": "Paris",
      "pt": "Paris",
      "fr": "Paris",
      "ja": "パリ"
    },
    "neighborhood": "Montparnasse (14e)",
    "address": "14 Avenue du Maine",
    "country": "FR",
    "phone": "+33 1 45 38 70 80",
    "openingHours": "12:00 - 22:30",
    "totalTables": 8,
    "active": true,
    "currency": "EUR",
    "timeZone": "Europe/Paris",
    "coordinates": {
      "lat": 48.8421,
      "lng": 2.3218
    },
    "deliveryRadiusKmOrMi": 7,
    "heroImage": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-aura-jp-shibuya",
    "restaurantId": "brand-aura",
    "name": "Aura Mestiza Shibuya",
    "localizedName": {
      "es": "Aura Mestiza — Shibuya Flagship",
      "en": "Aura Mestiza — Shibuya Flagship",
      "pt": "Aura Mestiza — Shibuya",
      "fr": "Aura Mestiza — Shibuya",
      "ja": "オーラ・メスティーサ 渋谷旗艦店"
    },
    "city": "東京 (Tokyo)",
    "localizedCity": {
      "es": "Tokio",
      "en": "Tokyo",
      "pt": "Tóquio",
      "fr": "Tokyo",
      "ja": "東京"
    },
    "neighborhood": "Shibuya Jinnan",
    "address": "渋谷区神南1-19-10",
    "country": "JP",
    "phone": "+81 3-5458-1200",
    "openingHours": "11:30 - 23:00",
    "totalTables": 12,
    "active": true,
    "currency": "JPY",
    "timeZone": "Asia/Tokyo",
    "coordinates": {
      "lat": 35.6628,
      "lng": 139.7005
    },
    "deliveryRadiusKmOrMi": 6,
    "heroImage": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-aura-jp-roppongi",
    "restaurantId": "brand-aura",
    "name": "Aura Mestiza Roppongi",
    "localizedName": {
      "es": "Aura Mestiza — Roppongi Hills",
      "en": "Aura Mestiza — Roppongi Hills",
      "pt": "Aura Mestiza — Roppongi Hills",
      "fr": "Aura Mestiza — Roppongi Hills",
      "ja": "オーラ・メスティーサ 六本木ヒルズ店"
    },
    "city": "東京 (Tokyo)",
    "localizedCity": {
      "es": "Tokio",
      "en": "Tokyo",
      "pt": "Tóquio",
      "fr": "Tokyo",
      "ja": "東京"
    },
    "neighborhood": "Roppongi",
    "address": "港区六本木6-10-1",
    "country": "JP",
    "phone": "+81 3-5770-3344",
    "openingHours": "11:30 - 23:00",
    "totalTables": 10,
    "active": true,
    "currency": "JPY",
    "timeZone": "Asia/Tokyo",
    "coordinates": {
      "lat": 35.6604,
      "lng": 139.7292
    },
    "deliveryRadiusKmOrMi": 6,
    "heroImage": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-sora-jp-ginza",
    "restaurantId": "brand-sora",
    "name": "Sora Ginza Honten",
    "localizedName": {
      "es": "Sora — Ginza Honten Casa Matriz",
      "en": "Sora — Ginza Flagship Store",
      "pt": "Sora — Ginza Honten",
      "fr": "Sora — Ginza Honten",
      "ja": "宙 (Sora) 銀座本店"
    },
    "city": "東京 (Tokyo)",
    "localizedCity": {
      "es": "Tokio",
      "en": "Tokyo",
      "pt": "Tóquio",
      "fr": "Tokyo",
      "ja": "東京"
    },
    "neighborhood": "Ginza 6-chome",
    "address": "中央区銀座6-10-1 GINZA SIX 13F",
    "country": "JP",
    "phone": "+81 3-6264-5588",
    "openingHours": "12:00 - 23:00",
    "totalTables": 12,
    "active": true,
    "currency": "JPY",
    "timeZone": "Asia/Tokyo",
    "coordinates": {
      "lat": 35.6696,
      "lng": 139.7641
    },
    "deliveryRadiusKmOrMi": 7,
    "heroImage": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1000&auto=format&fit=crop&q=80"
  },
  {
    "id": "br-sora-jp-shinjuku",
    "restaurantId": "brand-sora",
    "name": "Sora Shinjuku Minamiguchi",
    "localizedName": {
      "es": "Sora — Shinjuku Minamiguchi",
      "en": "Sora — Shinjuku South Gate",
      "pt": "Sora — Shinjuku Minamiguchi",
      "fr": "Sora — Shinjuku Minamiguchi",
      "ja": "宙 (Sora) 新宿南口店"
    },
    "city": "東京 (Tokyo)",
    "localizedCity": {
      "es": "Tokio",
      "en": "Tokyo",
      "pt": "Tóquio",
      "fr": "Tokyo",
      "ja": "東京"
    },
    "neighborhood": "Shinjuku",
    "address": "新宿区西新宿1-1-4",
    "country": "JP",
    "phone": "+81 3-3344-9911",
    "openingHours": "12:00 - 23:00",
    "totalTables": 10,
    "active": true,
    "currency": "JPY",
    "timeZone": "Asia/Tokyo",
    "coordinates": {
      "lat": 35.6896,
      "lng": 139.6998
    },
    "deliveryRadiusKmOrMi": 6,
    "heroImage": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000&auto=format&fit=crop&q=80"
  }
];
export const SEED_USERS: User[] = [
  // 1. Platform Admin
  {
    id: "usr-plat-admin",
    name: "Administrador de Plataforma",
    email: "plataforma@smartrestaurant.app",
    role: "platform_admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "active",
    passwordSalt: "salt_plat_2026",
    passwordHash: "f33388718ee07e5e68928dd24a47302369d793abba1bb88d53f9f796e7c5b506",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  // 2. Owner
  {
    id: "usr-owner-01",
    name: "Carlos Mendoza (Dueño)",
    email: "dueno@smartrestaurant.app",
    role: "owner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "active",
    passwordSalt: "salt_dueno_2026",
    passwordHash: "b5fd77f85be3a4327afaca2457944a3e61b45ba94de629a15ba48844ab7fc5ba",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  // 3. Branch Admins (5 cities)
  {
    id: "usr-admin-bogota",
    name: "Elena Rostova (Admin Bogotá)",
    email: "admin.bogota@smartrestaurant.app",
    role: "branch_admin",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-co-chapinero",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "active",
    passwordSalt: "salt_sede_2026",
    passwordHash: "a3313ad4935813e21f3977a2517497740b5e010700f241b9a6b302ab6ec9dae9",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-admin-saopaulo",
    name: "Thiago Silva (Admin São Paulo)",
    email: "admin.saopaulo@smartrestaurant.app",
    role: "branch_admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-br-pinheiros",
    country: "BR",
    preferredLanguage: "pt",
    language: "pt",
    timeZone: "America/Sao_Paulo",
    homeRegion: "BR",
    status: "active",
    passwordSalt: "salt_sede_2026",
    passwordHash: "a3313ad4935813e21f3977a2517497740b5e010700f241b9a6b302ab6ec9dae9",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-admin-nuevayork",
    name: "Michael Vance (Admin New York)",
    email: "admin.nuevayork@smartrestaurant.app",
    role: "branch_admin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-us-manhattan",
    country: "US",
    preferredLanguage: "en",
    language: "en",
    timeZone: "America/New_York",
    homeRegion: "US",
    status: "active",
    passwordSalt: "salt_sede_2026",
    passwordHash: "a3313ad4935813e21f3977a2517497740b5e010700f241b9a6b302ab6ec9dae9",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-admin-paris",
    name: "Camille Dupont (Admin Paris)",
    email: "admin.paris@smartrestaurant.app",
    role: "branch_admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-fr-marais",
    country: "FR",
    preferredLanguage: "fr",
    language: "fr",
    timeZone: "Europe/Paris",
    homeRegion: "FR",
    status: "active",
    passwordSalt: "salt_sede_2026",
    passwordHash: "a3313ad4935813e21f3977a2517497740b5e010700f241b9a6b302ab6ec9dae9",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-admin-tokio",
    name: "佐藤 健二 (Admin Tokyo)",
    email: "admin.tokio@smartrestaurant.app",
    role: "branch_admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-jp-shibuya",
    country: "JP",
    preferredLanguage: "ja",
    language: "ja",
    timeZone: "Asia/Tokyo",
    homeRegion: "JP",
    status: "active",
    passwordSalt: "salt_sede_2026",
    passwordHash: "a3313ad4935813e21f3977a2517497740b5e010700f241b9a6b302ab6ec9dae9",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  // 4. Waiters (1 per city)
  {
    id: "usr-waiter-bogota",
    name: "Andrés Gómez",
    email: "mesero.bogota@smartrestaurant.app",
    role: "waiter",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-co-chapinero",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "active",
    passwordSalt: "salt_mesero_2026",
    passwordHash: "b3e31b56a56d51f8b40fe3ac0a39da4138be89f1f8efc017bb0197c79039effe",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-waiter-saopaulo",
    name: "Lucas Ferreira",
    email: "mesero.saopaulo@smartrestaurant.app",
    role: "waiter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-br-pinheiros",
    country: "BR",
    preferredLanguage: "pt",
    language: "pt",
    timeZone: "America/Sao_Paulo",
    homeRegion: "BR",
    status: "active",
    passwordSalt: "salt_mesero_2026",
    passwordHash: "b3e31b56a56d51f8b40fe3ac0a39da4138be89f1f8efc017bb0197c79039effe",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-waiter-nuevayork",
    name: "David Miller",
    email: "mesero.nuevayork@smartrestaurant.app",
    role: "waiter",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-us-manhattan",
    country: "US",
    preferredLanguage: "en",
    language: "en",
    timeZone: "America/New_York",
    homeRegion: "US",
    status: "active",
    passwordSalt: "salt_mesero_2026",
    passwordHash: "b3e31b56a56d51f8b40fe3ac0a39da4138be89f1f8efc017bb0197c79039effe",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-waiter-paris",
    name: "Julien Mercier",
    email: "mesero.paris@smartrestaurant.app",
    role: "waiter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-fr-marais",
    country: "FR",
    preferredLanguage: "fr",
    language: "fr",
    timeZone: "Europe/Paris",
    homeRegion: "FR",
    status: "active",
    passwordSalt: "salt_mesero_2026",
    passwordHash: "b3e31b56a56d51f8b40fe3ac0a39da4138be89f1f8efc017bb0197c79039effe",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-waiter-tokio",
    name: "田中 蓮",
    email: "mesero.tokio@smartrestaurant.app",
    role: "waiter",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-jp-shibuya",
    country: "JP",
    preferredLanguage: "ja",
    language: "ja",
    timeZone: "Asia/Tokyo",
    homeRegion: "JP",
    status: "active",
    passwordSalt: "salt_mesero_2026",
    passwordHash: "b3e31b56a56d51f8b40fe3ac0a39da4138be89f1f8efc017bb0197c79039effe",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  // 5. Kitchen (1 per city)
  {
    id: "usr-kitchen-bogota",
    name: "Chef Mateo Restrepo",
    email: "cocina.bogota@smartrestaurant.app",
    role: "kitchen",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-co-chapinero",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "active",
    passwordSalt: "salt_cocina_2026",
    passwordHash: "523d13db8582209900aca7931b040690bb9b74e6e053cea47bdd9877626ad5f0",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-kitchen-saopaulo",
    name: "Chef Rodrigo Oliveira",
    email: "cocina.saopaulo@smartrestaurant.app",
    role: "kitchen",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-br-pinheiros",
    country: "BR",
    preferredLanguage: "pt",
    language: "pt",
    timeZone: "America/Sao_Paulo",
    homeRegion: "BR",
    status: "active",
    passwordSalt: "salt_cocina_2026",
    passwordHash: "523d13db8582209900aca7931b040690bb9b74e6e053cea47bdd9877626ad5f0",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-kitchen-nuevayork",
    name: "Chef Anthony Bell",
    email: "cocina.nuevayork@smartrestaurant.app",
    role: "kitchen",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-us-manhattan",
    country: "US",
    preferredLanguage: "en",
    language: "en",
    timeZone: "America/New_York",
    homeRegion: "US",
    status: "active",
    passwordSalt: "salt_cocina_2026",
    passwordHash: "523d13db8582209900aca7931b040690bb9b74e6e053cea47bdd9877626ad5f0",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-kitchen-paris",
    name: "Chef Émile Laurent",
    email: "cocina.paris@smartrestaurant.app",
    role: "kitchen",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-fr-marais",
    country: "FR",
    preferredLanguage: "fr",
    language: "fr",
    timeZone: "Europe/Paris",
    homeRegion: "FR",
    status: "active",
    passwordSalt: "salt_cocina_2026",
    passwordHash: "523d13db8582209900aca7931b040690bb9b74e6e053cea47bdd9877626ad5f0",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-kitchen-tokio",
    name: "山本 宗一 (板長)",
    email: "cocina.tokio@smartrestaurant.app",
    role: "kitchen",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-jp-shibuya",
    country: "JP",
    preferredLanguage: "ja",
    language: "ja",
    timeZone: "Asia/Tokyo",
    homeRegion: "JP",
    status: "active",
    passwordSalt: "salt_cocina_2026",
    passwordHash: "523d13db8582209900aca7931b040690bb9b74e6e053cea47bdd9877626ad5f0",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  // 6. Couriers (15: 3 per city)
  // Bogotá Couriers
  {
    id: "usr-cour-bogota-1",
    name: "Felipe Moreno",
    email: "repartidor1.bogota@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "active",
    vehicleType: "motorcycle",
    isOnline: true,
    currentLocation: { lat: 4.6540, lng: -74.0590 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 42,
    courierRating: 4.9,
    earningsMinorUnits: 250000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-cour-bogota-2",
    name: "Esteban Rincón",
    email: "repartidor2.bogota@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "active",
    vehicleType: "bicycle",
    isOnline: true,
    currentLocation: { lat: 4.6510, lng: -74.0560 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 35,
    courierRating: 4.8,
    earningsMinorUnits: 190000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-cour-bogota-3",
    name: "Daniela Salazar",
    email: "repartidor3.bogota@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "active",
    vehicleType: "electric_scooter",
    isOnline: false,
    currentLocation: { lat: 4.6600, lng: -74.0620 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 28,
    courierRating: 4.95,
    earningsMinorUnits: 160000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  // São Paulo Couriers
  {
    id: "usr-cour-sp-1",
    name: "Gabriel Santos",
    email: "repartidor1.saopaulo@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    country: "BR",
    preferredLanguage: "pt",
    language: "pt",
    timeZone: "America/Sao_Paulo",
    homeRegion: "BR",
    status: "active",
    vehicleType: "motorcycle",
    isOnline: true,
    currentLocation: { lat: -23.5620, lng: -46.6850 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 50,
    courierRating: 4.9,
    earningsMinorUnits: 62000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-cour-sp-2",
    name: "Matheus Costa",
    email: "repartidor2.saopaulo@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    country: "BR",
    preferredLanguage: "pt",
    language: "pt",
    timeZone: "America/Sao_Paulo",
    homeRegion: "BR",
    status: "active",
    vehicleType: "bicycle",
    isOnline: true,
    currentLocation: { lat: -23.5600, lng: -46.6820 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 38,
    courierRating: 4.85,
    earningsMinorUnits: 45000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-cour-sp-3",
    name: "Beatriz Lima",
    email: "repartidor3.saopaulo@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    country: "BR",
    preferredLanguage: "pt",
    language: "pt",
    timeZone: "America/Sao_Paulo",
    homeRegion: "BR",
    status: "active",
    vehicleType: "motorcycle",
    isOnline: false,
    currentLocation: { lat: -23.5650, lng: -46.6890 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 22,
    courierRating: 4.9,
    earningsMinorUnits: 31000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  // New York Couriers
  {
    id: "usr-cour-ny-1",
    name: "Jason Brooks",
    email: "repartidor1.nuevayork@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    country: "US",
    preferredLanguage: "en",
    language: "en",
    timeZone: "America/New_York",
    homeRegion: "US",
    status: "active",
    vehicleType: "bicycle",
    isOnline: true,
    currentLocation: { lat: 40.7230, lng: -73.9980 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 65,
    courierRating: 4.92,
    earningsMinorUnits: 125000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-cour-ny-2",
    name: "Marcus Green",
    email: "repartidor2.nuevayork@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    country: "US",
    preferredLanguage: "en",
    language: "en",
    timeZone: "America/New_York",
    homeRegion: "US",
    status: "active",
    vehicleType: "electric_scooter",
    isOnline: true,
    currentLocation: { lat: 40.7200, lng: -73.9950 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 44,
    courierRating: 4.88,
    earningsMinorUnits: 89000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-cour-ny-3",
    name: "Emily Clark",
    email: "repartidor3.nuevayork@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    country: "US",
    preferredLanguage: "en",
    language: "en",
    timeZone: "America/New_York",
    homeRegion: "US",
    status: "active",
    vehicleType: "bicycle",
    isOnline: false,
    currentLocation: { lat: 40.7260, lng: -74.0010 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 31,
    courierRating: 4.96,
    earningsMinorUnits: 68000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  // Paris Couriers
  {
    id: "usr-cour-paris-1",
    name: "Alexandre Girard",
    email: "repartidor1.paris@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    country: "FR",
    preferredLanguage: "fr",
    language: "fr",
    timeZone: "Europe/Paris",
    homeRegion: "FR",
    status: "active",
    vehicleType: "bicycle",
    isOnline: true,
    currentLocation: { lat: 48.8570, lng: 2.3610 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 58,
    courierRating: 4.94,
    earningsMinorUnits: 98000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-cour-paris-2",
    name: "Lucas Blanc",
    email: "repartidor2.paris@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    country: "FR",
    preferredLanguage: "fr",
    language: "fr",
    timeZone: "Europe/Paris",
    homeRegion: "FR",
    status: "active",
    vehicleType: "electric_scooter",
    isOnline: true,
    currentLocation: { lat: 48.8590, lng: 2.3580 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 42,
    courierRating: 4.87,
    earningsMinorUnits: 72000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-cour-paris-3",
    name: "Chloé Vasseur",
    email: "repartidor3.paris@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    country: "FR",
    preferredLanguage: "fr",
    language: "fr",
    timeZone: "Europe/Paris",
    homeRegion: "FR",
    status: "active",
    vehicleType: "bicycle",
    isOnline: false,
    currentLocation: { lat: 48.8540, lng: 2.3640 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 29,
    courierRating: 4.9,
    earningsMinorUnits: 49000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  // Tokyo Couriers
  {
    id: "usr-cour-tokyo-1",
    name: "渡辺 翔太",
    email: "repartidor1.tokio@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    country: "JP",
    preferredLanguage: "ja",
    language: "ja",
    timeZone: "Asia/Tokyo",
    homeRegion: "JP",
    status: "active",
    vehicleType: "motorcycle",
    isOnline: true,
    currentLocation: { lat: 35.6600, lng: 139.7020 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 77,
    courierRating: 4.98,
    earningsMinorUnits: 145000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-cour-tokyo-2",
    name: "高橋 大樹",
    email: "repartidor2.tokio@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    country: "JP",
    preferredLanguage: "ja",
    language: "ja",
    timeZone: "Asia/Tokyo",
    homeRegion: "JP",
    status: "active",
    vehicleType: "bicycle",
    isOnline: true,
    currentLocation: { lat: 35.6580, lng: 139.6990 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 46,
    courierRating: 4.91,
    earningsMinorUnits: 88000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  {
    id: "usr-cour-tokyo-3",
    name: "伊藤 結衣",
    email: "repartidor3.tokio@smartrestaurant.app",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    country: "JP",
    preferredLanguage: "ja",
    language: "ja",
    timeZone: "Asia/Tokyo",
    homeRegion: "JP",
    status: "active",
    vehicleType: "bicycle",
    isOnline: false,
    currentLocation: { lat: 35.6630, lng: 139.7050 },
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 39,
    courierRating: 4.95,
    earningsMinorUnits: 71000,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  // 7. Cashier (Custom Role Example in Bogotá)
  {
    id: "usr-cashier-bogota",
    name: "Lucía Pineda (Cajera)",
    email: "cajero.bogota@smartrestaurant.app",
    role: "cashier",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    assignedRestaurantId: "brand-aura",
    assignedBranchId: "br-aura-co-chapinero",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "active",
    passwordSalt: "salt_caja_2026",
    passwordHash: "3800847ed5d84787be3b20386adb15626ac9340bdf41ea991f17da514dd0138d",
    createdAtUtc: "2026-11-01T00:00:00.000Z"
  },
  // 8. Customers (1 per country)
  {
    id: "usr-cust-bogota",
    name: "Valentina Morales",
    email: "cliente.bogota@demo.app",
    phone: "+57 311 555 0101",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "active",
    passwordSalt: "salt_cliente_2026",
    passwordHash: "d1bc611c12227b78fc22678459f1e3b280889b29c0fa71778edea226cee91ae7",
    consentAcceptedAtUtc: "2026-11-01T10:00:00.000Z",
    consentVersion: "v2026.1",
    createdAtUtc: "2026-11-01T10:00:00.000Z"
  },
  {
    id: "usr-cust-saopaulo",
    name: "Camila Santos",
    email: "cliente.saopaulo@demo.app",
    phone: "+55 11 98888 0202",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    country: "BR",
    preferredLanguage: "pt",
    language: "pt",
    timeZone: "America/Sao_Paulo",
    homeRegion: "BR",
    status: "active",
    passwordSalt: "salt_cliente_2026",
    passwordHash: "d1bc611c12227b78fc22678459f1e3b280889b29c0fa71778edea226cee91ae7",
    consentAcceptedAtUtc: "2026-11-01T10:00:00.000Z",
    consentVersion: "v2026.1",
    createdAtUtc: "2026-11-01T10:00:00.000Z"
  },
  {
    id: "usr-cust-nuevayork",
    name: "Sarah Jenkins",
    email: "cliente.nuevayork@demo.app",
    phone: "+1 212 555 0303",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    country: "US",
    preferredLanguage: "en",
    language: "en",
    timeZone: "America/New_York",
    homeRegion: "US",
    status: "active",
    passwordSalt: "salt_cliente_2026",
    passwordHash: "d1bc611c12227b78fc22678459f1e3b280889b29c0fa71778edea226cee91ae7",
    consentAcceptedAtUtc: "2026-11-01T10:00:00.000Z",
    consentVersion: "v2026.1",
    createdAtUtc: "2026-11-01T10:00:00.000Z"
  },
  {
    id: "usr-cust-paris",
    name: "Juliette Moreau",
    email: "cliente.paris@demo.app",
    phone: "+33 6 12 34 56 78",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    country: "FR",
    preferredLanguage: "fr",
    language: "fr",
    timeZone: "Europe/Paris",
    homeRegion: "FR",
    status: "active",
    passwordSalt: "salt_cliente_2026",
    passwordHash: "d1bc611c12227b78fc22678459f1e3b280889b29c0fa71778edea226cee91ae7",
    consentAcceptedAtUtc: "2026-11-01T10:00:00.000Z",
    consentVersion: "v2026.1",
    createdAtUtc: "2026-11-01T10:00:00.000Z"
  },
  {
    id: "usr-cust-tokio",
    name: "高橋 由紀 (Yuki Takahashi)",
    email: "cliente.tokio@demo.app",
    phone: "+81 90 1234 5678",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    country: "JP",
    preferredLanguage: "ja",
    language: "ja",
    timeZone: "Asia/Tokyo",
    homeRegion: "JP",
    status: "active",
    passwordSalt: "salt_cliente_2026",
    passwordHash: "d1bc611c12227b78fc22678459f1e3b280889b29c0fa71778edea226cee91ae7",
    consentAcceptedAtUtc: "2026-11-01T10:00:00.000Z",
    consentVersion: "v2026.1",
    createdAtUtc: "2026-11-01T10:00:00.000Z"
  },
  // 9. Pending approval commerce example
  {
    id: "usr-pend-comm",
    name: "Bistró Mirador (Pendiente)",
    email: "nuevo.comercio@smartrestaurant.app",
    phone: "+57 315 888 9900",
    role: "owner",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "pending",
    passwordSalt: "salt_comercio_2026",
    passwordHash: "aef3d1ce353cdfd360ad145125c7047223d0402cbe3493902835e0a4fff69a4a",
    createdAtUtc: "2026-11-11T16:00:00.000Z"
  },
  // 10. Pending approval courier example
  {
    id: "usr-pend-cour",
    name: "Mauricio Peñaloza (Pendiente)",
    email: "nuevo.repartidor@smartrestaurant.app",
    phone: "+57 312 444 3322",
    role: "courier",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    country: "CO",
    preferredLanguage: "es",
    language: "es",
    timeZone: "America/Bogota",
    homeRegion: "CO",
    status: "pending",
    vehicleType: "motorcycle",
    isOnline: false,
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 0,
    courierRating: 5.0,
    passwordSalt: "salt_reparto_2026",
    passwordHash: "f69048d51d0f0824858e2144790465e7ed4eac116d979362adefaef1e09ac898",
    createdAtUtc: "2026-11-11T16:30:00.000Z"
  }
];
export const SEED_TABLES: Table[] = [
  {
    "id": "tbl-br-aura-co-chapinero-1",
    "branchId": "br-aura-co-chapinero",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-chapinero-2",
    "branchId": "br-aura-co-chapinero",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-aura-co-chapinero-3",
    "branchId": "br-aura-co-chapinero",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-chapinero-4",
    "branchId": "br-aura-co-chapinero",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-chapinero-5",
    "branchId": "br-aura-co-chapinero",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-chapinero-6",
    "branchId": "br-aura-co-chapinero",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-chapinero-7",
    "branchId": "br-aura-co-chapinero",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-chapinero-8",
    "branchId": "br-aura-co-chapinero",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-chapinero-9",
    "branchId": "br-aura-co-chapinero",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-chapinero-10",
    "branchId": "br-aura-co-chapinero",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-usaquen-1",
    "branchId": "br-aura-co-usaquen",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-usaquen-2",
    "branchId": "br-aura-co-usaquen",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-aura-co-usaquen-3",
    "branchId": "br-aura-co-usaquen",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-usaquen-4",
    "branchId": "br-aura-co-usaquen",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-usaquen-5",
    "branchId": "br-aura-co-usaquen",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-usaquen-6",
    "branchId": "br-aura-co-usaquen",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-usaquen-7",
    "branchId": "br-aura-co-usaquen",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-usaquen-8",
    "branchId": "br-aura-co-usaquen",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-usaquen-9",
    "branchId": "br-aura-co-usaquen",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-usaquen-10",
    "branchId": "br-aura-co-usaquen",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-usaquen-11",
    "branchId": "br-aura-co-usaquen",
    "number": 11,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-co-usaquen-12",
    "branchId": "br-aura-co-usaquen",
    "number": 12,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-chico-1",
    "branchId": "br-sora-co-chico",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-chico-2",
    "branchId": "br-sora-co-chico",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-sora-co-chico-3",
    "branchId": "br-sora-co-chico",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-chico-4",
    "branchId": "br-sora-co-chico",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-chico-5",
    "branchId": "br-sora-co-chico",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-chico-6",
    "branchId": "br-sora-co-chico",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-chico-7",
    "branchId": "br-sora-co-chico",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-chico-8",
    "branchId": "br-sora-co-chico",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-chico-9",
    "branchId": "br-sora-co-chico",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-chico-10",
    "branchId": "br-sora-co-chico",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-zonag-1",
    "branchId": "br-sora-co-zonag",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-zonag-2",
    "branchId": "br-sora-co-zonag",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-sora-co-zonag-3",
    "branchId": "br-sora-co-zonag",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-zonag-4",
    "branchId": "br-sora-co-zonag",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-zonag-5",
    "branchId": "br-sora-co-zonag",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-zonag-6",
    "branchId": "br-sora-co-zonag",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-zonag-7",
    "branchId": "br-sora-co-zonag",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-co-zonag-8",
    "branchId": "br-sora-co-zonag",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-pinheiros-1",
    "branchId": "br-aura-br-pinheiros",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-pinheiros-2",
    "branchId": "br-aura-br-pinheiros",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-aura-br-pinheiros-3",
    "branchId": "br-aura-br-pinheiros",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-pinheiros-4",
    "branchId": "br-aura-br-pinheiros",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-pinheiros-5",
    "branchId": "br-aura-br-pinheiros",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-pinheiros-6",
    "branchId": "br-aura-br-pinheiros",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-pinheiros-7",
    "branchId": "br-aura-br-pinheiros",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-pinheiros-8",
    "branchId": "br-aura-br-pinheiros",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-pinheiros-9",
    "branchId": "br-aura-br-pinheiros",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-pinheiros-10",
    "branchId": "br-aura-br-pinheiros",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-jardins-1",
    "branchId": "br-aura-br-jardins",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-jardins-2",
    "branchId": "br-aura-br-jardins",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-aura-br-jardins-3",
    "branchId": "br-aura-br-jardins",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-jardins-4",
    "branchId": "br-aura-br-jardins",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-jardins-5",
    "branchId": "br-aura-br-jardins",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-jardins-6",
    "branchId": "br-aura-br-jardins",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-jardins-7",
    "branchId": "br-aura-br-jardins",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-jardins-8",
    "branchId": "br-aura-br-jardins",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-jardins-9",
    "branchId": "br-aura-br-jardins",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-jardins-10",
    "branchId": "br-aura-br-jardins",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-jardins-11",
    "branchId": "br-aura-br-jardins",
    "number": 11,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-br-jardins-12",
    "branchId": "br-aura-br-jardins",
    "number": 12,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-liberdade-1",
    "branchId": "br-sora-br-liberdade",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-liberdade-2",
    "branchId": "br-sora-br-liberdade",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-sora-br-liberdade-3",
    "branchId": "br-sora-br-liberdade",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-liberdade-4",
    "branchId": "br-sora-br-liberdade",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-liberdade-5",
    "branchId": "br-sora-br-liberdade",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-liberdade-6",
    "branchId": "br-sora-br-liberdade",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-liberdade-7",
    "branchId": "br-sora-br-liberdade",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-liberdade-8",
    "branchId": "br-sora-br-liberdade",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-liberdade-9",
    "branchId": "br-sora-br-liberdade",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-liberdade-10",
    "branchId": "br-sora-br-liberdade",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-itaim-1",
    "branchId": "br-sora-br-itaim",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-itaim-2",
    "branchId": "br-sora-br-itaim",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-sora-br-itaim-3",
    "branchId": "br-sora-br-itaim",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-itaim-4",
    "branchId": "br-sora-br-itaim",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-itaim-5",
    "branchId": "br-sora-br-itaim",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-itaim-6",
    "branchId": "br-sora-br-itaim",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-itaim-7",
    "branchId": "br-sora-br-itaim",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-itaim-8",
    "branchId": "br-sora-br-itaim",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-itaim-9",
    "branchId": "br-sora-br-itaim",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-br-itaim-10",
    "branchId": "br-sora-br-itaim",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-manhattan-1",
    "branchId": "br-aura-us-manhattan",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-manhattan-2",
    "branchId": "br-aura-us-manhattan",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-aura-us-manhattan-3",
    "branchId": "br-aura-us-manhattan",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-manhattan-4",
    "branchId": "br-aura-us-manhattan",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-manhattan-5",
    "branchId": "br-aura-us-manhattan",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-manhattan-6",
    "branchId": "br-aura-us-manhattan",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-manhattan-7",
    "branchId": "br-aura-us-manhattan",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-manhattan-8",
    "branchId": "br-aura-us-manhattan",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-manhattan-9",
    "branchId": "br-aura-us-manhattan",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-manhattan-10",
    "branchId": "br-aura-us-manhattan",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-manhattan-11",
    "branchId": "br-aura-us-manhattan",
    "number": 11,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-manhattan-12",
    "branchId": "br-aura-us-manhattan",
    "number": 12,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-brooklyn-1",
    "branchId": "br-aura-us-brooklyn",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-brooklyn-2",
    "branchId": "br-aura-us-brooklyn",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-aura-us-brooklyn-3",
    "branchId": "br-aura-us-brooklyn",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-brooklyn-4",
    "branchId": "br-aura-us-brooklyn",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-brooklyn-5",
    "branchId": "br-aura-us-brooklyn",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-brooklyn-6",
    "branchId": "br-aura-us-brooklyn",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-brooklyn-7",
    "branchId": "br-aura-us-brooklyn",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-brooklyn-8",
    "branchId": "br-aura-us-brooklyn",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-brooklyn-9",
    "branchId": "br-aura-us-brooklyn",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-us-brooklyn-10",
    "branchId": "br-aura-us-brooklyn",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-soho-1",
    "branchId": "br-sora-us-soho",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-soho-2",
    "branchId": "br-sora-us-soho",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-sora-us-soho-3",
    "branchId": "br-sora-us-soho",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-soho-4",
    "branchId": "br-sora-us-soho",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-soho-5",
    "branchId": "br-sora-us-soho",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-soho-6",
    "branchId": "br-sora-us-soho",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-soho-7",
    "branchId": "br-sora-us-soho",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-soho-8",
    "branchId": "br-sora-us-soho",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-soho-9",
    "branchId": "br-sora-us-soho",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-soho-10",
    "branchId": "br-sora-us-soho",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-williamsburg-1",
    "branchId": "br-sora-us-williamsburg",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-williamsburg-2",
    "branchId": "br-sora-us-williamsburg",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-sora-us-williamsburg-3",
    "branchId": "br-sora-us-williamsburg",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-williamsburg-4",
    "branchId": "br-sora-us-williamsburg",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-williamsburg-5",
    "branchId": "br-sora-us-williamsburg",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-williamsburg-6",
    "branchId": "br-sora-us-williamsburg",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-williamsburg-7",
    "branchId": "br-sora-us-williamsburg",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-williamsburg-8",
    "branchId": "br-sora-us-williamsburg",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-williamsburg-9",
    "branchId": "br-sora-us-williamsburg",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-us-williamsburg-10",
    "branchId": "br-sora-us-williamsburg",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-marais-1",
    "branchId": "br-aura-fr-marais",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-marais-2",
    "branchId": "br-aura-fr-marais",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-aura-fr-marais-3",
    "branchId": "br-aura-fr-marais",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-marais-4",
    "branchId": "br-aura-fr-marais",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-marais-5",
    "branchId": "br-aura-fr-marais",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-marais-6",
    "branchId": "br-aura-fr-marais",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-marais-7",
    "branchId": "br-aura-fr-marais",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-marais-8",
    "branchId": "br-aura-fr-marais",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-marais-9",
    "branchId": "br-aura-fr-marais",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-marais-10",
    "branchId": "br-aura-fr-marais",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-1",
    "branchId": "br-aura-fr-saintgermain",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-2",
    "branchId": "br-aura-fr-saintgermain",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-3",
    "branchId": "br-aura-fr-saintgermain",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-4",
    "branchId": "br-aura-fr-saintgermain",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-5",
    "branchId": "br-aura-fr-saintgermain",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-6",
    "branchId": "br-aura-fr-saintgermain",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-7",
    "branchId": "br-aura-fr-saintgermain",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-8",
    "branchId": "br-aura-fr-saintgermain",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-9",
    "branchId": "br-aura-fr-saintgermain",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-10",
    "branchId": "br-aura-fr-saintgermain",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-11",
    "branchId": "br-aura-fr-saintgermain",
    "number": 11,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-fr-saintgermain-12",
    "branchId": "br-aura-fr-saintgermain",
    "number": 12,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-opera-1",
    "branchId": "br-sora-fr-opera",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-opera-2",
    "branchId": "br-sora-fr-opera",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-sora-fr-opera-3",
    "branchId": "br-sora-fr-opera",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-opera-4",
    "branchId": "br-sora-fr-opera",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-opera-5",
    "branchId": "br-sora-fr-opera",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-opera-6",
    "branchId": "br-sora-fr-opera",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-opera-7",
    "branchId": "br-sora-fr-opera",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-opera-8",
    "branchId": "br-sora-fr-opera",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-opera-9",
    "branchId": "br-sora-fr-opera",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-opera-10",
    "branchId": "br-sora-fr-opera",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-montparnasse-1",
    "branchId": "br-sora-fr-montparnasse",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-montparnasse-2",
    "branchId": "br-sora-fr-montparnasse",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-sora-fr-montparnasse-3",
    "branchId": "br-sora-fr-montparnasse",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-montparnasse-4",
    "branchId": "br-sora-fr-montparnasse",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-montparnasse-5",
    "branchId": "br-sora-fr-montparnasse",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-montparnasse-6",
    "branchId": "br-sora-fr-montparnasse",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-montparnasse-7",
    "branchId": "br-sora-fr-montparnasse",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-fr-montparnasse-8",
    "branchId": "br-sora-fr-montparnasse",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-shibuya-1",
    "branchId": "br-aura-jp-shibuya",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-shibuya-2",
    "branchId": "br-aura-jp-shibuya",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-aura-jp-shibuya-3",
    "branchId": "br-aura-jp-shibuya",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-shibuya-4",
    "branchId": "br-aura-jp-shibuya",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-shibuya-5",
    "branchId": "br-aura-jp-shibuya",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-shibuya-6",
    "branchId": "br-aura-jp-shibuya",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-shibuya-7",
    "branchId": "br-aura-jp-shibuya",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-shibuya-8",
    "branchId": "br-aura-jp-shibuya",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-shibuya-9",
    "branchId": "br-aura-jp-shibuya",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-shibuya-10",
    "branchId": "br-aura-jp-shibuya",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-shibuya-11",
    "branchId": "br-aura-jp-shibuya",
    "number": 11,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-shibuya-12",
    "branchId": "br-aura-jp-shibuya",
    "number": 12,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-roppongi-1",
    "branchId": "br-aura-jp-roppongi",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-roppongi-2",
    "branchId": "br-aura-jp-roppongi",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-aura-jp-roppongi-3",
    "branchId": "br-aura-jp-roppongi",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-roppongi-4",
    "branchId": "br-aura-jp-roppongi",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-roppongi-5",
    "branchId": "br-aura-jp-roppongi",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-roppongi-6",
    "branchId": "br-aura-jp-roppongi",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-roppongi-7",
    "branchId": "br-aura-jp-roppongi",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-roppongi-8",
    "branchId": "br-aura-jp-roppongi",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-roppongi-9",
    "branchId": "br-aura-jp-roppongi",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-aura-jp-roppongi-10",
    "branchId": "br-aura-jp-roppongi",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-ginza-1",
    "branchId": "br-sora-jp-ginza",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-ginza-2",
    "branchId": "br-sora-jp-ginza",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-sora-jp-ginza-3",
    "branchId": "br-sora-jp-ginza",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-ginza-4",
    "branchId": "br-sora-jp-ginza",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-ginza-5",
    "branchId": "br-sora-jp-ginza",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-ginza-6",
    "branchId": "br-sora-jp-ginza",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-ginza-7",
    "branchId": "br-sora-jp-ginza",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-ginza-8",
    "branchId": "br-sora-jp-ginza",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-ginza-9",
    "branchId": "br-sora-jp-ginza",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-ginza-10",
    "branchId": "br-sora-jp-ginza",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-ginza-11",
    "branchId": "br-sora-jp-ginza",
    "number": 11,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-ginza-12",
    "branchId": "br-sora-jp-ginza",
    "number": 12,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-shinjuku-1",
    "branchId": "br-sora-jp-shinjuku",
    "number": 1,
    "capacity": 2,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-shinjuku-2",
    "branchId": "br-sora-jp-shinjuku",
    "number": 2,
    "capacity": 4,
    "zone": "indoor",
    "status": "occupied",
    "currentGuestsCount": 3
  },
  {
    "id": "tbl-br-sora-jp-shinjuku-3",
    "branchId": "br-sora-jp-shinjuku",
    "number": 3,
    "capacity": 6,
    "zone": "indoor",
    "status": "reserved",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-shinjuku-4",
    "branchId": "br-sora-jp-shinjuku",
    "number": 4,
    "capacity": 4,
    "zone": "indoor",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-shinjuku-5",
    "branchId": "br-sora-jp-shinjuku",
    "number": 5,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-shinjuku-6",
    "branchId": "br-sora-jp-shinjuku",
    "number": 6,
    "capacity": 4,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-shinjuku-7",
    "branchId": "br-sora-jp-shinjuku",
    "number": 7,
    "capacity": 2,
    "zone": "terrace",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-shinjuku-8",
    "branchId": "br-sora-jp-shinjuku",
    "number": 8,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-shinjuku-9",
    "branchId": "br-sora-jp-shinjuku",
    "number": 9,
    "capacity": 2,
    "zone": "vip",
    "status": "available",
    "currentGuestsCount": 0
  },
  {
    "id": "tbl-br-sora-jp-shinjuku-10",
    "branchId": "br-sora-jp-shinjuku",
    "number": 10,
    "capacity": 2,
    "zone": "bar",
    "status": "available",
    "currentGuestsCount": 0
  }
];
export const SEED_MENU_ITEMS: MenuItem[] = [
  {
    "id": "br-aura-co-chapinero-dish-co-aura-01",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "starters",
    "name": {
      "es": "Empanadas Bogotanas con Ají Casero",
      "en": "Bogota Empanadas with Fresh Aji",
      "pt": "Empanadas de Bogotá com Ají",
      "fr": "Empanadas de Bogota et aji doux",
      "ja": "ボゴタ風牛肉のエンパナーダ 自家製アヒ添え"
    },
    "description": {
      "es": "Crujientes empanadas de maíz rellenas de carne mechada sazonada y papa criolla.",
      "en": "Crispy corn pastries stuffed with shredded beef and baby creole potatoes.",
      "pt": "Massa crocante de milho recheada com carne desfiada e batata criolla.",
      "fr": "Chaussons de maïs croustillants farcis au bœuf effiloché et pommes de terre créoles.",
      "ja": "じっくり煮込んだ牛肉とアンデス小粒ポテトを詰めたサクサクのコーンパイ。"
    },
    "priceMinorUnits": 24000,
    "price": 24000,
    "basePriceUSD": 6,
    "prepTimeMinutes": 12,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Empanadas doradas sobre canasta artesanal",
      "en": "Golden crispy empanadas in artisanal basket",
      "pt": "Empanadas douradas na cesta artesanal",
      "fr": "Empanadas dorées croustillantes",
      "ja": "香ばしく揚がった黄金色のエンパナーダ"
    },
    "fallbackEmoji": "🥟",
    "branchId": "br-aura-co-chapinero"
  },
  {
    "id": "br-aura-co-chapinero-dish-co-aura-02",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "mains",
    "name": {
      "es": "Ajiaco Santafereño Tradicional",
      "en": "Bogota Traditional Chicken Ajiaco",
      "pt": "Ajiaco Tradicional de Bogotá",
      "fr": "Ajiaco traditionnel santafereño",
      "ja": "ボゴタ風伝統のアヒアコ（チキンとポテトの煮込み）"
    },
    "description": {
      "es": "Sopa ancestral con tres tipos de papas andinas, pollo tierno desmenuzado, guascas, alcaparras y crema agria.",
      "en": "Hearty ancestral soup with 3 Andean potato varieties, shredded chicken, guascas herb, capers and cream.",
      "pt": "Sopa ancestral com três tipos de batatas andinas, frango desfiado, alcaparras e creme.",
      "fr": "Soupe traditionnelle aux trois pommes de terre andines, poulet fermier, câpres et crème.",
      "ja": "3種のアンデスポテト、ほぐし鶏肉、香草グアスカを煮込んだボゴタ名物の郷土スープ。"
    },
    "priceMinorUnits": 46000,
    "price": 46000,
    "basePriceUSD": 11.5,
    "prepTimeMinutes": 20,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de ajiaco humeante con aguacate y maíz",
      "en": "Steaming bowl of ajiaco with avocado and corn",
      "pt": "Tigela de ajiaco quente com abacate e milho",
      "fr": "Bol fumant d’ajiaco avec avocat et maïs",
      "ja": "アボカドとトウモロコシが添えられた温かいアヒアコ"
    },
    "fallbackEmoji": "🍲",
    "branchId": "br-aura-co-chapinero"
  },
  {
    "id": "br-aura-co-chapinero-dish-co-aura-03",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "mains",
    "name": {
      "es": "Bandeja Paisa de Hacienda",
      "en": "Artisanal Paisa Platter",
      "pt": "Bandeja Paisa Tradicional",
      "fr": "Assiette traditionnelle Paisa",
      "ja": "ハシエンダ風バンデハ・パイサ（郷土プレート）"
    },
    "description": {
      "es": "Frijoles cargamanto en cazuela, arroz blanco, chicharrón crujiente, carne en polvo, huevo frito y plátano maduro.",
      "en": "Cargamanto bean casserole, white rice, crispy pork belly, powdered beef, sunny-side egg and sweet plantain.",
      "pt": "Feijão cargamanto, arroz branco, torresmo crocante, carne moída, ovo frito e banana frita.",
      "fr": "Haricots mijotés, riz blanc, poitrine de porc croustillante, œuf au plat et banane plantain.",
      "ja": "煮込み豆、白米、カリカリの豚バラ肉、挽肉、目玉焼き、揚げバナナの豪華ワンプレート。"
    },
    "priceMinorUnits": 52000,
    "price": 52000,
    "basePriceUSD": 13,
    "prepTimeMinutes": 22,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Bandeja paisa servida con chicharrón y frijoles",
      "en": "Full paisa platter with crispy pork and beans",
      "pt": "Bandeja paisa completa com torresmo e feijão",
      "fr": "Assiette paisa garnie de porc croustillant",
      "ja": "豚バラと煮豆が乗った伝統のバンデハ・パイサ"
    },
    "fallbackEmoji": "🍛",
    "branchId": "br-aura-co-chapinero"
  },
  {
    "id": "br-aura-co-chapinero-dish-co-aura-04",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "desserts",
    "name": {
      "es": "Postre de Natas Cundinamarqués",
      "en": "Bogota Milk Skin Custard with Raisins",
      "pt": "Doce de Natas com Passas",
      "fr": "Crème de lait confite aux raisins",
      "ja": "クンディナマルカ風ミルクスキン・カスタード"
    },
    "description": {
      "es": "Dulce tradicional a base de capas de nata de leche cocida a fuego lento con almíbar de caña y uvas pasas al ron.",
      "en": "Traditional dessert of slow-cooked milk cream layers in spiced cane syrup with rum-soaked raisins.",
      "pt": "Sobremesa tradicional de nata de leite em calda de cana com passas ao rum.",
      "fr": "Dessert traditionnel à base de fines couches de crème de lait au sirop de canne et raisins au rhum.",
      "ja": "じっくり煮詰めたミルクの膜にサトウキビ蜜とラム酒漬けレーズンを合わせた銘菓。"
    },
    "priceMinorUnits": 18000,
    "price": 18000,
    "basePriceUSD": 4.5,
    "prepTimeMinutes": 8,
    "available": true,
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Copa de postre de natas artesanal",
      "en": "Artisanal milk skin custard cup",
      "pt": "Taça de doce de natas artesanal",
      "fr": "Coupe de crème de lait artisanale",
      "ja": "伝統的なミルクスキンカスタード"
    },
    "fallbackEmoji": "🍮",
    "branchId": "br-aura-co-chapinero"
  },
  {
    "id": "br-aura-co-chapinero-dish-co-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga a la Brasa con Arroz de Coco y Patacón",
      "en": "Lunch of the Day: Grilled Chicken with Coconut Rice & Plantain",
      "pt": "Almoço do Dia: Frango Grelhado com Arroz de Coco e Banana",
      "fr": "Plat du jour midi: Poulet braisé, riz au coco et plantain",
      "ja": "本日のおすすめランチ：若鶏の炭火焼き ココナッツライスと特製添え"
    },
    "description": {
      "es": "Menú completo balanceado con sopa del día, pechuga de pollo marinada al limón y finas hierbas, arroz de coco artesanal, patacón y limonada fresca.",
      "en": "Complete balanced lunch with soup of the day, herb-marinated grilled chicken breast, coconut rice, plantain crisp and fresh limeade.",
      "pt": "Menu completo com sopa do dia, peito de frango grelhado, arroz de coco e limonada fresca.",
      "fr": "Menu déjeuner équilibré avec potage du jour, suprême de poulet mariné, riz coco et boisson fraîche.",
      "ja": "本日のスープ、ハーブ若鶏のグリル、香ばしいココナッツライス、特製ライムジュースが付いた日替わり定食。"
    },
    "priceMinorUnits": 25900,
    "price": 25900,
    "basePriceUSD": 6.32,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato balanceado de pollo a la plancha con ensalada fresca",
      "en": "Balanced grilled chicken platter with fresh salad",
      "pt": "Prato equilibrado de frango grelhado com salada",
      "fr": "Assiette équilibrée de poulet grillé et légumes",
      "ja": "彩り野菜と若鶏グリルのヘルシーランチプレート"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-co-chapinero"
  },
  {
    "id": "br-aura-co-chapinero-dish-co-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "drinks",
    "name": {
      "es": "Limonada de Coco Andina",
      "en": "Fresh Andean Coconut Limeade",
      "pt": "Limonada de Coco Fresca",
      "fr": "Limonade fraîche à la noix de coco",
      "ja": "フレッシュココナッツライムジュース"
    },
    "description": {
      "es": "Bebida helada cremosa elaborada al momento con leche de coco natural y jugo de lima recién exprimido.",
      "en": "Creamy iced beverage made to order with natural coconut cream and freshly squeezed limes.",
      "pt": "Bebida cremosa gelada feita na hora com leite de coco natural e suco de limão fresco.",
      "fr": "Boisson glacée onctueuse préparée minute au lait de coco et jus de citron vert frais.",
      "ja": "絞りたてライム果汁と天然ココナッツミルクをブレンドした、クリーミーな特製フローズンドリンク。"
    },
    "priceMinorUnits": 14000,
    "price": 14000,
    "basePriceUSD": 3.5,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada de coco decorado con lima",
      "en": "Glass of frosted coconut limeade with lime garnish",
      "pt": "Copo de limonada de coco gelada com limão",
      "fr": "Verre de limonade coco glacée avec rondelle de citron",
      "ja": "ライムを飾った冷たいココナッツライムジュース"
    },
    "fallbackEmoji": "🥥",
    "branchId": "br-aura-co-chapinero"
  },
  {
    "id": "br-aura-co-chapinero-dish-co-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga a la Brasa con Arroz de Coco y Patacón",
      "en": "Lunch of the Day: Grilled Chicken with Coconut Rice & Plantain",
      "pt": "Almoço do Dia: Frango Grelhado com Arroz de Coco e Banana",
      "fr": "Plat du jour midi: Poulet braisé, riz au coco et plantain",
      "ja": "本日のおすすめランチ：若鶏の炭火焼き ココナッツライスと特製添え"
    },
    "description": {
      "es": "Menú completo balanceado con sopa del día, pechuga de pollo marinada al limón y finas hierbas, arroz de coco artesanal, patacón y limonada fresca.",
      "en": "Complete balanced lunch with soup of the day, herb-marinated grilled chicken breast, coconut rice, plantain crisp and fresh limeade.",
      "pt": "Menu completo com sopa do dia, peito de frango grelhado, arroz de coco e limonada fresca.",
      "fr": "Menu déjeuner équilibré avec potage du jour, suprême de poulet mariné, riz coco et boisson fraîche.",
      "ja": "本日のスープ、ハーブ若鶏のグリル、香ばしいココナッツライス、特製ライムジュースが付いた日替わり定食。"
    },
    "priceMinorUnits": 25900,
    "price": 25900,
    "basePriceUSD": 6.32,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato balanceado de pollo a la plancha con ensalada fresca",
      "en": "Balanced grilled chicken platter with fresh salad",
      "pt": "Prato equilibrado de frango grelhado com salada",
      "fr": "Assiette équilibrée de poulet grillé et légumes",
      "ja": "彩り野菜と若鶏グリルのヘルシーランチプレート"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-co-chapinero"
  },
  {
    "id": "br-aura-co-chapinero-dish-co-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "drinks",
    "name": {
      "es": "Limonada de Coco Andina",
      "en": "Fresh Andean Coconut Limeade",
      "pt": "Limonada de Coco Fresca",
      "fr": "Limonade fraîche à la noix de coco",
      "ja": "フレッシュココナッツライムジュース"
    },
    "description": {
      "es": "Bebida helada cremosa elaborada al momento con leche de coco natural y jugo de lima recién exprimido.",
      "en": "Creamy iced beverage made to order with natural coconut cream and freshly squeezed limes.",
      "pt": "Bebida cremosa gelada feita na hora com leite de coco natural e suco de limão fresco.",
      "fr": "Boisson glacée onctueuse préparée minute au lait de coco et jus de citron vert frais.",
      "ja": "絞りたてライム果汁と天然ココナッツミルクをブレンドした、クリーミーな特製フローズンドリンク。"
    },
    "priceMinorUnits": 14000,
    "price": 14000,
    "basePriceUSD": 3.5,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada de coco decorado con lima",
      "en": "Glass of frosted coconut limeade with lime garnish",
      "pt": "Copo de limonada de coco gelada com limão",
      "fr": "Verre de limonade coco glacée avec rondelle de citron",
      "ja": "ライムを飾った冷たいココナッツライムジュース"
    },
    "fallbackEmoji": "🥥",
    "branchId": "br-aura-co-chapinero"
  },
  {
    "id": "br-aura-co-usaquen-dish-co-aura-01",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "starters",
    "name": {
      "es": "Empanadas Bogotanas con Ají Casero",
      "en": "Bogota Empanadas with Fresh Aji",
      "pt": "Empanadas de Bogotá com Ají",
      "fr": "Empanadas de Bogota et aji doux",
      "ja": "ボゴタ風牛肉のエンパナーダ 自家製アヒ添え"
    },
    "description": {
      "es": "Crujientes empanadas de maíz rellenas de carne mechada sazonada y papa criolla.",
      "en": "Crispy corn pastries stuffed with shredded beef and baby creole potatoes.",
      "pt": "Massa crocante de milho recheada com carne desfiada e batata criolla.",
      "fr": "Chaussons de maïs croustillants farcis au bœuf effiloché et pommes de terre créoles.",
      "ja": "じっくり煮込んだ牛肉とアンデス小粒ポテトを詰めたサクサクのコーンパイ。"
    },
    "priceMinorUnits": 24000,
    "price": 24000,
    "basePriceUSD": 6,
    "prepTimeMinutes": 12,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Empanadas doradas sobre canasta artesanal",
      "en": "Golden crispy empanadas in artisanal basket",
      "pt": "Empanadas douradas na cesta artesanal",
      "fr": "Empanadas dorées croustillantes",
      "ja": "香ばしく揚がった黄金色のエンパナーダ"
    },
    "fallbackEmoji": "🥟",
    "branchId": "br-aura-co-usaquen"
  },
  {
    "id": "br-aura-co-usaquen-dish-co-aura-02",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "mains",
    "name": {
      "es": "Ajiaco Santafereño Tradicional",
      "en": "Bogota Traditional Chicken Ajiaco",
      "pt": "Ajiaco Tradicional de Bogotá",
      "fr": "Ajiaco traditionnel santafereño",
      "ja": "ボゴタ風伝統のアヒアコ（チキンとポテトの煮込み）"
    },
    "description": {
      "es": "Sopa ancestral con tres tipos de papas andinas, pollo tierno desmenuzado, guascas, alcaparras y crema agria.",
      "en": "Hearty ancestral soup with 3 Andean potato varieties, shredded chicken, guascas herb, capers and cream.",
      "pt": "Sopa ancestral com três tipos de batatas andinas, frango desfiado, alcaparras e creme.",
      "fr": "Soupe traditionnelle aux trois pommes de terre andines, poulet fermier, câpres et crème.",
      "ja": "3種のアンデスポテト、ほぐし鶏肉、香草グアスカを煮込んだボゴタ名物の郷土スープ。"
    },
    "priceMinorUnits": 46000,
    "price": 46000,
    "basePriceUSD": 11.5,
    "prepTimeMinutes": 20,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de ajiaco humeante con aguacate y maíz",
      "en": "Steaming bowl of ajiaco with avocado and corn",
      "pt": "Tigela de ajiaco quente com abacate e milho",
      "fr": "Bol fumant d’ajiaco avec avocat et maïs",
      "ja": "アボカドとトウモロコシが添えられた温かいアヒアコ"
    },
    "fallbackEmoji": "🍲",
    "branchId": "br-aura-co-usaquen"
  },
  {
    "id": "br-aura-co-usaquen-dish-co-aura-03",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "mains",
    "name": {
      "es": "Bandeja Paisa de Hacienda",
      "en": "Artisanal Paisa Platter",
      "pt": "Bandeja Paisa Tradicional",
      "fr": "Assiette traditionnelle Paisa",
      "ja": "ハシエンダ風バンデハ・パイサ（郷土プレート）"
    },
    "description": {
      "es": "Frijoles cargamanto en cazuela, arroz blanco, chicharrón crujiente, carne en polvo, huevo frito y plátano maduro.",
      "en": "Cargamanto bean casserole, white rice, crispy pork belly, powdered beef, sunny-side egg and sweet plantain.",
      "pt": "Feijão cargamanto, arroz branco, torresmo crocante, carne moída, ovo frito e banana frita.",
      "fr": "Haricots mijotés, riz blanc, poitrine de porc croustillante, œuf au plat et banane plantain.",
      "ja": "煮込み豆、白米、カリカリの豚バラ肉、挽肉、目玉焼き、揚げバナナの豪華ワンプレート。"
    },
    "priceMinorUnits": 52000,
    "price": 52000,
    "basePriceUSD": 13,
    "prepTimeMinutes": 22,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Bandeja paisa servida con chicharrón y frijoles",
      "en": "Full paisa platter with crispy pork and beans",
      "pt": "Bandeja paisa completa com torresmo e feijão",
      "fr": "Assiette paisa garnie de porc croustillant",
      "ja": "豚バラと煮豆が乗った伝統のバンデハ・パイサ"
    },
    "fallbackEmoji": "🍛",
    "branchId": "br-aura-co-usaquen"
  },
  {
    "id": "br-aura-co-usaquen-dish-co-aura-04",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "desserts",
    "name": {
      "es": "Postre de Natas Cundinamarqués",
      "en": "Bogota Milk Skin Custard with Raisins",
      "pt": "Doce de Natas com Passas",
      "fr": "Crème de lait confite aux raisins",
      "ja": "クンディナマルカ風ミルクスキン・カスタード"
    },
    "description": {
      "es": "Dulce tradicional a base de capas de nata de leche cocida a fuego lento con almíbar de caña y uvas pasas al ron.",
      "en": "Traditional dessert of slow-cooked milk cream layers in spiced cane syrup with rum-soaked raisins.",
      "pt": "Sobremesa tradicional de nata de leite em calda de cana com passas ao rum.",
      "fr": "Dessert traditionnel à base de fines couches de crème de lait au sirop de canne et raisins au rhum.",
      "ja": "じっくり煮詰めたミルクの膜にサトウキビ蜜とラム酒漬けレーズンを合わせた銘菓。"
    },
    "priceMinorUnits": 18000,
    "price": 18000,
    "basePriceUSD": 4.5,
    "prepTimeMinutes": 8,
    "available": true,
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Copa de postre de natas artesanal",
      "en": "Artisanal milk skin custard cup",
      "pt": "Taça de doce de natas artesanal",
      "fr": "Coupe de crème de lait artisanale",
      "ja": "伝統的なミルクスキンカスタード"
    },
    "fallbackEmoji": "🍮",
    "branchId": "br-aura-co-usaquen"
  },
  {
    "id": "br-aura-co-usaquen-dish-co-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga a la Brasa con Arroz de Coco y Patacón",
      "en": "Lunch of the Day: Grilled Chicken with Coconut Rice & Plantain",
      "pt": "Almoço do Dia: Frango Grelhado com Arroz de Coco e Banana",
      "fr": "Plat du jour midi: Poulet braisé, riz au coco et plantain",
      "ja": "本日のおすすめランチ：若鶏の炭火焼き ココナッツライスと特製添え"
    },
    "description": {
      "es": "Menú completo balanceado con sopa del día, pechuga de pollo marinada al limón y finas hierbas, arroz de coco artesanal, patacón y limonada fresca.",
      "en": "Complete balanced lunch with soup of the day, herb-marinated grilled chicken breast, coconut rice, plantain crisp and fresh limeade.",
      "pt": "Menu completo com sopa do dia, peito de frango grelhado, arroz de coco e limonada fresca.",
      "fr": "Menu déjeuner équilibré avec potage du jour, suprême de poulet mariné, riz coco et boisson fraîche.",
      "ja": "本日のスープ、ハーブ若鶏のグリル、香ばしいココナッツライス、特製ライムジュースが付いた日替わり定食。"
    },
    "priceMinorUnits": 25900,
    "price": 25900,
    "basePriceUSD": 6.32,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato balanceado de pollo a la plancha con ensalada fresca",
      "en": "Balanced grilled chicken platter with fresh salad",
      "pt": "Prato equilibrado de frango grelhado com salada",
      "fr": "Assiette équilibrée de poulet grillé et légumes",
      "ja": "彩り野菜と若鶏グリルのヘルシーランチプレート"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-co-usaquen"
  },
  {
    "id": "br-aura-co-usaquen-dish-co-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "drinks",
    "name": {
      "es": "Limonada de Coco Andina",
      "en": "Fresh Andean Coconut Limeade",
      "pt": "Limonada de Coco Fresca",
      "fr": "Limonade fraîche à la noix de coco",
      "ja": "フレッシュココナッツライムジュース"
    },
    "description": {
      "es": "Bebida helada cremosa elaborada al momento con leche de coco natural y jugo de lima recién exprimido.",
      "en": "Creamy iced beverage made to order with natural coconut cream and freshly squeezed limes.",
      "pt": "Bebida cremosa gelada feita na hora com leite de coco natural e suco de limão fresco.",
      "fr": "Boisson glacée onctueuse préparée minute au lait de coco et jus de citron vert frais.",
      "ja": "絞りたてライム果汁と天然ココナッツミルクをブレンドした、クリーミーな特製フローズンドリンク。"
    },
    "priceMinorUnits": 14000,
    "price": 14000,
    "basePriceUSD": 3.5,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada de coco decorado con lima",
      "en": "Glass of frosted coconut limeade with lime garnish",
      "pt": "Copo de limonada de coco gelada com limão",
      "fr": "Verre de limonade coco glacée avec rondelle de citron",
      "ja": "ライムを飾った冷たいココナッツライムジュース"
    },
    "fallbackEmoji": "🥥",
    "branchId": "br-aura-co-usaquen"
  },
  {
    "id": "br-aura-co-usaquen-dish-co-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga a la Brasa con Arroz de Coco y Patacón",
      "en": "Lunch of the Day: Grilled Chicken with Coconut Rice & Plantain",
      "pt": "Almoço do Dia: Frango Grelhado com Arroz de Coco e Banana",
      "fr": "Plat du jour midi: Poulet braisé, riz au coco et plantain",
      "ja": "本日のおすすめランチ：若鶏の炭火焼き ココナッツライスと特製添え"
    },
    "description": {
      "es": "Menú completo balanceado con sopa del día, pechuga de pollo marinada al limón y finas hierbas, arroz de coco artesanal, patacón y limonada fresca.",
      "en": "Complete balanced lunch with soup of the day, herb-marinated grilled chicken breast, coconut rice, plantain crisp and fresh limeade.",
      "pt": "Menu completo com sopa do dia, peito de frango grelhado, arroz de coco e limonada fresca.",
      "fr": "Menu déjeuner équilibré avec potage du jour, suprême de poulet mariné, riz coco et boisson fraîche.",
      "ja": "本日のスープ、ハーブ若鶏のグリル、香ばしいココナッツライス、特製ライムジュースが付いた日替わり定食。"
    },
    "priceMinorUnits": 25900,
    "price": 25900,
    "basePriceUSD": 6.32,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato balanceado de pollo a la plancha con ensalada fresca",
      "en": "Balanced grilled chicken platter with fresh salad",
      "pt": "Prato equilibrado de frango grelhado com salada",
      "fr": "Assiette équilibrée de poulet grillé et légumes",
      "ja": "彩り野菜と若鶏グリルのヘルシーランチプレート"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-co-usaquen"
  },
  {
    "id": "br-aura-co-usaquen-dish-co-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "drinks",
    "name": {
      "es": "Limonada de Coco Andina",
      "en": "Fresh Andean Coconut Limeade",
      "pt": "Limonada de Coco Fresca",
      "fr": "Limonade fraîche à la noix de coco",
      "ja": "フレッシュココナッツライムジュース"
    },
    "description": {
      "es": "Bebida helada cremosa elaborada al momento con leche de coco natural y jugo de lima recién exprimido.",
      "en": "Creamy iced beverage made to order with natural coconut cream and freshly squeezed limes.",
      "pt": "Bebida cremosa gelada feita na hora com leite de coco natural e suco de limão fresco.",
      "fr": "Boisson glacée onctueuse préparée minute au lait de coco et jus de citron vert frais.",
      "ja": "絞りたてライム果汁と天然ココナッツミルクをブレンドした、クリーミーな特製フローズンドリンク。"
    },
    "priceMinorUnits": 14000,
    "price": 14000,
    "basePriceUSD": 3.5,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada de coco decorado con lima",
      "en": "Glass of frosted coconut limeade with lime garnish",
      "pt": "Copo de limonada de coco gelada com limão",
      "fr": "Verre de limonade coco glacée avec rondelle de citron",
      "ja": "ライムを飾った冷たいココナッツライムジュース"
    },
    "fallbackEmoji": "🥥",
    "branchId": "br-aura-co-usaquen"
  },
  {
    "id": "br-sora-co-chico-dish-co-sora-01",
    "restaurantId": "brand-sora",
    "countryCode": "CO",
    "category": "starters",
    "name": {
      "es": "Tiradito de Corvina y Maracuyá Andina",
      "en": "Sea Bass Tiradito with Andean Passionfruit",
      "pt": "Tiradito de Corvina com Maracujá Andino",
      "fr": "Tiradito de bar au fruit de la passion andin",
      "ja": "スズキのティラディート アンデスパッションフルーツ仕立て"
    },
    "description": {
      "es": "Finas láminas de corvina fresca curadas en leche de tigre de maracuyá, ají amarillo y crocantes de plátano.",
      "en": "Thin sashimi-cut sea bass in passionfruit leche de tigre with yellow chili and plantain crisps.",
      "pt": "Fatias finas de corvina marinadas em leite de tigre de maracujá com crocante de banana.",
      "fr": "Fines tranches de bar mariné au leche de tigre de fruit de la passion et piment jaune.",
      "ja": "新鮮なスズキの薄造りにアンデス産パッションフルーツと黄唐辛子のソースを合わせた冷菜。"
    },
    "priceMinorUnits": 38000,
    "price": 38000,
    "basePriceUSD": 9.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tiradito de pescado fresco con salsa dorada",
      "en": "Fresh sea bass tiradito with golden citrus sauce",
      "pt": "Tiradito de peixe fresco com molho cítrico",
      "fr": "Tiradito de poisson frais aux agrumes",
      "ja": "シトラスソースを纏ったスズキのカルパッチョ"
    },
    "fallbackEmoji": "🐟",
    "branchId": "br-sora-co-chico"
  },
  {
    "id": "br-sora-co-chico-dish-co-sora-02",
    "restaurantId": "brand-sora",
    "countryCode": "CO",
    "category": "mains",
    "name": {
      "es": "Nigiris Nikkei de Trucha y Uchuvia",
      "en": "Trout & Cape Gooseberry Nikkei Nigiri",
      "pt": "Nigiris Nikkei de Truta e Physalis",
      "fr": "Nigiris Nikkei à la truite et physalis",
      "ja": "アンデス鱒と食用ホオズキの日系握り寿司"
    },
    "description": {
      "es": "Arroz sazonado con shari japonés, trucha arcoíris andina flambeada y reducción dulce de uchuvia.",
      "en": "Seasoned shari sushi rice topped with seared Andean rainbow trout and sweet cape gooseberry glaze.",
      "pt": "Arroz de sushi com truta arco-íris andina selada e redução doce de physalis.",
      "fr": "Riz à sushi assaisonné, truite arc-en-ciel andine saisie et réduction de physalis.",
      "ja": "アンデス清流で育った虹鱒を軽く炙り、ホオズキの甘酸っぱいジュレを添えた握り。"
    },
    "priceMinorUnits": 42000,
    "price": 42000,
    "basePriceUSD": 10.5,
    "prepTimeMinutes": 14,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato de nigiris artesanales flambeados",
      "en": "Plate of artisanal seared nigiri sushi",
      "pt": "Prato de nigiris maçaricados artesanais",
      "fr": "Plateau de nigiris saisis au chalumeau",
      "ja": "炙り寿司の上品な盛り合わせ"
    },
    "fallbackEmoji": "🍣",
    "branchId": "br-sora-co-chico"
  },
  {
    "id": "br-sora-co-chico-dish-co-sora-03",
    "restaurantId": "brand-sora",
    "countryCode": "CO",
    "category": "mains",
    "name": {
      "es": "Ramen Chashu Criollo al Miso",
      "en": "Creole Pork Belly Miso Ramen",
      "pt": "Ramen Criollo de Miso e Chashu",
      "fr": "Ramen au miso et porc chashu créole",
      "ja": "信州味噌と特製チャーシューの特製ラーメン"
    },
    "description": {
      "es": "Caldo denso de cerdo y miso cocido por 16 horas, fideos artesanales, chashu braseado, huevo ajitama y maíz tostado.",
      "en": "16-hour rich pork and miso broth, artisanal ramen noodles, braised chashu pork, ajitama egg and corn.",
      "pt": "Caldo encorpado de porco e missô, macarrão artesanal, barriga de porco braseada e ovo.",
      "fr": "Bouillon riche au porc et miso mijoté 16h, nouilles fraîches, porc chashu fondant et œuf mollet.",
      "ja": "16時間炊き出した濃厚豚骨味噌スープ、自家製麺、特製炙りチャーシューと味玉。"
    },
    "priceMinorUnits": 45000,
    "price": 45000,
    "basePriceUSD": 11,
    "prepTimeMinutes": 15,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón humeante de ramen con fideos y huevo",
      "en": "Steaming bowl of ramen with pork and egg",
      "pt": "Tigela fumegante de ramen com carne e ovo",
      "fr": "Bol fumant de ramen avec porc et œuf ajitama",
      "ja": "湯気立つ濃厚味噌ラーメンの器"
    },
    "fallbackEmoji": "🍜",
    "branchId": "br-sora-co-chico"
  },
  {
    "id": "br-sora-co-chico-dish-co-sora-04",
    "restaurantId": "brand-sora",
    "countryCode": "CO",
    "category": "desserts",
    "name": {
      "es": "Mochi Helado de Lulo y Té Matcha",
      "en": "Lulo Fruit & Matcha Green Tea Mochi",
      "pt": "Mochi de Lulo e Chá Verde Matcha",
      "fr": "Mochi glacé au lulo et thé vert matcha",
      "ja": "ルロ果実と宇治抹茶のアイス大福"
    },
    "description": {
      "es": "Masa japonesa de arroz glutinoso rellena de helado cremoso de lulo colombiano y polvo de té verde matcha de Kioto.",
      "en": "Soft Japanese mochi dough filled with tangy Colombian lulo gelato and dusted with Kyoto matcha powder.",
      "pt": "Massa macia de mochi recheada com sorvete de lulo e pó de chá verde matcha de Kyoto.",
      "fr": "Pâte de riz japonaise moelleuse garnie de glace au lulo et saupoudrée de matcha de Kyoto.",
      "ja": "コロンビア名産のルロ果汁ジェラートを柔らかな求肥で包み、京都産宇治抹茶を振った甘味。"
    },
    "priceMinorUnits": 20000,
    "price": 20000,
    "basePriceUSD": 5,
    "prepTimeMinutes": 6,
    "available": true,
    "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Dúo de mochis artesanales con polvo matcha",
      "en": "Artisanal mochi pair dusted with matcha",
      "pt": "Dupla de mochis polvilhados com matcha",
      "fr": "Duo de mochis artisanaux au thé matcha",
      "ja": "抹茶パウダーをまとった自家製アイス大福"
    },
    "fallbackEmoji": "🍡",
    "branchId": "br-sora-co-chico"
  },
  {
    "id": "br-sora-co-chico-dish-co-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga a la Brasa con Arroz de Coco y Patacón",
      "en": "Lunch of the Day: Grilled Chicken with Coconut Rice & Plantain",
      "pt": "Almoço do Dia: Frango Grelhado com Arroz de Coco e Banana",
      "fr": "Plat du jour midi: Poulet braisé, riz au coco et plantain",
      "ja": "本日のおすすめランチ：若鶏の炭火焼き ココナッツライスと特製添え"
    },
    "description": {
      "es": "Menú completo balanceado con sopa del día, pechuga de pollo marinada al limón y finas hierbas, arroz de coco artesanal, patacón y limonada fresca.",
      "en": "Complete balanced lunch with soup of the day, herb-marinated grilled chicken breast, coconut rice, plantain crisp and fresh limeade.",
      "pt": "Menu completo com sopa do dia, peito de frango grelhado, arroz de coco e limonada fresca.",
      "fr": "Menu déjeuner équilibré avec potage du jour, suprême de poulet mariné, riz coco et boisson fraîche.",
      "ja": "本日のスープ、ハーブ若鶏のグリル、香ばしいココナッツライス、特製ライムジュースが付いた日替わり定食。"
    },
    "priceMinorUnits": 25900,
    "price": 25900,
    "basePriceUSD": 6.32,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato balanceado de pollo a la plancha con ensalada fresca",
      "en": "Balanced grilled chicken platter with fresh salad",
      "pt": "Prato equilibrado de frango grelhado com salada",
      "fr": "Assiette équilibrée de poulet grillé et légumes",
      "ja": "彩り野菜と若鶏グリルのヘルシーランチプレート"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-sora-co-chico"
  },
  {
    "id": "br-sora-co-chico-dish-co-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "drinks",
    "name": {
      "es": "Limonada de Coco Andina",
      "en": "Fresh Andean Coconut Limeade",
      "pt": "Limonada de Coco Fresca",
      "fr": "Limonade fraîche à la noix de coco",
      "ja": "フレッシュココナッツライムジュース"
    },
    "description": {
      "es": "Bebida helada cremosa elaborada al momento con leche de coco natural y jugo de lima recién exprimido.",
      "en": "Creamy iced beverage made to order with natural coconut cream and freshly squeezed limes.",
      "pt": "Bebida cremosa gelada feita na hora com leite de coco natural e suco de limão fresco.",
      "fr": "Boisson glacée onctueuse préparée minute au lait de coco et jus de citron vert frais.",
      "ja": "絞りたてライム果汁と天然ココナッツミルクをブレンドした、クリーミーな特製フローズンドリンク。"
    },
    "priceMinorUnits": 14000,
    "price": 14000,
    "basePriceUSD": 3.5,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada de coco decorado con lima",
      "en": "Glass of frosted coconut limeade with lime garnish",
      "pt": "Copo de limonada de coco gelada com limão",
      "fr": "Verre de limonade coco glacée avec rondelle de citron",
      "ja": "ライムを飾った冷たいココナッツライムジュース"
    },
    "fallbackEmoji": "🥥",
    "branchId": "br-sora-co-chico"
  },
  {
    "id": "br-sora-co-zonag-dish-co-sora-01",
    "restaurantId": "brand-sora",
    "countryCode": "CO",
    "category": "starters",
    "name": {
      "es": "Tiradito de Corvina y Maracuyá Andina",
      "en": "Sea Bass Tiradito with Andean Passionfruit",
      "pt": "Tiradito de Corvina com Maracujá Andino",
      "fr": "Tiradito de bar au fruit de la passion andin",
      "ja": "スズキのティラディート アンデスパッションフルーツ仕立て"
    },
    "description": {
      "es": "Finas láminas de corvina fresca curadas en leche de tigre de maracuyá, ají amarillo y crocantes de plátano.",
      "en": "Thin sashimi-cut sea bass in passionfruit leche de tigre with yellow chili and plantain crisps.",
      "pt": "Fatias finas de corvina marinadas em leite de tigre de maracujá com crocante de banana.",
      "fr": "Fines tranches de bar mariné au leche de tigre de fruit de la passion et piment jaune.",
      "ja": "新鮮なスズキの薄造りにアンデス産パッションフルーツと黄唐辛子のソースを合わせた冷菜。"
    },
    "priceMinorUnits": 38000,
    "price": 38000,
    "basePriceUSD": 9.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tiradito de pescado fresco con salsa dorada",
      "en": "Fresh sea bass tiradito with golden citrus sauce",
      "pt": "Tiradito de peixe fresco com molho cítrico",
      "fr": "Tiradito de poisson frais aux agrumes",
      "ja": "シトラスソースを纏ったスズキのカルパッチョ"
    },
    "fallbackEmoji": "🐟",
    "branchId": "br-sora-co-zonag"
  },
  {
    "id": "br-sora-co-zonag-dish-co-sora-02",
    "restaurantId": "brand-sora",
    "countryCode": "CO",
    "category": "mains",
    "name": {
      "es": "Nigiris Nikkei de Trucha y Uchuvia",
      "en": "Trout & Cape Gooseberry Nikkei Nigiri",
      "pt": "Nigiris Nikkei de Truta e Physalis",
      "fr": "Nigiris Nikkei à la truite et physalis",
      "ja": "アンデス鱒と食用ホオズキの日系握り寿司"
    },
    "description": {
      "es": "Arroz sazonado con shari japonés, trucha arcoíris andina flambeada y reducción dulce de uchuvia.",
      "en": "Seasoned shari sushi rice topped with seared Andean rainbow trout and sweet cape gooseberry glaze.",
      "pt": "Arroz de sushi com truta arco-íris andina selada e redução doce de physalis.",
      "fr": "Riz à sushi assaisonné, truite arc-en-ciel andine saisie et réduction de physalis.",
      "ja": "アンデス清流で育った虹鱒を軽く炙り、ホオズキの甘酸っぱいジュレを添えた握り。"
    },
    "priceMinorUnits": 42000,
    "price": 42000,
    "basePriceUSD": 10.5,
    "prepTimeMinutes": 14,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato de nigiris artesanales flambeados",
      "en": "Plate of artisanal seared nigiri sushi",
      "pt": "Prato de nigiris maçaricados artesanais",
      "fr": "Plateau de nigiris saisis au chalumeau",
      "ja": "炙り寿司の上品な盛り合わせ"
    },
    "fallbackEmoji": "🍣",
    "branchId": "br-sora-co-zonag"
  },
  {
    "id": "br-sora-co-zonag-dish-co-sora-03",
    "restaurantId": "brand-sora",
    "countryCode": "CO",
    "category": "mains",
    "name": {
      "es": "Ramen Chashu Criollo al Miso",
      "en": "Creole Pork Belly Miso Ramen",
      "pt": "Ramen Criollo de Miso e Chashu",
      "fr": "Ramen au miso et porc chashu créole",
      "ja": "信州味噌と特製チャーシューの特製ラーメン"
    },
    "description": {
      "es": "Caldo denso de cerdo y miso cocido por 16 horas, fideos artesanales, chashu braseado, huevo ajitama y maíz tostado.",
      "en": "16-hour rich pork and miso broth, artisanal ramen noodles, braised chashu pork, ajitama egg and corn.",
      "pt": "Caldo encorpado de porco e missô, macarrão artesanal, barriga de porco braseada e ovo.",
      "fr": "Bouillon riche au porc et miso mijoté 16h, nouilles fraîches, porc chashu fondant et œuf mollet.",
      "ja": "16時間炊き出した濃厚豚骨味噌スープ、自家製麺、特製炙りチャーシューと味玉。"
    },
    "priceMinorUnits": 45000,
    "price": 45000,
    "basePriceUSD": 11,
    "prepTimeMinutes": 15,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón humeante de ramen con fideos y huevo",
      "en": "Steaming bowl of ramen with pork and egg",
      "pt": "Tigela fumegante de ramen com carne e ovo",
      "fr": "Bol fumant de ramen avec porc et œuf ajitama",
      "ja": "湯気立つ濃厚味噌ラーメンの器"
    },
    "fallbackEmoji": "🍜",
    "branchId": "br-sora-co-zonag"
  },
  {
    "id": "br-sora-co-zonag-dish-co-sora-04",
    "restaurantId": "brand-sora",
    "countryCode": "CO",
    "category": "desserts",
    "name": {
      "es": "Mochi Helado de Lulo y Té Matcha",
      "en": "Lulo Fruit & Matcha Green Tea Mochi",
      "pt": "Mochi de Lulo e Chá Verde Matcha",
      "fr": "Mochi glacé au lulo et thé vert matcha",
      "ja": "ルロ果実と宇治抹茶のアイス大福"
    },
    "description": {
      "es": "Masa japonesa de arroz glutinoso rellena de helado cremoso de lulo colombiano y polvo de té verde matcha de Kioto.",
      "en": "Soft Japanese mochi dough filled with tangy Colombian lulo gelato and dusted with Kyoto matcha powder.",
      "pt": "Massa macia de mochi recheada com sorvete de lulo e pó de chá verde matcha de Kyoto.",
      "fr": "Pâte de riz japonaise moelleuse garnie de glace au lulo et saupoudrée de matcha de Kyoto.",
      "ja": "コロンビア名産のルロ果汁ジェラートを柔らかな求肥で包み、京都産宇治抹茶を振った甘味。"
    },
    "priceMinorUnits": 20000,
    "price": 20000,
    "basePriceUSD": 5,
    "prepTimeMinutes": 6,
    "available": true,
    "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Dúo de mochis artesanales con polvo matcha",
      "en": "Artisanal mochi pair dusted with matcha",
      "pt": "Dupla de mochis polvilhados com matcha",
      "fr": "Duo de mochis artisanaux au thé matcha",
      "ja": "抹茶パウダーをまとった自家製アイス大福"
    },
    "fallbackEmoji": "🍡",
    "branchId": "br-sora-co-zonag"
  },
  {
    "id": "br-sora-co-zonag-dish-co-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga a la Brasa con Arroz de Coco y Patacón",
      "en": "Lunch of the Day: Grilled Chicken with Coconut Rice & Plantain",
      "pt": "Almoço do Dia: Frango Grelhado com Arroz de Coco e Banana",
      "fr": "Plat du jour midi: Poulet braisé, riz au coco et plantain",
      "ja": "本日のおすすめランチ：若鶏の炭火焼き ココナッツライスと特製添え"
    },
    "description": {
      "es": "Menú completo balanceado con sopa del día, pechuga de pollo marinada al limón y finas hierbas, arroz de coco artesanal, patacón y limonada fresca.",
      "en": "Complete balanced lunch with soup of the day, herb-marinated grilled chicken breast, coconut rice, plantain crisp and fresh limeade.",
      "pt": "Menu completo com sopa do dia, peito de frango grelhado, arroz de coco e limonada fresca.",
      "fr": "Menu déjeuner équilibré avec potage du jour, suprême de poulet mariné, riz coco et boisson fraîche.",
      "ja": "本日のスープ、ハーブ若鶏のグリル、香ばしいココナッツライス、特製ライムジュースが付いた日替わり定食。"
    },
    "priceMinorUnits": 25900,
    "price": 25900,
    "basePriceUSD": 6.32,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato balanceado de pollo a la plancha con ensalada fresca",
      "en": "Balanced grilled chicken platter with fresh salad",
      "pt": "Prato equilibrado de frango grelhado com salada",
      "fr": "Assiette équilibrée de poulet grillé et légumes",
      "ja": "彩り野菜と若鶏グリルのヘルシーランチプレート"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-sora-co-zonag"
  },
  {
    "id": "br-sora-co-zonag-dish-co-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "CO",
    "category": "drinks",
    "name": {
      "es": "Limonada de Coco Andina",
      "en": "Fresh Andean Coconut Limeade",
      "pt": "Limonada de Coco Fresca",
      "fr": "Limonade fraîche à la noix de coco",
      "ja": "フレッシュココナッツライムジュース"
    },
    "description": {
      "es": "Bebida helada cremosa elaborada al momento con leche de coco natural y jugo de lima recién exprimido.",
      "en": "Creamy iced beverage made to order with natural coconut cream and freshly squeezed limes.",
      "pt": "Bebida cremosa gelada feita na hora com leite de coco natural e suco de limão fresco.",
      "fr": "Boisson glacée onctueuse préparée minute au lait de coco et jus de citron vert frais.",
      "ja": "絞りたてライム果汁と天然ココナッツミルクをブレンドした、クリーミーな特製フローズンドリンク。"
    },
    "priceMinorUnits": 14000,
    "price": 14000,
    "basePriceUSD": 3.5,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada de coco decorado con lima",
      "en": "Glass of frosted coconut limeade with lime garnish",
      "pt": "Copo de limonada de coco gelada com limão",
      "fr": "Verre de limonade coco glacée avec rondelle de citron",
      "ja": "ライムを飾った冷たいココナッツライムジュース"
    },
    "fallbackEmoji": "🥥",
    "branchId": "br-sora-co-zonag"
  },
  {
    "id": "br-aura-br-pinheiros-dish-br-aura-01",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "starters",
    "name": {
      "es": "Dadinhos de Tapioca con Miel de Caña y Pimienta",
      "en": "Crispy Tapioca Cubes with Spiced Cane Honey",
      "pt": "Dadinhos de Tapioca com Mel de Engenho e Pimenta",
      "fr": "Dés de tapioca croustillants et miel de canne pimenté",
      "ja": "タピオカとケージョ・コアーリョのサクサク角切り揚げ"
    },
    "description": {
      "es": "Cubos crujientes de tapioca y queso coalho artesanal, dorados y servidos con reducción de miel de caña.",
      "en": "Golden crispy cubes of cassava tapioca and artisanal coalho cheese, served with spiced cane syrup.",
      "pt": "Cubos crocantes de tapioca e queijo coalho artesanal, dourados e servidos com mel de engenho.",
      "fr": "Cubes dorés de tapioca et fromage brésilien coalho, servis avec une réduction de mélasse douce.",
      "ja": "キャッサバ芋のタピオカと伝統チーズを黄金色に揚げ、サトウキビ蜜ソースを添えた一品。"
    },
    "priceMinorUnits": 2800,
    "price": 28,
    "basePriceUSD": 5,
    "prepTimeMinutes": 12,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Dadinhos de tapioca dorados en plato de cerámica",
      "en": "Golden tapioca cheese cubes on ceramic plate",
      "pt": "Dadinhos de tapioca crocantes em prato de cerâmica",
      "fr": "Dés de tapioca dorés sur assiette en céramique",
      "ja": "陶器の皿に盛られた黄金色のタピオカキューブ"
    },
    "fallbackEmoji": "🧀",
    "branchId": "br-aura-br-pinheiros"
  },
  {
    "id": "br-aura-br-pinheiros-dish-br-aura-02",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "mains",
    "name": {
      "es": "Feijoada Completa da Casa com Farofa",
      "en": "Traditional Brazilian Black Bean Feijoada",
      "pt": "Feijoada Tradicional da Casa com Farofa e Couve",
      "fr": "Feijoada brésilienne complète et farofa",
      "ja": "ブラジル伝統のフェイジョアーダ（黒豆と豚肉の煮込み）"
    },
    "description": {
      "es": "Guiso lento de frijoles negros con cortes selectos de cerdo y res curada, acompañado de arroz, farofa, col salteada y naranja.",
      "en": "Slow-simmered black bean stew with cured beef and pork cuts, served with farofa, garlicky collard greens and rice.",
      "pt": "Feijão preto com carnes nobres curadas, servido com arroz branco, farofa na manteiga, couve refogada e laranja.",
      "fr": "Mijoté de haricots noirs et viandes fumées, servi avec riz blanc, farofa au beurre et chou vert émincé.",
      "ja": "厳選した牛肉と豚肉を黒豆とじっくり煮込んだブラジルの国民食。キャッサバ粉とケール添え。"
    },
    "priceMinorUnits": 6800,
    "price": 68,
    "basePriceUSD": 12.14,
    "prepTimeMinutes": 20,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Cazuela de feijoada tradicional con acompañamientos",
      "en": "Traditional feijoada casserole with side dishes",
      "pt": "Cumbuca de feijoada fumegante com acompanhamentos",
      "fr": "Cassolette de feijoada fumante et ses garnitures",
      "ja": "黒豆と肉が煮込まれた本場のフェイジョアーダ"
    },
    "fallbackEmoji": "🍲",
    "branchId": "br-aura-br-pinheiros"
  },
  {
    "id": "br-aura-br-pinheiros-dish-br-aura-03",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "mains",
    "name": {
      "es": "Picanha Nobre Grelhada com Vinagrete",
      "en": "Prime Grilled Picanha with Farofa & Vinaigrette",
      "pt": "Picanha Nobre na Brasa com Farofa de Ovos",
      "fr": "Picanha de bœuf braisée, farofa aux œufs",
      "ja": "極上牛イチボ肉（ピカーニャ）の炭火シュラスコ焼き"
    },
    "description": {
      "es": "Corte noble a la parrilla con capa crujiente de sal marina, acompañado de farofa de huevos, vinagreta fresca y yuca frita.",
      "en": "Prime sirloin cap steak grilled over open flames, served with egg farofa, fresh tomato salsa and fried cassava.",
      "pt": "Corte nobre na brasa com crosta de sal grosso, farofa crocante de ovos, vinagrete fresca e mandioca frita.",
      "fr": "Aiguillette de rumsteck brésilienne grillée à la flamme, servie avec farofa aux œufs et manioc doré.",
      "ja": "表面を岩塩で香ばしく焼き上げた極上ピカーニャステーキ。キャッサバ芋フライ添え。"
    },
    "priceMinorUnits": 7900,
    "price": 79,
    "basePriceUSD": 14.1,
    "prepTimeMinutes": 18,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Cortes jugosos de picanha a la brasa con guarnición",
      "en": "Juicy sliced grilled picanha with sides",
      "pt": "Fatias suculentas de picanha na brasa",
      "fr": "Tranches juteuses de picanha grillée",
      "ja": "炭火で香ばしく焼き上がったピカーニャの断面"
    },
    "fallbackEmoji": "🥩",
    "branchId": "br-aura-br-pinheiros"
  },
  {
    "id": "br-aura-br-pinheiros-dish-br-aura-04",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "desserts",
    "name": {
      "es": "Pudim de Leite Condensado com Fava de Baunilha",
      "en": "Brazilian Caramel Milk Flan with Bourbon Vanilla",
      "pt": "Pudim de Leite Condensado Tradicional Lisinho",
      "fr": "Flan brésilien au lait caramélisé et vanille",
      "ja": "濃厚ブラジリアン・キャラメルプヂン（自家製プリン）"
    },
    "description": {
      "es": "Pudín brasileño ultra cremoso, sin burbujas, horneado a baño maría con caramelo brillante y vainilla natural.",
      "en": "Silky smooth Brazilian baked milk custard flan bathed in rich amber caramel and Madagascar vanilla.",
      "pt": "Pudim de textura impecável e aveludada, sem furinhos, banhado em calda dourada de caramelo artesanal.",
      "fr": "Flan pâtissier au lait concentré d’une texture soyeuse parfaite, nappé de caramel blond ambré.",
      "ja": "すが入らないよう低温湯煎で滑らかに焼き上げた、濃厚でコク深いブラジル風プリン。"
    },
    "priceMinorUnits": 2200,
    "price": 22,
    "basePriceUSD": 3.92,
    "prepTimeMinutes": 8,
    "available": true,
    "image": "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Porción de pudim de leche bañado en caramelo dorado",
      "en": "Slice of Brazilian milk flan with caramel glaze",
      "pt": "Fatia de pudim de leite com calda brilhante",
      "fr": "Part de flan nappée de caramel liquide",
      "ja": "艶やかなカラメルソースがかかった濃厚プヂン"
    },
    "fallbackEmoji": "🍮",
    "branchId": "br-aura-br-pinheiros"
  },
  {
    "id": "br-aura-br-pinheiros-dish-br-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Prato Feito Paulistano com Filé de Frango na Brasa",
      "en": "Lunch of the Day: Brazilian Prato Feito with Grilled Chicken",
      "pt": "Almoço do Dia: Prato Feito com Filé de Frango Grelhado, Arroz e Feijão",
      "fr": "Plat du jour midi: Assiette traditionnelle au poulet grillé et haricots",
      "ja": "本日のおすすめランチ：サンパウロ風プラット・フェイト（若鶏のグリル定食）"
    },
    "description": {
      "es": "El clásico almuerzo brasileño: pechuga marinada a la plancha, arroz blanco, frijoles carioca caldosos, farofa crocante y ensalada.",
      "en": "The classic daily Brazilian lunch: grilled chicken breast, white rice, seasoned carioca beans, farofa and greens.",
      "pt": "O autêntico PF paulistano: filé de frango grelhado macio, arroz agulhinha, feijão carioca fresquinho, farofa crocante e salada.",
      "fr": "L’incontournable déjeuner brésilien: filet de poulet grillé, riz blanc, haricots mijotés, farofa et salade verte.",
      "ja": "柔らかい若鶏のグリル、炊きたてご飯、カリオカ豆のスープ、香ばしいファロッファとサラダの定番定食。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 4.62,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Prato feito brasileño con arroz, frijoles y pollo",
      "en": "Classic Brazilian plate with rice, beans and chicken",
      "pt": "Prato feito clássico com arroz, feijão e frango grelhado",
      "fr": "Assiette brésilienne avec riz, haricots et volaille",
      "ja": "ご飯と豆スープ、鶏肉が並ぶ伝統のプラットフェイト"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-br-pinheiros"
  },
  {
    "id": "br-aura-br-pinheiros-dish-br-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "drinks",
    "name": {
      "es": "Suco de Cajú e Maracujá Fresco",
      "en": "Fresh Brazilian Cashew & Passionfruit Juice",
      "pt": "Suco Natural de Caju com Maracujá",
      "fr": "Jus naturel de fruit de cajou et fruit de la passion",
      "ja": "生カシュー果実とパッションフルーツのフレッシュジュース"
    },
    "description": {
      "es": "Jugo natural preparado al momento con pulpa fresca de cajú brasileño, maracuyá aromático y hojas de menta.",
      "en": "Refreshing fresh-pressed juice blending natural cashew fruit pulp, tart passionfruit and fresh mint leaves.",
      "pt": "Suco 100% natural batido com polpa fresca de caju, maracujá da época e folhas de hortelã.",
      "fr": "Jus pressé minute mariant la douceur de la pomme de cajou et l’acidité parfumée du fruit de la passion.",
      "ja": "熱帯の生カシュー果実とパッションフルーツを贅沢に絞った、爽やかな果汁100%ジュース。"
    },
    "priceMinorUnits": 1500,
    "price": 15,
    "basePriceUSD": 2.68,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de jugo natural helado de frutas tropicales",
      "en": "Iced natural tropical fruit juice glass",
      "pt": "Copo de suco natural gelado de frutas tropicais",
      "fr": "Verre de jus de fruits tropicaux frais et glaçons",
      "ja": "氷の入った冷たいトロピカルフルーツジュース"
    },
    "fallbackEmoji": "🍹",
    "branchId": "br-aura-br-pinheiros"
  },
  {
    "id": "br-aura-br-pinheiros-dish-br-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Prato Feito Paulistano com Filé de Frango na Brasa",
      "en": "Lunch of the Day: Brazilian Prato Feito with Grilled Chicken",
      "pt": "Almoço do Dia: Prato Feito com Filé de Frango Grelhado, Arroz e Feijão",
      "fr": "Plat du jour midi: Assiette traditionnelle au poulet grillé et haricots",
      "ja": "本日のおすすめランチ：サンパウロ風プラット・フェイト（若鶏のグリル定食）"
    },
    "description": {
      "es": "El clásico almuerzo brasileño: pechuga marinada a la plancha, arroz blanco, frijoles carioca caldosos, farofa crocante y ensalada.",
      "en": "The classic daily Brazilian lunch: grilled chicken breast, white rice, seasoned carioca beans, farofa and greens.",
      "pt": "O autêntico PF paulistano: filé de frango grelhado macio, arroz agulhinha, feijão carioca fresquinho, farofa crocante e salada.",
      "fr": "L’incontournable déjeuner brésilien: filet de poulet grillé, riz blanc, haricots mijotés, farofa et salade verte.",
      "ja": "柔らかい若鶏のグリル、炊きたてご飯、カリオカ豆のスープ、香ばしいファロッファとサラダの定番定食。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 4.62,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Prato feito brasileño con arroz, frijoles y pollo",
      "en": "Classic Brazilian plate with rice, beans and chicken",
      "pt": "Prato feito clássico com arroz, feijão e frango grelhado",
      "fr": "Assiette brésilienne avec riz, haricots et volaille",
      "ja": "ご飯と豆スープ、鶏肉が並ぶ伝統のプラットフェイト"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-br-pinheiros"
  },
  {
    "id": "br-aura-br-pinheiros-dish-br-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "drinks",
    "name": {
      "es": "Suco de Cajú e Maracujá Fresco",
      "en": "Fresh Brazilian Cashew & Passionfruit Juice",
      "pt": "Suco Natural de Caju com Maracujá",
      "fr": "Jus naturel de fruit de cajou et fruit de la passion",
      "ja": "生カシュー果実とパッションフルーツのフレッシュジュース"
    },
    "description": {
      "es": "Jugo natural preparado al momento con pulpa fresca de cajú brasileño, maracuyá aromático y hojas de menta.",
      "en": "Refreshing fresh-pressed juice blending natural cashew fruit pulp, tart passionfruit and fresh mint leaves.",
      "pt": "Suco 100% natural batido com polpa fresca de caju, maracujá da época e folhas de hortelã.",
      "fr": "Jus pressé minute mariant la douceur de la pomme de cajou et l’acidité parfumée du fruit de la passion.",
      "ja": "熱帯の生カシュー果実とパッションフルーツを贅沢に絞った、爽やかな果汁100%ジュース。"
    },
    "priceMinorUnits": 1500,
    "price": 15,
    "basePriceUSD": 2.68,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de jugo natural helado de frutas tropicales",
      "en": "Iced natural tropical fruit juice glass",
      "pt": "Copo de suco natural gelado de frutas tropicais",
      "fr": "Verre de jus de fruits tropicaux frais et glaçons",
      "ja": "氷の入った冷たいトロピカルフルーツジュース"
    },
    "fallbackEmoji": "🍹",
    "branchId": "br-aura-br-pinheiros"
  },
  {
    "id": "br-aura-br-jardins-dish-br-aura-01",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "starters",
    "name": {
      "es": "Dadinhos de Tapioca con Miel de Caña y Pimienta",
      "en": "Crispy Tapioca Cubes with Spiced Cane Honey",
      "pt": "Dadinhos de Tapioca com Mel de Engenho e Pimenta",
      "fr": "Dés de tapioca croustillants et miel de canne pimenté",
      "ja": "タピオカとケージョ・コアーリョのサクサク角切り揚げ"
    },
    "description": {
      "es": "Cubos crujientes de tapioca y queso coalho artesanal, dorados y servidos con reducción de miel de caña.",
      "en": "Golden crispy cubes of cassava tapioca and artisanal coalho cheese, served with spiced cane syrup.",
      "pt": "Cubos crocantes de tapioca e queijo coalho artesanal, dourados e servidos com mel de engenho.",
      "fr": "Cubes dorés de tapioca et fromage brésilien coalho, servis avec une réduction de mélasse douce.",
      "ja": "キャッサバ芋のタピオカと伝統チーズを黄金色に揚げ、サトウキビ蜜ソースを添えた一品。"
    },
    "priceMinorUnits": 2800,
    "price": 28,
    "basePriceUSD": 5,
    "prepTimeMinutes": 12,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Dadinhos de tapioca dorados en plato de cerámica",
      "en": "Golden tapioca cheese cubes on ceramic plate",
      "pt": "Dadinhos de tapioca crocantes em prato de cerâmica",
      "fr": "Dés de tapioca dorés sur assiette en céramique",
      "ja": "陶器の皿に盛られた黄金色のタピオカキューブ"
    },
    "fallbackEmoji": "🧀",
    "branchId": "br-aura-br-jardins"
  },
  {
    "id": "br-aura-br-jardins-dish-br-aura-02",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "mains",
    "name": {
      "es": "Feijoada Completa da Casa com Farofa",
      "en": "Traditional Brazilian Black Bean Feijoada",
      "pt": "Feijoada Tradicional da Casa com Farofa e Couve",
      "fr": "Feijoada brésilienne complète et farofa",
      "ja": "ブラジル伝統のフェイジョアーダ（黒豆と豚肉の煮込み）"
    },
    "description": {
      "es": "Guiso lento de frijoles negros con cortes selectos de cerdo y res curada, acompañado de arroz, farofa, col salteada y naranja.",
      "en": "Slow-simmered black bean stew with cured beef and pork cuts, served with farofa, garlicky collard greens and rice.",
      "pt": "Feijão preto com carnes nobres curadas, servido com arroz branco, farofa na manteiga, couve refogada e laranja.",
      "fr": "Mijoté de haricots noirs et viandes fumées, servi avec riz blanc, farofa au beurre et chou vert émincé.",
      "ja": "厳選した牛肉と豚肉を黒豆とじっくり煮込んだブラジルの国民食。キャッサバ粉とケール添え。"
    },
    "priceMinorUnits": 6800,
    "price": 68,
    "basePriceUSD": 12.14,
    "prepTimeMinutes": 20,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Cazuela de feijoada tradicional con acompañamientos",
      "en": "Traditional feijoada casserole with side dishes",
      "pt": "Cumbuca de feijoada fumegante com acompanhamentos",
      "fr": "Cassolette de feijoada fumante et ses garnitures",
      "ja": "黒豆と肉が煮込まれた本場のフェイジョアーダ"
    },
    "fallbackEmoji": "🍲",
    "branchId": "br-aura-br-jardins"
  },
  {
    "id": "br-aura-br-jardins-dish-br-aura-03",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "mains",
    "name": {
      "es": "Picanha Nobre Grelhada com Vinagrete",
      "en": "Prime Grilled Picanha with Farofa & Vinaigrette",
      "pt": "Picanha Nobre na Brasa com Farofa de Ovos",
      "fr": "Picanha de bœuf braisée, farofa aux œufs",
      "ja": "極上牛イチボ肉（ピカーニャ）の炭火シュラスコ焼き"
    },
    "description": {
      "es": "Corte noble a la parrilla con capa crujiente de sal marina, acompañado de farofa de huevos, vinagreta fresca y yuca frita.",
      "en": "Prime sirloin cap steak grilled over open flames, served with egg farofa, fresh tomato salsa and fried cassava.",
      "pt": "Corte nobre na brasa com crosta de sal grosso, farofa crocante de ovos, vinagrete fresca e mandioca frita.",
      "fr": "Aiguillette de rumsteck brésilienne grillée à la flamme, servie avec farofa aux œufs et manioc doré.",
      "ja": "表面を岩塩で香ばしく焼き上げた極上ピカーニャステーキ。キャッサバ芋フライ添え。"
    },
    "priceMinorUnits": 7900,
    "price": 79,
    "basePriceUSD": 14.1,
    "prepTimeMinutes": 18,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Cortes jugosos de picanha a la brasa con guarnición",
      "en": "Juicy sliced grilled picanha with sides",
      "pt": "Fatias suculentas de picanha na brasa",
      "fr": "Tranches juteuses de picanha grillée",
      "ja": "炭火で香ばしく焼き上がったピカーニャの断面"
    },
    "fallbackEmoji": "🥩",
    "branchId": "br-aura-br-jardins"
  },
  {
    "id": "br-aura-br-jardins-dish-br-aura-04",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "desserts",
    "name": {
      "es": "Pudim de Leite Condensado com Fava de Baunilha",
      "en": "Brazilian Caramel Milk Flan with Bourbon Vanilla",
      "pt": "Pudim de Leite Condensado Tradicional Lisinho",
      "fr": "Flan brésilien au lait caramélisé et vanille",
      "ja": "濃厚ブラジリアン・キャラメルプヂン（自家製プリン）"
    },
    "description": {
      "es": "Pudín brasileño ultra cremoso, sin burbujas, horneado a baño maría con caramelo brillante y vainilla natural.",
      "en": "Silky smooth Brazilian baked milk custard flan bathed in rich amber caramel and Madagascar vanilla.",
      "pt": "Pudim de textura impecável e aveludada, sem furinhos, banhado em calda dourada de caramelo artesanal.",
      "fr": "Flan pâtissier au lait concentré d’une texture soyeuse parfaite, nappé de caramel blond ambré.",
      "ja": "すが入らないよう低温湯煎で滑らかに焼き上げた、濃厚でコク深いブラジル風プリン。"
    },
    "priceMinorUnits": 2200,
    "price": 22,
    "basePriceUSD": 3.92,
    "prepTimeMinutes": 8,
    "available": true,
    "image": "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Porción de pudim de leche bañado en caramelo dorado",
      "en": "Slice of Brazilian milk flan with caramel glaze",
      "pt": "Fatia de pudim de leite com calda brilhante",
      "fr": "Part de flan nappée de caramel liquide",
      "ja": "艶やかなカラメルソースがかかった濃厚プヂン"
    },
    "fallbackEmoji": "🍮",
    "branchId": "br-aura-br-jardins"
  },
  {
    "id": "br-aura-br-jardins-dish-br-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Prato Feito Paulistano com Filé de Frango na Brasa",
      "en": "Lunch of the Day: Brazilian Prato Feito with Grilled Chicken",
      "pt": "Almoço do Dia: Prato Feito com Filé de Frango Grelhado, Arroz e Feijão",
      "fr": "Plat du jour midi: Assiette traditionnelle au poulet grillé et haricots",
      "ja": "本日のおすすめランチ：サンパウロ風プラット・フェイト（若鶏のグリル定食）"
    },
    "description": {
      "es": "El clásico almuerzo brasileño: pechuga marinada a la plancha, arroz blanco, frijoles carioca caldosos, farofa crocante y ensalada.",
      "en": "The classic daily Brazilian lunch: grilled chicken breast, white rice, seasoned carioca beans, farofa and greens.",
      "pt": "O autêntico PF paulistano: filé de frango grelhado macio, arroz agulhinha, feijão carioca fresquinho, farofa crocante e salada.",
      "fr": "L’incontournable déjeuner brésilien: filet de poulet grillé, riz blanc, haricots mijotés, farofa et salade verte.",
      "ja": "柔らかい若鶏のグリル、炊きたてご飯、カリオカ豆のスープ、香ばしいファロッファとサラダの定番定食。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 4.62,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Prato feito brasileño con arroz, frijoles y pollo",
      "en": "Classic Brazilian plate with rice, beans and chicken",
      "pt": "Prato feito clássico com arroz, feijão e frango grelhado",
      "fr": "Assiette brésilienne avec riz, haricots et volaille",
      "ja": "ご飯と豆スープ、鶏肉が並ぶ伝統のプラットフェイト"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-br-jardins"
  },
  {
    "id": "br-aura-br-jardins-dish-br-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "drinks",
    "name": {
      "es": "Suco de Cajú e Maracujá Fresco",
      "en": "Fresh Brazilian Cashew & Passionfruit Juice",
      "pt": "Suco Natural de Caju com Maracujá",
      "fr": "Jus naturel de fruit de cajou et fruit de la passion",
      "ja": "生カシュー果実とパッションフルーツのフレッシュジュース"
    },
    "description": {
      "es": "Jugo natural preparado al momento con pulpa fresca de cajú brasileño, maracuyá aromático y hojas de menta.",
      "en": "Refreshing fresh-pressed juice blending natural cashew fruit pulp, tart passionfruit and fresh mint leaves.",
      "pt": "Suco 100% natural batido com polpa fresca de caju, maracujá da época e folhas de hortelã.",
      "fr": "Jus pressé minute mariant la douceur de la pomme de cajou et l’acidité parfumée du fruit de la passion.",
      "ja": "熱帯の生カシュー果実とパッションフルーツを贅沢に絞った、爽やかな果汁100%ジュース。"
    },
    "priceMinorUnits": 1500,
    "price": 15,
    "basePriceUSD": 2.68,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de jugo natural helado de frutas tropicales",
      "en": "Iced natural tropical fruit juice glass",
      "pt": "Copo de suco natural gelado de frutas tropicais",
      "fr": "Verre de jus de fruits tropicaux frais et glaçons",
      "ja": "氷の入った冷たいトロピカルフルーツジュース"
    },
    "fallbackEmoji": "🍹",
    "branchId": "br-aura-br-jardins"
  },
  {
    "id": "br-aura-br-jardins-dish-br-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Prato Feito Paulistano com Filé de Frango na Brasa",
      "en": "Lunch of the Day: Brazilian Prato Feito with Grilled Chicken",
      "pt": "Almoço do Dia: Prato Feito com Filé de Frango Grelhado, Arroz e Feijão",
      "fr": "Plat du jour midi: Assiette traditionnelle au poulet grillé et haricots",
      "ja": "本日のおすすめランチ：サンパウロ風プラット・フェイト（若鶏のグリル定食）"
    },
    "description": {
      "es": "El clásico almuerzo brasileño: pechuga marinada a la plancha, arroz blanco, frijoles carioca caldosos, farofa crocante y ensalada.",
      "en": "The classic daily Brazilian lunch: grilled chicken breast, white rice, seasoned carioca beans, farofa and greens.",
      "pt": "O autêntico PF paulistano: filé de frango grelhado macio, arroz agulhinha, feijão carioca fresquinho, farofa crocante e salada.",
      "fr": "L’incontournable déjeuner brésilien: filet de poulet grillé, riz blanc, haricots mijotés, farofa et salade verte.",
      "ja": "柔らかい若鶏のグリル、炊きたてご飯、カリオカ豆のスープ、香ばしいファロッファとサラダの定番定食。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 4.62,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Prato feito brasileño con arroz, frijoles y pollo",
      "en": "Classic Brazilian plate with rice, beans and chicken",
      "pt": "Prato feito clássico com arroz, feijão e frango grelhado",
      "fr": "Assiette brésilienne avec riz, haricots et volaille",
      "ja": "ご飯と豆スープ、鶏肉が並ぶ伝統のプラットフェイト"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-br-jardins"
  },
  {
    "id": "br-aura-br-jardins-dish-br-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "drinks",
    "name": {
      "es": "Suco de Cajú e Maracujá Fresco",
      "en": "Fresh Brazilian Cashew & Passionfruit Juice",
      "pt": "Suco Natural de Caju com Maracujá",
      "fr": "Jus naturel de fruit de cajou et fruit de la passion",
      "ja": "生カシュー果実とパッションフルーツのフレッシュジュース"
    },
    "description": {
      "es": "Jugo natural preparado al momento con pulpa fresca de cajú brasileño, maracuyá aromático y hojas de menta.",
      "en": "Refreshing fresh-pressed juice blending natural cashew fruit pulp, tart passionfruit and fresh mint leaves.",
      "pt": "Suco 100% natural batido com polpa fresca de caju, maracujá da época e folhas de hortelã.",
      "fr": "Jus pressé minute mariant la douceur de la pomme de cajou et l’acidité parfumée du fruit de la passion.",
      "ja": "熱帯の生カシュー果実とパッションフルーツを贅沢に絞った、爽やかな果汁100%ジュース。"
    },
    "priceMinorUnits": 1500,
    "price": 15,
    "basePriceUSD": 2.68,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de jugo natural helado de frutas tropicales",
      "en": "Iced natural tropical fruit juice glass",
      "pt": "Copo de suco natural gelado de frutas tropicais",
      "fr": "Verre de jus de fruits tropicaux frais et glaçons",
      "ja": "氷の入った冷たいトロピカルフルーツジュース"
    },
    "fallbackEmoji": "🍹",
    "branchId": "br-aura-br-jardins"
  },
  {
    "id": "br-sora-br-liberdade-dish-br-sora-01",
    "restaurantId": "brand-sora",
    "countryCode": "BR",
    "category": "starters",
    "name": {
      "es": "Ceviche Paulistano de Robalo e Caju",
      "en": "Sao Paulo Sea Bass Ceviche with Fresh Cashew Fruit",
      "pt": "Ceviche Paulistano de Robalo com Caju Fresco",
      "fr": "Ceviche de bar pauliste à la pomme de cajou",
      "ja": "スズキと生カシューフルーツのサンパウロ風セビーチェ"
    },
    "description": {
      "es": "Robalo salvaje marinado en lima y jengibre con dados de cajú fresco, cebolla morada y crujiente de maíz.",
      "en": "Fresh wild sea bass cured in lime juice and ginger, tossed with sweet cashew fruit cubes and red onions.",
      "pt": "Robalo fresco curado no limão-cravo com cubos de caju, cebola roxa e pimenta dedo-de-moça.",
      "fr": "Bar frais mariné au citron vert et gingembre, dés de pomme de cajou et oignons rouges doux.",
      "ja": "新鮮なスズキにブラジル産生カシュー果実と赤玉ねぎ、ライム果汁を合わせた創作前菜。"
    },
    "priceMinorUnits": 4200,
    "price": 42,
    "basePriceUSD": 7.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1535400255456-984241443b29?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de ceviche fresco con cajú y cilantro",
      "en": "Bowl of fresh sea bass ceviche with herbs",
      "pt": "Tigela de ceviche fresco de robalo e caju",
      "fr": "Bol de ceviche de poisson frais aux herbes",
      "ja": "ハーブとフルーツを添えた爽やかなセビーチェ"
    },
    "fallbackEmoji": "🐟",
    "branchId": "br-sora-br-liberdade"
  },
  {
    "id": "br-sora-br-liberdade-dish-br-sora-02",
    "restaurantId": "brand-sora",
    "countryCode": "BR",
    "category": "mains",
    "name": {
      "es": "Combinado Sora Nikkei São Paulo (16 Piezas)",
      "en": "Sora Nikkei Sushi Combination (16 Pcs)",
      "pt": "Combinado Sora Nikkei São Paulo (16 Peças)",
      "fr": "Assortiment Sora Nikkei São Paulo (16 pièces)",
      "ja": "宙 (Sora) 日系握り・巻き寿司盛り合わせ（16貫）"
    },
    "description": {
      "es": "Selección de sashimis de atún rojo, nigiris de salmón trufado con raspaduras de lima y uramakis especiales.",
      "en": "Selection of bluefin tuna sashimi, seared truffle salmon nigiri with lime zest, and specialty rolls.",
      "pt": "Sashimis de atum fresco, nigiris de salmão trufado maçaricado com raspas de limão e rolls autorais.",
      "fr": "Sélection de sashimis de thon rouge, nigiris de saumon truffé et rolls spéciaux d’inspiration nippo-brésilienne.",
      "ja": "リベルダーデ伝統の日系技術。本マグロ、トリュフ炙りサーモン、特製ロールの上品な盛り合わせ。"
    },
    "priceMinorUnits": 8900,
    "price": 89,
    "basePriceUSD": 15.89,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato refinado de sushi y sashimi variado",
      "en": "Refined platter of assorted sushi and sashimi",
      "pt": "Prato refinado de sushis e sashimis variados",
      "fr": "Plateau gastronomique de sushis et sashimis",
      "ja": "厳選鮮魚の寿司と刺身の盛り合わせプレート"
    },
    "fallbackEmoji": "🍣",
    "branchId": "br-sora-br-liberdade"
  },
  {
    "id": "br-sora-br-liberdade-dish-br-sora-03",
    "restaurantId": "brand-sora",
    "countryCode": "BR",
    "category": "mains",
    "name": {
      "es": "Tonkotsu Ramen Liberdade Especial",
      "en": "Liberdade Rich Tonkotsu Pork Ramen",
      "pt": "Tonkotsu Ramen Especial do Bairro Liberdade",
      "fr": "Ramen Tonkotsu au bouillon riche de Liberdade",
      "ja": "リベルダーデ仕込み 濃厚豚骨特製ラーメン"
    },
    "description": {
      "es": "Caldo de cerdo cocido por 20 horas en tetera tradicional, panceta braseada chashu, huevo marinado y alga nori.",
      "en": "20-hour velvety pork bone broth, tender chashu pork belly, seasoned ramen egg, menma and nori.",
      "pt": "Caldo denso de ossos suínos cozido por 20 horas, barriga de porco braseada, ovo caipira marinado e nori.",
      "fr": "Bouillon tonkotsu mijoté 20h, poitrine de porc braisée, œuf mariné tamago et feuille de nori.",
      "ja": "20時間丁寧に煮出した極上豚骨白湯スープ。とろける豚バラチャーシューと煮玉子をトッピング。"
    },
    "priceMinorUnits": 5800,
    "price": 58,
    "basePriceUSD": 10.35,
    "prepTimeMinutes": 14,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de tonkotsu ramen con caldo espeso y chashu",
      "en": "Bowl of tonkotsu ramen with thick broth and pork",
      "pt": "Tigela de tonkotsu ramen com caldo rico",
      "fr": "Bol de ramen tonkotsu au bouillon onctueux",
      "ja": "極厚チャーシューが乗った濃厚豚骨ラーメン"
    },
    "fallbackEmoji": "🍜",
    "branchId": "br-sora-br-liberdade"
  },
  {
    "id": "br-sora-br-liberdade-dish-br-sora-04",
    "restaurantId": "brand-sora",
    "countryCode": "BR",
    "category": "desserts",
    "name": {
      "es": "Choux Cream de Açaí y Chocolate Amazónico",
      "en": "Amazonian Acai & Dark Chocolate Choux Cream",
      "pt": "Choux Cream de Açaí com Chocolate Amazônico",
      "fr": "Choux croustillant à l’açaï et chocolat d’Amazonie",
      "ja": "アマゾンアサイーと特製ショコラのシュークリーム"
    },
    "description": {
      "es": "Masa choux crujiente rellena de crema pastelera ligera de açaí silvestre y ganache de chocolate 70% de Bahía.",
      "en": "Crisp French-Japanese choux pastry filled with wild acai custard and 70% Bahia dark chocolate ganache.",
      "pt": "Massa choux crocante recheada com creme aveludado de açaí puro e ganache de chocolate 70% da Bahia.",
      "fr": "Pâte à choux craquelin garnie d’une crème légère à l’açaï sauvage et ganache au chocolat 70%.",
      "ja": "サクサクのシュー生地にアマゾン直輸入のアサイークリームとバイーア産ビターチョコを絞った洋菓子。"
    },
    "priceMinorUnits": 2600,
    "price": 26,
    "basePriceUSD": 4.64,
    "prepTimeMinutes": 7,
    "available": true,
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Choux cream con cobertura craquelada y relleno de chocolate",
      "en": "Craquelin choux cream filled with rich pastry cream",
      "pt": "Choux cream com crosta crocante e recheio cremoso",
      "fr": "Chou pâtissier au craquelin et crème onctueuse",
      "ja": "香ばしいクッキーシュークリームの断面"
    },
    "fallbackEmoji": "🧁",
    "branchId": "br-sora-br-liberdade"
  },
  {
    "id": "br-sora-br-liberdade-dish-br-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Prato Feito Paulistano com Filé de Frango na Brasa",
      "en": "Lunch of the Day: Brazilian Prato Feito with Grilled Chicken",
      "pt": "Almoço do Dia: Prato Feito com Filé de Frango Grelhado, Arroz e Feijão",
      "fr": "Plat du jour midi: Assiette traditionnelle au poulet grillé et haricots",
      "ja": "本日のおすすめランチ：サンパウロ風プラット・フェイト（若鶏のグリル定食）"
    },
    "description": {
      "es": "El clásico almuerzo brasileño: pechuga marinada a la plancha, arroz blanco, frijoles carioca caldosos, farofa crocante y ensalada.",
      "en": "The classic daily Brazilian lunch: grilled chicken breast, white rice, seasoned carioca beans, farofa and greens.",
      "pt": "O autêntico PF paulistano: filé de frango grelhado macio, arroz agulhinha, feijão carioca fresquinho, farofa crocante e salada.",
      "fr": "L’incontournable déjeuner brésilien: filet de poulet grillé, riz blanc, haricots mijotés, farofa et salade verte.",
      "ja": "柔らかい若鶏のグリル、炊きたてご飯、カリオカ豆のスープ、香ばしいファロッファとサラダの定番定食。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 4.62,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Prato feito brasileño con arroz, frijoles y pollo",
      "en": "Classic Brazilian plate with rice, beans and chicken",
      "pt": "Prato feito clássico com arroz, feijão e frango grelhado",
      "fr": "Assiette brésilienne avec riz, haricots et volaille",
      "ja": "ご飯と豆スープ、鶏肉が並ぶ伝統のプラットフェイト"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-sora-br-liberdade"
  },
  {
    "id": "br-sora-br-liberdade-dish-br-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "drinks",
    "name": {
      "es": "Suco de Cajú e Maracujá Fresco",
      "en": "Fresh Brazilian Cashew & Passionfruit Juice",
      "pt": "Suco Natural de Caju com Maracujá",
      "fr": "Jus naturel de fruit de cajou et fruit de la passion",
      "ja": "生カシュー果実とパッションフルーツのフレッシュジュース"
    },
    "description": {
      "es": "Jugo natural preparado al momento con pulpa fresca de cajú brasileño, maracuyá aromático y hojas de menta.",
      "en": "Refreshing fresh-pressed juice blending natural cashew fruit pulp, tart passionfruit and fresh mint leaves.",
      "pt": "Suco 100% natural batido com polpa fresca de caju, maracujá da época e folhas de hortelã.",
      "fr": "Jus pressé minute mariant la douceur de la pomme de cajou et l’acidité parfumée du fruit de la passion.",
      "ja": "熱帯の生カシュー果実とパッションフルーツを贅沢に絞った、爽やかな果汁100%ジュース。"
    },
    "priceMinorUnits": 1500,
    "price": 15,
    "basePriceUSD": 2.68,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de jugo natural helado de frutas tropicales",
      "en": "Iced natural tropical fruit juice glass",
      "pt": "Copo de suco natural gelado de frutas tropicais",
      "fr": "Verre de jus de fruits tropicaux frais et glaçons",
      "ja": "氷の入った冷たいトロピカルフルーツジュース"
    },
    "fallbackEmoji": "🍹",
    "branchId": "br-sora-br-liberdade"
  },
  {
    "id": "br-sora-br-itaim-dish-br-sora-01",
    "restaurantId": "brand-sora",
    "countryCode": "BR",
    "category": "starters",
    "name": {
      "es": "Ceviche Paulistano de Robalo e Caju",
      "en": "Sao Paulo Sea Bass Ceviche with Fresh Cashew Fruit",
      "pt": "Ceviche Paulistano de Robalo com Caju Fresco",
      "fr": "Ceviche de bar pauliste à la pomme de cajou",
      "ja": "スズキと生カシューフルーツのサンパウロ風セビーチェ"
    },
    "description": {
      "es": "Robalo salvaje marinado en lima y jengibre con dados de cajú fresco, cebolla morada y crujiente de maíz.",
      "en": "Fresh wild sea bass cured in lime juice and ginger, tossed with sweet cashew fruit cubes and red onions.",
      "pt": "Robalo fresco curado no limão-cravo com cubos de caju, cebola roxa e pimenta dedo-de-moça.",
      "fr": "Bar frais mariné au citron vert et gingembre, dés de pomme de cajou et oignons rouges doux.",
      "ja": "新鮮なスズキにブラジル産生カシュー果実と赤玉ねぎ、ライム果汁を合わせた創作前菜。"
    },
    "priceMinorUnits": 4200,
    "price": 42,
    "basePriceUSD": 7.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1535400255456-984241443b29?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de ceviche fresco con cajú y cilantro",
      "en": "Bowl of fresh sea bass ceviche with herbs",
      "pt": "Tigela de ceviche fresco de robalo e caju",
      "fr": "Bol de ceviche de poisson frais aux herbes",
      "ja": "ハーブとフルーツを添えた爽やかなセビーチェ"
    },
    "fallbackEmoji": "🐟",
    "branchId": "br-sora-br-itaim"
  },
  {
    "id": "br-sora-br-itaim-dish-br-sora-02",
    "restaurantId": "brand-sora",
    "countryCode": "BR",
    "category": "mains",
    "name": {
      "es": "Combinado Sora Nikkei São Paulo (16 Piezas)",
      "en": "Sora Nikkei Sushi Combination (16 Pcs)",
      "pt": "Combinado Sora Nikkei São Paulo (16 Peças)",
      "fr": "Assortiment Sora Nikkei São Paulo (16 pièces)",
      "ja": "宙 (Sora) 日系握り・巻き寿司盛り合わせ（16貫）"
    },
    "description": {
      "es": "Selección de sashimis de atún rojo, nigiris de salmón trufado con raspaduras de lima y uramakis especiales.",
      "en": "Selection of bluefin tuna sashimi, seared truffle salmon nigiri with lime zest, and specialty rolls.",
      "pt": "Sashimis de atum fresco, nigiris de salmão trufado maçaricado com raspas de limão e rolls autorais.",
      "fr": "Sélection de sashimis de thon rouge, nigiris de saumon truffé et rolls spéciaux d’inspiration nippo-brésilienne.",
      "ja": "リベルダーデ伝統の日系技術。本マグロ、トリュフ炙りサーモン、特製ロールの上品な盛り合わせ。"
    },
    "priceMinorUnits": 8900,
    "price": 89,
    "basePriceUSD": 15.89,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato refinado de sushi y sashimi variado",
      "en": "Refined platter of assorted sushi and sashimi",
      "pt": "Prato refinado de sushis e sashimis variados",
      "fr": "Plateau gastronomique de sushis et sashimis",
      "ja": "厳選鮮魚の寿司と刺身の盛り合わせプレート"
    },
    "fallbackEmoji": "🍣",
    "branchId": "br-sora-br-itaim"
  },
  {
    "id": "br-sora-br-itaim-dish-br-sora-03",
    "restaurantId": "brand-sora",
    "countryCode": "BR",
    "category": "mains",
    "name": {
      "es": "Tonkotsu Ramen Liberdade Especial",
      "en": "Liberdade Rich Tonkotsu Pork Ramen",
      "pt": "Tonkotsu Ramen Especial do Bairro Liberdade",
      "fr": "Ramen Tonkotsu au bouillon riche de Liberdade",
      "ja": "リベルダーデ仕込み 濃厚豚骨特製ラーメン"
    },
    "description": {
      "es": "Caldo de cerdo cocido por 20 horas en tetera tradicional, panceta braseada chashu, huevo marinado y alga nori.",
      "en": "20-hour velvety pork bone broth, tender chashu pork belly, seasoned ramen egg, menma and nori.",
      "pt": "Caldo denso de ossos suínos cozido por 20 horas, barriga de porco braseada, ovo caipira marinado e nori.",
      "fr": "Bouillon tonkotsu mijoté 20h, poitrine de porc braisée, œuf mariné tamago et feuille de nori.",
      "ja": "20時間丁寧に煮出した極上豚骨白湯スープ。とろける豚バラチャーシューと煮玉子をトッピング。"
    },
    "priceMinorUnits": 5800,
    "price": 58,
    "basePriceUSD": 10.35,
    "prepTimeMinutes": 14,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de tonkotsu ramen con caldo espeso y chashu",
      "en": "Bowl of tonkotsu ramen with thick broth and pork",
      "pt": "Tigela de tonkotsu ramen com caldo rico",
      "fr": "Bol de ramen tonkotsu au bouillon onctueux",
      "ja": "極厚チャーシューが乗った濃厚豚骨ラーメン"
    },
    "fallbackEmoji": "🍜",
    "branchId": "br-sora-br-itaim"
  },
  {
    "id": "br-sora-br-itaim-dish-br-sora-04",
    "restaurantId": "brand-sora",
    "countryCode": "BR",
    "category": "desserts",
    "name": {
      "es": "Choux Cream de Açaí y Chocolate Amazónico",
      "en": "Amazonian Acai & Dark Chocolate Choux Cream",
      "pt": "Choux Cream de Açaí com Chocolate Amazônico",
      "fr": "Choux croustillant à l’açaï et chocolat d’Amazonie",
      "ja": "アマゾンアサイーと特製ショコラのシュークリーム"
    },
    "description": {
      "es": "Masa choux crujiente rellena de crema pastelera ligera de açaí silvestre y ganache de chocolate 70% de Bahía.",
      "en": "Crisp French-Japanese choux pastry filled with wild acai custard and 70% Bahia dark chocolate ganache.",
      "pt": "Massa choux crocante recheada com creme aveludado de açaí puro e ganache de chocolate 70% da Bahia.",
      "fr": "Pâte à choux craquelin garnie d’une crème légère à l’açaï sauvage et ganache au chocolat 70%.",
      "ja": "サクサクのシュー生地にアマゾン直輸入のアサイークリームとバイーア産ビターチョコを絞った洋菓子。"
    },
    "priceMinorUnits": 2600,
    "price": 26,
    "basePriceUSD": 4.64,
    "prepTimeMinutes": 7,
    "available": true,
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Choux cream con cobertura craquelada y relleno de chocolate",
      "en": "Craquelin choux cream filled with rich pastry cream",
      "pt": "Choux cream com crosta crocante e recheio cremoso",
      "fr": "Chou pâtissier au craquelin et crème onctueuse",
      "ja": "香ばしいクッキーシュークリームの断面"
    },
    "fallbackEmoji": "🧁",
    "branchId": "br-sora-br-itaim"
  },
  {
    "id": "br-sora-br-itaim-dish-br-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Prato Feito Paulistano com Filé de Frango na Brasa",
      "en": "Lunch of the Day: Brazilian Prato Feito with Grilled Chicken",
      "pt": "Almoço do Dia: Prato Feito com Filé de Frango Grelhado, Arroz e Feijão",
      "fr": "Plat du jour midi: Assiette traditionnelle au poulet grillé et haricots",
      "ja": "本日のおすすめランチ：サンパウロ風プラット・フェイト（若鶏のグリル定食）"
    },
    "description": {
      "es": "El clásico almuerzo brasileño: pechuga marinada a la plancha, arroz blanco, frijoles carioca caldosos, farofa crocante y ensalada.",
      "en": "The classic daily Brazilian lunch: grilled chicken breast, white rice, seasoned carioca beans, farofa and greens.",
      "pt": "O autêntico PF paulistano: filé de frango grelhado macio, arroz agulhinha, feijão carioca fresquinho, farofa crocante e salada.",
      "fr": "L’incontournable déjeuner brésilien: filet de poulet grillé, riz blanc, haricots mijotés, farofa et salade verte.",
      "ja": "柔らかい若鶏のグリル、炊きたてご飯、カリオカ豆のスープ、香ばしいファロッファとサラダの定番定食。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 4.62,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Prato feito brasileño con arroz, frijoles y pollo",
      "en": "Classic Brazilian plate with rice, beans and chicken",
      "pt": "Prato feito clássico com arroz, feijão e frango grelhado",
      "fr": "Assiette brésilienne avec riz, haricots et volaille",
      "ja": "ご飯と豆スープ、鶏肉が並ぶ伝統のプラットフェイト"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-sora-br-itaim"
  },
  {
    "id": "br-sora-br-itaim-dish-br-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "BR",
    "category": "drinks",
    "name": {
      "es": "Suco de Cajú e Maracujá Fresco",
      "en": "Fresh Brazilian Cashew & Passionfruit Juice",
      "pt": "Suco Natural de Caju com Maracujá",
      "fr": "Jus naturel de fruit de cajou et fruit de la passion",
      "ja": "生カシュー果実とパッションフルーツのフレッシュジュース"
    },
    "description": {
      "es": "Jugo natural preparado al momento con pulpa fresca de cajú brasileño, maracuyá aromático y hojas de menta.",
      "en": "Refreshing fresh-pressed juice blending natural cashew fruit pulp, tart passionfruit and fresh mint leaves.",
      "pt": "Suco 100% natural batido com polpa fresca de caju, maracujá da época e folhas de hortelã.",
      "fr": "Jus pressé minute mariant la douceur de la pomme de cajou et l’acidité parfumée du fruit de la passion.",
      "ja": "熱帯の生カシュー果実とパッションフルーツを贅沢に絞った、爽やかな果汁100%ジュース。"
    },
    "priceMinorUnits": 1500,
    "price": 15,
    "basePriceUSD": 2.68,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de jugo natural helado de frutas tropicales",
      "en": "Iced natural tropical fruit juice glass",
      "pt": "Copo de suco natural gelado de frutas tropicais",
      "fr": "Verre de jus de fruits tropicaux frais et glaçons",
      "ja": "氷の入った冷たいトロピカルフルーツジュース"
    },
    "fallbackEmoji": "🍹",
    "branchId": "br-sora-br-itaim"
  },
  {
    "id": "br-aura-us-manhattan-dish-us-aura-01",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "starters",
    "name": {
      "es": "Tartar de Atún Rojo de Montauk con Aguacate",
      "en": "Montauk Yellowfin Tuna Tartare with Avocado",
      "pt": "Tartar de Atum de Montauk com Abacate",
      "fr": "Tartare de thon jaune de Montauk à l’avocat",
      "ja": "モントーク産キハダマグロとアボカドのタルタル"
    },
    "description": {
      "es": "Atún fresco de Long Island cortado a cuchillo con aguacate hass, vinagreta de sésamo y chips de yuca.",
      "en": "Hand-cut wild Montauk yellowfin tuna, smashed hass avocado, sesame-ginger dressing and taro crisps.",
      "pt": "Atum fresco selvagem cortado na ponta da faca com abacate hass e crocante de mandioca.",
      "fr": "Thon sauvage coupé au couteau, écrasé d’avocat hass, vinaigrette sésame-gingembre et chips de taro.",
      "ja": "ロングアイランド沖で獲れた鮮度の高いキハダマグロをアボカドと合わせた上品な前菜。"
    },
    "priceMinorUnits": 2200,
    "price": 22,
    "basePriceUSD": 22,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tartar de atún emplatado con sésamo y flores comestibles",
      "en": "Tuna tartare plated with sesame and microgreens",
      "pt": "Tartar de atum montado com gergelim",
      "fr": "Tartare de thon dressé avec graines de sésame",
      "ja": "マイクログリーンをあしらったマグロのタルタル"
    },
    "fallbackEmoji": "🐟",
    "branchId": "br-aura-us-manhattan"
  },
  {
    "id": "br-aura-us-manhattan-dish-us-aura-02",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "mains",
    "name": {
      "es": "Bife New York Strip Angus a las Brasas (12 oz)",
      "en": "Dry-Aged USDA Prime NY Strip Steak (12 oz)",
      "pt": "New York Strip Steak Angus Grelhado (340g)",
      "fr": "Faux-filet Black Angus NY Strip maturé (340g)",
      "ja": "プライム認定ブラックアンガス ニューヨークストリップステーキ (340g)"
    },
    "description": {
      "es": "Corte madurado en seco por 28 días, sellado a la brasa con mantequilla de ajo asado y papas rústicas trufadas.",
      "en": "28-day dry-aged USDA prime strip steak, flame-charred with roasted garlic herb butter and truffle fries.",
      "pt": "Corte nobre maturado a seco por 28 dias, grelhado na brasa com manteiga de alho e batatas rústicas.",
      "fr": "Faux-filet maturé 28 jours, grillé à haute température, beurre aux herbes et frites à la truffe.",
      "ja": "28日間熟成させた最高級アンガス牛を高温で焼き上げ、ガーリックハーブバターを添えた王道ステーキ。"
    },
    "priceMinorUnits": 4800,
    "price": 48,
    "basePriceUSD": 48,
    "prepTimeMinutes": 18,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Corte grueso de bife asado con mantequilla aromática",
      "en": "Thick grilled strip steak with melting herb butter",
      "pt": "Bife grelhado suculento com manteiga de ervas",
      "fr": "Steak de faux-filet grillé et noisette de beurre",
      "ja": "ハーブバターが溶け出す肉厚なグリルステーキ"
    },
    "fallbackEmoji": "🥩",
    "branchId": "br-aura-us-manhattan"
  },
  {
    "id": "br-aura-us-manhattan-dish-us-aura-03",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "mains",
    "name": {
      "es": "Salmón Salvaje de Alaska con Risotto de Maíz Dulce",
      "en": "Pan-Roasted Alaskan King Salmon & Sweet Corn Risotto",
      "pt": "Salmão Selvagem do Alasca com Risoto de Milho Doce",
      "fr": "Saumon sauvage d’Alaska rôti et risotto au maïs doux",
      "ja": "アラスカ産キングサーモンのソテー スイートコーンのリゾット添え"
    },
    "description": {
      "es": "Filete de salmón salvaje con piel crujiente sobre risotto cremoso de maíz tierno y emulsión cítrica de estragón.",
      "en": "Crispy-skin wild Alaskan king salmon over creamy Hudson Valley sweet corn risotto and tarragon citrus emulsion.",
      "pt": "Filé de salmão com pele crocante servido sobre risoto cremoso de milho doce.",
      "fr": "Pavé de saumon sauvage croustillant sur risotto crémeux au maïs doux et jus réduit aux herbes.",
      "ja": "皮目を香ばしく焼き上げた天然キングサーモンと、濃厚なコーンリゾットのハーモニー。"
    },
    "priceMinorUnits": 3900,
    "price": 39,
    "basePriceUSD": 39,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Filete de salmón dorado con guarnición cremosa",
      "en": "Seared golden salmon fillet with creamy side",
      "pt": "Filé de salmão dourado com acompanhamento cremoso",
      "fr": "Pavé de saumon doré sur lit de légumes",
      "ja": "黄金色に香ばしく焼かれたサーモンのフィレ"
    },
    "fallbackEmoji": "🐟",
    "branchId": "br-aura-us-manhattan"
  },
  {
    "id": "br-aura-us-manhattan-dish-us-aura-04",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "desserts",
    "name": {
      "es": "Cheesecake Estilo Nueva York con Frutos Rojos",
      "en": "Classic NY Baked Cheesecake with Berry Coulis",
      "pt": "Cheesecake Tradicional de Nova York com Frutas Vermelhas",
      "fr": "Cheesecake new-yorkais traditionnel et coulis de baies",
      "ja": "本場ニューヨーク・ベイクドチーズケーキ ベリーソース添え"
    },
    "description": {
      "es": "Tarta horneada densa y aterciopelada sobre base de galleta graham con compota de moras silvestres y arándanos.",
      "en": "Dense, creamy baked cream cheese cake on buttery graham crust with wild blueberry and blackberry coulis.",
      "pt": "Torta assada clássica ultra cremosa sobre crosta de biscoito amanteigado com calda de frutas silvestres.",
      "fr": "Gâteau crémeux au fromage frais sur croûte de biscuit sablé et coulis de myrtilles sauvages.",
      "ja": "グラハムクラッカーの土台に濃厚なクリームチーズをじっくり焼き上げた、本場のベイクドチーズケーキ。"
    },
    "priceMinorUnits": 1600,
    "price": 16,
    "basePriceUSD": 16,
    "prepTimeMinutes": 6,
    "available": true,
    "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Porción de cheesecake con salsa brillante de moras",
      "en": "Slice of New York cheesecake with rich berry sauce",
      "pt": "Fatia de cheesecake novaiorquino com frutas vermelhas",
      "fr": "Part de cheesecake nappe de coulis de fruits rouges",
      "ja": "ベリーソースが添えられた濃厚チーズケーキの一切れ"
    },
    "fallbackEmoji": "🍰",
    "branchId": "br-aura-us-manhattan"
  },
  {
    "id": "br-aura-us-manhattan-dish-us-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga de Pollo Orgánico a la Brasa con Puré y Espárragos",
      "en": "Lunch of the Day: Charbroiled Organic Chicken with Herb Mash & Asparagus",
      "pt": "Almoço do Dia: Frango Orgânico Grelhado com Purê Rústico e Aspargos",
      "fr": "Plat du jour midi: Suprême de poulet fermier rôti, purée et asperges",
      "ja": "本日のおすすめランチ：オーガニックチキンのグリル ハーブマッシュポテトとアスパラ添え"
    },
    "description": {
      "es": "Menú express ejecutivo: sopa de tomate asado, pechuga de pollo de granja a la brasa, puré de papas a la mantequilla y espárragos verdes.",
      "en": "Executive express lunch: roasted heirloom tomato bisque, charbroiled chicken breast, buttered potato purée and grilled asparagus.",
      "pt": "Menu executivo balanceado: sopa cremosa de tomate, peito de frango orgânico na brasa, purê de batatas e aspargos.",
      "fr": "Menu express d’affaires: velouté de tomates rôties, blanc de volaille fermière rôti, purée onctueuse et asperges vertes.",
      "ja": "ローストトマトのポタージュ、香ばしく焼き上げたチキン、バター香るマッシュポテトとアスパラガスの満足ランチ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 25.9,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato ejecutivo de pollo asado con espárragos",
      "en": "Executive lunch plate with chicken and asparagus",
      "pt": "Prato executivo com frango grelhado e aspargos",
      "fr": "Assiette de poulet rôti et asperges croquantes",
      "ja": "アスパラガスが添えられたチキングリルのランチ皿"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-us-manhattan"
  },
  {
    "id": "br-aura-us-manhattan-dish-us-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "drinks",
    "name": {
      "es": "Limonada de Moras Silvestres de Hudson Valley",
      "en": "Hudson Valley Wild Blackberry Lemonade",
      "pt": "Limonada Artesanal de Amoras de Hudson Valley",
      "fr": "Limonade artisanale aux mûres sauvages de la vallée de l’Hudson",
      "ja": "ハドソンバレー産野生ブラックベリーの特製レモネード"
    },
    "description": {
      "es": "Refrescante limonada infusionada con moras maduras cosechadas en el estado de Nueva York y hierbabuena fresca.",
      "en": "Fresh squeezed Meyer lemon juice blended with wild upstate New York blackberries and garden mint.",
      "pt": "Limonada fresca artesanal batida com amoras maduras silvestres e folhas de hortelã.",
      "fr": "Citronnade fraîche maison aux mûres sauvages de saison et menthe fraîchement cueillie.",
      "ja": "ニューヨーク州北部で手摘みされた完熟ブラックベリーとフレッシュミントを合わせた自家製レモネード。"
    },
    "priceMinorUnits": 800,
    "price": 8,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada con hielo y frutas rojas",
      "en": "Glass of cold berry lemonade with ice",
      "pt": "Copo de limonada gelada com amoras",
      "fr": "Verre de limonade fraîche avec baies rouges",
      "ja": "ベリーが浮かぶ冷たいグラスレモネード"
    },
    "fallbackEmoji": "🍋",
    "branchId": "br-aura-us-manhattan"
  },
  {
    "id": "br-aura-us-manhattan-dish-us-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga de Pollo Orgánico a la Brasa con Puré y Espárragos",
      "en": "Lunch of the Day: Charbroiled Organic Chicken with Herb Mash & Asparagus",
      "pt": "Almoço do Dia: Frango Orgânico Grelhado com Purê Rústico e Aspargos",
      "fr": "Plat du jour midi: Suprême de poulet fermier rôti, purée et asperges",
      "ja": "本日のおすすめランチ：オーガニックチキンのグリル ハーブマッシュポテトとアスパラ添え"
    },
    "description": {
      "es": "Menú express ejecutivo: sopa de tomate asado, pechuga de pollo de granja a la brasa, puré de papas a la mantequilla y espárragos verdes.",
      "en": "Executive express lunch: roasted heirloom tomato bisque, charbroiled chicken breast, buttered potato purée and grilled asparagus.",
      "pt": "Menu executivo balanceado: sopa cremosa de tomate, peito de frango orgânico na brasa, purê de batatas e aspargos.",
      "fr": "Menu express d’affaires: velouté de tomates rôties, blanc de volaille fermière rôti, purée onctueuse et asperges vertes.",
      "ja": "ローストトマトのポタージュ、香ばしく焼き上げたチキン、バター香るマッシュポテトとアスパラガスの満足ランチ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 25.9,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato ejecutivo de pollo asado con espárragos",
      "en": "Executive lunch plate with chicken and asparagus",
      "pt": "Prato executivo com frango grelhado e aspargos",
      "fr": "Assiette de poulet rôti et asperges croquantes",
      "ja": "アスパラガスが添えられたチキングリルのランチ皿"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-us-manhattan"
  },
  {
    "id": "br-aura-us-manhattan-dish-us-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "drinks",
    "name": {
      "es": "Limonada de Moras Silvestres de Hudson Valley",
      "en": "Hudson Valley Wild Blackberry Lemonade",
      "pt": "Limonada Artesanal de Amoras de Hudson Valley",
      "fr": "Limonade artisanale aux mûres sauvages de la vallée de l’Hudson",
      "ja": "ハドソンバレー産野生ブラックベリーの特製レモネード"
    },
    "description": {
      "es": "Refrescante limonada infusionada con moras maduras cosechadas en el estado de Nueva York y hierbabuena fresca.",
      "en": "Fresh squeezed Meyer lemon juice blended with wild upstate New York blackberries and garden mint.",
      "pt": "Limonada fresca artesanal batida com amoras maduras silvestres e folhas de hortelã.",
      "fr": "Citronnade fraîche maison aux mûres sauvages de saison et menthe fraîchement cueillie.",
      "ja": "ニューヨーク州北部で手摘みされた完熟ブラックベリーとフレッシュミントを合わせた自家製レモネード。"
    },
    "priceMinorUnits": 800,
    "price": 8,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada con hielo y frutas rojas",
      "en": "Glass of cold berry lemonade with ice",
      "pt": "Copo de limonada gelada com amoras",
      "fr": "Verre de limonade fraîche avec baies rouges",
      "ja": "ベリーが浮かぶ冷たいグラスレモネード"
    },
    "fallbackEmoji": "🍋",
    "branchId": "br-aura-us-manhattan"
  },
  {
    "id": "br-aura-us-brooklyn-dish-us-aura-01",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "starters",
    "name": {
      "es": "Tartar de Atún Rojo de Montauk con Aguacate",
      "en": "Montauk Yellowfin Tuna Tartare with Avocado",
      "pt": "Tartar de Atum de Montauk com Abacate",
      "fr": "Tartare de thon jaune de Montauk à l’avocat",
      "ja": "モントーク産キハダマグロとアボカドのタルタル"
    },
    "description": {
      "es": "Atún fresco de Long Island cortado a cuchillo con aguacate hass, vinagreta de sésamo y chips de yuca.",
      "en": "Hand-cut wild Montauk yellowfin tuna, smashed hass avocado, sesame-ginger dressing and taro crisps.",
      "pt": "Atum fresco selvagem cortado na ponta da faca com abacate hass e crocante de mandioca.",
      "fr": "Thon sauvage coupé au couteau, écrasé d’avocat hass, vinaigrette sésame-gingembre et chips de taro.",
      "ja": "ロングアイランド沖で獲れた鮮度の高いキハダマグロをアボカドと合わせた上品な前菜。"
    },
    "priceMinorUnits": 2200,
    "price": 22,
    "basePriceUSD": 22,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tartar de atún emplatado con sésamo y flores comestibles",
      "en": "Tuna tartare plated with sesame and microgreens",
      "pt": "Tartar de atum montado com gergelim",
      "fr": "Tartare de thon dressé avec graines de sésame",
      "ja": "マイクログリーンをあしらったマグロのタルタル"
    },
    "fallbackEmoji": "🐟",
    "branchId": "br-aura-us-brooklyn"
  },
  {
    "id": "br-aura-us-brooklyn-dish-us-aura-02",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "mains",
    "name": {
      "es": "Bife New York Strip Angus a las Brasas (12 oz)",
      "en": "Dry-Aged USDA Prime NY Strip Steak (12 oz)",
      "pt": "New York Strip Steak Angus Grelhado (340g)",
      "fr": "Faux-filet Black Angus NY Strip maturé (340g)",
      "ja": "プライム認定ブラックアンガス ニューヨークストリップステーキ (340g)"
    },
    "description": {
      "es": "Corte madurado en seco por 28 días, sellado a la brasa con mantequilla de ajo asado y papas rústicas trufadas.",
      "en": "28-day dry-aged USDA prime strip steak, flame-charred with roasted garlic herb butter and truffle fries.",
      "pt": "Corte nobre maturado a seco por 28 dias, grelhado na brasa com manteiga de alho e batatas rústicas.",
      "fr": "Faux-filet maturé 28 jours, grillé à haute température, beurre aux herbes et frites à la truffe.",
      "ja": "28日間熟成させた最高級アンガス牛を高温で焼き上げ、ガーリックハーブバターを添えた王道ステーキ。"
    },
    "priceMinorUnits": 4800,
    "price": 48,
    "basePriceUSD": 48,
    "prepTimeMinutes": 18,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Corte grueso de bife asado con mantequilla aromática",
      "en": "Thick grilled strip steak with melting herb butter",
      "pt": "Bife grelhado suculento com manteiga de ervas",
      "fr": "Steak de faux-filet grillé et noisette de beurre",
      "ja": "ハーブバターが溶け出す肉厚なグリルステーキ"
    },
    "fallbackEmoji": "🥩",
    "branchId": "br-aura-us-brooklyn"
  },
  {
    "id": "br-aura-us-brooklyn-dish-us-aura-03",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "mains",
    "name": {
      "es": "Salmón Salvaje de Alaska con Risotto de Maíz Dulce",
      "en": "Pan-Roasted Alaskan King Salmon & Sweet Corn Risotto",
      "pt": "Salmão Selvagem do Alasca com Risoto de Milho Doce",
      "fr": "Saumon sauvage d’Alaska rôti et risotto au maïs doux",
      "ja": "アラスカ産キングサーモンのソテー スイートコーンのリゾット添え"
    },
    "description": {
      "es": "Filete de salmón salvaje con piel crujiente sobre risotto cremoso de maíz tierno y emulsión cítrica de estragón.",
      "en": "Crispy-skin wild Alaskan king salmon over creamy Hudson Valley sweet corn risotto and tarragon citrus emulsion.",
      "pt": "Filé de salmão com pele crocante servido sobre risoto cremoso de milho doce.",
      "fr": "Pavé de saumon sauvage croustillant sur risotto crémeux au maïs doux et jus réduit aux herbes.",
      "ja": "皮目を香ばしく焼き上げた天然キングサーモンと、濃厚なコーンリゾットのハーモニー。"
    },
    "priceMinorUnits": 3900,
    "price": 39,
    "basePriceUSD": 39,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Filete de salmón dorado con guarnición cremosa",
      "en": "Seared golden salmon fillet with creamy side",
      "pt": "Filé de salmão dourado com acompanhamento cremoso",
      "fr": "Pavé de saumon doré sur lit de légumes",
      "ja": "黄金色に香ばしく焼かれたサーモンのフィレ"
    },
    "fallbackEmoji": "🐟",
    "branchId": "br-aura-us-brooklyn"
  },
  {
    "id": "br-aura-us-brooklyn-dish-us-aura-04",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "desserts",
    "name": {
      "es": "Cheesecake Estilo Nueva York con Frutos Rojos",
      "en": "Classic NY Baked Cheesecake with Berry Coulis",
      "pt": "Cheesecake Tradicional de Nova York com Frutas Vermelhas",
      "fr": "Cheesecake new-yorkais traditionnel et coulis de baies",
      "ja": "本場ニューヨーク・ベイクドチーズケーキ ベリーソース添え"
    },
    "description": {
      "es": "Tarta horneada densa y aterciopelada sobre base de galleta graham con compota de moras silvestres y arándanos.",
      "en": "Dense, creamy baked cream cheese cake on buttery graham crust with wild blueberry and blackberry coulis.",
      "pt": "Torta assada clássica ultra cremosa sobre crosta de biscoito amanteigado com calda de frutas silvestres.",
      "fr": "Gâteau crémeux au fromage frais sur croûte de biscuit sablé et coulis de myrtilles sauvages.",
      "ja": "グラハムクラッカーの土台に濃厚なクリームチーズをじっくり焼き上げた、本場のベイクドチーズケーキ。"
    },
    "priceMinorUnits": 1600,
    "price": 16,
    "basePriceUSD": 16,
    "prepTimeMinutes": 6,
    "available": true,
    "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Porción de cheesecake con salsa brillante de moras",
      "en": "Slice of New York cheesecake with rich berry sauce",
      "pt": "Fatia de cheesecake novaiorquino com frutas vermelhas",
      "fr": "Part de cheesecake nappe de coulis de fruits rouges",
      "ja": "ベリーソースが添えられた濃厚チーズケーキの一切れ"
    },
    "fallbackEmoji": "🍰",
    "branchId": "br-aura-us-brooklyn"
  },
  {
    "id": "br-aura-us-brooklyn-dish-us-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga de Pollo Orgánico a la Brasa con Puré y Espárragos",
      "en": "Lunch of the Day: Charbroiled Organic Chicken with Herb Mash & Asparagus",
      "pt": "Almoço do Dia: Frango Orgânico Grelhado com Purê Rústico e Aspargos",
      "fr": "Plat du jour midi: Suprême de poulet fermier rôti, purée et asperges",
      "ja": "本日のおすすめランチ：オーガニックチキンのグリル ハーブマッシュポテトとアスパラ添え"
    },
    "description": {
      "es": "Menú express ejecutivo: sopa de tomate asado, pechuga de pollo de granja a la brasa, puré de papas a la mantequilla y espárragos verdes.",
      "en": "Executive express lunch: roasted heirloom tomato bisque, charbroiled chicken breast, buttered potato purée and grilled asparagus.",
      "pt": "Menu executivo balanceado: sopa cremosa de tomate, peito de frango orgânico na brasa, purê de batatas e aspargos.",
      "fr": "Menu express d’affaires: velouté de tomates rôties, blanc de volaille fermière rôti, purée onctueuse et asperges vertes.",
      "ja": "ローストトマトのポタージュ、香ばしく焼き上げたチキン、バター香るマッシュポテトとアスパラガスの満足ランチ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 25.9,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato ejecutivo de pollo asado con espárragos",
      "en": "Executive lunch plate with chicken and asparagus",
      "pt": "Prato executivo com frango grelhado e aspargos",
      "fr": "Assiette de poulet rôti et asperges croquantes",
      "ja": "アスパラガスが添えられたチキングリルのランチ皿"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-us-brooklyn"
  },
  {
    "id": "br-aura-us-brooklyn-dish-us-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "drinks",
    "name": {
      "es": "Limonada de Moras Silvestres de Hudson Valley",
      "en": "Hudson Valley Wild Blackberry Lemonade",
      "pt": "Limonada Artesanal de Amoras de Hudson Valley",
      "fr": "Limonade artisanale aux mûres sauvages de la vallée de l’Hudson",
      "ja": "ハドソンバレー産野生ブラックベリーの特製レモネード"
    },
    "description": {
      "es": "Refrescante limonada infusionada con moras maduras cosechadas en el estado de Nueva York y hierbabuena fresca.",
      "en": "Fresh squeezed Meyer lemon juice blended with wild upstate New York blackberries and garden mint.",
      "pt": "Limonada fresca artesanal batida com amoras maduras silvestres e folhas de hortelã.",
      "fr": "Citronnade fraîche maison aux mûres sauvages de saison et menthe fraîchement cueillie.",
      "ja": "ニューヨーク州北部で手摘みされた完熟ブラックベリーとフレッシュミントを合わせた自家製レモネード。"
    },
    "priceMinorUnits": 800,
    "price": 8,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada con hielo y frutas rojas",
      "en": "Glass of cold berry lemonade with ice",
      "pt": "Copo de limonada gelada com amoras",
      "fr": "Verre de limonade fraîche avec baies rouges",
      "ja": "ベリーが浮かぶ冷たいグラスレモネード"
    },
    "fallbackEmoji": "🍋",
    "branchId": "br-aura-us-brooklyn"
  },
  {
    "id": "br-aura-us-brooklyn-dish-us-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga de Pollo Orgánico a la Brasa con Puré y Espárragos",
      "en": "Lunch of the Day: Charbroiled Organic Chicken with Herb Mash & Asparagus",
      "pt": "Almoço do Dia: Frango Orgânico Grelhado com Purê Rústico e Aspargos",
      "fr": "Plat du jour midi: Suprême de poulet fermier rôti, purée et asperges",
      "ja": "本日のおすすめランチ：オーガニックチキンのグリル ハーブマッシュポテトとアスパラ添え"
    },
    "description": {
      "es": "Menú express ejecutivo: sopa de tomate asado, pechuga de pollo de granja a la brasa, puré de papas a la mantequilla y espárragos verdes.",
      "en": "Executive express lunch: roasted heirloom tomato bisque, charbroiled chicken breast, buttered potato purée and grilled asparagus.",
      "pt": "Menu executivo balanceado: sopa cremosa de tomate, peito de frango orgânico na brasa, purê de batatas e aspargos.",
      "fr": "Menu express d’affaires: velouté de tomates rôties, blanc de volaille fermière rôti, purée onctueuse et asperges vertes.",
      "ja": "ローストトマトのポタージュ、香ばしく焼き上げたチキン、バター香るマッシュポテトとアスパラガスの満足ランチ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 25.9,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato ejecutivo de pollo asado con espárragos",
      "en": "Executive lunch plate with chicken and asparagus",
      "pt": "Prato executivo com frango grelhado e aspargos",
      "fr": "Assiette de poulet rôti et asperges croquantes",
      "ja": "アスパラガスが添えられたチキングリルのランチ皿"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-us-brooklyn"
  },
  {
    "id": "br-aura-us-brooklyn-dish-us-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "drinks",
    "name": {
      "es": "Limonada de Moras Silvestres de Hudson Valley",
      "en": "Hudson Valley Wild Blackberry Lemonade",
      "pt": "Limonada Artesanal de Amoras de Hudson Valley",
      "fr": "Limonade artisanale aux mûres sauvages de la vallée de l’Hudson",
      "ja": "ハドソンバレー産野生ブラックベリーの特製レモネード"
    },
    "description": {
      "es": "Refrescante limonada infusionada con moras maduras cosechadas en el estado de Nueva York y hierbabuena fresca.",
      "en": "Fresh squeezed Meyer lemon juice blended with wild upstate New York blackberries and garden mint.",
      "pt": "Limonada fresca artesanal batida com amoras maduras silvestres e folhas de hortelã.",
      "fr": "Citronnade fraîche maison aux mûres sauvages de saison et menthe fraîchement cueillie.",
      "ja": "ニューヨーク州北部で手摘みされた完熟ブラックベリーとフレッシュミントを合わせた自家製レモネード。"
    },
    "priceMinorUnits": 800,
    "price": 8,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada con hielo y frutas rojas",
      "en": "Glass of cold berry lemonade with ice",
      "pt": "Copo de limonada gelada com amoras",
      "fr": "Verre de limonade fraîche avec baies rouges",
      "ja": "ベリーが浮かぶ冷たいグラスレモネード"
    },
    "fallbackEmoji": "🍋",
    "branchId": "br-aura-us-brooklyn"
  },
  {
    "id": "br-sora-us-soho-dish-us-sora-01",
    "restaurantId": "brand-sora",
    "countryCode": "US",
    "category": "starters",
    "name": {
      "es": "Hamachi Crudo con Ponzu Trufado y Serrano",
      "en": "Yellowtail Hamachi Crudo with Truffle Ponzu & Serrano",
      "pt": "Hamachi Crudo com Ponzu Trufado e Pimenta Serrano",
      "fr": "Crudo de hamachi au ponzu truffé et piment serrano",
      "ja": "極上ハマチのクリュード トリュフポン酢とセラーノペッパー"
    },
    "description": {
      "es": "Láminas de pez limón fresco con aderezo cítrico de soja trufada, rodajas finas de chile serrano y microcilantro.",
      "en": "Thinly sliced Pacific yellowtail, white truffle ponzu reduction, serrano chili rounds and micro cilantro.",
      "pt": "Fatias finas de peixe hamachi com redução de ponzu trufado e fatias de pimenta serrano.",
      "fr": "Fines tranches de sériole du Pacifique, vinaigrette ponzu à la truffe blanche et piment frais.",
      "ja": "引き締まった旬のハマチを白トリュフ香る特製ポン酢とセラーノ唐辛子で引き締めた冷前菜。"
    },
    "priceMinorUnits": 2400,
    "price": 24,
    "basePriceUSD": 24,
    "prepTimeMinutes": 8,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Láminas de pescado crudo aliñadas con cítricos",
      "en": "Sliced raw fish dressed with citrus ponzu",
      "pt": "Fatias de peixe cru temperadas com ponzu",
      "fr": "Carpaccio de poisson cru aux agrumes",
      "ja": "柑橘ポン酢で仕立てた白身魚のカルパッチョ"
    },
    "fallbackEmoji": "🐟",
    "branchId": "br-sora-us-soho"
  },
  {
    "id": "br-sora-us-soho-dish-us-sora-02",
    "restaurantId": "brand-sora",
    "countryCode": "US",
    "category": "mains",
    "name": {
      "es": "Omakase Sora Sushi Seleccion (10 Piezas Nigiri)",
      "en": "Chef’s Omakase Nigiri Tasting (10 Pcs)",
      "pt": "Omakase Sora Nigiri Tasting (10 Peças)",
      "fr": "Menu dégustation Omakase de 10 nigiris d’exception",
      "ja": "職人特選おまかせ握り（10貫厳選盛り）"
    },
    "description": {
      "es": "Selección estacional directa de la lonja: toro flameado, uni de Santa Bárbara, vieira de Hokkaido y trucha real.",
      "en": "Daily seasonal selection including seared otoro, Santa Barbara sea urchin, Hokkaido scallop and king salmon.",
      "pt": "Seleção do sushiman com otoro maçaricado, ouriço do mar, vieiras e salmão nobre.",
      "fr": "Sélection raffinée du chef: thon gras otoro mi-cuit, oursin de mer, saint-jacques et saumon sauvage.",
      "ja": "築地・豊洲直輸入の大トロ炙り、北海道産ホタテ、極上ウニなど熟練の職人が握る10貫。"
    },
    "priceMinorUnits": 6500,
    "price": 65,
    "basePriceUSD": 65,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Bandeja de nigiris de alta gama sobre madera",
      "en": "High-end nigiri sushi platter on cedar board",
      "pt": "Bandeja de nigiris nobres sobre tábua de madeira",
      "fr": "Plateau de nigiris haut de gamme sur planche de cèdre",
      "ja": "木製寿司ゲタに並ぶ極上の職人握り寿司"
    },
    "fallbackEmoji": "🍣",
    "branchId": "br-sora-us-soho"
  },
  {
    "id": "br-sora-us-soho-dish-us-sora-03",
    "restaurantId": "brand-sora",
    "countryCode": "US",
    "category": "mains",
    "name": {
      "es": "Black Garlic Tonkotsu Ramen de Manhattan",
      "en": "Manhattan Black Garlic Tonkotsu Ramen",
      "pt": "Ramen Tonkotsu de Alho Negro de Manhattan",
      "fr": "Ramen Tonkotsu à l’huile d’ail noir fermenté",
      "ja": "マンハッタン仕込み 自家製黒マー油濃厚豚骨ラーメン"
    },
    "description": {
      "es": "Fondo cremoso de cerdo infusionado con aceite de ajo negro asado, panceta Berkshire, huevo marinado y bambú.",
      "en": "Velvety pork bone broth laced with roasted black garlic mayu oil, Berkshire pork belly chashu and menma.",
      "pt": "Caldo rico de porco com óleo de alho negro tostado, barriga Berkshire e ovo cozido marinado.",
      "fr": "Bouillon de porc onctueux parfumé à l’huile d’ail noir torréfié, porc Berkshire et bambou mariné.",
      "ja": "香ばしい焦がし黒マー油が香る濃厚豚骨スープに特注太縮れ麺、バークシャー種黒豚チャーシュー。"
    },
    "priceMinorUnits": 2800,
    "price": 28,
    "basePriceUSD": 28,
    "prepTimeMinutes": 14,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de ramen con aceite negro y rodajas de carne",
      "en": "Ramen bowl with aromatic black garlic oil and pork",
      "pt": "Tigela de ramen com óleo de alho negro e carne",
      "fr": "Bol de ramen à l’huile d’ail et tranches de porc",
      "ja": "芳醇な黒マー油が浮かぶ熱々の特製ラーメン"
    },
    "fallbackEmoji": "🍜",
    "branchId": "br-sora-us-soho"
  },
  {
    "id": "br-sora-us-soho-dish-us-sora-04",
    "restaurantId": "brand-sora",
    "countryCode": "US",
    "category": "desserts",
    "name": {
      "es": "Tarta Mille Crêpe de Té Verde Matcha",
      "en": "Kyoto Green Tea Matcha Mille Crêpe Cake",
      "pt": "Bolo Mille Crêpe de Matcha de Kyoto",
      "fr": "Gâteau mille crêpes au thé vert matcha de Kyoto",
      "ja": "京都宇治抹茶の極上ミルクレープ"
    },
    "description": {
      "es": "Veinte capas finísimas de crêpe artesanal intercaladas con crema pastelera infusionada en matcha Uji de Kioto.",
      "en": "Twenty paper-thin handmade crêpes layered with light Kyoto Uji matcha pastry cream and powdered glaze.",
      "pt": "Vinte camadas delicadas de crêpes com creme aveludado de matcha tradicional de Kyoto.",
      "fr": "Vingt fines crêpes superposées alternées d’une crème légère au thé vert matcha d’Uji.",
      "ja": "薄く焼き上げた20層のクレープ生地の間に、最高級宇治抹茶クリームを丁寧に重ねた逸品。"
    },
    "priceMinorUnits": 1800,
    "price": 18,
    "basePriceUSD": 18,
    "prepTimeMinutes": 6,
    "available": true,
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tarta de finas capas de crepe espolvoreada con matcha",
      "en": "Layered crepe cake dusted with green matcha powder",
      "pt": "Fatia de bolo crepe polvilhado com matcha",
      "fr": "Gâteau de crêpes superposées saupoudré de thé vert",
      "ja": "抹茶パウダーがかかった美しいミルクレープの層"
    },
    "fallbackEmoji": "🍰",
    "branchId": "br-sora-us-soho"
  },
  {
    "id": "br-sora-us-soho-dish-us-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga de Pollo Orgánico a la Brasa con Puré y Espárragos",
      "en": "Lunch of the Day: Charbroiled Organic Chicken with Herb Mash & Asparagus",
      "pt": "Almoço do Dia: Frango Orgânico Grelhado com Purê Rústico e Aspargos",
      "fr": "Plat du jour midi: Suprême de poulet fermier rôti, purée et asperges",
      "ja": "本日のおすすめランチ：オーガニックチキンのグリル ハーブマッシュポテトとアスパラ添え"
    },
    "description": {
      "es": "Menú express ejecutivo: sopa de tomate asado, pechuga de pollo de granja a la brasa, puré de papas a la mantequilla y espárragos verdes.",
      "en": "Executive express lunch: roasted heirloom tomato bisque, charbroiled chicken breast, buttered potato purée and grilled asparagus.",
      "pt": "Menu executivo balanceado: sopa cremosa de tomate, peito de frango orgânico na brasa, purê de batatas e aspargos.",
      "fr": "Menu express d’affaires: velouté de tomates rôties, blanc de volaille fermière rôti, purée onctueuse et asperges vertes.",
      "ja": "ローストトマトのポタージュ、香ばしく焼き上げたチキン、バター香るマッシュポテトとアスパラガスの満足ランチ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 25.9,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato ejecutivo de pollo asado con espárragos",
      "en": "Executive lunch plate with chicken and asparagus",
      "pt": "Prato executivo com frango grelhado e aspargos",
      "fr": "Assiette de poulet rôti et asperges croquantes",
      "ja": "アスパラガスが添えられたチキングリルのランチ皿"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-sora-us-soho"
  },
  {
    "id": "br-sora-us-soho-dish-us-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "drinks",
    "name": {
      "es": "Limonada de Moras Silvestres de Hudson Valley",
      "en": "Hudson Valley Wild Blackberry Lemonade",
      "pt": "Limonada Artesanal de Amoras de Hudson Valley",
      "fr": "Limonade artisanale aux mûres sauvages de la vallée de l’Hudson",
      "ja": "ハドソンバレー産野生ブラックベリーの特製レモネード"
    },
    "description": {
      "es": "Refrescante limonada infusionada con moras maduras cosechadas en el estado de Nueva York y hierbabuena fresca.",
      "en": "Fresh squeezed Meyer lemon juice blended with wild upstate New York blackberries and garden mint.",
      "pt": "Limonada fresca artesanal batida com amoras maduras silvestres e folhas de hortelã.",
      "fr": "Citronnade fraîche maison aux mûres sauvages de saison et menthe fraîchement cueillie.",
      "ja": "ニューヨーク州北部で手摘みされた完熟ブラックベリーとフレッシュミントを合わせた自家製レモネード。"
    },
    "priceMinorUnits": 800,
    "price": 8,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada con hielo y frutas rojas",
      "en": "Glass of cold berry lemonade with ice",
      "pt": "Copo de limonada gelada com amoras",
      "fr": "Verre de limonade fraîche avec baies rouges",
      "ja": "ベリーが浮かぶ冷たいグラスレモネード"
    },
    "fallbackEmoji": "🍋",
    "branchId": "br-sora-us-soho"
  },
  {
    "id": "br-sora-us-williamsburg-dish-us-sora-01",
    "restaurantId": "brand-sora",
    "countryCode": "US",
    "category": "starters",
    "name": {
      "es": "Hamachi Crudo con Ponzu Trufado y Serrano",
      "en": "Yellowtail Hamachi Crudo with Truffle Ponzu & Serrano",
      "pt": "Hamachi Crudo com Ponzu Trufado e Pimenta Serrano",
      "fr": "Crudo de hamachi au ponzu truffé et piment serrano",
      "ja": "極上ハマチのクリュード トリュフポン酢とセラーノペッパー"
    },
    "description": {
      "es": "Láminas de pez limón fresco con aderezo cítrico de soja trufada, rodajas finas de chile serrano y microcilantro.",
      "en": "Thinly sliced Pacific yellowtail, white truffle ponzu reduction, serrano chili rounds and micro cilantro.",
      "pt": "Fatias finas de peixe hamachi com redução de ponzu trufado e fatias de pimenta serrano.",
      "fr": "Fines tranches de sériole du Pacifique, vinaigrette ponzu à la truffe blanche et piment frais.",
      "ja": "引き締まった旬のハマチを白トリュフ香る特製ポン酢とセラーノ唐辛子で引き締めた冷前菜。"
    },
    "priceMinorUnits": 2400,
    "price": 24,
    "basePriceUSD": 24,
    "prepTimeMinutes": 8,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Láminas de pescado crudo aliñadas con cítricos",
      "en": "Sliced raw fish dressed with citrus ponzu",
      "pt": "Fatias de peixe cru temperadas com ponzu",
      "fr": "Carpaccio de poisson cru aux agrumes",
      "ja": "柑橘ポン酢で仕立てた白身魚のカルパッチョ"
    },
    "fallbackEmoji": "🐟",
    "branchId": "br-sora-us-williamsburg"
  },
  {
    "id": "br-sora-us-williamsburg-dish-us-sora-02",
    "restaurantId": "brand-sora",
    "countryCode": "US",
    "category": "mains",
    "name": {
      "es": "Omakase Sora Sushi Seleccion (10 Piezas Nigiri)",
      "en": "Chef’s Omakase Nigiri Tasting (10 Pcs)",
      "pt": "Omakase Sora Nigiri Tasting (10 Peças)",
      "fr": "Menu dégustation Omakase de 10 nigiris d’exception",
      "ja": "職人特選おまかせ握り（10貫厳選盛り）"
    },
    "description": {
      "es": "Selección estacional directa de la lonja: toro flameado, uni de Santa Bárbara, vieira de Hokkaido y trucha real.",
      "en": "Daily seasonal selection including seared otoro, Santa Barbara sea urchin, Hokkaido scallop and king salmon.",
      "pt": "Seleção do sushiman com otoro maçaricado, ouriço do mar, vieiras e salmão nobre.",
      "fr": "Sélection raffinée du chef: thon gras otoro mi-cuit, oursin de mer, saint-jacques et saumon sauvage.",
      "ja": "築地・豊洲直輸入の大トロ炙り、北海道産ホタテ、極上ウニなど熟練の職人が握る10貫。"
    },
    "priceMinorUnits": 6500,
    "price": 65,
    "basePriceUSD": 65,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Bandeja de nigiris de alta gama sobre madera",
      "en": "High-end nigiri sushi platter on cedar board",
      "pt": "Bandeja de nigiris nobres sobre tábua de madeira",
      "fr": "Plateau de nigiris haut de gamme sur planche de cèdre",
      "ja": "木製寿司ゲタに並ぶ極上の職人握り寿司"
    },
    "fallbackEmoji": "🍣",
    "branchId": "br-sora-us-williamsburg"
  },
  {
    "id": "br-sora-us-williamsburg-dish-us-sora-03",
    "restaurantId": "brand-sora",
    "countryCode": "US",
    "category": "mains",
    "name": {
      "es": "Black Garlic Tonkotsu Ramen de Manhattan",
      "en": "Manhattan Black Garlic Tonkotsu Ramen",
      "pt": "Ramen Tonkotsu de Alho Negro de Manhattan",
      "fr": "Ramen Tonkotsu à l’huile d’ail noir fermenté",
      "ja": "マンハッタン仕込み 自家製黒マー油濃厚豚骨ラーメン"
    },
    "description": {
      "es": "Fondo cremoso de cerdo infusionado con aceite de ajo negro asado, panceta Berkshire, huevo marinado y bambú.",
      "en": "Velvety pork bone broth laced with roasted black garlic mayu oil, Berkshire pork belly chashu and menma.",
      "pt": "Caldo rico de porco com óleo de alho negro tostado, barriga Berkshire e ovo cozido marinado.",
      "fr": "Bouillon de porc onctueux parfumé à l’huile d’ail noir torréfié, porc Berkshire et bambou mariné.",
      "ja": "香ばしい焦がし黒マー油が香る濃厚豚骨スープに特注太縮れ麺、バークシャー種黒豚チャーシュー。"
    },
    "priceMinorUnits": 2800,
    "price": 28,
    "basePriceUSD": 28,
    "prepTimeMinutes": 14,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de ramen con aceite negro y rodajas de carne",
      "en": "Ramen bowl with aromatic black garlic oil and pork",
      "pt": "Tigela de ramen com óleo de alho negro e carne",
      "fr": "Bol de ramen à l’huile d’ail et tranches de porc",
      "ja": "芳醇な黒マー油が浮かぶ熱々の特製ラーメン"
    },
    "fallbackEmoji": "🍜",
    "branchId": "br-sora-us-williamsburg"
  },
  {
    "id": "br-sora-us-williamsburg-dish-us-sora-04",
    "restaurantId": "brand-sora",
    "countryCode": "US",
    "category": "desserts",
    "name": {
      "es": "Tarta Mille Crêpe de Té Verde Matcha",
      "en": "Kyoto Green Tea Matcha Mille Crêpe Cake",
      "pt": "Bolo Mille Crêpe de Matcha de Kyoto",
      "fr": "Gâteau mille crêpes au thé vert matcha de Kyoto",
      "ja": "京都宇治抹茶の極上ミルクレープ"
    },
    "description": {
      "es": "Veinte capas finísimas de crêpe artesanal intercaladas con crema pastelera infusionada en matcha Uji de Kioto.",
      "en": "Twenty paper-thin handmade crêpes layered with light Kyoto Uji matcha pastry cream and powdered glaze.",
      "pt": "Vinte camadas delicadas de crêpes com creme aveludado de matcha tradicional de Kyoto.",
      "fr": "Vingt fines crêpes superposées alternées d’une crème légère au thé vert matcha d’Uji.",
      "ja": "薄く焼き上げた20層のクレープ生地の間に、最高級宇治抹茶クリームを丁寧に重ねた逸品。"
    },
    "priceMinorUnits": 1800,
    "price": 18,
    "basePriceUSD": 18,
    "prepTimeMinutes": 6,
    "available": true,
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tarta de finas capas de crepe espolvoreada con matcha",
      "en": "Layered crepe cake dusted with green matcha powder",
      "pt": "Fatia de bolo crepe polvilhado com matcha",
      "fr": "Gâteau de crêpes superposées saupoudré de thé vert",
      "ja": "抹茶パウダーがかかった美しいミルクレープの層"
    },
    "fallbackEmoji": "🍰",
    "branchId": "br-sora-us-williamsburg"
  },
  {
    "id": "br-sora-us-williamsburg-dish-us-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Pechuga de Pollo Orgánico a la Brasa con Puré y Espárragos",
      "en": "Lunch of the Day: Charbroiled Organic Chicken with Herb Mash & Asparagus",
      "pt": "Almoço do Dia: Frango Orgânico Grelhado com Purê Rústico e Aspargos",
      "fr": "Plat du jour midi: Suprême de poulet fermier rôti, purée et asperges",
      "ja": "本日のおすすめランチ：オーガニックチキンのグリル ハーブマッシュポテトとアスパラ添え"
    },
    "description": {
      "es": "Menú express ejecutivo: sopa de tomate asado, pechuga de pollo de granja a la brasa, puré de papas a la mantequilla y espárragos verdes.",
      "en": "Executive express lunch: roasted heirloom tomato bisque, charbroiled chicken breast, buttered potato purée and grilled asparagus.",
      "pt": "Menu executivo balanceado: sopa cremosa de tomate, peito de frango orgânico na brasa, purê de batatas e aspargos.",
      "fr": "Menu express d’affaires: velouté de tomates rôties, blanc de volaille fermière rôti, purée onctueuse et asperges vertes.",
      "ja": "ローストトマトのポタージュ、香ばしく焼き上げたチキン、バター香るマッシュポテトとアスパラガスの満足ランチ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 25.9,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato ejecutivo de pollo asado con espárragos",
      "en": "Executive lunch plate with chicken and asparagus",
      "pt": "Prato executivo com frango grelhado e aspargos",
      "fr": "Assiette de poulet rôti et asperges croquantes",
      "ja": "アスパラガスが添えられたチキングリルのランチ皿"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-sora-us-williamsburg"
  },
  {
    "id": "br-sora-us-williamsburg-dish-us-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "US",
    "category": "drinks",
    "name": {
      "es": "Limonada de Moras Silvestres de Hudson Valley",
      "en": "Hudson Valley Wild Blackberry Lemonade",
      "pt": "Limonada Artesanal de Amoras de Hudson Valley",
      "fr": "Limonade artisanale aux mûres sauvages de la vallée de l’Hudson",
      "ja": "ハドソンバレー産野生ブラックベリーの特製レモネード"
    },
    "description": {
      "es": "Refrescante limonada infusionada con moras maduras cosechadas en el estado de Nueva York y hierbabuena fresca.",
      "en": "Fresh squeezed Meyer lemon juice blended with wild upstate New York blackberries and garden mint.",
      "pt": "Limonada fresca artesanal batida com amoras maduras silvestres e folhas de hortelã.",
      "fr": "Citronnade fraîche maison aux mûres sauvages de saison et menthe fraîchement cueillie.",
      "ja": "ニューヨーク州北部で手摘みされた完熟ブラックベリーとフレッシュミントを合わせた自家製レモネード。"
    },
    "priceMinorUnits": 800,
    "price": 8,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de limonada con hielo y frutas rojas",
      "en": "Glass of cold berry lemonade with ice",
      "pt": "Copo de limonada gelada com amoras",
      "fr": "Verre de limonade fraîche avec baies rouges",
      "ja": "ベリーが浮かぶ冷たいグラスレモネード"
    },
    "fallbackEmoji": "🍋",
    "branchId": "br-sora-us-williamsburg"
  },
  {
    "id": "br-aura-fr-marais-dish-fr-aura-01",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "starters",
    "name": {
      "es": "Foie Gras de Pato del Suroeste con Brioche Tostado",
      "en": "Southwest Duck Foie Gras with Toasted Brioche",
      "pt": "Foie Gras de Pato do Sudoeste Francês com Brioche",
      "fr": "Foie gras de canard du Sud-Ouest et brioche dorée",
      "ja": "南西フランス産鴨フォアグラのテリーヌ 香ばしいトーストブリオッシュ添え"
    },
    "description": {
      "es": "Terrina artesanal cocida a baja temperatura, acompañada de chutney de higos de Provenza y flor de sal de Guérande.",
      "en": "Artisanal duck terrine poached at low temperature, served with Provence fig chutney and Guérande fleur de sel.",
      "pt": "Terrina artesanal delicada com chutney de figos da Provença e flor de sal de Guérande.",
      "fr": "Terrine mi-cuite maison, chutney de figues fraîches de Provence et fleur de sel de Guérande.",
      "ja": "低温で滑らかに仕上げたフォアグラのテリーヌ。プロヴァンス産無花果チャツネとゲランド海塩添え。"
    },
    "priceMinorUnits": 2400,
    "price": 24,
    "basePriceUSD": 25.5,
    "prepTimeMinutes": 8,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Terrina de foie gras sobre pan brioche tostado",
      "en": "Duck foie gras terrine with golden brioche",
      "pt": "Terrina de foie gras com brioche tostado",
      "fr": "Terrine de foie gras avec tranche de brioche dorée",
      "ja": "トーストしたブリオッシュに添えられたフォアグラテリーヌ"
    },
    "fallbackEmoji": "🥖",
    "branchId": "br-aura-fr-marais"
  },
  {
    "id": "br-aura-fr-marais-dish-fr-aura-02",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "mains",
    "name": {
      "es": "Entrecôte Charolaise Asada con Mantequilla Café de París",
      "en": "Charolais Ribeye Steak with Café de Paris Butter",
      "pt": "Entrecôte Charolês Grelhado com Manteiga Café de Paris",
      "fr": "Entrecôte de bœuf Charolais et beurre Café de Paris",
      "ja": "シャロレー種牛リブロースのグリル 特製カフェ・ド・パリ・バター添え"
    },
    "description": {
      "es": "Corte madurado de res Charolesa a la plancha con mantequilla aromática de 14 hierbas y papas fritas caseras finas.",
      "en": "Seared Prime French Charolais ribeye steak, crowned with 14-herb compound butter and golden matchstick fries.",
      "pt": "Corte nobre de carne Charolesa na chapa com manteiga especial de ervas e batatas fritas caseiras.",
      "fr": "Pièce noble de bœuf Charolais grillée minute, beurre maître d’hôtel aux 14 aromates et frites maison croustillantes.",
      "ja": "名門シャロレー牛の赤身肉を香ばしく焼き、14種のハーブとスパイスを練り込んだ特製バターとフレンチフライを添えて。"
    },
    "priceMinorUnits": 4400,
    "price": 44,
    "basePriceUSD": 46.5,
    "prepTimeMinutes": 18,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Entrecôte francesa servida con patatas fritas",
      "en": "French ribeye steak served with fries",
      "pt": "Entrecôte fatiado com batatas fritas crocantes",
      "fr": "Entrecôte grillée saignante et corbeille de frites",
      "ja": "フライドポテトが添えられたジューシーなリブロースステーキ"
    },
    "fallbackEmoji": "🥩",
    "branchId": "br-aura-fr-marais"
  },
  {
    "id": "br-aura-fr-marais-dish-fr-aura-03",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "mains",
    "name": {
      "es": "Magret de Pato del Gers Glaseado con Miel y Lavanda",
      "en": "Roast Duck Magret with Lavender Honey Glaze",
      "pt": "Magret de Pato Grelhado com Mel de Lavanda",
      "fr": "Magret de canard du Gers rôti au miel de lavande",
      "ja": "ジェール産マグレ・ド・カナール（鴨胸肉のロースト）ラベンダー蜂蜜風味"
    },
    "description": {
      "es": "Pechuga entera de pato dorada a la sartén con piel crujiente, salsa reducida de grosellas y puré mousseline de chirivía.",
      "en": "Pan-seared tender duck breast with crisp skin, redcurrant reduction glaze and parsnip mousseline.",
      "pt": "Peito nobre de pato grelhado ao ponto rosado com redução de groselha e purê aveludado.",
      "fr": "Magret entier cuit rosé, peau laquée au miel de lavande, jus court corsé aux groseilles et mousseline de panais.",
      "ja": "肉厚な鴨胸肉の皮目をパリッと焼き、プロヴァンス産ラベンダー蜂蜜と赤スグリのソースで仕上げたロースト。"
    },
    "priceMinorUnits": 3800,
    "price": 38,
    "basePriceUSD": 40,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Magret de pato trinchado con salsa oscura brillante",
      "en": "Sliced roast duck breast with glossy dark sauce",
      "pt": "Fatias de peito de pato com molho brilhante",
      "fr": "Magret de canard tranché rosé et réduction brillante",
      "ja": "艶やかなソースがかかったロースト鴨胸肉の断面"
    },
    "fallbackEmoji": "🍗",
    "branchId": "br-aura-fr-marais"
  },
  {
    "id": "br-aura-fr-marais-dish-fr-aura-04",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "desserts",
    "name": {
      "es": "Tarte Tatin de Manzanas Caramelizadas con Crème Fraîche",
      "en": "Warm Apple Tarte Tatin with Normandy Crème Fraîche",
      "pt": "Tarte Tatin Tradicional de Maçãs Caramelizadas",
      "fr": "Tarte Tatin tiède aux pommes caramélisées et crème crue",
      "ja": "ノルマンディー風タルト・タタン（温かいキャラメル林檎パイ）"
    },
    "description": {
      "es": "Tarta invertida de manzanas confitadas lentamente en mantequilla salada sobre hojaldre crujiente y crema fresca de Normandía.",
      "en": "Upside-down caramelized apple tart cooked in salted butter over crisp puff pastry with chilled Normandy cream.",
      "pt": "Torta invertida de maçãs douradas na manteiga de fazenda sobre massa folhada crocante.",
      "fr": "Pommes fondantes confites au beurre demi-sel sur pâte feuilletée pur beurre croustillante et quenelle de crème d’Isigny.",
      "ja": "発酵バターと砂糖で飴色になるまで煮詰めたリンゴとサクサクのパイ生地。生クリーム添え。"
    },
    "priceMinorUnits": 1500,
    "price": 15,
    "basePriceUSD": 16,
    "prepTimeMinutes": 8,
    "available": true,
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Porción de tarte tatin con manzana brillante y crema",
      "en": "Slice of glossy apple tarte tatin with cream",
      "pt": "Fatia de tarte tatin com maçãs brilhantes",
      "fr": "Part de tarte Tatin aux pommes fondantes et crème",
      "ja": "艶やかなリンゴが重なるタルトタタンの一皿"
    },
    "fallbackEmoji": "🥧",
    "branchId": "br-aura-fr-marais"
  },
  {
    "id": "br-aura-fr-marais-dish-fr-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Suprême de Volaille Fermière Rôti avec Mousseline de Carottes et Jus Corsé",
      "en": "Lunch of the Day: Roast Farm Poultry Suprême with Carrot Mousseline & Rich Herb Jus",
      "pt": "Almoço do Dia: Supremo de Frango Caipira com Purê de Cenouras e Jus Rústico",
      "fr": "Plat du jour midi: Suprême de volaille fermière rôti, mousseline de carottes au beurre et jus court",
      "ja": "本日のおすすめランチ：農場直送地鶏胸肉のロースト キャロットムースリーヌと特製ジュ"
    },
    "description": {
      "es": "La gran tradición del bistró parisino: velouté de verduras de estación, pechuga dorada con hierbas de Provenza, puré fino de zanahoria a la mantequilla y ensalada verde.",
      "en": "Authentic Parisian bistro lunch: seasonal garden soup, roasted French poultry breast, buttered carrot purée and dressed baby greens.",
      "pt": "Menu bistrô parisiense: sopa leve do dia, peito de frango assado ao jus, purê sedoso de cenouras e salada crocante.",
      "fr": "La formule bistro classique: velouté de saison, suprême de volaille rôti sur peau, mousseline de carottes au beurre noisette et salade de mesclun.",
      "ja": "パリのビストロの定番ランチ：季節のポタージュ、香ばしくローストした地鶏、バター香る人参のムースリーヌ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 27.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato de almuerzo bistro con pollo y puré brillante",
      "en": "Bistro chicken lunch plate with carrot purée",
      "pt": "Prato de almoço bistrô francês com purê",
      "fr": "Assiette bistrot de volaille rôtie et mousseline",
      "ja": "地鶏ローストと色鮮やかな人参ムースリーヌのランチ"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-fr-marais"
  },
  {
    "id": "br-aura-fr-marais-dish-fr-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "drinks",
    "name": {
      "es": "Infusión Helada de Hibisco de Provenza y Menta Fresca",
      "en": "Provence Iced Hibiscus & Garden Mint Infusion",
      "pt": "Infusão Gelada de Hibisco da Provença e Hortelã",
      "fr": "Infusion glacée d’hibiscus de Provence et menthe fraîche du jardin",
      "ja": "プロヴァンス産ハイビスカスと摘みたてミントの自家製アイスハーブティー"
    },
    "description": {
      "es": "Bebida artesanal refrescante sin alcohol elaborada con flores de hibisco infusionadas en frío, toque de lima y hojas de menta.",
      "en": "House-made chilled herbal infusion with whole hibiscus flowers, cold-brewed with lime zest and fresh garden mint.",
      "pt": "Bebida artesanal gelada e refrescante feita com flores de hibisco e hortelã fresca.",
      "fr": "Infusion artisanale rafraîchissante préparée à froid à partir de fleurs d’hibiscus entières et menthe froissée.",
      "ja": "ハイビスカスの花弁を水出し抽出したルビー色の爽やかなアイスティー。ミントとライムの香り。"
    },
    "priceMinorUnits": 750,
    "price": 7.5,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de infusión fría color rubí con hielo y menta",
      "en": "Ruby red iced infusion glass with fresh mint",
      "pt": "Copo de chá gelado vermelho com hortelã",
      "fr": "Verre de thé glacé rouge rubis avec feuilles de menthe",
      "ja": "鮮やかな赤色の冷たいハイビスカスティーグラス"
    },
    "fallbackEmoji": "🌺",
    "branchId": "br-aura-fr-marais"
  },
  {
    "id": "br-aura-fr-marais-dish-fr-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Suprême de Volaille Fermière Rôti avec Mousseline de Carottes et Jus Corsé",
      "en": "Lunch of the Day: Roast Farm Poultry Suprême with Carrot Mousseline & Rich Herb Jus",
      "pt": "Almoço do Dia: Supremo de Frango Caipira com Purê de Cenouras e Jus Rústico",
      "fr": "Plat du jour midi: Suprême de volaille fermière rôti, mousseline de carottes au beurre et jus court",
      "ja": "本日のおすすめランチ：農場直送地鶏胸肉のロースト キャロットムースリーヌと特製ジュ"
    },
    "description": {
      "es": "La gran tradición del bistró parisino: velouté de verduras de estación, pechuga dorada con hierbas de Provenza, puré fino de zanahoria a la mantequilla y ensalada verde.",
      "en": "Authentic Parisian bistro lunch: seasonal garden soup, roasted French poultry breast, buttered carrot purée and dressed baby greens.",
      "pt": "Menu bistrô parisiense: sopa leve do dia, peito de frango assado ao jus, purê sedoso de cenouras e salada crocante.",
      "fr": "La formule bistro classique: velouté de saison, suprême de volaille rôti sur peau, mousseline de carottes au beurre noisette et salade de mesclun.",
      "ja": "パリのビストロの定番ランチ：季節のポタージュ、香ばしくローストした地鶏、バター香る人参のムースリーヌ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 27.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato de almuerzo bistro con pollo y puré brillante",
      "en": "Bistro chicken lunch plate with carrot purée",
      "pt": "Prato de almoço bistrô francês com purê",
      "fr": "Assiette bistrot de volaille rôtie et mousseline",
      "ja": "地鶏ローストと色鮮やかな人参ムースリーヌのランチ"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-fr-marais"
  },
  {
    "id": "br-aura-fr-marais-dish-fr-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "drinks",
    "name": {
      "es": "Infusión Helada de Hibisco de Provenza y Menta Fresca",
      "en": "Provence Iced Hibiscus & Garden Mint Infusion",
      "pt": "Infusão Gelada de Hibisco da Provença e Hortelã",
      "fr": "Infusion glacée d’hibiscus de Provence et menthe fraîche du jardin",
      "ja": "プロヴァンス産ハイビスカスと摘みたてミントの自家製アイスハーブティー"
    },
    "description": {
      "es": "Bebida artesanal refrescante sin alcohol elaborada con flores de hibisco infusionadas en frío, toque de lima y hojas de menta.",
      "en": "House-made chilled herbal infusion with whole hibiscus flowers, cold-brewed with lime zest and fresh garden mint.",
      "pt": "Bebida artesanal gelada e refrescante feita com flores de hibisco e hortelã fresca.",
      "fr": "Infusion artisanale rafraîchissante préparée à froid à partir de fleurs d’hibiscus entières et menthe froissée.",
      "ja": "ハイビスカスの花弁を水出し抽出したルビー色の爽やかなアイスティー。ミントとライムの香り。"
    },
    "priceMinorUnits": 750,
    "price": 7.5,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de infusión fría color rubí con hielo y menta",
      "en": "Ruby red iced infusion glass with fresh mint",
      "pt": "Copo de chá gelado vermelho com hortelã",
      "fr": "Verre de thé glacé rouge rubis avec feuilles de menthe",
      "ja": "鮮やかな赤色の冷たいハイビスカスティーグラス"
    },
    "fallbackEmoji": "🌺",
    "branchId": "br-aura-fr-marais"
  },
  {
    "id": "br-aura-fr-saintgermain-dish-fr-aura-01",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "starters",
    "name": {
      "es": "Foie Gras de Pato del Suroeste con Brioche Tostado",
      "en": "Southwest Duck Foie Gras with Toasted Brioche",
      "pt": "Foie Gras de Pato do Sudoeste Francês com Brioche",
      "fr": "Foie gras de canard du Sud-Ouest et brioche dorée",
      "ja": "南西フランス産鴨フォアグラのテリーヌ 香ばしいトーストブリオッシュ添え"
    },
    "description": {
      "es": "Terrina artesanal cocida a baja temperatura, acompañada de chutney de higos de Provenza y flor de sal de Guérande.",
      "en": "Artisanal duck terrine poached at low temperature, served with Provence fig chutney and Guérande fleur de sel.",
      "pt": "Terrina artesanal delicada com chutney de figos da Provença e flor de sal de Guérande.",
      "fr": "Terrine mi-cuite maison, chutney de figues fraîches de Provence et fleur de sel de Guérande.",
      "ja": "低温で滑らかに仕上げたフォアグラのテリーヌ。プロヴァンス産無花果チャツネとゲランド海塩添え。"
    },
    "priceMinorUnits": 2400,
    "price": 24,
    "basePriceUSD": 25.5,
    "prepTimeMinutes": 8,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Terrina de foie gras sobre pan brioche tostado",
      "en": "Duck foie gras terrine with golden brioche",
      "pt": "Terrina de foie gras com brioche tostado",
      "fr": "Terrine de foie gras avec tranche de brioche dorée",
      "ja": "トーストしたブリオッシュに添えられたフォアグラテリーヌ"
    },
    "fallbackEmoji": "🥖",
    "branchId": "br-aura-fr-saintgermain"
  },
  {
    "id": "br-aura-fr-saintgermain-dish-fr-aura-02",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "mains",
    "name": {
      "es": "Entrecôte Charolaise Asada con Mantequilla Café de París",
      "en": "Charolais Ribeye Steak with Café de Paris Butter",
      "pt": "Entrecôte Charolês Grelhado com Manteiga Café de Paris",
      "fr": "Entrecôte de bœuf Charolais et beurre Café de Paris",
      "ja": "シャロレー種牛リブロースのグリル 特製カフェ・ド・パリ・バター添え"
    },
    "description": {
      "es": "Corte madurado de res Charolesa a la plancha con mantequilla aromática de 14 hierbas y papas fritas caseras finas.",
      "en": "Seared Prime French Charolais ribeye steak, crowned with 14-herb compound butter and golden matchstick fries.",
      "pt": "Corte nobre de carne Charolesa na chapa com manteiga especial de ervas e batatas fritas caseiras.",
      "fr": "Pièce noble de bœuf Charolais grillée minute, beurre maître d’hôtel aux 14 aromates et frites maison croustillantes.",
      "ja": "名門シャロレー牛の赤身肉を香ばしく焼き、14種のハーブとスパイスを練り込んだ特製バターとフレンチフライを添えて。"
    },
    "priceMinorUnits": 4400,
    "price": 44,
    "basePriceUSD": 46.5,
    "prepTimeMinutes": 18,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Entrecôte francesa servida con patatas fritas",
      "en": "French ribeye steak served with fries",
      "pt": "Entrecôte fatiado com batatas fritas crocantes",
      "fr": "Entrecôte grillée saignante et corbeille de frites",
      "ja": "フライドポテトが添えられたジューシーなリブロースステーキ"
    },
    "fallbackEmoji": "🥩",
    "branchId": "br-aura-fr-saintgermain"
  },
  {
    "id": "br-aura-fr-saintgermain-dish-fr-aura-03",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "mains",
    "name": {
      "es": "Magret de Pato del Gers Glaseado con Miel y Lavanda",
      "en": "Roast Duck Magret with Lavender Honey Glaze",
      "pt": "Magret de Pato Grelhado com Mel de Lavanda",
      "fr": "Magret de canard du Gers rôti au miel de lavande",
      "ja": "ジェール産マグレ・ド・カナール（鴨胸肉のロースト）ラベンダー蜂蜜風味"
    },
    "description": {
      "es": "Pechuga entera de pato dorada a la sartén con piel crujiente, salsa reducida de grosellas y puré mousseline de chirivía.",
      "en": "Pan-seared tender duck breast with crisp skin, redcurrant reduction glaze and parsnip mousseline.",
      "pt": "Peito nobre de pato grelhado ao ponto rosado com redução de groselha e purê aveludado.",
      "fr": "Magret entier cuit rosé, peau laquée au miel de lavande, jus court corsé aux groseilles et mousseline de panais.",
      "ja": "肉厚な鴨胸肉の皮目をパリッと焼き、プロヴァンス産ラベンダー蜂蜜と赤スグリのソースで仕上げたロースト。"
    },
    "priceMinorUnits": 3800,
    "price": 38,
    "basePriceUSD": 40,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Magret de pato trinchado con salsa oscura brillante",
      "en": "Sliced roast duck breast with glossy dark sauce",
      "pt": "Fatias de peito de pato com molho brilhante",
      "fr": "Magret de canard tranché rosé et réduction brillante",
      "ja": "艶やかなソースがかかったロースト鴨胸肉の断面"
    },
    "fallbackEmoji": "🍗",
    "branchId": "br-aura-fr-saintgermain"
  },
  {
    "id": "br-aura-fr-saintgermain-dish-fr-aura-04",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "desserts",
    "name": {
      "es": "Tarte Tatin de Manzanas Caramelizadas con Crème Fraîche",
      "en": "Warm Apple Tarte Tatin with Normandy Crème Fraîche",
      "pt": "Tarte Tatin Tradicional de Maçãs Caramelizadas",
      "fr": "Tarte Tatin tiède aux pommes caramélisées et crème crue",
      "ja": "ノルマンディー風タルト・タタン（温かいキャラメル林檎パイ）"
    },
    "description": {
      "es": "Tarta invertida de manzanas confitadas lentamente en mantequilla salada sobre hojaldre crujiente y crema fresca de Normandía.",
      "en": "Upside-down caramelized apple tart cooked in salted butter over crisp puff pastry with chilled Normandy cream.",
      "pt": "Torta invertida de maçãs douradas na manteiga de fazenda sobre massa folhada crocante.",
      "fr": "Pommes fondantes confites au beurre demi-sel sur pâte feuilletée pur beurre croustillante et quenelle de crème d’Isigny.",
      "ja": "発酵バターと砂糖で飴色になるまで煮詰めたリンゴとサクサクのパイ生地。生クリーム添え。"
    },
    "priceMinorUnits": 1500,
    "price": 15,
    "basePriceUSD": 16,
    "prepTimeMinutes": 8,
    "available": true,
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Porción de tarte tatin con manzana brillante y crema",
      "en": "Slice of glossy apple tarte tatin with cream",
      "pt": "Fatia de tarte tatin com maçãs brilhantes",
      "fr": "Part de tarte Tatin aux pommes fondantes et crème",
      "ja": "艶やかなリンゴが重なるタルトタタンの一皿"
    },
    "fallbackEmoji": "🥧",
    "branchId": "br-aura-fr-saintgermain"
  },
  {
    "id": "br-aura-fr-saintgermain-dish-fr-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Suprême de Volaille Fermière Rôti avec Mousseline de Carottes et Jus Corsé",
      "en": "Lunch of the Day: Roast Farm Poultry Suprême with Carrot Mousseline & Rich Herb Jus",
      "pt": "Almoço do Dia: Supremo de Frango Caipira com Purê de Cenouras e Jus Rústico",
      "fr": "Plat du jour midi: Suprême de volaille fermière rôti, mousseline de carottes au beurre et jus court",
      "ja": "本日のおすすめランチ：農場直送地鶏胸肉のロースト キャロットムースリーヌと特製ジュ"
    },
    "description": {
      "es": "La gran tradición del bistró parisino: velouté de verduras de estación, pechuga dorada con hierbas de Provenza, puré fino de zanahoria a la mantequilla y ensalada verde.",
      "en": "Authentic Parisian bistro lunch: seasonal garden soup, roasted French poultry breast, buttered carrot purée and dressed baby greens.",
      "pt": "Menu bistrô parisiense: sopa leve do dia, peito de frango assado ao jus, purê sedoso de cenouras e salada crocante.",
      "fr": "La formule bistro classique: velouté de saison, suprême de volaille rôti sur peau, mousseline de carottes au beurre noisette et salade de mesclun.",
      "ja": "パリのビストロの定番ランチ：季節のポタージュ、香ばしくローストした地鶏、バター香る人参のムースリーヌ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 27.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato de almuerzo bistro con pollo y puré brillante",
      "en": "Bistro chicken lunch plate with carrot purée",
      "pt": "Prato de almoço bistrô francês com purê",
      "fr": "Assiette bistrot de volaille rôtie et mousseline",
      "ja": "地鶏ローストと色鮮やかな人参ムースリーヌのランチ"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-fr-saintgermain"
  },
  {
    "id": "br-aura-fr-saintgermain-dish-fr-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "drinks",
    "name": {
      "es": "Infusión Helada de Hibisco de Provenza y Menta Fresca",
      "en": "Provence Iced Hibiscus & Garden Mint Infusion",
      "pt": "Infusão Gelada de Hibisco da Provença e Hortelã",
      "fr": "Infusion glacée d’hibiscus de Provence et menthe fraîche du jardin",
      "ja": "プロヴァンス産ハイビスカスと摘みたてミントの自家製アイスハーブティー"
    },
    "description": {
      "es": "Bebida artesanal refrescante sin alcohol elaborada con flores de hibisco infusionadas en frío, toque de lima y hojas de menta.",
      "en": "House-made chilled herbal infusion with whole hibiscus flowers, cold-brewed with lime zest and fresh garden mint.",
      "pt": "Bebida artesanal gelada e refrescante feita com flores de hibisco e hortelã fresca.",
      "fr": "Infusion artisanale rafraîchissante préparée à froid à partir de fleurs d’hibiscus entières et menthe froissée.",
      "ja": "ハイビスカスの花弁を水出し抽出したルビー色の爽やかなアイスティー。ミントとライムの香り。"
    },
    "priceMinorUnits": 750,
    "price": 7.5,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de infusión fría color rubí con hielo y menta",
      "en": "Ruby red iced infusion glass with fresh mint",
      "pt": "Copo de chá gelado vermelho com hortelã",
      "fr": "Verre de thé glacé rouge rubis avec feuilles de menthe",
      "ja": "鮮やかな赤色の冷たいハイビスカスティーグラス"
    },
    "fallbackEmoji": "🌺",
    "branchId": "br-aura-fr-saintgermain"
  },
  {
    "id": "br-aura-fr-saintgermain-dish-fr-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Suprême de Volaille Fermière Rôti avec Mousseline de Carottes et Jus Corsé",
      "en": "Lunch of the Day: Roast Farm Poultry Suprême with Carrot Mousseline & Rich Herb Jus",
      "pt": "Almoço do Dia: Supremo de Frango Caipira com Purê de Cenouras e Jus Rústico",
      "fr": "Plat du jour midi: Suprême de volaille fermière rôti, mousseline de carottes au beurre et jus court",
      "ja": "本日のおすすめランチ：農場直送地鶏胸肉のロースト キャロットムースリーヌと特製ジュ"
    },
    "description": {
      "es": "La gran tradición del bistró parisino: velouté de verduras de estación, pechuga dorada con hierbas de Provenza, puré fino de zanahoria a la mantequilla y ensalada verde.",
      "en": "Authentic Parisian bistro lunch: seasonal garden soup, roasted French poultry breast, buttered carrot purée and dressed baby greens.",
      "pt": "Menu bistrô parisiense: sopa leve do dia, peito de frango assado ao jus, purê sedoso de cenouras e salada crocante.",
      "fr": "La formule bistro classique: velouté de saison, suprême de volaille rôti sur peau, mousseline de carottes au beurre noisette et salade de mesclun.",
      "ja": "パリのビストロの定番ランチ：季節のポタージュ、香ばしくローストした地鶏、バター香る人参のムースリーヌ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 27.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato de almuerzo bistro con pollo y puré brillante",
      "en": "Bistro chicken lunch plate with carrot purée",
      "pt": "Prato de almoço bistrô francês com purê",
      "fr": "Assiette bistrot de volaille rôtie et mousseline",
      "ja": "地鶏ローストと色鮮やかな人参ムースリーヌのランチ"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-aura-fr-saintgermain"
  },
  {
    "id": "br-aura-fr-saintgermain-dish-fr-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "drinks",
    "name": {
      "es": "Infusión Helada de Hibisco de Provenza y Menta Fresca",
      "en": "Provence Iced Hibiscus & Garden Mint Infusion",
      "pt": "Infusão Gelada de Hibisco da Provença e Hortelã",
      "fr": "Infusion glacée d’hibiscus de Provence et menthe fraîche du jardin",
      "ja": "プロヴァンス産ハイビスカスと摘みたてミントの自家製アイスハーブティー"
    },
    "description": {
      "es": "Bebida artesanal refrescante sin alcohol elaborada con flores de hibisco infusionadas en frío, toque de lima y hojas de menta.",
      "en": "House-made chilled herbal infusion with whole hibiscus flowers, cold-brewed with lime zest and fresh garden mint.",
      "pt": "Bebida artesanal gelada e refrescante feita com flores de hibisco e hortelã fresca.",
      "fr": "Infusion artisanale rafraîchissante préparée à froid à partir de fleurs d’hibiscus entières et menthe froissée.",
      "ja": "ハイビスカスの花弁を水出し抽出したルビー色の爽やかなアイスティー。ミントとライムの香り。"
    },
    "priceMinorUnits": 750,
    "price": 7.5,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de infusión fría color rubí con hielo y menta",
      "en": "Ruby red iced infusion glass with fresh mint",
      "pt": "Copo de chá gelado vermelho com hortelã",
      "fr": "Verre de thé glacé rouge rubis avec feuilles de menthe",
      "ja": "鮮やかな赤色の冷たいハイビスカスティーグラス"
    },
    "fallbackEmoji": "🌺",
    "branchId": "br-aura-fr-saintgermain"
  },
  {
    "id": "br-sora-fr-opera-dish-fr-sora-01",
    "restaurantId": "brand-sora",
    "countryCode": "FR",
    "category": "starters",
    "name": {
      "es": "Carpaccio de Vieiras Saint-Jacques con Vinagreta de Yuzu",
      "en": "Brittany Sea Scallops Carpaccio with Yuzu Vinaigrette",
      "pt": "Carpaccio de Vieiras Saint-Jacques com Yuzu",
      "fr": "Carpaccio de coquilles Saint-Jacques de Bretagne au yuzu",
      "ja": "ブルターニュ産ホタテ貝柱の薄造り 高知産柚子ヴィネグレット"
    },
    "description": {
      "es": "Vieiras frescas de Bretaña cortadas finas, aliñadas con jugo de yuzu japonés, aceite de oliva virgen y pimienta rosa.",
      "en": "Translucent Brittany sea scallops, dressed with Japanese yuzu juice, extra virgin olive oil and pink peppercorns.",
      "pt": "Vieiras frescas em fatias finas com azeite extravirgem, suco de yuzu e pimenta rosa.",
      "fr": "Noix de Saint-Jacques fraîches tranchées fines, émulsion d’huile d’olive au jus de yuzu et baies roses.",
      "ja": "ブルターニュの港から直送された新鮮な活ホタテを薄造りにし、高知県産柚子の香りで引き締めた冷前菜。"
    },
    "priceMinorUnits": 2600,
    "price": 26,
    "basePriceUSD": 27.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1535400255456-984241443b29?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Finas láminas de vieira con aliño brillante y hierbas",
      "en": "Thin scallop carpaccio slices with citrus dressing",
      "pt": "Lâminas finas de vieira com tempero cítrico",
      "fr": "Carpaccio translucide de Saint-Jacques aux baies",
      "ja": "透明感のあるホタテカルパッチョの盛り付け"
    },
    "fallbackEmoji": "🦪",
    "branchId": "br-sora-fr-opera"
  },
  {
    "id": "br-sora-fr-opera-dish-fr-sora-02",
    "restaurantId": "brand-sora",
    "countryCode": "FR",
    "category": "mains",
    "name": {
      "es": "Plateau Paris-Tokyo de Sushi de Autor (14 Piezas)",
      "en": "Paris-Tokyo Signature Sushi Platter (14 Pcs)",
      "pt": "Combinado Paris-Tóquio de Sushi Autoral (14 Peças)",
      "fr": "Plateau Signature Paris-Tokyo de 14 sushis d’auteur",
      "ja": "宙 (Sora) パリ・東京シグネチャー寿司盛り合わせ（14貫）"
    },
    "description": {
      "es": "Fusión franco-japonesa: atún rojo flameado con sal de Guérande, salmón marinado al eneldo y nigiris con emulsión de trufa.",
      "en": "Franco-Japanese fusion: seared bluefin tuna with Guérande salt, dill-cured salmon and black truffle emulsion nigiri.",
      "pt": "Sushis autorais combinando técnicas de Tóquio e ingredientes franceses nobres com trufas.",
      "fr": "Créations signature: thon rouge mi-cuit fleur de sel, saumon mariné aneth et nigiri à l’huile de truffe noire.",
      "ja": "ゲランド海塩を乗せた本マグロ炙り、ディル風味のサーモン、黒トリュフ香る創作握りの盛り合わせ。"
    },
    "priceMinorUnits": 5800,
    "price": 58,
    "basePriceUSD": 61.5,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Combinado de sushi y maki decorado con esmero",
      "en": "Carefully plated sushi and maki combination",
      "pt": "Combinado de sushis decorados artisticamente",
      "fr": "Plateau gastronomique de sushis artistiques",
      "ja": "美しく盛り付けられた創作寿司のプレート"
    },
    "fallbackEmoji": "🍣",
    "branchId": "br-sora-fr-opera"
  },
  {
    "id": "br-sora-fr-opera-dish-fr-sora-03",
    "restaurantId": "brand-sora",
    "countryCode": "FR",
    "category": "mains",
    "name": {
      "es": "Ramen Sainte-Anne al Pato Confitado y Caldo Shoyu",
      "en": "Sainte-Anne Duck Confit Shoyu Ramen",
      "pt": "Ramen Sainte-Anne de Pato Confitado e Shoyu",
      "fr": "Ramen Sainte-Anne au confit de canard et bouillon Shoyu",
      "ja": "サントノーレ風 鴨コンフィと熟成生醤油の極上ラーメン"
    },
    "description": {
      "es": "Homenaje al barrio japonés de París: caldo aromático de ave y dashi, muslo de pato confitado deshilachado y fideos frescos.",
      "en": "Parisian Japanese district homage: clarified poultry dashi broth, shredded tender duck confit and artisanal noodles.",
      "pt": "Caldo claro aromático de aves e dashi, pato confitado desfiado e massa artesanal de ramen.",
      "fr": "Bouillon shoyu dashi limpide de volaille fermière, cuisse de canard confite effilochée, nouilles fraîches et pousse de bambou.",
      "ja": "鴨肉のコンフィを贅沢にトッピング。丸鶏と厳選魚介出汁に長期熟成醤油を合わせたパリ限定ラーメン。"
    },
    "priceMinorUnits": 2900,
    "price": 29,
    "basePriceUSD": 31,
    "prepTimeMinutes": 14,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de shoyu ramen caliente con pato y verduras",
      "en": "Warm bowl of shoyu ramen with duck and greens",
      "pt": "Tigela de shoyu ramen com pato confitado",
      "fr": "Bol fumant de ramen shoyu au canard",
      "ja": "鴨肉と青菜が乗った澄んだ醤油ラーメン"
    },
    "fallbackEmoji": "🍜",
    "branchId": "br-sora-fr-opera"
  },
  {
    "id": "br-sora-fr-opera-dish-fr-sora-04",
    "restaurantId": "brand-sora",
    "countryCode": "FR",
    "category": "desserts",
    "name": {
      "es": "Profiteroles al Sésamo Negro y Helado de Yuzu",
      "en": "Black Sesame Profiteroles with Yuzu Sorbet",
      "pt": "Profiteroles de Gergelim Preto e Sorbet de Yuzu",
      "fr": "Profiteroles au sésame noir torréfié et sorbet yuzu",
      "ja": "煎り黒胡麻の特製プロフィットロール 高知産柚子ソルベ添え"
    },
    "description": {
      "es": "Choux horneados rellenos de sorbete de yuzu artesanal, cubiertos con coulis templado de sésamo negro tostado de Kioto.",
      "en": "Choux puffs filled with tangy yuzu sorbet, generously draped with warm toasted Kyoto black sesame sauce.",
      "pt": "Carolinas artesanais recheadas com sorvete de yuzu e calda quente de gergelim preto.",
      "fr": "Petits choux au craquelin garnis de sorbet au yuzu rafraîchissant, nappés d’une sauce chaude au sésame noir.",
      "ja": "爽やかな柚子シャーベットを詰めたシュー生地に、香ばしい温かい黒胡麻ソースをとろりとかけたデザート。"
    },
    "priceMinorUnits": 1600,
    "price": 16,
    "basePriceUSD": 17,
    "prepTimeMinutes": 7,
    "available": true,
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Profiteroles bañados en salsa oscura brillante",
      "en": "Profiteroles drizzled with dark glossy sesame sauce",
      "pt": "Profiteroles com calda brilhante de gergelim",
      "fr": "Profiteroles nappées de sauce chocolatée au sésame",
      "ja": "黒胡麻ソースをまとったプロフィットロール"
    },
    "fallbackEmoji": "🥮",
    "branchId": "br-sora-fr-opera"
  },
  {
    "id": "br-sora-fr-opera-dish-fr-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Suprême de Volaille Fermière Rôti avec Mousseline de Carottes et Jus Corsé",
      "en": "Lunch of the Day: Roast Farm Poultry Suprême with Carrot Mousseline & Rich Herb Jus",
      "pt": "Almoço do Dia: Supremo de Frango Caipira com Purê de Cenouras e Jus Rústico",
      "fr": "Plat du jour midi: Suprême de volaille fermière rôti, mousseline de carottes au beurre et jus court",
      "ja": "本日のおすすめランチ：農場直送地鶏胸肉のロースト キャロットムースリーヌと特製ジュ"
    },
    "description": {
      "es": "La gran tradición del bistró parisino: velouté de verduras de estación, pechuga dorada con hierbas de Provenza, puré fino de zanahoria a la mantequilla y ensalada verde.",
      "en": "Authentic Parisian bistro lunch: seasonal garden soup, roasted French poultry breast, buttered carrot purée and dressed baby greens.",
      "pt": "Menu bistrô parisiense: sopa leve do dia, peito de frango assado ao jus, purê sedoso de cenouras e salada crocante.",
      "fr": "La formule bistro classique: velouté de saison, suprême de volaille rôti sur peau, mousseline de carottes au beurre noisette et salade de mesclun.",
      "ja": "パリのビストロの定番ランチ：季節のポタージュ、香ばしくローストした地鶏、バター香る人参のムースリーヌ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 27.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato de almuerzo bistro con pollo y puré brillante",
      "en": "Bistro chicken lunch plate with carrot purée",
      "pt": "Prato de almoço bistrô francês com purê",
      "fr": "Assiette bistrot de volaille rôtie et mousseline",
      "ja": "地鶏ローストと色鮮やかな人参ムースリーヌのランチ"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-sora-fr-opera"
  },
  {
    "id": "br-sora-fr-opera-dish-fr-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "drinks",
    "name": {
      "es": "Infusión Helada de Hibisco de Provenza y Menta Fresca",
      "en": "Provence Iced Hibiscus & Garden Mint Infusion",
      "pt": "Infusão Gelada de Hibisco da Provença e Hortelã",
      "fr": "Infusion glacée d’hibiscus de Provence et menthe fraîche du jardin",
      "ja": "プロヴァンス産ハイビスカスと摘みたてミントの自家製アイスハーブティー"
    },
    "description": {
      "es": "Bebida artesanal refrescante sin alcohol elaborada con flores de hibisco infusionadas en frío, toque de lima y hojas de menta.",
      "en": "House-made chilled herbal infusion with whole hibiscus flowers, cold-brewed with lime zest and fresh garden mint.",
      "pt": "Bebida artesanal gelada e refrescante feita com flores de hibisco e hortelã fresca.",
      "fr": "Infusion artisanale rafraîchissante préparée à froid à partir de fleurs d’hibiscus entières et menthe froissée.",
      "ja": "ハイビスカスの花弁を水出し抽出したルビー色の爽やかなアイスティー。ミントとライムの香り。"
    },
    "priceMinorUnits": 750,
    "price": 7.5,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de infusión fría color rubí con hielo y menta",
      "en": "Ruby red iced infusion glass with fresh mint",
      "pt": "Copo de chá gelado vermelho com hortelã",
      "fr": "Verre de thé glacé rouge rubis avec feuilles de menthe",
      "ja": "鮮やかな赤色の冷たいハイビスカスティーグラス"
    },
    "fallbackEmoji": "🌺",
    "branchId": "br-sora-fr-opera"
  },
  {
    "id": "br-sora-fr-montparnasse-dish-fr-sora-01",
    "restaurantId": "brand-sora",
    "countryCode": "FR",
    "category": "starters",
    "name": {
      "es": "Carpaccio de Vieiras Saint-Jacques con Vinagreta de Yuzu",
      "en": "Brittany Sea Scallops Carpaccio with Yuzu Vinaigrette",
      "pt": "Carpaccio de Vieiras Saint-Jacques com Yuzu",
      "fr": "Carpaccio de coquilles Saint-Jacques de Bretagne au yuzu",
      "ja": "ブルターニュ産ホタテ貝柱の薄造り 高知産柚子ヴィネグレット"
    },
    "description": {
      "es": "Vieiras frescas de Bretaña cortadas finas, aliñadas con jugo de yuzu japonés, aceite de oliva virgen y pimienta rosa.",
      "en": "Translucent Brittany sea scallops, dressed with Japanese yuzu juice, extra virgin olive oil and pink peppercorns.",
      "pt": "Vieiras frescas em fatias finas com azeite extravirgem, suco de yuzu e pimenta rosa.",
      "fr": "Noix de Saint-Jacques fraîches tranchées fines, émulsion d’huile d’olive au jus de yuzu et baies roses.",
      "ja": "ブルターニュの港から直送された新鮮な活ホタテを薄造りにし、高知県産柚子の香りで引き締めた冷前菜。"
    },
    "priceMinorUnits": 2600,
    "price": 26,
    "basePriceUSD": 27.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1535400255456-984241443b29?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Finas láminas de vieira con aliño brillante y hierbas",
      "en": "Thin scallop carpaccio slices with citrus dressing",
      "pt": "Lâminas finas de vieira com tempero cítrico",
      "fr": "Carpaccio translucide de Saint-Jacques aux baies",
      "ja": "透明感のあるホタテカルパッチョの盛り付け"
    },
    "fallbackEmoji": "🦪",
    "branchId": "br-sora-fr-montparnasse"
  },
  {
    "id": "br-sora-fr-montparnasse-dish-fr-sora-02",
    "restaurantId": "brand-sora",
    "countryCode": "FR",
    "category": "mains",
    "name": {
      "es": "Plateau Paris-Tokyo de Sushi de Autor (14 Piezas)",
      "en": "Paris-Tokyo Signature Sushi Platter (14 Pcs)",
      "pt": "Combinado Paris-Tóquio de Sushi Autoral (14 Peças)",
      "fr": "Plateau Signature Paris-Tokyo de 14 sushis d’auteur",
      "ja": "宙 (Sora) パリ・東京シグネチャー寿司盛り合わせ（14貫）"
    },
    "description": {
      "es": "Fusión franco-japonesa: atún rojo flameado con sal de Guérande, salmón marinado al eneldo y nigiris con emulsión de trufa.",
      "en": "Franco-Japanese fusion: seared bluefin tuna with Guérande salt, dill-cured salmon and black truffle emulsion nigiri.",
      "pt": "Sushis autorais combinando técnicas de Tóquio e ingredientes franceses nobres com trufas.",
      "fr": "Créations signature: thon rouge mi-cuit fleur de sel, saumon mariné aneth et nigiri à l’huile de truffe noire.",
      "ja": "ゲランド海塩を乗せた本マグロ炙り、ディル風味のサーモン、黒トリュフ香る創作握りの盛り合わせ。"
    },
    "priceMinorUnits": 5800,
    "price": 58,
    "basePriceUSD": 61.5,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Combinado de sushi y maki decorado con esmero",
      "en": "Carefully plated sushi and maki combination",
      "pt": "Combinado de sushis decorados artisticamente",
      "fr": "Plateau gastronomique de sushis artistiques",
      "ja": "美しく盛り付けられた創作寿司のプレート"
    },
    "fallbackEmoji": "🍣",
    "branchId": "br-sora-fr-montparnasse"
  },
  {
    "id": "br-sora-fr-montparnasse-dish-fr-sora-03",
    "restaurantId": "brand-sora",
    "countryCode": "FR",
    "category": "mains",
    "name": {
      "es": "Ramen Sainte-Anne al Pato Confitado y Caldo Shoyu",
      "en": "Sainte-Anne Duck Confit Shoyu Ramen",
      "pt": "Ramen Sainte-Anne de Pato Confitado e Shoyu",
      "fr": "Ramen Sainte-Anne au confit de canard et bouillon Shoyu",
      "ja": "サントノーレ風 鴨コンフィと熟成生醤油の極上ラーメン"
    },
    "description": {
      "es": "Homenaje al barrio japonés de París: caldo aromático de ave y dashi, muslo de pato confitado deshilachado y fideos frescos.",
      "en": "Parisian Japanese district homage: clarified poultry dashi broth, shredded tender duck confit and artisanal noodles.",
      "pt": "Caldo claro aromático de aves e dashi, pato confitado desfiado e massa artesanal de ramen.",
      "fr": "Bouillon shoyu dashi limpide de volaille fermière, cuisse de canard confite effilochée, nouilles fraîches et pousse de bambou.",
      "ja": "鴨肉のコンフィを贅沢にトッピング。丸鶏と厳選魚介出汁に長期熟成醤油を合わせたパリ限定ラーメン。"
    },
    "priceMinorUnits": 2900,
    "price": 29,
    "basePriceUSD": 31,
    "prepTimeMinutes": 14,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de shoyu ramen caliente con pato y verduras",
      "en": "Warm bowl of shoyu ramen with duck and greens",
      "pt": "Tigela de shoyu ramen com pato confitado",
      "fr": "Bol fumant de ramen shoyu au canard",
      "ja": "鴨肉と青菜が乗った澄んだ醤油ラーメン"
    },
    "fallbackEmoji": "🍜",
    "branchId": "br-sora-fr-montparnasse"
  },
  {
    "id": "br-sora-fr-montparnasse-dish-fr-sora-04",
    "restaurantId": "brand-sora",
    "countryCode": "FR",
    "category": "desserts",
    "name": {
      "es": "Profiteroles al Sésamo Negro y Helado de Yuzu",
      "en": "Black Sesame Profiteroles with Yuzu Sorbet",
      "pt": "Profiteroles de Gergelim Preto e Sorbet de Yuzu",
      "fr": "Profiteroles au sésame noir torréfié et sorbet yuzu",
      "ja": "煎り黒胡麻の特製プロフィットロール 高知産柚子ソルベ添え"
    },
    "description": {
      "es": "Choux horneados rellenos de sorbete de yuzu artesanal, cubiertos con coulis templado de sésamo negro tostado de Kioto.",
      "en": "Choux puffs filled with tangy yuzu sorbet, generously draped with warm toasted Kyoto black sesame sauce.",
      "pt": "Carolinas artesanais recheadas com sorvete de yuzu e calda quente de gergelim preto.",
      "fr": "Petits choux au craquelin garnis de sorbet au yuzu rafraîchissant, nappés d’une sauce chaude au sésame noir.",
      "ja": "爽やかな柚子シャーベットを詰めたシュー生地に、香ばしい温かい黒胡麻ソースをとろりとかけたデザート。"
    },
    "priceMinorUnits": 1600,
    "price": 16,
    "basePriceUSD": 17,
    "prepTimeMinutes": 7,
    "available": true,
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Profiteroles bañados en salsa oscura brillante",
      "en": "Profiteroles drizzled with dark glossy sesame sauce",
      "pt": "Profiteroles com calda brilhante de gergelim",
      "fr": "Profiteroles nappées de sauce chocolatée au sésame",
      "ja": "黒胡麻ソースをまとったプロフィットロール"
    },
    "fallbackEmoji": "🥮",
    "branchId": "br-sora-fr-montparnasse"
  },
  {
    "id": "br-sora-fr-montparnasse-dish-fr-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Suprême de Volaille Fermière Rôti avec Mousseline de Carottes et Jus Corsé",
      "en": "Lunch of the Day: Roast Farm Poultry Suprême with Carrot Mousseline & Rich Herb Jus",
      "pt": "Almoço do Dia: Supremo de Frango Caipira com Purê de Cenouras e Jus Rústico",
      "fr": "Plat du jour midi: Suprême de volaille fermière rôti, mousseline de carottes au beurre et jus court",
      "ja": "本日のおすすめランチ：農場直送地鶏胸肉のロースト キャロットムースリーヌと特製ジュ"
    },
    "description": {
      "es": "La gran tradición del bistró parisino: velouté de verduras de estación, pechuga dorada con hierbas de Provenza, puré fino de zanahoria a la mantequilla y ensalada verde.",
      "en": "Authentic Parisian bistro lunch: seasonal garden soup, roasted French poultry breast, buttered carrot purée and dressed baby greens.",
      "pt": "Menu bistrô parisiense: sopa leve do dia, peito de frango assado ao jus, purê sedoso de cenouras e salada crocante.",
      "fr": "La formule bistro classique: velouté de saison, suprême de volaille rôti sur peau, mousseline de carottes au beurre noisette et salade de mesclun.",
      "ja": "パリのビストロの定番ランチ：季節のポタージュ、香ばしくローストした地鶏、バター香る人参のムースリーヌ。"
    },
    "priceMinorUnits": 2590,
    "price": 25.9,
    "basePriceUSD": 27.5,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato de almuerzo bistro con pollo y puré brillante",
      "en": "Bistro chicken lunch plate with carrot purée",
      "pt": "Prato de almoço bistrô francês com purê",
      "fr": "Assiette bistrot de volaille rôtie et mousseline",
      "ja": "地鶏ローストと色鮮やかな人参ムースリーヌのランチ"
    },
    "fallbackEmoji": "🍽️",
    "branchId": "br-sora-fr-montparnasse"
  },
  {
    "id": "br-sora-fr-montparnasse-dish-fr-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "FR",
    "category": "drinks",
    "name": {
      "es": "Infusión Helada de Hibisco de Provenza y Menta Fresca",
      "en": "Provence Iced Hibiscus & Garden Mint Infusion",
      "pt": "Infusão Gelada de Hibisco da Provença e Hortelã",
      "fr": "Infusion glacée d’hibiscus de Provence et menthe fraîche du jardin",
      "ja": "プロヴァンス産ハイビスカスと摘みたてミントの自家製アイスハーブティー"
    },
    "description": {
      "es": "Bebida artesanal refrescante sin alcohol elaborada con flores de hibisco infusionadas en frío, toque de lima y hojas de menta.",
      "en": "House-made chilled herbal infusion with whole hibiscus flowers, cold-brewed with lime zest and fresh garden mint.",
      "pt": "Bebida artesanal gelada e refrescante feita com flores de hibisco e hortelã fresca.",
      "fr": "Infusion artisanale rafraîchissante préparée à froid à partir de fleurs d’hibiscus entières et menthe froissée.",
      "ja": "ハイビスカスの花弁を水出し抽出したルビー色の爽やかなアイスティー。ミントとライムの香り。"
    },
    "priceMinorUnits": 750,
    "price": 7.5,
    "basePriceUSD": 8,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de infusión fría color rubí con hielo y menta",
      "en": "Ruby red iced infusion glass with fresh mint",
      "pt": "Copo de chá gelado vermelho com hortelã",
      "fr": "Verre de thé glacé rouge rubis avec feuilles de menthe",
      "ja": "鮮やかな赤色の冷たいハイビスカスティーグラス"
    },
    "fallbackEmoji": "🌺",
    "branchId": "br-sora-fr-montparnasse"
  },
  {
    "id": "br-aura-jp-shibuya-dish-jp-aura-01",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "starters",
    "name": {
      "es": "Gyoza Artesanal de Cerdo Ibérico y Col de Kanto",
      "en": "Pan-Fried Crispy Iberian Pork & Kanto Cabbage Gyoza",
      "pt": "Gyoza Artesanal Crocante de Porco Ibérico",
      "fr": "Gyoza croustillants au porc ibérique et chou de Kanto",
      "ja": "イベリコ豚と関東産朝採れキャベツの自家製羽根つき焼き餃子"
    },
    "description": {
      "es": "Empanadillas japonesas con fina masa casera sellada a la plancha con costra crujiente de almidón y salsa de soja y sésamo.",
      "en": "Handmade Japanese potstickers with crispy lace lattice crust, juicy pork and cabbage filling, served with soy vinegar dipping sauce.",
      "pt": "Pasteizinhos japoneses grelhados com crosta crocante rendada, recheados com porco suculento.",
      "fr": "Raviolis japonais dorés avec dentelle croustillante, farce fondante au porc et sauce soja pimentée.",
      "ja": "薄皮でジューシーな餡を包み、パリッとした羽根つきに焼き上げた極上の手作り焼き餃子。"
    },
    "priceMinorUnits": 1200,
    "price": 1200,
    "basePriceUSD": 7.74,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato de gyozas con base dorada y crujiente",
      "en": "Golden pan-fried gyoza dumplings on plate",
      "pt": "Prato de gyozas dourados com crosta crocante",
      "fr": "Assiette de raviolis gyoza dorés à point",
      "ja": "香ばしい焼き目がついた羽根つき焼き餃子"
    },
    "fallbackEmoji": "🥟",
    "branchId": "br-aura-jp-shibuya"
  },
  {
    "id": "br-aura-jp-shibuya-dish-jp-aura-02",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "mains",
    "name": {
      "es": "Bife de Wagyu A5 de Miyazaki a la Plancha Teppan (150g)",
      "en": "Miyazaki A5 Wagyu Teppanyaki Sirloin (150g)",
      "pt": "Bife de Wagyu A5 de Miyazaki no Teppan (150g)",
      "fr": "Steak de Wagyu A5 de Miyazaki au Teppan (150g)",
      "ja": "宮崎牛 A5等級 特選サーロイン 鉄板焼き (150g)"
    },
    "description": {
      "es": "Corte con marmoleado supremo A5 sellado en plancha de hierro teppan, acompañado de chips de ajo crujiente y sal volcánica.",
      "en": "Supreme A5 marbling Wagyu beef seared on high-heat teppan iron, served with crispy garlic chips and wasabi salt.",
      "pt": "Carne nobre Wagyu A5 com marmoreio perfeito, selada na chapa com alho frito crocante e wasabi.",
      "fr": "Bœuf japonais Wagyu d’exception persillé A5, saisi sur plaque de fer, chips d’ail et sel de wasabi.",
      "ja": "極上のサシが入った宮崎県産A5黒毛和牛を鉄板で絶妙に焼き上げ、ガーリックチップと本わさびで味わう至高の肉料理。"
    },
    "priceMinorUnits": 8800,
    "price": 8800,
    "basePriceUSD": 56.77,
    "prepTimeMinutes": 15,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Dados de carne wagyu sellados a la plancha",
      "en": "Tender cubes of grilled wagyu beef on teppan",
      "pt": "Cubos suculentos de carne wagyu na chapa",
      "fr": "Morceaux tendres de bœuf wagyu saisis au teppan",
      "ja": "鉄板で香ばしく焼き上げられた極上和牛サーロイン"
    },
    "fallbackEmoji": "🥩",
    "branchId": "br-aura-jp-shibuya"
  },
  {
    "id": "br-aura-jp-shibuya-dish-jp-aura-03",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "mains",
    "name": {
      "es": "Tonkatsu Kurobuta Extra Crujiente con Arroz Niigata",
      "en": "Crispy Berkshire Pork Tonkatsu with Niigata Rice",
      "pt": "Tonkatsu Crocante de Porco Preto com Arroz de Niigata",
      "fr": "Tonkatsu de porc noir pané et riz Koshihikari",
      "ja": "鹿児島県産黒豚 特選ロースかつ御膳 新潟魚沼産コシヒカリ"
    },
    "description": {
      "es": "Lomo de cerdo negro japonés rebozado en panko fresco y frito a temperatura controlada, con col finamente cortada y sopa miso.",
      "en": "Thick cut Berkshire pork loin breaded in fresh panko flakes and fried golden, served with shredded cabbage and Niigata rice.",
      "pt": "Lombo de porco empanado na farinha panko fresca e frito até dourar, com repolho fino e arroz.",
      "fr": "Épaisse côtelette de porc noir panée à la chapelure panko dorée, servie avec chou émincé et riz japonais.",
      "ja": "鹿児島産黒豚ロースを生パン粉でサクッと揚げた肉厚とんかつ。千切りキャベツと魚沼産コシヒカリの御膳。"
    },
    "priceMinorUnits": 3200,
    "price": 3200,
    "basePriceUSD": 20.64,
    "prepTimeMinutes": 14,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Chuleta de cerdo empanada y cortada en rebanadas gruesas",
      "en": "Sliced crispy breaded pork cutlet with cabbage",
      "pt": "Costeleta de porco empanada cortada em tiras",
      "fr": "Escalope de porc panée découpée en tranches",
      "ja": "サクサクの衣をまとった肉厚なロースかつ"
    },
    "fallbackEmoji": "🍱",
    "branchId": "br-aura-jp-shibuya"
  },
  {
    "id": "br-aura-jp-shibuya-dish-jp-aura-04",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "desserts",
    "name": {
      "es": "Dorayaki Tradicional Relleno de Anko de Azuki de Hokkaido",
      "en": "Artisanal Dorayaki Pancakes with Hokkaido Red Bean",
      "pt": "Dorayaki Tradicional Recheado com Doce de Feijão Azuki",
      "fr": "Dorayaki artisanal moelleux au haricot rouge de Hokkaido",
      "ja": "北海道産特選十勝小豆の手焼き職人どら焼き"
    },
    "description": {
      "es": "Esponjosos panqueques japoneses de miel cocidos al momento con relleno generoso de pasta dulce de judías rojas azuki.",
      "en": "Fluffy honey castella pancakes sandwiching sweet artisanal red bean paste from Tokachi, Hokkaido.",
      "pt": "Panquecas fofas de mel recheadas com pasta doce de feijão azuki de Hokkaido.",
      "fr": "Pancakes japonais moelleux au miel de châtaignier fourrés d’une pâte de haricot rouge azuki fondante.",
      "ja": "蜂蜜を練り込んだふわふわの生地に、北海道十勝産小豆を丁寧に炊き上げた粒あんを挟んだ名物どら焼き。"
    },
    "priceMinorUnits": 800,
    "price": 800,
    "basePriceUSD": 5.16,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Panqueque dorayaki relleno de pasta de judía roja",
      "en": "Traditional dorayaki pancake with red bean paste",
      "pt": "Dorayaki japonês recheado cortado ao meio",
      "fr": "Pancake dorayaki garni de pâte de haricot azuki",
      "ja": "粒あんがたっぷり詰まった手焼きどら焼き"
    },
    "fallbackEmoji": "🥞",
    "branchId": "br-aura-jp-shibuya"
  },
  {
    "id": "br-aura-jp-shibuya-dish-jp-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Teishoku de Pollo Asado Teriyaki con Arroz y Miso",
      "en": "Lunch of the Day: Charcoal Teriyaki Chicken Teishoku with Rice & Miso",
      "pt": "Almoço do Dia: Teishoku de Frango Teriyaki com Arroz e Sopa Miso",
      "fr": "Plat du jour midi: Teishoku au poulet grillé teriyaki, riz blanc et soupe miso",
      "ja": "本日のおすすめランチ：若鶏の炭火照り焼き定食（小鉢・炊きたてご飯・赤出汁味噌汁付き）"
    },
    "description": {
      "es": "El almuerzo tradicional teishoku: sopa miso casera, muslo de pollo a la brasa con salsa teriyaki de soja madurada, arroz al vapor y encurtidos tsukemono.",
      "en": "The authentic Japanese business teishoku set: fresh miso soup, charcoal-grilled chicken in aged soy teriyaki, steamed rice and pickles.",
      "pt": "Menu executivo tradicional japonês: sopa de missô, frango grelhado no teriyaki artesanal, arroz japonês e conservas.",
      "fr": "La formule teishoku de midi par excellence: soupe miso fumante, poulet grillé au charbon nappé de teriyaki maison, riz vapeur et pickles.",
      "ja": "備長炭でじっくり焼き上げた若鶏の照り焼き、炊きたてご飯、出汁香る赤出汁味噌汁、自家製漬物がセットになった日替わり定食。"
    },
    "priceMinorUnits": 2590,
    "price": 2590,
    "basePriceUSD": 16.7,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Bandeja tradicional de almuerzo teishoku con cuencos de arroz y miso",
      "en": "Traditional teishoku lunch tray with rice and miso bowls",
      "pt": "Bandeja de almoço teishoku tradicional com arroz e sopa",
      "fr": "Plateau repas teishoku avec bols de riz et soupe miso",
      "ja": "ご飯と味噌汁、香の物が整然と並んだ和食の定食トレイ"
    },
    "fallbackEmoji": "🍱",
    "branchId": "br-aura-jp-shibuya"
  },
  {
    "id": "br-aura-jp-shibuya-dish-jp-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "drinks",
    "name": {
      "es": "Té Verde Matcha Helado de Uji con Toque de Yuzu",
      "en": "Iced Kyoto Uji Matcha with Fresh Yuzu Essence",
      "pt": "Chá Matcha Gelado de Uji com Toque de Yuzu",
      "fr": "Thé vert matcha glacé d’Uji et zeste de yuzu",
      "ja": "宇治産一番茶の特製アイス抹茶 高知県産生柚子仕立て"
    },
    "description": {
      "es": "Té verde ceremonial batido al momento con batidor de bambú chasen, servido frío sobre cubos de hielo con un sutil aroma de corteza de yuzu.",
      "en": "Ceremonial grade green tea whisked fresh with bamboo chasen, served over crystal ice with delicate fresh yuzu citrus aroma.",
      "pt": "Chá verde cerimonial batido na hora com batedor de bambu, servido gelado com toque aromático de yuzu.",
      "fr": "Thé matcha de cérémonie fouetté minute au chasen en bambou, servi sur glace cristalline avec une note fraîche de zeste de yuzu.",
      "ja": "京都宇治の一番摘み茶葉を伝統の茶筅で丁寧に点て、高知産柚子の爽やかな香りを添えた冷涼な一杯。"
    },
    "priceMinorUnits": 700,
    "price": 700,
    "basePriceUSD": 4.51,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de té matcha verde brillante con hielo",
      "en": "Glass of bright green iced matcha tea with ice",
      "pt": "Copo de chá matcha verde vivo com gelo",
      "fr": "Verre de thé matcha vert éclatant avec glaçons",
      "ja": "鮮やかな緑色が引き立つ氷入りアイス抹茶"
    },
    "fallbackEmoji": "🍵",
    "branchId": "br-aura-jp-shibuya"
  },
  {
    "id": "br-aura-jp-shibuya-dish-jp-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Teishoku de Pollo Asado Teriyaki con Arroz y Miso",
      "en": "Lunch of the Day: Charcoal Teriyaki Chicken Teishoku with Rice & Miso",
      "pt": "Almoço do Dia: Teishoku de Frango Teriyaki com Arroz e Sopa Miso",
      "fr": "Plat du jour midi: Teishoku au poulet grillé teriyaki, riz blanc et soupe miso",
      "ja": "本日のおすすめランチ：若鶏の炭火照り焼き定食（小鉢・炊きたてご飯・赤出汁味噌汁付き）"
    },
    "description": {
      "es": "El almuerzo tradicional teishoku: sopa miso casera, muslo de pollo a la brasa con salsa teriyaki de soja madurada, arroz al vapor y encurtidos tsukemono.",
      "en": "The authentic Japanese business teishoku set: fresh miso soup, charcoal-grilled chicken in aged soy teriyaki, steamed rice and pickles.",
      "pt": "Menu executivo tradicional japonês: sopa de missô, frango grelhado no teriyaki artesanal, arroz japonês e conservas.",
      "fr": "La formule teishoku de midi par excellence: soupe miso fumante, poulet grillé au charbon nappé de teriyaki maison, riz vapeur et pickles.",
      "ja": "備長炭でじっくり焼き上げた若鶏の照り焼き、炊きたてご飯、出汁香る赤出汁味噌汁、自家製漬物がセットになった日替わり定食。"
    },
    "priceMinorUnits": 2590,
    "price": 2590,
    "basePriceUSD": 16.7,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Bandeja tradicional de almuerzo teishoku con cuencos de arroz y miso",
      "en": "Traditional teishoku lunch tray with rice and miso bowls",
      "pt": "Bandeja de almoço teishoku tradicional com arroz e sopa",
      "fr": "Plateau repas teishoku avec bols de riz et soupe miso",
      "ja": "ご飯と味噌汁、香の物が整然と並んだ和食の定食トレイ"
    },
    "fallbackEmoji": "🍱",
    "branchId": "br-aura-jp-shibuya"
  },
  {
    "id": "br-aura-jp-shibuya-dish-jp-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "drinks",
    "name": {
      "es": "Té Verde Matcha Helado de Uji con Toque de Yuzu",
      "en": "Iced Kyoto Uji Matcha with Fresh Yuzu Essence",
      "pt": "Chá Matcha Gelado de Uji com Toque de Yuzu",
      "fr": "Thé vert matcha glacé d’Uji et zeste de yuzu",
      "ja": "宇治産一番茶の特製アイス抹茶 高知県産生柚子仕立て"
    },
    "description": {
      "es": "Té verde ceremonial batido al momento con batidor de bambú chasen, servido frío sobre cubos de hielo con un sutil aroma de corteza de yuzu.",
      "en": "Ceremonial grade green tea whisked fresh with bamboo chasen, served over crystal ice with delicate fresh yuzu citrus aroma.",
      "pt": "Chá verde cerimonial batido na hora com batedor de bambu, servido gelado com toque aromático de yuzu.",
      "fr": "Thé matcha de cérémonie fouetté minute au chasen en bambou, servi sur glace cristalline avec une note fraîche de zeste de yuzu.",
      "ja": "京都宇治の一番摘み茶葉を伝統の茶筅で丁寧に点て、高知産柚子の爽やかな香りを添えた冷涼な一杯。"
    },
    "priceMinorUnits": 700,
    "price": 700,
    "basePriceUSD": 4.51,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de té matcha verde brillante con hielo",
      "en": "Glass of bright green iced matcha tea with ice",
      "pt": "Copo de chá matcha verde vivo com gelo",
      "fr": "Verre de thé matcha vert éclatant avec glaçons",
      "ja": "鮮やかな緑色が引き立つ氷入りアイス抹茶"
    },
    "fallbackEmoji": "🍵",
    "branchId": "br-aura-jp-shibuya"
  },
  {
    "id": "br-aura-jp-roppongi-dish-jp-aura-01",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "starters",
    "name": {
      "es": "Gyoza Artesanal de Cerdo Ibérico y Col de Kanto",
      "en": "Pan-Fried Crispy Iberian Pork & Kanto Cabbage Gyoza",
      "pt": "Gyoza Artesanal Crocante de Porco Ibérico",
      "fr": "Gyoza croustillants au porc ibérique et chou de Kanto",
      "ja": "イベリコ豚と関東産朝採れキャベツの自家製羽根つき焼き餃子"
    },
    "description": {
      "es": "Empanadillas japonesas con fina masa casera sellada a la plancha con costra crujiente de almidón y salsa de soja y sésamo.",
      "en": "Handmade Japanese potstickers with crispy lace lattice crust, juicy pork and cabbage filling, served with soy vinegar dipping sauce.",
      "pt": "Pasteizinhos japoneses grelhados com crosta crocante rendada, recheados com porco suculento.",
      "fr": "Raviolis japonais dorés avec dentelle croustillante, farce fondante au porc et sauce soja pimentée.",
      "ja": "薄皮でジューシーな餡を包み、パリッとした羽根つきに焼き上げた極上の手作り焼き餃子。"
    },
    "priceMinorUnits": 1200,
    "price": 1200,
    "basePriceUSD": 7.74,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Plato de gyozas con base dorada y crujiente",
      "en": "Golden pan-fried gyoza dumplings on plate",
      "pt": "Prato de gyozas dourados com crosta crocante",
      "fr": "Assiette de raviolis gyoza dorés à point",
      "ja": "香ばしい焼き目がついた羽根つき焼き餃子"
    },
    "fallbackEmoji": "🥟",
    "branchId": "br-aura-jp-roppongi"
  },
  {
    "id": "br-aura-jp-roppongi-dish-jp-aura-02",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "mains",
    "name": {
      "es": "Bife de Wagyu A5 de Miyazaki a la Plancha Teppan (150g)",
      "en": "Miyazaki A5 Wagyu Teppanyaki Sirloin (150g)",
      "pt": "Bife de Wagyu A5 de Miyazaki no Teppan (150g)",
      "fr": "Steak de Wagyu A5 de Miyazaki au Teppan (150g)",
      "ja": "宮崎牛 A5等級 特選サーロイン 鉄板焼き (150g)"
    },
    "description": {
      "es": "Corte con marmoleado supremo A5 sellado en plancha de hierro teppan, acompañado de chips de ajo crujiente y sal volcánica.",
      "en": "Supreme A5 marbling Wagyu beef seared on high-heat teppan iron, served with crispy garlic chips and wasabi salt.",
      "pt": "Carne nobre Wagyu A5 com marmoreio perfeito, selada na chapa com alho frito crocante e wasabi.",
      "fr": "Bœuf japonais Wagyu d’exception persillé A5, saisi sur plaque de fer, chips d’ail et sel de wasabi.",
      "ja": "極上のサシが入った宮崎県産A5黒毛和牛を鉄板で絶妙に焼き上げ、ガーリックチップと本わさびで味わう至高の肉料理。"
    },
    "priceMinorUnits": 8800,
    "price": 8800,
    "basePriceUSD": 56.77,
    "prepTimeMinutes": 15,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Dados de carne wagyu sellados a la plancha",
      "en": "Tender cubes of grilled wagyu beef on teppan",
      "pt": "Cubos suculentos de carne wagyu na chapa",
      "fr": "Morceaux tendres de bœuf wagyu saisis au teppan",
      "ja": "鉄板で香ばしく焼き上げられた極上和牛サーロイン"
    },
    "fallbackEmoji": "🥩",
    "branchId": "br-aura-jp-roppongi"
  },
  {
    "id": "br-aura-jp-roppongi-dish-jp-aura-03",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "mains",
    "name": {
      "es": "Tonkatsu Kurobuta Extra Crujiente con Arroz Niigata",
      "en": "Crispy Berkshire Pork Tonkatsu with Niigata Rice",
      "pt": "Tonkatsu Crocante de Porco Preto com Arroz de Niigata",
      "fr": "Tonkatsu de porc noir pané et riz Koshihikari",
      "ja": "鹿児島県産黒豚 特選ロースかつ御膳 新潟魚沼産コシヒカリ"
    },
    "description": {
      "es": "Lomo de cerdo negro japonés rebozado en panko fresco y frito a temperatura controlada, con col finamente cortada y sopa miso.",
      "en": "Thick cut Berkshire pork loin breaded in fresh panko flakes and fried golden, served with shredded cabbage and Niigata rice.",
      "pt": "Lombo de porco empanado na farinha panko fresca e frito até dourar, com repolho fino e arroz.",
      "fr": "Épaisse côtelette de porc noir panée à la chapelure panko dorée, servie avec chou émincé et riz japonais.",
      "ja": "鹿児島産黒豚ロースを生パン粉でサクッと揚げた肉厚とんかつ。千切りキャベツと魚沼産コシヒカリの御膳。"
    },
    "priceMinorUnits": 3200,
    "price": 3200,
    "basePriceUSD": 20.64,
    "prepTimeMinutes": 14,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Chuleta de cerdo empanada y cortada en rebanadas gruesas",
      "en": "Sliced crispy breaded pork cutlet with cabbage",
      "pt": "Costeleta de porco empanada cortada em tiras",
      "fr": "Escalope de porc panée découpée en tranches",
      "ja": "サクサクの衣をまとった肉厚なロースかつ"
    },
    "fallbackEmoji": "🍱",
    "branchId": "br-aura-jp-roppongi"
  },
  {
    "id": "br-aura-jp-roppongi-dish-jp-aura-04",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "desserts",
    "name": {
      "es": "Dorayaki Tradicional Relleno de Anko de Azuki de Hokkaido",
      "en": "Artisanal Dorayaki Pancakes with Hokkaido Red Bean",
      "pt": "Dorayaki Tradicional Recheado com Doce de Feijão Azuki",
      "fr": "Dorayaki artisanal moelleux au haricot rouge de Hokkaido",
      "ja": "北海道産特選十勝小豆の手焼き職人どら焼き"
    },
    "description": {
      "es": "Esponjosos panqueques japoneses de miel cocidos al momento con relleno generoso de pasta dulce de judías rojas azuki.",
      "en": "Fluffy honey castella pancakes sandwiching sweet artisanal red bean paste from Tokachi, Hokkaido.",
      "pt": "Panquecas fofas de mel recheadas com pasta doce de feijão azuki de Hokkaido.",
      "fr": "Pancakes japonais moelleux au miel de châtaignier fourrés d’une pâte de haricot rouge azuki fondante.",
      "ja": "蜂蜜を練り込んだふわふわの生地に、北海道十勝産小豆を丁寧に炊き上げた粒あんを挟んだ名物どら焼き。"
    },
    "priceMinorUnits": 800,
    "price": 800,
    "basePriceUSD": 5.16,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Panqueque dorayaki relleno de pasta de judía roja",
      "en": "Traditional dorayaki pancake with red bean paste",
      "pt": "Dorayaki japonês recheado cortado ao meio",
      "fr": "Pancake dorayaki garni de pâte de haricot azuki",
      "ja": "粒あんがたっぷり詰まった手焼きどら焼き"
    },
    "fallbackEmoji": "🥞",
    "branchId": "br-aura-jp-roppongi"
  },
  {
    "id": "br-aura-jp-roppongi-dish-jp-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Teishoku de Pollo Asado Teriyaki con Arroz y Miso",
      "en": "Lunch of the Day: Charcoal Teriyaki Chicken Teishoku with Rice & Miso",
      "pt": "Almoço do Dia: Teishoku de Frango Teriyaki com Arroz e Sopa Miso",
      "fr": "Plat du jour midi: Teishoku au poulet grillé teriyaki, riz blanc et soupe miso",
      "ja": "本日のおすすめランチ：若鶏の炭火照り焼き定食（小鉢・炊きたてご飯・赤出汁味噌汁付き）"
    },
    "description": {
      "es": "El almuerzo tradicional teishoku: sopa miso casera, muslo de pollo a la brasa con salsa teriyaki de soja madurada, arroz al vapor y encurtidos tsukemono.",
      "en": "The authentic Japanese business teishoku set: fresh miso soup, charcoal-grilled chicken in aged soy teriyaki, steamed rice and pickles.",
      "pt": "Menu executivo tradicional japonês: sopa de missô, frango grelhado no teriyaki artesanal, arroz japonês e conservas.",
      "fr": "La formule teishoku de midi par excellence: soupe miso fumante, poulet grillé au charbon nappé de teriyaki maison, riz vapeur et pickles.",
      "ja": "備長炭でじっくり焼き上げた若鶏の照り焼き、炊きたてご飯、出汁香る赤出汁味噌汁、自家製漬物がセットになった日替わり定食。"
    },
    "priceMinorUnits": 2590,
    "price": 2590,
    "basePriceUSD": 16.7,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Bandeja tradicional de almuerzo teishoku con cuencos de arroz y miso",
      "en": "Traditional teishoku lunch tray with rice and miso bowls",
      "pt": "Bandeja de almoço teishoku tradicional com arroz e sopa",
      "fr": "Plateau repas teishoku avec bols de riz et soupe miso",
      "ja": "ご飯と味噌汁、香の物が整然と並んだ和食の定食トレイ"
    },
    "fallbackEmoji": "🍱",
    "branchId": "br-aura-jp-roppongi"
  },
  {
    "id": "br-aura-jp-roppongi-dish-jp-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "drinks",
    "name": {
      "es": "Té Verde Matcha Helado de Uji con Toque de Yuzu",
      "en": "Iced Kyoto Uji Matcha with Fresh Yuzu Essence",
      "pt": "Chá Matcha Gelado de Uji com Toque de Yuzu",
      "fr": "Thé vert matcha glacé d’Uji et zeste de yuzu",
      "ja": "宇治産一番茶の特製アイス抹茶 高知県産生柚子仕立て"
    },
    "description": {
      "es": "Té verde ceremonial batido al momento con batidor de bambú chasen, servido frío sobre cubos de hielo con un sutil aroma de corteza de yuzu.",
      "en": "Ceremonial grade green tea whisked fresh with bamboo chasen, served over crystal ice with delicate fresh yuzu citrus aroma.",
      "pt": "Chá verde cerimonial batido na hora com batedor de bambu, servido gelado com toque aromático de yuzu.",
      "fr": "Thé matcha de cérémonie fouetté minute au chasen en bambou, servi sur glace cristalline avec une note fraîche de zeste de yuzu.",
      "ja": "京都宇治の一番摘み茶葉を伝統の茶筅で丁寧に点て、高知産柚子の爽やかな香りを添えた冷涼な一杯。"
    },
    "priceMinorUnits": 700,
    "price": 700,
    "basePriceUSD": 4.51,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de té matcha verde brillante con hielo",
      "en": "Glass of bright green iced matcha tea with ice",
      "pt": "Copo de chá matcha verde vivo com gelo",
      "fr": "Verre de thé matcha vert éclatant avec glaçons",
      "ja": "鮮やかな緑色が引き立つ氷入りアイス抹茶"
    },
    "fallbackEmoji": "🍵",
    "branchId": "br-aura-jp-roppongi"
  },
  {
    "id": "br-aura-jp-roppongi-dish-jp-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Teishoku de Pollo Asado Teriyaki con Arroz y Miso",
      "en": "Lunch of the Day: Charcoal Teriyaki Chicken Teishoku with Rice & Miso",
      "pt": "Almoço do Dia: Teishoku de Frango Teriyaki com Arroz e Sopa Miso",
      "fr": "Plat du jour midi: Teishoku au poulet grillé teriyaki, riz blanc et soupe miso",
      "ja": "本日のおすすめランチ：若鶏の炭火照り焼き定食（小鉢・炊きたてご飯・赤出汁味噌汁付き）"
    },
    "description": {
      "es": "El almuerzo tradicional teishoku: sopa miso casera, muslo de pollo a la brasa con salsa teriyaki de soja madurada, arroz al vapor y encurtidos tsukemono.",
      "en": "The authentic Japanese business teishoku set: fresh miso soup, charcoal-grilled chicken in aged soy teriyaki, steamed rice and pickles.",
      "pt": "Menu executivo tradicional japonês: sopa de missô, frango grelhado no teriyaki artesanal, arroz japonês e conservas.",
      "fr": "La formule teishoku de midi par excellence: soupe miso fumante, poulet grillé au charbon nappé de teriyaki maison, riz vapeur et pickles.",
      "ja": "備長炭でじっくり焼き上げた若鶏の照り焼き、炊きたてご飯、出汁香る赤出汁味噌汁、自家製漬物がセットになった日替わり定食。"
    },
    "priceMinorUnits": 2590,
    "price": 2590,
    "basePriceUSD": 16.7,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Bandeja tradicional de almuerzo teishoku con cuencos de arroz y miso",
      "en": "Traditional teishoku lunch tray with rice and miso bowls",
      "pt": "Bandeja de almoço teishoku tradicional com arroz e sopa",
      "fr": "Plateau repas teishoku avec bols de riz et soupe miso",
      "ja": "ご飯と味噌汁、香の物が整然と並んだ和食の定食トレイ"
    },
    "fallbackEmoji": "🍱",
    "branchId": "br-aura-jp-roppongi"
  },
  {
    "id": "br-aura-jp-roppongi-dish-jp-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "drinks",
    "name": {
      "es": "Té Verde Matcha Helado de Uji con Toque de Yuzu",
      "en": "Iced Kyoto Uji Matcha with Fresh Yuzu Essence",
      "pt": "Chá Matcha Gelado de Uji com Toque de Yuzu",
      "fr": "Thé vert matcha glacé d’Uji et zeste de yuzu",
      "ja": "宇治産一番茶の特製アイス抹茶 高知県産生柚子仕立て"
    },
    "description": {
      "es": "Té verde ceremonial batido al momento con batidor de bambú chasen, servido frío sobre cubos de hielo con un sutil aroma de corteza de yuzu.",
      "en": "Ceremonial grade green tea whisked fresh with bamboo chasen, served over crystal ice with delicate fresh yuzu citrus aroma.",
      "pt": "Chá verde cerimonial batido na hora com batedor de bambu, servido gelado com toque aromático de yuzu.",
      "fr": "Thé matcha de cérémonie fouetté minute au chasen en bambou, servi sur glace cristalline avec une note fraîche de zeste de yuzu.",
      "ja": "京都宇治の一番摘み茶葉を伝統の茶筅で丁寧に点て、高知産柚子の爽やかな香りを添えた冷涼な一杯。"
    },
    "priceMinorUnits": 700,
    "price": 700,
    "basePriceUSD": 4.51,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de té matcha verde brillante con hielo",
      "en": "Glass of bright green iced matcha tea with ice",
      "pt": "Copo de chá matcha verde vivo com gelo",
      "fr": "Verre de thé matcha vert éclatant avec glaçons",
      "ja": "鮮やかな緑色が引き立つ氷入りアイス抹茶"
    },
    "fallbackEmoji": "🍵",
    "branchId": "br-aura-jp-roppongi"
  },
  {
    "id": "br-sora-jp-ginza-dish-jp-sora-01",
    "restaurantId": "brand-sora",
    "countryCode": "JP",
    "category": "starters",
    "name": {
      "es": "Edamame Salteado con Ajo Tostado y Shichimi Togarashi",
      "en": "Wok-Tossed Edamame with Garlic & Shichimi Pepper",
      "pt": "Edamame Salteado no Wok com Alho e Pimenta Shichimi",
      "fr": "Edamame sauté au wok à l’ail rôti et piment shichimi",
      "ja": "朝採れ枝豆の焦がしガーリック七味炒め"
    },
    "description": {
      "es": "Vainas tiernas de soja salteadas al wok a fuego vivo con aceite de sésamo tostado, ajo laminado y siete especias japonesas.",
      "en": "Tender young soybean pods wok-charred with roasted sesame oil, crisp garlic flakes and seven-spice blend.",
      "pt": "Vagens frescas de soja salteadas na wok com óleo de gergelim, lascas de alho e pimenta japonesa.",
      "fr": "Fèves de soja fraîches sautées à feu vif à l’huile de sésame torréfié, ail croustillant et mélange shichimi.",
      "ja": "採れたての新鮮な枝豆を高温の中華鍋で素早く炒め、香ばしいニンニクと特製七味唐辛子を絡めた前菜。"
    },
    "priceMinorUnits": 900,
    "price": 900,
    "basePriceUSD": 5.8,
    "prepTimeMinutes": 6,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vainas verdes de edamame con copos de sal y ajo",
      "en": "Bowl of green edamame pods with garlic flakes",
      "pt": "Tigela de edamame verde temperado com alho",
      "fr": "Bol de cosses d’edamame vert vif et épices",
      "ja": "ガーリックチップと七味がまぶされた熱々の枝豆"
    },
    "fallbackEmoji": "🫘",
    "branchId": "br-sora-jp-ginza"
  },
  {
    "id": "br-sora-jp-ginza-dish-jp-sora-02",
    "restaurantId": "brand-sora",
    "countryCode": "JP",
    "category": "mains",
    "name": {
      "es": "Sora Ginza Honten Nigiri Kiwami (12 Piezas de Autor)",
      "en": "Sora Ginza Flagship \"Kiwami\" Supreme Nigiri (12 Pcs)",
      "pt": "Combinado Sora Ginza Kiwami de Nigiris Nobres (12 Peças)",
      "fr": "Assortiment Sora Ginza «Kiwami» de 12 nigiris d’exception",
      "ja": "宙 (Sora) 銀座本店 特選極み握り（12貫厳選・赤酢仕立て）"
    },
    "description": {
      "es": "El estandarte de la casa matriz en Ginza: arroz sazonado con vinagre rojo akazu, atún de Toyosu, erizo de mar y anguila glaseada.",
      "en": "Ginza flagship masterwork: traditional Edo-mae akazu red vinegar rice, bluefin otoro, Hokkaido uni, and glazed unagi.",
      "pt": "O ápice da gastronomia de Ginza: arroz de vinagre vermelho akazu, atum gordo de Toyosu e ouriço fresco.",
      "fr": "Le chef-d’œuvre de notre maison mère à Ginza: riz au vinaigre rouge akazu, thon gras de Toyosu et anguille laquée.",
      "ja": "銀座本店が誇る至高の江戸前握り。熟成赤酢のシャリに豊洲市場最高峰の天然本鮪大トロ、雲丹、穴子など極上12貫。"
    },
    "priceMinorUnits": 7500,
    "price": 7500,
    "basePriceUSD": 48.38,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Selección de nigiris brillantes sobre tabla tradicional",
      "en": "Glistening selection of supreme nigiri on wood",
      "pt": "Seleção brilhante de nigiris nobres sobre madeira",
      "fr": "Écrin de nigiris lustrés sur plateau laqué",
      "ja": "赤酢シャリに鮮魚が輝く特選極み握りの盛り合わせ"
    },
    "fallbackEmoji": "🍣",
    "branchId": "br-sora-jp-ginza"
  },
  {
    "id": "br-sora-jp-ginza-dish-jp-sora-03",
    "restaurantId": "brand-sora",
    "countryCode": "JP",
    "category": "mains",
    "name": {
      "es": "Ramen Shoyu de Dashi Doble y Panceta Braseada de Tokio",
      "en": "Tokyo Double-Dashi Shoyu Ramen with Braised Chashu",
      "pt": "Tokyo Shoyu Ramen Tradicional com Chashu Artesanal",
      "fr": "Ramen Tokyo Shoyu au double bouillon dashi et porc braisé",
      "ja": "東京名物 鶏ガラと鰹本枯節のダブル出汁 熟成生醤油特製ラーメン"
    },
    "description": {
      "es": "Caldo transparente doble elaborado con huesos de pollo de corral y bonito seco katsuobushi, fideos rectos y huevo a baja temperatura.",
      "en": "Clear artisanal double broth combining local poultry and aged dried bonito flakes, straight noodles and soft yolk ajitama.",
      "pt": "Caldo translúcido de frango caipira e flocos de bonito seco katsuobushi com macarrão fresco.",
      "fr": "Bouillon shoyu limpide d’une grande pureté mariant volaille fermière et bonite séchée, œuf mollet et ciboule.",
      "ja": "地鶏の清湯と特選鰹本枯節の旨味を凝縮したダブルスープに、自家製ストレート細麺ととろけるチャーシュー。"
    },
    "priceMinorUnits": 1800,
    "price": 1800,
    "basePriceUSD": 11.61,
    "prepTimeMinutes": 12,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de shoyu ramen tradicional con fideos finos",
      "en": "Bowl of clear Tokyo shoyu ramen with noodles",
      "pt": "Tigela de ramen shoyu clássico de Tóquio",
      "fr": "Bol traditionnel de ramen shoyu avec nouilles fines",
      "ja": "澄んだ琥珀色のスープが美しい東京醤油ラーメン"
    },
    "fallbackEmoji": "🍜",
    "branchId": "br-sora-jp-ginza"
  },
  {
    "id": "br-sora-jp-ginza-dish-jp-sora-04",
    "restaurantId": "brand-sora",
    "countryCode": "JP",
    "category": "desserts",
    "name": {
      "es": "Warabi Mochi Tradicional con Kinako de Soja Tostada y Kuromitsu",
      "en": "Handmade Warabi Mochi with Roasted Kinako & Black Sugar Syrup",
      "pt": "Warabi Mochi Gelado com Farinha Kinako e Calda Kuromitsu",
      "fr": "Warabi mochi artisanal à la poudre de soja grillé et sirop kuromitsu",
      "ja": "本わらび粉手練り 本格わらび餅 国産焙煎きな粉と極上黒蜜"
    },
    "description": {
      "es": "Gelatina suave y elástica elaborada con almidón de helecho silvestre warabi, rebozada en polvo de soja tostada y miel negra de Okinawa.",
      "en": "Tender, melt-in-your-mouth bracken starch mochi dusted with nutty roasted soybean flour and rich Okinawa black sugar syrup.",
      "pt": "Mochi artesanal macio feito de amido de raiz silvestre, coberto com farinha de soja tostada e xarope de açúcar negro.",
      "fr": "Dés fondants de fécule de fougère sauvage roulés dans la farine de soja torréfiée et arrosés de mélasse noire d’Okinawa.",
      "ja": "希少な本わらび粉を銅鍋で丁寧に練り上げたぷるぷるのわらび餅。深煎り京きな粉と沖縄県波照間産黒蜜で。"
    },
    "priceMinorUnits": 950,
    "price": 950,
    "basePriceUSD": 6.12,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Cubos suaves de warabi mochi con harina dorada kinako",
      "en": "Soft warabi mochi cubes with roasted kinako powder",
      "pt": "Cubos de warabi mochi cobertos com pó kinako",
      "fr": "Cubes de warabi mochi saupoudrés de poudre de soja",
      "ja": "きな粉と黒蜜がかかったぷるぷるの本わらび餅"
    },
    "fallbackEmoji": "🍡",
    "branchId": "br-sora-jp-ginza"
  },
  {
    "id": "br-sora-jp-ginza-dish-jp-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Teishoku de Pollo Asado Teriyaki con Arroz y Miso",
      "en": "Lunch of the Day: Charcoal Teriyaki Chicken Teishoku with Rice & Miso",
      "pt": "Almoço do Dia: Teishoku de Frango Teriyaki com Arroz e Sopa Miso",
      "fr": "Plat du jour midi: Teishoku au poulet grillé teriyaki, riz blanc et soupe miso",
      "ja": "本日のおすすめランチ：若鶏の炭火照り焼き定食（小鉢・炊きたてご飯・赤出汁味噌汁付き）"
    },
    "description": {
      "es": "El almuerzo tradicional teishoku: sopa miso casera, muslo de pollo a la brasa con salsa teriyaki de soja madurada, arroz al vapor y encurtidos tsukemono.",
      "en": "The authentic Japanese business teishoku set: fresh miso soup, charcoal-grilled chicken in aged soy teriyaki, steamed rice and pickles.",
      "pt": "Menu executivo tradicional japonês: sopa de missô, frango grelhado no teriyaki artesanal, arroz japonês e conservas.",
      "fr": "La formule teishoku de midi par excellence: soupe miso fumante, poulet grillé au charbon nappé de teriyaki maison, riz vapeur et pickles.",
      "ja": "備長炭でじっくり焼き上げた若鶏の照り焼き、炊きたてご飯、出汁香る赤出汁味噌汁、自家製漬物がセットになった日替わり定食。"
    },
    "priceMinorUnits": 2590,
    "price": 2590,
    "basePriceUSD": 16.7,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Bandeja tradicional de almuerzo teishoku con cuencos de arroz y miso",
      "en": "Traditional teishoku lunch tray with rice and miso bowls",
      "pt": "Bandeja de almoço teishoku tradicional com arroz e sopa",
      "fr": "Plateau repas teishoku avec bols de riz et soupe miso",
      "ja": "ご飯と味噌汁、香の物が整然と並んだ和食の定食トレイ"
    },
    "fallbackEmoji": "🍱",
    "branchId": "br-sora-jp-ginza"
  },
  {
    "id": "br-sora-jp-ginza-dish-jp-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "drinks",
    "name": {
      "es": "Té Verde Matcha Helado de Uji con Toque de Yuzu",
      "en": "Iced Kyoto Uji Matcha with Fresh Yuzu Essence",
      "pt": "Chá Matcha Gelado de Uji com Toque de Yuzu",
      "fr": "Thé vert matcha glacé d’Uji et zeste de yuzu",
      "ja": "宇治産一番茶の特製アイス抹茶 高知県産生柚子仕立て"
    },
    "description": {
      "es": "Té verde ceremonial batido al momento con batidor de bambú chasen, servido frío sobre cubos de hielo con un sutil aroma de corteza de yuzu.",
      "en": "Ceremonial grade green tea whisked fresh with bamboo chasen, served over crystal ice with delicate fresh yuzu citrus aroma.",
      "pt": "Chá verde cerimonial batido na hora com batedor de bambu, servido gelado com toque aromático de yuzu.",
      "fr": "Thé matcha de cérémonie fouetté minute au chasen en bambou, servi sur glace cristalline avec une note fraîche de zeste de yuzu.",
      "ja": "京都宇治の一番摘み茶葉を伝統の茶筅で丁寧に点て、高知産柚子の爽やかな香りを添えた冷涼な一杯。"
    },
    "priceMinorUnits": 700,
    "price": 700,
    "basePriceUSD": 4.51,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de té matcha verde brillante con hielo",
      "en": "Glass of bright green iced matcha tea with ice",
      "pt": "Copo de chá matcha verde vivo com gelo",
      "fr": "Verre de thé matcha vert éclatant avec glaçons",
      "ja": "鮮やかな緑色が引き立つ氷入りアイス抹茶"
    },
    "fallbackEmoji": "🍵",
    "branchId": "br-sora-jp-ginza"
  },
  {
    "id": "br-sora-jp-shinjuku-dish-jp-sora-01",
    "restaurantId": "brand-sora",
    "countryCode": "JP",
    "category": "starters",
    "name": {
      "es": "Edamame Salteado con Ajo Tostado y Shichimi Togarashi",
      "en": "Wok-Tossed Edamame with Garlic & Shichimi Pepper",
      "pt": "Edamame Salteado no Wok com Alho e Pimenta Shichimi",
      "fr": "Edamame sauté au wok à l’ail rôti et piment shichimi",
      "ja": "朝採れ枝豆の焦がしガーリック七味炒め"
    },
    "description": {
      "es": "Vainas tiernas de soja salteadas al wok a fuego vivo con aceite de sésamo tostado, ajo laminado y siete especias japonesas.",
      "en": "Tender young soybean pods wok-charred with roasted sesame oil, crisp garlic flakes and seven-spice blend.",
      "pt": "Vagens frescas de soja salteadas na wok com óleo de gergelim, lascas de alho e pimenta japonesa.",
      "fr": "Fèves de soja fraîches sautées à feu vif à l’huile de sésame torréfié, ail croustillant et mélange shichimi.",
      "ja": "採れたての新鮮な枝豆を高温の中華鍋で素早く炒め、香ばしいニンニクと特製七味唐辛子を絡めた前菜。"
    },
    "priceMinorUnits": 900,
    "price": 900,
    "basePriceUSD": 5.8,
    "prepTimeMinutes": 6,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vainas verdes de edamame con copos de sal y ajo",
      "en": "Bowl of green edamame pods with garlic flakes",
      "pt": "Tigela de edamame verde temperado com alho",
      "fr": "Bol de cosses d’edamame vert vif et épices",
      "ja": "ガーリックチップと七味がまぶされた熱々の枝豆"
    },
    "fallbackEmoji": "🫘",
    "branchId": "br-sora-jp-shinjuku"
  },
  {
    "id": "br-sora-jp-shinjuku-dish-jp-sora-02",
    "restaurantId": "brand-sora",
    "countryCode": "JP",
    "category": "mains",
    "name": {
      "es": "Sora Ginza Honten Nigiri Kiwami (12 Piezas de Autor)",
      "en": "Sora Ginza Flagship \"Kiwami\" Supreme Nigiri (12 Pcs)",
      "pt": "Combinado Sora Ginza Kiwami de Nigiris Nobres (12 Peças)",
      "fr": "Assortiment Sora Ginza «Kiwami» de 12 nigiris d’exception",
      "ja": "宙 (Sora) 銀座本店 特選極み握り（12貫厳選・赤酢仕立て）"
    },
    "description": {
      "es": "El estandarte de la casa matriz en Ginza: arroz sazonado con vinagre rojo akazu, atún de Toyosu, erizo de mar y anguila glaseada.",
      "en": "Ginza flagship masterwork: traditional Edo-mae akazu red vinegar rice, bluefin otoro, Hokkaido uni, and glazed unagi.",
      "pt": "O ápice da gastronomia de Ginza: arroz de vinagre vermelho akazu, atum gordo de Toyosu e ouriço fresco.",
      "fr": "Le chef-d’œuvre de notre maison mère à Ginza: riz au vinaigre rouge akazu, thon gras de Toyosu et anguille laquée.",
      "ja": "銀座本店が誇る至高の江戸前握り。熟成赤酢のシャリに豊洲市場最高峰の天然本鮪大トロ、雲丹、穴子など極上12貫。"
    },
    "priceMinorUnits": 7500,
    "price": 7500,
    "basePriceUSD": 48.38,
    "prepTimeMinutes": 16,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Selección de nigiris brillantes sobre tabla tradicional",
      "en": "Glistening selection of supreme nigiri on wood",
      "pt": "Seleção brilhante de nigiris nobres sobre madeira",
      "fr": "Écrin de nigiris lustrés sur plateau laqué",
      "ja": "赤酢シャリに鮮魚が輝く特選極み握りの盛り合わせ"
    },
    "fallbackEmoji": "🍣",
    "branchId": "br-sora-jp-shinjuku"
  },
  {
    "id": "br-sora-jp-shinjuku-dish-jp-sora-03",
    "restaurantId": "brand-sora",
    "countryCode": "JP",
    "category": "mains",
    "name": {
      "es": "Ramen Shoyu de Dashi Doble y Panceta Braseada de Tokio",
      "en": "Tokyo Double-Dashi Shoyu Ramen with Braised Chashu",
      "pt": "Tokyo Shoyu Ramen Tradicional com Chashu Artesanal",
      "fr": "Ramen Tokyo Shoyu au double bouillon dashi et porc braisé",
      "ja": "東京名物 鶏ガラと鰹本枯節のダブル出汁 熟成生醤油特製ラーメン"
    },
    "description": {
      "es": "Caldo transparente doble elaborado con huesos de pollo de corral y bonito seco katsuobushi, fideos rectos y huevo a baja temperatura.",
      "en": "Clear artisanal double broth combining local poultry and aged dried bonito flakes, straight noodles and soft yolk ajitama.",
      "pt": "Caldo translúcido de frango caipira e flocos de bonito seco katsuobushi com macarrão fresco.",
      "fr": "Bouillon shoyu limpide d’une grande pureté mariant volaille fermière et bonite séchée, œuf mollet et ciboule.",
      "ja": "地鶏の清湯と特選鰹本枯節の旨味を凝縮したダブルスープに、自家製ストレート細麺ととろけるチャーシュー。"
    },
    "priceMinorUnits": 1800,
    "price": 1800,
    "basePriceUSD": 11.61,
    "prepTimeMinutes": 12,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Tazón de shoyu ramen tradicional con fideos finos",
      "en": "Bowl of clear Tokyo shoyu ramen with noodles",
      "pt": "Tigela de ramen shoyu clássico de Tóquio",
      "fr": "Bol traditionnel de ramen shoyu avec nouilles fines",
      "ja": "澄んだ琥珀色のスープが美しい東京醤油ラーメン"
    },
    "fallbackEmoji": "🍜",
    "branchId": "br-sora-jp-shinjuku"
  },
  {
    "id": "br-sora-jp-shinjuku-dish-jp-sora-04",
    "restaurantId": "brand-sora",
    "countryCode": "JP",
    "category": "desserts",
    "name": {
      "es": "Warabi Mochi Tradicional con Kinako de Soja Tostada y Kuromitsu",
      "en": "Handmade Warabi Mochi with Roasted Kinako & Black Sugar Syrup",
      "pt": "Warabi Mochi Gelado com Farinha Kinako e Calda Kuromitsu",
      "fr": "Warabi mochi artisanal à la poudre de soja grillé et sirop kuromitsu",
      "ja": "本わらび粉手練り 本格わらび餅 国産焙煎きな粉と極上黒蜜"
    },
    "description": {
      "es": "Gelatina suave y elástica elaborada con almidón de helecho silvestre warabi, rebozada en polvo de soja tostada y miel negra de Okinawa.",
      "en": "Tender, melt-in-your-mouth bracken starch mochi dusted with nutty roasted soybean flour and rich Okinawa black sugar syrup.",
      "pt": "Mochi artesanal macio feito de amido de raiz silvestre, coberto com farinha de soja tostada e xarope de açúcar negro.",
      "fr": "Dés fondants de fécule de fougère sauvage roulés dans la farine de soja torréfiée et arrosés de mélasse noire d’Okinawa.",
      "ja": "希少な本わらび粉を銅鍋で丁寧に練り上げたぷるぷるのわらび餅。深煎り京きな粉と沖縄県波照間産黒蜜で。"
    },
    "priceMinorUnits": 950,
    "price": 950,
    "basePriceUSD": 6.12,
    "prepTimeMinutes": 5,
    "available": true,
    "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Cubos suaves de warabi mochi con harina dorada kinako",
      "en": "Soft warabi mochi cubes with roasted kinako powder",
      "pt": "Cubos de warabi mochi cobertos com pó kinako",
      "fr": "Cubes de warabi mochi saupoudrés de poudre de soja",
      "ja": "きな粉と黒蜜がかかったぷるぷるの本わらび餅"
    },
    "fallbackEmoji": "🍡",
    "branchId": "br-sora-jp-shinjuku"
  },
  {
    "id": "br-sora-jp-shinjuku-dish-jp-lunch",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "mains",
    "isLunchOfTheDay": true,
    "name": {
      "es": "Almuerzo del Día: Teishoku de Pollo Asado Teriyaki con Arroz y Miso",
      "en": "Lunch of the Day: Charcoal Teriyaki Chicken Teishoku with Rice & Miso",
      "pt": "Almoço do Dia: Teishoku de Frango Teriyaki com Arroz e Sopa Miso",
      "fr": "Plat du jour midi: Teishoku au poulet grillé teriyaki, riz blanc et soupe miso",
      "ja": "本日のおすすめランチ：若鶏の炭火照り焼き定食（小鉢・炊きたてご飯・赤出汁味噌汁付き）"
    },
    "description": {
      "es": "El almuerzo tradicional teishoku: sopa miso casera, muslo de pollo a la brasa con salsa teriyaki de soja madurada, arroz al vapor y encurtidos tsukemono.",
      "en": "The authentic Japanese business teishoku set: fresh miso soup, charcoal-grilled chicken in aged soy teriyaki, steamed rice and pickles.",
      "pt": "Menu executivo tradicional japonês: sopa de missô, frango grelhado no teriyaki artesanal, arroz japonês e conservas.",
      "fr": "La formule teishoku de midi par excellence: soupe miso fumante, poulet grillé au charbon nappé de teriyaki maison, riz vapeur et pickles.",
      "ja": "備長炭でじっくり焼き上げた若鶏の照り焼き、炊きたてご飯、出汁香る赤出汁味噌汁、自家製漬物がセットになった日替わり定食。"
    },
    "priceMinorUnits": 2590,
    "price": 2590,
    "basePriceUSD": 16.7,
    "prepTimeMinutes": 10,
    "available": true,
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Bandeja tradicional de almuerzo teishoku con cuencos de arroz y miso",
      "en": "Traditional teishoku lunch tray with rice and miso bowls",
      "pt": "Bandeja de almoço teishoku tradicional com arroz e sopa",
      "fr": "Plateau repas teishoku avec bols de riz et soupe miso",
      "ja": "ご飯と味噌汁、香の物が整然と並んだ和食の定食トレイ"
    },
    "fallbackEmoji": "🍱",
    "branchId": "br-sora-jp-shinjuku"
  },
  {
    "id": "br-sora-jp-shinjuku-dish-jp-drink-01",
    "restaurantId": "brand-aura",
    "countryCode": "JP",
    "category": "drinks",
    "name": {
      "es": "Té Verde Matcha Helado de Uji con Toque de Yuzu",
      "en": "Iced Kyoto Uji Matcha with Fresh Yuzu Essence",
      "pt": "Chá Matcha Gelado de Uji com Toque de Yuzu",
      "fr": "Thé vert matcha glacé d’Uji et zeste de yuzu",
      "ja": "宇治産一番茶の特製アイス抹茶 高知県産生柚子仕立て"
    },
    "description": {
      "es": "Té verde ceremonial batido al momento con batidor de bambú chasen, servido frío sobre cubos de hielo con un sutil aroma de corteza de yuzu.",
      "en": "Ceremonial grade green tea whisked fresh with bamboo chasen, served over crystal ice with delicate fresh yuzu citrus aroma.",
      "pt": "Chá verde cerimonial batido na hora com batedor de bambu, servido gelado com toque aromático de yuzu.",
      "fr": "Thé matcha de cérémonie fouetté minute au chasen en bambou, servi sur glace cristalline avec une note fraîche de zeste de yuzu.",
      "ja": "京都宇治の一番摘み茶葉を伝統の茶筅で丁寧に点て、高知産柚子の爽やかな香りを添えた冷涼な一杯。"
    },
    "priceMinorUnits": 700,
    "price": 700,
    "basePriceUSD": 4.51,
    "prepTimeMinutes": 4,
    "available": true,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    "imageAlt": {
      "es": "Vaso de té matcha verde brillante con hielo",
      "en": "Glass of bright green iced matcha tea with ice",
      "pt": "Copo de chá matcha verde vivo com gelo",
      "fr": "Verre de thé matcha vert éclatant avec glaçons",
      "ja": "鮮やかな緑色が引き立つ氷入りアイス抹茶"
    },
    "fallbackEmoji": "🍵",
    "branchId": "br-sora-jp-shinjuku"
  }
];
export const SEED_REVIEWS: Review[] = [
  {
    "id": "rev-1",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-co-chapinero",
    "userName": "Carolina Ramírez",
    "userAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Una experiencia gastronómica inolvidable. El servicio por QR fue inmediato y los platos llegaron en su punto perfecto.",
      "en": "An unforgettable culinary experience. The table QR order was swift and dishes arrived at absolute perfection.",
      "pt": "Uma experiência gastronômica inesquecível. O pedido pelo QR foi rápido e os pratos chegaram perfeitos.",
      "fr": "Une expérience gastronomique inoubliable. La commande par QR fut instantanée et les assiettes parfaites.",
      "ja": "忘れられない美食体験でした。テーブルQRでの注文はとてもスムーズで、料理も最高の焼き加減でした。"
    },
    "reply": {
      "text": {
        "es": "¡Muchas gracias por su visita! Nos alegra saber que disfrutó de nuestra propuesta culinaria.",
        "en": "Thank you very much for your visit! We are thrilled you enjoyed our culinary craft.",
        "pt": "Muito obrigado pela visita! Ficamos felizes que tenha apreciado nossa gastronomia.",
        "fr": "Merci infiniment pour votre visite! Nous sommes ravis que notre cuisine vous ait comblé.",
        "ja": "ご来店誠にありがとうございました！おもてなしとお料理をお楽しみいただけて光栄です。"
      },
      "repliedAt": "2026-11-10T14:30:00Z",
      "repliedBy": "Equipo de Sala"
    },
    "status": "approved",
    "createdAt": "2026-11-11T01:37:31.923Z"
  },
  {
    "id": "rev-2",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-co-usaquen",
    "userName": "Gabriel Barbosa",
    "userAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "El almuerzo del día superó todas mis expectativas: ingredientes fresquísimos y una cocción a las brasas impecable.",
      "en": "The daily lunch special exceeded all expectations: remarkably fresh produce and flawless charcoal grilling.",
      "pt": "O almoço do dia superou as expectativas: ingredientes fresquíssimos e ponto da brasa impecável.",
      "fr": "Le plat du jour a dépassé toutes mes attentes: produits d’une fraîcheur remarquable et cuisson au feu de bois impeccable.",
      "ja": "本日のおすすめランチは期待以上でした。食材の鮮度が際立ち、炭火の香ばしさが格別でした。"
    },
    "reply": {
      "text": {
        "es": "Es un placer atenderle. Cada mañana preparamos el almuerzo del día con productos locales de proximidad.",
        "en": "A pleasure serving you. We craft our daily lunch every morning using fresh regional harvest.",
        "pt": "Foi um prazer atendê-lo. Preparamos o almoço do dia diariamente com ingredientes locais selecionados.",
        "fr": "Tout le plaisir est pour nous. Nous élaborons le menu du jour chaque matin avec les arrivages frais.",
        "ja": "温かいお言葉をいただき感謝申し上げます。毎朝仕入れる旬の素材で心を込めてお作りしております。"
      },
      "repliedAt": "2026-11-09T18:00:00Z",
      "repliedBy": "Chef Ejecutivo"
    },
    "status": "approved",
    "createdAt": "2026-11-10T01:37:31.924Z"
  },
  {
    "id": "rev-3",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-co-chico",
    "userName": "Emily Clark",
    "userAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Ambiente sofisticado y cálido. La reserva en línea funcionó sin demoras ni filas.",
      "en": "Sophisticated yet warm ambiance. The online table reservation worked seamlessly with zero wait time.",
      "pt": "Ambiente sofisticado e acolhedor. A reserva online funcionou sem filas nem atrasos.",
      "fr": "Ambiance feutrée et chaleureuse. La réservation en ligne a fonctionné sans la moindre attente.",
      "ja": "洗練されつつも温かみのある空間。事前のオンライン予約で待ち時間なく案内されました。"
    },
    "status": "approved",
    "createdAt": "2026-11-09T01:37:31.924Z"
  },
  {
    "id": "rev-4",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-co-zonag",
    "userName": "Pierre Laurent",
    "userAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Una experiencia gastronómica inolvidable. El servicio por QR fue inmediato y los platos llegaron en su punto perfecto.",
      "en": "An unforgettable culinary experience. The table QR order was swift and dishes arrived at absolute perfection.",
      "pt": "Uma experiência gastronômica inesquecível. O pedido pelo QR foi rápido e os pratos chegaram perfeitos.",
      "fr": "Une expérience gastronomique inoubliable. La commande par QR fut instantanée et les assiettes parfaites.",
      "ja": "忘れられない美食体験でした。テーブルQRでの注文はとてもスムーズで、料理も最高の焼き加減でした。"
    },
    "reply": {
      "text": {
        "es": "¡Muchas gracias por su visita! Nos alegra saber que disfrutó de nuestra propuesta culinaria.",
        "en": "Thank you very much for your visit! We are thrilled you enjoyed our culinary craft.",
        "pt": "Muito obrigado pela visita! Ficamos felizes que tenha apreciado nossa gastronomia.",
        "fr": "Merci infiniment pour votre visite! Nous sommes ravis que notre cuisine vous ait comblé.",
        "ja": "ご来店誠にありがとうございました！おもてなしとお料理をお楽しみいただけて光栄です。"
      },
      "repliedAt": "2026-11-10T14:30:00Z",
      "repliedBy": "Equipo de Sala"
    },
    "status": "approved",
    "createdAt": "2026-11-08T01:37:31.924Z"
  },
  {
    "id": "rev-5",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-br-pinheiros",
    "userName": "Kenji Tanaka",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 4,
    "comment": {
      "es": "El almuerzo del día superó todas mis expectativas: ingredientes fresquísimos y una cocción a las brasas impecable.",
      "en": "The daily lunch special exceeded all expectations: remarkably fresh produce and flawless charcoal grilling.",
      "pt": "O almoço do dia superou as expectativas: ingredientes fresquíssimos e ponto da brasa impecável.",
      "fr": "Le plat du jour a dépassé toutes mes attentes: produits d’une fraîcheur remarquable et cuisson au feu de bois impeccable.",
      "ja": "本日のおすすめランチは期待以上でした。食材の鮮度が際立ち、炭火の香ばしさが格別でした。"
    },
    "reply": {
      "text": {
        "es": "Es un placer atenderle. Cada mañana preparamos el almuerzo del día con productos locales de proximidad.",
        "en": "A pleasure serving you. We craft our daily lunch every morning using fresh regional harvest.",
        "pt": "Foi um prazer atendê-lo. Preparamos o almoço do dia diariamente com ingredientes locais selecionados.",
        "fr": "Tout le plaisir est pour nous. Nous élaborons le menu du jour chaque matin avec les arrivages frais.",
        "ja": "温かいお言葉をいただき感謝申し上げます。毎朝仕入れる旬の素材で心を込めてお作りしております。"
      },
      "repliedAt": "2026-11-09T18:00:00Z",
      "repliedBy": "Chef Ejecutivo"
    },
    "status": "approved",
    "createdAt": "2026-11-07T01:37:31.924Z"
  },
  {
    "id": "rev-6",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-br-jardins",
    "userName": "Mariana Duarte",
    "userAvatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Ambiente sofisticado y cálido. La reserva en línea funcionó sin demoras ni filas.",
      "en": "Sophisticated yet warm ambiance. The online table reservation worked seamlessly with zero wait time.",
      "pt": "Ambiente sofisticado e acolhedor. A reserva online funcionou sem filas nem atrasos.",
      "fr": "Ambiance feutrée et chaleureuse. La réservation en ligne a fonctionné sans la moindre attente.",
      "ja": "洗練されつつも温かみのある空間。事前のオンライン予約で待ち時間なく案内されました。"
    },
    "status": "approved",
    "createdAt": "2026-11-06T01:37:31.924Z"
  },
  {
    "id": "rev-7",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-br-liberdade",
    "userName": "Carolina Ramírez",
    "userAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Una experiencia gastronómica inolvidable. El servicio por QR fue inmediato y los platos llegaron en su punto perfecto.",
      "en": "An unforgettable culinary experience. The table QR order was swift and dishes arrived at absolute perfection.",
      "pt": "Uma experiência gastronômica inesquecível. O pedido pelo QR foi rápido e os pratos chegaram perfeitos.",
      "fr": "Une expérience gastronomique inoubliable. La commande par QR fut instantanée et les assiettes parfaites.",
      "ja": "忘れられない美食体験でした。テーブルQRでの注文はとてもスムーズで、料理も最高の焼き加減でした。"
    },
    "reply": {
      "text": {
        "es": "¡Muchas gracias por su visita! Nos alegra saber que disfrutó de nuestra propuesta culinaria.",
        "en": "Thank you very much for your visit! We are thrilled you enjoyed our culinary craft.",
        "pt": "Muito obrigado pela visita! Ficamos felizes que tenha apreciado nossa gastronomia.",
        "fr": "Merci infiniment pour votre visite! Nous sommes ravis que notre cuisine vous ait comblé.",
        "ja": "ご来店誠にありがとうございました！おもてなしとお料理をお楽しみいただけて光栄です。"
      },
      "repliedAt": "2026-11-10T14:30:00Z",
      "repliedBy": "Equipo de Sala"
    },
    "status": "approved",
    "createdAt": "2026-11-05T01:37:31.924Z"
  },
  {
    "id": "rev-8",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-br-itaim",
    "userName": "Gabriel Barbosa",
    "userAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "El almuerzo del día superó todas mis expectativas: ingredientes fresquísimos y una cocción a las brasas impecable.",
      "en": "The daily lunch special exceeded all expectations: remarkably fresh produce and flawless charcoal grilling.",
      "pt": "O almoço do dia superou as expectativas: ingredientes fresquíssimos e ponto da brasa impecável.",
      "fr": "Le plat du jour a dépassé toutes mes attentes: produits d’une fraîcheur remarquable et cuisson au feu de bois impeccable.",
      "ja": "本日のおすすめランチは期待以上でした。食材の鮮度が際立ち、炭火の香ばしさが格別でした。"
    },
    "reply": {
      "text": {
        "es": "Es un placer atenderle. Cada mañana preparamos el almuerzo del día con productos locales de proximidad.",
        "en": "A pleasure serving you. We craft our daily lunch every morning using fresh regional harvest.",
        "pt": "Foi um prazer atendê-lo. Preparamos o almoço do dia diariamente com ingredientes locais selecionados.",
        "fr": "Tout le plaisir est pour nous. Nous élaborons le menu du jour chaque matin avec les arrivages frais.",
        "ja": "温かいお言葉をいただき感謝申し上げます。毎朝仕入れる旬の素材で心を込めてお作りしております。"
      },
      "repliedAt": "2026-11-09T18:00:00Z",
      "repliedBy": "Chef Ejecutivo"
    },
    "status": "approved",
    "createdAt": "2026-11-04T01:37:31.924Z"
  },
  {
    "id": "rev-9",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-us-manhattan",
    "userName": "Emily Clark",
    "userAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Ambiente sofisticado y cálido. La reserva en línea funcionó sin demoras ni filas.",
      "en": "Sophisticated yet warm ambiance. The online table reservation worked seamlessly with zero wait time.",
      "pt": "Ambiente sofisticado e acolhedor. A reserva online funcionou sem filas nem atrasos.",
      "fr": "Ambiance feutrée et chaleureuse. La réservation en ligne a fonctionné sans la moindre attente.",
      "ja": "洗練されつつも温かみのある空間。事前のオンライン予約で待ち時間なく案内されました。"
    },
    "status": "approved",
    "createdAt": "2026-11-03T01:37:31.924Z"
  },
  {
    "id": "rev-10",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-us-brooklyn",
    "userName": "Pierre Laurent",
    "userAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    "rating": 4,
    "comment": {
      "es": "Una experiencia gastronómica inolvidable. El servicio por QR fue inmediato y los platos llegaron en su punto perfecto.",
      "en": "An unforgettable culinary experience. The table QR order was swift and dishes arrived at absolute perfection.",
      "pt": "Uma experiência gastronômica inesquecível. O pedido pelo QR foi rápido e os pratos chegaram perfeitos.",
      "fr": "Une expérience gastronomique inoubliable. La commande par QR fut instantanée et les assiettes parfaites.",
      "ja": "忘れられない美食体験でした。テーブルQRでの注文はとてもスムーズで、料理も最高の焼き加減でした。"
    },
    "reply": {
      "text": {
        "es": "¡Muchas gracias por su visita! Nos alegra saber que disfrutó de nuestra propuesta culinaria.",
        "en": "Thank you very much for your visit! We are thrilled you enjoyed our culinary craft.",
        "pt": "Muito obrigado pela visita! Ficamos felizes que tenha apreciado nossa gastronomia.",
        "fr": "Merci infiniment pour votre visite! Nous sommes ravis que notre cuisine vous ait comblé.",
        "ja": "ご来店誠にありがとうございました！おもてなしとお料理をお楽しみいただけて光栄です。"
      },
      "repliedAt": "2026-11-10T14:30:00Z",
      "repliedBy": "Equipo de Sala"
    },
    "status": "approved",
    "createdAt": "2026-11-02T01:37:31.924Z"
  },
  {
    "id": "rev-11",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-us-soho",
    "userName": "Kenji Tanaka",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "El almuerzo del día superó todas mis expectativas: ingredientes fresquísimos y una cocción a las brasas impecable.",
      "en": "The daily lunch special exceeded all expectations: remarkably fresh produce and flawless charcoal grilling.",
      "pt": "O almoço do dia superou as expectativas: ingredientes fresquíssimos e ponto da brasa impecável.",
      "fr": "Le plat du jour a dépassé toutes mes attentes: produits d’une fraîcheur remarquable et cuisson au feu de bois impeccable.",
      "ja": "本日のおすすめランチは期待以上でした。食材の鮮度が際立ち、炭火の香ばしさが格別でした。"
    },
    "reply": {
      "text": {
        "es": "Es un placer atenderle. Cada mañana preparamos el almuerzo del día con productos locales de proximidad.",
        "en": "A pleasure serving you. We craft our daily lunch every morning using fresh regional harvest.",
        "pt": "Foi um prazer atendê-lo. Preparamos o almoço do dia diariamente com ingredientes locais selecionados.",
        "fr": "Tout le plaisir est pour nous. Nous élaborons le menu du jour chaque matin avec les arrivages frais.",
        "ja": "温かいお言葉をいただき感謝申し上げます。毎朝仕入れる旬の素材で心を込めてお作りしております。"
      },
      "repliedAt": "2026-11-09T18:00:00Z",
      "repliedBy": "Chef Ejecutivo"
    },
    "status": "approved",
    "createdAt": "2026-11-01T01:37:31.924Z"
  },
  {
    "id": "rev-12",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-us-williamsburg",
    "userName": "Mariana Duarte",
    "userAvatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Ambiente sofisticado y cálido. La reserva en línea funcionó sin demoras ni filas.",
      "en": "Sophisticated yet warm ambiance. The online table reservation worked seamlessly with zero wait time.",
      "pt": "Ambiente sofisticado e acolhedor. A reserva online funcionou sem filas nem atrasos.",
      "fr": "Ambiance feutrée et chaleureuse. La réservation en ligne a fonctionné sans la moindre attente.",
      "ja": "洗練されつつも温かみのある空間。事前のオンライン予約で待ち時間なく案内されました。"
    },
    "status": "approved",
    "createdAt": "2026-10-31T01:37:31.924Z"
  },
  {
    "id": "rev-13",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-fr-marais",
    "userName": "Carolina Ramírez",
    "userAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Una experiencia gastronómica inolvidable. El servicio por QR fue inmediato y los platos llegaron en su punto perfecto.",
      "en": "An unforgettable culinary experience. The table QR order was swift and dishes arrived at absolute perfection.",
      "pt": "Uma experiência gastronômica inesquecível. O pedido pelo QR foi rápido e os pratos chegaram perfeitos.",
      "fr": "Une expérience gastronomique inoubliable. La commande par QR fut instantanée et les assiettes parfaites.",
      "ja": "忘れられない美食体験でした。テーブルQRでの注文はとてもスムーズで、料理も最高の焼き加減でした。"
    },
    "reply": {
      "text": {
        "es": "¡Muchas gracias por su visita! Nos alegra saber que disfrutó de nuestra propuesta culinaria.",
        "en": "Thank you very much for your visit! We are thrilled you enjoyed our culinary craft.",
        "pt": "Muito obrigado pela visita! Ficamos felizes que tenha apreciado nossa gastronomia.",
        "fr": "Merci infiniment pour votre visite! Nous sommes ravis que notre cuisine vous ait comblé.",
        "ja": "ご来店誠にありがとうございました！おもてなしとお料理をお楽しみいただけて光栄です。"
      },
      "repliedAt": "2026-11-10T14:30:00Z",
      "repliedBy": "Equipo de Sala"
    },
    "status": "approved",
    "createdAt": "2026-10-30T01:37:31.924Z"
  },
  {
    "id": "rev-14",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-fr-saintgermain",
    "userName": "Gabriel Barbosa",
    "userAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "El almuerzo del día superó todas mis expectativas: ingredientes fresquísimos y una cocción a las brasas impecable.",
      "en": "The daily lunch special exceeded all expectations: remarkably fresh produce and flawless charcoal grilling.",
      "pt": "O almoço do dia superou as expectativas: ingredientes fresquíssimos e ponto da brasa impecável.",
      "fr": "Le plat du jour a dépassé toutes mes attentes: produits d’une fraîcheur remarquable et cuisson au feu de bois impeccable.",
      "ja": "本日のおすすめランチは期待以上でした。食材の鮮度が際立ち、炭火の香ばしさが格別でした。"
    },
    "reply": {
      "text": {
        "es": "Es un placer atenderle. Cada mañana preparamos el almuerzo del día con productos locales de proximidad.",
        "en": "A pleasure serving you. We craft our daily lunch every morning using fresh regional harvest.",
        "pt": "Foi um prazer atendê-lo. Preparamos o almoço do dia diariamente com ingredientes locais selecionados.",
        "fr": "Tout le plaisir est pour nous. Nous élaborons le menu du jour chaque matin avec les arrivages frais.",
        "ja": "温かいお言葉をいただき感謝申し上げます。毎朝仕入れる旬の素材で心を込めてお作りしております。"
      },
      "repliedAt": "2026-11-09T18:00:00Z",
      "repliedBy": "Chef Ejecutivo"
    },
    "status": "approved",
    "createdAt": "2026-10-29T01:37:31.924Z"
  },
  {
    "id": "rev-15",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-fr-opera",
    "userName": "Emily Clark",
    "userAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    "rating": 4,
    "comment": {
      "es": "Ambiente sofisticado y cálido. La reserva en línea funcionó sin demoras ni filas.",
      "en": "Sophisticated yet warm ambiance. The online table reservation worked seamlessly with zero wait time.",
      "pt": "Ambiente sofisticado e acolhedor. A reserva online funcionou sem filas nem atrasos.",
      "fr": "Ambiance feutrée et chaleureuse. La réservation en ligne a fonctionné sans la moindre attente.",
      "ja": "洗練されつつも温かみのある空間。事前のオンライン予約で待ち時間なく案内されました。"
    },
    "status": "approved",
    "createdAt": "2026-10-28T01:37:31.924Z"
  },
  {
    "id": "rev-16",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-fr-montparnasse",
    "userName": "Pierre Laurent",
    "userAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Una experiencia gastronómica inolvidable. El servicio por QR fue inmediato y los platos llegaron en su punto perfecto.",
      "en": "An unforgettable culinary experience. The table QR order was swift and dishes arrived at absolute perfection.",
      "pt": "Uma experiência gastronômica inesquecível. O pedido pelo QR foi rápido e os pratos chegaram perfeitos.",
      "fr": "Une expérience gastronomique inoubliable. La commande par QR fut instantanée et les assiettes parfaites.",
      "ja": "忘れられない美食体験でした。テーブルQRでの注文はとてもスムーズで、料理も最高の焼き加減でした。"
    },
    "reply": {
      "text": {
        "es": "¡Muchas gracias por su visita! Nos alegra saber que disfrutó de nuestra propuesta culinaria.",
        "en": "Thank you very much for your visit! We are thrilled you enjoyed our culinary craft.",
        "pt": "Muito obrigado pela visita! Ficamos felizes que tenha apreciado nossa gastronomia.",
        "fr": "Merci infiniment pour votre visite! Nous sommes ravis que notre cuisine vous ait comblé.",
        "ja": "ご来店誠にありがとうございました！おもてなしとお料理をお楽しみいただけて光栄です。"
      },
      "repliedAt": "2026-11-10T14:30:00Z",
      "repliedBy": "Equipo de Sala"
    },
    "status": "approved",
    "createdAt": "2026-10-27T01:37:31.924Z"
  },
  {
    "id": "rev-17",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-jp-shibuya",
    "userName": "Kenji Tanaka",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "El almuerzo del día superó todas mis expectativas: ingredientes fresquísimos y una cocción a las brasas impecable.",
      "en": "The daily lunch special exceeded all expectations: remarkably fresh produce and flawless charcoal grilling.",
      "pt": "O almoço do dia superou as expectativas: ingredientes fresquíssimos e ponto da brasa impecável.",
      "fr": "Le plat du jour a dépassé toutes mes attentes: produits d’une fraîcheur remarquable et cuisson au feu de bois impeccable.",
      "ja": "本日のおすすめランチは期待以上でした。食材の鮮度が際立ち、炭火の香ばしさが格別でした。"
    },
    "reply": {
      "text": {
        "es": "Es un placer atenderle. Cada mañana preparamos el almuerzo del día con productos locales de proximidad.",
        "en": "A pleasure serving you. We craft our daily lunch every morning using fresh regional harvest.",
        "pt": "Foi um prazer atendê-lo. Preparamos o almoço do dia diariamente com ingredientes locais selecionados.",
        "fr": "Tout le plaisir est pour nous. Nous élaborons le menu du jour chaque matin avec les arrivages frais.",
        "ja": "温かいお言葉をいただき感謝申し上げます。毎朝仕入れる旬の素材で心を込めてお作りしております。"
      },
      "repliedAt": "2026-11-09T18:00:00Z",
      "repliedBy": "Chef Ejecutivo"
    },
    "status": "approved",
    "createdAt": "2026-10-26T01:37:31.924Z"
  },
  {
    "id": "rev-18",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-jp-roppongi",
    "userName": "Mariana Duarte",
    "userAvatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Ambiente sofisticado y cálido. La reserva en línea funcionó sin demoras ni filas.",
      "en": "Sophisticated yet warm ambiance. The online table reservation worked seamlessly with zero wait time.",
      "pt": "Ambiente sofisticado e acolhedor. A reserva online funcionou sem filas nem atrasos.",
      "fr": "Ambiance feutrée et chaleureuse. La réservation en ligne a fonctionné sans la moindre attente.",
      "ja": "洗練されつつも温かみのある空間。事前のオンライン予約で待ち時間なく案内されました。"
    },
    "status": "approved",
    "createdAt": "2026-10-25T01:37:31.924Z"
  },
  {
    "id": "rev-19",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-jp-ginza",
    "userName": "Carolina Ramírez",
    "userAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Una experiencia gastronómica inolvidable. El servicio por QR fue inmediato y los platos llegaron en su punto perfecto.",
      "en": "An unforgettable culinary experience. The table QR order was swift and dishes arrived at absolute perfection.",
      "pt": "Uma experiência gastronômica inesquecível. O pedido pelo QR foi rápido e os pratos chegaram perfeitos.",
      "fr": "Une expérience gastronomique inoubliable. La commande par QR fut instantanée et les assiettes parfaites.",
      "ja": "忘れられない美食体験でした。テーブルQRでの注文はとてもスムーズで、料理も最高の焼き加減でした。"
    },
    "reply": {
      "text": {
        "es": "¡Muchas gracias por su visita! Nos alegra saber que disfrutó de nuestra propuesta culinaria.",
        "en": "Thank you very much for your visit! We are thrilled you enjoyed our culinary craft.",
        "pt": "Muito obrigado pela visita! Ficamos felizes que tenha apreciado nossa gastronomia.",
        "fr": "Merci infiniment pour votre visite! Nous sommes ravis que notre cuisine vous ait comblé.",
        "ja": "ご来店誠にありがとうございました！おもてなしとお料理をお楽しみいただけて光栄です。"
      },
      "repliedAt": "2026-11-10T14:30:00Z",
      "repliedBy": "Equipo de Sala"
    },
    "status": "approved",
    "createdAt": "2026-10-24T01:37:31.924Z"
  },
  {
    "id": "rev-20",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-jp-shinjuku",
    "userName": "Gabriel Barbosa",
    "userAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    "rating": 4,
    "comment": {
      "es": "El almuerzo del día superó todas mis expectativas: ingredientes fresquísimos y una cocción a las brasas impecable.",
      "en": "The daily lunch special exceeded all expectations: remarkably fresh produce and flawless charcoal grilling.",
      "pt": "O almoço do dia superou as expectativas: ingredientes fresquíssimos e ponto da brasa impecável.",
      "fr": "Le plat du jour a dépassé toutes mes attentes: produits d’une fraîcheur remarquable et cuisson au feu de bois impeccable.",
      "ja": "本日のおすすめランチは期待以上でした。食材の鮮度が際立ち、炭火の香ばしさが格別でした。"
    },
    "reply": {
      "text": {
        "es": "Es un placer atenderle. Cada mañana preparamos el almuerzo del día con productos locales de proximidad.",
        "en": "A pleasure serving you. We craft our daily lunch every morning using fresh regional harvest.",
        "pt": "Foi um prazer atendê-lo. Preparamos o almoço do dia diariamente com ingredientes locais selecionados.",
        "fr": "Tout le plaisir est pour nous. Nous élaborons le menu du jour chaque matin avec les arrivages frais.",
        "ja": "温かいお言葉をいただき感謝申し上げます。毎朝仕入れる旬の素材で心を込めてお作りしております。"
      },
      "repliedAt": "2026-11-09T18:00:00Z",
      "repliedBy": "Chef Ejecutivo"
    },
    "status": "approved",
    "createdAt": "2026-10-23T01:37:31.924Z"
  },
  {
    "id": "rev-21",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-co-usaquen",
    "userName": "Comensal Gourmet 21",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-25T13:37:37.906Z"
  },
  {
    "id": "rev-22",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-co-chico",
    "userName": "Comensal Gourmet 22",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-24T17:37:37.906Z"
  },
  {
    "id": "rev-23",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-co-zonag",
    "userName": "Comensal Gourmet 23",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-23T21:37:37.906Z"
  },
  {
    "id": "rev-24",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-br-pinheiros",
    "userName": "Comensal Gourmet 24",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-23T01:37:37.907Z"
  },
  {
    "id": "rev-25",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-br-jardins",
    "userName": "Comensal Gourmet 25",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-22T05:37:37.907Z"
  },
  {
    "id": "rev-26",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-br-liberdade",
    "userName": "Comensal Gourmet 26",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-21T09:37:37.907Z"
  },
  {
    "id": "rev-27",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-br-itaim",
    "userName": "Comensal Gourmet 27",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-20T13:37:37.907Z"
  },
  {
    "id": "rev-28",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-us-manhattan",
    "userName": "Comensal Gourmet 28",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-19T17:37:37.907Z"
  },
  {
    "id": "rev-29",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-us-brooklyn",
    "userName": "Comensal Gourmet 29",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-18T21:37:37.907Z"
  },
  {
    "id": "rev-30",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-us-soho",
    "userName": "Comensal Gourmet 30",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-18T01:37:37.907Z"
  },
  {
    "id": "rev-31",
    "restaurantId": "brand-sora",
    "branchId": "br-sora-us-williamsburg",
    "userName": "Comensal Gourmet 31",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-17T05:37:37.907Z"
  },
  {
    "id": "rev-32",
    "restaurantId": "brand-aura",
    "branchId": "br-aura-fr-marais",
    "userName": "Comensal Gourmet 32",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "rating": 5,
    "comment": {
      "es": "Servicio excepcional y platos extraordinarios. Todo en perfecto orden.",
      "en": "Exceptional service and extraordinary dishes. Everything was in perfect order.",
      "pt": "Serviço excepcional e pratos extraordinários. Tudo em perfeita harmonia.",
      "fr": "Service exceptionnel et plats extraordinaires. Tout était parfait.",
      "ja": "素晴らしい接客とお料理でした。細やかな気配りに感動しました。"
    },
    "status": "approved",
    "createdAt": "2026-10-16T09:37:37.907Z"
  }
];
export const SEED_RESERVATIONS: Reservation[] = [
  {
    "id": "res-co-1",
    "code": "RES-BOG-101",
    "branchId": "br-aura-co-chapinero",
    "restaurantId": "brand-aura",
    "userId": "usr-cust-bogota",
    "customerName": "Valentina Morales",
    "customerEmail": "valentina.morales@gmail.com",
    "customerPhone": "+57 310 998 7766",
    "date": "2026-11-12",
    "time": "19:30",
    "guestsCount": 2,
    "tableId": "tbl-br-aura-co-chapinero-3",
    "tableNumber": 3,
    "status": "confirmed",
    "notes": "Mesa cerca a la terraza si es posible.",
    "createdAt": "2026-11-11T20:38:00.869Z"
  },
  {
    "id": "res-br-1",
    "code": "RES-SAO-202",
    "branchId": "br-aura-br-pinheiros",
    "restaurantId": "brand-aura",
    "userId": "usr-cust-saopaulo",
    "customerName": "Camila Santos",
    "customerEmail": "camila.santos@gmail.com",
    "customerPhone": "+55 11 98765-4321",
    "date": "2026-11-12",
    "time": "20:00",
    "guestsCount": 4,
    "tableId": "tbl-br-aura-br-pinheiros-2",
    "tableNumber": 2,
    "status": "confirmed",
    "notes": "Comemoração de aniversário.",
    "createdAt": "2026-11-11T13:38:00.869Z"
  },
  {
    "id": "res-us-1",
    "code": "RES-NYC-303",
    "branchId": "br-aura-us-manhattan",
    "restaurantId": "brand-aura",
    "userId": "usr-cust-nuevayork",
    "customerName": "Sarah Jenkins",
    "customerEmail": "sarah.jenkins@gmail.com",
    "customerPhone": "+1 212 555 0199",
    "date": "2026-11-13",
    "time": "13:00",
    "guestsCount": 2,
    "tableId": "tbl-br-aura-us-manhattan-1",
    "tableNumber": 1,
    "status": "pending",
    "notes": "Window booth requested.",
    "createdAt": "2026-11-11T23:38:00.869Z"
  },
  {
    "id": "res-fr-1",
    "code": "RES-PAR-404",
    "branchId": "br-aura-fr-marais",
    "restaurantId": "brand-aura",
    "userId": "usr-cust-paris",
    "customerName": "Juliette Moreau",
    "customerEmail": "juliette.moreau@gmail.com",
    "customerPhone": "+33 6 12 34 56 78",
    "date": "2026-11-13",
    "time": "20:30",
    "guestsCount": 2,
    "tableId": "tbl-br-aura-fr-marais-2",
    "tableNumber": 2,
    "status": "confirmed",
    "notes": "Dîner d’affaires au calme.",
    "createdAt": "2026-11-11T21:38:00.869Z"
  },
  {
    "id": "res-jp-1",
    "code": "RES-TYO-505",
    "branchId": "br-aura-jp-shibuya",
    "restaurantId": "brand-aura",
    "userId": "usr-cust-tokio",
    "customerName": "Yuki Takahashi",
    "customerEmail": "yuki.takahashi@gmail.com",
    "customerPhone": "+81 90-1234-5678",
    "date": "2026-11-12",
    "time": "19:00",
    "guestsCount": 2,
    "tableId": "tbl-br-aura-jp-shibuya-3",
    "tableNumber": 3,
    "status": "confirmed",
    "notes": "静かな席を希望します。",
    "createdAt": "2026-11-11T19:38:00.869Z"
  }
];
export const SEED_ORDERS: Order[] = [
  {
    "id": "ord-co-1",
    "orderNumber": "CMD-101",
    "branchId": "br-aura-co-chapinero",
    "restaurantId": "brand-aura",
    "userId": "usr-cust-bogota",
    "orderType": "dine_in",
    "tableId": "tbl-br-aura-co-chapinero-2",
    "tableNumber": 2,
    "items": [
      {
        "menuItemId": "br-aura-co-chapinero-dish-co-aura-01",
        "name": "Empanadas Bogotanas con Ají Casero",
        "quantity": 1,
        "unitPriceMinorUnits": 24000,
        "subtotalMinorUnits": 24000,
        "unitPrice": 24000,
        "subtotal": 24000
      },
      {
        "menuItemId": "br-aura-co-chapinero-dish-co-lunch",
        "name": "Almuerzo del Día: Pechuga a la Brasa con Arroz de Coco",
        "quantity": 2,
        "unitPriceMinorUnits": 25900,
        "subtotalMinorUnits": 51800,
        "unitPrice": 25900,
        "subtotal": 51800
      }
    ],
    "subtotalMinorUnits": 75800,
    "taxAmountMinorUnits": 6064,
    "tipAmountMinorUnits": 7580,
    "deliveryFeeMinorUnits": 0,
    "totalMinorUnits": 89444,
    "subtotal": 75800,
    "taxAmount": 6064,
    "tipAmount": 7580,
    "total": 89444,
    "currency": "COP",
    "status": "preparing",
    "paymentMethod": "card",
    "paymentStatus": "paid",
    "createdAt": "2026-11-12T01:23:00.869Z",
    "updatedAt": "2026-11-12T01:28:00.869Z",
    "estimatedReadyMinutes": 20,
    "customerName": "Valentina Morales"
  }
];
export const SEED_NOTIFICATIONS: AppNotification[] = [];
export const SEED_EVENTS: DistributedEvent[] = [];
export const SEED_SERVICES: ServiceDefinition[] = [
  { id: 'auth-service', nameKey: 'service_auth', descriptionKey: 'service_auth_desc', status: 'healthy', publishes: ['USER_LOGGED_IN', 'USER_LOGGED_OUT', 'DATA_ERASURE_REQUESTED'], consumes: [], processedCount: 120, failedCount: 0 },
  { id: 'restaurant-service', nameKey: 'service_restaurant', descriptionKey: 'service_restaurant_desc', status: 'healthy', publishes: ['PRODUCT_AVAILABILITY_CHANGED', 'RESTAURANT_UPDATED', 'CATALOG_CACHE_INVALIDATED'], consumes: ['PRODUCT_AVAILABILITY_CHANGED'], processedCount: 340, failedCount: 0 },
  { id: 'reservation-service', nameKey: 'service_reservation', descriptionKey: 'service_reservation_desc', status: 'healthy', publishes: ['RESERVATION_CREATED', 'RESERVATION_CONFIRMED', 'RESERVATION_CANCELLED'], consumes: [], processedCount: 88, failedCount: 0 },
  { id: 'order-service', nameKey: 'service_order', descriptionKey: 'service_order_desc', status: 'healthy', publishes: ['ORDER_CREATED', 'ORDER_PAID', 'ORDER_DELIVERED', 'SAGA_COMPENSATED'], consumes: ['PRODUCT_AVAILABILITY_CHANGED'], processedCount: 210, failedCount: 0 },
  { id: 'kitchen-service', nameKey: 'service_kitchen', descriptionKey: 'service_kitchen_desc', status: 'healthy', publishes: ['ORDER_PREPARING', 'ORDER_READY'], consumes: ['ORDER_CREATED'], processedCount: 195, failedCount: 0 },
  { id: 'dispatch-service', nameKey: 'service_dispatch', descriptionKey: 'service_dispatch_desc', status: 'healthy', publishes: ['COURIER_ASSIGNED'], consumes: ['ORDER_READY', 'DISPATCH_RELEASE_LEASE'], processedCount: 142, failedCount: 0 },
  { id: 'payments-service', nameKey: 'service_payments', descriptionKey: 'service_payments_desc', status: 'healthy', publishes: ['PAYMENT_PROCESSED', 'PAYMENT_AUTHORIZED', 'PAYMENT_CAPTURED', 'PAYMENT_REFUNDED'], consumes: ['PAYMENT_AUTHORIZE_REQUEST', 'PAYMENT_CAPTURE_REQUEST', 'PAYMENT_VOID_REQUEST', 'PAYMENT_REFUND_REQUEST'], processedCount: 205, failedCount: 0 },
  { id: 'billing-service', nameKey: 'service_billing', descriptionKey: 'service_billing_desc', status: 'healthy', publishes: ['INVOICE_GENERATED'], consumes: ['ORDER_PAID'], processedCount: 184, failedCount: 0 },
  { id: 'notification-service', nameKey: 'service_notification', descriptionKey: 'service_notification_desc', status: 'healthy', publishes: [], consumes: ['ORDER_CREATED', 'RESERVATION_CREATED', 'COURIER_ASSIGNED', 'SAGA_COMPENSATED'], processedCount: 450, failedCount: 0 },
  { id: 'fx-service', nameKey: 'service_fx', descriptionKey: 'service_fx_desc', status: 'healthy', publishes: ['FX_RATES_UPDATED'], consumes: ['FX_RATES_UPDATED'], processedCount: 96, failedCount: 0 },
  { id: 'analytics-service', nameKey: 'service_analytics', descriptionKey: 'service_analytics_desc', status: 'healthy', publishes: ['METRICS_AGGREGATED'], consumes: ['ORDER_PAID', 'FX_RATES_UPDATED', 'AUDIT_RECORD'], processedCount: 160, failedCount: 0 },
];
export const SEED_SERVICE_HEALTH: ServiceHealth[] = [
  { id: 'auth-service', service: 'auth-service', nameKey: 'service_auth', descriptionKey: 'service_auth_desc', status: 'up', latencyMs: 12, processedCount: 120, processedEventsCount: 120, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.98 },
  { id: 'restaurant-service', service: 'restaurant-service', nameKey: 'service_restaurant', descriptionKey: 'service_restaurant_desc', status: 'up', latencyMs: 18, processedCount: 340, processedEventsCount: 340, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.95 },
  { id: 'reservation-service', service: 'reservation-service', nameKey: 'service_reservation', descriptionKey: 'service_reservation_desc', status: 'up', latencyMs: 25, processedCount: 88, processedEventsCount: 88, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.99 },
  { id: 'order-service', service: 'order-service', nameKey: 'service_order', descriptionKey: 'service_order_desc', status: 'up', latencyMs: 22, processedCount: 210, processedEventsCount: 210, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.94 },
  { id: 'kitchen-service', service: 'kitchen-service', nameKey: 'service_kitchen', descriptionKey: 'service_kitchen_desc', status: 'up', latencyMs: 15, processedCount: 195, processedEventsCount: 195, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.96 },
  { id: 'dispatch-service', service: 'dispatch-service', nameKey: 'service_dispatch', descriptionKey: 'service_dispatch_desc', status: 'up', latencyMs: 21, processedCount: 142, processedEventsCount: 142, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.93 },
  { id: 'payments-service', service: 'payments-service', nameKey: 'service_payments', descriptionKey: 'service_payments_desc', status: 'up', latencyMs: 28, processedCount: 205, processedEventsCount: 205, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.97 },
  { id: 'billing-service', service: 'billing-service', nameKey: 'service_billing', descriptionKey: 'service_billing_desc', status: 'up', latencyMs: 16, processedCount: 184, processedEventsCount: 184, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.99 },
  { id: 'notification-service', service: 'notification-service', nameKey: 'service_notification', descriptionKey: 'service_notification_desc', status: 'up', latencyMs: 9, processedCount: 450, processedEventsCount: 450, failedCount: 0, failedEventsCount: 0, uptimePercent: 100 },
  { id: 'fx-service', service: 'fx-service', nameKey: 'service_fx', descriptionKey: 'service_fx_desc', status: 'up', latencyMs: 19, processedCount: 96, processedEventsCount: 96, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.99 },
  { id: 'analytics-service', service: 'analytics-service', nameKey: 'service_analytics', descriptionKey: 'service_analytics_desc', status: 'up', latencyMs: 30, processedCount: 160, processedEventsCount: 160, failedCount: 0, failedEventsCount: 0, uptimePercent: 99.91 },
];

export const INITIAL_RESTAURANTS = SEED_RESTAURANTS;
export const INITIAL_BRANCHES = SEED_BRANCHES;
export const INITIAL_USERS = SEED_USERS;
export const INITIAL_TABLES = SEED_TABLES;
export const INITIAL_MENU_ITEMS = SEED_MENU_ITEMS;
export const INITIAL_REVIEWS = SEED_REVIEWS;
export const INITIAL_RESERVATIONS = SEED_RESERVATIONS;
export const INITIAL_ORDERS = SEED_ORDERS;
export const INITIAL_NOTIFICATIONS = SEED_NOTIFICATIONS;
export const INITIAL_EVENTS = SEED_EVENTS;
export const INITIAL_SERVICES = SEED_SERVICES;
export const INITIAL_SERVICE_HEALTH = SEED_SERVICE_HEALTH;
