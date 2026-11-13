import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Play,
  Check,
  Bike,
  Utensils,
  Filter,
} from 'lucide-react';
import { Order } from '../../types';

export const KitchenDashboardView: React.FC = () => {
  const {
    orders,
    menuItems,
    activeBranchId,
    branches,
    currentUser,
    advanceKitchenOrder,
    advanceDishStatus,
    showToast,
    t,
    getBranchDisplayName,
  } = useApp();

  const [stationFilter, setStationFilter] = useState<'all' | 'mains' | 'starters' | 'drinks'>(
    'all'
  );
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const scopedBranchId =
    currentUser?.role !== 'owner' &&
    currentUser?.role !== 'platform_admin' &&
    currentUser?.assignedBranchId
      ? currentUser.assignedBranchId
      : activeBranchId;

  const activeBranch = branches.find((b) => b.id === scopedBranchId) || branches[0];

  const itemMatchesStation = (menuItemId: string): boolean => {
    if (stationFilter === 'all') return true;
    const found = menuItems.find((m) => m.id === menuItemId);
    if (!found) return true;
    if (stationFilter === 'mains') {
      return found.category === 'mains' || found.category === 'specials';
    }
    return found.category === stationFilter;
  };

  const branchOrders = orders.filter(
    (o) =>
      o.branchId === activeBranch.id &&
      o.status !== 'delivered' &&
      o.status !== 'cancelled' &&
      o.items.some((item) => itemMatchesStation(item.menuItemId))
  );

  const receivedOrders = branchOrders.filter(
    (o) => o.status === 'received' || o.status === 'created'
  );
  const preparingOrders = branchOrders.filter((o) => o.status === 'preparing');
  const readyOrders = branchOrders.filter((o) => o.status === 'ready');
  const deliveringOrders = branchOrders.filter((o) => o.status === 'delivering');

  const getNextDishStatus = (
    cur: 'queued' | 'preparing' | 'ready' | 'served'
  ): 'preparing' | 'ready' | 'served' | null => {
    if (cur === 'queued') return 'preparing';
    if (cur === 'preparing') return 'ready';
    if (cur === 'ready') return 'served';
    return null;
  };

  const handleAdvance = (orderId: string) => {
    advanceKitchenOrder(orderId);
    showToast(t('kds_order_advanced', { id: orderId.slice(-4) }), 'info');
  };

  const renderOrderCard = (order: Order, stage: 'received' | 'preparing' | 'ready') => {
    const isDelivery = order.orderType === 'delivery' || !order.tableNumber;
    const elapsedMins = Math.max(
      0,
      Math.floor((nowMs - new Date(order.createdAt).getTime()) / 60000)
    );
    const visibleItems = order.items.filter((it) => itemMatchesStation(it.menuItemId));

    return (
      <div
        key={order.id}
        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between space-y-3"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-amber-400 text-sm">
              #{order.orderNumber}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                isDelivery
                  ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
              }`}
            >
              {isDelivery ? <Bike className="w-3 h-3" /> : <Utensils className="w-3 h-3" />}
              <span>
                {isDelivery
                  ? t('order_type_delivery')
                  : `${t('table')} #${order.tableNumber}`}
              </span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {elapsedMins} {t('elapsed_min')}
            </span>
            <span>
              {t('estimated_ready')}: {order.estimatedReadyMinutes || 20} {t('minutes')}
            </span>
          </div>

          {order.kitchenNotes && (
            <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium">
              {t('notes')}: {order.kitchenNotes}
            </div>
          )}

          <div className="mt-3 divide-y divide-slate-800/80 text-xs">
            {visibleItems.map((item, idx) => {
              const dishKey = `dish_${idx}_${item.menuItemId}`;
              const currentDishStatus = order.dishStatuses?.[dishKey] || 'queued';
              const nextDishStatus = getNextDishStatus(currentDishStatus);

              return (
                <div
                  key={dishKey}
                  className="py-1.5 flex items-center justify-between gap-2"
                >
                  <span className="text-slate-200 truncate">
                    <strong className="text-amber-400 font-mono mr-1.5">
                      {item.quantity}×
                    </strong>
                    {item.name}
                  </span>
                  {nextDishStatus ? (
                    <button
                      onClick={() => advanceDishStatus(order.id, dishKey, nextDishStatus)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-[10px] font-mono font-bold text-amber-300 shrink-0 transition-colors"
                    >
                      {t(`dish_status_${currentDishStatus}`)} →
                    </button>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 text-[10px] font-mono font-bold shrink-0">
                      {t(`dish_status_${currentDishStatus}`)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          {stage === 'received' && (
            <button
              onClick={() => handleAdvance(order.id)}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>{t('start_prep')}</span>
            </button>
          )}

          {stage === 'preparing' && (
            <button
              onClick={() => handleAdvance(order.id)}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t('mark_ready')}</span>
            </button>
          )}

          {stage === 'ready' && (
            <div className="w-full text-center py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold">
              {isDelivery ? t('kds_waiting_courier') : t('kds_waiting_waiter')}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
            {t('kds_title')}
          </span>
          <h1 className="text-2xl font-bold font-serif text-white mt-1">
            {t('dashboard_kitchen_title')} — {getBranchDisplayName(activeBranch)}
          </h1>
          <p className="text-xs text-slate-400">{t('kds_subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={stationFilter}
            onChange={(e) =>
              setStationFilter(e.target.value as 'all' | 'mains' | 'starters' | 'drinks')
            }
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
          >
            <option value="all">{t('all_categories')}</option>
            <option value="mains">{t('cat_mains')}</option>
            <option value="starters">{t('cat_starters')}</option>
            <option value="drinks">{t('cat_drinks')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t('col_received')}
            </span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
              {receivedOrders.length}
            </span>
          </div>
          <div className="space-y-3">
            {receivedOrders.map((o) => renderOrderCard(o, 'received'))}
            {receivedOrders.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-600">
                {t('kds_empty_col')}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {t('col_preparing')}
            </span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
              {preparingOrders.length}
            </span>
          </div>
          <div className="space-y-3">
            {preparingOrders.map((o) => renderOrderCard(o, 'preparing'))}
            {preparingOrders.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-600">
                {t('kds_empty_col')}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {t('col_ready')}
            </span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              {readyOrders.length}
            </span>
          </div>
          <div className="space-y-3">
            {readyOrders.map((o) => renderOrderCard(o, 'ready'))}
            {readyOrders.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-600">
                {t('kds_empty_col')}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-4 space-y-3 hidden lg:block">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {t('courier_in_transit')}
            </span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
              {deliveringOrders.length}
            </span>
          </div>
          <div className="space-y-3">
            {deliveringOrders.map((o) => (
              <div
                key={o.id}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs"
              >
                <div className="font-mono font-bold text-blue-400">#{o.orderNumber}</div>
                <div className="text-slate-300 mt-1">
                  {t('assigned_courier')}: {o.courierName || '—'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {o.deliveryAddress?.streetLine}
                </div>
              </div>
            ))}
            {deliveringOrders.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-600">
                {t('kds_empty_col')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
