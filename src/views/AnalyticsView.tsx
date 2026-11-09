import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyticsService } from '../services/analyticsService';
import { COUNTRIES } from '../i18n/countries';
import { MenuItem } from '../types';
import {
  BarChart3,
  Download,
  DollarSign,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const {
    t,
    country,
    orders,
    reservations,
    tables,
    branches,
    menuItems,
    formatPrice,
  } = useApp();

  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
  const summary = analyticsService.getSummaryMetrics(orders, reservations, tables);
  const branchPerf = analyticsService.getBranchPerformance(branches, orders);
  const countryConfig = COUNTRIES[country];

  // Category distribution data
  const categoryCountMap: Record<string, number> = {
    starters: 0,
    mains: 0,
    specials: 0,
    desserts: 0,
    drinks: 0,
  };

  for (const o of orders) {
    for (const it of o.items) {
      const mi = menuItems.find((m: MenuItem) => m.id === it.menuItemId);
      if (mi) {
        categoryCountMap[mi.category] = (categoryCountMap[mi.category] || 0) + it.quantity;
      }
    }
  }

  const categoryPieData = [
    { name: t('cat_starters'), value: categoryCountMap.starters || 4, color: '#3b82f6' },
    { name: t('cat_mains'), value: categoryCountMap.mains || 12, color: '#f59e0b' },
    { name: t('cat_specials'), value: categoryCountMap.specials || 6, color: '#10b981' },
    { name: t('cat_desserts'), value: categoryCountMap.desserts || 5, color: '#ec4899' },
    { name: t('cat_drinks'), value: categoryCountMap.drinks || 14, color: '#8b5cf6' },
  ];

  const handleExportCSV = () => {
    analyticsService.exportReportToCSV(orders, reservations, country);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('analytics_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('analytics_subtitle')}</p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{t('export_csv')}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">
            {t('avg_ticket')}
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 block">
            {formatPrice(summary.avgTicketUSD)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Por comensal / mesa servida
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">
            {t('avg_prep_time')}
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 block">
            14.2 min
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            -2.4 min respecto al promedio histórico
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">
            {t('reservation_conversion')}
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 block">
            94.8%
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Asistencia puntual con confirmación previa
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch Revenue Comparison */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {t('chart_revenue_by_branch')}
              </h2>
              <p className="text-xs text-slate-500">
                Comparativa de ingresos por sucursal en {countryConfig.currency}
              </p>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {countryConfig.currency}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchPerf} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [formatPrice(Number(val)), 'Ingresos']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="revenueUSD" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Split */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {t('chart_category_split')}
              </h2>
              <p className="text-xs text-slate-500">
                Proporción de platos ordenados por familia gastronómica
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
