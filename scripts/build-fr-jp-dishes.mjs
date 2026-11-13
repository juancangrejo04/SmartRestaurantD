import fs from 'fs';

// France Dishes (EUR) - Lunch of day: 2590 minor units (25,90 €)
const frDishes = [
  {
    id: 'dish-fr-aura-01',
    restaurantId: 'brand-aura',
    countryCode: 'FR',
    category: 'starters',
    name: {
      es: 'Foie Gras de Pato del Suroeste con Brioche Tostado',
      en: 'Southwest Duck Foie Gras with Toasted Brioche',
      pt: 'Foie Gras de Pato do Sudoeste Francês com Brioche',
      fr: 'Foie gras de canard du Sud-Ouest et brioche dorée',
      ja: '南西フランス産鴨フォアグラのテリーヌ 香ばしいトーストブリオッシュ添え'
    },
    description: {
      es: 'Terrina artesanal cocida a baja temperatura, acompañada de chutney de higos de Provenza y flor de sal de Guérande.',
      en: 'Artisanal duck terrine poached at low temperature, served with Provence fig chutney and Guérande fleur de sel.',
      pt: 'Terrina artesanal delicada com chutney de figos da Provença e flor de sal de Guérande.',
      fr: 'Terrine mi-cuite maison, chutney de figues fraîches de Provence et fleur de sel de Guérande.',
      ja: '低温で滑らかに仕上げたフォアグラのテリーヌ。プロヴァンス産無花果チャツネとゲランド海塩添え。'
    },
    priceMinorUnits: 2400,
    price: 24,
    basePriceUSD: 25.5,
    prepTimeMinutes: 8,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Terrina de foie gras sobre pan brioche tostado',
      en: 'Duck foie gras terrine with golden brioche',
      pt: 'Terrina de foie gras com brioche tostado',
      fr: 'Terrine de foie gras avec tranche de brioche dorée',
      ja: 'トーストしたブリオッシュに添えられたフォアグラテリーヌ'
    },
    fallbackEmoji: '🥖'
  },
  {
    id: 'dish-fr-aura-02',
    restaurantId: 'brand-aura',
    countryCode: 'FR',
    category: 'mains',
    name: {
      es: 'Entrecôte Charolaise Asada con Mantequilla Café de París',
      en: 'Charolais Ribeye Steak with Café de Paris Butter',
      pt: 'Entrecôte Charolês Grelhado com Manteiga Café de Paris',
      fr: 'Entrecôte de bœuf Charolais et beurre Café de Paris',
      ja: 'シャロレー種牛リブロースのグリル 特製カフェ・ド・パリ・バター添え'
    },
    description: {
      es: 'Corte madurado de res Charolesa a la plancha con mantequilla aromática de 14 hierbas y papas fritas caseras finas.',
      en: 'Seared Prime French Charolais ribeye steak, crowned with 14-herb compound butter and golden matchstick fries.',
      pt: 'Corte nobre de carne Charolesa na chapa com manteiga especial de ervas e batatas fritas caseiras.',
      fr: 'Pièce noble de bœuf Charolais grillée minute, beurre maître d’hôtel aux 14 aromates et frites maison croustillantes.',
      ja: '名門シャロレー牛の赤身肉を香ばしく焼き、14種のハーブとスパイスを練り込んだ特製バターとフレンチフライを添えて。'
    },
    priceMinorUnits: 4400,
    price: 44,
    basePriceUSD: 46.5,
    prepTimeMinutes: 18,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Entrecôte francesa servida con patatas fritas',
      en: 'French ribeye steak served with fries',
      pt: 'Entrecôte fatiado com batatas fritas crocantes',
      fr: 'Entrecôte grillée saignante et corbeille de frites',
      ja: 'フライドポテトが添えられたジューシーなリブロースステーキ'
    },
    fallbackEmoji: '🥩'
  },
  {
    id: 'dish-fr-aura-03',
    restaurantId: 'brand-aura',
    countryCode: 'FR',
    category: 'mains',
    name: {
      es: 'Magret de Pato del Gers Glaseado con Miel y Lavanda',
      en: 'Roast Duck Magret with Lavender Honey Glaze',
      pt: 'Magret de Pato Grelhado com Mel de Lavanda',
      fr: 'Magret de canard du Gers rôti au miel de lavande',
      ja: 'ジェール産マグレ・ド・カナール（鴨胸肉のロースト）ラベンダー蜂蜜風味'
    },
    description: {
      es: 'Pechuga entera de pato dorada a la sartén con piel crujiente, salsa reducida de grosellas y puré mousseline de chirivía.',
      en: 'Pan-seared tender duck breast with crisp skin, redcurrant reduction glaze and parsnip mousseline.',
      pt: 'Peito nobre de pato grelhado ao ponto rosado com redução de groselha e purê aveludado.',
      fr: 'Magret entier cuit rosé, peau laquée au miel de lavande, jus court corsé aux groseilles et mousseline de panais.',
      ja: '肉厚な鴨胸肉の皮目をパリッと焼き、プロヴァンス産ラベンダー蜂蜜と赤スグリのソースで仕上げたロースト。'
    },
    priceMinorUnits: 3800,
    price: 38,
    basePriceUSD: 40.0,
    prepTimeMinutes: 16,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Magret de pato trinchado con salsa oscura brillante',
      en: 'Sliced roast duck breast with glossy dark sauce',
      pt: 'Fatias de peito de pato com molho brilhante',
      fr: 'Magret de canard tranché rosé et réduction brillante',
      ja: '艶やかなソースがかかったロースト鴨胸肉の断面'
    },
    fallbackEmoji: '🍗'
  },
  {
    id: 'dish-fr-aura-04',
    restaurantId: 'brand-aura',
    countryCode: 'FR',
    category: 'desserts',
    name: {
      es: 'Tarte Tatin de Manzanas Caramelizadas con Crème Fraîche',
      en: 'Warm Apple Tarte Tatin with Normandy Crème Fraîche',
      pt: 'Tarte Tatin Tradicional de Maçãs Caramelizadas',
      fr: 'Tarte Tatin tiède aux pommes caramélisées et crème crue',
      ja: 'ノルマンディー風タルト・タタン（温かいキャラメル林檎パイ）'
    },
    description: {
      es: 'Tarta invertida de manzanas confitadas lentamente en mantequilla salada sobre hojaldre crujiente y crema fresca de Normandía.',
      en: 'Upside-down caramelized apple tart cooked in salted butter over crisp puff pastry with chilled Normandy cream.',
      pt: 'Torta invertida de maçãs douradas na manteiga de fazenda sobre massa folhada crocante.',
      fr: 'Pommes fondantes confites au beurre demi-sel sur pâte feuilletée pur beurre croustillante et quenelle de crème d’Isigny.',
      ja: '発酵バターと砂糖で飴色になるまで煮詰めたリンゴとサクサクのパイ生地。生クリーム添え。'
    },
    priceMinorUnits: 1500,
    price: 15,
    basePriceUSD: 16.0,
    prepTimeMinutes: 8,
    available: true,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Porción de tarte tatin con manzana brillante y crema',
      en: 'Slice of glossy apple tarte tatin with cream',
      pt: 'Fatia de tarte tatin com maçãs brilhantes',
      fr: 'Part de tarte Tatin aux pommes fondantes et crème',
      ja: '艶やかなリンゴが重なるタルトタタンの一皿'
    },
    fallbackEmoji: '🥧'
  },
  {
    id: 'dish-fr-sora-01',
    restaurantId: 'brand-sora',
    countryCode: 'FR',
    category: 'starters',
    name: {
      es: 'Carpaccio de Vieiras Saint-Jacques con Vinagreta de Yuzu',
      en: 'Brittany Sea Scallops Carpaccio with Yuzu Vinaigrette',
      pt: 'Carpaccio de Vieiras Saint-Jacques com Yuzu',
      fr: 'Carpaccio de coquilles Saint-Jacques de Bretagne au yuzu',
      ja: 'ブルターニュ産ホタテ貝柱の薄造り 高知産柚子ヴィネグレット'
    },
    description: {
      es: 'Vieiras frescas de Bretaña cortadas finas, aliñadas con jugo de yuzu japonés, aceite de oliva virgen y pimienta rosa.',
      en: 'Translucent Brittany sea scallops, dressed with Japanese yuzu juice, extra virgin olive oil and pink peppercorns.',
      pt: 'Vieiras frescas em fatias finas com azeite extravirgem, suco de yuzu e pimenta rosa.',
      fr: 'Noix de Saint-Jacques fraîches tranchées fines, émulsion d’huile d’olive au jus de yuzu et baies roses.',
      ja: 'ブルターニュの港から直送された新鮮な活ホタテを薄造りにし、高知県産柚子の香りで引き締めた冷前菜。'
    },
    priceMinorUnits: 2600,
    price: 26,
    basePriceUSD: 27.5,
    prepTimeMinutes: 10,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Finas láminas de vieira con aliño brillante y hierbas',
      en: 'Thin scallop carpaccio slices with citrus dressing',
      pt: 'Lâminas finas de vieira com tempero cítrico',
      fr: 'Carpaccio translucide de Saint-Jacques aux baies',
      ja: '透明感のあるホタテカルパッチョの盛り付け'
    },
    fallbackEmoji: '🦪'
  },
  {
    id: 'dish-fr-sora-02',
    restaurantId: 'brand-sora',
    countryCode: 'FR',
    category: 'mains',
    name: {
      es: 'Plateau Paris-Tokyo de Sushi de Autor (14 Piezas)',
      en: 'Paris-Tokyo Signature Sushi Platter (14 Pcs)',
      pt: 'Combinado Paris-Tóquio de Sushi Autoral (14 Peças)',
      fr: 'Plateau Signature Paris-Tokyo de 14 sushis d’auteur',
      ja: '宙 (Sora) パリ・東京シグネチャー寿司盛り合わせ（14貫）'
    },
    description: {
      es: 'Fusión franco-japonesa: atún rojo flameado con sal de Guérande, salmón marinado al eneldo y nigiris con emulsión de trufa.',
      en: 'Franco-Japanese fusion: seared bluefin tuna with Guérande salt, dill-cured salmon and black truffle emulsion nigiri.',
      pt: 'Sushis autorais combinando técnicas de Tóquio e ingredientes franceses nobres com trufas.',
      fr: 'Créations signature: thon rouge mi-cuit fleur de sel, saumon mariné aneth et nigiri à l’huile de truffe noire.',
      ja: 'ゲランド海塩を乗せた本マグロ炙り、ディル風味のサーモン、黒トリュフ香る創作握りの盛り合わせ。'
    },
    priceMinorUnits: 5800,
    price: 58,
    basePriceUSD: 61.5,
    prepTimeMinutes: 16,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Combinado de sushi y maki decorado con esmero',
      en: 'Carefully plated sushi and maki combination',
      pt: 'Combinado de sushis decorados artisticamente',
      fr: 'Plateau gastronomique de sushis artistiques',
      ja: '美しく盛り付けられた創作寿司のプレート'
    },
    fallbackEmoji: '🍣'
  },
  {
    id: 'dish-fr-sora-03',
    restaurantId: 'brand-sora',
    countryCode: 'FR',
    category: 'mains',
    name: {
      es: 'Ramen Sainte-Anne al Pato Confitado y Caldo Shoyu',
      en: 'Sainte-Anne Duck Confit Shoyu Ramen',
      pt: 'Ramen Sainte-Anne de Pato Confitado e Shoyu',
      fr: 'Ramen Sainte-Anne au confit de canard et bouillon Shoyu',
      ja: 'サントノーレ風 鴨コンフィと熟成生醤油の極上ラーメン'
    },
    description: {
      es: 'Homenaje al barrio japonés de París: caldo aromático de ave y dashi, muslo de pato confitado deshilachado y fideos frescos.',
      en: 'Parisian Japanese district homage: clarified poultry dashi broth, shredded tender duck confit and artisanal noodles.',
      pt: 'Caldo claro aromático de aves e dashi, pato confitado desfiado e massa artesanal de ramen.',
      fr: 'Bouillon shoyu dashi limpide de volaille fermière, cuisse de canard confite effilochée, nouilles fraîches et pousse de bambou.',
      ja: '鴨肉のコンフィを贅沢にトッピング。丸鶏と厳選魚介出汁に長期熟成醤油を合わせたパリ限定ラーメン。'
    },
    priceMinorUnits: 2900,
    price: 29,
    basePriceUSD: 31.0,
    prepTimeMinutes: 14,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Tazón de shoyu ramen caliente con pato y verduras',
      en: 'Warm bowl of shoyu ramen with duck and greens',
      pt: 'Tigela de shoyu ramen com pato confitado',
      fr: 'Bol fumant de ramen shoyu au canard',
      ja: '鴨肉と青菜が乗った澄んだ醤油ラーメン'
    },
    fallbackEmoji: '🍜'
  },
  {
    id: 'dish-fr-sora-04',
    restaurantId: 'brand-sora',
    countryCode: 'FR',
    category: 'desserts',
    name: {
      es: 'Profiteroles al Sésamo Negro y Helado de Yuzu',
      en: 'Black Sesame Profiteroles with Yuzu Sorbet',
      pt: 'Profiteroles de Gergelim Preto e Sorbet de Yuzu',
      fr: 'Profiteroles au sésame noir torréfié et sorbet yuzu',
      ja: '煎り黒胡麻の特製プロフィットロール 高知産柚子ソルベ添え'
    },
    description: {
      es: 'Choux horneados rellenos de sorbete de yuzu artesanal, cubiertos con coulis templado de sésamo negro tostado de Kioto.',
      en: 'Choux puffs filled with tangy yuzu sorbet, generously draped with warm toasted Kyoto black sesame sauce.',
      pt: 'Carolinas artesanais recheadas com sorvete de yuzu e calda quente de gergelim preto.',
      fr: 'Petits choux au craquelin garnis de sorbet au yuzu rafraîchissant, nappés d’une sauce chaude au sésame noir.',
      ja: '爽やかな柚子シャーベットを詰めたシュー生地に、香ばしい温かい黒胡麻ソースをとろりとかけたデザート。'
    },
    priceMinorUnits: 1600,
    price: 16,
    basePriceUSD: 17.0,
    prepTimeMinutes: 7,
    available: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Profiteroles bañados en salsa oscura brillante',
      en: 'Profiteroles drizzled with dark glossy sesame sauce',
      pt: 'Profiteroles com calda brilhante de gergelim',
      fr: 'Profiteroles nappées de sauce chocolatée au sésame',
      ja: '黒胡麻ソースをまとったプロフィットロール'
    },
    fallbackEmoji: '🥮'
  },
  {
    id: 'dish-fr-lunch',
    restaurantId: 'brand-aura',
    countryCode: 'FR',
    category: 'mains',
    isLunchOfTheDay: true,
    name: {
      es: 'Almuerzo del Día: Suprême de Volaille Fermière Rôti avec Mousseline de Carottes et Jus Corsé',
      en: 'Lunch of the Day: Roast Farm Poultry Suprême with Carrot Mousseline & Rich Herb Jus',
      pt: 'Almoço do Dia: Supremo de Frango Caipira com Purê de Cenouras e Jus Rústico',
      fr: 'Plat du jour midi: Suprême de volaille fermière rôti, mousseline de carottes au beurre et jus court',
      ja: '本日のおすすめランチ：農場直送地鶏胸肉のロースト キャロットムースリーヌと特製ジュ'
    },
    description: {
      es: 'La gran tradición del bistró parisino: velouté de verduras de estación, pechuga dorada con hierbas de Provenza, puré fino de zanahoria a la mantequilla y ensalada verde.',
      en: 'Authentic Parisian bistro lunch: seasonal garden soup, roasted French poultry breast, buttered carrot purée and dressed baby greens.',
      pt: 'Menu bistrô parisiense: sopa leve do dia, peito de frango assado ao jus, purê sedoso de cenouras e salada crocante.',
      fr: 'La formule bistro classique: velouté de saison, suprême de volaille rôti sur peau, mousseline de carottes au beurre noisette et salade de mesclun.',
      ja: 'パリのビストロの定番ランチ：季節のポタージュ、香ばしくローストした地鶏、バター香る人参のムースリーヌ。'
    },
    priceMinorUnits: 2590, // EXACT PROMPT VALUE: 2590 (25,90 €)
    price: 25.90,
    basePriceUSD: 27.50,
    prepTimeMinutes: 10,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Plato de almuerzo bistro con pollo y puré brillante',
      en: 'Bistro chicken lunch plate with carrot purée',
      pt: 'Prato de almoço bistrô francês com purê',
      fr: 'Assiette bistrot de volaille rôtie et mousseline',
      ja: '地鶏ローストと色鮮やかな人参ムースリーヌのランチ'
    },
    fallbackEmoji: '🍽️'
  },
  {
    id: 'dish-fr-drink-01',
    restaurantId: 'brand-aura',
    countryCode: 'FR',
    category: 'drinks',
    name: {
      es: 'Infusión Helada de Hibisco de Provenza y Menta Fresca',
      en: 'Provence Iced Hibiscus & Garden Mint Infusion',
      pt: 'Infusão Gelada de Hibisco da Provença e Hortelã',
      fr: 'Infusion glacée d’hibiscus de Provence et menthe fraîche du jardin',
      ja: 'プロヴァンス産ハイビスカスと摘みたてミントの自家製アイスハーブティー'
    },
    description: {
      es: 'Bebida artesanal refrescante sin alcohol elaborada con flores de hibisco infusionadas en frío, toque de lima y hojas de menta.',
      en: 'House-made chilled herbal infusion with whole hibiscus flowers, cold-brewed with lime zest and fresh garden mint.',
      pt: 'Bebida artesanal gelada e refrescante feita com flores de hibisco e hortelã fresca.',
      fr: 'Infusion artisanale rafraîchissante préparée à froid à partir de fleurs d’hibiscus entières et menthe froissée.',
      ja: 'ハイビスカスの花弁を水出し抽出したルビー色の爽やかなアイスティー。ミントとライムの香り。'
    },
    priceMinorUnits: 750,
    price: 7.50,
    basePriceUSD: 8.0,
    prepTimeMinutes: 4,
    available: true,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Vaso de infusión fría color rubí con hielo y menta',
      en: 'Ruby red iced infusion glass with fresh mint',
      pt: 'Copo de chá gelado vermelho com hortelã',
      fr: 'Verre de thé glacé rouge rubis avec feuilles de menthe',
      ja: '鮮やかな赤色の冷たいハイビスカスティーグラス'
    },
    fallbackEmoji: '🌺'
  }
];

// Japan Dishes (JPY) - Lunch of day: 2590 minor units (¥2,590)
const jpDishes = [
  {
    id: 'dish-jp-aura-01',
    restaurantId: 'brand-aura',
    countryCode: 'JP',
    category: 'starters',
    name: {
      es: 'Gyoza Artesanal de Cerdo Ibérico y Col de Kanto',
      en: 'Pan-Fried Crispy Iberian Pork & Kanto Cabbage Gyoza',
      pt: 'Gyoza Artesanal Crocante de Porco Ibérico',
      fr: 'Gyoza croustillants au porc ibérique et chou de Kanto',
      ja: 'イベリコ豚と関東産朝採れキャベツの自家製羽根つき焼き餃子'
    },
    description: {
      es: 'Empanadillas japonesas con fina masa casera sellada a la plancha con costra crujiente de almidón y salsa de soja y sésamo.',
      en: 'Handmade Japanese potstickers with crispy lace lattice crust, juicy pork and cabbage filling, served with soy vinegar dipping sauce.',
      pt: 'Pasteizinhos japoneses grelhados com crosta crocante rendada, recheados com porco suculento.',
      fr: 'Raviolis japonais dorés avec dentelle croustillante, farce fondante au porc et sauce soja pimentée.',
      ja: '薄皮でジューシーな餡を包み、パリッとした羽根つきに焼き上げた極上の手作り焼き餃子。'
    },
    priceMinorUnits: 1200,
    price: 1200,
    basePriceUSD: 7.74,
    prepTimeMinutes: 10,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Plato de gyozas con base dorada y crujiente',
      en: 'Golden pan-fried gyoza dumplings on plate',
      pt: 'Prato de gyozas dourados com crosta crocante',
      fr: 'Assiette de raviolis gyoza dorés à point',
      ja: '香ばしい焼き目がついた羽根つき焼き餃子'
    },
    fallbackEmoji: '🥟'
  },
  {
    id: 'dish-jp-aura-02',
    restaurantId: 'brand-aura',
    countryCode: 'JP',
    category: 'mains',
    name: {
      es: 'Bife de Wagyu A5 de Miyazaki a la Plancha Teppan (150g)',
      en: 'Miyazaki A5 Wagyu Teppanyaki Sirloin (150g)',
      pt: 'Bife de Wagyu A5 de Miyazaki no Teppan (150g)',
      fr: 'Steak de Wagyu A5 de Miyazaki au Teppan (150g)',
      ja: '宮崎牛 A5等級 特選サーロイン 鉄板焼き (150g)'
    },
    description: {
      es: 'Corte con marmoleado supremo A5 sellado en plancha de hierro teppan, acompañado de chips de ajo crujiente y sal volcánica.',
      en: 'Supreme A5 marbling Wagyu beef seared on high-heat teppan iron, served with crispy garlic chips and wasabi salt.',
      pt: 'Carne nobre Wagyu A5 com marmoreio perfeito, selada na chapa com alho frito crocante e wasabi.',
      fr: 'Bœuf japonais Wagyu d’exception persillé A5, saisi sur plaque de fer, chips d’ail et sel de wasabi.',
      ja: '極上のサシが入った宮崎県産A5黒毛和牛を鉄板で絶妙に焼き上げ、ガーリックチップと本わさびで味わう至高の肉料理。'
    },
    priceMinorUnits: 8800,
    price: 8800,
    basePriceUSD: 56.77,
    prepTimeMinutes: 15,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Dados de carne wagyu sellados a la plancha',
      en: 'Tender cubes of grilled wagyu beef on teppan',
      pt: 'Cubos suculentos de carne wagyu na chapa',
      fr: 'Morceaux tendres de bœuf wagyu saisis au teppan',
      ja: '鉄板で香ばしく焼き上げられた極上和牛サーロイン'
    },
    fallbackEmoji: '🥩'
  },
  {
    id: 'dish-jp-aura-03',
    restaurantId: 'brand-aura',
    countryCode: 'JP',
    category: 'mains',
    name: {
      es: 'Tonkatsu Kurobuta Extra Crujiente con Arroz Niigata',
      en: 'Crispy Berkshire Pork Tonkatsu with Niigata Rice',
      pt: 'Tonkatsu Crocante de Porco Preto com Arroz de Niigata',
      fr: 'Tonkatsu de porc noir pané et riz Koshihikari',
      ja: '鹿児島県産黒豚 特選ロースかつ御膳 新潟魚沼産コシヒカリ'
    },
    description: {
      es: 'Lomo de cerdo negro japonés rebozado en panko fresco y frito a temperatura controlada, con col finamente cortada y sopa miso.',
      en: 'Thick cut Berkshire pork loin breaded in fresh panko flakes and fried golden, served with shredded cabbage and Niigata rice.',
      pt: 'Lombo de porco empanado na farinha panko fresca e frito até dourar, com repolho fino e arroz.',
      fr: 'Épaisse côtelette de porc noir panée à la chapelure panko dorée, servie avec chou émincé et riz japonais.',
      ja: '鹿児島産黒豚ロースを生パン粉でサクッと揚げた肉厚とんかつ。千切りキャベツと魚沼産コシヒカリの御膳。'
    },
    priceMinorUnits: 3200,
    price: 3200,
    basePriceUSD: 20.64,
    prepTimeMinutes: 14,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Chuleta de cerdo empanada y cortada en rebanadas gruesas',
      en: 'Sliced crispy breaded pork cutlet with cabbage',
      pt: 'Costeleta de porco empanada cortada em tiras',
      fr: 'Escalope de porc panée découpée en tranches',
      ja: 'サクサクの衣をまとった肉厚なロースかつ'
    },
    fallbackEmoji: '🍱'
  },
  {
    id: 'dish-jp-aura-04',
    restaurantId: 'brand-aura',
    countryCode: 'JP',
    category: 'desserts',
    name: {
      es: 'Dorayaki Tradicional Relleno de Anko de Azuki de Hokkaido',
      en: 'Artisanal Dorayaki Pancakes with Hokkaido Red Bean',
      pt: 'Dorayaki Tradicional Recheado com Doce de Feijão Azuki',
      fr: 'Dorayaki artisanal moelleux au haricot rouge de Hokkaido',
      ja: '北海道産特選十勝小豆の手焼き職人どら焼き'
    },
    description: {
      es: 'Esponjosos panqueques japoneses de miel cocidos al momento con relleno generoso de pasta dulce de judías rojas azuki.',
      en: 'Fluffy honey castella pancakes sandwiching sweet artisanal red bean paste from Tokachi, Hokkaido.',
      pt: 'Panquecas fofas de mel recheadas com pasta doce de feijão azuki de Hokkaido.',
      fr: 'Pancakes japonais moelleux au miel de châtaignier fourrés d’une pâte de haricot rouge azuki fondante.',
      ja: '蜂蜜を練り込んだふわふわの生地に、北海道十勝産小豆を丁寧に炊き上げた粒あんを挟んだ名物どら焼き。'
    },
    priceMinorUnits: 800,
    price: 800,
    basePriceUSD: 5.16,
    prepTimeMinutes: 5,
    available: true,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Panqueque dorayaki relleno de pasta de judía roja',
      en: 'Traditional dorayaki pancake with red bean paste',
      pt: 'Dorayaki japonês recheado cortado ao meio',
      fr: 'Pancake dorayaki garni de pâte de haricot azuki',
      ja: '粒あんがたっぷり詰まった手焼きどら焼き'
    },
    fallbackEmoji: '🥞'
  },
  {
    id: 'dish-jp-sora-01',
    restaurantId: 'brand-sora',
    countryCode: 'JP',
    category: 'starters',
    name: {
      es: 'Edamame Salteado con Ajo Tostado y Shichimi Togarashi',
      en: 'Wok-Tossed Edamame with Garlic & Shichimi Pepper',
      pt: 'Edamame Salteado no Wok com Alho e Pimenta Shichimi',
      fr: 'Edamame sauté au wok à l’ail rôti et piment shichimi',
      ja: '朝採れ枝豆の焦がしガーリック七味炒め'
    },
    description: {
      es: 'Vainas tiernas de soja salteadas al wok a fuego vivo con aceite de sésamo tostado, ajo laminado y siete especias japonesas.',
      en: 'Tender young soybean pods wok-charred with roasted sesame oil, crisp garlic flakes and seven-spice blend.',
      pt: 'Vagens frescas de soja salteadas na wok com óleo de gergelim, lascas de alho e pimenta japonesa.',
      fr: 'Fèves de soja fraîches sautées à feu vif à l’huile de sésame torréfié, ail croustillant et mélange shichimi.',
      ja: '採れたての新鮮な枝豆を高温の中華鍋で素早く炒め、香ばしいニンニクと特製七味唐辛子を絡めた前菜。'
    },
    priceMinorUnits: 900,
    price: 900,
    basePriceUSD: 5.80,
    prepTimeMinutes: 6,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Vainas verdes de edamame con copos de sal y ajo',
      en: 'Bowl of green edamame pods with garlic flakes',
      pt: 'Tigela de edamame verde temperado com alho',
      fr: 'Bol de cosses d’edamame vert vif et épices',
      ja: 'ガーリックチップと七味がまぶされた熱々の枝豆'
    },
    fallbackEmoji: '🫘'
  },
  {
    id: 'dish-jp-sora-02',
    restaurantId: 'brand-sora',
    countryCode: 'JP',
    category: 'mains',
    name: {
      es: 'Sora Ginza Honten Nigiri Kiwami (12 Piezas de Autor)',
      en: 'Sora Ginza Flagship "Kiwami" Supreme Nigiri (12 Pcs)',
      pt: 'Combinado Sora Ginza Kiwami de Nigiris Nobres (12 Peças)',
      fr: 'Assortiment Sora Ginza «Kiwami» de 12 nigiris d’exception',
      ja: '宙 (Sora) 銀座本店 特選極み握り（12貫厳選・赤酢仕立て）'
    },
    description: {
      es: 'El estandarte de la casa matriz en Ginza: arroz sazonado con vinagre rojo akazu, atún de Toyosu, erizo de mar y anguila glaseada.',
      en: 'Ginza flagship masterwork: traditional Edo-mae akazu red vinegar rice, bluefin otoro, Hokkaido uni, and glazed unagi.',
      pt: 'O ápice da gastronomia de Ginza: arroz de vinagre vermelho akazu, atum gordo de Toyosu e ouriço fresco.',
      fr: 'Le chef-d’œuvre de notre maison mère à Ginza: riz au vinaigre rouge akazu, thon gras de Toyosu et anguille laquée.',
      ja: '銀座本店が誇る至高の江戸前握り。熟成赤酢のシャリに豊洲市場最高峰の天然本鮪大トロ、雲丹、穴子など極上12貫。'
    },
    priceMinorUnits: 7500,
    price: 7500,
    basePriceUSD: 48.38,
    prepTimeMinutes: 16,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Selección de nigiris brillantes sobre tabla tradicional',
      en: 'Glistening selection of supreme nigiri on wood',
      pt: 'Seleção brilhante de nigiris nobres sobre madeira',
      fr: 'Écrin de nigiris lustrés sur plateau laqué',
      ja: '赤酢シャリに鮮魚が輝く特選極み握りの盛り合わせ'
    },
    fallbackEmoji: '🍣'
  },
  {
    id: 'dish-jp-sora-03',
    restaurantId: 'brand-sora',
    countryCode: 'JP',
    category: 'mains',
    name: {
      es: 'Ramen Shoyu de Dashi Doble y Panceta Braseada de Tokio',
      en: 'Tokyo Double-Dashi Shoyu Ramen with Braised Chashu',
      pt: 'Tokyo Shoyu Ramen Tradicional com Chashu Artesanal',
      fr: 'Ramen Tokyo Shoyu au double bouillon dashi et porc braisé',
      ja: '東京名物 鶏ガラと鰹本枯節のダブル出汁 熟成生醤油特製ラーメン'
    },
    description: {
      es: 'Caldo transparente doble elaborado con huesos de pollo de corral y bonito seco katsuobushi, fideos rectos y huevo a baja temperatura.',
      en: 'Clear artisanal double broth combining local poultry and aged dried bonito flakes, straight noodles and soft yolk ajitama.',
      pt: 'Caldo translúcido de frango caipira e flocos de bonito seco katsuobushi com macarrão fresco.',
      fr: 'Bouillon shoyu limpide d’une grande pureté mariant volaille fermière et bonite séchée, œuf mollet et ciboule.',
      ja: '地鶏の清湯と特選鰹本枯節の旨味を凝縮したダブルスープに、自家製ストレート細麺ととろけるチャーシュー。'
    },
    priceMinorUnits: 1800,
    price: 1800,
    basePriceUSD: 11.61,
    prepTimeMinutes: 12,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Tazón de shoyu ramen tradicional con fideos finos',
      en: 'Bowl of clear Tokyo shoyu ramen with noodles',
      pt: 'Tigela de ramen shoyu clássico de Tóquio',
      fr: 'Bol traditionnel de ramen shoyu avec nouilles fines',
      ja: '澄んだ琥珀色のスープが美しい東京醤油ラーメン'
    },
    fallbackEmoji: '🍜'
  },
  {
    id: 'dish-jp-sora-04',
    restaurantId: 'brand-sora',
    countryCode: 'JP',
    category: 'desserts',
    name: {
      es: 'Warabi Mochi Tradicional con Kinako de Soja Tostada y Kuromitsu',
      en: 'Handmade Warabi Mochi with Roasted Kinako & Black Sugar Syrup',
      pt: 'Warabi Mochi Gelado com Farinha Kinako e Calda Kuromitsu',
      fr: 'Warabi mochi artisanal à la poudre de soja grillé et sirop kuromitsu',
      ja: '本わらび粉手練り 本格わらび餅 国産焙煎きな粉と極上黒蜜'
    },
    description: {
      es: 'Gelatina suave y elástica elaborada con almidón de helecho silvestre warabi, rebozada en polvo de soja tostada y miel negra de Okinawa.',
      en: 'Tender, melt-in-your-mouth bracken starch mochi dusted with nutty roasted soybean flour and rich Okinawa black sugar syrup.',
      pt: 'Mochi artesanal macio feito de amido de raiz silvestre, coberto com farinha de soja tostada e xarope de açúcar negro.',
      fr: 'Dés fondants de fécule de fougère sauvage roulés dans la farine de soja torréfiée et arrosés de mélasse noire d’Okinawa.',
      ja: '希少な本わらび粉を銅鍋で丁寧に練り上げたぷるぷるのわらび餅。深煎り京きな粉と沖縄県波照間産黒蜜で。'
    },
    priceMinorUnits: 950,
    price: 950,
    basePriceUSD: 6.12,
    prepTimeMinutes: 5,
    available: true,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Cubos suaves de warabi mochi con harina dorada kinako',
      en: 'Soft warabi mochi cubes with roasted kinako powder',
      pt: 'Cubos de warabi mochi cobertos com pó kinako',
      fr: 'Cubes de warabi mochi saupoudrés de poudre de soja',
      ja: 'きな粉と黒蜜がかかったぷるぷるの本わらび餅'
    },
    fallbackEmoji: '🍡'
  },
  {
    id: 'dish-jp-lunch',
    restaurantId: 'brand-aura',
    countryCode: 'JP',
    category: 'mains',
    isLunchOfTheDay: true,
    name: {
      es: 'Almuerzo del Día: Teishoku de Pollo Asado Teriyaki con Arroz y Miso',
      en: 'Lunch of the Day: Charcoal Teriyaki Chicken Teishoku with Rice & Miso',
      pt: 'Almoço do Dia: Teishoku de Frango Teriyaki com Arroz e Sopa Miso',
      fr: 'Plat du jour midi: Teishoku au poulet grillé teriyaki, riz blanc et soupe miso',
      ja: '本日のおすすめランチ：若鶏の炭火照り焼き定食（小鉢・炊きたてご飯・赤出汁味噌汁付き）'
    },
    description: {
      es: 'El almuerzo tradicional teishoku: sopa miso casera, muslo de pollo a la brasa con salsa teriyaki de soja madurada, arroz al vapor y encurtidos tsukemono.',
      en: 'The authentic Japanese business teishoku set: fresh miso soup, charcoal-grilled chicken in aged soy teriyaki, steamed rice and pickles.',
      pt: 'Menu executivo tradicional japonês: sopa de missô, frango grelhado no teriyaki artesanal, arroz japonês e conservas.',
      fr: 'La formule teishoku de midi par excellence: soupe miso fumante, poulet grillé au charbon nappé de teriyaki maison, riz vapeur et pickles.',
      ja: '備長炭でじっくり焼き上げた若鶏の照り焼き、炊きたてご飯、出汁香る赤出汁味噌汁、自家製漬物がセットになった日替わり定食。'
    },
    priceMinorUnits: 2590, // EXACT PROMPT VALUE: 2590 (¥2,590)
    price: 2590,
    basePriceUSD: 16.70,
    prepTimeMinutes: 10,
    available: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Bandeja tradicional de almuerzo teishoku con cuencos de arroz y miso',
      en: 'Traditional teishoku lunch tray with rice and miso bowls',
      pt: 'Bandeja de almoço teishoku tradicional com arroz e sopa',
      fr: 'Plateau repas teishoku avec bols de riz et soupe miso',
      ja: 'ご飯と味噌汁、香の物が整然と並んだ和食の定食トレイ'
    },
    fallbackEmoji: '🍱'
  },
  {
    id: 'dish-jp-drink-01',
    restaurantId: 'brand-aura',
    countryCode: 'JP',
    category: 'drinks',
    name: {
      es: 'Té Verde Matcha Helado de Uji con Toque de Yuzu',
      en: 'Iced Kyoto Uji Matcha with Fresh Yuzu Essence',
      pt: 'Chá Matcha Gelado de Uji com Toque de Yuzu',
      fr: 'Thé vert matcha glacé d’Uji et zeste de yuzu',
      ja: '宇治産一番茶の特製アイス抹茶 高知県産生柚子仕立て'
    },
    description: {
      es: 'Té verde ceremonial batido al momento con batidor de bambú chasen, servido frío sobre cubos de hielo con un sutil aroma de corteza de yuzu.',
      en: 'Ceremonial grade green tea whisked fresh with bamboo chasen, served over crystal ice with delicate fresh yuzu citrus aroma.',
      pt: 'Chá verde cerimonial batido na hora com batedor de bambu, servido gelado com toque aromático de yuzu.',
      fr: 'Thé matcha de cérémonie fouetté minute au chasen en bambou, servi sur glace cristalline avec une note fraîche de zeste de yuzu.',
      ja: '京都宇治の一番摘み茶葉を伝統の茶筅で丁寧に点て、高知産柚子の爽やかな香りを添えた冷涼な一杯。'
    },
    priceMinorUnits: 700,
    price: 700,
    basePriceUSD: 4.51,
    prepTimeMinutes: 4,
    available: true,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    imageAlt: {
      es: 'Vaso de té matcha verde brillante con hielo',
      en: 'Glass of bright green iced matcha tea with ice',
      pt: 'Copo de chá matcha verde vivo com gelo',
      fr: 'Verre de thé matcha vert éclatant avec glaçons',
      ja: '鮮やかな緑色が引き立つ氷入りアイス抹茶'
    },
    fallbackEmoji: '🍵'
  }
];

// Merge all 5 countries (CO, BR, US, FR, JP)
const coDishes = JSON.parse(fs.readFileSync('scripts/co_dishes.json', 'utf8'));
const brDishes = JSON.parse(fs.readFileSync('scripts/br_dishes.json', 'utf8'));
const usDishes = JSON.parse(fs.readFileSync('scripts/us_dishes.json', 'utf8'));

const allDishes = [...coDishes, ...brDishes, ...usDishes, ...frDishes, ...jpDishes];
console.log('Total master dishes across 5 countries:', allDishes.length);

fs.writeFileSync('scripts/master_dishes.json', JSON.stringify(allDishes, null, 2));
