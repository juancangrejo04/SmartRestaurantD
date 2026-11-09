import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { CountryCode, Restaurant, Branch } from '../../types';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import {
  Search,
  Star,
  MapPin,
  Calendar,
  UtensilsCrossed,
  Globe,
  ArrowRight,
  Store,
} from 'lucide-react';

export const RestaurantsPage: React.FC = () => {
  const { restaurants, branches, country, setCountry, language } = useApp();
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<CountryCode | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = restaurants.filter((r) => {
    const brandBranches = branches.filter((b) => b.restaurantId === r.id);
    const operatingCountries = r.operatingCountries || Array.from(new Set(brandBranches.map((b) => b.country)));

    if (selectedCountryFilter !== 'all' && !operatingCountries.includes(selectedCountryFilter)) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = typeof r.cuisine === 'string'
        ? (r.cuisine as string).toLowerCase().includes(q)
        : Object.values(r.cuisine).some((v) => typeof v === 'string' && (v as string).toLowerCase().includes(q));
      if (!matchName && !matchCuisine) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A33D]/20 text-[#C8452C] text-xs font-mono font-bold">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>MARCAS MULTINACIONALES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1A17]">
            Nuestras Propuestas Gastronómicas
          </h1>
          <p className="text-xs text-[#7A6E65] leading-relaxed">
            Descubre las 2 marcas de alta cocina que operan a través de 11 sucursales en 5 países. Cada sede cuenta con mesas en vivo y menú digitalizado.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#FFFDF8] rounded-2xl p-4 border border-[#E9DFCC] shadow-xs space-y-4">
          {/* Country Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#E9DFCC]/60 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] mr-2">
              Filtrar por Mercado:
            </span>
            <button
              onClick={() => setSelectedCountryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedCountryFilter === 'all'
                  ? 'bg-[#1F1A17] text-white shadow-xs'
                  : 'bg-[#FBF6EC] text-[#1F1A17] hover:bg-[#E9DFCC]'
              }`}
            >
              Todos los Países (5)
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
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A6E65] absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar marca culinaria, concepto o cocina..."
              className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
            />
          </div>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBrands.map((brand: Restaurant) => {
            const brandBranches = branches.filter((b: Branch) => b.restaurantId === brand.id);
            const operatingCountries = brand.operatingCountries || Array.from(new Set(brandBranches.map((b) => b.country)));
            const cuisineText = brand.cuisine[language] || brand.cuisine.es;
            const taglineText = brand.tagline[language] || brand.tagline.es;
            const descText = brand.description[language] || brand.description.es;

            return (
              <div
                key={brand.id}
                className="bg-[#FFFDF8] rounded-3xl overflow-hidden border border-[#E9DFCC] shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                {/* Brand Hero Image */}
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={brand.heroImage}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    fallbackEmoji="🍷"
                    fallbackTitle={brand.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A17] via-[#1F1A17]/40 to-transparent" />

                  {/* Brand Tag / Badge */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="bg-[#1F1A17]/85 backdrop-blur-xs text-[#E8A33D] px-3 py-1 rounded-full text-xs font-mono font-bold border border-[#E8A33D]/30">
                      {cuisineText}
                    </span>
                    <span className="bg-white/90 backdrop-blur-xs text-[#1F1A17] px-3 py-1 rounded-full text-xs font-mono font-bold">
                      {brand.priceRange}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 bg-[#FFFDF8]/95 backdrop-blur-xs text-[#1F1A17] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-[#E8A33D] text-[#E8A33D]" />
                    <span>{brand.rating}</span>
                    <span className="text-[10px] text-[#7A6E65]">({brand.reviewCount})</span>
                  </div>

                  {/* Brand Title overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-white">
                      {brand.name}
                    </h3>
                    <p className="font-serif italic text-xs sm:text-sm text-[#E9DFCC]/90">
                      "{taglineText}"
                    </p>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <p className="text-xs text-[#7A6E65] leading-relaxed line-clamp-3">
                    {descText}
                  </p>

                  {/* Operating Countries & Branches summary */}
                  <div className="space-y-3 pt-3 border-t border-[#E9DFCC]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[#C8452C] uppercase text-[10px]">
                        Presencia en {operatingCountries.length} Países:
                      </span>
                      <span className="font-mono text-[#7A6E65] text-[11px]">
                        {brandBranches.length} Sucursales activas
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
                            <span className="font-medium text-[#1F1A17]">{c.name}</span>
                            <span className="text-[10px] font-mono text-[#7A6E65]">({countInCountry})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <Link
                      to={`/restaurantes/${brand.id}`}
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Ver Ficha y Sucursales</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E8A33D]" />
                    </Link>

                    <Link
                      to={`/reservar?restaurantId=${brand.id}`}
                      className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold text-center transition-all shadow-md shadow-[#C8452C]/20"
                    >
                      Reservar Mesa
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
