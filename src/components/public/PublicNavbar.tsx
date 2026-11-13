import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES, formatTime } from '../../i18n/countries';
import { CountryCode, Language } from '../../types';
import {
  Globe,
  ChevronDown,
  UtensilsCrossed,
  CalendarCheck,
  ShoppingBag,
  ShoppingCart,
  Shield,
  LogIn,
  Star,
  LogOut,
  Menu as MenuIcon,
  X,
  Compass,
  Bell,
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
    tables,
    deliveryCart,
    notifications,
    markNotificationsRead,
    t,
  } = useApp();

  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const countryConfig = COUNTRIES[country];

  const activeBranchTable =
    tables.find((tbl) => tbl.branchId === activeBranchId) || tables[0];
  const qrHref = activeBranchTable
    ? `/mesa/${activeBranchId}/${activeBranchTable.id}`
    : `/sucursal/${activeBranchId}`;

  const cartCount =
    deliveryCart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const myNotifications = isAuthenticated && currentUser
    ? notifications
        .filter((n) => !n.targetUserId || n.targetUserId === currentUser.id)
        .filter((n) => !n.targetRole || n.targetRole === currentUser.role)
        .slice(0, 12)
    : [];
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: 'Español', flag: '🇨🇴' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E9DFCC] text-[#1F1A17] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E8A33D] via-[#C8452C] to-[#1F1A17] flex items-center justify-center text-white shadow-md shadow-[#C8452C]/20 group-hover:scale-105 transition-transform">
            <span className="font-serif italic font-bold text-2xl">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-tight text-[#1F1A17] flex items-center gap-1.5">
              {t('app_name')}
            </span>
            <span className="text-[11px] font-sans text-[#7A6E65] -mt-0.5 hidden sm:inline">
              {t('app_subtitle')}
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-5 font-sans text-sm font-medium">
          <Link
            to="/restaurantes"
            className={`transition-colors flex items-center gap-1.5 ${
              isActive('/restaurantes')
                ? 'text-[#C8452C] font-semibold'
                : 'text-[#1F1A17]/80 hover:text-[#C8452C]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t('nav_restaurants')}</span>
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
            <span>{t('nav_reviews')}</span>
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
            <span>{t('nav_reserve')}</span>
          </Link>
          <Link
            to={qrHref}
            className={`transition-colors flex items-center gap-1.5 ${
              isActive('/mesa')
                ? 'text-[#C8452C] font-semibold'
                : 'text-[#1F1A17]/80 hover:text-[#C8452C]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>{t('qr_code_menu')}</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/mis-pedidos"
                className={`transition-colors flex items-center gap-1.5 ${
                  isActive('/mis-pedidos')
                    ? 'text-[#C8452C] font-semibold'
                    : 'text-[#1F1A17]/80 hover:text-[#C8452C]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('nav_my_orders')}</span>
              </Link>
              <Link
                to="/mis-reservas"
                className={`transition-colors flex items-center gap-1.5 ${
                  isActive('/mis-reservas')
                    ? 'text-[#C8452C] font-semibold'
                    : 'text-[#1F1A17]/80 hover:text-[#C8452C]'
                }`}
              >
                <span>{t('my_reservations')}</span>
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Country Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCountryMenu(!showCountryMenu);
                setShowLanguageMenu(false);
                setShowUserDropdown(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC]/60 border border-[#E9DFCC] text-xs font-medium text-[#1F1A17] transition-colors"
              title={t('select_country')}
            >
              <span className="text-base leading-none">{countryConfig.flagEmoji}</span>
              <span className="hidden sm:inline">{t(countryConfig.profile.nameKey)}</span>
              <span className="font-mono font-bold text-[#C8452C]">
                {countryConfig.currency}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7A6E65]" />
            </button>

            {showCountryMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#FFFDF8] border border-[#E9DFCC] rounded-2xl shadow-xl p-2 z-50">
                <div className="px-3 py-2 text-[10px] font-bold text-[#7A6E65] uppercase tracking-wider border-b border-[#E9DFCC]/60">
                  {t('select_market')}
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
                            <div className="font-medium">{t(c.profile.nameKey)}</div>
                            <div className="text-[10px] text-[#7A6E65]">
                              {t(c.profile.pilotCityKey)}
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
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC]/60 border border-[#E9DFCC] text-xs font-semibold text-[#1F1A17] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#7A6E65]" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-[#7A6E65]" />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-[#FFFDF8] border border-[#E9DFCC] rounded-2xl shadow-xl p-1.5 z-50">
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

          {/* Delivery Cart Icon */}
          <Link
            to="/carrito"
            className="relative p-2 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC]/60 border border-[#E9DFCC] text-[#1F1A17] transition-colors"
            title={t('cart')}
          >
            <ShoppingCart className="w-4 h-4 text-[#C8452C]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C8452C] text-white font-mono font-bold text-[10px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Customer Notifications Bell */}
          {isAuthenticated && currentUser && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserDropdown(false);
                  setShowCountryMenu(false);
                  setShowLanguageMenu(false);
                }}
                className="relative p-2 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC]/60 border border-[#E9DFCC] text-[#1F1A17] transition-colors"
                title={t('notifications')}
              >
                <Bell className="w-4 h-4 text-[#1F1A17]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C8452C] text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#FFFDF8] border border-[#E9DFCC] rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-2.5 border-b border-[#E9DFCC] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F1A17]">
                      {t('notifications')}
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markNotificationsRead}
                        className="text-[10px] font-semibold text-[#C8452C] hover:underline"
                      >
                        {t('mark_all_read')}
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#E9DFCC]/60">
                    {myNotifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#7A6E65]">
                        {t('no_notifications')}
                      </div>
                    ) : (
                      myNotifications.map((n) => (
                        <div key={n.id} className="p-3 text-xs space-y-0.5">
                          <div className="font-bold text-[#1F1A17]">
                            {n.titleKey ? t(n.titleKey, n.messageParams) : n.title}
                          </div>
                          <div className="text-[11px] text-[#7A6E65]">
                            {n.messageKey ? t(n.messageKey, n.messageParams) : n.message}
                          </div>
                          <div className="text-[10px] font-mono text-[#7A6E65]/70">
                            {formatTime(n.instantUtc || n.timestamp, country)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customer Account or Login */}
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowCountryMenu(false);
                  setShowLanguageMenu(false);
                  setShowNotifications(false);
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
                <div className="absolute right-0 mt-2 w-56 bg-[#FFFDF8] border border-[#E9DFCC] rounded-2xl shadow-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-[#E9DFCC]/60 mb-1">
                    <p className="text-xs font-bold text-[#1F1A17] truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-[#7A6E65] truncate">
                      {currentUser.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/mis-pedidos"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#1F1A17] hover:bg-[#FBF6EC]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C8452C]" />
                      <span>{t('nav_my_orders')}</span>
                    </Link>

                    <Link
                      to="/mis-reservas"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#1F1A17] hover:bg-[#FBF6EC]"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-[#E8A33D]" />
                      <span>{t('my_reservations')}</span>
                    </Link>

                    <Link
                      to="/mis-datos"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#1F1A17] hover:bg-[#FBF6EC]"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#7A6E65]" />
                      <span>{t('nav_privacy_data')}</span>
                    </Link>

                    <button
                      onClick={() => {
                        logoutUser();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('nav_logout')}</span>
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
              <span className="hidden sm:inline">{t('nav_login')}</span>
            </Link>
          )}

          <Link
            to="/reservar"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20"
          >
            <span>{t('nav_reserve')}</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#FBF6EC] text-[#1F1A17]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E9DFCC] bg-[#FFFDF8] px-4 py-4 space-y-3 font-sans">
          <Link
            to="/restaurantes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1F1A17]"
          >
            {t('nav_restaurants')}
          </Link>
          <Link
            to="/resenas"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1F1A17]"
          >
            {t('nav_reviews')}
          </Link>
          <Link
            to="/reservar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#C8452C]"
          >
            {t('nav_reserve')}
          </Link>
          <Link
            to={qrHref}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1F1A17]"
          >
            {t('qr_code_menu')}
          </Link>
          <Link
            to="/carrito"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1F1A17]"
          >
            {t('cart')} ({cartCount})
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/mis-pedidos"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-[#7A6E65]"
              >
                {t('nav_my_orders')}
              </Link>
              <Link
                to="/mis-reservas"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-[#7A6E65]"
              >
                {t('my_reservations')}
              </Link>
              <Link
                to="/mis-datos"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-[#7A6E65]"
              >
                {t('nav_privacy_data')}
              </Link>
              <button
                onClick={() => {
                  logoutUser();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-rose-600 font-semibold"
              >
                {t('nav_logout')}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#7A6E65]"
            >
              {t('nav_login')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
