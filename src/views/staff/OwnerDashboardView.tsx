import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Star,
  DollarSign,
  Sparkles,
  Building2,
} from 'lucide-react';
import { COUNTRIES } from '../../i18n/countries';
import { MoneyUtils } from '../../core/money';
import { getRegionProfile } from '../../data/regions';

export const OwnerDashboardView: React.FC = () => {
  const {
    branches,
    restaurants,
    orders,
    reviews,
    t,
    getBranchDisplayName,
    getBranchCityName,
  } = useApp();

  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');

  const USD_RATES: Record<string, number> = {
    COP: 4100,
    BRL: 5.4,
    USD: 1.0,
    EUR: 0.92,
    JPY: 155,
  };

  const filteredBranches =
    selectedBrandId === 'all'
      ? branches
      : branches.filter((b) => b.restaurantId === selectedBrandId);

  const filteredBranchIds = new Set(filteredBranches.map((b) => b.id));
  const filteredOrders = orders.filter((o) => filteredBranchIds.has(o.branchId));
  const filteredReviews = reviews.filter((r) => filteredBranchIds.has(r.branchId));

  const branchStats = filteredBranches.map((branch) => {
    const branchOrders = filteredOrders.filter((o) => o.branchId === branch.id);
    const completedOrders = branchOrders.filter((o) => o.status !== 'cancelled');
    const branchReviews = filteredReviews.filter((r) => r.branchId === branch.id);

    const branchProfile = getRegionProfile(branch.country);
    const divisor = Math.pow(10, branchProfile.fractionDigits);

    const totalRevenueMinor = completedOrders.reduce(
      (sum, o) =>
        sum +
        (o.totalMinorUnits !== undefined
          ? o.totalMinorUnits
          : Math.round((o.total || 0) * divisor)),
      0
    );

    const avgRating =
      branchReviews.length > 0
        ? (
            branchReviews.reduce((sum, r) => sum + r.rating, 0) /
            branchReviews.length
          ).toFixed(1)
        : '4.8';

    const formattedLocalRevenue = MoneyUtils.format(
      { amount: totalRevenueMinor, currency: branch.currency },
      branchProfile
    );

    const rate = USD_RATES[branch.currency] || 1;
    const baseLocal = totalRevenueMinor / divisor;
    const usdEquivalent = Math.round(baseLocal / rate);
    const brand = restaurants.find((r) => r.id === branch.restaurantId);

    return {
      branch,
      brandName: brand?.name || branch.restaurantId,
      ordersCount: branchOrders.length,
      revenueLocal: formattedLocalRevenue,
      revenueUSD: usdEquivalent,
      avgRating,
      reviewsCount: branchReviews.length,
    };
  });

  const totalUSD = branchStats.reduce((sum, b) => sum + b.revenueUSD, 0);
  const totalOrders = filteredOrders.length;
  const overallAvgRating = (
    filteredReviews.reduce((sum, r) => sum + r.rating, 0) /
    Math.max(1, filteredReviews.length)
  ).toFixed(1);

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-gradient-to-r from-amber-600/30 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {t('owner_badge')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-2">
              {t('owner_title')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">{t('owner_subtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-2xl">
              <Building2 className="w-4 h-4 text-amber-400" />
              <select
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none"
              >
                <option value="all" className="bg-slate-900">
                  {t('owner_all_brands')}
                </option>
                {restaurants.map((rest) => (
                  <option key={rest.id} value={rest.id} className="bg-slate-900">
                    {rest.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-2xl">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300">
                {t('owner_active_branches_count', { count: filteredBranches.length })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>{t('owner_kpi_consolidated_revenue')}</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              ${totalUSD.toLocaleString('en-US')} USD
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {t('owner_kpi_fx_disclaimer')}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>{t('owner_kpi_total_orders')}</span>
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {totalOrders}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {t('owner_kpi_orders_sub')}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>{t('owner_kpi_avg_rating')}</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400 flex items-center gap-1.5">
              <span>{overallAvgRating}</span>
              <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {t('owner_kpi_rating_sub', { count: filteredReviews.length })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">{t('owner_table_title')}</h2>
            <p className="text-xs text-slate-400">{t('owner_table_sub')}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-3">{t('owner_col_branch_city')}</th>
                <th className="py-3 px-3">{t('owner_col_brand')}</th>
                <th className="py-3 px-3">{t('owner_col_country')}</th>
                <th className="py-3 px-3 text-right">{t('owner_col_orders')}</th>
                <th className="py-3 px-3 text-right">{t('owner_col_local_revenue')}</th>
                <th className="py-3 px-3 text-right">{t('owner_col_usd_ref')}</th>
                <th className="py-3 px-3 text-center">{t('owner_col_rating')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {branchStats.map(
                ({
                  branch,
                  brandName,
                  ordersCount,
                  revenueLocal,
                  revenueUSD,
                  avgRating,
                }) => {
                  const c = COUNTRIES[branch.country];
                  return (
                    <tr key={branch.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">
                          {getBranchDisplayName(branch)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {getBranchCityName(branch)} · {branch.address}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-medium">{brandName}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                          <span>{c?.flagEmoji}</span>
                          <span>{c ? t(c.profile.nameKey) : branch.country}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                        {ordersCount}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                        {revenueLocal}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400">
                        ${revenueUSD.toLocaleString('en-US')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold font-mono">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{avgRating}</span>
                        </span>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
