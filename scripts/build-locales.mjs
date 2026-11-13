import fs from 'fs';

const masterKeys = JSON.parse(fs.readFileSync('scripts/master_keys.json', 'utf8'));
const extracted = JSON.parse(fs.readFileSync('scripts/extracted_translations.json', 'utf8'));

// Dictionaries for ES, EN, PT, FR, JA
const es = { ...extracted.es };
const en = { ...extracted.en };
const pt = { ...extracted.pt };
const ja = { ...extracted.ja };
const fr = {};

// Helper to fill missing translations systematically
const translationsData = {
  app_subtitle: {
    es: 'Tu restaurante favorito, a la puerta de tu casa',
    en: 'Your favorite restaurant, delivered to your door',
    pt: 'Seu restaurante favorito, à sua porta',
    fr: 'Votre restaurant préféré, livré à votre porte',
    ja: 'お気に入りのレストランを、あなたの玄関先まで'
  },
  select_country: {
    es: 'Seleccionar país',
    en: 'Select country',
    pt: 'Selecionar país',
    fr: 'Sélectionner le pays',
    ja: '国を選択'
  },
  notifications: {
    es: 'Notificaciones',
    en: 'Notifications',
    pt: 'Notificações',
    fr: 'Notifications',
    ja: '通知'
  },
  no_notifications: {
    es: 'Sin notificaciones pendientes',
    en: 'No pending notifications',
    pt: 'Nenhuma notificação pendente',
    fr: 'Aucune notification en attente',
    ja: '保留中の通知はありません'
  },
  qr_code_menu: {
    es: 'Menú Digital QR en Mesa',
    en: 'Table QR Digital Menu',
    pt: 'Cardápio Digital QR na Mesa',
    fr: 'Menu numérique QR sur table',
    ja: 'テーブルQRデジタルメニュー'
  },
  my_reservations: {
    es: 'Mis Reservas',
    en: 'My Reservations',
    pt: 'Minhas Reservas',
    fr: 'Mes réservations',
    ja: 'マイトラベル・予約'
  },
  schedule: {
    es: 'Horario',
    en: 'Hours',
    pt: 'Horário',
    fr: 'Horaires',
    ja: '営業時間'
  },
  currency: {
    es: 'Moneda',
    en: 'Currency',
    pt: 'Moeda',
    fr: 'Devise',
    ja: '通貨'
  },
  avg_ticket: {
    es: 'Ticket Promedio',
    en: 'Average Ticket',
    pt: 'Ticket Médio',
    fr: 'Ticket moyen',
    ja: '平均客単価'
  },
  avg_prep_time: {
    es: 'Tiempo Promedio de Cocina',
    en: 'Avg Kitchen Prep Time',
    pt: 'Tempo Médio de Preparo',
    fr: 'Temps moyen de préparation',
    ja: '平均調理時間'
  },
  reservation_conversion: {
    es: 'Conversión de Reservas',
    en: 'Reservation Conversion',
    pt: 'Conversão de Reservas',
    fr: 'Conversion des réservations',
    ja: '予約完了率'
  },
  chart_revenue_by_branch: {
    es: 'Ingresos por Sede',
    en: 'Revenue by Branch',
    pt: 'Receita por Filial',
    fr: 'Chiffre d’affaires par établissement',
    ja: '店舗別売上高'
  },
  chart_category_split: {
    es: 'Distribución por Categoría',
    en: 'Sales by Category',
    pt: 'Vendas por Categoria',
    fr: 'Répartition par catégorie',
    ja: 'カテゴリー別売上比率'
  },
  nav_branches: {
    es: 'Sedes y Sucursales',
    en: 'Locations & Branches',
    pt: 'Filiais e Unidades',
    fr: 'Établissements & Succursales',
    ja: '店舗・支店一覧'
  },
  badge_active: {
    es: 'ACTIVA',
    en: 'ACTIVE',
    pt: 'ATIVA',
    fr: 'ACTIF',
    ja: '営業中'
  },
  dashboard_welcome: {
    es: 'Bienvenido de nuevo, {name}',
    en: 'Welcome back, {name}',
    pt: 'Bem-vindo de volta, {name}',
    fr: 'Bienvenue, {name}',
    ja: 'お帰りなさい、{name} 様'
  },
  dashboard_waiter_subtitle: {
    es: 'Gestión en vivo de mesas, atención a comensales y entrega de pedidos',
    en: 'Live table floor plan, guest service and order dispatch',
    pt: 'Gestão em tempo real de mesas, atendimento e entrega de comandas',
    fr: 'Plan de salle en direct, service en salle et livraison des commandes',
    ja: 'フロア席状況、配膳、接客リクエストのリアルタイム管理'
  },
  sales_trend: {
    es: 'Tendencia de Ventas (30 Días)',
    en: '30-Day Sales Trend',
    pt: 'Tendência de Vendas (30 Dias)',
    fr: 'Tendance des ventes (30 jours)',
    ja: '売上推移（過去30日間）'
  },
  dsm_title: {
    es: 'Monitor Distribuido de Servicios',
    en: 'Distributed Services Monitor',
    pt: 'Monitor Distribuído de Serviços',
    fr: 'Moniteur des services distribués',
    ja: '分散サービスモニター'
  },
  btn_run_demo_flow: {
    es: 'Ejecutar Flujo Demo',
    en: 'Run Demo Flow',
    pt: 'Executar Fluxo Demo',
    fr: 'Lancer le flux démo',
    ja: 'デモフローを実行'
  },
  btn_clear_events: {
    es: 'Limpiar Eventos',
    en: 'Clear Events',
    pt: 'Limpar Eventos',
    fr: 'Effacer les événements',
    ja: 'イベント履歴をクリア'
  },
  arch_flow: {
    es: 'Flujo de Arquitectura',
    en: 'Architecture Flow',
    pt: 'Fluxo de Arquitetura',
    fr: 'Flux d’architecture',
    ja: 'アーキテクチャフロー'
  },
  services_mesh: {
    es: 'Malla de Servicios',
    en: 'Services Mesh',
    pt: 'Malha de Serviços',
    fr: 'Maillage de services',
    ja: 'サービスメッシュ'
  },
  event_stream: {
    es: 'Flujo de Eventos',
    en: 'Event Stream',
    pt: 'Fluxo de Eventos',
    fr: 'Flux d’événements',
    ja: 'イベントストリーム'
  },
  event_id: {
    es: 'ID Evento',
    en: 'Event ID',
    pt: 'ID do Evento',
    fr: 'ID événement',
    ja: 'イベントID'
  },
  event_type: {
    es: 'Tipo',
    en: 'Type',
    pt: 'Tipo',
    fr: 'Type',
    ja: 'イベント種別'
  },
  event_status: {
    es: 'Estado',
    en: 'Status',
    pt: 'Status',
    fr: 'Statut',
    ja: 'ステータス'
  },
  realtime_sync: {
    es: 'Sincronización en vivo',
    en: 'Live Sync',
    pt: 'Sincronização em tempo real',
    fr: 'Synchronisation en direct',
    ja: 'リアルタイム同期'
  },
  sync_active: {
    es: 'Conexión activa',
    en: 'Connection Active',
    pt: 'Conexão ativa',
    fr: 'Connexion active',
    ja: '接続正常'
  },
  all_categories: {
    es: 'Todas las categorías',
    en: 'All categories',
    pt: 'Todas as categorias',
    fr: 'Toutes les catégories',
    ja: '全カテゴリー'
  },
  menu_title: {
    es: 'Catálogo de Carta y Menú',
    en: 'Menu & Dishes Catalog',
    pt: 'Catálogo de Cardápio e Pratos',
    fr: 'Catalogue de la carte & Menus',
    ja: 'メニュー・料理カタログ'
  },
  menu_subtitle: {
    es: 'Gestión de platos, disponibilidad en cocina y tiempos de preparación',
    en: 'Manage items, kitchen availability and prep times',
    pt: 'Gestão de pratos, disponibilidade na cozinha e tempos de preparo',
    fr: 'Gestion des plats, disponibilité en cuisine et temps de préparation',
    ja: 'メニュー品目の管理、厨房在庫状況および調理時間の調整'
  },
  new_product: {
    es: 'Nuevo Plato',
    en: 'New Dish',
    pt: 'Novo Prato',
    fr: 'Nouveau plat',
    ja: '新規料理を追加'
  },
  search_product: {
    es: 'Buscar plato o ingrediente...',
    en: 'Search dish or ingredient...',
    pt: 'Buscar prato ou ingrediente...',
    fr: 'Rechercher un plat ou ingrédient...',
    ja: '料理や食材を検索...'
  },
  item_available: {
    es: 'Disponible',
    en: 'Available',
    pt: 'Disponível',
    fr: 'Disponible',
    ja: '提供中'
  },
  item_unavailable: {
    es: 'Agotado en Cocina',
    en: 'Sold Out in Kitchen',
    pt: 'Esgotado na Cozinha',
    fr: 'Épuisé en cuisine',
    ja: '厨房品切れ'
  },
  qr_title: {
    es: 'Comandas Digitales QR en Mesa',
    en: 'Table QR Digital Orders',
    pt: 'Comandas Digitais QR na Mesa',
    fr: 'Commandes QR numériques sur table',
    ja: 'テーブルQR注文システム'
  },
  qr_subtitle: {
    es: 'Visualizador de código QR y simulador interactivo para comensales',
    en: 'QR code display and interactive dine-in guest simulator',
    pt: 'Visualizador de QR Code e simulador interativo para clientes',
    fr: 'Affichage du QR code et simulateur interactif en salle',
    ja: 'QRコード表示および来店客向け注文シミュレーター'
  },
  select_table_qr: {
    es: 'Seleccionar Mesa para Generar QR',
    en: 'Select Table to Generate QR',
    pt: 'Selecionar Mesa para Gerar QR',
    fr: 'Sélectionner une table pour générer le QR',
    ja: 'QR生成用のテーブルを選択'
  },
  cart: {
    es: 'Comanda / Carrito',
    en: 'Order Cart',
    pt: 'Comanda / Carrinho',
    fr: 'Panier de commande',
    ja: '注文カート'
  },
  cart_empty: {
    es: 'Tu comanda está vacía',
    en: 'Your order cart is empty',
    pt: 'Sua comanda está vazia',
    fr: 'Votre panier est vide',
    ja: '注文カートは空です'
  },
  res_title: {
    es: 'Gestión de Reservaciones',
    en: 'Reservation Management',
    pt: 'Gestão de Reservas',
    fr: 'Gestion des réservations',
    ja: '来店予約管理'
  },
  res_subtitle: {
    es: 'Control de aforo, asignación de mesas y confirmación sin solapamientos',
    en: 'Capacity control, table assignment and overlap prevention',
    pt: 'Controle de capacidade, alocação de mesas e prevenção de sobreposição',
    fr: 'Capacité, attribution des tables et prévention des chevauchements',
    ja: '配席管理、座席割り当て、重複予約の自動防止'
  },
  new_reservation: {
    es: 'Nueva Reserva',
    en: 'New Reservation',
    pt: 'Nova Reserva',
    fr: 'Nouvelle réservation',
    ja: '新規予約作成'
  },
  confirm_reservation: {
    es: 'Confirmar Reserva',
    en: 'Confirm Reservation',
    pt: 'Confirmar Reserva',
    fr: 'Confirmer la réservation',
    ja: '予約を確定する'
  },
  cancel_reservation: {
    es: 'Cancelar Reserva',
    en: 'Cancel Reservation',
    pt: 'Cancelar Reserva',
    fr: 'Annuler la réservation',
    ja: '予約をキャンセル'
  },
  res_customer_name: {
    es: 'Nombre del Cliente',
    en: 'Customer Name',
    pt: 'Nome do Cliente',
    fr: 'Nom du client',
    ja: 'お客様氏名'
  },
  res_customer_phone: {
    es: 'Teléfono de Contacto',
    en: 'Contact Phone',
    pt: 'Telefone de Contato',
    fr: 'Téléphone de contact',
    ja: 'ご連絡先電話番号'
  },
  res_customer_email: {
    es: 'Correo Electrónico',
    en: 'Email Address',
    pt: 'E-mail do Cliente',
    fr: 'Adresse e-mail',
    ja: 'メールアドレス'
  },
  res_date: {
    es: 'Fecha',
    en: 'Date',
    pt: 'Data',
    fr: 'Date',
    ja: '日付'
  },
  res_time: {
    es: 'Hora',
    en: 'Time',
    pt: 'Horário',
    fr: 'Heure',
    ja: '時間'
  },
  res_guests: {
    es: 'Número de Comensales',
    en: 'Number of Guests',
    pt: 'Número de Pessoas',
    fr: 'Nombre de couverts',
    ja: 'ご来店人数'
  },
  res_table: {
    es: 'Mesa Asignada',
    en: 'Assigned Table',
    pt: 'Mesa Atribuída',
    fr: 'Table assignée',
    ja: '指定テーブル'
  },
  res_notes: {
    es: 'Notas y Preferencias',
    en: 'Notes & Special Requests',
    pt: 'Observações e Preferências',
    fr: 'Remarques & demandes spéciales',
    ja: 'ご要望・アレルギー情報'
  },
  gluten_free: {
    es: 'Sin Gluten',
    en: 'Gluten Free',
    pt: 'Sem Glúten',
    fr: 'Sans gluten',
    ja: 'グルテンフリー'
  },
  chef_special: {
    es: 'Especial del Chef',
    en: 'Chef Special',
    pt: 'Especial do Chef',
    fr: 'Spécialité du chef',
    ja: 'シェフ特製'
  },
  vegetarian: {
    es: 'Vegetariano',
    en: 'Vegetarian',
    pt: 'Vegetariano',
    fr: 'Végétarien',
    ja: 'ベジタリアン'
  },
  vegan: {
    es: 'Vegano',
    en: 'Vegan',
    pt: 'Vegano',
    fr: 'Végétalien',
    ja: 'ヴィーガン'
  },
  spicy: {
    es: 'Picante',
    en: 'Spicy',
    pt: 'Picante',
    fr: 'Épicé',
    ja: 'スパイシー'
  },
  // Countries
  country_co: { es: 'Colombia', en: 'Colombia', pt: 'Colômbia', fr: 'Colombie', ja: 'コロンビア' },
  country_br: { es: 'Brasil', en: 'Brazil', pt: 'Brasil', fr: 'Brésil', ja: 'ブラジル' },
  country_us: { es: 'Estados Unidos', en: 'United States', pt: 'Estados Unidos', fr: 'États-Unis', ja: 'アメリカ合衆国' },
  country_fr: { es: 'Francia', en: 'France', pt: 'França', fr: 'France', ja: 'フランス' },
  country_jp: { es: 'Japón', en: 'Japan', pt: 'Japão', fr: 'Japon', ja: '日本' },
  // Cities
  city_bogota: { es: 'Bogotá', en: 'Bogota', pt: 'Bogotá', fr: 'Bogota', ja: 'ボゴタ' },
  city_sao_paulo: { es: 'São Paulo', en: 'Sao Paulo', pt: 'São Paulo', fr: 'São Paulo', ja: 'サンパウロ' },
  city_new_york: { es: 'Nueva York', en: 'New York', pt: 'Nova York', fr: 'New York', ja: 'ニューヨーク' },
  city_paris: { es: 'París', en: 'Paris', pt: 'Paris', fr: 'Paris', ja: 'パリ' },
  city_tokyo: { es: 'Tokio', en: 'Tokyo', pt: 'Tóquio', fr: 'Paris', ja: '東京' },
  // Address labels
  field_address_street: { es: 'Dirección (Calle y Número)', en: 'Street Address', pt: 'Rua e Número', fr: 'Rue et numéro', ja: '町名・番地' },
  field_address_apt: { es: 'Apto / Interior / Suite', en: 'Apt / Suite / Unit', pt: 'Complemento / Apto', fr: 'Bâtiment / Étage / Appartement', ja: '建物名・部屋番号' },
  field_address_neighborhood: { es: 'Barrio / Localidad', en: 'Neighborhood / District', pt: 'Bairro', fr: 'Quartier / Arrondissement', ja: '地区・地域' },
  field_address_city: { es: 'Ciudad', en: 'City', pt: 'Cidade', fr: 'Ville', ja: '市区町村' },
  field_address_postal_code: { es: 'Código Postal', en: 'Postal Code', pt: 'Código Postal', fr: 'Code postal', ja: '郵便番号' },
  field_address_state: { es: 'Estado / Departamento', en: 'State / Province', pt: 'Estado (UF)', fr: 'Département / Région', ja: '都道府県' },
  field_address_complement: { es: 'Complemento', en: 'Address Complement', pt: 'Complemento', fr: 'Complément d’adresse', ja: '補足住所' },
  field_address_cep: { es: 'CEP', en: 'CEP', pt: 'CEP', fr: 'CEP', ja: '郵便番号 (CEP)' },
  field_address_zip: { es: 'ZIP Code', en: 'ZIP Code', pt: 'ZIP Code', fr: 'Code ZIP', ja: 'ZIPコード' },
  field_address_prefecture: { es: 'Prefectura', en: 'Prefecture', pt: 'Prefeitura', fr: 'Préfecture', ja: '都道府県' },
  field_address_city_ward: { es: 'Ciudad / Barrio / Distrito', en: 'City / Ward', pt: 'Cidade / Distrito', fr: 'Ville / Arrondissement', ja: '市区町村' },
  field_address_chome_ban: { es: 'Chome, Ban, Go', en: 'Chome, Ban, Go', pt: 'Chome, Ban, Go', fr: 'Chome, Ban, Go', ja: '丁目・番地・号' },
  field_address_building_apt: { es: 'Edificio y Apartamento', en: 'Building & Apt', pt: 'Edifício e Apto', fr: 'Bâtiment et appartement', ja: '建物名・号室' },
  // Placeholders
  placeholder_address_co: { es: 'Ej: Calle 72 # 10-34', en: 'e.g. Calle 72 # 10-34', pt: 'Ex: Calle 72 # 10-34', fr: 'Ex: Calle 72 # 10-34', ja: '例: Calle 72 # 10-34' },
  placeholder_apt: { es: 'Apto 402, Torre B', en: 'Apt 402, Bldg B', pt: 'Apto 402, Bloco B', fr: 'Appartement 402, Bâtiment B', ja: '402号室 B棟' },
  placeholder_neighborhood: { es: 'Ej: Chapinero Alto', en: 'e.g. Chapinero Alto', pt: 'Ex: Pinheiros', fr: 'Ex: Le Marais', ja: '例: 渋谷区神南' },
  placeholder_city: { es: 'Bogotá', en: 'City name', pt: 'São Paulo', fr: 'Paris', ja: '市区町村名' },
  placeholder_postal_co: { es: '110221', en: '110221', pt: '110221', fr: '110221', ja: '110221' },
  placeholder_address_br: { es: 'Rua Oscar Freire, 1200', en: 'Rua Oscar Freire, 1200', pt: 'Rua Oscar Freire, 1200', fr: 'Rua Oscar Freire, 1200', ja: 'オスカル・フレイレ通り 1200' },
  placeholder_complement: { es: 'Apto 51', en: 'Suite 51', pt: 'Apto 51', fr: 'Appt 51', ja: '51号室' },
  placeholder_state_br: { es: 'SP', en: 'SP', pt: 'SP', fr: 'SP', ja: 'SP' },
  placeholder_cep: { es: '01426-001', en: '01426-001', pt: '01426-001', fr: '01426-001', ja: '01426-001' },
  placeholder_address_us: { es: '350 5th Ave', en: '350 5th Ave', pt: '350 5th Ave', fr: '350 5th Ave', ja: '350 5th Ave' },
  placeholder_state_us: { es: 'NY', en: 'NY', pt: 'NY', fr: 'NY', ja: 'NY' },
  placeholder_zip: { es: '10118', en: '10118', pt: '10118', fr: '10118', ja: '10118' },
  placeholder_address_fr: { es: '14 Rue de Rivoli', en: '14 Rue de Rivoli', pt: '14 Rue de Rivoli', fr: '14 Rue de Rivoli', ja: 'リヴォリ通り14番地' },
  placeholder_postal_fr: { es: '75004', en: '75004', pt: '75004', fr: '75004', ja: '75004' },
  placeholder_postal_jp: { es: '150-0041', en: '150-0041', pt: '150-0041', fr: '150-0041', ja: '150-0041' },
  placeholder_prefecture_jp: { es: 'Tokio', en: 'Tokyo', pt: 'Tóquio', fr: 'Tokyo', ja: '東京都' },
  placeholder_city_jp: { es: 'Shibuya-ku', en: 'Shibuya-ku', pt: 'Shibuya-ku', fr: 'Shibuya-ku', ja: '渋谷区神南' },
  placeholder_address_jp: { es: '1-2-3', en: '1-2-3', pt: '1-2-3', fr: '1-2-3', ja: '1丁目2番3号' },
  placeholder_building_jp: { es: 'Shibuya Tower 4F', en: 'Shibuya Tower 4F', pt: 'Shibuya Tower 4F', fr: 'Tour Shibuya 4F', ja: '渋谷タワー4階' },
  // Taxes
  tax_impoconsumo_8: { es: 'Impoconsumo Restaurantes (8%)', en: 'Restaurant Consumption Tax (8%)', pt: 'Imposto de Consumo em Restaurante (8%)', fr: 'Taxe de consommation restauration (8%)', ja: '外食消費税 (8%)' },
  tax_iva_delivery_19: { es: 'IVA Tarifa de Domicilio (19%)', en: 'Delivery Fee VAT (19%)', pt: 'IVA Taxa de Entrega (19%)', fr: 'TVA livraison (19%)', ja: '配達手数料付加価値税 (19%)' },
  tax_iss_icms_5: { es: 'ISS / ICMS Municipal (5%)', en: 'Municipal Service Tax ISS (5%)', pt: 'ISS / ICMS Municipal (5%)', fr: 'Taxe municipale ISS (5%)', ja: '自治体サービス税 ISS (5%)' },
  tax_nyc_sales_tax: { es: 'NYC Sales Tax (8.875%)', en: 'NYC Sales Tax (8.875%)', pt: 'Taxa de Vendas NYC (8,875%)', fr: 'Taxe sur les ventes NYC (8,875%)', ja: 'ニューヨーク市消費税 (8.875%)' },
  tax_nj_sales_tax: { es: 'NJ Sales Tax (6.625%)', en: 'NJ Sales Tax (6.625%)', pt: 'Taxa de Vendas NJ (6,625%)', fr: 'Taxe sur les ventes NJ (6,625%)', ja: 'ニュージャージー州消費税 (6.625%)' },
  tax_tva_10: { es: 'TVA Restauration (10%)', en: 'Restaurant VAT (10%)', pt: 'TVA Restauração (10%)', fr: 'TVA Restauration (10%)', ja: '付加価値税 外食 (10%)' },
  tax_tva_5_5: { es: 'TVA Produits Conditionnés (5.5%)', en: 'Packaged Food VAT (5.5%)', pt: 'TVA Produtos Embalados (5,5%)', fr: 'TVA Produits Conditionnés (5,5%)', ja: '付加価値税 包装食品 (5.5%)' },
  tax_tva_20: { es: 'TVA Livraison & Alcool (20%)', en: 'Delivery & Alcohol VAT (20%)', pt: 'TVA Entrega e Bebidas (20%)', fr: 'TVA Livraison & Boissons alcoolisées (20%)', ja: '付加価値税 配達・アルコール (20%)' },
  tax_consumption_standard_10: { es: 'Impuesto al Consumo General (10%)', en: 'Standard Consumption Tax (10%)', pt: 'Imposto de Consumo Geral (10%)', fr: 'Taxe de consommation générale (10%)', ja: '消費税 (標準税率 10%)' },
  tax_consumption_reduced_8: { es: 'Tasa Reducida para Llevar/Domicilio (8%)', en: 'Reduced Tax for Takeaway/Delivery (8%)', pt: 'Taxa Reduzida para Viagem/Entrega (8%)', fr: 'Taux réduit à emporter/livraison (8%)', ja: '軽減税率 飲食料品・出前 (8%)' },
  // Payment methods
  payment_pse: { es: 'PSE (Débito Bancario)', en: 'PSE (Bank Debit)', pt: 'PSE (Débito em Conta)', fr: 'PSE (Débit bancaire)', ja: 'PSE (銀行口座引き落とし)' },
  payment_nequi: { es: 'Nequi / Bancolombia', en: 'Nequi Digital Wallet', pt: 'Carteira Digital Nequi', fr: 'Portefeuille Nequi', ja: 'Nequi デジタルウォレット' },
  payment_pix: { es: 'Pix Instantáneo', en: 'Pix Instant Payment', pt: 'Pix Instantâneo', fr: 'Pix Paiement Instantané', ja: 'Pix 即時決済' },
  payment_boleto: { es: 'Boleto Bancário', en: 'Boleto Bancario', pt: 'Boleto Bancário', fr: 'Boleto Bancário', ja: 'Boleto 銀行振込票' },
  payment_apple_pay: { es: 'Apple Pay', en: 'Apple Pay', pt: 'Apple Pay', fr: 'Apple Pay', ja: 'Apple Pay' },
  payment_google_pay: { es: 'Google Pay', en: 'Google Pay', pt: 'Google Pay', fr: 'Google Pay', ja: 'Google Pay' },
  payment_carte_bancaire: { es: 'Carte Bancaire / CB', en: 'Carte Bancaire (CB)', pt: 'Cartão de Débito CB', fr: 'Carte Bancaire (CB)', ja: 'カルト・バンケール (CB)' },
  payment_sepa: { es: 'Prélèvement SEPA', en: 'SEPA Direct Debit', pt: 'Débito Direto SEPA', fr: 'Prélèvement SEPA', ja: 'SEPA 口座引き落とし' },
  payment_paypay: { es: 'PayPay (Código QR)', en: 'PayPay QR Payment', pt: 'PayPay QR Code', fr: 'Paiement QR PayPay', ja: 'PayPay (QR決済)' },
  payment_konbini: { es: 'Pago en Konbini (Tienda de conveniencia)', en: 'Konbini Convenience Store Payment', pt: 'Pagamento em Loja de Conveniência (Konbini)', fr: 'Paiement en Konbini', ja: 'コンビニ決済 (ローソン/セブン/ファミマ)' },
  // Receipts
  receipt_electronic_invoice_dian: { es: 'Factura Electrónica de Venta (DIAN)', en: 'Electronic Sales Invoice (DIAN)', pt: 'Fatura Eletrônica de Venda (DIAN)', fr: 'Facture électronique officielle (DIAN)', ja: '電子販売請求書 (DIAN適格)' },
  receipt_nfe_nfce: { es: 'Nota Fiscal de Consumidor Eletrônica (NFC-e)', en: 'Electronic Consumer Invoice (NFC-e)', pt: 'Nota Fiscal de Consumidor Eletrônica (NFC-e)', fr: 'Facture électronique consommateur (NFC-e)', ja: '電子消費者請求書 (NFC-e)' },
  receipt_sales_receipt: { es: 'Comprobante Fiscal de Venta', en: 'Itemized Sales Receipt', pt: 'Comprovante Fiscal de Venda', fr: 'Ticket de caisse et reçu fiscal', ja: '販売領収書 (明細書)' },
  receipt_ticket_de_caisse: { es: 'Ticket de Caisse Certifié (NF525)', en: 'Certified Cash Receipt (NF525)', pt: 'Cupom de Caixa Certificado (NF525)', fr: 'Ticket de caisse certifié (NF525)', ja: '公認レシート (NF525基準)' },
  receipt_ryoshusho: { es: '領収書 / Factura de Consumo (適格請求書)', en: 'Ryoshusho Qualified Invoice Receipt', pt: 'Recibo Fiscal Ryoshusho (Fatura Qualificada)', fr: 'Reçu Ryoshusho (Facture qualifiée)', ja: '領収書 (適格請求書・インボイス制度対応)' },
  fiscal_id_nit: { es: 'NIT', en: 'Tax ID (NIT)', pt: 'NIT', fr: 'NIT', ja: '納税者番号 (NIT)' },
  fiscal_id_cnpj: { es: 'CNPJ', en: 'CNPJ', pt: 'CNPJ', fr: 'CNPJ', ja: '法人番号 (CNPJ)' },
  fiscal_id_ein: { es: 'EIN', en: 'EIN', pt: 'EIN', fr: 'EIN', ja: '雇用主番号 (EIN)' },
  fiscal_id_siret: { es: 'SIRET', en: 'SIRET', pt: 'SIRET', fr: 'SIRET', ja: '企業識別番号 (SIRET)' },
  fiscal_id_invoice_registration_t: { es: 'Nº Registro Factura (T+13)', en: 'Invoice Reg. No. (T+13)', pt: 'Nº Reg. Fatura (T+13)', fr: 'N° Facture T+13', ja: '適格請求書発行事業者登録番号 (T+13桁)' },
  receipt_legal_co: { es: 'Documento legal con validación electrónica previa según Resolución DIAN.', en: 'Official legal document with prior validation pursuant to DIAN Resolution.', pt: 'Documento legal com validação prévia segundo Resolução DIAN.', fr: 'Document fiscal officiel avec validation préalable DIAN.', ja: 'コロンビア国税庁(DIAN)電子承認済みの正式領収書です。' },
  receipt_legal_br: { es: 'Documento Auxiliar da NFC-e emitido em conformidade com a SEFAZ.', en: 'Auxiliary NFC-e document issued in compliance with SEFAZ regulations.', pt: 'Documento Auxiliar da NFC-e emitido em conformidade com a SEFAZ.', fr: 'Document officiel NFC-e délivré conformément aux normes SEFAZ.', ja: 'ブラジル税務局(SEFAZ)規定に準拠したNFC-e正式伝票です。' },
  receipt_legal_us: { es: 'Conserve este comprobante para sus registros contables.', en: 'Please retain this receipt for your financial and tax records.', pt: 'Guarde este comprovante para seus registros fiscais.', fr: 'Veuillez conserver ce reçu pour votre comptabilité.', ja: '税務申告および経理記録のため、本領収書を大切に保管してください。' },
  receipt_legal_fr: { es: 'Documento justificativo emitido de conformidad con la ley fiscal francesa. Service compris.', en: 'Official receipt issued in accordance with French tax regulations. Service included.', pt: 'Comprovante emitido de acordo com a legislação tributária francesa. Serviço incluso.', fr: 'Document justificatif émis conformément aux obligations fiscales. Service compris.', ja: 'フランス税法に準拠して発行された公式レシートです（サービス料込み）。' },
  receipt_legal_jp: { es: 'Comprobante emitido según las directrices del Sistema de Facturas Cualificadas de la NTA.', en: 'Receipt issued in compliance with the NTA Qualified Invoice System guidelines.', pt: 'Recibo emitido de acordo com o Sistema de Faturas Qualificadas da NTA.', fr: 'Reçu émis selon les normes du système de facture qualifiée de la NTA.', ja: '上記のとおり正に領収いたしました。消費税額および登録番号明記済（国税庁インボイス制度対応）。' },
  // Roles
  role_courier: { es: 'Repartidor (Courier)', en: 'Courier / Delivery Driver', pt: 'Entregador (Courier)', fr: 'Livreur (Courier)', ja: '配達クルー (Courier)' },
  role_courier_desc: { es: 'Asignación de pedidos cercanos, navegación GPS de entrega y confirmación al cliente.', en: 'Nearby order dispatch, route navigation and customer handoff.', pt: 'Aceite de pedidos próximos, navegação de rota e confirmação de entrega.', fr: 'Prise en charge des commandes à proximité, navigation et livraison au client.', ja: '近隣注文の配送受諾、最適ルート走行および受渡確認' },
  role_platform_admin: { es: 'Administrador de Plataforma', en: 'Platform Administrator', pt: 'Administrador da Plataforma', fr: 'Administrateur de la plateforme', ja: 'プラットフォーム統括管理者' },
  role_platform_admin_desc: { es: 'Consola global de nodos, control de fallas, salud de los 5 países y métricas consolidadas.', en: 'Global nodes console, fault simulation, health monitoring across all 5 countries.', pt: 'Console global de nós, injeção de falhas, saúde dos 5 países e métricas globais.', fr: 'Console globale, simulation de pannes, santé des 5 pays et métriques.', ja: '5カ国全ノードの監視、障害シミュレーション、レプリカ管理および統合分析' },
  role_branch_admin: { es: 'Administrador de Sede', en: 'Branch Manager', pt: 'Gerente da Filial', fr: 'Directeur d’établissement', ja: '店舗マネージャー' },
  role_branch_admin_desc: { es: 'Control local de carta, mesas, pedidos y equipo de una sede específica.', en: 'Local management of menu, tables, orders and branch staff.', pt: 'Controle operacional de cardápio, mesas, comandas e equipe local.', fr: 'Gestion opérationnelle de la carte, des tables, des commandes et de l’équipe.', ja: '特定店舗のメニュー、テーブル席、注文およびスタッフの統括管理' },
  // Services
  service_auth: { es: 'Servicio de Autenticación', en: 'Authentication Service', pt: 'Serviço de Autenticação', fr: 'Service d’authentification', ja: '認証・認可サービス' },
  service_restaurant: { es: 'Servicio de Restaurantes & Catálogo', en: 'Restaurant & Catalog Service', pt: 'Serviço de Restaurantes e Cardápio', fr: 'Service restaurants & catalogue', ja: '店舗・カタログサービス' },
  service_reservation: { es: 'Servicio de Reservaciones', en: 'Reservation Service', pt: 'Serviço de Reservas', fr: 'Service de réservation', ja: '座席予約サービス' },
  service_order: { es: 'Servicio de Pedidos & Pagos', en: 'Order & Payment Service', pt: 'Serviço de Pedidos e Pagamentos', fr: 'Service commandes & paiements', ja: '注文・決済サービス' },
  service_kitchen: { es: 'Servicio de Cocina (KDS)', en: 'Kitchen Display System Service', pt: 'Serviço de Cozinha (KDS)', fr: 'Service d’affichage cuisine (KDS)', ja: '厨房ディスプレイ(KDS)サービス' },
  service_notification: { es: 'Servicio de Notificaciones', en: 'Notification Service', pt: 'Serviço de Notificações', fr: 'Service de notification', ja: 'リアルタイム通知サービス' },
  service_analytics: { es: 'Servicio de Analítica', en: 'Analytics Service', pt: 'Serviço de Analítica', fr: 'Service analytique', ja: 'データ分析サービス' },
  // Delivery & Proximity
  order_type_dine_in: { es: 'Consumo en Sala / Mesa', en: 'Dine-In Table', pt: 'Consumo no Salão / Mesa', fr: 'Sur place / En salle', ja: '店内飲食' },
  order_type_delivery: { es: 'Pedido a Domicilio', en: 'Home Delivery', pt: 'Entrega Delivery', fr: 'Livraison à domicile', ja: '出前・デリバリー' },
  order_type_takeaway: { es: 'Para Llevar (Takeaway)', en: 'Takeaway / Pickup', pt: 'Retirada no Balcão', fr: 'À emporter', ja: 'お持ち帰り (テイクアウト)' },
  delivery_address_title: { es: 'Dirección de Entrega', en: 'Delivery Address', pt: 'Endereço de Entrega', fr: 'Adresse de livraison', ja: 'お届け先住所' },
  delivery_fee: { es: 'Tarifa de Entrega', en: 'Delivery Fee', pt: 'Taxa de Entrega', fr: 'Frais de livraison', ja: '配達手数料' },
  assigned_courier: { es: 'Repartidor Asignado', en: 'Assigned Courier', pt: 'Entregador Alocado', fr: 'Livreur attribué', ja: '担当配達クルー' },
  courier_on_the_way: { es: 'Tu repartidor va en camino con tu pedido', en: 'Your courier is on the way with your order', pt: 'Seu entregador está a caminho com seu pedido', fr: 'Votre livreur est en route avec votre commande', ja: '配達クルーがご注文のお料理をお届けに向かっています' },
  estimated_delivery_time: { es: 'Tiempo Estimado de Entrega', en: 'Estimated Delivery Time', pt: 'Tempo Estimado de Entrega', fr: 'Délai de livraison estimé', ja: 'お届け予定時間' },
  lunch_of_the_day: { es: 'Almuerzo del Día', en: 'Daily Lunch Special', pt: 'Almoço do Dia', fr: 'Plat du jour midi', ja: '本日のおすすめランチ' },
  lunch_of_the_day_desc: { es: 'Menú balanceado de temporada, recién elaborado para quienes buscan calidad y agilidad.', en: 'Balanced seasonal lunch special, freshly prepared for an agile meal.', pt: 'Menu sazonal equilibrado, preparado na hora para quem busca qualidade e rapidez.', fr: 'Menu de saison équilibré, préparé minute pour une pause déjeuner savoureuse.', ja: '旬の食材を贅沢に使った、ランチタイム限定の特別バランスプレート。' },
  service_included_notice: { es: 'Servicio incluido en el precio según normativa local.', en: 'Service charge included in price pursuant to local regulations.', pt: 'Taxa de serviço inclusa nos preços conforme regulamento local.', fr: 'Service compris selon la réglementation en vigueur.', ja: '税金およびサービス料は商品価格に含まれております。' },
  no_tip_culture_notice: { es: 'En Japón no se acostumbra propina; el mejor agradecimiento es su visita.', en: 'Tipping is not customary in Japan; exceptional service is already standard.', pt: 'No Japão não se costuma dar gorjeta; o melhor agradecimento é sua visita.', fr: 'Le pourboire n’est pas d’usage au Japon; l’excellence du service est incluse.', ja: '日本国内ではチップの習慣はございません。おもてなしの心でお迎えいたします。' },
  distance_away: { es: 'a {dist} {unit} de tu ubicación', en: '{dist} {unit} away from you', pt: 'a {dist} {unit} da sua localização', fr: 'à {dist} {unit} de votre position', ja: '現在地から {dist} {unit}' }
};

// Now loop through masterKeys and assign to all 5 languages
for (const k of masterKeys) {
  // ES
  if (!es[k]) {
    es[k] = translationsData[k]?.es || extracted.es[k] || k;
  }
  // EN
  if (!en[k]) {
    en[k] = translationsData[k]?.en || extracted.en[k] || es[k];
  }
  // PT
  if (!pt[k]) {
    pt[k] = translationsData[k]?.pt || extracted.pt[k] || es[k];
  }
  // JA
  if (!ja[k]) {
    ja[k] = translationsData[k]?.ja || extracted.ja[k] || en[k];
  }
  // FR
  if (!fr[k]) {
    fr[k] = translationsData[k]?.fr || extracted.en[k] || en[k];
  }
}

// Generate the 5 TS files in src/i18n/locales/
function writeLocaleFile(lang, obj) {
  const content = `import { TranslationKey } from '../types';

export const ${lang.toUpperCase()}_TRANSLATIONS: Record<TranslationKey, string> = ${JSON.stringify(obj, null, 2)};
`;
  fs.writeFileSync(`src/i18n/locales/${lang}.ts`, content, 'utf8');
  console.log(`Generated src/i18n/locales/${lang}.ts with ${Object.keys(obj).length} keys`);
}

writeLocaleFile('es', es);
writeLocaleFile('en', en);
writeLocaleFile('pt', pt);
writeLocaleFile('fr', fr);
writeLocaleFile('ja', ja);

// Write types file src/i18n/types.ts
const typesContent = `export const TRANSLATION_KEYS = ${JSON.stringify(masterKeys, null, 2)} as const;

export type TranslationKey = typeof TRANSLATION_KEYS[number];
`;
fs.writeFileSync('src/i18n/types.ts', typesContent, 'utf8');
console.log('Wrote src/i18n/types.ts');
