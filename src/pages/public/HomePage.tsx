import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { generateQrSvgPath } from '../../core/qr';
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
  CheckCircle2,
  QrCode,
  ShieldCheck,
  ChevronDown,
  Flame,
  Award,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { country, restaurants, branches, menuItems, orders, tables, formatPrice, t } = useApp();
  const navigate = useNavigate();

  const countryConfig = COUNTRIES[country];
  const currentLang = countryConfig.language;

  // Mini-booking bar state
  const [guestCount, setGuestCount] = useState<number>(2);
  const [bookingDate, setBookingDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [bookingTime, setBookingTime] = useState<string>('20:00');

  // Filter restaurants for current country
  const countryRestaurants = restaurants.filter((r) => r.country === country);
  const countryBranches = branches.filter((b) => b.country === country);

  // Top dishes for this market
  const countryMenu = menuItems.filter((m) =>
    countryRestaurants.some((r) => r.id === m.restaurantId)
  );
  const featuredDishes = countryMenu.slice(0, 4);

  // Real stats
  const totalTables = tables.length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const totalBranches = branches.length;

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/reservar?guests=${guestCount}&date=${bookingDate}&time=${bookingTime}`);
  };

  // Demo QR path for Table 3
  const demoTableUrl = `${window.location.origin}/#/mesa/branch-co-01/table-co-01-03`;
  const qrSvgPath = generateQrSvgPath(demoTableUrl, 29);

  return (
    <div className="min-h-screen bg-[#FBF6EC] text-[#1F1A17] font-sans">
      {/* HERO SECTION with Central Paellera inspired warm culinary atmosphere */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center bg-[#1F1A17] text-white overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        {/* Background Image with warm dark gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=80"
            alt="Gastronomía SmartRestaurant"
            className="w-full h-full object-cover opacity-30 filter saturate-120"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A17] via-[#1F1A17]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F1A17] via-[#1F1A17]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8A33D]/20 border border-[#E8A33D]/40 text-[#E8A33D] text-xs font-mono font-medium backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MERCADO ACTIVO: {countryConfig.name.toUpperCase()} ({countryConfig.currency})</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFDF8] max-w-4xl mx-auto leading-[1.15]">
            Reserva, ordena y saborea{' '}
            <span className="italic font-normal text-[#E8A33D]">sin esperas</span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#E9DFCC]/90 max-w-2xl mx-auto font-light leading-relaxed">
            Conectamos los restaurantes más selectos de {countryConfig.name} con un sistema ágil de reservas, comandas digitales en mesa y atención personalizada.
          </p>

          {/* Quick Booking Bar */}
          <div className="mt-8 max-w-3xl mx-auto bg-[#FFFDF8] rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#E9DFCC] text-[#1F1A17]">
            <form onSubmit={handleQuickBook} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
              <div>
                <label className="text-[10px] font-bold text-[#7A6E65] uppercase tracking-wider block mb-1">
                  Comensales
                </label>
                <div className="relative">
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C] appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                  </select>
                  <Users className="w-3.5 h-3.5 text-[#7A6E65] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#7A6E65] uppercase tracking-wider block mb-1">
                  Fecha
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#7A6E65] uppercase tracking-wider block mb-1">
                  Hora
                </label>
                <div className="relative">
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C] appearance-none"
                  >
                    {['12:30', '13:00', '13:30', '14:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map(
                      (t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      )
                    )}
                  </select>
                  <Clock className="w-3.5 h-3.5 text-[#7A6E65] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Buscar Mesa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* THREE STEPS: CÓMO FUNCIONA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
            Flujo Sin Fricciones
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1F1A17]">
            Cómo Funciona SmartRestaurant
          </h2>
          <p className="text-xs text-[#7A6E65]">
            Diseñado para que dediques tu tiempo a disfrutar la comida y la compañía.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E9DFCC] shadow-xs relative flex flex-col justify-between">
            <span className="font-serif italic text-4xl font-bold text-[#E8A33D]/40 absolute top-4 right-4">
              01
            </span>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8A33D]/20 text-[#C8452C] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1F1A17]">
                1. Reserva con Detección de Colisión
              </h3>
              <p className="text-xs text-[#7A6E65] leading-relaxed">
                Selecciona tu restaurante, horario y mesa preferida. El sistema verifica instantáneamente la disponibilidad sin dobles reservas.
              </p>
            </div>
            <Link to="/reservar" className="mt-4 text-xs font-bold text-[#C8452C] flex items-center gap-1 hover:underline">
              <span>Reservar ahora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E9DFCC] shadow-xs relative flex flex-col justify-between">
            <span className="font-serif italic text-4xl font-bold text-[#E8A33D]/40 absolute top-4 right-4">
              02
            </span>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C8452C]/10 text-[#C8452C] flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1F1A17]">
                2. Escanea el QR y Ordena en Mesa
              </h3>
              <p className="text-xs text-[#7A6E65] leading-relaxed">
                Al llegar al restaurante, abre la carta interactiva desde tu móvil. Consulta ingredientes, alérgenos y envía tu comanda a cocina sin esperar.
              </p>
            </div>
            <Link to="/mesa/branch-co-01/table-co-01-03" className="mt-4 text-xs font-bold text-[#C8452C] flex items-center gap-1 hover:underline">
              <span>Probar menú QR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E9DFCC] shadow-xs relative flex flex-col justify-between">
            <span className="font-serif italic text-4xl font-bold text-[#E8A33D]/40 absolute top-4 right-4">
              03
            </span>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#6B7A3A]/20 text-[#6B7A3A] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1F1A17]">
                3. Sigue tu Pedido en Tiempo Real
              </h3>
              <p className="text-xs text-[#7A6E65] leading-relaxed">
                Visualiza cuando tu orden entra en cocción y cuando sale hacia tu mesa. Paga de forma segura y recibe tu comprobante digital.
              </p>
            </div>
            <Link to="/mis-reservas" className="mt-4 text-xs font-bold text-[#6B7A3A] flex items-center gap-1 hover:underline">
              <span>Ver mis órdenes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED RESTAURANTS FOR CURRENT MARKET */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
              Selección Exclusiva en {countryConfig.name}
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F1A17]">
              Restaurantes Destacados
            </h2>
          </div>
          <Link
            to="/restaurantes"
            className="text-xs font-bold text-[#C8452C] hover:underline flex items-center gap-1"
          >
            <span>Ver todos los restaurantes ({restaurants.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {countryRestaurants.map((rest) => {
            const restBranches = branches.filter((b) => b.restaurantId === rest.id);
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
                className="bg-[#FFFDF8] rounded-2xl overflow-hidden border border-[#E9DFCC] shadow-md flex flex-col justify-between group hover:border-[#E8A33D] transition-all"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={rest.heroImage}
                    alt={rest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#1F1A17]/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#E8A33D] text-[#E8A33D]" />
                    <span>{rest.rating}</span>
                    <span className="text-white/60 text-[10px]">({rest.reviewCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#FFFDF8]/90 backdrop-blur-xs text-[#1F1A17] px-3 py-1 rounded-full text-xs font-mono font-bold">
                    {cuisineText}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#1F1A17]">
                      {rest.name}
                    </h3>
                    <p className="text-xs text-[#7A6E65] line-clamp-2 mt-1 leading-relaxed">
                      {descText}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#7A6E65] pt-2 border-t border-[#E9DFCC]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C8452C] shrink-0" />
                      <span>
                        {restBranches[0]?.city || countryConfig.name} • {restBranches.length} {restBranches.length === 1 ? 'sucursal' : 'sucursales'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      to={`/reservar?restaurantId=${rest.id}`}
                      className="flex-1 py-2 px-4 rounded-xl bg-[#C8452C] hover:bg-[#A83720] text-white text-xs font-bold text-center transition-colors shadow-xs"
                    >
                      Reservar Mesa
                    </Link>
                    <Link
                      to={`/restaurantes`}
                      className="py-2 px-4 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] text-xs font-semibold transition-colors"
                    >
                      Ver Carta
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TOP SELLING DISHES */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
            Especialidades de la Casa
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1F1A17]">
            Platos Más Aclamados en {countryConfig.name}
          </h2>
          <p className="text-xs text-[#7A6E65]">
            Preparados en el momento con ingredientes locales de la más alta calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((dish) => {
            const dishName =
              typeof dish.name === 'string'
                ? dish.name
                : dish.name[currentLang] || dish.name.es;
            const dishDesc =
              typeof dish.description === 'string'
                ? dish.description
                : dish.description[currentLang] || dish.description.es;

            return (
              <div
                key={dish.id}
                className="bg-[#FFFDF8] rounded-2xl overflow-hidden border border-[#E9DFCC] shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={dish.image}
                    alt={dishName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {dish.popular && (
                    <div className="absolute top-2 left-2 bg-[#C8452C] text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>Destacado</span>
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
                        {formatPrice(dish.basePriceUSD || dish.price)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A6E65] line-clamp-2 leading-relaxed">
                      {dishDesc}
                    </p>
                  </div>

                  <Link
                    to="/mesa/branch-co-01/table-co-01-03"
                    className="w-full py-1.5 px-3 rounded-xl bg-[#FBF6EC] hover:bg-[#E8A33D]/20 text-[#1F1A17] text-[11px] font-bold text-center border border-[#E9DFCC] transition-colors block"
                  >
                    Ordenar en Mesa QR
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-[#1F1A17] text-white py-12 px-4 sm:px-6 lg:px-8 my-12 border-y border-[#332B25]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center font-mono">
          <div className="space-y-1">
            <span className="text-3xl lg:text-4xl font-bold text-[#E8A33D]">{totalTables}</span>
            <p className="text-xs text-[#E9DFCC]/80 font-sans">Mesas en Tiempo Real</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl lg:text-4xl font-bold text-[#E8A33D]">{completedOrders}+</span>
            <p className="text-xs text-[#E9DFCC]/80 font-sans">Comandas Despachadas</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl lg:text-4xl font-bold text-[#E8A33D]">{totalBranches}</span>
            <p className="text-xs text-[#E9DFCC]/80 font-sans">Sucursales Conectadas</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl lg:text-4xl font-bold text-[#E8A33D]">5</span>
            <p className="text-xs text-[#E9DFCC]/80 font-sans">Países Multinacionales</p>
          </div>
        </div>
      </section>

      {/* DEMO QR CARD: PROBAR PEDIDO EN MESA DIRECTO */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border-2 border-[#E8A33D] shadow-xl flex flex-col sm:flex-row items-center gap-8">
          <div className="p-4 bg-white rounded-2xl border border-[#E9DFCC] shadow-inner shrink-0">
            <svg viewBox="0 0 29 29" className="w-40 h-40">
              <path d={qrSvgPath} fill="#1F1A17" />
            </svg>
            <div className="text-center mt-2 text-[10px] font-mono font-bold text-[#7A6E65]">
              MESA #3 • BOGOTÁ
            </div>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-[#E8A33D]/20 text-[#C8452C] text-xs font-mono font-bold">
              SIMULACIÓN EN VIVO
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1F1A17]">
              Prueba la Experiencia Comensal en Mesa
            </h3>
            <p className="text-xs text-[#7A6E65] leading-relaxed">
              Haz clic en el botón o escanea el código para ingresar a la comanda interactiva de la Mesa 3. Podrás agregar platos al carrito, ver el cálculo automático de impuestos regionales y propina, y enviar el pedido en directo al KDS de cocina.
            </p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <Link
                to="/mesa/branch-co-01/table-co-01-03"
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all flex items-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Abrir Menú QR de Mesa 3</span>
              </Link>
              <Link
                to="/app/dashboard"
                className="py-2.5 px-5 rounded-xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#E8A33D]" />
                <span>Abrir Panel de Cocina / Staff</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
