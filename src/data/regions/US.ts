import { RegionProfile } from '../../types';

export const US_PROFILE: RegionProfile = {
  code: 'US',
  nameKey: 'country_us',
  nativeName: 'United States',
  pilotCity: 'New York',
  pilotCityKey: 'city_new_york',
  flagEmoji: '🇺🇸',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es', 'pt', 'fr', 'ja'],
  currency: 'USD',
  currencySymbol: '$',
  symbolPosition: 'before',
  symbolSpacing: false, // "$25.90"
  fractionDigits: 2,
  thousandSeparator: ',',
  decimalSeparator: '.',
  dateFormatPattern: 'mm/dd/aaaa',
  clockFormat: '12h',
  timeZone: 'America/New_York',
  hasDaylightSaving: true,
  firstDayOfWeek: 0, // Sunday
  measurementSystem: 'imperial',
  distanceUnit: 'mi',
  phonePrefix: '+1',
  phoneFormatPlaceholder: '(212) 555-0199',
  phoneRegex: '^\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$',
  postalCodeMask: 'NNNNN',
  postalCodeRegex: '^\\d{5}(-\\d{4})?$',
  nameOrder: 'given_family',
  addressFields: [
    { key: 'streetLine', labelKey: 'field_address_street', required: true, placeholderKey: 'placeholder_address_us' },
    { key: 'suiteOrApt', labelKey: 'field_address_apt', required: false, placeholderKey: 'placeholder_apt' },
    { key: 'city', labelKey: 'field_address_city', required: true, placeholderKey: 'placeholder_city' },
    { key: 'stateOrPrefecture', labelKey: 'field_address_state', required: true, placeholderKey: 'placeholder_state_us' },
    { key: 'postalCode', labelKey: 'field_address_zip', required: true, placeholderKey: 'placeholder_zip' },
  ],
  taxRules: [
    {
      id: 'us-nyc-sales-tax',
      appliesTo: 'prepared_food',
      orderType: '*',
      jurisdiction: 'NY',
      rateBps: 888, // 8.875% (~888 bps)
      labelKey: 'tax_nyc_sales_tax',
      source: 'https://www.tax.ny.gov/bus/st/rates.htm',
      verifiedAt: '2026-01-10',
    },
    {
      id: 'us-nj-sales-tax',
      appliesTo: 'prepared_food',
      orderType: 'delivery',
      jurisdiction: 'NJ',
      rateBps: 663, // 6.625% (~663 bps)
      labelKey: 'tax_nj_sales_tax',
      source: 'https://www.state.nj.us/treasury/taxation/ratehist.shtml',
      verifiedAt: '2026-01-10',
    },
  ],
  tipPolicy: {
    mode: 'prompted',
    suggestionsBps: [1500, 1800, 2000, 2500],
    defaultBps: 1800, // 18% default
    showWidget: true,
  },
  receipt: {
    documentTypeKey: 'receipt_sales_receipt',
    officialAuthority: 'Internal Revenue Service & NY State Dept. of Taxation and Finance',
    fiscalNumberLabelKey: 'fiscal_id_ein',
    requiresFiscalIdOnReceipt: true,
    electronicInvoiceSystem: 'Itemized Digital Sales Receipt & POS Audit Trail',
    footerLegalTextKey: 'receipt_legal_us',
  },
  paymentMethods: [
    { id: 'card', labelKey: 'payment_card', iconName: 'CreditCard', kind: 'card', isElectronic: true },
    { id: 'apple_pay', labelKey: 'payment_apple_pay', iconName: 'Smartphone', kind: 'wallet', isElectronic: true },
    { id: 'google_pay', labelKey: 'payment_google_pay', iconName: 'Smartphone', kind: 'wallet', isElectronic: true },
    { id: 'cash', labelKey: 'payment_cash', iconName: 'Banknote', kind: 'cash', isElectronic: false },
  ],
  holidays: [
    { date: '2026-01-01', nameKey: 'holiday_new_year', isNational: true },
    { date: '2026-01-19', nameKey: 'holiday_mlk_day', isNational: true },
    { date: '2026-02-16', nameKey: 'holiday_presidents_day', isNational: true },
    { date: '2026-05-25', nameKey: 'holiday_memorial_day', isNational: true },
    { date: '2026-06-19', nameKey: 'holiday_juneteenth', isNational: true },
    { date: '2026-07-04', nameKey: 'holiday_independence_us', isNational: true },
    { date: '2026-09-07', nameKey: 'holiday_labor_day_us', isNational: true },
    { date: '2026-11-26', nameKey: 'holiday_thanksgiving', isNational: true },
    { date: '2026-12-25', nameKey: 'holiday_christmas', isNational: true },
  ],
  dataResidency: {
    dataRegion: 'us-east1 (N. Virginia / New York edge)',
    applicableLaw: 'Federal Trade Commission Act & NY SHIELD Act / CCPA/CPRA Interoperability',
    legalBasis: 'Contractual performance, commercial terms, and express customer consent',
    retentionMonths: 84,
  },
  domain: 'smartrestaurant.com',
  revenueModel: {
    platformCommissionBps: 1500, // 15%
    baseDeliveryFeeMinorUnits: 299, // USD 2.99
  },
  ui: {
    showTipWidget: true,
    serviceIncludedNotice: false,
    addressInLocalOrder: true,
  },
};
