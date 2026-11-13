import { RegionProfile } from '../../types';

export const FR_PROFILE: RegionProfile = {
  code: 'FR',
  nameKey: 'country_fr',
  nativeName: 'France',
  pilotCity: 'Paris',
  pilotCityKey: 'city_paris',
  flagEmoji: '🇫🇷',
  defaultLanguage: 'fr',
  supportedLanguages: ['fr', 'en', 'es', 'pt', 'ja'],
  currency: 'EUR',
  currencySymbol: '€',
  symbolPosition: 'after',
  symbolSpacing: true, // "25,90 €"
  fractionDigits: 2,
  thousandSeparator: '\u202F', // narrow no-break space
  decimalSeparator: ',',
  dateFormatPattern: 'dd/mm/aaaa',
  clockFormat: '24h',
  timeZone: 'Europe/Paris',
  hasDaylightSaving: true,
  firstDayOfWeek: 1, // Monday
  measurementSystem: 'metric',
  distanceUnit: 'km',
  phonePrefix: '+33',
  phoneFormatPlaceholder: '06 12 34 56 78',
  phoneRegex: '^0[1-9](\\s?\\d{2}){4}$',
  postalCodeMask: 'NNNNN',
  postalCodeRegex: '^\\d{5}$',
  nameOrder: 'given_family',
  addressFields: [
    { key: 'streetLine', labelKey: 'field_address_street', required: true, placeholderKey: 'placeholder_address_fr' },
    { key: 'suiteOrApt', labelKey: 'field_address_apt', required: false, placeholderKey: 'placeholder_apt' },
    { key: 'postalCode', labelKey: 'field_address_postal_code', required: true, placeholderKey: 'placeholder_postal_fr' },
    { key: 'city', labelKey: 'field_address_city', required: true, placeholderKey: 'placeholder_city' },
  ],
  taxRules: [
    {
      id: 'fr-tva-prepared-food',
      appliesTo: 'prepared_food',
      orderType: '*',
      jurisdiction: 'National — République Française',
      rateBps: 1000, // 10% TVA restauration
      labelKey: 'tax_tva_10',
      source: 'https://www.impots.gouv.fr/professionnel/taux-de-tva-en-restauration',
      verifiedAt: '2026-01-18',
    },
    {
      id: 'fr-tva-packaged-food',
      appliesTo: 'packaged_food',
      orderType: 'takeaway',
      jurisdiction: 'National — République Française',
      rateBps: 550, // 5.5% TVA produits conditionnés
      labelKey: 'tax_tva_5_5',
      source: 'https://www.impots.gouv.fr/professionnel/taux-de-tva-en-restauration',
      verifiedAt: '2026-01-18',
    },
    {
      id: 'fr-tva-alcohol-delivery',
      appliesTo: 'delivery_fee',
      orderType: 'delivery',
      jurisdiction: 'National — République Française',
      rateBps: 2000, // 20% TVA livraison & alcools
      labelKey: 'tax_tva_20',
      source: 'https://www.impots.gouv.fr/professionnel/taux-de-tva-en-restauration',
      verifiedAt: '2026-01-18',
    },
  ],
  tipPolicy: {
    mode: 'included',
    suggestionsBps: [],
    defaultBps: 0,
    showWidget: false,
  },
  receipt: {
    documentTypeKey: 'receipt_ticket_de_caisse',
    officialAuthority: 'Direction Générale des Finances Publiques (DGFiP)',
    fiscalNumberLabelKey: 'fiscal_id_siret',
    requiresFiscalIdOnReceipt: true,
    electronicInvoiceSystem: 'Système NF525 & Ventilation TVA Factur-X',
    footerLegalTextKey: 'receipt_legal_fr',
  },
  paymentMethods: [
    { id: 'card', labelKey: 'payment_carte_bancaire', iconName: 'CreditCard', kind: 'card', isElectronic: true },
    { id: 'apple_pay', labelKey: 'payment_apple_pay', iconName: 'Smartphone', kind: 'wallet', isElectronic: true },
    { id: 'sepa', labelKey: 'payment_sepa', iconName: 'FileText', kind: 'bank_transfer', isElectronic: true },
    { id: 'cash', labelKey: 'payment_cash', iconName: 'Banknote', kind: 'cash', isElectronic: false },
  ],
  holidays: [
    { date: '2026-01-01', nameKey: 'holiday_new_year', isNational: true },
    { date: '2026-04-06', nameKey: 'holiday_easter_monday', isNational: true },
    { date: '2026-05-01', nameKey: 'holiday_labor_day', isNational: true },
    { date: '2026-05-08', nameKey: 'holiday_victory_1945', isNational: true },
    { date: '2026-05-14', nameKey: 'holiday_ascension', isNational: true },
    { date: '2026-05-25', nameKey: 'holiday_whit_monday', isNational: true },
    { date: '2026-07-14', nameKey: 'holiday_bastille_day', isNational: true },
    { date: '2026-08-15', nameKey: 'holiday_assumption', isNational: true },
    { date: '2026-11-01', nameKey: 'holiday_all_saints', isNational: true },
    { date: '2026-11-11', nameKey: 'holiday_armistice', isNational: true },
    { date: '2026-12-25', nameKey: 'holiday_christmas', isNational: true },
  ],
  dataResidency: {
    dataRegion: 'europe-west9 (Paris primary)',
    applicableLaw: 'RGPD — Règlement Général sur la Protection des Données (UE 2016/679) & Loi Informatique et Libertés',
    legalBasis: 'Exécution contractuelle et respect des obligations légales fiscales',
    retentionMonths: 120, // 10 ans comptabilité française
  },
  domain: 'smartrestaurant.fr',
  revenueModel: {
    platformCommissionBps: 1500, // 15%
    baseDeliveryFeeMinorUnits: 250, // EUR 2,50
  },
  ui: {
    showTipWidget: false,
    serviceIncludedNotice: true,
    addressInLocalOrder: true,
  },
};
