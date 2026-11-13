import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { CountryCode, Branch, Review } from '../../types';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import { isBranchOpenNow } from '../../core/geo';
import { getRegionProfile } from '../../data/regions';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  ChevronRight,
  Flame,
  Quote,
  ShoppingBag,
} from 'lucide-react';

export const RestaurantDetailPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const {
    restaurants,
    branches,
    menuItems,
    reviews,
    tables,
    country,
    formatPrice,
    setActiveBranchId,
    getBranchDisplayName,
    getBranchCityName,
    t,
    loc,
  } = useApp();

  const brand = restaurants.find((r) => r.id === restaurantId) || restaurants[0];
  const brandBranches = branches.filter((b) => b.restaurantId === brand.id);

  const branchesByCountry = {} as Record<CountryCode, Branch[]>;
  brandBranches.forEach((b) => {
    if (!branchesByCountry[b.country]) {
      branchesByCountry[b.country] = [];
    }
    branchesByCountry[b.country].push(b);
  });

  const availableCountries = Object.keys(branchesByCountry) as CountryCode[];

  const [activeCountryTab, setActiveCountryTab] = useState<CountryCode>(() => {
    if (availableCountries.includes(country)) return country;
    return availableCountries[0] || 'CO';
  });

  const countryBranches = branchesByCountry[activeCountryTab] || [];
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    return countryBranches[0]?.id || brandBranches[0]?.id || '';
  });

  const selectedBranch =
    brandBranches.find((b) => b.id === selectedBranchId) || countryBranches[0];

  const branchMenuItems = menuItems.filter((item) => {
    if (item.restaurantId && item.restaurantId !== brand.id) return false;
    if (item.countryCode && item.countryCode !== activeCountryTab) return false;
    return true;
  });

  const brandReviews = reviews.filter(
    (r) => r.restaurantId === brand.id && r.status === 'approved'
  );

  const activeCountryProfile = getRegionProfile(activeCountryTab);

  return (
    <div className="min-h-screen bg-[#FBF6EC] text-[#1F1A17] font-sans">
      <div className="relative bg-[#1F1A17] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={brand.heroImage}
            alt={brand.name}
            className="w-full h-full object-cover opacity-35 filter saturate-120"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A17] via-[#1F1A17]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-6">
          <Link
            to="/restaurantes"
            className="inline-flex items-center gap-1.5 text-xs text-[#E9DFCC] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('back_to_restaurants')}</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E8A33D]/20 text-[#E8A33D] text-xs font-mono font-bold border border-[#E8A33D]/30">
                  {loc(brand.cuisine)}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-[#E9DFCC] text-xs font-mono font-bold">
                  {brand.priceRange}
                </span>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#E8A33D]">
                  <Star className="w-3.5 h-3.5 fill-[#E8A33D]" />
                  <span>{brand.rating}</span>
                  <span className="text-[#E9DFCC]/60 font-normal">
                    ({brand.reviewCount})
                  </span>
                </div>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
                {brand.name}
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-[#E9DFCC]/90">
                "{loc(brand.tagline)}"
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/reservar?restaurantId=${brand.id}`}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#C8452C]/30 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('cta_reserve')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C8452C] uppercase tracking-wider">
              <Quote className="w-4 h-4" />
              <span>{t('our_story_title')}</span>
            </div>
            <p className="text-sm text-[#7A6E65] leading-relaxed font-light">
              {loc(brand.story) || loc(brand.description)}
            </p>

            {brand.gallery && brand.gallery.length > 0 && (
              <div className="pt-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7A6E65] block mb-3">
                  {t('gallery_title')}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {brand.gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="h-32 rounded-2xl overflow-hidden border border-[#E9DFCC] shadow-xs"
                    >
                      <ImageWithFallback
                        src={imgUrl}
                        alt={`${brand.name} ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        fallbackEmoji="🍽️"
                        fallbackTitle={brand.name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-xs space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C] block">
              {t('presence_global')} ({availableCountries.length})
            </span>
            <div className="divide-y divide-[#E9DFCC]">
              {availableCountries.map((cCode) => {
                const cConfig = COUNTRIES[cCode];
                const count = branchesByCountry[cCode]?.length || 0;
                return (
                  <div
                    key={cCode}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cConfig.flagEmoji}</span>
                      <span className="font-semibold text-[#1F1A17]">
                        {t(cConfig.profile.nameKey)}
                      </span>
                    </div>
                    <span className="font-mono text-[#7A6E65]">
                      {count} {count === 1 ? t('branch_singular') : t('branch_plural')}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-xs text-[#7A6E65] space-y-1 border-t border-[#E9DFCC]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C8452C]" />
                <span>{brand.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C8452C]" />
                <span>{brand.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
                {t('branches_by_country')}
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#1F1A17]">
                {t('select_branch')}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-[#FFFDF8] p-1.5 rounded-2xl border border-[#E9DFCC]">
              {availableCountries.map((cCode) => {
                const cConfig = COUNTRIES[cCode];
                const isSelected = activeCountryTab === cCode;
                return (
                  <button
                    key={cCode}
                    onClick={() => {
                      setActiveCountryTab(cCode);
                      const firstBr = branchesByCountry[cCode]?.[0];
                      if (firstBr) setSelectedBranchId(firstBr.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#C8452C] text-white shadow-xs'
                        : 'text-[#1F1A17] hover:bg-[#FBF6EC]'
                    }`}
                  >
                    <span>{cConfig.flagEmoji}</span>
                    <span>{t(cConfig.profile.nameKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryBranches.map((branch) => {
              const isSelected = selectedBranch?.id === branch.id;
              const cConfig = COUNTRIES[branch.country];
              const openInfo = isBranchOpenNow(branch.openingHours, cConfig.profile);
              const firstTable = tables.find((tbl) => tbl.branchId === branch.id);

              return (
                <div
                  key={branch.id}
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`bg-[#FFFDF8] rounded-3xl overflow-hidden border p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'border-[#C8452C] ring-2 ring-[#C8452C]/20 shadow-md'
                      : 'border-[#E9DFCC] hover:border-[#E8A33D] shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="h-36 rounded-2xl overflow-hidden relative">
                      <ImageWithFallback
                        src={branch.photo || brand.heroImage}
                        alt={getBranchDisplayName(branch)}
                        className="w-full h-full object-cover"
                        fallbackEmoji="📍"
                        fallbackTitle={getBranchDisplayName(branch)}
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {openInfo.isOpen ? t('branch_open_now') : t('branch_closed_now')}
                      </div>
                      <div className="absolute top-2 right-2 bg-[#1F1A17]/80 text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                        {branch.totalTables} {t('home_stat_tables')}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#1F1A17]">
                        {getBranchDisplayName(branch)}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#7A6E65] mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C8452C] shrink-0" />
                        <span>
                          {branch.address}, {getBranchCityName(branch)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-[#7A6E65] pt-2 border-t border-[#E9DFCC]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#E8A33D]" />
                          <span>{t('schedule')}:</span>
                        </span>
                        <span className="font-mono text-[#1F1A17]">
                          {branch.openingHours || '12:00 - 23:30'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t('currency')}:</span>
                        <span className="font-mono font-bold text-[#C8452C]">
                          {cConfig.currency} · {cConfig.profile.receipt.officialAuthority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <Link
                      to={`/sucursal/${branch.id}`}
                      onClick={() => setActiveBranchId(branch.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#C8452C] hover:bg-[#A83720] text-white text-xs font-bold text-center transition-colors shadow-xs flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t('view_menu')}</span>
                    </Link>
                    <Link
                      to={`/reservar?restaurantId=${brand.id}&branchId=${branch.id}`}
                      className="py-2 px-3 rounded-xl bg-[#1F1A17] text-white text-xs font-bold text-center"
                    >
                      {t('nav_reserve')}
                    </Link>
                    {firstTable && (
                      <Link
                        to={`/mesa/${branch.id}/${firstTable.id}`}
                        onClick={() => setActiveBranchId(branch.id)}
                        className="py-2 px-3 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] text-xs font-semibold transition-colors"
                      >
                        {t('qr_code_menu')}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9DFCC]">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
                {t('local_menu_and_prices')}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">
                {brand.name} — {t(activeCountryProfile.nameKey)}
              </h2>
            </div>
            <span className="text-xs font-mono text-[#7A6E65]">
              {activeCountryProfile.currency}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {branchMenuItems.map((item) => {
              const itemName = loc(item.name);
              const itemDesc = loc(item.description);
              const targetBrId = selectedBranch?.id || brandBranches[0]?.id;

              return (
                <div
                  key={item.id}
                  className="bg-[#FFFDF8] rounded-2xl overflow-hidden border border-[#E9DFCC] shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow"
                >
                  <div className="h-44 overflow-hidden relative">
                    <ImageWithFallback
                      src={item.image}
                      alt={itemName}
                      fallbackEmoji={item.fallbackEmoji || '🍲'}
                      fallbackGradient={item.fallbackGradient}
                      fallbackTitle={itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.popular && (
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
                          {itemName}
                        </h4>
                        <span className="font-mono font-bold text-xs text-[#C8452C] whitespace-nowrap">
                          {formatPrice(item, activeCountryTab)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A6E65] line-clamp-2 leading-relaxed">
                        {itemDesc}
                      </p>
                    </div>

                    <Link
                      to={`/sucursal/${targetBrId}`}
                      className="w-full py-1.5 px-3 rounded-xl bg-[#FBF6EC] hover:bg-[#E8A33D]/20 text-[#1F1A17] text-[11px] font-bold text-center border border-[#E9DFCC] transition-colors block"
                    >
                      {t('view_menu')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-[#E9DFCC]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
                {t('reviews_title')}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">
                {brand.name}
              </h2>
            </div>

            <Link
              to="/resenas"
              className="text-xs font-bold text-[#C8452C] hover:underline flex items-center gap-1"
            >
              <span>{t('guest_reviews_link')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandReviews.slice(0, 3).map((rev: Review) => (
              <div
                key={rev.id}
                className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#E9DFCC] shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating
                              ? 'fill-[#E8A33D] text-[#E8A33D]'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#7A6E65] font-mono">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-[#1F1A17] italic leading-relaxed">
                    "{loc(rev.comment)}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E9DFCC] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1F1A17]">
                    {rev.customerName || rev.userName}
                  </span>
                  <span className="text-[10px] text-[#7A6E65]">
                    {t('review_verified')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
