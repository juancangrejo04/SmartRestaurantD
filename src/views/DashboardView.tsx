import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyticsService } from '../services/analyticsService';
import { COUNTRIES } from '../i18n/countries';
import { Table, DistributedEvent, Branch, Order } from '../types';
import { useCan } from '../core/permissions';
import {
  DollarSign,
  ShoppingBag,
  CalendarCheck,
  Percent,
  ChefHat,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Sparkles,
  Store,
  CheckCircle,
  BellRing,
  Utensils,
  Star,
  Users,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface DashboardViewProps {
  onNavigate: (view: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    t,
    country,
    orders,
    reservations,
    tables,
    branches,
    menuItems,
    events,
    reviews,
    formatPrice,
    activeBranchId,
    setActiveBranchId,
    currentUser,
    advanceKitchenOrder,
    resolveWaiterCall,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month'>('today');

  const summary = analyticsService.getSummaryMetrics(orders, reservations, tables);
  const weeklyData = analyticsService.getWeeklySalesData(country);
  const popularDishes = analyticsService.getPopularDishes(orders, menuItems);
  const branchPerformance = analyticsService.getBranchPerformance(branches, orders);

  const countryConfig = COUNTRIES[country];
  const activeBranch = branches.find((b: Branch) => b.id === activeBranchId);

  // Role-specific widgets data
  const callingTables = tables.filter((t) => t.activeCallWaiter);
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const preparingOrders = orders.filter((o) => o.status === 'preparing' || o.status === 'received');

  // WAITER ROLE SPECIFIC DASHBOARD
  if (currentUser.role === 'waiter') {
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">
              Panel Operativo de Salón
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Bienvenido(a), {currentUser.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Supervisión de sala, atención inmediata de llamados y despacho de comandas listas.
            </p>
          </div>

          <button
            onClick={() => onNavigate('floor')}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>Ir al Plano de Mesas</span>
          </button>
        </div>

        {/* Urgent Actions: Waiter Calls & Ready Orders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Calls */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <BellRing className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Llamadas de Comensales ({callingTables.length})</h3>
              </div>
            </div>

            {callingTables.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No hay mesas llamando en este momento. Salón despejado.
              </div>
            ) : (
              <div className="space-y-2">
                {callingTables.map((t) => (
                  <div key={t.id} className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-sm text-amber-950">Mesa #{t.number}</span>
                      <p className="text-xs text-amber-800">{t.waiterCallReason || 'Atención en mesa'}</p>
                    </div>
                    <button
                      onClick={() => resolveWaiterCall(t.id)}
                      className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
                    >
                      Atender
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ready Orders */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ChefHat className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Listas para Servir ({readyOrders.length})</h3>
              </div>
            </div>

            {readyOrders.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No hay comandas pendientes de entrega en barra.
              </div>
            ) : (
              <div className="space-y-2">
                {readyOrders.map((o) => (
                  <div key={o.id} className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-sm text-emerald-950">Mesa #{o.tableNumber}</span>
                      <p className="text-xs text-emerald-800">{o.items.length} platos emplatados</p>
                    </div>
                    <button
                      onClick={() => advanceKitchenOrder(o.id)}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      Marcar Entregado
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // STANDARD / OWNER / ADMIN DASHBOARD
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{countryConfig.name}</span>
            <span>·</span>
            <span className="font-semibold text-slate-700">{activeBranch?.name || 'Todas las sucursales'}</span>
            <span>·</span>
            <span className="font-mono text-amber-600 font-medium">{countryConfig.currency}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Panel de Control General
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Segmented Control */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'today' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'week' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'month' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Mes
            </button>
          </div>

          {currentUser.role === 'owner' && (
            <button
              onClick={() => onNavigate('monitor')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Monitor Distribuido</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Facturación Estimada</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              {formatPrice(summary.totalRevenueUSD)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% vs semana previa</span>
            </div>
          </div>
        </div>

        {/* Daily Orders */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Comandas Procesadas</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              {orders.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {orders.filter((o) => o.status === 'delivered').length} servidas con éxito
            </div>
          </div>
        </div>

        {/* Table Occupancy */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Ocupación de Mesas</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              {summary.occupancyRate.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {tables.filter((t) => t.status === 'occupied').length} de {tables.length} mesas en sala
            </div>
          </div>
        </div>

        {/* Global Rating */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Satisfacción Promedio</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 flex items-center gap-1">
              <span>{reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '4.9'}</span>
              <span className="text-sm font-normal text-amber-500">★</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {reviews.length} opiniones registradas
            </div>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart & Quick Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Tendencia de Ingresos Semanales</h3>
              <p className="text-xs text-slate-500">Comportamiento en {countryConfig.name} ({countryConfig.currency})</p>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
              Consistencia Estable
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8A33D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E8A33D" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [formatPrice(Number(val)), 'Ventas']}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="salesUSD" stroke="#E8A33D" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Dishes Widget */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Platos Estrella</h3>
            <span className="text-[10px] font-mono text-slate-400">Por volumen</span>
          </div>

          <div className="space-y-3">
            {popularDishes.slice(0, 5).map((dish, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate mr-2">
                  <span className="font-mono font-bold text-amber-600 w-4">{idx + 1}</span>
                  <span className="truncate font-medium text-slate-800">{dish.name}</span>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <span className="font-bold text-slate-900">{dish.quantity}</span>
                  <span className="text-[10px] text-slate-400 ml-1">pedidos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
