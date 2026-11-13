import { RegionProfile } from '../../types';

export const JP_PROFILE: RegionProfile = {
  code: 'JP',
  nameKey: 'country_jp',
  nativeName: '日本',
  pilotCity: '東京 (Tokyo)',
  pilotCityKey: 'city_tokyo',
  flagEmoji: '🇯🇵',
  defaultLanguage: 'ja',
  supportedLanguages: ['ja', 'en', 'es', 'pt', 'fr'],
  currency: 'JPY',
  currencySymbol: '¥',
  currencySymbolOverride: '¥', // override full-width '￥' from some ja-JP formatters
  symbolPosition: 'before',
  symbolSpacing: false, // "¥2,590"
  fractionDigits: 0,
  thousandSeparator: ',',
  decimalSeparator: '.',
  dateFormatPattern: 'aaaa/mm/dd',
  clockFormat: '24h',
  timeZone: 'Asia/Tokyo',
  hasDaylightSaving: false,
  firstDayOfWeek: 0, // Sunday
  measurementSystem: 'metric',
  distanceUnit: 'km',
  phonePrefix: '+81',
  phoneFormatPlaceholder: '090-1234-5678',
  phoneRegex: '^0[789]0-?\\d{4}-?\\d{4}$',
  postalCodeMask: '〒NNN-NNNN',
  postalCodeRegex: '^\\d{3}-?\\d{4}$',
  nameOrder: 'family_given', // In Japan: Family Name first, then Given Name
  addressFields: [
    { key: 'postalCode', labelKey: 'field_address_postal_code', required: true, placeholderKey: 'placeholder_postal_jp' },
    { key: 'stateOrPrefecture', labelKey: 'field_address_prefecture', required: true, placeholderKey: 'placeholder_prefecture_jp' },
    { key: 'city', labelKey: 'field_address_city_ward', required: true, placeholderKey: 'placeholder_city_jp' },
    { key: 'streetLine', labelKey: 'field_address_chome_ban', required: true, placeholderKey: 'placeholder_address_jp' },
    { key: 'suiteOrApt', labelKey: 'field_address_building_apt', required: false, placeholderKey: 'placeholder_building_jp' },
  ],
  taxRules: [
    {
      id: 'jp-consumption-tax-standard',
      appliesTo: 'prepared_food',
      orderType: 'dine_in',
      jurisdiction: '国税庁 (NTA) — 全国一律',
      rateBps: 1000, // 10% standard rate for dine-in
      labelKey: 'tax_consumption_standard_10',
      source: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6102.htm',
      verifiedAt: '2026-01-12',
    },
    {
      id: 'jp-consumption-tax-reduced',
      appliesTo: 'prepared_food',
      orderType: 'delivery',
      jurisdiction: '国税庁 (NTA) — 軽減税率 (持ち帰り・出前)',
      rateBps: 800, // 8% reduced rate for takeaway and delivery food!
      labelKey: 'tax_consumption_reduced_8',
      source: 'https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/index.htm',
      verifiedAt: '2026-01-12',
    },
    {
      id: 'jp-delivery-fee-tax',
      appliesTo: 'delivery_fee',
      orderType: 'delivery',
      jurisdiction: '国税庁 (NTA) — 標準税率',
      rateBps: 1000, // 10% on delivery fee service
      labelKey: 'tax_consumption_standard_10',
      source: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6102.htm',
      verifiedAt: '2026-01-12',
    },
  ],
  tipPolicy: {
    mode: 'none',
    suggestionsBps: [],
    defaultBps: 0,
    showWidget: false,
  },
  receipt: {
    documentTypeKey: 'receipt_ryoshusho',
    officialAuthority: '国税庁 (NTA) — インボイス制度 (適格請求書)',
    fiscalNumberLabelKey: 'fiscal_id_invoice_registration_t',
    requiresFiscalIdOnReceipt: true,
    electronicInvoiceSystem: '適格請求書保存方式 (インボイス制度登録番号 T+13桁)',
    footerLegalTextKey: 'receipt_legal_jp',
  },
  paymentMethods: [
    { id: 'card', labelKey: 'payment_card', iconName: 'CreditCard', kind: 'card', isElectronic: true },
    { id: 'paypay', labelKey: 'payment_paypay', iconName: 'QrCode', kind: 'wallet', isElectronic: true },
    { id: 'konbini', labelKey: 'payment_konbini', iconName: 'Store', kind: 'voucher', isElectronic: true },
    { id: 'cash', labelKey: 'payment_cash', iconName: 'Banknote', kind: 'cash', isElectronic: false },
  ],
  holidays: [
    { date: '2026-01-01', nameKey: 'holiday_new_year', isNational: true },
    { date: '2026-01-12', nameKey: 'holiday_coming_of_age', isNational: true },
    { date: '2026-02-11', nameKey: 'holiday_foundation_day_jp', isNational: true },
    { date: '2026-02-23', nameKey: 'holiday_emperors_birthday', isNational: true },
    { date: '2026-03-20', nameKey: 'holiday_vernal_equinox', isNational: true },
    { date: '2026-04-29', nameKey: 'holiday_showa_day', isNational: true },
    { date: '2026-05-03', nameKey: 'holiday_constitution_memorial', isNational: true },
    { date: '2026-05-04', nameKey: 'holiday_greenery_day', isNational: true },
    { date: '2026-05-05', nameKey: 'holiday_childrens_day', isNational: true },
    { date: '2026-07-20', nameKey: 'holiday_marine_day', isNational: true },
    { date: '2026-08-11', nameKey: 'holiday_mountain_day', isNational: true },
    { date: '2026-09-21', nameKey: 'holiday_respect_for_the_aged', isNational: true },
    { date: '2026-09-23', nameKey: 'holiday_autumnal_equinox', isNational: true },
    { date: '2026-11-03', nameKey: 'holiday_culture_day', isNational: true },
    { date: '2026-11-23', nameKey: 'holiday_labor_thanksgiving', isNational: true },
  ],
  dataResidency: {
    dataRegion: 'asia-northeast1 (Tokyo primary)',
    applicableLaw: '個人情報保護法 (APPI — Act on the Protection of Personal Information)',
    legalBasis: '利用規約への同意および商取引の履行',
    retentionMonths: 84, // 7年間 (会社法・法人税法上の保存義務)
  },
  domain: 'smartrestaurant.jp',
  revenueModel: {
    platformCommissionBps: 1500, // 15%
    baseDeliveryFeeMinorUnits: 380, // JPY 380
  },
  ui: {
    showTipWidget: false,
    serviceIncludedNotice: false,
    addressInLocalOrder: true,
  },
};
