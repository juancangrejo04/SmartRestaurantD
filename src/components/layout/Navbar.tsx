import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { COUNTRIES, getLiveTimeInTimezone } from '../../i18n/countries';
import { CountryCode, UserRole } from '../../types';
import {
  Globe,
  Clock,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Server,
  User as UserIcon,
  ChevronDown,
  X,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenDemoModal: () => void;
  onNavigateToMonitor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemoModal, onNavigateToMonitor }) => {
  const {
    country,
    setCountry,
    currentUser,
    switchUserRole,
    notifications,
    markNotificationsRead,
    t,
    isDemoRunning,
    demoStepMessage,
  } = useApp();

  const [liveTime, setLiveTime] = useState<string>('');
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Update live clock for the country's timezone every second
  useEffect(() => {
    const update = () => setLiveTime(getLiveTimeInTimezone(country));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [country]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const countryConfig = COUNTRIES[country];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white">
      {/* Running Demo Banner */}
      {isDemoRunning && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{demoStepMessage || 'Ejecutando simulación de flujo distribuido...'}</span>
          </div>
          <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded font-mono">DEMO EN VIVO</span>
        </div>
      )}

      <div className="flex items-center justify-between px-4 lg:px-6 h-16 gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-black text-lg">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-2">
              SmartRestaurant
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                DISTRIBUTED
              </span>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              {t('app_subtitle')}
            </span>
          </div>
        </div>

        {/* Center: Live Country & Regional Time indicator */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-300">
          {/* Country Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCountryMenu(!showCountryMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <span className="text-base leading-none">{countryConfig.flagEmoji}</span>
              <span className="font-medium text-white">{countryConfig.name}</span>
              <span className="text-amber-400 font-mono font-semibold">({countryConfig.currency})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showCountryMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t('select_country')}
                </div>
                {(Object.keys(COUNTRIES) as CountryCode[]).map((cCode) => {
                  const c = COUNTRIES[cCode];
                  const isSelected = cCode === country;
                  return (
                    <button
                      key={cCode}
                      onClick={() => {
                        setCountry(cCode);
                        setShowCountryMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                        isSelected
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'text-slate-200 hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{c.flagEmoji}</span>
                        <div className="text-left">
                          <p className="font-medium">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.timeZone}</p>
                        </div>
                      </div>
                      <span className="font-mono text-amber-400 font-bold">{c.currency}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Regional Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/40 border border-slate-800 rounded-lg text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono tabular-nums text-white font-medium">{liveTime}</span>
            <span className="text-[10px] text-slate-400">({countryConfig.timeZone.split('/')[1]})</span>
          </div>
        </div>

        {/* Right Zone: Demo accounts, Role Switcher, Monitor Shortcut, Notifications */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Distributed Monitor Button */}
          <button
            onClick={onNavigateToMonitor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
            title="Abrir Inspector de Arquitectura Distribuida"
          >
            <Server className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Event Bus</span>
          </button>

          {/* Role Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 hover:bg-slate-700/80 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-amber-400/50"
              />
              <span className="font-medium text-white hidden md:inline">{currentUser.name.split(' ')[0]}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Cambiar Rol de Sesión
                </div>
                {(['owner', 'admin', 'waiter', 'kitchen', 'customer'] as UserRole[]).map((r) => {
                  const isCurrent = currentUser.role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        switchUserRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                        isCurrent
                          ? 'bg-amber-500/20 text-amber-300 font-semibold'
                          : 'text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      <span className="capitalize">{r}</span>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
                <div className="border-t border-slate-700 my-1 pt-1">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      onOpenDemoModal();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-amber-400 hover:underline font-medium"
                  >
                    Ver Credenciales Demo →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
              title="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold rounded-full text-[10px] flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    {t('notifications')} ({notifications.length})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markNotificationsRead}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      {t('mark_all_read')}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      {t('no_notifications')}
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs transition-colors ${
                          n.read ? 'bg-slate-900/60 text-slate-300' : 'bg-amber-500/5 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-amber-400">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
