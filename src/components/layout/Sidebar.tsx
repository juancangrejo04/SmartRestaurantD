import React from 'react';
import { useApp } from '../../context/AppContext';
import { useCan } from '../../core/permissions';
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
  Star,
  LogOut,
} from 'lucide-react';

export type ActiveView =
  | 'dashboard'
  | 'floor'
  | 'reservations'
  | 'menu'
  | 'orders_qr'
  | 'kitchen'
  | 'analytics'
  | 'resenas'
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
    reviews,
  } = useApp();

  const canTables = useCan('tables.view');
  const canReservations = useCan('reservations.view');
  const canMenu = useCan('menu.view');
  const canOrders = useCan('orders.create');
  const canKitchen = useCan('kitchen.view');
  const canAnalytics = useCan('analytics.view');
  const canReviews = useCan('reviews.view');
  const canMonitor = useCan('monitor.view');
  const canBranches = useCan('branches.manage');

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'received' || o.status === 'preparing'
  ).length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'pending').length;
  const occupiedTablesCount = tables.filter((t) => t.status === 'occupied').length;
  const activeWaiterCallsCount = tables.filter((t) => t.activeCallWaiter).length;

  const rawNavItems: {
    id: ActiveView;
    label: string;
    icon: any;
    badge?: number;
    badgeColor?: string;
    show: boolean;
  }[] = [
    {
      id: 'dashboard',
      label: 'Panel General',
      icon: LayoutDashboard,
      show: true,
    },
    {
      id: 'floor',
      label: 'Plano de Mesas',
      icon: Grid,
      badge: activeWaiterCallsCount > 0 ? activeWaiterCallsCount : occupiedTablesCount,
      badgeColor: activeWaiterCallsCount > 0 ? 'bg-amber-500 text-slate-950 animate-pulse' : undefined,
      show: canTables,
    },
    {
      id: 'reservations',
      label: 'Reservaciones',
      icon: CalendarCheck,
      badge: pendingReservationsCount,
      show: canReservations,
    },
    {
      id: 'menu',
      label: 'Gestión Menú',
      icon: UtensilsCrossed,
      show: canMenu,
    },
    {
      id: 'orders_qr',
      label: 'Comandas & QR',
      icon: QrCode,
      show: canOrders,
    },
    {
      id: 'kitchen',
      label: 'Cocina (KDS)',
      icon: Flame,
      badge: pendingOrdersCount,
      badgeColor: pendingOrdersCount > 0 ? 'bg-rose-500 text-white' : undefined,
      show: canKitchen,
    },
    {
      id: 'resenas',
      label: 'Reseñas & Feedback',
      icon: Star,
      badge: reviews.filter((r) => !r.reply).length,
      show: canReviews,
    },
    {
      id: 'analytics',
      label: 'Analítica & Ventas',
      icon: BarChart3,
      show: canAnalytics,
    },
    {
      id: 'branches',
      label: 'Sucursales (11)',
      icon: Store,
      show: canBranches,
    },
    {
      id: 'monitor',
      label: 'Monitor Distribuido',
      icon: Network,
      show: canMonitor,
    },
  ];

  const navItems = rawNavItems.filter((i) => i.show);

  // If user is owner, they see all branches; if assigned to a branch, focus on it
  const availableBranches = currentUser.role === 'owner'
    ? branches
    : currentUser.assignedBranchId
    ? branches.filter((b) => b.id === currentUser.assignedBranchId)
    : branches;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 select-none">
      {/* Branch selector dropdown */}
      <div className="p-3 border-b border-slate-800">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Sucursal Asignada
        </label>
        <select
          value={activeBranchId}
          onChange={(e) => setActiveBranchId(e.target.value)}
          className="w-full bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
        >
          {availableBranches.map((b) => (
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
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-slate-950'
                      : isSpecialMonitor
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    item.badgeColor
                      ? item.badgeColor
                      : isActive
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
          <span>Cambiar Rol ({currentUser.role.toUpperCase()})</span>
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
          <span>Restaurar Datos de Fábrica</span>
        </button>
      </div>
    </aside>
  );
};
