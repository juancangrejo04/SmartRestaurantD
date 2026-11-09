import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { CountryCode, Language } from '../../types';
import {
  Globe,
  ChevronDown,
  UtensilsCrossed,
  CalendarCheck,
  LayoutDashboard,
  LogIn,
  Search,
  Star,
  User as UserIcon,
  LogOut,
  Menu as MenuIcon,
  X,
  Compass,
} from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const {
    country,
    setCountry,
    language,
    setLanguage,
    currentUser,
    isAuthenticated,
    logoutUser,
    activeBranchId,
    t,
  } = useApp();
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const countryConfig = COUNTRIES[country];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isStaff = ['owner', 'admin', 'waiter', 'kitchen'].includes(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E9DFCC] text-[#1F1A17] transition-all">
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
                Gastronomía
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
            to="/resenas"
            className={`transition-colors flex items-center gap-1.5 ${
              isActive('/resenas')
                ? 'text-[#C8452C] font-semibold'
                : 'text-[#1F1A17]/80 hover:text-[#C8452C]'
            }`}
          >
            <Star className="w-4 h-4 text-[#E8A33D]" />
            <span>Reseñas</span>
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
            to={`/mesa/${activeBranchId}/tbl-co-bogota-3`}
            className={`transition-colors flex items-center gap-1.5 ${
              isActive('/mesa')
                ? 'text-[#C8452C] font-semibold'
                : 'text-[#1F1A17]/80 hover:text-[#C8452C]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menú QR Mesa</span>
          </Link>

          {isAuthenticated && (
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
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Country Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCountryMenu(!showCountryMenu);
                setShowLanguageMenu(false);
                setShowUserDropdown(false);
              }}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC]/60 border border-[#E9DFCC] text-xs font-medium text-[#1F1A17] transition-colors"
              title="Seleccionar país / mercado"
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
                  Mercado Culinario
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
                            <div className="text-[10px] text-[#7A6E65]">
                              {c.timeZone.split('/')[1]?.replace('_', ' ')}
                            </div>
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

          {/* Language Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => {
                setShowLanguageMenu(!showLanguageMenu);
                setShowCountryMenu(false);
                setShowUserDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC]/60 border border-[#E9DFCC] text-xs font-semibold text-[#1F1A17] transition-colors"
              title="Cambiar idioma de la interfaz"
            >
              <Globe className="w-3.5 h-3.5 text-[#7A6E65]" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-[#7A6E65]" />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-[#FFFDF8] border border-[#E9DFCC] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                      language === l.code
                        ? 'bg-[#E8A33D]/20 text-[#1F1A17] font-bold'
                        : 'hover:bg-[#FBF6EC] text-[#1F1A17]'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Staff Access or User Dropdown */}
          {isAuthenticated && isStaff ? (
            <Link
              to="/app/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-semibold shadow-xs transition-colors"
              title="Ir al panel de gestión del personal"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#E8A33D]" />
              <span>Panel Staff</span>
            </Link>
          ) : null}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowCountryMenu(false);
                  setShowLanguageMenu(false);
                }}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#FBF6EC] border border-transparent hover:border-[#E9DFCC] transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E8A33D]/40"
                />
                <span className="hidden xl:inline text-xs font-semibold text-[#1F1A17] max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-[#7A6E65]" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-[#FFFDF8] border border-[#E9DFCC] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-[#E9DFCC]/60 mb-1">
                    <p className="text-xs font-bold text-[#1F1A17] truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-[#7A6E65] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#E8A33D]/20 text-[#C8452C] font-bold">
                      {currentUser.role}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/mis-reservas"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#1F1A17] hover:bg-[#FBF6EC] transition-colors"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-[#C8452C]" />
                      <span>Mis Reservaciones</span>
                    </Link>

                    {isStaff && (
                      <Link
                        to="/app/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#1F1A17] hover:bg-[#FBF6EC] transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-[#E8A33D]" />
                        <span>Panel Staff</span>
                      </Link>
                    )}

                    <Link
                      to="/login"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#1F1A17] hover:bg-[#FBF6EC] transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#7A6E65]" />
                      <span>Cambiar de Rol / Cuenta</span>
                    </Link>

                    <button
                      onClick={() => {
                        logoutUser();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E9DFCC] hover:bg-[#E9DFCC]/50 text-xs font-semibold text-[#1F1A17] transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#C8452C]" />
              <span>Iniciar Sesión</span>
            </Link>
          )}

          {/* Quick Book CTA button */}
          <Link
            to="/reservar"
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all hover:scale-102"
          >
            <span>Reservar</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#FBF6EC] text-[#1F1A17]"
            aria-label="Toggle menu"
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
            to="/resenas"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1F1A17]"
          >
            Reseñas de Comensales
          </Link>
          <Link
            to="/reservar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#C8452C]"
          >
            Reservar Mesa en Línea
          </Link>
          <Link
            to={`/mesa/${activeBranchId}/tbl-co-bogota-3`}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1F1A17]"
          >
            Menú Digital QR en Mesa
          </Link>

          {isAuthenticated && (
            <Link
              to="/mis-reservas"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#7A6E65]"
            >
              Mis Reservaciones
            </Link>
          )}

          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#7A6E65]"
          >
            Acceso de Usuarios y Roles
          </Link>

          {isStaff && (
            <div className="pt-2 border-t border-[#E9DFCC]">
              <Link
                to="/app/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#1F1A17] text-white text-xs font-bold"
              >
                <LayoutDashboard className="w-4 h-4 text-[#E8A33D]" />
                <span>Abrir Panel Staff</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
