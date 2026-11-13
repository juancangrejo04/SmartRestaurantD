import fs from 'fs';

// US Dishes (USD) - Lunch of day: 2590 minor units ($25.90)
const usDishes = [
  {
    id: 'dish-us-aura-01',
    restaurantId: 'brand-aura',
    countryCode: 'US',
    category: 'starters',
    name: {
      es: 'Tartar de Atún Rojo de Montauk con Aguacate',
      en: 'Montauk Yellowfin Tuna Tartare with Avocado',
      pt: 'Tartar de Atum de Montauk com Abacate',
      fr: 'Tartare de thon jaune de Montauk à l’avocat',
      ja: 'モントーク産キハダマグロとアボカドのタルタル'
    },
    description: {
      es: 'Atún fresco de Long Island cortado a cuchillo con aguacate hass, vinagreta de sésamo y chips de yuca.',
      en: 'Hand-cut wild Montauk yellowfin tuna, smashed hass avocado, sesame-ginger dressing and taro crisps.',
      pt: 'Atum fresco selvagem cortado na ponta da faca com abacate hass e crocante de mandioca.',
      fr: 'Thon sauvage coupé au couteau, écrasé d’avocat hass, vinaigrette sésame-gingembre et chips de taro.',
      ja: 'ロングアイランド沖で獲れた鮮度の高いキハダマグロをアボカドと合わせた上品な前菜。'
    },
    priceMinorUnits: 2200,
    price: 22,
    basePriceUSD: 22.0,
    prepTimeMinutes: 10,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Tartar de atún emplatado con sésamo y flores comestibles',
      en: 'Tuna tartare plated with sesame and microgreens',
      pt: 'Tartar de atum montado com gergelim',
      fr: 'Tartare de thon dressé avec graines de sésame',
      ja: 'マイクログリーンをあしらったマグロのタルタル'
    },
    fallbackEmoji: '🐟'
  },
  {
    id: 'dish-us-aura-02',
    restaurantId: 'brand-aura',
    countryCode: 'US',
    category: 'mains',
    name: {
      es: 'Bife New York Strip Angus a las Brasas (12 oz)',
      en: 'Dry-Aged USDA Prime NY Strip Steak (12 oz)',
      pt: 'New York Strip Steak Angus Grelhado (340g)',
      fr: 'Faux-filet Black Angus NY Strip maturé (340g)',
      ja: 'プライム認定ブラックアンガス ニューヨークストリップステーキ (340g)'
    },
    description: {
      es: 'Corte madurado en seco por 28 días, sellado a la brasa con mantequilla de ajo asado y papas rústicas trufadas.',
      en: '28-day dry-aged USDA prime strip steak, flame-charred with roasted garlic herb butter and truffle fries.',
      pt: 'Corte nobre maturado a seco por 28 dias, grelhado na brasa com manteiga de alho e batatas rústicas.',
      fr: 'Faux-filet maturé 28 jours, grillé à haute température, beurre aux herbes et frites à la truffe.',
      ja: '28日間熟成させた最高級アンガス牛を高温で焼き上げ、ガーリックハーブバターを添えた王道ステーキ。'
    },
    priceMinorUnits: 4800,
    price: 48,
    basePriceUSD: 48.0,
    prepTimeMinutes: 18,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Corte grueso de bife asado con mantequilla aromática',
      en: 'Thick grilled strip steak with melting herb butter',
      pt: 'Bife grelhado suculento com manteiga de ervas',
      fr: 'Steak de faux-filet grillé et noisette de beurre',
      ja: 'ハーブバターが溶け出す肉厚なグリルステーキ'
    },
    fallbackEmoji: '🥩'
  },
  {
    id: 'dish-us-aura-03',
    restaurantId: 'brand-aura',
    countryCode: 'US',
    category: 'mains',
    name: {
      es: 'Salmón Salvaje de Alaska con Risotto de Maíz Dulce',
      en: 'Pan-Roasted Alaskan King Salmon & Sweet Corn Risotto',
      pt: 'Salmão Selvagem do Alasca com Risoto de Milho Doce',
      fr: 'Saumon sauvage d’Alaska rôti et risotto au maïs doux',
      ja: 'アラスカ産キングサーモンのソテー スイートコーンのリゾット添え'
    },
    description: {
      es: 'Filete de salmón salvaje con piel crujiente sobre risotto cremoso de maíz tierno y emulsión cítrica de estragón.',
      en: 'Crispy-skin wild Alaskan king salmon over creamy Hudson Valley sweet corn risotto and tarragon citrus emulsion.',
      pt: 'Filé de salmão com pele crocante servido sobre risoto cremoso de milho doce.',
      fr: 'Pavé de saumon sauvage croustillant sur risotto crémeux au maïs doux et jus réduit aux herbes.',
      ja: '皮目を香ばしく焼き上げた天然キングサーモンと、濃厚なコーンリゾットのハーモニー。'
    },
    priceMinorUnits: 3900,
    price: 39,
    basePriceUSD: 39.0,
    prepTimeMinutes: 16,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Filete de salmón dorado con guarnición cremosa',
      en: 'Seared golden salmon fillet with creamy side',
      pt: 'Filé de salmão dourado com acompanhamento cremoso',
      fr: 'Pavé de saumon doré sur lit de légumes',
      ja: '黄金色に香ばしく焼かれたサーモンのフィレ'
    },
    fallbackEmoji: '🐟'
  },
  {
    id: 'dish-us-aura-04',
    restaurantId: 'brand-aura',
    countryCode: 'US',
    category: 'desserts',
    name: {
      es: 'Cheesecake Estilo Nueva York con Frutos Rojos',
      en: 'Classic NY Baked Cheesecake with Berry Coulis',
      pt: 'Cheesecake Tradicional de Nova York com Frutas Vermelhas',
      fr: 'Cheesecake new-yorkais traditionnel et coulis de baies',
      ja: '本場ニューヨーク・ベイクドチーズケーキ ベリーソース添え'
    },
    description: {
      es: 'Tarta horneada densa y aterciopelada sobre base de galleta graham con compota de moras silvestres y arándanos.',
      en: 'Dense, creamy baked cream cheese cake on buttery graham crust with wild blueberry and blackberry coulis.',
      pt: 'Torta assada clássica ultra cremosa sobre crosta de biscoito amanteigado com calda de frutas silvestres.',
      fr: 'Gâteau crémeux au fromage frais sur croûte de biscuit sablé et coulis de myrtilles sauvages.',
      ja: 'グラハムクラッカーの土台に濃厚なクリームチーズをじっくり焼き上げた、本場のベイクドチーズケーキ。'
    },
    priceMinorUnits: 1600,
    price: 16,
    basePriceUSD: 16.0,
    prepTimeMinutes: 6,
    available: true,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Porción de cheesecake con salsa brillante de moras',
      en: 'Slice of New York cheesecake with rich berry sauce',
      pt: 'Fatia de cheesecake novaiorquino com frutas vermelhas',
      fr: 'Part de cheesecake nappe de coulis de fruits rouges',
      ja: 'ベリーソースが添えられた濃厚チーズケーキの一切れ'
    },
    fallbackEmoji: '🍰'
  },
  {
    id: 'dish-us-sora-01',
    restaurantId: 'brand-sora',
    countryCode: 'US',
    category: 'starters',
    name: {
      es: 'Hamachi Crudo con Ponzu Trufado y Serrano',
      en: 'Yellowtail Hamachi Crudo with Truffle Ponzu & Serrano',
      pt: 'Hamachi Crudo com Ponzu Trufado e Pimenta Serrano',
      fr: 'Crudo de hamachi au ponzu truffé et piment serrano',
      ja: '極上ハマチのクリュード トリュフポン酢とセラーノペッパー'
    },
    description: {
      es: 'Láminas de pez limón fresco con aderezo cítrico de soja trufada, rodajas finas de chile serrano y microcilantro.',
      en: 'Thinly sliced Pacific yellowtail, white truffle ponzu reduction, serrano chili rounds and micro cilantro.',
      pt: 'Fatias finas de peixe hamachi com redução de ponzu trufado e fatias de pimenta serrano.',
      fr: 'Fines tranches de sériole du Pacifique, vinaigrette ponzu à la truffe blanche et piment frais.',
      ja: '引き締まった旬のハマチを白トリュフ香る特製ポン酢とセラーノ唐辛子で引き締めた冷前菜。'
    },
    priceMinorUnits: 2400,
    price: 24,
    basePriceUSD: 24.0,
    prepTimeMinutes: 8,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Láminas de pescado crudo aliñadas con cítricos',
      en: 'Sliced raw fish dressed with citrus ponzu',
      pt: 'Fatias de peixe cru temperadas com ponzu',
      fr: 'Carpaccio de poisson cru aux agrumes',
      ja: '柑橘ポン酢で仕立てた白身魚のカルパッチョ'
    },
    fallbackEmoji: '🐟'
  },
  {
    id: 'dish-us-sora-02',
    restaurantId: 'brand-sora',
    countryCode: 'US',
    category: 'mains',
    name: {
      es: 'Omakase Sora Sushi Seleccion (10 Piezas Nigiri)',
      en: 'Chef’s Omakase Nigiri Tasting (10 Pcs)',
      pt: 'Omakase Sora Nigiri Tasting (10 Peças)',
      fr: 'Menu dégustation Omakase de 10 nigiris d’exception',
      ja: '職人特選おまかせ握り（10貫厳選盛り）'
    },
    description: {
      es: 'Selección estacional directa de la lonja: toro flameado, uni de Santa Bárbara, vieira de Hokkaido y trucha real.',
      en: 'Daily seasonal selection including seared otoro, Santa Barbara sea urchin, Hokkaido scallop and king salmon.',
      pt: 'Seleção do sushiman com otoro maçaricado, ouriço do mar, vieiras e salmão nobre.',
      fr: 'Sélection raffinée du chef: thon gras otoro mi-cuit, oursin de mer, saint-jacques et saumon sauvage.',
      ja: '築地・豊洲直輸入の大トロ炙り、北海道産ホタテ、極上ウニなど熟練の職人が握る10貫。'
    },
    priceMinorUnits: 6500,
    price: 65,
    basePriceUSD: 65.0,
    prepTimeMinutes: 16,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Bandeja de nigiris de alta gama sobre madera',
      en: 'High-end nigiri sushi platter on cedar board',
      pt: 'Bandeja de nigiris nobres sobre tábua de madeira',
      fr: 'Plateau de nigiris haut de gamme sur planche de cèdre',
      ja: '木製寿司ゲタに並ぶ極上の職人握り寿司'
    },
    fallbackEmoji: '🍣'
  },
  {
    id: 'dish-us-sora-03',
    restaurantId: 'brand-sora',
    countryCode: 'US',
    category: 'mains',
    name: {
      es: 'Black Garlic Tonkotsu Ramen de Manhattan',
      en: 'Manhattan Black Garlic Tonkotsu Ramen',
      pt: 'Ramen Tonkotsu de Alho Negro de Manhattan',
      fr: 'Ramen Tonkotsu à l’huile d’ail noir fermenté',
      ja: 'マンハッタン仕込み 自家製黒マー油濃厚豚骨ラーメン'
    },
    description: {
      es: 'Fondo cremoso de cerdo infusionado con aceite de ajo negro asado, panceta Berkshire, huevo marinado y bambú.',
      en: 'Velvety pork bone broth laced with roasted black garlic mayu oil, Berkshire pork belly chashu and menma.',
      pt: 'Caldo rico de porco com óleo de alho negro tostado, barriga Berkshire e ovo cozido marinado.',
      fr: 'Bouillon de porc onctueux parfumé à l’huile d’ail noir torréfié, porc Berkshire et bambou mariné.',
      ja: '香ばしい焦がし黒マー油が香る濃厚豚骨スープに特注太縮れ麺、バークシャー種黒豚チャーシュー。'
    },
    priceMinorUnits: 2800,
    price: 28,
    basePriceUSD: 28.0,
    prepTimeMinutes: 14,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Tazón de ramen con aceite negro y rodajas de carne',
      en: 'Ramen bowl with aromatic black garlic oil and pork',
      pt: 'Tigela de ramen com óleo de alho negro e carne',
      fr: 'Bol de ramen à l’huile d’ail et tranches de porc',
      ja: '芳醇な黒マー油が浮かぶ熱々の特製ラーメン'
    },
    fallbackEmoji: '🍜'
  },
  {
    id: 'dish-us-sora-04',
    restaurantId: 'brand-sora',
    countryCode: 'US',
    category: 'desserts',
    name: {
      es: 'Tarta Mille Crêpe de Té Verde Matcha',
      en: 'Kyoto Green Tea Matcha Mille Crêpe Cake',
      pt: 'Bolo Mille Crêpe de Matcha de Kyoto',
      fr: 'Gâteau mille crêpes au thé vert matcha de Kyoto',
      ja: '京都宇治抹茶の極上ミルクレープ'
    },
    description: {
      es: 'Veinte capas finísimas de crêpe artesanal intercaladas con crema pastelera infusionada en matcha Uji de Kioto.',
      en: 'Twenty paper-thin handmade crêpes layered with light Kyoto Uji matcha pastry cream and powdered glaze.',
      pt: 'Vinte camadas delicadas de crêpes com creme aveludado de matcha tradicional de Kyoto.',
      fr: 'Vingt fines crêpes superposées alternées d’une crème légère au thé vert matcha d’Uji.',
      ja: '薄く焼き上げた20層のクレープ生地の間に、最高級宇治抹茶クリームを丁寧に重ねた逸品。'
    },
    priceMinorUnits: 1800,
    price: 18,
    basePriceUSD: 18.0,
    prepTimeMinutes: 6,
    available: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Tarta de finas capas de crepe espolvoreada con matcha',
      en: 'Layered crepe cake dusted with green matcha powder',
      pt: 'Fatia de bolo crepe polvilhado com matcha',
      fr: 'Gâteau de crêpes superposées saupoudré de thé vert',
      ja: '抹茶パウダーがかかった美しいミルクレープの層'
    },
    fallbackEmoji: '🍰'
  },
  {
    id: 'dish-us-lunch',
    restaurantId: 'brand-aura',
    countryCode: 'US',
    category: 'mains',
    isLunchOfTheDay: true,
    name: {
      es: 'Almuerzo del Día: Pechuga de Pollo Orgánico a la Brasa con Puré y Espárragos',
      en: 'Lunch of the Day: Charbroiled Organic Chicken with Herb Mash & Asparagus',
      pt: 'Almoço do Dia: Frango Orgânico Grelhado com Purê Rústico e Aspargos',
      fr: 'Plat du jour midi: Suprême de poulet fermier rôti, purée et asperges',
      ja: '本日のおすすめランチ：オーガニックチキンのグリル ハーブマッシュポテトとアスパラ添え'
    },
    description: {
      es: 'Menú express ejecutivo: sopa de tomate asado, pechuga de pollo de granja a la brasa, puré de papas a la mantequilla y espárragos verdes.',
      en: 'Executive express lunch: roasted heirloom tomato bisque, charbroiled chicken breast, buttered potato purée and grilled asparagus.',
      pt: 'Menu executivo balanceado: sopa cremosa de tomate, peito de frango orgânico na brasa, purê de batatas e aspargos.',
      fr: 'Menu express d’affaires: velouté de tomates rôties, blanc de volaille fermière rôti, purée onctueuse et asperges vertes.',
      ja: 'ローストトマトのポタージュ、香ばしく焼き上げたチキン、バター香るマッシュポテトとアスパラガスの満足ランチ。'
    },
    priceMinorUnits: 2590, // EXACT PROMPT VALUE: 2590 ($25.90)
    price: 25.90,
    basePriceUSD: 25.90,
    prepTimeMinutes: 10,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Plato ejecutivo de pollo asado con espárragos',
      en: 'Executive lunch plate with chicken and asparagus',
      pt: 'Prato executivo com frango grelhado e aspargos',
      fr: 'Assiette de poulet rôti et asperges croquantes',
      ja: 'アスパラガスが添えられたチキングリルのランチ皿'
    },
    fallbackEmoji: '🍽️'
  },
  {
    id: 'dish-us-drink-01',
    restaurantId: 'brand-aura',
    countryCode: 'US',
    category: 'drinks',
    name: {
      es: 'Limonada de Moras Silvestres de Hudson Valley',
      en: 'Hudson Valley Wild Blackberry Lemonade',
      pt: 'Limonada Artesanal de Amoras de Hudson Valley',
      fr: 'Limonade artisanale aux mûres sauvages de la vallée de l’Hudson',
      ja: 'ハドソンバレー産野生ブラックベリーの特製レモネード'
    },
    description: {
      es: 'Refrescante limonada infusionada con moras maduras cosechadas en el estado de Nueva York y hierbabuena fresca.',
      en: 'Fresh squeezed Meyer lemon juice blended with wild upstate New York blackberries and garden mint.',
      pt: 'Limonada fresca artesanal batida com amoras maduras silvestres e folhas de hortelã.',
      fr: 'Citronnade fraîche maison aux mûres sauvages de saison et menthe fraîchement cueillie.',
      ja: 'ニューヨーク州北部で手摘みされた完熟ブラックベリーとフレッシュミントを合わせた自家製レモネード。'
    },
    priceMinorUnits: 800,
    price: 8,
    basePriceUSD: 8.0,
    prepTimeMinutes: 4,
    available: true,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Vaso de limonada con hielo y frutas rojas',
      en: 'Glass of cold berry lemonade with ice',
      pt: 'Copo de limonada gelada com amoras',
      fr: 'Verre de limonade fraîche avec baies rouges',
      ja: 'ベリーが浮かぶ冷たいグラスレモネード'
    },
    fallbackEmoji: '🍋'
  }
];

fs.writeFileSync('scripts/us_dishes.json', JSON.stringify(usDishes, null, 2));
console.log('US dishes generated:', usDishes.length);
