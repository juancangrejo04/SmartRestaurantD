import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Building,
  Bike,
  Users,
  Check,
  X,
  Globe,
  ShoppingBag,
  FileText,
  DollarSign,
  Settings,
  RefreshCw,
  FlaskConical,
  Activity,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { auditService } from '../../services/auditService';
import { fxService, FxRateSnapshot } from '../../services/fxService';
import { analyticsService } from '../../services/analyticsService';
import { COUNTRIES } from '../../i18n/countries';
import { MoneyUtils } from '../../core/money';
import { getRegionProfile } from '../../data/regions';
import { CountryCode, User } from '../../types';

export const PlatformAdminView: React.FC = () => {
  const {
    orders,
    branches,
    currentUser,
    refreshUsers,
    getBranchDisplayName,
    getBranchCityName,
    language,
    profile,
    showToast,
    t,
  } = useApp();
  const [users, setUsers] = useState<User[]>(() => authService.getUsers());
  const [activeTab, setActiveTab] = useState<'consolidated' | 'approvals' | 'orders' | 'users' | 'audit'>('consolidated');
  const [regionFilter, setRegionFilter] = useState<CountryCode | 'ALL'>('ALL');
  const [fxSnapshot, setFxSnapshot] = useState<FxRateSnapshot>(() => fxService.getSnapshot());

  useEffect(() => {
    return fxService.subscribe(() => {
      setFxSnapshot(fxService.getSnapshot());
    });
  }, []);

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const pendingCommerces = pendingUsers.filter((u) => u.role === 'owner');
  const pendingCouriers = pendingUsers.filter((u) => u.role === 'courier');
  const auditLogs = auditService.getAll();
  const actorTimeZone = currentUser?.timeZone || profile.timeZone;

  const consolidated = analyticsService.getAnonymizedConsolidatedSummary(
    orders,
    branches,
    fxSnapshot.ratesPerUsd
  );

  const handleRefreshFxSnapshot = () => {
    const updated = fxService.updateRates(fxSnapshot.ratesPerUsd, fxSnapshot.sourceName);
    setFxSnapshot(updated);
    showToast(t('plat_fx_refreshed_toast'), 'success');
  };

  const handleApprove = (userId: string) => {
    if (!currentUser) return;
    try {
      const ok = authService.approveUser(currentUser, userId);
      if (ok) {
        setUsers(authService.getUsers());
        refreshUsers();
        showToast(t('plat_user_approved_toast'), 'success');
      } else {
        showToast(t('err_forbidden_action'), 'error');
      }
    } catch {
      showToast(t('err_forbidden_action'), 'error');
    }
  };

  const handleReject = (userId: string) => {
    if (!currentUser) return;
    try {
      const ok = authService.rejectUser(currentUser, userId);
      if (ok) {
        setUsers(authService.getUsers());
        refreshUsers();
        showToast(t('plat_user_rejected_toast'), 'info');
      }
    } catch {
      showToast(t('err_forbidden_action'), 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (regionFilter === 'ALL') return true;
    const br = branches.find((b) => b.id === o.branchId);
    return br?.country === regionFilter;
  });

  const filteredUsers = users.filter((u) => regionFilter === 'ALL' || u.country === regionFilter);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
              {t('plat_badge')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-2">
              {t('plat_title')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">{t('plat_subtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/staff/app/sistema"
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>{t('staff_nav_system')}</span>
            </Link>
            <Link
              to="/staff/app/prueba-localizacion"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <FlaskConical className="w-4 h-4 text-amber-400" />
              <span>{t('staff_nav_loc_test')}</span>
            </Link>
            <Link
              to="/staff/app/monitor"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{t('staff_nav_monitor')}</span>
            </Link>
          </div>
        </div>

        {/* Global Consolidated USD KPIs (Zero PII) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30">
            <span className="text-xs text-slate-400 block mb-1">{t('plat_consolidated_usd')}</span>
            <span className="text-2xl font-bold font-mono text-amber-400">
              {fxService.formatUsdCents(consolidated.totalGrossUsdCents)} USD
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">{t('plat_zero_pii_note')}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">{t('plat_commissions_usd')}</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {fxService.formatUsdCents(consolidated.totalCommissionUsdCents)} USD
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              {t('plat_delivery_fees_usd')}: {fxService.formatUsdCents(consolidated.totalDeliveryFeesUsdCents)}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">{t('kpi_orders')} / {t('stat_branches')}</span>
            <span className="text-2xl font-bold font-mono text-white">
              {orders.length} / {branches.length}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">CO · BR · US · FR · JP</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">{t('plat_pending_approvals')}</span>
            <span className="text-2xl font-bold font-mono text-rose-400">{pendingUsers.length}</span>
            <span className="text-[10px] text-slate-500 block mt-1">
              {t('team_tab_users')}: {users.length}
            </span>
          </div>
        </div>

        {/* FX Source & Date Attribution Bar */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-amber-300">{t('plat_fx_source_label')}:</span>
            <span>{fxSnapshot.sourceName}</span>
            <span className="text-slate-500">|</span>
            <span className="font-mono text-slate-400">
              {t('plat_fx_updated_utc')}: {fxSnapshot.updatedAtUtc}
            </span>
          </div>
          <button
            onClick={handleRefreshFxSnapshot}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t('plat_fx_sync_btn')}</span>
          </button>
        </div>
      </div>

      {/* Tabs + Region filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('consolidated')}
            className={`pb-1 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'consolidated' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{t('plat_tab_consolidated')}</span>
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`pb-1 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'approvals' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>{t('plat_tab_approvals')} ({pendingUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-1 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'orders' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('plat_tab_global_orders')} ({filteredOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-1 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'users' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t('plat_tab_all_users')} ({filteredUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-1 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'audit' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('team_tab_audit')} ({auditLogs.length})</span>
          </button>
        </div>

        {(activeTab === 'orders' || activeTab === 'users') && (
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value as CountryCode | 'ALL')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
          >
            <option value="ALL">{t('all_countries_count')}</option>
            {Object.values(COUNTRIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.flagEmoji} {t(c.profile.nameKey)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* TAB 0: ANONYMIZED REGIONAL CONSOLIDATION */}
      {activeTab === 'consolidated' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl overflow-x-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-white">{t('plat_regional_breakdown_title')}</h2>
              <p className="text-xs text-slate-400">{t('plat_regional_breakdown_desc')}</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              {t('plat_local_charge_invariant')}
            </span>
          </div>

          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-3">{t('select_country')}</th>
                <th className="py-3 px-3 text-right">{t('kpi_orders')}</th>
                <th className="py-3 px-3 text-right">{t('plat_col_local_gross')}</th>
                <th className="py-3 px-3 text-right">{t('plat_col_fx_rate')}</th>
                <th className="py-3 px-3 text-right">{t('plat_col_usd_equiv')}</th>
                <th className="py-3 px-3 text-right">{t('plat_col_commission_usd')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {consolidated.byRegion.map((row) => {
                const regProf = getRegionProfile(row.country);
                const rate = fxSnapshot.ratesPerUsd[regProf.currency] || 1;
                return (
                  <tr key={row.country} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-white">
                      {regProf.flagEmoji} {t(regProf.nameKey)} ({row.currency})
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">{row.ordersCount}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                      {MoneyUtils.format({ amount: row.grossLocalMinorUnits, currency: regProf.currency }, regProf)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      1 USD = {rate} {row.currency}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                      {fxService.formatUsdCents(row.grossUsdCents)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      {fxService.formatUsdCents(row.commissionUsdCents)} ({(regProf.revenueModel.platformCommissionBps / 100).toFixed(1)}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white">
                  {t('plat_pending_commerces')} ({pendingCommerces.length})
                </h2>
              </div>
            </div>

            {pendingCommerces.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 italic">
                {t('plat_no_pending')}
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCommerces.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{comm.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{comm.email}</div>
                      <div className="text-[11px] text-amber-400 mt-1">
                        {comm.city || t(getRegionProfile(comm.country).pilotCityKey)} ({comm.country}) · {comm.phone}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleReject(comm.id)}
                        className="p-2 rounded-xl bg-slate-700 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 transition-colors"
                        title={t('btn_reject')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApprove(comm.id)}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>{t('btn_approve')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white">
                  {t('plat_pending_couriers')} ({pendingCouriers.length})
                </h2>
              </div>
            </div>

            {pendingCouriers.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 italic">
                {t('plat_no_pending')}
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCouriers.map((cour) => (
                  <div
                    key={cour.id}
                    className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{cour.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{cour.email}</div>
                      <div className="text-[11px] text-amber-400 mt-1">
                        {cour.city || t(getRegionProfile(cour.country).pilotCityKey)} ({cour.country}) · {cour.phone}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleReject(cour.id)}
                        className="p-2 rounded-xl bg-slate-700 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 transition-colors"
                        title={t('btn_reject')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApprove(cour.id)}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>{t('btn_approve')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL ORDERS IN LOCAL CURRENCIES + USD */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-3">{t('order')}</th>
                <th className="py-3 px-3">{t('select_branch')}</th>
                <th className="py-3 px-3">{t('select_country')}</th>
                <th className="py-3 px-3">{t('status')}</th>
                <th className="py-3 px-3 text-right">{t('total')}</th>
                <th className="py-3 px-3 text-right">{t('plat_col_usd_equiv')}</th>
                <th className="py-3 px-3 text-right">{t('date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((ord) => {
                const br = branches.find((b) => b.id === ord.branchId);
                const brProfile = getRegionProfile(br?.country || 'CO');
                const formattedTotal = MoneyUtils.format(
                  { amount: ord.totalMinorUnits || 0, currency: ord.currency },
                  brProfile
                );
                const usdCents = fxService.convertMinorUnitsToUsdCents(ord.totalMinorUnits || 0, brProfile);
                return (
                  <tr key={ord.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">#{ord.orderNumber}</td>
                    <td className="py-3 px-3 text-slate-200">
                      {br ? `${getBranchDisplayName(br)} (${getBranchCityName(br)})` : ord.branchId}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {brProfile.flagEmoji} {ord.currency}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 uppercase font-mono text-[10px]">
                        {t(`status_${ord.status}`)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      {formattedTotal}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-amber-300">
                      {fxService.formatUsdCents(usdCents)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400 text-[11px]">
                      {new Date(ord.createdAt).toLocaleString(language, { timeZone: actorTimeZone })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: PLATFORM USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-3">{t('team_col_user')}</th>
                <th className="py-3 px-3">{t('team_col_role')}</th>
                <th className="py-3 px-3">{t('select_country')}</th>
                <th className="py-3 px-3">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => {
                const c = COUNTRIES[u.country];
                return (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-amber-300 uppercase">{u.role}</td>
                    <td className="py-3 px-3 text-slate-300">
                      {c?.flagEmoji} {c ? t(c.profile.nameKey) : u.country}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{u.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-3">{t('date')}</th>
                <th className="py-3 px-3">{t('team_col_actor')}</th>
                <th className="py-3 px-3">{t('actions')}</th>
                <th className="py-3 px-3">{t('team_col_details')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(log.timestampUtc).toLocaleString(language, { timeZone: actorTimeZone })}
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{log.actorName}</td>
                  <td className="py-3 px-3 font-mono text-amber-300">{log.action}</td>
                  <td className="py-3 px-3 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
