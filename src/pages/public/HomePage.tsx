import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { generateQrSvgPath } from '../../core/qr';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import {
  haversineDistanceKm,
  formatRegionalDistance,
  estimateDeliveryMinutes,
  isBranchOpenNow,
} from '../../core/geo';
import { getRegionProfile } from '../../data/regions';
import { MoneyUtils } from '../../core/money';
import {
  Calendar,
  Clock,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  Star,
  MapPin,
  Utensils,
  Flame,
  Award,
  ChevronRight,
  Navigation,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    country,
    restaurants,
    branches,
    menuItems,
    orders,
    tables,
    reviews,
    formatPrice,
    activeBranchId,
    setActiveBranchId,
    getBranchDisplayName,
    getBranchCityName,
    loc,
    t,
  } = useApp();
  const navigate = useNavigate();

  const countryConfig = COUNTRIES[country];
  const activeProfile = getRegionProfile(country);

  const [guestCount, setGuestCount] = useState<number>(2);
  const [bookingDate, setBookingDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [bookingTime, setBookingTime] = useState<string>('20:00');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const countryDishes = menuItems
    .filter((m) => !m.countryCode || m.countryCode === country)
    .slice(0, 4);

  const totalTables = tables.length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const totalBranches = branches.length;
  const approvedReviews = reviews.filter((r) => r.status === 'approved').slice(0, 3);

  const countryBranches = branches.filter((b) => b.country === country);
  const referencePoint = userLocation || countryBranches[0]?.coordinates || { lat: 4.65, lng: -74.05 };

  const nearbyBranches = [...countryBranches]
    .map((b) => {
      const distKm = haversineDistanceKm(referencePoint, b.coordinates);
      return {
        branch: b,
        distKm,
        eta: estimateDeliveryMinutes(distKm, 20),
        openInfo: isBranchOpenNow(b.openingHours, activeProfile),
      };
    })
    .sort((a, b) => a.distKm - b.distKm);

  const activeTable =
    tables.find((tbl) => tbl.branchId === activeBranchId) || tables[0];

  const handleUseLocation = () => {
    const first = countryBranches[0]?.coordinates;
    if (first) {
      setUserLocation({
        lat: Number((first.lat + 0.008).toFixed(5)),
        lng: Number((first.lng - 0.006).toFixed(5)),
      });
    }
  };

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/reservar?guests=${guestCount}&date=${bookingDate}&time=${bookingTime}`);
  };

  const demoTableUrl = `${window.location.origin}/#/mesa/${activeBranchId}/${activeTable?.id || 'tbl-1'}`;
  const qrSvgPath = generateQrSvgPath(demoTableUrl, 29);

  return (
    <div className="min-h-screen bg-[#FBF6EC] text-[#1F1A17] font-sans">
      <section className="relative min-h-[560px] lg:min-h-[620px] flex items-center justify-center bg-[#1F1A17] text-white overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=80"
            alt={t('app_name')}
            className="w-full h-full object-cover opacity-35 filter saturate-120"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A17] via-[#1F1A17]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F1A17] via-[#1F1A17]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8A33D]/20 border border-[#E8A33D]/40 text-[#E8A33D] text-xs font-mono font-medium backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {countryConfig.flagEmoji} {t(countryConfig.profile.nameKey)} ({countryConfig.currency})
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFDF8] max-w-4xl mx-auto leading-[1.15]">
            {t('hero_title_1')} {t('hero_title_2')}{' '}
            <span className="italic font-normal text-[#E8A33D]">{t('hero_title_italic')}</span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#E9DFCC]/90 max-w-2xl mx-auto font-light leading-relaxed">
            {t('hero_subtitle')}
          </p>

          <div className="mt-8 max-w-3xl mx-auto bg-[#FFFDF8] rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#E9DFCC] text-[#1F1A17]">
            <form onSubmit={handleQuickBook} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
              <div>
                <label className="text-[10px] font-bold text-[#7A6E65] uppercase tracking-wider block mb-1">
                  {t('quick_search_guests')}
                </label>
                <div className="relative">
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C] appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? t('guest_singular') : t('guest_plural')}
                      </option>
                    ))}
                  </select>
                  <Users className="w-3.5 h-3.5 text-[#7A6E65] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#7A6E65] uppercase tracking-wider block mb-1">
                  {t('quick_search_date')}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                  />
                  <Calendar className="w-3.5 h-3.5 text-[#7A6E65] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#7A6E65] uppercase tracking-wider block mb-1">
                  {t('quick_search_time')}
                </label>
                <div className="relative">
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C] appearance-none"
                  >
                    {['12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <Clock className="w-3.5 h-3.5 text-[#7A6E65] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[38px] bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#C8452C]/20"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{t('quick_search_button')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* PROXIMITY DELIVERY SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
              {t(activeProfile.pilotCityKey)}
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F1A17]">
              {t('home_nearby_title')}
            </h2>
          </div>

          <button
            onClick={handleUseLocation}
            className="px-4 py-2.5 rounded-xl bg-[#FFFDF8] hover:bg-[#E8A33D]/20 border border-[#E9DFCC] text-xs font-bold text-[#1F1A17] flex items-center gap-2 self-start sm:self-auto"
          >
            <Navigation className="w-4 h-4 text-[#C8452C]" />
            <span>{t('use_my_location')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {nearbyBranches.map(({ branch, distKm, eta, openInfo }) => {
            const brand = restaurants.find((r) => r.id === branch.restaurantId);
            const fee = MoneyUtils.format(
              {
                amount: activeProfile.revenueModel.baseDeliveryFeeMinorUnits,
                currency: activeProfile.currency,
              },
              activeProfile
            );
            return (
              <Link
                key={branch.id}
                to={`/sucursal/${branch.id}`}
                onClick={() => setActiveBranchId(branch.id)}
                className="bg-[#FFFDF8] rounded-3xl overflow-hidden border border-[#E9DFCC] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="h-36 relative overflow-hidden">
                  <ImageWithFallback
                    src={branch.photo || branch.heroImage || brand?.heroImage || ''}
                    alt={getBranchDisplayName(branch)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackEmoji="🍽️"
                    fallbackTitle={getBranchDisplayName(branch)}
                  />
                  <span
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      openInfo.isOpen
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {openInfo.isOpen ? t('branch_open_now') : t('branch_closed_now')}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-[10px] font-mono uppercase font-bold text-[#C8452C]">
                    {brand?.name}
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1F1A17] truncate">
                    {getBranchDisplayName(branch)}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-[#7A6E65] pt-2 border-t border-[#E9DFCC]/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C8452C]" />
                      {formatRegionalDistance(distKm, activeProfile)}
                    </span>
                    <span className="font-mono font-bold text-[#1F1A17]">
                      ~{eta} {t('minutes')}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#7A6E65]">
                    {t('delivery_fee')}: <strong className="text-[#1F1A17]">{fee}</strong>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 2 MULTINATIONAL BRANDS */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A33D]/20 text-[#C8452C] text-xs font-mono font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{t('multinational_brands')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1A17]">
            {t('featured_restaurants')}
          </h2>
          <p className="text-xs text-[#7A6E65] leading-relaxed">
            {t('home_brands_sub', { branches: totalBranches })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {restaurants.map((brand) => {
            const brandBranches = branches.filter((b) => b.restaurantId === brand.id);
            const operatingCountries =
              brand.operatingCountries ||
              Array.from(new Set(brandBranches.map((b) => b.country)));

            return (
              <div
                key={brand.id}
                className="bg-[#FFFDF8] rounded-3xl overflow-hidden border border-[#E9DFCC] shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={brand.heroImage}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    fallbackEmoji="🍷"
                    fallbackTitle={brand.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A17] via-[#1F1A17]/40 to-transparent" />

                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="bg-[#1F1A17]/85 text-[#E8A33D] px-3 py-1 rounded-full text-xs font-mono font-bold border border-[#E8A33D]/30">
                      {loc(brand.cuisine)}
                    </span>
                    <span className="bg-white/90 text-[#1F1A17] px-3 py-1 rounded-full text-xs font-mono font-bold">
                      {brand.priceRange}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 bg-[#FFFDF8]/95 text-[#1F1A17] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#E8A33D] text-[#E8A33D]" />
                    <span>{brand.rating}</span>
                    <span className="text-[10px] text-[#7A6E65]">({brand.reviewCount})</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                      {brand.name}
                    </h3>
                    <p className="font-serif italic text-xs sm:text-sm text-[#E9DFCC]/90">
                      "{loc(brand.tagline)}"
                    </p>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <p className="text-xs text-[#7A6E65] leading-relaxed line-clamp-3">
                    {loc(brand.description)}
                  </p>

                  <div className="space-y-3 pt-3 border-t border-[#E9DFCC]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[#C8452C] uppercase text-[10px]">
                        {t('presence_global')}
                      </span>
                      <span className="font-mono text-[#7A6E65] text-[11px]">
                        {brandBranches.length} {t('branch_plural')}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {operatingCountries.map((cCode) => {
                        const c = COUNTRIES[cCode];
                        return (
                          <div
                            key={cCode}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FBF6EC] border border-[#E9DFCC] text-xs"
                          >
                            <span>{c.flagEmoji}</span>
                            <span className="font-medium text-[#1F1A17]">
                              {t(c.profile.nameKey)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <Link
                      to={`/restaurantes/${brand.id}`}
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{t('view_details')}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E8A33D]" />
                    </Link>

                    <Link
                      to={`/reservar?restaurantId=${brand.id}`}
                      className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold text-center shadow-md shadow-[#C8452C]/20"
                    >
                      {t('cta_reserve')}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR DISHES */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
            {t('popular_dishes')}
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1F1A17]">
            {t('popular_dishes_title')} ({t(countryConfig.profile.nameKey)})
          </h2>
          <p className="text-xs text-[#7A6E65]">{t('popular_dishes_sub')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {countryDishes.map((dish) => {
            const dishName = loc(dish.name);
            const dishDesc = loc(dish.description);
            const targetBranchId = dish.branchId || activeBranchId;

            return (
              <div
                key={dish.id}
                className="bg-[#FFFDF8] rounded-2xl overflow-hidden border border-[#E9DFCC] shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div className="h-44 overflow-hidden relative">
                  <ImageWithFallback
                    src={dish.image}
                    alt={dishName}
                    fallbackEmoji={dish.fallbackEmoji || '🍲'}
                    fallbackGradient={dish.fallbackGradient}
                    fallbackTitle={dishName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {dish.popular && (
                    <div className="absolute top-2 left-2 bg-[#C8452C] text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>{t('popular_tag')}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="font-serif font-bold text-sm text-[#1F1A17]">
                        {dishName}
                      </h4>
                      <span className="font-mono font-bold text-xs text-[#C8452C] whitespace-nowrap">
                        {formatPrice(dish)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A6E65] line-clamp-2 leading-relaxed">
                      {dishDesc}
                    </p>
                  </div>

                  <Link
                    to={`/sucursal/${targetBranchId}`}
                    className="w-full py-1.5 px-3 rounded-xl bg-[#FBF6EC] hover:bg-[#E8A33D]/20 text-[#1F1A17] text-[11px] font-bold text-center border border-[#E9DFCC] transition-colors block"
                  >
                    {t('view_menu')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#1F1A17] text-white py-12 px-4 sm:px-6 lg:px-8 my-12 border-y border-[#332B25]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center font-mono">
          <div className="space-y-1">
            <span className="text-3xl lg:text-4xl font-bold text-[#E8A33D]">{totalTables}</span>
            <p className="text-xs text-[#E9DFCC]/80 font-sans">{t('home_stat_tables')}</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl lg:text-4xl font-bold text-[#E8A33D]">{completedOrders}+</span>
            <p className="text-xs text-[#E9DFCC]/80 font-sans">{t('stat_orders_served')}</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl lg:text-4xl font-bold text-[#E8A33D]">{totalBranches}</span>
            <p className="text-xs text-[#E9DFCC]/80 font-sans">{t('stat_branches')}</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl lg:text-4xl font-bold text-[#E8A33D]">5</span>
            <p className="text-xs text-[#E9DFCC]/80 font-sans">{t('all_countries_count')}</p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
              {t('reviews_title')}
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F1A17]">
              {t('reviews_sub')}
            </h2>
          </div>

          <Link
            to="/resenas"
            className="text-xs font-bold text-[#C8452C] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{t('guest_reviews_link')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'fill-[#E8A33D] text-[#E8A33D]' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[#1F1A17] italic leading-relaxed font-serif text-sm">
                  "{loc(rev.comment)}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#E9DFCC] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1F1A17]">
                  {rev.customerName || rev.userName}
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                  {t('review_verified')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QR TABLE EXPERIENCE */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border-2 border-[#E8A33D] shadow-xl flex flex-col sm:flex-row items-center gap-8">
          <div className="p-4 bg-white rounded-2xl border border-[#E9DFCC] shadow-inner shrink-0">
            <svg viewBox="0 0 29 29" className="w-40 h-40">
              <path d={qrSvgPath} fill="#1F1A17" />
            </svg>
            <div className="text-center mt-2 text-[10px] font-mono font-bold text-[#7A6E65]">
              {t('table_label')} #{activeTable?.number || 1} · {getBranchCityName(branches.find((b) => b.id === activeBranchId))}
            </div>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-[#E8A33D]/20 text-[#C8452C] text-xs font-mono font-bold">
              {t('qr_code_menu')}
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1F1A17]">
              {t('demo_qr_title')}
            </h3>
            <p className="text-xs text-[#7A6E65] leading-relaxed">
              {t('demo_qr_desc')}
            </p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <Link
                to={`/mesa/${activeBranchId}/${activeTable?.id || 'tbl-1'}`}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 flex items-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>{t('demo_qr_button')}</span>
              </Link>
              <Link
                to="/reservar"
                className="py-2.5 px-5 rounded-xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-bold flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#E8A33D]" />
                <span>{t('cta_reserve')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
