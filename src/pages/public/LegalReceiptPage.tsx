import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getRegionProfile } from '../../data/regions';
import { MoneyUtils, formatRegionalDate, formatRegionalTime } from '../../core/money';
import { Printer, ArrowLeft } from 'lucide-react';
import { COUNTRIES } from '../../i18n/countries';

export const LegalReceiptPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const {
    orders,
    branches,
    restaurants,
    country,
    getBranchDisplayName,
    getBranchCityName,
    t,
  } = useApp();

  const order = orders.find((o) => o.id === orderId) || orders[0];
  const branch = branches.find((b) => b.id === order?.branchId) || branches[0];
  const restaurant = restaurants.find((r) => r.id === order?.restaurantId) || restaurants[0];

  const profile = getRegionProfile(branch?.country || country);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FBF6EC] p-8 text-center font-sans">
        <h2 className="text-lg font-bold text-[#1F1A17]">{t('receipt_not_found')}</h2>
        <Link to="/" className="text-[#C8452C] font-semibold mt-2 inline-block text-xs">
          {t('back_to_home')}
        </Link>
      </div>
    );
  }

  const isZeroDecimal = profile.fractionDigits === 0;
  const divisor = isZeroDecimal ? 1 : Math.pow(10, profile.fractionDigits);

  const subtotalFormatted = MoneyUtils.format(
    {
      amount: order.subtotalMinorUnits ?? Math.round((order.subtotal || 0) * divisor),
      currency: order.currency,
    },
    profile
  );

  const deliveryFeeFormatted = MoneyUtils.format(
    { amount: order.deliveryFeeMinorUnits || 0, currency: order.currency },
    profile
  );

  const tipFormatted = MoneyUtils.format(
    { amount: order.tipAmountMinorUnits || 0, currency: order.currency },
    profile
  );

  const taxFormatted = MoneyUtils.format(
    { amount: order.taxAmountMinorUnits || 0, currency: order.currency },
    profile
  );

  const totalFormatted = MoneyUtils.format(
    {
      amount: order.totalMinorUnits ?? Math.round((order.total || 0) * divisor),
      currency: order.currency,
    },
    profile
  );

  const localDate = formatRegionalDate(order.createdAt, profile);
  const localTime = formatRegionalTime(order.createdAt, profile);
  const utcInstant = order.createdAt;

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between print:hidden">
          <Link
            to={`/pedido/${order.id}`}
            className="flex items-center gap-2 text-xs font-bold text-[#7A6E65] hover:text-[#1F1A17] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('receipt_back_tracker')}</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-bold shadow-md transition-colors"
          >
            <Printer className="w-4 h-4 text-[#E8A33D]" />
            <span>{t('receipt_print_pdf')}</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E9DFCC] shadow-xl text-[#1F1A17] space-y-6 print:p-0 print:border-none print:shadow-none">
          <div className="text-center border-b border-dashed border-[#E9DFCC] pb-6 space-y-1">
            <div className="inline-block px-3 py-1 rounded-full bg-[#FBF6EC] border border-[#E9DFCC] text-[11px] font-mono font-bold uppercase tracking-wider text-[#C8452C] mb-2">
              {t(profile.receipt.documentTypeKey)}
            </div>
            <h1 className="font-serif font-bold text-2xl text-[#1F1A17]">
              {restaurant.name}
            </h1>
            <p className="text-xs font-medium text-[#7A6E65]">
              {getBranchDisplayName(branch)} — {getBranchCityName(branch)},{' '}
              {COUNTRIES[branch.country]?.nativeName}
            </p>
            <p className="text-[11px] text-[#7A6E65]">
              {branch.address} • {branch.phone}
            </p>
            <p className="text-[11px] font-mono text-[#7A6E65]">
              {t(profile.receipt.fiscalNumberLabelKey)}: {profile.code}-830.124.992-1
            </p>
            <p className="text-[10px] text-[#7A6E65]">
              {t('receipt_tax_authority')}:{' '}
              <strong className="text-[#1F1A17]">{profile.receipt.officialAuthority}</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs border-b border-dashed border-[#E9DFCC] pb-4">
            <div>
              <span className="text-[10px] text-[#7A6E65] uppercase font-mono block">
                {t('receipt_document_number')}
              </span>
              <span className="font-mono font-bold text-sm text-[#C8452C]">
                {order.fiscalNumber || `FE-${order.orderNumber}`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#7A6E65] uppercase font-mono block">
                {t('receipt_order_ref')}
              </span>
              <span className="font-mono font-bold text-sm text-[#1F1A17]">
                #{order.orderNumber}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#7A6E65] uppercase font-mono block">
                {t('receipt_local_datetime')} ({profile.timeZone})
              </span>
              <span className="font-medium text-[#1F1A17]">
                {localDate} · {localTime}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#7A6E65] uppercase font-mono block">
                {t('payment_method_label')}
              </span>
              <span className="font-medium capitalize text-[#1F1A17]">
                {order.paymentMethod}
              </span>
            </div>

            {order.customerName && (
              <div className="col-span-2 pt-2 border-t border-[#E9DFCC]/50">
                <span className="text-[10px] text-[#7A6E65] uppercase font-mono block">
                  {t('receipt_customer_label')}
                </span>
                <span className="font-semibold text-[#1F1A17]">
                  {order.customerName} {order.customerPhone ? `(${order.customerPhone})` : ''}
                </span>
                {order.deliveryAddress && (
                  <p className="text-[11px] text-[#7A6E65]">
                    {order.deliveryAddress.streetLine}, {order.deliveryAddress.city}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7A6E65] block mb-2">
              {t('receipt_items_heading')}
            </span>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E9DFCC] text-[10px] text-[#7A6E65] uppercase font-mono">
                  <th className="py-2">{t('receipt_col_qty')}</th>
                  <th className="py-2">{t('receipt_col_desc')}</th>
                  <th className="py-2 text-right">{t('receipt_col_unit')}</th>
                  <th className="py-2 text-right">{t('subtotal')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9DFCC]/50">
                {order.items.map((item, idx) => {
                  const unitPrice =
                    item.unitPriceMinorUnits ??
                    (item.subtotalMinorUnits
                      ? Math.round(item.subtotalMinorUnits / item.quantity)
                      : 0);
                  const sub = item.subtotalMinorUnits ?? unitPrice * item.quantity;
                  return (
                    <tr key={idx}>
                      <td className="py-2 font-mono font-bold text-[#1F1A17]">
                        {item.quantity}×
                      </td>
                      <td className="py-2 font-medium text-[#1F1A17]">{item.name}</td>
                      <td className="py-2 text-right font-mono text-[#7A6E65]">
                        {MoneyUtils.format({ amount: unitPrice, currency: order.currency }, profile)}
                      </td>
                      <td className="py-2 text-right font-mono font-bold text-[#1F1A17]">
                        {MoneyUtils.format({ amount: sub, currency: order.currency }, profile)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#E9DFCC] pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#7A6E65]">
              <span>{t('subtotal')}:</span>
              <span className="font-mono font-medium text-[#1F1A17]">{subtotalFormatted}</span>
            </div>

            {order.deliveryFeeMinorUnits ? (
              <div className="flex justify-between text-[#7A6E65]">
                <span>{t('delivery_fee')}:</span>
                <span className="font-mono font-medium text-[#1F1A17]">
                  {deliveryFeeFormatted}
                </span>
              </div>
            ) : null}

            {order.taxBreakdown && order.taxBreakdown.length > 0 ? (
              order.taxBreakdown.map((tb, idx) => (
                <div key={idx} className="flex justify-between text-[#7A6E65]">
                  <span>
                    {t(tb.labelKey)} ({(tb.rateBps / 100).toFixed(1)}%):
                  </span>
                  <span className="font-mono font-medium text-[#1F1A17]">
                    {MoneyUtils.format(
                      { amount: tb.amountMinorUnits, currency: order.currency },
                      profile
                    )}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex justify-between text-[#7A6E65]">
                <span>{t('receipt_taxes_label')}:</span>
                <span className="font-mono font-medium text-[#1F1A17]">{taxFormatted}</span>
              </div>
            )}

            {order.tipAmountMinorUnits ? (
              <div className="flex justify-between text-[#7A6E65]">
                <span>{t('tip_label')}:</span>
                <span className="font-mono font-medium text-[#1F1A17]">{tipFormatted}</span>
              </div>
            ) : null}

            <div className="flex justify-between text-base font-bold text-[#1F1A17] pt-2 border-t border-[#E9DFCC]">
              <span>
                {t('total_to_pay')} ({order.currency}):
              </span>
              <span className="font-mono text-[#C8452C]">{totalFormatted}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-[#E9DFCC] pt-6 space-y-2 text-center text-[10px] text-[#7A6E65]">
            <p className="font-medium text-[#1F1A17]">
              {profile.receipt.electronicInvoiceSystem}
            </p>
            <p>{t(profile.receipt.footerLegalTextKey)}</p>
            <div className="p-2 bg-[#FBF6EC] rounded-xl font-mono text-[9px] text-[#7A6E65] space-y-0.5">
              <div>
                {t('receipt_fiscal_hash')}: SHA256:{order.id}-{order.createdAt.replace(/\D/g, '')}
              </div>
              <div>
                {t('receipt_utc_instant')}: <strong className="text-[#1F1A17]">{utcInstant}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
