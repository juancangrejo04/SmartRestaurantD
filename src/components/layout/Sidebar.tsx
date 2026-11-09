import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Grid,
  CalendarCheck,
  UtensilsCrossed,
  QrCode,
  Flame,
  BarChart3,
  Network,
  Store,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

export type ActiveView =
  | 'dashboard'
  | 'floor'
  | 'reservations'
  | 'menu'
  | 'orders_qr'
  | 'kitchen'
  | 'analytics'
  | 'monitor'
  | 'branches';

interface SidebarProps {
  currentView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onOpenDemoModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView, onOpenDemoModal }) => {
  const {
    t,
    currentUser,
    branches,
    activeBranchId,
    setActiveBranchId,
    country,
    resetToFactoryDefaults,
    orders,
    reservations,
    tables,
  } = useApp();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'received' || o.status === 'preparing'
  ).length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'pending').length;
  const occupiedTablesCount = tables.filter((t) => t.status === 'occupied').length;

  const navItems: { id: ActiveView; labelKey: string; icon: any; badge?: number }[] = [
    { id: 'dashboard', labelKey: 'nav_dashboard', icon: LayoutDashboard },
    { id: 'floor', labelKey: 'nav_floor', icon: Grid, badge: occupiedTablesCount },
    { id: 'reservations', labelKey: 'nav_reservations', icon: CalendarCheck, badge: pendingReservationsCount },
    { id: 'menu', labelKey: 'nav_menu', icon: UtensilsCrossed },
    { id: 'orders_qr', labelKey: 'nav_orders_qr', icon: QrCode },
    { id: 'kitchen', labelKey: 'nav_kitchen', icon: Flame, badge: pendingOrdersCount },
    { id: 'analytics', labelKey: 'nav_analytics', icon: BarChart3 },
    { id: 'monitor', labelKey: 'nav_monitor', icon: Network },
    { id: 'branches', labelKey: 'nav_branches', icon: Store },
  ];

  // Filter branches according to current selected country
  const currentCountryBranches = branches.filter((b) => b.country === country);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 select-none">
      {/* Branch selector dropdown */}
      <div className="p-3 border-b border-slate-800">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Sucursal Activa
        </label>
        <select
          value={activeBranchId}
          onChange={(e) => setActiveBranchId(e.target.value)}
          className="w-full bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
        >
          {currentCountryBranches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
          {branches
            .filter((b) => b.country !== country)
            .map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.country})
              </option>
            ))}
        </select>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isSpecialMonitor = item.id === 'monitor';

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : isSpecialMonitor
                  ? 'text-emerald-400 hover:bg-slate-800/80 bg-emerald-500/5 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : isSpecialMonitor ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{t(item.labelKey)}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User & System Controls */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
        <button
          onClick={onOpenDemoModal}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t('demo_accounts')}</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('¿Desea restaurar todos los datos originales de demostración?')) {
              resetToFactoryDefaults();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t('btn_reset_all_data')}</span>
        </button>
      </div>
    </aside>
  );
};
