import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { CountryCode, Branch, MenuItem, Review } from '../../types';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  UtensilsCrossed,
  ArrowLeft,
  ChevronRight,
  Flame,
  Globe,
  Sparkles,
  Quote,
} from 'lucide-react';

export const RestaurantDetailPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const {
    restaurants,
    branches,
    menuItems,
    reviews,
    country,
    setCountry,
    language,
    formatPrice,
    setActiveBranchId,
  } = useApp();

  const brand = restaurants.find((r) => r.id === restaurantId) || restaurants[0];
  const brandBranches = branches.filter((b) => b.restaurantId === brand.id);

  // Group branches by country
  const branchesByCountry: Record<CountryCode, Branch[]> = {} as any;
  brandBranches.forEach((b) => {
    if (!branchesByCountry[b.country]) {
      branchesByCountry[b.country] = [];
    }
    branchesByCountry[b.country].push(b);
  });

  const availableCountries = Object.keys(branchesByCountry) as CountryCode[];

  // Selected country tab
  const [activeCountryTab, setActiveCountryTab] = useState<CountryCode>(() => {
    if (availableCountries.includes(country)) return country;
    return availableCountries[0] || 'CO';
  });

  // Selected branch in the active country
  const countryBranches = branchesByCountry[activeCountryTab] || [];
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    return countryBranches[0]?.id || brandBranches[0]?.id || '';
  });

  const selectedBranch = brandBranches.find((b) => b.id === selectedBranchId) || countryBranches[0];

  // Brand menu items for selected branch/country
  const branchMenuItems = menuItems.filter((item) => {
    if (item.restaurantId && item.restaurantId !== brand.id) return false;
    if (item.countryCode && item.countryCode !== activeCountryTab) return false;
    return true;
  });

  // Brand reviews
  const brandReviews = reviews.filter((r) => r.restaurantId === brand.id && r.status === 'approved');

  const brandName = brand.name;
  const brandTagline = brand.tagline[language] || brand.tagline.es;
  const brandStory = brand.story?.[language] || brand.story?.es || brand.description[language] || brand.description.es;
  const brandCuisine = brand.cuisine[language] || brand.cuisine.es;

  return (
    <div className="min-h-screen bg-[#FBF6EC] text-[#1F1A17] font-sans">
      {/* Top Breadcrumb & Hero */}
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
            <span>Volver a Restaurantes</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E8A33D]/20 text-[#E8A33D] text-xs font-mono font-bold border border-[#E8A33D]/30">
                  {brandCuisine}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-[#E9DFCC] text-xs font-mono font-bold">
                  {brand.priceRange}
                </span>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#E8A33D]">
                  <Star className="w-3.5 h-3.5 fill-[#E8A33D]" />
                  <span>{brand.rating}</span>
                  <span className="text-[#E9DFCC]/60 font-normal">({brand.reviewCount} opiniones)</span>
                </div>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
                {brandName}
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-[#E9DFCC]/90">
                "{brandTagline}"
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/reservar?restaurantId=${brand.id}`}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#C8452C]/30 transition-all hover:scale-102 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar en {brand.name}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Story & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C8452C] uppercase tracking-wider">
              <Quote className="w-4 h-4" />
              <span>Nuestra Historia & Propuesta Culinaria</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">
              Pasión por la Alta Cocina y el Ingrediente de Origen
            </h2>
            <p className="text-sm text-[#7A6E65] leading-relaxed font-light">
              {brandStory}
            </p>

            {/* Gallery photos */}
            {brand.gallery && brand.gallery.length > 0 && (
              <div className="pt-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7A6E65] block mb-3">
                  Galería Gastronómica
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {brand.gallery.map((imgUrl, idx) => (
                    <div key={idx} className="h-32 rounded-2xl overflow-hidden border border-[#E9DFCC] shadow-xs">
                      <ImageWithFallback
                        src={imgUrl}
                        alt={`${brand.name} foto ${idx + 1}`}
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

          {/* Multinational summary card */}
          <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-xs space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C] block">
              Presencia Global ({availableCountries.length} Países)
            </span>
            <div className="divide-y divide-[#E9DFCC]">
              {availableCountries.map((cCode) => {
                const cConfig = COUNTRIES[cCode];
                const count = branchesByCountry[cCode]?.length || 0;
                return (
                  <div key={cCode} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cConfig.flagEmoji}</span>
                      <span className="font-semibold text-[#1F1A17]">{cConfig.name}</span>
                    </div>
                    <span className="font-mono text-[#7A6E65]">
                      {count} {count === 1 ? 'sucursal' : 'sucursales'}
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

        {/* Branches grouped by country */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
                Sucursales por País
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#1F1A17]">
                Encuentra tu Sede Más Cercana
              </h2>
            </div>

            {/* Country Selector Tabs */}
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
                    <span>{cConfig.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country branches cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryBranches.map((branch) => {
              const isSelected = selectedBranch?.id === branch.id;
              const cConfig = COUNTRIES[branch.country];

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
                        alt={branch.name}
                        className="w-full h-full object-cover"
                        fallbackEmoji="📍"
                        fallbackTitle={branch.name}
                      />
                      <div className="absolute top-2 right-2 bg-[#1F1A17]/80 text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                        {branch.totalTables} Mesas
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#1F1A17]">
                        {branch.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#7A6E65] mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C8452C] shrink-0" />
                        <span>{branch.address}, {branch.city}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-[#7A6E65] pt-2 border-t border-[#E9DFCC]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#E8A33D]" />
                          <span>Horario:</span>
                        </span>
                        <span className="font-mono text-[#1F1A17]">{branch.openingHours || '12:00 - 23:30'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Moneda / Impuesto:</span>
                        <span className="font-mono font-bold text-[#C8452C]">
                          {cConfig.currency} · {cConfig.taxName} ({(cConfig.taxRate * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      to={`/reservar?restaurantId=${brand.id}&branchId=${branch.id}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#C8452C] hover:bg-[#A83720] text-white text-xs font-bold text-center transition-colors shadow-xs"
                    >
                      Reservar Aquí
                    </Link>
                    <Link
                      to={`/mesa/${branch.id}/tbl-co-bogota-3`}
                      onClick={() => setActiveBranchId(branch.id)}
                      className="py-2 px-3 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] text-xs font-semibold transition-colors"
                      title="Probar comanda digital en mesa"
                    >
                      Menú QR
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Menu preview for active country & brand */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9DFCC]">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
                Carta Gastronómica
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">
                Platos de {brand.name} en {COUNTRIES[activeCountryTab].name}
              </h2>
            </div>
            <span className="text-xs font-mono text-[#7A6E65]">
              Precios en {COUNTRIES[activeCountryTab].currency}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {branchMenuItems.map((item) => {
              const itemName = item.name[language] || item.name.es;
              const itemDesc = item.description[language] || item.description.es;

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
                      <div className="absolute top-2 left-2 bg-[#C8452C] text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <Flame className="w-3 h-3" />
                        <span>Destacado</span>
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
                          {formatPrice(item.basePriceUSD || item.price, activeCountryTab)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A6E65] line-clamp-2 leading-relaxed">
                        {itemDesc}
                      </p>
                    </div>

                    <Link
                      to={`/mesa/${selectedBranch?.id || brandBranches[0]?.id}/tbl-co-bogota-3`}
                      className="w-full py-1.5 px-3 rounded-xl bg-[#FBF6EC] hover:bg-[#E8A33D]/20 text-[#1F1A17] text-[11px] font-bold text-center border border-[#E9DFCC] transition-colors block"
                    >
                      Ordenar con QR
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Reviews for this brand */}
        <div className="space-y-6 pt-6 border-t border-[#E9DFCC]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
                Experiencias Verificadas
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">
                Opiniones sobre {brand.name}
              </h2>
            </div>

            <Link
              to="/resenas"
              className="text-xs font-bold text-[#C8452C] hover:underline flex items-center gap-1"
            >
              <span>Ver todas las reseñas</span>
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
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E9DFCC] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1F1A17]">{rev.customerName}</span>
                  <span className="text-[10px] text-[#7A6E65]">Comensal verificado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
