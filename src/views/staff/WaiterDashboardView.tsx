import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Receipt,
  User,
  Bike,
  CheckCircle2,
  XCircle,
  CreditCard,
} from 'lucide-react';
import { Table, TableStatus } from '../../types';
import { MoneyUtils } from '../../core/money';
import { getRegionProfile } from '../../data/regions';
import { can } from '../../core/permissions';

export const WaiterDashboardView: React.FC = () => {
  const {
    tables,
    orders,
    activeBranchId,
    branches,
    currentUser,
    openTable,
    clearTable,
    resolveWaiterCall,
    createOrder,
    markOrderBillPaid,
    acceptDeliveryOrder,
    rejectDeliveryOrder,
    menuItems,
    showToast,
    t,
    loc,
    getBranchDisplayName,
  } = useApp();

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showBillModal, setShowBillModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const scopedBranchId =
    currentUser?.role !== 'owner' &&
    currentUser?.role !== 'platform_admin' &&
    currentUser?.assignedBranchId
      ? currentUser.assignedBranchId
      : activeBranchId;

  const activeBranch = branches.find((b) => b.id === scopedBranchId) || branches[0];
  const branchProfile = getRegionProfile(activeBranch.country);

  const branchTables = tables.filter((tbl) => tbl.branchId === activeBranch.id);
  const selectedTable = branchTables.find((tbl) => tbl.id === selectedTableId) || null;

  const branchMenuItems = menuItems.filter(
    (m) => m.countryCode === activeBranch.country && m.available
  );

  const incomingDeliveries = orders.filter(
    (o) =>
      o.branchId === activeBranch.id &&
      o.orderType === 'delivery' &&
      (o.status === 'received' || o.status === 'created')
  );

  const canAcceptDelivery = can(currentUser, 'orders.acceptDelivery', {
    branchId: activeBranch.id,
  });
  const canBill = can(currentUser, 'tables.bill', { branchId: activeBranch.id });
  const canDiscount = can(currentUser, 'discounts.refunds', {
    branchId: activeBranch.id,
  });

  const activeTableOrder = selectedTable?.currentOrderId
    ? orders.find((o) => o.id === selectedTable.currentOrderId)
    : undefined;

  const getStatusBadge = (tbl: Table) => {
    if (tbl.billRequested) {
      return {
        bg: 'bg-blue-950/60 border-blue-800 text-blue-400',
        text: t('bill_requested'),
        dot: 'bg-blue-500',
      };
    }
    if (tbl.activeCallWaiter) {
      return {
        bg: 'bg-purple-950/60 border-purple-800 text-purple-400',
        text: t('calling_waiter'),
        dot: 'bg-purple-500 animate-ping',
      };
    }
    const status: TableStatus = tbl.status;
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-950/60 border-emerald-800 text-emerald-400',
          text: t('status_available'),
          dot: 'bg-emerald-500',
        };
      case 'occupied':
        return {
          bg: 'bg-rose-950/60 border-rose-800 text-rose-400',
          text: t('status_occupied'),
          dot: 'bg-rose-500',
        };
      case 'reserved':
        return {
          bg: 'bg-amber-950/60 border-amber-800 text-amber-400',
          text: t('status_reserved'),
          dot: 'bg-amber-500',
        };
      case 'cleaning':
        return {
          bg: 'bg-slate-800 border-slate-700 text-slate-300',
          text: t('status_cleaning'),
          dot: 'bg-slate-400',
        };
      default:
        return {
          bg: 'bg-slate-800 border-slate-700 text-slate-300',
          text: status,
          dot: 'bg-slate-400',
        };
    }
  };

  const handleAddItemToTableOrder = async () => {
    if (!selectedTable || !selectedDishId) return;
    const item = branchMenuItems.find((m) => m.id === selectedDishId);
    if (!item) return;

    try {
      await createOrder(
        selectedTable.id,
        [
          {
            menuItemId: item.id,
            name: loc(item.name),
            quantity,
            unitPriceMinorUnits: item.priceMinorUnits,
            subtotalMinorUnits: item.priceMinorUnits * quantity,
          },
        ],
        branchProfile.tipPolicy.defaultBps / 100,
        `${t('table')} #${selectedTable.number}`
      );
      showToast(t('waiter_item_added', { table: selectedTable.number }), 'success');
      setSelectedDishId('');
      setQuantity(1);
    } catch {
      showToast(t('error'), 'error');
    }
  };

  const handleCloseTableBill = () => {
    if (!selectedTable) return;
    if (activeTableOrder) {
      markOrderBillPaid(activeTableOrder.id, paymentMethod);
    }
    clearTable(selectedTable.id);
    setShowBillModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
            {t('waiter_badge')}
          </span>
          <h1 className="text-2xl font-bold font-serif text-white mt-1">
            {t('dashboard_waiter_title')} — {getBranchDisplayName(activeBranch)}
          </h1>
          <p className="text-xs text-slate-400">{t('dashboard_waiter_subtitle')}</p>
        </div>
      </div>

      {/* Incoming delivery queue if user has acceptDelivery permission */}
      {canAcceptDelivery && incomingDeliveries.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-3">
          <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Bike className="w-4 h-4" />
            <span>
              {t('waiter_incoming_deliveries', { count: incomingDeliveries.length })}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incomingDeliveries.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-mono font-bold text-white text-xs">
                    #{ord.orderNumber} · {ord.customerName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {MoneyUtils.format(
                      { amount: ord.totalMinorUnits || 0, currency: ord.currency },
                      branchProfile
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => acceptDeliveryOrder(ord.id, 20)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('branch_admin_accept_order')}</span>
                  </button>
                  <button
                    onClick={() =>
                      rejectDeliveryOrder(ord.id, t('branch_admin_default_reject_reason'))
                    }
                    className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white"
                    title={t('action_reject')}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-4">
            {t('waiter_floor_tables', { count: branchTables.length })}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {branchTables.map((tbl) => {
              const badge = getStatusBadge(tbl);
              const isSelected = selectedTable?.id === tbl.id;
              const hasAlert = tbl.activeCallWaiter || tbl.billRequested;

              return (
                <div
                  key={tbl.id}
                  onClick={() => setSelectedTableId(tbl.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg ring-2 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-bold text-lg text-white">
                      #{tbl.number}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {t('capacity_label', { count: tbl.capacity })}
                    </span>
                  </div>

                  <div
                    className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 ${badge.bg}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                    <span className="truncate">{badge.text}</span>
                  </div>

                  {hasAlert && (
                    <div className="mt-2 p-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                      <Bell className="w-3 h-3 text-amber-400 animate-bounce" />
                      <span>
                        {tbl.billRequested ? t('bill_requested') : t('calling_waiter')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
          {selectedTable ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {t('table')} #{selectedTable.number}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {t('capacity_label', { count: selectedTable.capacity })} •{' '}
                    {t(`zone_${selectedTable.zone}`)}
                  </span>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${
                    getStatusBadge(selectedTable).bg
                  }`}
                >
                  {getStatusBadge(selectedTable).text}
                </div>
              </div>

              {selectedTable.activeCallWaiter && (
                <div className="p-3 bg-amber-950/60 border border-amber-800 rounded-xl flex items-center justify-between gap-2">
                  <div className="text-xs text-amber-300">
                    <span className="font-bold">{t('calling_waiter')}:</span>{' '}
                    {selectedTable.waiterCallReason || t('call_waiter')}
                  </div>
                  <button
                    onClick={() => resolveWaiterCall(selectedTable.id)}
                    className="px-2.5 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg shrink-0"
                  >
                    {t('attend')}
                  </button>
                </div>
              )}

              {activeTableOrder && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">
                      #{activeTableOrder.orderNumber}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {MoneyUtils.format(
                        {
                          amount: activeTableOrder.totalMinorUnits || 0,
                          currency: activeTableOrder.currency,
                        },
                        branchProfile
                      )}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {activeTableOrder.items.map((item, idx) => {
                      const dKey = `dish_${idx}_${item.menuItemId}`;
                      const dStatus = activeTableOrder.dishStatuses?.[dKey] || 'queued';
                      return (
                        <div key={dKey} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 truncate">
                            {item.quantity}× {item.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {t(`dish_status_${dStatus}`)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedTable.status === 'available' ? (
                <button
                  onClick={() => openTable(selectedTable.id, selectedTable.capacity)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{t('open_table')}</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-800/80 rounded-xl space-y-2">
                    <label className="text-xs font-bold text-white block">
                      {t('action_new_order')}
                    </label>
                    <select
                      value={selectedDishId}
                      onChange={(e) => setSelectedDishId(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    >
                      <option value="">{t('waiter_select_dish')}</option>
                      {branchMenuItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {loc(item.name)} —{' '}
                          {MoneyUtils.format(
                            {
                              amount: item.priceMinorUnits,
                              currency: activeBranch.currency,
                            },
                            branchProfile
                          )}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-20 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white text-center font-bold"
                      />
                      <button
                        onClick={handleAddItemToTableOrder}
                        disabled={!selectedDishId}
                        className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all disabled:opacity-50"
                      >
                        {t('waiter_send_kitchen')}
                      </button>
                    </div>
                  </div>

                  {canBill && (
                    <button
                      onClick={() => setShowBillModal(true)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-700 text-slate-200 hover:text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>{t('action_free_table')}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              {t('waiter_select_table_hint')}
            </div>
          )}
        </div>
      </div>

      {showBillModal && selectedTable && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">
                {t('waiter_close_bill_title', { table: selectedTable.number })}
              </h3>
            </div>

            {activeTableOrder && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{t('subtotal')}</span>
                  <span>
                    {MoneyUtils.format(
                      {
                        amount: activeTableOrder.subtotalMinorUnits || 0,
                        currency: activeTableOrder.currency,
                      },
                      branchProfile
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t('tax')}</span>
                  <span>
                    {MoneyUtils.format(
                      {
                        amount: activeTableOrder.taxAmountMinorUnits || 0,
                        currency: activeTableOrder.currency,
                      },
                      branchProfile
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t('tip')}</span>
                  <span>
                    {MoneyUtils.format(
                      {
                        amount: activeTableOrder.tipAmountMinorUnits || 0,
                        currency: activeTableOrder.currency,
                      },
                      branchProfile
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>{t('total')}</span>
                  <span className="text-emerald-400">
                    {MoneyUtils.format(
                      {
                        amount: activeTableOrder.totalMinorUnits || 0,
                        currency: activeTableOrder.currency,
                      },
                      branchProfile
                    )}
                  </span>
                </div>
              </div>
            )}

            {!canDiscount && (
              <div className="text-[11px] text-slate-400 bg-slate-800/70 px-3 py-2 rounded-xl">
                {t('waiter_no_discount_notice')}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                {t('select_payment_method')}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                {branchProfile.paymentMethods.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {t(pm.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBillModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCloseTableBill}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
