import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getRegionProfile } from '../../data/regions';
import { MoneyUtils } from '../../core/money';
import { orderService } from '../../services/orderService';
import { MenuItem, OrderItem } from '../../types';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import {
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  X,
  BellRing,
  ArrowLeft,
} from 'lucide-react';

export const TableQrMenuPage: React.FC = () => {
  const { branchId, tableId } = useParams<{ branchId: string; tableId: string }>();
  const navigate = useNavigate();

  const {
    country,
    restaurants,
    branches,
    tables,
    menuItems,
    createOrder,
    callWaiter,
    formatPrice,
    showToast,
    currentUser,
    getBranchDisplayName,
    loc,
    t,
  } = useApp();

  const currentBranch = branches.find((b) => b.id === branchId) || branches[0];
  const currentRestaurant = currentBranch
    ? restaurants.find((r) => r.id === currentBranch.restaurantId)
    : restaurants[0];
  const currentTable = tables.find((tItem) => tItem.id === tableId) || tables[0];

  const branchCountry = currentBranch?.country || country;
  const branchProfile = getRegionProfile(branchCountry);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [tipBps, setTipBps] = useState<number>(branchProfile.tipPolicy.defaultBps);
  const [customerName] = useState<string>(currentUser?.name || t('guest_diner'));
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    branchProfile.paymentMethods[0]?.id || 'card'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);

  const branchMenuItems = menuItems.filter((item) => {
    if (item.restaurantId && item.restaurantId !== currentRestaurant?.id) return false;
    if (item.countryCode && item.countryCode !== branchCountry) return false;
    return true;
  });

  const displayedItems = branchMenuItems.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    return true;
  });

  const subtotalMinorUnits = cart.reduce(
    (sum, item) => sum + (item.subtotalMinorUnits ?? 0),
    0
  );

  const { taxBreakdown, totalTaxMinorUnits } = orderService.calculateTaxes(
    subtotalMinorUnits,
    0,
    branchCountry,
    'dine_in'
  );

  const tipAmountMinorUnits = branchProfile.tipPolicy.showWidget
    ? orderService.calculateTip(subtotalMinorUnits, tipBps)
    : 0;

  const totalMinorUnits = subtotalMinorUnits + totalTaxMinorUnits + tipAmountMinorUnits;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const resolveItemMinorUnits = (item: MenuItem): number => {
    if (item.pricesByCountry && item.pricesByCountry[branchCountry] !== undefined) {
      return item.pricesByCountry[branchCountry]!;
    }
    if (item.priceMinorUnits !== undefined) {
      return item.priceMinorUnits;
    }
    if (item.price !== undefined) {
      return Math.round(item.price);
    }
    return 1500;
  };

  const handleAddToCart = (item: MenuItem) => {
    if (!item.available) {
      showToast(t('qr_item_sold_out_toast'), 'warning');
      return;
    }

    const itemName = loc(item.name);
    const unitMinor = resolveItemMinorUnits(item);

    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItemId === item.id);
      if (existing) {
        const nextQty = existing.quantity + 1;
        const unit = existing.unitPriceMinorUnits ?? unitMinor;
        return prev.map((ci) =>
          ci.menuItemId === item.id
            ? {
                ...ci,
                quantity: nextQty,
                unitPriceMinorUnits: unit,
                subtotalMinorUnits: unit * nextQty,
              }
            : ci
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: itemName,
          quantity: 1,
          unitPriceMinorUnits: unitMinor,
          subtotalMinorUnits: unitMinor,
        },
      ];
    });

    showToast(t('cart_added_toast'), 'success');
  };

  const handleUpdateQuantity = (menuItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.menuItemId === menuItemId) {
            const newQty = ci.quantity + delta;
            const unit = ci.unitPriceMinorUnits ?? 0;
            return {
              ...ci,
              quantity: newQty,
              subtotalMinorUnits: unit * newQty,
            };
          }
          return ci;
        })
        .filter((ci) => ci.quantity > 0);
    });
  };

  const handleCallWaiter = () => {
    setIsCallingWaiter(true);
    callWaiter(currentTable.id, t('qr_call_waiter_reason'));
    setTimeout(() => {
      setIsCallingWaiter(false);
    }, 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast(t('qr_empty_order_toast'), 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder = await createOrder(
        currentTable.id,
        cart,
        Math.round(tipBps / 100),
        customerName,
        orderNotes
      );

      showToast(t('qr_order_sent_toast', { order: newOrder.orderNumber }), 'success');
      setCart([]);
      setIsCartOpen(false);
      navigate(`/pedido/${newOrder.id}`);
    } catch {
      showToast(t('checkout_err_generic'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { id: string; labelKey: string }[] = [
    { id: 'all', labelKey: 'all_categories' },
    { id: 'starters', labelKey: 'cat_starters' },
    { id: 'mains', labelKey: 'cat_mains' },
    { id: 'desserts', labelKey: 'cat_desserts' },
    { id: 'drinks', labelKey: 'cat_drinks' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF6EC] pb-24 font-sans text-[#1F1A17]">
      <header className="sticky top-0 z-30 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E9DFCC] shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-1.5 rounded-xl hover:bg-[#FBF6EC] text-[#7A6E65] transition-colors"
              title={t('back')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-[#1F1A17]">
                  {currentRestaurant?.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8A33D]/20 text-[#C8452C] font-mono font-bold">
                  {branchProfile.flagEmoji} {branchProfile.currency}
                </span>
              </div>
              <p className="text-[11px] text-[#7A6E65]">
                {currentBranch ? getBranchDisplayName(currentBranch) : ''} ·{' '}
                <strong className="text-[#1F1A17]">
                  {t('table_label')} #{currentTable?.number}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCallWaiter}
              disabled={isCallingWaiter || currentTable?.activeCallWaiter}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                currentTable?.activeCallWaiter
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                  : 'bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] border border-[#E9DFCC]'
              }`}
            >
              <BellRing
                className={`w-3.5 h-3.5 ${
                  currentTable?.activeCallWaiter ? 'text-amber-600' : 'text-[#C8452C]'
                }`}
              />
              <span className="hidden sm:inline">
                {currentTable?.activeCallWaiter ? t('qr_waiter_coming') : t('call_waiter')}
              </span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 hover:opacity-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{t('qr_order_btn')}</span>
              {totalCartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#C8452C] font-mono font-bold text-[10px] flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-[#FFFDF8] rounded-3xl p-5 border border-[#E9DFCC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8452C]">
              {t('qr_table_badge')}
            </span>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#1F1A17]">
              {t('qr_welcome_table', { table: currentTable?.number ?? 1 })}
            </h1>
            <p className="text-xs text-[#7A6E65]">{t('qr_welcome_desc')}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#7A6E65] block uppercase">
                {t('qr_local_tax_label')}
              </span>
              <span className="font-mono font-bold text-xs text-[#C8452C]">
                {branchProfile.taxRules[0]
                  ? `${t(branchProfile.taxRules[0].labelKey)} (${(
                      branchProfile.taxRules[0].rateBps / 100
                    ).toFixed(1)}%)`
                  : branchProfile.currency}
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#E8A33D]/20 flex items-center justify-center text-[#C8452C] font-bold">
              #{currentTable?.number}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1F1A17] text-white shadow-xs'
                  : 'bg-[#FFFDF8] border border-[#E9DFCC] text-[#7A6E65] hover:text-[#1F1A17]'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedItems.map((item) => {
            const itemName = loc(item.name);
            const itemDesc = loc(item.description);
            const inCart = cart.find((ci) => ci.menuItemId === item.id);

            return (
              <div
                key={item.id}
                className="bg-[#FFFDF8] rounded-2xl overflow-hidden border border-[#E9DFCC] p-4 flex gap-4 shadow-xs hover:shadow-md transition-shadow justify-between"
              >
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-sm text-[#1F1A17] leading-snug">
                        {itemName}
                      </h3>
                      {item.popular && (
                        <span className="bg-[#C8452C]/10 text-[#C8452C] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0">
                          {t('popular_tag')}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7A6E65] line-clamp-2 mt-1 leading-relaxed">
                      {itemDesc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono font-bold text-sm text-[#C8452C]">
                      {formatPrice(item, branchCountry)}
                    </span>

                    {item.available ? (
                      inCart ? (
                        <div className="flex items-center gap-2 bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-2 py-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="text-[#7A6E65] hover:text-[#C8452C] p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs px-1 text-[#1F1A17]">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="text-[#7A6E65] hover:text-[#C8452C] p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="py-1.5 px-3 rounded-xl bg-[#FBF6EC] hover:bg-[#E8A33D]/20 text-[#1F1A17] text-xs font-bold border border-[#E9DFCC] transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#C8452C]" />
                          <span>{t('add_to_cart')}</span>
                        </button>
                      )
                    ) : (
                      <span className="text-[10px] text-rose-600 font-mono font-bold">
                        {t('sold_out')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-[#E9DFCC]">
                  <ImageWithFallback
                    src={item.image}
                    alt={itemName}
                    fallbackEmoji={item.fallbackEmoji || '🍲'}
                    fallbackGradient={item.fallbackGradient}
                    fallbackTitle={itemName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#1F1A17] to-[#332B25] text-white flex items-center justify-between shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C8452C] flex items-center justify-center font-mono font-bold text-xs">
                {totalCartCount}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block">{t('qr_view_order_btn')}</span>
                <span className="text-[10px] text-[#E9DFCC]/70">
                  {t('table_label')} #{currentTable?.number}
                </span>
              </div>
            </div>

            <span className="font-mono font-bold text-sm text-[#E8A33D]">
              {MoneyUtils.format(
                { amount: totalMinorUnits, currency: branchProfile.currency },
                branchProfile
              )}
            </span>
          </button>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col border border-[#E9DFCC] shadow-2xl">
            <div className="p-5 border-b border-[#E9DFCC] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1A17]">
                  {t('qr_table_order_title', { table: currentTable?.number ?? 1 })}
                </h3>
                <p className="text-[11px] text-[#7A6E65]">
                  {currentRestaurant?.name} ·{' '}
                  {currentBranch ? getBranchDisplayName(currentBranch) : ''}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-xl hover:bg-[#FBF6EC] text-[#7A6E65]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#7A6E65]">
                  {t('cart_empty')}
                </div>
              ) : (
                <div className="divide-y divide-[#E9DFCC]/60">
                  {cart.map((item) => (
                    <div
                      key={item.menuItemId}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <h4 className="font-serif font-bold text-xs text-[#1F1A17]">
                          {item.name}
                        </h4>
                        <span className="text-[11px] font-mono text-[#7A6E65]">
                          {MoneyUtils.format(
                            {
                              amount: item.unitPriceMinorUnits ?? 0,
                              currency: branchProfile.currency,
                            },
                            branchProfile
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-2 py-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.menuItemId, -1)}
                            className="text-[#7A6E65] hover:text-[#C8452C] p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.menuItemId, 1)}
                            className="text-[#7A6E65] hover:text-[#C8452C] p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-xs text-[#1F1A17] w-20 text-right">
                          {MoneyUtils.format(
                            {
                              amount: item.subtotalMinorUnits ?? 0,
                              currency: branchProfile.currency,
                            },
                            branchProfile
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  {t('kitchen_notes_label')}
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={t('kitchen_notes_placeholder')}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-medium text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                />
              </div>

              {branchProfile.tipPolicy.showWidget && (
                <div className="pt-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1.5">
                    {t('tip_label')}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {branchProfile.tipPolicy.suggestionsBps.map((bps) => (
                      <button
                        key={bps}
                        type="button"
                        onClick={() => setTipBps(bps)}
                        className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          tipBps === bps
                            ? 'bg-[#1F1A17] text-white shadow-xs'
                            : 'bg-[#FBF6EC] border border-[#E9DFCC] text-[#7A6E65] hover:text-[#1F1A17]'
                        }`}
                      >
                        {bps === 0 ? '0%' : `${bps / 100}%`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65]">
                    {t('payment_method_label')}
                  </label>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {t('demo_payment_badge')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {branchProfile.paymentMethods.slice(0, 4).map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(pm.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        selectedPaymentMethod === pm.id
                          ? 'bg-[#FBF6EC] border-[#C8452C] text-[#C8452C]'
                          : 'border-[#E9DFCC] text-[#7A6E65]'
                      }`}
                    >
                      {t(pm.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E9DFCC] space-y-1.5 text-xs text-[#7A6E65]">
                <div className="flex justify-between">
                  <span>{t('subtotal')}:</span>
                  <span className="font-mono text-[#1F1A17]">
                    {MoneyUtils.format(
                      { amount: subtotalMinorUnits, currency: branchProfile.currency },
                      branchProfile
                    )}
                  </span>
                </div>
                {taxBreakdown.map((tb, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {t(tb.labelKey)} ({(tb.rateBps / 100).toFixed(1)}%):
                    </span>
                    <span className="font-mono text-[#1F1A17]">
                      {MoneyUtils.format(
                        { amount: tb.amountMinorUnits, currency: branchProfile.currency },
                        branchProfile
                      )}
                    </span>
                  </div>
                ))}
                {tipAmountMinorUnits > 0 && (
                  <div className="flex justify-between">
                    <span>{t('tip_label')}:</span>
                    <span className="font-mono text-[#1F1A17]">
                      {MoneyUtils.format(
                        { amount: tipAmountMinorUnits, currency: branchProfile.currency },
                        branchProfile
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#E9DFCC] text-sm font-bold text-[#1F1A17]">
                  <span>{t('total_to_pay')}:</span>
                  <span className="font-mono text-base text-[#C8452C]">
                    {MoneyUtils.format(
                      { amount: totalMinorUnits, currency: branchProfile.currency },
                      branchProfile
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#E9DFCC] bg-[#FFFDF8]">
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#C8452C]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>
                  {isSubmitting ? t('checkout_processing') : t('qr_confirm_send_btn')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
