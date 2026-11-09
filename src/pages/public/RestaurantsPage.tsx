import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { CountryCode, Restaurant, Branch } from '../../types';
import {
  Search,
  Star,
  MapPin,
  Calendar,
  UtensilsCrossed,
  Filter,
  ArrowRight,
  Globe,
} from 'lucide-react';

export const RestaurantsPage: React.FC = () => {
  const { restaurants, branches, country, setCountry, t } = useApp();
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<CountryCode | 'all'>(country);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  const filteredRestaurants = restaurants.filter((r) => {
    if (selectedCountryFilter !== 'all' && r.country !== selectedCountryFilter) {
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A33D]/20 text-[#C8452C] text-xs font-mono font-bold">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>CATÁLOGO MULTINACIONAL</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1A17]">
            Nuestros Restaurantes Exclusivos
          </h1>
          <p className="text-xs text-[#7A6E65] leading-relaxed">
            Descubre las propuestas gastronómicas de nuestra red en 5 países. Cada restaurante cuenta con múltiples sucursales y gestión digital de mesas.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#FFFDF8] rounded-2xl p-4 border border-[#E9DFCC] shadow-xs space-y-4">
          {/* Country Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#E9DFCC]/60 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] mr-2">
              País:
            </span>
            <button
              onClick={() => setSelectedCountryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedCountryFilter === 'all'
                  ? 'bg-[#1F1A17] text-white'
                  : 'bg-[#FBF6EC] text-[#1F1A17] hover:bg-[#E9DFCC]'
              }`}
            >
              Todos ({restaurants.length})
            </button>
            {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
              const c = COUNTRIES[code];
              const isSelected = selectedCountryFilter === code;
              const count = restaurants.filter((r) => r.country === code).length;
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
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
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
              placeholder="Buscar por nombre de restaurante o especialidad culinaria..."
              className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
            />
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((rest: Restaurant) => {
            const restBranches = branches.filter((b: Branch) => b.restaurantId === rest.id);
            const cConfig = COUNTRIES[rest.country];
            const currentLang = cConfig.language;
            const cuisineText =
              typeof rest.cuisine === 'string'
                ? rest.cuisine
                : rest.cuisine[currentLang] || rest.cuisine.es;
            const descText =
              typeof rest.description === 'string'
                ? rest.description
                : rest.description[currentLang] || rest.description.es;

            return (
              <div
                key={rest.id}
                className="bg-[#FFFDF8] rounded-2xl overflow-hidden border border-[#E9DFCC] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={rest.heroImage}
                    alt={rest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1F1A17]/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <span>{cConfig.flagEmoji}</span>
                    <span className="text-[11px]">{cConfig.name}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-[#FFFDF8]/90 backdrop-blur-xs text-[#1F1A17] px-2.5 py-1 rounded-full text-xs font-mono font-bold">
                    {rest.priceRange}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-serif font-bold text-lg text-[#1F1A17]">
                        {rest.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#1F1A17]">
                        <Star className="w-3.5 h-3.5 fill-[#E8A33D] text-[#E8A33D]" />
                        <span>{rest.rating}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#C8452C] block mb-2">
                      {cuisineText}
                    </span>
                    <p className="text-xs text-[#7A6E65] line-clamp-2 leading-relaxed">
                      {descText}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E9DFCC] space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block">
                      Sucursales ({restBranches.length})
                    </span>
                    <div className="space-y-1">
                      {restBranches.map((br) => (
                        <div
                          key={br.id}
                          className="flex items-center justify-between text-xs text-[#1F1A17] bg-[#FBF6EC] px-2.5 py-1.5 rounded-lg"
                        >
                          <span className="font-medium truncate mr-2">{br.name}</span>
                          <span className="text-[10px] text-[#7A6E65] font-mono shrink-0">
                            {br.totalTables} mesas
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      to={`/reservar?restaurantId=${rest.id}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#C8452C] hover:bg-[#A83720] text-white text-xs font-bold text-center transition-colors shadow-xs"
                    >
                      Reservar Mesa
                    </Link>
                    <Link
                      to={`/mesa/${restBranches[0]?.id || 'branch-co-01'}/table-co-01-03`}
                      className="py-2 px-3 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] text-xs font-semibold transition-colors"
                      title="Probar Menú QR"
                    >
                      Menú QR
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
