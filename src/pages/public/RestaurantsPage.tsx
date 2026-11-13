import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { CountryCode, Restaurant, Branch } from '../../types';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import {
  haversineDistanceKm,
  formatRegionalDistance,
  estimateDeliveryMinutes,
  isBranchOpenNow,
} from '../../core/geo';
import { getRegionProfile } from '../../data/regions';
import {
  Search,
  Star,
  UtensilsCrossed,
  ArrowRight,
  Navigation,
  MapPin,
} from 'lucide-react';

export const RestaurantsPage: React.FC = () => {
  const {
    restaurants,
    branches,
    country,
    setCountry,
    setActiveBranchId,
    getBranchDisplayName,
    getBranchCityName,
    loc,
    t,
  } = useApp();

  const [selectedCountryFilter, setSelectedCountryFilter] = useState<CountryCode | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByProximity, setSortByProximity] = useState(false);

  const activeProfile = getRegionProfile(country);
  const countryAnchor =
    branches.find((b) => b.country === country)?.coordinates || { lat: 4.65, lng: -74.05 };

  const filteredBrands = restaurants.filter((r) => {
    const brandBranches = branches.filter((b) => b.restaurantId === r.id);
    const operatingCountries =
      r.operatingCountries || Array.from(new Set(brandBranches.map((b) => b.country)));

    if (selectedCountryFilter !== 'all' && !operatingCountries.includes(selectedCountryFilter)) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = Object.values(r.cuisine).some(
        (v) => typeof v === 'string' && v.toLowerCase().includes(q)
      );
      if (!matchName && !matchCuisine) return false;
    }
    return true;
  });

  const branchCards = branches
    .filter((b) =>
      selectedCountryFilter === 'all' ? b.country === country : b.country === selectedCountryFilter
    )
    .map((b) => {
      const p = getRegionProfile(b.country);
      const distKm = haversineDistanceKm(countryAnchor, b.coordinates);
      return {
        branch: b,
        profile: p,
        distKm,
        eta: estimateDeliveryMinutes(distKm, 20),
        openInfo: isBranchOpenNow(b.openingHours, p),
      };
    })
    .sort((a, b) => (sortByProximity ? a.distKm - b.distKm : 0));

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A33D]/20 text-[#C8452C] text-xs font-mono font-bold">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>{t('multinational_brands')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1A17]">
            {t('restaurants_title')}
          </h1>
          <p className="text-xs text-[#7A6E65] leading-relaxed">
            {t('home_brands_sub', { branches: branches.length })}
          </p>
        </div>

        <div className="bg-[#FFFDF8] rounded-2xl p-4 border border-[#E9DFCC] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E9DFCC]/60 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] mr-1">
                {t('select_market')}:
              </span>
              <button
                onClick={() => setSelectedCountryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCountryFilter === 'all'
                    ? 'bg-[#1F1A17] text-white shadow-xs'
                    : 'bg-[#FBF6EC] text-[#1F1A17] hover:bg-[#E9DFCC]'
                }`}
              >
                {t('all_countries_count')}
              </button>
              {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
                const c = COUNTRIES[code];
                const isSelected = selectedCountryFilter === code;
                return (
                  <button
                    key={code}
                    onClick={() => {
                      setSelectedCountryFilter(code);
                      if (code !== country) setCountry(code);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-[#C8452C] text-white shadow-xs'
                        : 'bg-[#FBF6EC] text-[#1F1A17] hover:bg-[#E9DFCC]'
                    }`}
                  >
                    <span>{c.flagEmoji}</span>
                    <span>{t(c.profile.nameKey)}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setSortByProximity(!sortByProximity)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                sortByProximity
                  ? 'bg-[#E8A33D] text-[#1F1A17] border-[#E8A33D]'
                  : 'bg-[#FBF6EC] text-[#1F1A17] border-[#E9DFCC]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{t('use_my_location')}</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[#7A6E65] absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
            />
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBrands.map((brand: Restaurant) => {
            const brandBranches = branches.filter((b: Branch) => b.restaurantId === brand.id);
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
                    <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-white">
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
                        const countInCountry = brandBranches.filter((b) => b.country === cCode).length;
                        return (
                          <div
                            key={cCode}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FBF6EC] border border-[#E9DFCC] text-xs"
                          >
                            <span>{c.flagEmoji}</span>
                            <span className="font-medium text-[#1F1A17]">
                              {t(c.profile.nameKey)}
                            </span>
                            <span className="text-[10px] font-mono text-[#7A6E65]">
                              ({countInCountry})
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

        {/* Branches with proximity order CTA */}
        <div className="space-y-4 pt-6 border-t border-[#E9DFCC]">
          <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">
            {t('home_nearby_title')} — {t(activeProfile.pilotCityKey)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {branchCards.map(({ branch, profile: bProf, distKm, eta, openInfo }) => {
              const brand = restaurants.find((r) => r.id === branch.restaurantId);
              return (
                <Link
                  key={branch.id}
                  to={`/sucursal/${branch.id}`}
                  onClick={() => setActiveBranchId(branch.id)}
                  className="bg-[#FFFDF8] rounded-2xl p-4 border border-[#E9DFCC] hover:border-[#C8452C] shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="font-bold text-[#C8452C]">{brand?.name}</span>
                      <span
                        className={
                          openInfo.isOpen ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'
                        }
                      >
                        {openInfo.isOpen ? t('branch_open_now') : t('branch_closed_now')}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-[#1F1A17]">
                      {getBranchDisplayName(branch)}
                    </h3>
                    <p className="text-[11px] text-[#7A6E65] flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#C8452C]" />
                      {getBranchCityName(branch)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#7A6E65] pt-2 border-t border-[#E9DFCC]/60">
                    <span>{formatRegionalDistance(distKm, bProf)}</span>
                    <span className="text-[#1F1A17] font-bold">
                      ~{eta} {t('minutes')}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
