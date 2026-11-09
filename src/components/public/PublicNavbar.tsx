import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { CountryCode } from '../../types';
import {
  Globe,
  ChevronDown,
  UtensilsCrossed,
  CalendarCheck,
  LayoutDashboard,
  LogIn,
  Search,
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Compass,
} from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const { country, setCountry, currentUser, t } = useApp();
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const countryConfig = COUNTRIES[country];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E9DFCC] text-[#1F1A17] transition-all">
      {/* Top Academic Disclaimer & Multinational Bar */}
      <div className="bg-[#1F1A17] text-[#FFFDF8] text-[11px] px-4 py-1.5 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E8A33D] animate-ping" />
          <span className="text-[#E9DFCC] truncate">
            {t('academic_disclaimer') || 'Simulación Académica de Arquitectura Distribuida • 5 Países • 10 Restaurantes'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[10px] text-[#E9DFCC]">
          <span>Event-Driven Architecture</span>
          <span>•</span>
          <span>Cross-Tab Sync</span>
          <span>•</span>
          <Link
            to="/app/monitor"
            className="text-[#E8A33D] hover:underline font-semibold"
          >
            Ver Monitor →
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E8A33D] via-[#C8452C] to-[#1F1A17] flex items-center justify-center text-white shadow-md shadow-[#C8452C]/20 group-hover:scale-105 transition-transform">
            <span className="font-serif italic font-bold text-2xl">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-tight text-[#1F1A17] flex items-center gap-1.5">
              SmartRestaurant
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E8A33D]/20 text-[#C8452C] border border-[#E8A33D]/40">
                Gastronomy
              </span>
            </span>
            <span className="text-[11px] font-sans text-[#7A6E65] -mt-0.5">
              Experiencias culinarias sin esperas
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 font-sans text-sm font-medium">
          <Link
            to="/restaurantes"
            className={`transition-colors flex items-center gap-1.5 ${
              isActive('/restaurantes')
                ? 'text-[#C8452C] font-semibold'
                : 'text-[#1F1A17]/80 hover:text-[#C8452C]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Restaurantes</span>
          </Link>
          <Link
            to="/reservar"
            className={`transition-colors flex items-center gap-1.5 ${
              isActive('/reservar')
                ? 'text-[#C8452C] font-semibold'
                : 'text-[#1F1A17]/80 hover:text-[#C8452C]'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Reservar Mesa</span>
          </Link>
          <Link
            to="/mesa/branch-co-01/table-co-01-03"
            className={`transition-colors flex items-center gap-1.5 ${
              isActive('/mesa')
                ? 'text-[#C8452C] font-semibold'
                : 'text-[#1F1A17]/80 hover:text-[#C8452C]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menú QR Mesa</span>
          </Link>
          <Link
            to="/mis-reservas"
            className={`transition-colors ${
              isActive('/mis-reservas')
                ? 'text-[#C8452C] font-semibold'
                : 'text-[#1F1A17]/80 hover:text-[#C8452C]'
            }`}
          >
            Mis Reservas
          </Link>
        </nav>

        {/* Right Actions: Country selector, Staff Access & CTA */}
        <div className="flex items-center gap-3">
          {/* Country Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCountryMenu(!showCountryMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC]/60 border border-[#E9DFCC] text-xs font-medium text-[#1F1A17] transition-colors"
            >
              <span className="text-base leading-none">{countryConfig.flagEmoji}</span>
              <span className="hidden sm:inline">{countryConfig.name}</span>
              <span className="font-mono font-bold text-[#C8452C]">
                {countryConfig.currency}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7A6E65]" />
            </button>

            {showCountryMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#FFFDF8] border border-[#E9DFCC] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[10px] font-bold text-[#7A6E65] uppercase tracking-wider border-b border-[#E9DFCC]/60">
                  Seleccionar Mercado Culinario
                </div>
                <div className="mt-1 space-y-1">
                  {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
                    const c = COUNTRIES[code];
                    const isSelected = code === country;
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          setCountry(code);
                          setShowCountryMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#E8A33D]/20 text-[#1F1A17] font-semibold'
                            : 'hover:bg-[#FBF6EC] text-[#1F1A17]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{c.flagEmoji}</span>
                          <div className="text-left">
                            <div className="font-medium">{c.name}</div>
                            <div className="text-[10px] text-[#7A6E65]">{c.timeZone.split('/')[1]?.replace('_', ' ')}</div>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-[11px] text-[#C8452C]">
                          {c.currency}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Staff Panel Switcher Link */}
          <Link
            to="/app/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-semibold shadow-xs transition-colors"
            title="Ir al panel de gestión de restaurantes"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#E8A33D]" />
            <span>Panel Staff</span>
          </Link>

          {/* Quick Book CTA button */}
          <Link
            to="/reservar"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all hover:scale-102"
          >
            <span>Reservar</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#FBF6EC] text-[#1F1A17]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E9DFCC] bg-[#FFFDF8] px-4 py-4 space-y-3 font-sans">
          <Link
            to="/restaurantes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1F1A17]"
          >
            Directorio de Restaurantes
          </Link>
          <Link
            to="/reservar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#C8452C]"
          >
            Reservar Mesa en Línea
          </Link>
          <Link
            to="/mesa/branch-co-01/table-co-01-03"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1F1A17]"
          >
            Menú Digital QR (Demo Mesa 3)
          </Link>
          <Link
            to="/mis-reservas"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#7A6E65]"
          >
            Mis Reservaciones
          </Link>
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#7A6E65]"
          >
            Acceso de Usuarios y Roles
          </Link>
          <div className="pt-2 border-t border-[#E9DFCC]">
            <Link
              to="/app/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#1F1A17] text-white text-xs font-bold"
            >
              <LayoutDashboard className="w-4 h-4 text-[#E8A33D]" />
              <span>Abrir Panel de Gestión (Staff)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
