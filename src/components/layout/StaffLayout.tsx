import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { can, Permission } from '../../core/permissions';
import { Language } from '../../types';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  Users,
  Star,
  Activity,
  LogOut,
  Menu as MenuIcon,
  X,
  Compass,
  CalendarCheck,
  Bike,
  ShieldCheck,
  Building2,
  Clock,
  Globe,
  Bell,
  Settings,
  FlaskConical,
  Network,
} from 'lucide-react';

interface NavLinkItem {
  to: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
}

export const StaffLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    logoutUser,
    activeBranchId,
    setActiveBranchId,
    branches,
    notifications,
    markNotificationsRead,
    profile,
    language,
    setLanguage,
    getBranchDisplayName,
    getBranchCityName,
    t,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const handleLogout = () => {
    logoutUser();
    navigate('/staff');
  };

  const isActive = (path: string) => location.pathname === path;

  // Multi-branch scope determination
  const hasMultiBranchAccess =
    currentUser?.role === 'platform_admin' || currentUser?.role === 'owner';

  const userBranchScope = currentUser?.assignedBranchId || currentUser?.branchId;
  const selectableBranches = hasMultiBranchAccess
    ? branches
    : branches.filter((b) => !userBranchScope || b.id === userBranchScope);

  const userTimeZone = currentUser?.timeZone || profile.timeZone;
  const userTime = new Date().toLocaleTimeString(language, {
    timeZone: userTimeZone,
    hour: '2-digit',
    minute: '2-digit',
  });

  // Scoped notifications translated dynamically in recipient's language & timezone
  const scopedNotifications = notifications.filter((n) => {
    if (!currentUser) return false;
    if (n.targetUserId && n.targetUserId === currentUser.id) return true;
    if (currentUser.role === 'platform_admin' || currentUser.role === 'owner') {
      return !n.targetRole || n.targetRole === currentUser.role || currentUser.role === 'owner';
    }
    const branchMatch = !n.targetBranchId || !userBranchScope || n.targetBranchId === userBranchScope;
    const roleMatch = !n.targetRole || n.targetRole === currentUser.role;
    return branchMatch && roleMatch;
  });

  const unreadCount = scopedNotifications.filter((n) => !n.read).length;

  const hasPerm = (perm: Permission) =>
    can(currentUser, perm, { branchId: activeBranch?.id });

  // Navigation items driven cleanly by role + custom permissions (zero "Switch Role", zero "Event Bus")
  const navItems: NavLinkItem[] = [
    {
      to: '/staff/app/platform_admin',
      labelKey: 'staff_nav_platform_console',
      icon: ShieldCheck,
      visible: currentUser?.role === 'platform_admin',
    },
    {
      to: '/staff/app/owner',
      labelKey: 'staff_nav_owner_dashboard',
      icon: LayoutDashboard,
      visible: currentUser?.role === 'owner',
    },
    {
      to: '/staff/app/branch_admin',
      labelKey: 'staff_nav_branch_ops',
      icon: LayoutDashboard,
      visible: currentUser?.role === 'branch_admin' || currentUser?.role === 'admin',
    },
    {
      to: '/staff/app/waiter',
      labelKey: 'staff_nav_waiter_floor',
      icon: Compass,
      visible:
        currentUser?.role === 'waiter' ||
        currentUser?.role === 'cashier' ||
        (!['platform_admin', 'owner', 'branch_admin', 'admin', 'kitchen', 'courier', 'customer'].includes(currentUser?.role || '') &&
          (hasPerm('floor.operate') || hasPerm('tables.bill'))),
    },
    {
      to: '/staff/app/courier',
      labelKey: 'staff_nav_courier',
      icon: Bike,
      visible: currentUser?.role === 'courier',
    },
    {
      to: '/staff/app/floor',
      labelKey: 'nav_floor',
      icon: Compass,
      visible: currentUser?.role === 'branch_admin' || currentUser?.role === 'admin',
    },
    {
      to: '/staff/app/kitchen',
      labelKey: 'nav_kitchen',
      icon: ChefHat,
      visible:
        currentUser?.role === 'kitchen' ||
        currentUser?.role === 'branch_admin' ||
        currentUser?.role === 'admin' ||
        (!['platform_admin', 'owner', 'customer', 'courier'].includes(currentUser?.role || '') &&
          hasPerm('kitchen.operate')),
    },
    {
      to: '/staff/app/reservations',
      labelKey: 'nav_reservations',
      icon: CalendarCheck,
      visible: hasPerm('reservations.manage') && currentUser?.role !== 'platform_admin',
    },
    {
      to: '/staff/app/branches',
      labelKey: 'nav_branches',
      icon: Building2,
      visible: currentUser?.role === 'owner',
    },
    {
      to: '/staff/app/menu',
      labelKey: 'nav_menu',
      icon: UtensilsCrossed,
      visible: hasPerm('menu.edit') && currentUser?.role !== 'platform_admin',
    },
    {
      to: '/staff/app/reviews',
      labelKey: 'nav_reviews',
      icon: Star,
      visible: hasPerm('reviews.moderate') && currentUser?.role !== 'platform_admin',
    },
    {
      to: '/staff/app/analytics',
      labelKey: 'nav_analytics',
      icon: Activity,
      visible:
        (currentUser?.role === 'owner' || currentUser?.role === 'branch_admin' || currentUser?.role === 'admin') &&
        hasPerm('analytics.view'),
    },
    {
      to: '/staff/app/equipo',
      labelKey: 'staff_nav_team_roles',
      icon: Users,
      visible: hasPerm('team.manage'),
    },
    {
      to: '/staff/app/sistema',
      labelKey: 'staff_nav_system',
      icon: Settings,
      visible: hasPerm('regions.edit') && currentUser?.role === 'platform_admin',
    },
    {
      to: '/staff/app/prueba-localizacion',
      labelKey: 'staff_nav_loc_test',
      icon: FlaskConical,
      visible: hasPerm('regions.edit') && currentUser?.role === 'platform_admin',
    },
    {
      to: '/staff/app/monitor',
      labelKey: 'staff_nav_monitor',
      icon: Network,
      visible: hasPerm('monitor.view'),
    },
  ].filter((item) => item.visible);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Staff Topbar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold font-serif shadow-md">
            S
          </div>

          <div className="hidden sm:block">
            <span className="font-bold text-white text-sm tracking-wide">SmartRestaurant</span>
            <span className="ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
              {t('staff_private_badge')}
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Branch Selector or Fixed Badge */}
          {hasMultiBranchAccess ? (
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs">
              <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={activeBranchId}
                onChange={(e) => setActiveBranchId(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[140px] sm:max-w-[220px] truncate"
              >
                {selectableBranches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                    {getBranchDisplayName(b)} ({getBranchCityName(b)})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-xl text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-medium truncate max-w-[120px] sm:max-w-[200px]">
                {getBranchDisplayName(activeBranch)}
              </span>
            </div>
          )}

          {/* User Timezone indicator */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{userTime}</span>
            <span className="text-[9px] text-slate-500">({userTimeZone.split('/')[1] || 'UTC'})</span>
          </div>

          {/* Notifications Bell (Dynamically translated into recipient language & timezone) */}
          {can(currentUser, 'notifications.view') && (
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label={t('notifications')}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white">{t('notifications')}</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markNotificationsRead}
                        className="text-[11px] text-amber-400 hover:underline font-semibold"
                      >
                        {t('mark_all_read')}
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {scopedNotifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500">
                        {t('no_notifications')}
                      </div>
                    ) : (
                      scopedNotifications.slice(0, 15).map((n) => {
                        const titleText = n.titleKey ? t(n.titleKey, n.messageParams) : n.title || '';
                        const msgText = n.messageKey ? t(n.messageKey, n.messageParams) : n.message || '';
                        const timeLabel = new Date(n.instantUtc || n.timestamp).toLocaleTimeString(language, {
                          timeZone: userTimeZone,
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                        return (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl border text-xs ${
                              n.read
                                ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                                : 'bg-slate-800 border-amber-500/30 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-amber-300 truncate">{titleText}</span>
                              <span className="text-[10px] font-mono text-slate-500 shrink-0">{timeLabel}</span>
                            </div>
                            <p className="text-[11px] mt-0.5 leading-snug">{msgText}</p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 border border-slate-700 px-2 py-1 rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            {(['es', 'en', 'pt', 'fr', 'ja'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors ${
                  language === l ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Current User Pill */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/50"
              />
              <div className="hidden xl:block text-left text-xs">
                <div className="font-bold text-white leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-mono text-amber-400 uppercase">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            title={t('nav_logout')}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-800 text-slate-300 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col justify-between p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive(item.to)
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            SmartRestaurant Enterprise
          </div>
        </aside>

        {/* Mobile Sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
            <div className="relative z-50 w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <span className="font-bold text-white text-sm">{t('staff_private_badge')}</span>
                  <button onClick={() => setMobileOpen(false)} className="text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs ${
                          isActive(item.to)
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{t(item.labelKey)}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800 text-xs font-bold"
              >
                {t('nav_logout')}
              </button>
            </div>
          </div>
        )}

        {/* Viewport for active staff view */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
