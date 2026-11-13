import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getRegionProfile } from '../../data/regions';
import { MoneyUtils } from '../../core/money';
import { isBranchOpenNow, estimateDeliveryMinutes, formatRegionalDistance } from '../../core/geo';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import { MenuCategory, MenuItem } from '../../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShoppingBag,
  Plus,
  Minus,
  Search,
  Sparkles,
  Flame,
  Star,
  AlertTriangle,
  QrCode,
} from 'lucide-react';

export const BranchDetailPage: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();
  const {
    branches,
    restaurants,
    menuItems,
    tables,
    reviews,
    deliveryCart,
    addToDeliveryCart,
    updateDeliveryCartQty,
    setActiveBranchId,
    getBranchDisplayName,
    getBranchCityName,
    formatPrice,
    loc,
    t,
  } = useApp();

  const branch = branches.find((b) => b.id === branchId) || branches[0];
  const restaurant =
    restaurants.find((r) => r.id === branch?.restaurantId) || restaurants[0];
  const branchProfile = getRegionProfile(branch.country);
  const openStatus = isBranchOpenNow(branch.openingHours, branchProfile);

  const [activeCategory, setActiveCategory] = useState<'all' | MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingConflictItem, setPendingConflictItem] = useState<MenuItem | null>(null);

  const branchTable =
    tables.find((tbl) => tbl.branchId === branch.id && tbl.status === 'available') ||
    tables.find((tbl) => tbl.branchId === branch.id);

  const branchMenuItems = menuItems.filter(
    (m) => m.restaurantId === branch.restaurantId && m.countryCode === branch.country
  );

  const lunchSpecial = branchMenuItems.find((m) => m.isLunchOfTheDay && m.available);

  const filteredItems = branchMenuItems.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const itemTitle = loc(item.name).toLowerCase();
      const itemDesc = loc(item.description).toLowerCase();
      if (!itemTitle.includes(q) && !itemDesc.includes(q)) return false;
    }
    return true;
  });

  const branchReviews = reviews.filter(
    (r) => r.branchId === branch.id && r.status === 'approved'
  );

  const cartItemCount =
    deliveryCart && deliveryCart.branchId === branch.id
      ? deliveryCart.items.reduce((sum, i) => sum + i.quantity, 0)
      : 0;
  const cartSubtotal =
    deliveryCart && deliveryCart.branchId === branch.id
      ? deliveryCart.items.reduce((sum, i) => sum + i.subtotalMinorUnits, 0)
      : 0;

  const baseDeliveryFeeFormatted = MoneyUtils.format(
    {
      amount: branchProfile.revenueModel.baseDeliveryFeeMinorUnits,
      currency: branchProfile.currency,
    },
    branchProfile
  );
  const estEta = estimateDeliveryMinutes(2.0, 20);

  const handleAdd = (item: MenuItem) => {
    if (!item.available) return;
    if (branch.id) {
      setActiveBranchId(branch.id);
    }
    const res = addToDeliveryCart(branch, item, 1, false);
    if (res.conflict) {
      setPendingConflictItem(item);
    }
  };

  const confirmReplaceCart = () => {
    if (!pendingConflictItem) return;
    addToDeliveryCart(branch, pendingConflictItem, 1, true);
    setPendingConflictItem(null);
  };

  const categories: { id: 'all' | MenuCategory; labelKey: string }[] = [
    { id: 'all', labelKey: 'all_categories' },
    { id: 'starters', labelKey: 'cat_starters' },
    { id: 'mains', labelKey: 'cat_mains' },
    { id: 'desserts', labelKey: 'cat_desserts' },
    { id: 'drinks', labelKey: 'cat_drinks' },
    { id: 'specials', labelKey: 'cat_specials' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF6EC] text-[#1F1A17] pb-24 font-sans">
      <div className="relative bg-[#1F1A17] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={branch.photo || branch.heroImage || restaurant.heroImage}
            alt={getBranchDisplayName(branch)}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A17] via-[#1F1A17]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-6">
          <Link
            to={`/restaurantes/${restaurant.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-[#E9DFCC] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{restaurant.name}</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono font-bold text-[#E8A33D]">
                  {branchProfile.flagEmoji} {branchProfile.currency}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    openStatus.isOpen
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                  }`}
                >
                  {openStatus.isOpen
                    ? t('branch_open_now')
                    : openStatus.holidayKey
                    ? t('branch_closed_holiday', { holiday: t(openStatus.holidayKey) })
                    : t('branch_closed_now')}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-[#E9DFCC]">
                  ~{estEta} {t('minutes')} · {t('delivery_fee')}: {baseDeliveryFeeFormatted}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                {restaurant.name} — {getBranchDisplayName(branch)}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#E9DFCC]/85">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E8A33D]" />
                  {branch.address}, {getBranchCityName(branch)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#E8A33D]" />
                  {branch.openingHours}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#E8A33D]" />
                  {branch.phone}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/reservar?restaurantId=${restaurant.id}&branchId=${branch.id}`}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/15"
              >
                <Calendar className="w-4 h-4 text-[#E8A33D]" />
                <span>{t('cta_reserve')}</span>
              </Link>
              {branchTable && (
                <Link
                  to={`/mesa/${branch.id}/${branchTable.id}`}
                  onClick={() => setActiveBranchId(branch.id)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/15"
                >
                  <QrCode className="w-4 h-4 text-[#E8A33D]" />
                  <span>{t('qr_code_menu')}</span>
                </Link>
              )}
              <Link
                to="/carrito"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] text-white text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {t('cart')} ({cartItemCount})
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {lunchSpecial && (
          <div className="bg-gradient-to-r from-[#FFFDF8] to-[#FBF6EC] rounded-3xl p-6 border-2 border-[#E8A33D]/60 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[#E9DFCC]">
                <ImageWithFallback
                  src={lunchSpecial.image}
                  alt={loc(lunchSpecial.name)}
                  fallbackEmoji={lunchSpecial.fallbackEmoji || '🍽️'}
                  fallbackGradient={lunchSpecial.fallbackGradient}
                  fallbackTitle={loc(lunchSpecial.name)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8452C]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('lunch_of_the_day')}</span>
                </div>
                <h2 className="font-serif font-bold text-lg text-[#1F1A17]">
                  {loc(lunchSpecial.name)}
                </h2>
                <p className="text-xs text-[#7A6E65] max-w-xl">
                  {loc(lunchSpecial.description)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="font-mono font-bold text-base text-[#C8452C]">
                {formatPrice(lunchSpecial, branch.country)}
              </span>
              <button
                onClick={() => handleAdd(lunchSpecial)}
                className="px-4 py-2.5 rounded-xl bg-[#C8452C] hover:bg-[#A83720] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t('add_to_cart')}</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#1F1A17] text-white'
                    : 'bg-[#FFFDF8] border border-[#E9DFCC] text-[#7A6E65] hover:text-[#1F1A17]'
                }`}
              >
                {t(cat.labelKey)}
              </button>
            ))}
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-[#7A6E65] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_product')}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFDF8] border border-[#E9DFCC] text-xs focus:outline-none focus:border-[#C8452C]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const itemName = loc(item.name);
            const itemDesc = loc(item.description);
            const inCartQty =
              deliveryCart?.branchId === branch.id
                ? deliveryCart.items.find((ci) => ci.menuItemId === item.id)?.quantity || 0
                : 0;

            return (
              <div
                key={item.id}
                className="bg-[#FFFDF8] rounded-3xl overflow-hidden border border-[#E9DFCC] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="h-44 relative overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={itemName}
                    fallbackEmoji={item.fallbackEmoji || '🍲'}
                    fallbackGradient={item.fallbackGradient}
                    fallbackTitle={itemName}
                    className="w-full h-full object-cover"
                  />
                  {item.popular && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#C8452C] text-white text-[10px] font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>{t('popular_tag')}</span>
                    </span>
                  )}
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold">
                        {t('sold_out')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-base text-[#1F1A17]">
                        {itemName}
                      </h3>
                      <span className="font-mono font-bold text-sm text-[#C8452C] shrink-0">
                        {formatPrice(item, branch.country)}
                      </span>
                    </div>
                    <p className="text-xs text-[#7A6E65] mt-1 line-clamp-2">
                      {itemDesc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E9DFCC]/60">
                    <span className="text-[11px] font-mono text-[#7A6E65]">
                      ~{item.prepTimeMinutes} {t('minutes')}
                    </span>

                    {!item.available ? (
                      <span className="text-xs font-bold text-rose-600">
                        {t('sold_out')}
                      </span>
                    ) : inCartQty > 0 ? (
                      <div className="flex items-center gap-2 bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateDeliveryCartQty(item.id, inCartQty - 1)}
                          className="p-1 text-[#7A6E65] hover:text-[#C8452C]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-xs px-1">
                          {inCartQty}
                        </span>
                        <button
                          onClick={() => updateDeliveryCartQty(item.id, inCartQty + 1)}
                          className="p-1 text-[#7A6E65] hover:text-[#C8452C]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAdd(item)}
                        className="px-3.5 py-2 rounded-xl bg-[#FBF6EC] hover:bg-[#E8A33D]/20 border border-[#E9DFCC] text-[#1F1A17] text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#C8452C]" />
                        <span>{t('add_to_cart')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {branchReviews.length > 0 && (
          <div className="pt-8 border-t border-[#E9DFCC] space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">
              {t('reviews_title')} ({branchReviews.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branchReviews.slice(0, 4).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#E9DFCC] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#1F1A17]">
                      {rev.customerName || rev.userName}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#E8A33D]">
                      <Star className="w-3.5 h-3.5 fill-[#E8A33D]" />
                      {rev.rating}
                    </span>
                  </div>
                  <p className="text-xs italic text-[#7A6E65]">"{loc(rev.comment)}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {cartItemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40">
          <button
            onClick={() => navigate('/carrito')}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#1F1A17] text-white flex items-center justify-between shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#C8452C] flex items-center justify-center font-mono font-bold text-xs">
                {cartItemCount}
              </span>
              <span className="text-xs font-bold">{t('cart_view_btn')}</span>
            </div>
            <span className="font-mono font-bold text-sm text-[#E8A33D]">
              {MoneyUtils.format(
                { amount: cartSubtotal, currency: branchProfile.currency },
                branchProfile
              )}
            </span>
          </button>
        </div>
      )}

      {pendingConflictItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#FFFDF8] border border-[#E9DFCC] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#C8452C]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm">{t('cart_conflict_title')}</h3>
            </div>
            <p className="text-xs text-[#7A6E65] leading-relaxed">
              {t('cart_conflict_desc')}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingConflictItem(null)}
                className="px-4 py-2 rounded-xl bg-[#FBF6EC] text-[#7A6E65] text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                onClick={confirmReplaceCart}
                className="px-4 py-2 rounded-xl bg-[#C8452C] text-white text-xs font-bold"
              >
                {t('cart_replace_confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
