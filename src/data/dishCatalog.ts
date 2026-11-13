import { CountryCode, Language, MenuCategory, MenuItem } from '../types';

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

export const DISH_CATALOG: CatalogDish[] = [
  {
    "id": "dish-co-aura-01",
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
    "fallbackEmoji": "🥟"
  },
  {
    "id": "dish-co-aura-02",
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
    "fallbackEmoji": "🍲"
  },
  {
    "id": "dish-co-aura-03",
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
    "fallbackEmoji": "🍛"
  },
  {
    "id": "dish-co-aura-04",
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
    "fallbackEmoji": "🍮"
  },
  {
    "id": "dish-co-sora-01",
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
    "fallbackEmoji": "🐟"
  },
  {
    "id": "dish-co-sora-02",
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
    "fallbackEmoji": "🍣"
  },
  {
    "id": "dish-co-sora-03",
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
    "fallbackEmoji": "🍜"
  },
  {
    "id": "dish-co-sora-04",
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
    "fallbackEmoji": "🍡"
  },
  {
    "id": "dish-co-lunch",
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
    "fallbackEmoji": "🍽️"
  },
  {
    "id": "dish-co-drink-01",
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
    "fallbackEmoji": "🥥"
  },
  {
    "id": "dish-br-aura-01",
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
    "fallbackEmoji": "🧀"
  },
  {
    "id": "dish-br-aura-02",
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
    "fallbackEmoji": "🍲"
  },
  {
    "id": "dish-br-aura-03",
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
    "fallbackEmoji": "🥩"
  },
  {
    "id": "dish-br-aura-04",
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
    "fallbackEmoji": "🍮"
  },
  {
    "id": "dish-br-sora-01",
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
    "fallbackEmoji": "🐟"
  },
  {
    "id": "dish-br-sora-02",
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
    "fallbackEmoji": "🍣"
  },
  {
    "id": "dish-br-sora-03",
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
    "fallbackEmoji": "🍜"
  },
  {
    "id": "dish-br-sora-04",
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
    "fallbackEmoji": "🧁"
  },
  {
    "id": "dish-br-lunch",
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
    "fallbackEmoji": "🍽️"
  },
  {
    "id": "dish-br-drink-01",
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
    "fallbackEmoji": "🍹"
  },
  {
    "id": "dish-us-aura-01",
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
    "fallbackEmoji": "🐟"
  },
  {
    "id": "dish-us-aura-02",
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
    "fallbackEmoji": "🥩"
  },
  {
    "id": "dish-us-aura-03",
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
    "fallbackEmoji": "🐟"
  },
  {
    "id": "dish-us-aura-04",
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
    "fallbackEmoji": "🍰"
  },
  {
    "id": "dish-us-sora-01",
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
    "fallbackEmoji": "🐟"
  },
  {
    "id": "dish-us-sora-02",
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
    "fallbackEmoji": "🍣"
  },
  {
    "id": "dish-us-sora-03",
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
    "fallbackEmoji": "🍜"
  },
  {
    "id": "dish-us-sora-04",
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
    "fallbackEmoji": "🍰"
  },
  {
    "id": "dish-us-lunch",
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
    "fallbackEmoji": "🍽️"
  },
  {
    "id": "dish-us-drink-01",
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
    "fallbackEmoji": "🍋"
  },
  {
    "id": "dish-fr-aura-01",
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
    "fallbackEmoji": "🥖"
  },
  {
    "id": "dish-fr-aura-02",
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
    "fallbackEmoji": "🥩"
  },
  {
    "id": "dish-fr-aura-03",
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
    "fallbackEmoji": "🍗"
  },
  {
    "id": "dish-fr-aura-04",
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
    "fallbackEmoji": "🥧"
  },
  {
    "id": "dish-fr-sora-01",
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
    "fallbackEmoji": "🦪"
  },
  {
    "id": "dish-fr-sora-02",
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
    "fallbackEmoji": "🍣"
  },
  {
    "id": "dish-fr-sora-03",
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
    "fallbackEmoji": "🍜"
  },
  {
    "id": "dish-fr-sora-04",
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
    "fallbackEmoji": "🥮"
  },
  {
    "id": "dish-fr-lunch",
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
    "fallbackEmoji": "🍽️"
  },
  {
    "id": "dish-fr-drink-01",
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
    "fallbackEmoji": "🌺"
  },
  {
    "id": "dish-jp-aura-01",
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
    "fallbackEmoji": "🥟"
  },
  {
    "id": "dish-jp-aura-02",
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
    "fallbackEmoji": "🥩"
  },
  {
    "id": "dish-jp-aura-03",
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
    "fallbackEmoji": "🍱"
  },
  {
    "id": "dish-jp-aura-04",
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
    "fallbackEmoji": "🥞"
  },
  {
    "id": "dish-jp-sora-01",
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
    "fallbackEmoji": "🫘"
  },
  {
    "id": "dish-jp-sora-02",
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
    "fallbackEmoji": "🍣"
  },
  {
    "id": "dish-jp-sora-03",
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
    "fallbackEmoji": "🍜"
  },
  {
    "id": "dish-jp-sora-04",
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
    "fallbackEmoji": "🍡"
  },
  {
    "id": "dish-jp-lunch",
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
    "fallbackEmoji": "🍱"
  },
  {
    "id": "dish-jp-drink-01",
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
    "fallbackEmoji": "🍵"
  }
];

export function getDishesForCountry(countryCode: CountryCode): CatalogDish[] {
  return DISH_CATALOG.filter((d) => d.countryCode === countryCode);
}

export function buildMenuItemsForBranch(branchId: string, countryCode: CountryCode): MenuItem[] {
  return DISH_CATALOG.filter((d) => d.countryCode === countryCode).map((d) => ({
    ...d,
    branchId,
  }));
}
