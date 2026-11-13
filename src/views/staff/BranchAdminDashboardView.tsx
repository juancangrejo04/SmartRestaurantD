import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Bike,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { MoneyUtils } from '../../core/money';
import { getRegionProfile } from '../../data/regions';
import { authService } from '../../services/authService';
import { can } from '../../core/permissions';

export const BranchAdminDashboardView: React.FC = () => {
  const {
    activeBranchId,
    branches,
    orders,
    tables,
    reservations,
    users,
    refreshUsers,
    currentUser,
    acceptDeliveryOrder,
    rejectDeliveryOrder,
    updateReservationStatus,
    showToast,
    t,
    getBranchDisplayName,
    getBranchCityName,
  } = useApp();

  const [prepMinutesByOrder, setPrepMinutesByOrder] = useState<Record<string, number>>({});
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const scopedBranchId =
    currentUser?.role === 'branch_admin' && currentUser.assignedBranchId
      ? currentUser.assignedBranchId
      : activeBranchId;

  const activeBranch = branches.find((b) => b.id === scopedBranchId) || branches[0];
  const branchProfile = getRegionProfile(activeBranch.country);

  const branchOrders = orders.filter((o) => o.branchId === activeBranch.id);
  const deliveryOrders = branchOrders.filter(
    (o) => o.orderType === 'delivery' || !o.tableNumber
  );
  const activeDeliveries = deliveryOrders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );

  const branchTables = tables.filter((tbl) => tbl.branchId === activeBranch.id);
  const availableTables = branchTables.filter((tbl) => tbl.status === 'available').length;

  const pendingReservations = reservations.filter(
    (r) => r.branchId === activeBranch.id && r.status === 'pending'
  );

  const branchCouriers = users.filter(
    (u) => u.role === 'courier' && u.country === activeBranch.country
  );
  const pendingCouriers = branchCouriers.filter((u) => u.status === 'pending');

  const canAcceptDelivery = can(currentUser, 'orders.acceptDelivery', {
    branchId: activeBranch.id,
  });

  const handleAcceptOrder = (orderId: string) => {
    const mins = prepMinutesByOrder[orderId] || 20;
    acceptDeliveryOrder(orderId, mins);
    showToast(t('branch_admin_order_accepted', { minutes: mins }), 'success');
  };

  const handleConfirmRejectOrder = async (orderId: string) => {
    const reason = rejectReason.trim() || t('branch_admin_default_reject_reason');
    await rejectDeliveryOrder(orderId, reason);
    setRejectingOrderId(null);
    setRejectReason('');
    showToast(t('branch_admin_order_rejected'), 'warning');
  };

  const handleApproveCourier = (courierId: string) => {
    if (!currentUser) return;
    try {
      const ok = authService.approveUser(currentUser, courierId);
      if (ok) {
        refreshUsers();
        showToast(t('branch_admin_courier_approved'), 'success');
      }
    } catch {
      showToast(t('err_forbidden_action'), 'error');
    }
  };

  const handleRejectCourier = (courierId: string) => {
    if (!currentUser) return;
    try {
      const ok = authService.rejectUser(currentUser, courierId);
      if (ok) {
        refreshUsers();
        showToast(t('branch_admin_courier_rejected'), 'info');
      }
    } catch {
      showToast(t('err_forbidden_action'), 'error');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {t('branch_admin_badge')}
            </span>
            <h1 className="text-2xl font-bold font-serif text-white mt-1">
              {getBranchDisplayName(activeBranch)} ({getBranchCityName(activeBranch)})
            </h1>
            <p className="text-xs text-slate-400">
              {activeBranch.address} • {activeBranch.currency} • {activeBranch.phone}
            </p>
          </div>

          <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
              <span className="text-slate-400">{t('branch_admin_tables_label')}: </span>
              <strong className="text-emerald-400">
                {availableTables} / {branchTables.length}
              </strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
              <span className="text-slate-400">{t('branch_admin_active_deliveries_label')}: </span>
              <strong className="text-amber-400">{activeDeliveries.length}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bike className="w-5 h-5 text-amber-400" />
                <span>
                  {t('branch_admin_deliveries_title', { count: activeDeliveries.length })}
                </span>
              </h2>
              <p className="text-xs text-slate-400">{t('branch_admin_deliveries_sub')}</p>
            </div>
          </div>

          {activeDeliveries.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              {t('branch_admin_no_deliveries')}
            </div>
          ) : (
            <div className="space-y-3">
              {activeDeliveries.map((order) => {
                const totalFormatted = MoneyUtils.format(
                  { amount: order.totalMinorUnits || 0, currency: order.currency },
                  branchProfile
                );
                const awaitingAcceptance =
                  order.status === 'received' || order.status === 'created';
                const selectedPrep = prepMinutesByOrder[order.id] || 20;

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-amber-400 text-sm">
                            #{order.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-slate-200">
                            {t(`status_${order.status}`)}
                          </span>
                          {order.deliveryPin && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              PIN: {order.deliveryPin}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-300 font-medium mt-1">
                          {order.customerName} • {order.customerPhone || '—'}
                        </div>
                        {order.deliveryAddress && (
                          <div className="text-[11px] text-slate-400">
                            {order.deliveryAddress.streetLine}, {order.deliveryAddress.city}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 mt-1">
                          {order.items.length} ·{' '}
                          <strong className="text-emerald-400">{totalFormatted}</strong>
                          {order.courierName && ` • ${t('assigned_courier')}: ${order.courierName}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {order.estimatedReadyMinutes || 20} {t('minutes')}
                        </span>
                      </div>
                    </div>

                    {awaitingAcceptance && canAcceptDelivery && (
                      <div className="pt-3 border-t border-slate-700/70 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-slate-300">
                            {t('branch_admin_prep_time')}:
                          </label>
                          <select
                            value={selectedPrep}
                            onChange={(e) =>
                              setPrepMinutesByOrder((prev) => ({
                                ...prev,
                                [order.id]: Number(e.target.value),
                              }))
                            }
                            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                          >
                            <option value={15}>15 {t('minutes')}</option>
                            <option value={20}>20 {t('minutes')}</option>
                            <option value={30}>30 {t('minutes')}</option>
                            <option value={45}>45 {t('minutes')}</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptOrder(order.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('branch_admin_accept_order')}</span>
                          </button>
                          <button
                            onClick={() => setRejectingOrderId(order.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{t('action_reject')}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {rejectingOrderId === order.id && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/40 space-y-2">
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder={t('reject_reason_prompt')}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setRejectingOrderId(null);
                              setRejectReason('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                          >
                            {t('cancel')}
                          </button>
                          <button
                            onClick={() => handleConfirmRejectOrder(order.id)}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                          >
                            {t('confirm')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>
                {t('branch_admin_courier_approvals', { count: pendingCouriers.length })}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              {t('branch_admin_courier_approvals_sub', {
                city: getBranchCityName(activeBranch),
              })}
            </p>

            {pendingCouriers.length === 0 ? (
              <div className="text-xs text-slate-500 italic">
                {t('branch_admin_no_pending_couriers')}
              </div>
            ) : (
              <div className="space-y-2">
                {pendingCouriers.map((courier) => (
                  <div
                    key={courier.id}
                    className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{courier.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {courier.email}
                      </div>
                      <div className="text-[10px] text-amber-400 font-semibold">
                        {courier.phone}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleApproveCourier(courier.id)}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                        title={t('btn_approve')}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRejectCourier(courier.id)}
                        className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white"
                        title={t('btn_reject')}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1">
              {t('branch_admin_pending_reservations', { count: pendingReservations.length })}
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              {t('branch_admin_pending_reservations_sub')}
            </p>
            {pendingReservations.length === 0 ? (
              <div className="text-xs text-slate-500 italic">
                {t('branch_admin_no_pending_reservations')}
              </div>
            ) : (
              <div className="space-y-2">
                {pendingReservations.slice(0, 4).map((res) => (
                  <div
                    key={res.id}
                    className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{res.customerName}</div>
                      <div className="text-[10px] text-slate-400">
                        {res.date} · {res.time} · {res.guestsCount} {t('guests')}
                      </div>
                    </div>
                    <button
                      onClick={() => updateReservationStatus(res.id, 'confirmed')}
                      className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shrink-0"
                    >
                      {t('action_confirm')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
