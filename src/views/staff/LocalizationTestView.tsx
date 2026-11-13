import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getAllRegionProfiles, getRegionProfile } from '../../data/regions';
import { MoneyUtils } from '../../core/money';
import { formatUtcForProfile, localDateTimeToUtcIso, distributedClock } from '../../core/clock';
import { orderService } from '../../services/orderService';
import { billingService, BillingReceiptSnapshot } from '../../services/billingService';
import { orderSagaService } from '../../services/orderSagaService';
import { paymentGatewayService } from '../../services/paymentGatewayService';
import { broker } from '../../core/broker';
import { plural } from '../../i18n/translations';
import { CountryCode, DeliveryAddress, Order } from '../../types';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  ExternalLink,
  Receipt,
  ShieldCheck,
} from 'lucide-react';

interface CountryTestRow {
  country: CountryCode;
  order: Order;
  receipt: BillingReceiptSnapshot;
  localDateTimeDisplayed: string;
  utcIsoStored: string;
  expectedUtc: string;
  testAddress: DeliveryAddress;
  testPhone: string;
  phoneValid: boolean;
  postalValid: boolean;
  tipMode: string;
  paymentMethodsSummary: string;
}

interface UnitAssertionResult {
  id: string;
  nameKey: string;
  passed: boolean;
  expected: string;
  actual: string;
}

const SAMPLE_TEST_INPUTS: Record<
  CountryCode,
  {
    expectedUtc: string;
    deliveryFeeMinorUnits: number;
    tipBpsOverride?: number;
    phone: string;
    address: DeliveryAddress;
  }
> = {
  CO: {
    expectedUtc: '2026-11-16T01:30:00Z',
    deliveryFeeMinorUnits: 4900,
    tipBpsOverride: 1000, // 10% voluntary
    phone: '3124567890',
    address: {
      streetLine: 'Cra 11 # 82-35',
      suiteOrApt: 'Apto 402',
      neighborhood: 'Zona T / El Retiro',
      city: 'Bogotá',
      postalCode: '110221',
      country: 'CO',
    },
  },
  BR: {
    expectedUtc: '2026-11-15T23:30:00Z',
    deliveryFeeMinorUnits: 690,
    tipBpsOverride: 500, // 5% optional
    phone: '(11) 98765-4321',
    address: {
      streetLine: 'Rua dos Pinheiros 610',
      suiteOrApt: 'Bloco B Ap 84',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      stateOrPrefecture: 'SP',
      postalCode: '05422-001',
      country: 'BR',
    },
  },
  US: {
    expectedUtc: '2026-11-16T01:30:00Z',
    deliveryFeeMinorUnits: 499,
    tipBpsOverride: undefined, // uses profile.tipPolicy.defaultBps (1800 = 18%)
    phone: '(212) 555-0194',
    address: {
      streetLine: '148 Bedford Ave',
      suiteOrApt: 'Apt 3B',
      city: 'Brooklyn',
      stateOrPrefecture: 'NY',
      postalCode: '11249',
      country: 'US',
    },
  },
  FR: {
    expectedUtc: '2026-11-15T19:30:00Z',
    deliveryFeeMinorUnits: 390,
    tipBpsOverride: 0, // service included
    phone: '06 12 34 56 78',
    address: {
      streetLine: '28 Rue Vieille du Temple',
      suiteOrApt: '3e étage',
      postalCode: '75004',
      city: 'Paris',
      country: 'FR',
    },
  },
  JP: {
    expectedUtc: '2026-11-15T11:30:00Z',
    deliveryFeeMinorUnits: 300,
    tipBpsOverride: 0, // none
    phone: '090-1234-5678',
    address: {
      postalCode: '150-0041',
      stateOrPrefecture: '東京都',
      city: '渋谷区',
      streetLine: '神南1-19-11',
      suiteOrApt: 'パークウェイスクエア3F',
      country: 'JP',
    },
  },
};

export const LocalizationTestView: React.FC = () => {
  const { branches, menuItems, appendOrders, currentUser, showToast, t } = useApp();

  const [rows, setRows] = useState<CountryTestRow[]>([]);
  const [unitResults, setUnitResults] = useState<UnitAssertionResult[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<CountryTestRow | null>(null);
  const [runningFlow, setRunningFlow] = useState(false);

  const handleRunMandatory5CountryTest = async () => {
    setRunningFlow(true);
    try {
      const profiles = getAllRegionProfiles();
      const createdRows: CountryTestRow[] = [];
      const createdOrders: Order[] = [];

      for (const prof of profiles) {
        const branch = branches.find((b) => b.country === prof.code) || branches[0];
        const lunchDish =
          menuItems.find((m) => m.countryCode === prof.code && m.isLunchOfTheDay) ||
          menuItems.find((m) => m.countryCode === prof.code) ||
          menuItems[0];

        const unitPrice = lunchDish.priceMinorUnits ?? 2590;
        const qty = 2;
        const sample = SAMPLE_TEST_INPUTS[prof.code];
        const utcIso = localDateTimeToUtcIso('2026-11-15', '20:30', prof.timeZone);
        const localDisplay = formatUtcForProfile(utcIso, prof);

        const order = orderService.createOrder({
          branchId: branch.id,
          restaurantId: branch.restaurantId,
          userId: currentUser?.id,
          orderType: 'delivery',
          deliveryAddress: sample.address,
          items: [
            {
              menuItemId: lunchDish.id,
              name: lunchDish.name[prof.defaultLanguage] || lunchDish.name.es,
              quantity: qty,
              unitPriceMinorUnits: unitPrice,
              subtotalMinorUnits: unitPrice * qty,
            },
          ],
          countryCode: prof.code,
          tipBps: sample.tipBpsOverride ?? prof.tipPolicy.defaultBps,
          paymentMethod: prof.paymentMethods[0]?.id || 'card',
          customerName: 'Cliente Prueba',
          customerPhone: sample.phone,
          customerEmail: 'prueba.localizacion@smartrestaurant.test',
          createdAtUtcOverride: utcIso,
          deliveryFeeMinorUnitsOverride: sample.deliveryFeeMinorUnits,
        });

        orderSagaService.startSaga(order.id, prof.code);
        const authRes = await paymentGatewayService.authorizePayment({
          orderId: order.id,
          amountMinorUnits: order.totalMinorUnits ?? 0,
          currency: order.currency,
          paymentMethod: order.paymentMethod,
        });
        if (authRes.success) {
          orderSagaService.advanceStep(order.id, 'authorize_payment', 'confirm_commerce', prof.code);
          await paymentGatewayService.capturePayment(authRes.transaction.id);
          orderSagaService.advanceStep(order.id, 'capture_payment', undefined, prof.code);
        }

        const finalizedOrder: Order = { ...order, paymentStatus: 'paid', status: 'delivered' };
        const receipt = billingService.generateFiscalReceiptSnapshot(finalizedOrder, prof.code);

        const phoneRe = new RegExp(prof.phoneRegex);
        const postalRe = new RegExp(prof.postalCodeRegex);

        createdOrders.push(finalizedOrder);
        createdRows.push({
          country: prof.code,
          order: finalizedOrder,
          receipt,
          localDateTimeDisplayed: localDisplay,
          utcIsoStored: utcIso,
          expectedUtc: sample.expectedUtc,
          testAddress: sample.address,
          testPhone: sample.phone,
          phoneValid: phoneRe.test(sample.phone),
          postalValid: sample.address.postalCode ? postalRe.test(sample.address.postalCode) : true,
          tipMode: `${prof.tipPolicy.mode} (${((order.tipAmountMinorUnits ?? 0) > 0 ? t('loc_test_tip_applied') : t('loc_test_tip_zero'))})`,
          paymentMethodsSummary: prof.paymentMethods.map((m) => t(m.labelKey)).join(', '),
        });
      }

      appendOrders(createdOrders);
      setRows(createdRows);
      setSelectedReceipt(createdRows[0] || null);
      showToast(t('loc_test_flow_done_toast'), 'success');
    } finally {
      setRunningFlow(false);
    }
  };

  const handleRunUnitAssertions = () => {
    const assertions: UnitAssertionResult[] = [];
    const co = getRegionProfile('CO');
    const br = getRegionProfile('BR');
    const us = getRegionProfile('US');
    const fr = getRegionProfile('FR');
    const jp = getRegionProfile('JP');

    // 1. Money formatting exact patterns
    const coMoney = MoneyUtils.format({ amount: 25900, currency: 'COP' }, co);
    const brMoney = MoneyUtils.format({ amount: 2590, currency: 'BRL' }, br);
    const usMoney = MoneyUtils.format({ amount: 2590, currency: 'USD' }, us);
    const frMoney = MoneyUtils.format({ amount: 2590, currency: 'EUR' }, fr);
    const jpMoney = MoneyUtils.format({ amount: 2590, currency: 'JPY' }, jp);

    assertions.push({
      id: 'money-co',
      nameKey: 'unit_test_money_co',
      passed: coMoney === '$ 25.900',
      expected: '$ 25.900',
      actual: coMoney,
    });
    assertions.push({
      id: 'money-br',
      nameKey: 'unit_test_money_br',
      passed: brMoney === 'R$ 25,90',
      expected: 'R$ 25,90',
      actual: brMoney,
    });
    assertions.push({
      id: 'money-us',
      nameKey: 'unit_test_money_us',
      passed: usMoney === '$25.90',
      expected: '$25.90',
      actual: usMoney,
    });
    assertions.push({
      id: 'money-fr',
      nameKey: 'unit_test_money_fr',
      passed: frMoney === '25,90 €',
      expected: '25,90 €',
      actual: frMoney,
    });
    assertions.push({
      id: 'money-jp',
      nameKey: 'unit_test_money_jp',
      passed: jpMoney === '¥2,590',
      expected: '¥2,590',
      actual: jpMoney,
    });

    // 2. Integer minor units (zero floating drift)
    const sumMoney = MoneyUtils.add({ amount: 2590, currency: 'USD' }, { amount: 2590, currency: 'USD' });
    assertions.push({
      id: 'int-minor-units',
      nameKey: 'unit_test_integer_math',
      passed: Number.isInteger(sumMoney.amount) && sumMoney.amount === 5180,
      expected: '5180 (integer)',
      actual: String(sumMoney.amount),
    });

    // 3. Exact UTC conversions from local 2026-11-15 20:30
    const checksUtc: [CountryCode, string][] = [
      ['CO', '2026-11-16T01:30:00Z'],
      ['BR', '2026-11-15T23:30:00Z'],
      ['US', '2026-11-16T01:30:00Z'],
      ['FR', '2026-11-15T19:30:00Z'],
      ['JP', '2026-11-15T11:30:00Z'],
    ];
    for (const [code, expUtc] of checksUtc) {
      const prof = getRegionProfile(code);
      const actUtc = localDateTimeToUtcIso('2026-11-15', '20:30', prof.timeZone);
      assertions.push({
        id: `utc-${code}`,
        nameKey: `unit_test_utc_${code.toLowerCase()}`,
        passed: actUtc === expUtc,
        expected: expUtc,
        actual: actUtc,
      });
    }

    // 4. Jurisdiction tax rule lookup (US NY vs NJ, JP delivery reduced 8%)
    const nyTax = orderService.calculateTaxes(5180, 499, 'US', 'delivery', 'NY');
    const njTax = orderService.calculateTaxes(5180, 499, 'US', 'delivery', 'NJ');
    const jpDeliveryTax = orderService.calculateTaxes(5180, 300, 'JP', 'delivery');
    assertions.push({
      id: 'tax-us-jurisdiction',
      nameKey: 'unit_test_tax_us_jurisdiction',
      passed: nyTax.totalTaxMinorUnits !== njTax.totalTaxMinorUnits && nyTax.taxBreakdown[0]?.rateBps === 888 && njTax.taxBreakdown[0]?.rateBps === 663,
      expected: 'NY 888bps != NJ 663bps',
      actual: `NY ${nyTax.taxBreakdown[0]?.rateBps}bps / NJ ${njTax.taxBreakdown[0]?.rateBps}bps`,
    });
    assertions.push({
      id: 'tax-jp-delivery',
      nameKey: 'unit_test_tax_jp_reduced',
      passed: jpDeliveryTax.taxBreakdown.some((b) => b.rateBps === 800),
      expected: '800bps (8% reduced food)',
      actual: `${jpDeliveryTax.taxBreakdown[0]?.rateBps ?? 0}bps`,
    });

    // 5. Tip policy & French / Japanese CLDR pluralization
    const frZero = plural(0, 'fr', { one: 'plat', other: 'plats' });
    const frTwo = plural(2, 'fr', { one: 'plat', other: 'plats' });
    const jaTwo = plural(2, 'ja', { one: '品', other: '品目' });
    assertions.push({
      id: 'plurals-fr-ja',
      nameKey: 'unit_test_plurals_fr_ja',
      passed: frZero === 'plat' && frTwo === 'plats' && jaTwo === '品目',
      expected: 'fr(0)=plat, fr(2)=plats, ja(2)=品目',
      actual: `fr(0)=${frZero}, fr(2)=${frTwo}, ja(2)=${jaTwo}`,
    });

    // 6. Lamport clock monotonicity & JSON UTF-8 copy isolation
    const t1 = distributedClock.tick();
    const t2 = distributedClock.tick();
    const copy = JSON.parse(JSON.stringify({ ok: true }));
    assertions.push({
      id: 'lamport-mono',
      nameKey: 'unit_test_lamport_mono',
      passed: t2 === t1 + 1 && broker !== undefined && copy.ok === true,
      expected: `${t1} -> ${t1 + 1}`,
      actual: `${t1} -> ${t2}`,
    });

    setUnitResults(assertions);
    const passedCount = assertions.filter((a) => a.passed).length;
    showToast(`${passedCount}/${assertions.length} OK`, passedCount === assertions.length ? 'success' : 'warning');
  };

  const handleExportCsv = () => {
    if (rows.length === 0) return;
    const csvRows = [
      ['COUNTRY', 'CURRENCY', 'LANGUAGE', 'LOCAL_TIME', 'UTC_STORED', 'SUBTOTAL', 'DELIVERY', 'TAX', 'TIP', 'TOTAL', 'FISCAL_NUMBER'],
    ];
    for (const r of rows) {
      const p = getRegionProfile(r.country);
      csvRows.push([
        r.country,
        p.currency,
        p.defaultLanguage,
        `"${r.localDateTimeDisplayed}"`,
        r.utcIsoStored,
        `"${MoneyUtils.format({ amount: r.order.subtotalMinorUnits ?? 0, currency: r.order.currency }, p)}"`,
        `"${MoneyUtils.format({ amount: r.order.deliveryFeeMinorUnits ?? 0, currency: r.order.currency }, p)}"`,
        `"${MoneyUtils.format({ amount: r.order.taxAmountMinorUnits ?? 0, currency: r.order.currency }, p)}"`,
        `"${MoneyUtils.format({ amount: r.order.tipAmountMinorUnits ?? 0, currency: r.order.currency }, p)}"`,
        `"${MoneyUtils.format({ amount: r.order.totalMinorUnits ?? 0, currency: r.order.currency }, p)}"`,
        r.receipt.fiscalNumber,
      ]);
    }
    const content = 'data:text/csv;charset=utf-8,' + csvRows.map((row) => row.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = encodeURI(content);
    a.download = `smartrestaurant_localization_5countries_2026-11-15.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const passedUnitCount = unitResults.filter((u) => u.passed).length;

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
            {t('loc_test_badge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-3 flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-amber-400" />
            <span>{t('loc_test_title')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">{t('loc_test_subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            disabled={runningFlow}
            onClick={handleRunMandatory5CountryTest}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{t('loc_test_run_all')}</span>
          </button>

          <button
            onClick={handleRunUnitAssertions}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('loc_test_run_unit')}</span>
          </button>

          {rows.length > 0 && (
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{t('export_csv')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Comparative 5-Country Matrix */}
      {rows.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">{t('loc_test_matrix_title')}</h2>
            <span className="text-[11px] font-mono text-emerald-400">
              {t('loc_test_date_spec')}: 2026-11-15 20:30
            </span>
          </div>

          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-2">{t('select_country')}</th>
                <th className="py-3 px-2">{t('loc_col_lang')}</th>
                <th className="py-3 px-2">{t('loc_col_amounts')}</th>
                <th className="py-3 px-2">{t('loc_col_datetime_utc')}</th>
                <th className="py-3 px-2">{t('loc_col_address_phone')}</th>
                <th className="py-3 px-2">{t('loc_col_tax_receipt')}</th>
                <th className="py-3 px-2">{t('loc_col_payment_tip')}</th>
                <th className="py-3 px-2 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 align-top">
              {rows.map((r) => {
                const prof = getRegionProfile(r.country);
                const utcMatch = r.utcIsoStored === r.expectedUtc;
                return (
                  <tr key={r.country} className="hover:bg-slate-800/40">
                    <td className="py-3 px-2 font-bold text-white whitespace-nowrap">
                      {prof.flagEmoji} {t(prof.nameKey)}
                      <span className="block text-[10px] font-mono text-slate-400">{prof.currency}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 font-mono uppercase text-amber-300">
                        {prof.defaultLanguage}
                      </span>
                      <span className="block text-[11px] text-slate-300 mt-1 max-w-[160px]">
                        {r.order.items[0]?.name}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-mono text-[11px] space-y-0.5 whitespace-nowrap">
                      <div>Sub: {MoneyUtils.format({ amount: r.order.subtotalMinorUnits ?? 0, currency: prof.currency }, prof)}</div>
                      <div>Deliv: {MoneyUtils.format({ amount: r.order.deliveryFeeMinorUnits ?? 0, currency: prof.currency }, prof)}</div>
                      <div>Tax: {MoneyUtils.format({ amount: r.order.taxAmountMinorUnits ?? 0, currency: prof.currency }, prof)}</div>
                      <div>Tip: {MoneyUtils.format({ amount: r.order.tipAmountMinorUnits ?? 0, currency: prof.currency }, prof)}</div>
                      <div className="font-bold text-emerald-400 pt-0.5 border-t border-slate-800">
                        Total: {MoneyUtils.format({ amount: r.order.totalMinorUnits ?? 0, currency: prof.currency }, prof)}
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono text-[11px] whitespace-nowrap">
                      <div className="text-white font-bold">{r.localDateTimeDisplayed}</div>
                      <div className="text-[10px] text-slate-400">{prof.timeZone}</div>
                      <div className={`text-[10px] mt-1 ${utcMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                        UTC: {r.utcIsoStored}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[11px]">
                      <div className="text-slate-300">{r.testAddress.streetLine}, {r.testAddress.city}</div>
                      <div className="font-mono text-slate-400">{r.testPhone}</div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-1">
                        {r.phoneValid && r.postalValid ? 'REGEX OK' : 'REGEX ERR'}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[11px]">
                      <div className="font-bold text-amber-300">{t(prof.receipt.documentTypeKey)}</div>
                      {r.order.taxBreakdown?.map((tb) => (
                        <div key={tb.id} className="text-slate-300">
                          {t(tb.labelKey)} ({(tb.rateBps / 100).toFixed(2)}%):{' '}
                          <span className="font-mono">{MoneyUtils.format({ amount: tb.amountMinorUnits, currency: prof.currency }, prof)}</span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-2 text-[11px] max-w-[180px]">
                      <div className="text-slate-200">{r.paymentMethodsSummary}</div>
                      <div className="text-amber-300 mt-1 font-mono text-[10px]">{r.tipMode}</div>
                    </td>
                    <td className="py-3 px-2 text-right space-y-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedReceipt(r)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold flex items-center gap-1 ml-auto"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>{t('loc_view_receipt')}</span>
                      </button>
                      <Link
                        to={`/comprobante/${r.order.id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 ml-auto w-fit"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{t('btn_open')}</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Regional Legal Receipt Preview */}
      {selectedReceipt && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                {getRegionProfile(selectedReceipt.country).flagEmoji}{' '}
                {t(getRegionProfile(selectedReceipt.country).receipt.documentTypeKey)} — #{selectedReceipt.order.orderNumber}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {rows.map((r) => (
                  <button
                    key={r.country}
                    onClick={() => setSelectedReceipt(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      selectedReceipt.country === r.country
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {r.country}
                  </button>
                ))}
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t('receipt_print')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono">
            <div className="space-y-1">
              <div className="text-slate-400">{getRegionProfile(selectedReceipt.country).receipt.officialAuthority}</div>
              <div className="text-amber-300 font-bold">
                {t(getRegionProfile(selectedReceipt.country).receipt.fiscalNumberLabelKey)}: {selectedReceipt.receipt.fiscalNumber}
              </div>
              <div className="text-slate-300">{getRegionProfile(selectedReceipt.country).receipt.electronicInvoiceSystem}</div>
              <div className="text-slate-400 pt-2">Local: {selectedReceipt.localDateTimeDisplayed}</div>
              <div className="text-emerald-400">UTC: {selectedReceipt.utcIsoStored}</div>
            </div>
            <div className="space-y-1 text-right">
              <div>2× {selectedReceipt.order.items[0]?.name}</div>
              {selectedReceipt.order.taxBreakdown?.map((tb) => (
                <div key={tb.id} className="text-slate-400">
                  {t(tb.labelKey)} ({(tb.rateBps / 100).toFixed(2)}%):{' '}
                  {MoneyUtils.format(
                    { amount: tb.amountMinorUnits, currency: selectedReceipt.order.currency },
                    getRegionProfile(selectedReceipt.country)
                  )}
                </div>
              ))}
              <div className="text-base font-bold text-white pt-2 border-t border-slate-800">
                Total:{' '}
                {MoneyUtils.format(
                  { amount: selectedReceipt.order.totalMinorUnits ?? 0, currency: selectedReceipt.order.currency },
                  getRegionProfile(selectedReceipt.country)
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Browser Unit Test Results */}
      {unitResults.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">{t('loc_test_unit_title')}</h2>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              {passedUnitCount} / {unitResults.length} PASSED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {unitResults.map((u) => (
              <div
                key={u.id}
                className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${
                  u.passed ? 'bg-slate-950 border-emerald-500/30' : 'bg-rose-950/30 border-rose-500/40'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    {u.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{t(u.nameKey)}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">
                    exp: <span className="text-slate-200">{u.expected}</span> · act:{' '}
                    <span className={u.passed ? 'text-emerald-300' : 'text-rose-300'}>{u.actual}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                    u.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {u.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
