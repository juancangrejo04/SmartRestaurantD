import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyticsService } from '../services/analyticsService';
import { COUNTRIES } from '../i18n/countries';
import { Table, DistributedEvent, Branch } from '../types';
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
    formatPrice,
    activeBranchId,
    setActiveBranchId,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month'>('today');

  const summary = analyticsService.getSummaryMetrics(orders, reservations, tables);
  const weeklyData = analyticsService.getWeeklySalesData(country);
  const popularDishes = analyticsService.getPopularDishes(orders, menuItems);
  const branchPerformance = analyticsService.getBranchPerformance(branches, orders);

  const countryConfig = COUNTRIES[country];
  const activeBranch = branches.find((b: Branch) => b.id === activeBranchId);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{countryConfig.name}</span>
            <span>·</span>
            <span>{activeBranch?.name || 'Todas las sucursales'}</span>
            <span>·</span>
            <span className="font-mono text-amber-600 font-medium">{countryConfig.currency}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('nav_dashboard')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Segmented Control */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                dateFilter === 'today' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                dateFilter === 'week' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Esta Semana
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                dateFilter === 'month' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Este Mes
            </button>
          </div>

          <button
            onClick={() => onNavigate('monitor')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Monitor Distribuido</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{t('kpi_revenue')}</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              {formatPrice(summary.totalRevenueUSD)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% vs periodo anterior</span>
            </div>
          </div>
        </div>

        {/* Daily Orders */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{t('kpi_orders')}</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              {summary.ordersCount} <span className="text-sm font-normal text-slate-400">órdenes</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <span>{summary.activeOrdersCount} activas en preparación</span>
            </div>
          </div>
        </div>

        {/* Reservations */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{t('kpi_reservations')}</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              {summary.totalReservations} <span className="text-sm font-normal text-slate-400">mesas</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <span>Prevención anti-colisión activa</span>
            </div>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{t('kpi_occupancy')}</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              {summary.occupancyRate}%
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <span>{summary.occupiedTables} ocupadas de {summary.totalTables} totales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section: Sales Trend & Branch Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend (2 cols) */}
        <div className="lg:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t('sales_trend')}</h2>
              <p className="text-xs text-slate-500">
                Evolución de ventas calculadas en {countryConfig.currency}
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
              {countryConfig.currency}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `${val}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg font-mono">
                          <p className="font-bold">{data.day}</p>
                          <p className="text-amber-400 mt-0.5">{formatPrice(data.salesUSD)}</p>
                          <p className="text-slate-400 text-[10px]">{data.orders} comandas</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="localSales"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Dishes (1 col) */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">{t('popular_dishes')}</h2>
              <button
                onClick={() => onNavigate('menu')}
                className="text-xs text-amber-600 hover:underline font-medium flex items-center gap-0.5"
              >
                <span>Ver Menú</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {popularDishes.map((dish: { name: string; count: number; revenueUSD: number }, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">
                      {i + 1}
                    </span>
                    <span className="font-medium text-slate-800 truncate">{dish.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 font-mono block">
                      {formatPrice(dish.revenueUSD)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{dish.count} ventas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2">
            <button
              onClick={() => onNavigate('orders_qr')}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Simular Pedido de Mesa (QR)
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Floor Summary & Recent Distributed Events Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Floor Quick View */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">{t('floor_title')}</h2>
            <button
              onClick={() => onNavigate('floor')}
              className="text-xs text-amber-600 hover:underline font-medium flex items-center gap-0.5"
            >
              <span>{t('view_details')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Estado de mesas en la sucursal actual:
          </p>

          <div className="grid grid-cols-4 gap-2">
            {tables
              .filter((t: Table) => t.branchId === activeBranchId)
              .slice(0, 8)
              .map((table: Table) => {
                let badgeClass = 'bg-emerald-50 border-emerald-300 text-emerald-800';
                if (table.status === 'occupied') badgeClass = 'bg-rose-50 border-rose-300 text-rose-800';
                if (table.status === 'reserved') badgeClass = 'bg-blue-50 border-blue-300 text-blue-800';
                if (table.status === 'cleaning') badgeClass = 'bg-amber-50 border-amber-300 text-amber-800';

                return (
                  <div
                    key={table.id}
                    onClick={() => onNavigate('floor')}
                    className={`p-2 rounded-lg border text-center cursor-pointer transition-transform hover:scale-105 ${badgeClass}`}
                  >
                    <span className="text-[10px] uppercase font-mono block text-slate-500">Mesa</span>
                    <span className="text-sm font-bold font-mono">#{table.number}</span>
                    <span className="text-[9px] block text-slate-600 capitalize mt-0.5 truncate">{table.status}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Recent Distributed Events Log */}
        <div className="lg:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t('recent_activity')}</h2>
              <p className="text-xs text-slate-500">Eventos encolados y enrutados por el bus distribuido</p>
            </div>
            <button
              onClick={() => onNavigate('monitor')}
              className="text-xs text-emerald-600 hover:underline font-medium flex items-center gap-0.5 font-mono"
            >
              <span>Ver Monitor Completo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2 pr-3">Tipo de Evento</th>
                  <th className="py-2 px-3">Origen → Destino</th>
                  <th className="py-2 px-3">Estado</th>
                  <th className="py-2 pl-3 text-right">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {events.slice(0, 5).map((ev: DistributedEvent) => (
                  <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 pr-3 font-semibold text-slate-900">
                      {ev.eventType || ev.type}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <span className="text-slate-800">{ev.sourceService.split('-')[0]}</span>
                      <span className="text-slate-400 mx-1">→</span>
                      <span className="text-slate-800">{ev.targetService.split('-')[0]}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ev.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ev.status === 'failed'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-2.5 pl-3 text-right text-slate-400 text-[11px]">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
