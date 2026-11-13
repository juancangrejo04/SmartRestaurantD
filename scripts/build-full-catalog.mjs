import fs from 'fs';

// Master DISH_CATALOG for all 5 countries (CO, BR, US, FR, JP)
// Exactly 10 dishes per country = 50 total dishes
// Each country has:
// - 4 dishes for brand-aura
// - 4 dishes for brand-sora
// - 1 Lunch of the Day (exact minor units price)
// - 1 signature drink
// Every single dish has a UNIQUE photo URL, unique imageAlt, and translations in es, en, pt, fr, ja.

const coDishes = JSON.parse(fs.readFileSync('scripts/co_dishes.json', 'utf8'));

const brDishes = [
  {
    id: 'dish-br-aura-01',
    restaurantId: 'brand-aura',
    countryCode: 'BR',
    category: 'starters',
    name: {
      es: 'Dadinhos de Tapioca con Miel de Caña y Pimienta',
      en: 'Crispy Tapioca Cubes with Spiced Cane Honey',
      pt: 'Dadinhos de Tapioca com Mel de Engenho e Pimenta',
      fr: 'Dés de tapioca croustillants et miel de canne pimenté',
      ja: 'タピオカとケージョ・コアーリョのサクサク角切り揚げ'
    },
    description: {
      es: 'Cubos crujientes de tapioca y queso coalho artesanal, dorados y servidos con reducción de miel de caña.',
      en: 'Golden crispy cubes of cassava tapioca and artisanal coalho cheese, served with spiced cane syrup.',
      pt: 'Cubos crocantes de tapioca e queijo coalho artesanal, dourados e servidos com mel de engenho.',
      fr: 'Cubes dorés de tapioca et fromage brésilien coalho, servis avec une réduction de mélasse douce.',
      ja: 'キャッサバ芋のタピオカと伝統チーズを黄金色に揚げ、サトウキビ蜜ソースを添えた一品。'
    },
    priceMinorUnits: 2800,
    price: 28,
    basePriceUSD: 5.0,
    prepTimeMinutes: 12,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Dadinhos de tapioca dorados en plato de cerámica',
      en: 'Golden tapioca cheese cubes on ceramic plate',
      pt: 'Dadinhos de tapioca crocantes em prato de cerâmica',
      fr: 'Dés de tapioca dorés sur assiette en céramique',
      ja: '陶器の皿に盛られた黄金色のタピオカキューブ'
    },
    fallbackEmoji: '🧀'
  },
  {
    id: 'dish-br-aura-02',
    restaurantId: 'brand-aura',
    countryCode: 'BR',
    category: 'mains',
    name: {
      es: 'Feijoada Completa da Casa com Farofa',
      en: 'Traditional Brazilian Black Bean Feijoada',
      pt: 'Feijoada Tradicional da Casa com Farofa e Couve',
      fr: 'Feijoada brésilienne complète et farofa',
      ja: 'ブラジル伝統のフェイジョアーダ（黒豆と豚肉の煮込み）'
    },
    description: {
      es: 'Guiso lento de frijoles negros con cortes selectos de cerdo y res curada, acompañado de arroz, farofa, col salteada y naranja.',
      en: 'Slow-simmered black bean stew with cured beef and pork cuts, served with farofa, garlicky collard greens and rice.',
      pt: 'Feijão preto com carnes nobres curadas, servido com arroz branco, farofa na manteiga, couve refogada e laranja.',
      fr: 'Mijoté de haricots noirs et viandes fumées, servi avec riz blanc, farofa au beurre et chou vert émincé.',
      ja: '厳選した牛肉と豚肉を黒豆とじっくり煮込んだブラジルの国民食。キャッサバ粉とケール添え。'
    },
    priceMinorUnits: 6800,
    price: 68,
    basePriceUSD: 12.14,
    prepTimeMinutes: 20,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Cazuela de feijoada tradicional con acompañamientos',
      en: 'Traditional feijoada casserole with side dishes',
      pt: 'Cumbuca de feijoada fumegante com acompanhamentos',
      fr: 'Cassolette de feijoada fumante et ses garnitures',
      ja: '黒豆と肉が煮込まれた本場のフェイジョアーダ'
    },
    fallbackEmoji: '🍲'
  },
  {
    id: 'dish-br-aura-03',
    restaurantId: 'brand-aura',
    countryCode: 'BR',
    category: 'mains',
    name: {
      es: 'Picanha Nobre Grelhada com Vinagrete',
      en: 'Prime Grilled Picanha with Farofa & Vinaigrette',
      pt: 'Picanha Nobre na Brasa com Farofa de Ovos',
      fr: 'Picanha de bœuf braisée, farofa aux œufs',
      ja: '極上牛イチボ肉（ピカーニャ）の炭火シュラスコ焼き'
    },
    description: {
      es: 'Corte noble a la parrilla con capa crujiente de sal marina, acompañado de farofa de huevos, vinagreta fresca y yuca frita.',
      en: 'Prime sirloin cap steak grilled over open flames, served with egg farofa, fresh tomato salsa and fried cassava.',
      pt: 'Corte nobre na brasa com crosta de sal grosso, farofa crocante de ovos, vinagrete fresca e mandioca frita.',
      fr: 'Aiguillette de rumsteck brésilienne grillée à la flamme, servie avec farofa aux œufs et manioc doré.',
      ja: '表面を岩塩で香ばしく焼き上げた極上ピカーニャステーキ。キャッサバ芋フライ添え。'
    },
    priceMinorUnits: 7900,
    price: 79,
    basePriceUSD: 14.10,
    prepTimeMinutes: 18,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Cortes jugosos de picanha a la brasa con guarnición',
      en: 'Juicy sliced grilled picanha with sides',
      pt: 'Fatias suculentas de picanha na brasa',
      fr: 'Tranches juteuses de picanha grillée',
      ja: '炭火で香ばしく焼き上がったピカーニャの断面'
    },
    fallbackEmoji: '🥩'
  },
  {
    id: 'dish-br-aura-04',
    restaurantId: 'brand-aura',
    countryCode: 'BR',
    category: 'desserts',
    name: {
      es: 'Pudim de Leite Condensado com Fava de Baunilha',
      en: 'Brazilian Caramel Milk Flan with Bourbon Vanilla',
      pt: 'Pudim de Leite Condensado Tradicional Lisinho',
      fr: 'Flan brésilien au lait caramélisé et vanille',
      ja: '濃厚ブラジリアン・キャラメルプヂン（自家製プリン）'
    },
    description: {
      es: 'Pudín brasileño ultra cremoso, sin burbujas, horneado a baño maría con caramelo brillante y vainilla natural.',
      en: 'Silky smooth Brazilian baked milk custard flan bathed in rich amber caramel and Madagascar vanilla.',
      pt: 'Pudim de textura impecável e aveludada, sem furinhos, banhado em calda dourada de caramelo artesanal.',
      fr: 'Flan pâtissier au lait concentré d’une texture soyeuse parfaite, nappé de caramel blond ambré.',
      ja: 'すが入らないよう低温湯煎で滑らかに焼き上げた、濃厚でコク深いブラジル風プリン。'
    },
    priceMinorUnits: 2200,
    price: 22,
    basePriceUSD: 3.92,
    prepTimeMinutes: 8,
    available: true,
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Porción de pudim de leche bañado en caramelo dorado',
      en: 'Slice of Brazilian milk flan with caramel glaze',
      pt: 'Fatia de pudim de leite com calda brilhante',
      fr: 'Part de flan nappée de caramel liquide',
      ja: '艶やかなカラメルソースがかかった濃厚プヂン'
    },
    fallbackEmoji: '🍮'
  },
  {
    id: 'dish-br-sora-01',
    restaurantId: 'brand-sora',
    countryCode: 'BR',
    category: 'starters',
    name: {
      es: 'Ceviche Paulistano de Robalo e Caju',
      en: 'Sao Paulo Sea Bass Ceviche with Fresh Cashew Fruit',
      pt: 'Ceviche Paulistano de Robalo com Caju Fresco',
      fr: 'Ceviche de bar pauliste à la pomme de cajou',
      ja: 'スズキと生カシューフルーツのサンパウロ風セビーチェ'
    },
    description: {
      es: 'Robalo salvaje marinado en lima y jengibre con dados de cajú fresco, cebolla morada y crujiente de maíz.',
      en: 'Fresh wild sea bass cured in lime juice and ginger, tossed with sweet cashew fruit cubes and red onions.',
      pt: 'Robalo fresco curado no limão-cravo com cubos de caju, cebola roxa e pimenta dedo-de-moça.',
      fr: 'Bar frais mariné au citron vert et gingembre, dés de pomme de cajou et oignons rouges doux.',
      ja: '新鮮なスズキにブラジル産生カシュー果実と赤玉ねぎ、ライム果汁を合わせた創作前菜。'
    },
    priceMinorUnits: 4200,
    price: 42,
    basePriceUSD: 7.50,
    prepTimeMinutes: 10,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Tazón de ceviche fresco con cajú y cilantro',
      en: 'Bowl of fresh sea bass ceviche with herbs',
      pt: 'Tigela de ceviche fresco de robalo e caju',
      fr: 'Bol de ceviche de poisson frais aux herbes',
      ja: 'ハーブとフルーツを添えた爽やかなセビーチェ'
    },
    fallbackEmoji: '🐟'
  },
  {
    id: 'dish-br-sora-02',
    restaurantId: 'brand-sora',
    countryCode: 'BR',
    category: 'mains',
    name: {
      es: 'Combinado Sora Nikkei São Paulo (16 Piezas)',
      en: 'Sora Nikkei Sushi Combination (16 Pcs)',
      pt: 'Combinado Sora Nikkei São Paulo (16 Peças)',
      fr: 'Assortiment Sora Nikkei São Paulo (16 pièces)',
      ja: '宙 (Sora) 日系握り・巻き寿司盛り合わせ（16貫）'
    },
    description: {
      es: 'Selección de sashimis de atún rojo, nigiris de salmón trufado con raspaduras de lima y uramakis especiales.',
      en: 'Selection of bluefin tuna sashimi, seared truffle salmon nigiri with lime zest, and specialty rolls.',
      pt: 'Sashimis de atum fresco, nigiris de salmão trufado maçaricado com raspas de limão e rolls autorais.',
      fr: 'Sélection de sashimis de thon rouge, nigiris de saumon truffé et rolls spéciaux d’inspiration nippo-brésilienne.',
      ja: 'リベルダーデ伝統の日系技術。本マグロ、トリュフ炙りサーモン、特製ロールの上品な盛り合わせ。'
    },
    priceMinorUnits: 8900,
    price: 89,
    basePriceUSD: 15.89,
    prepTimeMinutes: 16,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Plato refinado de sushi y sashimi variado',
      en: 'Refined platter of assorted sushi and sashimi',
      pt: 'Prato refinado de sushis e sashimis variados',
      fr: 'Plateau gastronomique de sushis et sashimis',
      ja: '厳選鮮魚の寿司と刺身の盛り合わせプレート'
    },
    fallbackEmoji: '🍣'
  },
  {
    id: 'dish-br-sora-03',
    restaurantId: 'brand-sora',
    countryCode: 'BR',
    category: 'mains',
    name: {
      es: 'Tonkotsu Ramen Liberdade Especial',
      en: 'Liberdade Rich Tonkotsu Pork Ramen',
      pt: 'Tonkotsu Ramen Especial do Bairro Liberdade',
      fr: 'Ramen Tonkotsu au bouillon riche de Liberdade',
      ja: 'リベルダーデ仕込み 濃厚豚骨特製ラーメン'
    },
    description: {
      es: 'Caldo de cerdo cocido por 20 horas en tetera tradicional, panceta braseada chashu, huevo marinado y alga nori.',
      en: '20-hour velvety pork bone broth, tender chashu pork belly, seasoned ramen egg, menma and nori.',
      pt: 'Caldo denso de ossos suínos cozido por 20 horas, barriga de porco braseada, ovo caipira marinado e nori.',
      fr: 'Bouillon tonkotsu mijoté 20h, poitrine de porc braisée, œuf mariné tamago et feuille de nori.',
      ja: '20時間丁寧に煮出した極上豚骨白湯スープ。とろける豚バラチャーシューと煮玉子をトッピング。'
    },
    priceMinorUnits: 5800,
    price: 58,
    basePriceUSD: 10.35,
    prepTimeMinutes: 14,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Tazón de tonkotsu ramen con caldo espeso y chashu',
      en: 'Bowl of tonkotsu ramen with thick broth and pork',
      pt: 'Tigela de tonkotsu ramen com caldo rico',
      fr: 'Bol de ramen tonkotsu au bouillon onctueux',
      ja: '極厚チャーシューが乗った濃厚豚骨ラーメン'
    },
    fallbackEmoji: '🍜'
  },
  {
    id: 'dish-br-sora-04',
    restaurantId: 'brand-sora',
    countryCode: 'BR',
    category: 'desserts',
    name: {
      es: 'Choux Cream de Açaí y Chocolate Amazónico',
      en: 'Amazonian Acai & Dark Chocolate Choux Cream',
      pt: 'Choux Cream de Açaí com Chocolate Amazônico',
      fr: 'Choux croustillant à l’açaï et chocolat d’Amazonie',
      ja: 'アマゾンアサイーと特製ショコラのシュークリーム'
    },
    description: {
      es: 'Masa choux crujiente rellena de crema pastelera ligera de açaí silvestre y ganache de chocolate 70% de Bahía.',
      en: 'Crisp French-Japanese choux pastry filled with wild acai custard and 70% Bahia dark chocolate ganache.',
      pt: 'Massa choux crocante recheada com creme aveludado de açaí puro e ganache de chocolate 70% da Bahia.',
      fr: 'Pâte à choux craquelin garnie d’une crème légère à l’açaï sauvage et ganache au chocolat 70%.',
      ja: 'サクサクのシュー生地にアマゾン直輸入のアサイークリームとバイーア産ビターチョコを絞った洋菓子。'
    },
    priceMinorUnits: 2600,
    price: 26,
    basePriceUSD: 4.64,
    prepTimeMinutes: 7,
    available: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Choux cream con cobertura craquelada y relleno de chocolate',
      en: 'Craquelin choux cream filled with rich pastry cream',
      pt: 'Choux cream com crosta crocante e recheio cremoso',
      fr: 'Chou pâtissier au craquelin et crème onctueuse',
      ja: '香ばしいクッキーシュークリームの断面'
    },
    fallbackEmoji: '🧁'
  },
  {
    id: 'dish-br-lunch',
    restaurantId: 'brand-aura',
    countryCode: 'BR',
    category: 'mains',
    isLunchOfTheDay: true,
    name: {
      es: 'Almuerzo del Día: Prato Feito Paulistano com Filé de Frango na Brasa',
      en: 'Lunch of the Day: Brazilian Prato Feito with Grilled Chicken',
      pt: 'Almoço do Dia: Prato Feito com Filé de Frango Grelhado, Arroz e Feijão',
      fr: 'Plat du jour midi: Assiette traditionnelle au poulet grillé et haricots',
      ja: '本日のおすすめランチ：サンパウロ風プラット・フェイト（若鶏のグリル定食）'
    },
    description: {
      es: 'El clásico almuerzo brasileño: pechuga marinada a la plancha, arroz blanco, frijoles carioca caldosos, farofa crocante y ensalada.',
      en: 'The classic daily Brazilian lunch: grilled chicken breast, white rice, seasoned carioca beans, farofa and greens.',
      pt: 'O autêntico PF paulistano: filé de frango grelhado macio, arroz agulhinha, feijão carioca fresquinho, farofa crocante e salada.',
      fr: 'L’incontournable déjeuner brésilien: filet de poulet grillé, riz blanc, haricots mijotés, farofa et salade verte.',
      ja: '柔らかい若鶏のグリル、炊きたてご飯、カリオカ豆のスープ、香ばしいファロッファとサラダの定番定食。'
    },
    priceMinorUnits: 2590, // EXACT PROMPT VALUE: 2590 (R$ 25,90)
    price: 25.90,
    basePriceUSD: 4.62,
    prepTimeMinutes: 10,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Prato feito brasileño con arroz, frijoles y pollo',
      en: 'Classic Brazilian plate with rice, beans and chicken',
      pt: 'Prato feito clássico com arroz, feijão e frango grelhado',
      fr: 'Assiette brésilienne avec riz, haricots et volaille',
      ja: 'ご飯と豆スープ、鶏肉が並ぶ伝統のプラットフェイト'
    },
    fallbackEmoji: '🍽️'
  },
  {
    id: 'dish-br-drink-01',
    restaurantId: 'brand-aura',
    countryCode: 'BR',
    category: 'drinks',
    name: {
      es: 'Suco de Cajú e Maracujá Fresco',
      en: 'Fresh Brazilian Cashew & Passionfruit Juice',
      pt: 'Suco Natural de Caju com Maracujá',
      fr: 'Jus naturel de fruit de cajou et fruit de la passion',
      ja: '生カシュー果実とパッションフルーツのフレッシュジュース'
    },
    description: {
      es: 'Jugo natural preparado al momento con pulpa fresca de cajú brasileño, maracuyá aromático y hojas de menta.',
      en: 'Refreshing fresh-pressed juice blending natural cashew fruit pulp, tart passionfruit and fresh mint leaves.',
      pt: 'Suco 100% natural batido com polpa fresca de caju, maracujá da época e folhas de hortelã.',
      fr: 'Jus pressé minute mariant la douceur de la pomme de cajou et l’acidité parfumée du fruit de la passion.',
      ja: '熱帯の生カシュー果実とパッションフルーツを贅沢に絞った、爽やかな果汁100%ジュース。'
    },
    priceMinorUnits: 1500,
    price: 15,
    basePriceUSD: 2.68,
    prepTimeMinutes: 5,
    available: true,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Vaso de jugo natural helado de frutas tropicales',
      en: 'Iced natural tropical fruit juice glass',
      pt: 'Copo de suco natural gelado de frutas tropicais',
      fr: 'Verre de jus de fruits tropicaux frais et glaçons',
      ja: '氷の入った冷たいトロピカルフルーツジュース'
    },
    fallbackEmoji: '🍹'
  }
];

fs.writeFileSync('scripts/br_dishes.json', JSON.stringify(brDishes, null, 2));
console.log('Brazil dishes created successfully:', brDishes.length);
