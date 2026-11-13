import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  getAllRegionProfiles,
  getRegionProfile,
  updateStoredRegionProfile,
  resetStoredRegionProfiles,
} from '../../data/regions';
import { fxService, FxRateSnapshot } from '../../services/fxService';
import { broker } from '../../core/broker';
import { MoneyUtils } from '../../core/money';
import { CountryCode, Holiday, PaymentMethodConfig, RegionProfile, TaxRule, TipPolicy } from '../../types';
import {
  Globe,
  Percent,
  Activity,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CreditCard,
  Calendar,
  DollarSign,
  FlaskConical,
  AlertTriangle,
} from 'lucide-react';

export const PlatformSystemConsoleView: React.FC = () => {
  const { resetToFactoryDefaults, showToast, t } = useApp();

  const [selectedCode, setSelectedCode] = useState<CountryCode>('CO');
  const [activeTab, setActiveTab] = useState<'profile' | 'revenue'>('profile');
  const [draftProfile, setDraftProfile] = useState<RegionProfile>(() => getRegionProfile('CO'));
  const [fxSnapshot, setFxSnapshot] = useState<FxRateSnapshot>(() => fxService.getSnapshot());
  const [newHolidayDate, setNewHolidayDate] = useState('2026-12-31');
  const [newHolidayKey, setNewHolidayKey] = useState('holiday_new_year');
  const [newMethodNameKey, setNewMethodNameKey] = useState('payment_card');
  const [newMethodId, setNewMethodId] = useState('');

  const allProfiles = getAllRegionProfiles();

  const handleSelectCountry = (code: CountryCode) => {
    setSelectedCode(code);
    setDraftProfile(getRegionProfile(code));
  };

  const handleSaveProfile = () => {
    updateStoredRegionProfile(selectedCode, draftProfile);
    broker.publish({
      sourceService: 'auth-service',
      type: 'REGION_PROFILE_UPDATED',
      region: selectedCode,
      targetServices: ['order-service', 'billing-service', 'analytics-service'],
      payload: {
        country: selectedCode,
        taxRulesCount: draftProfile.taxRules.length,
        tipMode: draftProfile.tipPolicy.mode,
        commissionBps: draftProfile.revenueModel.platformCommissionBps,
      },
    });
    showToast(t('sys_profile_saved_toast', { country: selectedCode }), 'success');
  };

  const handleResetProfiles = () => {
    resetStoredRegionProfiles();
    setDraftProfile(getRegionProfile(selectedCode));
    showToast(t('sys_profiles_reset_toast'), 'info');
  };

  const handleUpdateTaxRatePercent = (ruleId: string, pctValue: string) => {
    const num = Number(pctValue);
    if (Number.isNaN(num) || num < 0 || num > 100) return;
    const bps = Math.round(num * 100);
    setDraftProfile((prev) => ({
      ...prev,
      taxRules: prev.taxRules.map((r) => (r.id === ruleId ? { ...r, rateBps: bps } : r)),
    }));
  };

  const handleAddTaxRule = () => {
    const newRule: TaxRule = {
      id: `${selectedCode.toLowerCase()}-custom-${Date.now().toString(36)}`,
      appliesTo: 'prepared_food',
      orderType: 'delivery',
      jurisdiction: 'Custom',
      rateBps: 500,
      labelKey: 'tax_custom_rule',
      source: 'Platform Console Override',
      verifiedAt: new Date().toISOString().split('T')[0],
    };
    setDraftProfile((prev) => ({
      ...prev,
      taxRules: [...prev.taxRules, newRule],
    }));
  };

  const handleRemoveTaxRule = (ruleId: string) => {
    setDraftProfile((prev) => ({
      ...prev,
      taxRules: prev.taxRules.filter((r) => r.id !== ruleId),
    }));
  };

  const handleAddPaymentMethod = () => {
    const cleanId = newMethodId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') || `pay_${Date.now().toString(36)}`;
    const method: PaymentMethodConfig = {
      id: cleanId,
      labelKey: newMethodNameKey,
      iconName: 'CreditCard',
      kind: 'wallet',
      isElectronic: true,
    };
    setDraftProfile((prev) => ({
      ...prev,
      paymentMethods: [...prev.paymentMethods, method],
    }));
    setNewMethodId('');
  };

  const handleRemovePaymentMethod = (methodId: string) => {
    setDraftProfile((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((m) => m.id !== methodId),
    }));
  };

  const handleAddHoliday = () => {
    if (!newHolidayDate) return;
    const holiday: Holiday = {
      date: newHolidayDate,
      nameKey: newHolidayKey,
      isNational: true,
    };
    setDraftProfile((prev) => ({
      ...prev,
      holidays: [...prev.holidays, holiday],
    }));
  };

  const handleRemoveHoliday = (idx: number) => {
    setDraftProfile((prev) => ({
      ...prev,
      holidays: prev.holidays.filter((_, i) => i !== idx),
    }));
  };

  const handleRevenueChange = (
    code: CountryCode,
    field: 'platformCommissionBps' | 'baseDeliveryFeeMinorUnits' | 'sponsoredListingFeeMinorUnits',
    value: number
  ) => {
    if (Number.isNaN(value) || value < 0) return;
    const updated = updateStoredRegionProfile(code, (cur) => ({
      ...cur,
      revenueModel: {
        ...cur.revenueModel,
        [field]: Math.round(value),
      },
    }));
    if (code === selectedCode) {
      setDraftProfile(updated);
    }
  };

  const handleFxRateChange = (currency: string, val: string) => {
    const num = Number(val);
    if (Number.isNaN(num) || num <= 0) return;
    const updated = fxService.updateRates({ [currency]: num } as Partial<FxRateSnapshot['ratesPerUsd']>);
    setFxSnapshot(updated);
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
            {t('sys_badge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-3">
            {t('sys_title')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{t('sys_subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/staff/app/monitor"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>{t('sys_open_monitor_btn')}</span>
          </Link>
          <Link
            to="/staff/app/prueba-localizacion"
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
          >
            <FlaskConical className="w-4 h-4" />
            <span>{t('staff_nav_loc_test')}</span>
          </Link>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-1 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'profile' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{t('sys_tab_profiles')}</span>
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`pb-1 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'revenue' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{t('sys_tab_revenue_fx')}</span>
          </button>
        </div>

        <button
          onClick={resetToFactoryDefaults}
          className="px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-bold flex items-center gap-1.5"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{t('btn_reset_factory')}</span>
        </button>
      </div>

      {/* TAB 1: REGIONAL PROFILE & TAX / TIP / PAYMENT / HOLIDAY EDITOR */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Country Picker */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex flex-wrap gap-2">
              {allProfiles.map((p) => (
                <button
                  key={p.code}
                  onClick={() => handleSelectCountry(p.code)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                    selectedCode === p.code
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{p.flagEmoji}</span>
                  <span>{t(p.nameKey)} ({p.currency})</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetProfiles}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('sys_reset_profiles_btn')}</span>
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{t('btn_save')}</span>
              </button>
            </div>
          </div>

          {/* Formatting & Timezone Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{t('sys_formats_section')}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">{t('sys_field_timezone')}</label>
                <input
                  type="text"
                  value={draftProfile.timeZone}
                  onChange={(e) => setDraftProfile({ ...draftProfile, timeZone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{t('sys_field_date_pattern')}</label>
                <select
                  value={draftProfile.dateFormatPattern}
                  onChange={(e) =>
                    setDraftProfile({
                      ...draftProfile,
                      dateFormatPattern: e.target.value as RegionProfile['dateFormatPattern'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                >
                  <option value="dd/mm/aaaa">dd/mm/aaaa</option>
                  <option value="mm/dd/aaaa">mm/dd/aaaa</option>
                  <option value="aaaa/mm/dd">aaaa/mm/dd</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{t('sys_field_clock_format')}</label>
                <select
                  value={draftProfile.clockFormat}
                  onChange={(e) =>
                    setDraftProfile({
                      ...draftProfile,
                      clockFormat: e.target.value as RegionProfile['clockFormat'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                >
                  <option value="12h">12h</option>
                  <option value="24h">24h</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{t('sys_field_symbol_spacing')}</label>
                <button
                  type="button"
                  onClick={() => setDraftProfile({ ...draftProfile, symbolSpacing: !draftProfile.symbolSpacing })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono text-left"
                >
                  {draftProfile.symbolSpacing ? 'YES' : 'NO'} —{' '}
                  {MoneyUtils.format(
                    { amount: draftProfile.fractionDigits === 0 ? 25900 : 2590, currency: draftProfile.currency },
                    draftProfile
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tax Rules Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Percent className="w-4 h-4 text-amber-400" />
                  <span>{t('sys_tax_rules_section')}</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{t('sys_tax_live_hint')}</p>
              </div>
              <button
                onClick={handleAddTaxRule}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('sys_add_tax_rule')}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {draftProfile.taxRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs"
                >
                  <div className="md:col-span-3">
                    <span className="font-bold text-white block">{t(rule.labelKey)}</span>
                    <span className="text-[10px] font-mono text-slate-500">{rule.id}</span>
                  </div>
                  <div className="md:col-span-2">
                    <select
                      value={rule.appliesTo}
                      onChange={(e) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          taxRules: prev.taxRules.map((r) =>
                            r.id === rule.id ? { ...r, appliesTo: e.target.value as TaxRule['appliesTo'] } : r
                          ),
                        }))
                      }
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    >
                      <option value="prepared_food">prepared_food</option>
                      <option value="delivery_fee">delivery_fee</option>
                      <option value="packaged_food">packaged_food</option>
                      <option value="alcohol">alcohol</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <select
                      value={rule.orderType}
                      onChange={(e) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          taxRules: prev.taxRules.map((r) =>
                            r.id === rule.id ? { ...r, orderType: e.target.value as TaxRule['orderType'] } : r
                          ),
                        }))
                      }
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    >
                      <option value="*">*</option>
                      <option value="delivery">delivery</option>
                      <option value="dine_in">dine_in</option>
                      <option value="takeaway">takeaway</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={rule.jurisdiction || ''}
                      placeholder="Jurisdiction"
                      onChange={(e) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          taxRules: prev.taxRules.map((r) =>
                            r.id === rule.id ? { ...r, jurisdiction: e.target.value } : r
                          ),
                        }))
                      }
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-[11px]"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={(rule.rateBps / 100).toFixed(2)}
                      onChange={(e) => handleUpdateTaxRatePercent(rule.id, e.target.value)}
                      className="w-20 px-2 py-1.5 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 font-mono font-bold text-right"
                    />
                    <span className="text-slate-400 font-mono">%</span>
                  </div>
                  <div className="md:col-span-1 text-right">
                    <button
                      onClick={() => handleRemoveTaxRule(rule.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tip Policy + Payment Methods + Holidays */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tip Policy */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white">{t('sys_tip_policy_section')}</h3>
              <div>
                <label className="text-slate-400 block mb-1">{t('sys_tip_mode_label')}</label>
                <select
                  value={draftProfile.tipPolicy.mode}
                  onChange={(e) =>
                    setDraftProfile((prev) => ({
                      ...prev,
                      tipPolicy: { ...prev.tipPolicy, mode: e.target.value as TipPolicy['mode'] },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                >
                  <option value="voluntary">voluntary</option>
                  <option value="optional">optional</option>
                  <option value="prompted">prompted</option>
                  <option value="included">included</option>
                  <option value="none">none</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{t('sys_tip_default_pct')}</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={draftProfile.tipPolicy.defaultBps / 100}
                  onChange={(e) =>
                    setDraftProfile((prev) => ({
                      ...prev,
                      tipPolicy: { ...prev.tipPolicy, defaultBps: Math.round(Number(e.target.value) * 100) },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono"
                />
              </div>
              <label className="flex items-center gap-2 pt-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={draftProfile.tipPolicy.showWidget}
                  onChange={(e) =>
                    setDraftProfile((prev) => ({
                      ...prev,
                      tipPolicy: { ...prev.tipPolicy, showWidget: e.target.checked },
                      ui: { ...prev.ui, showTipWidget: e.target.checked },
                    }))
                  }
                />
                <span>{t('sys_tip_show_widget')}</span>
              </label>
            </div>

            {/* Payment Methods */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>{t('sys_payments_section')}</span>
              </h3>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {draftProfile.paymentMethods.map((pm) => (
                  <div key={pm.id} className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span>{t(pm.labelKey)} ({pm.id})</span>
                    <button onClick={() => handleRemovePaymentMethod(pm.id)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newMethodId}
                  onChange={(e) => setNewMethodId(e.target.value)}
                  placeholder="id (e.g. wallet)"
                  className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
                <select
                  value={newMethodNameKey}
                  onChange={(e) => setNewMethodNameKey(e.target.value)}
                  className="px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="payment_card">{t('payment_card')}</option>
                  <option value="payment_pse">{t('payment_pse')}</option>
                  <option value="payment_nequi">{t('payment_nequi')}</option>
                  <option value="payment_pix">{t('payment_pix')}</option>
                  <option value="payment_paypay">{t('payment_paypay')}</option>
                  <option value="payment_sepa">{t('payment_sepa')}</option>
                </select>
                <button
                  onClick={handleAddPaymentMethod}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Holidays */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{t('sys_holidays_section')} ({draftProfile.holidays.length})</span>
              </h3>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {draftProfile.holidays.map((h, i) => (
                  <div key={`${h.date}-${i}`} className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="font-mono text-amber-300 mr-2">{h.date}</span>
                      <span className="text-slate-300">{t(h.nameKey)}</span>
                    </div>
                    <button onClick={() => handleRemoveHoliday(i)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <input
                  type="date"
                  value={newHolidayDate}
                  onChange={(e) => setNewHolidayDate(e.target.value)}
                  className="px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
                <input
                  type="text"
                  value={newHolidayKey}
                  onChange={(e) => setNewHolidayKey(e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
                <button
                  onClick={handleAddHoliday}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REVENUE MODEL & FX RATES ACROSS ALL 5 CURRENCIES */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">{t('sys_commission_card_title')}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t('sys_commission_card_desc')}</p>
            </div>

            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-3">{t('select_country')}</th>
                  <th className="py-3 px-3">{t('sys_col_commission_pct')}</th>
                  <th className="py-3 px-3">{t('sys_col_delivery_fee')}</th>
                  <th className="py-3 px-3">{t('sys_col_ads_fee')}</th>
                  <th className="py-3 px-3">{t('plat_col_fx_rate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {allProfiles.map((p) => {
                  const sponsoredMinor = p.revenueModel.sponsoredListingFeeMinorUnits ?? 0;
                  const fxVal = fxSnapshot.ratesPerUsd[p.currency] || 1;
                  return (
                    <tr key={p.code} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-bold text-white">
                        {p.flagEmoji} {t(p.nameKey)} ({p.currency})
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="50"
                            value={(p.revenueModel.platformCommissionBps / 100).toFixed(1)}
                            onChange={(e) =>
                              handleRevenueChange(p.code, 'platformCommissionBps', Number(e.target.value) * 100)
                            }
                            className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-amber-300 font-mono text-right"
                          />
                          <span className="text-slate-400 font-mono">%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={p.revenueModel.baseDeliveryFeeMinorUnits}
                            onChange={(e) =>
                              handleRevenueChange(p.code, 'baseDeliveryFeeMinorUnits', Number(e.target.value))
                            }
                            className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-emerald-300 font-mono text-right"
                          />
                          <span className="text-[11px] font-mono text-slate-400">
                            {MoneyUtils.format({ amount: p.revenueModel.baseDeliveryFeeMinorUnits, currency: p.currency }, p)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={sponsoredMinor}
                            onChange={(e) =>
                              handleRevenueChange(p.code, 'sponsoredListingFeeMinorUnits', Number(e.target.value))
                            }
                            className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-sky-300 font-mono text-right"
                          />
                          <span className="text-[11px] font-mono text-slate-400">
                            {MoneyUtils.format({ amount: sponsoredMinor, currency: p.currency }, p)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-mono">1 USD =</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            disabled={p.currency === fxSnapshot.baseCurrency}
                            value={fxVal}
                            onChange={(e) => handleFxRateChange(p.currency, e.target.value)}
                            className="w-20 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-right disabled:opacity-50"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <span>{t('plat_fx_source_label')}: {fxSnapshot.sourceName}</span>
              <span>{t('plat_fx_updated_utc')}: {fxSnapshot.updatedAtUtc}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
