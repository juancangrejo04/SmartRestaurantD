import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Table, TableZone, Branch } from '../types';
import { useCan } from '../core/permissions';
import {
  Plus,
  QrCode,
  Utensils,
  BellRing,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';

interface FloorViewProps {
  onOpenQR?: (table: Table) => void;
  onOpenOrderForTable?: (table: Table) => void;
}

export const FloorView: React.FC<FloorViewProps> = ({ onOpenQR, onOpenOrderForTable }) => {
  const navigate = useNavigate();
  const {
    tables,
    activeBranchId,
    branches,
    orders,
    addTable,
    openTable,
    clearTable,
    resolveWaiterCall,
    formatPrice,
    getBranchDisplayName,
    t,
  } = useApp();

  const canManageTables = useCan('tables.manage');

  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCapacity, setNewCapacity] = useState<number>(4);
  const [newZone, setNewZone] = useState<TableZone>('indoor');
  const [openingTableId, setOpeningTableId] = useState<string | null>(null);
  const [openGuestsCount, setOpenGuestsCount] = useState<number>(2);
  const [qrModalTable, setQrModalTable] = useState<Table | null>(null);

  const activeBranch = branches.find((b: Branch) => b.id === activeBranchId);
  const branchTables = tables.filter((tItem: Table) => tItem.branchId === activeBranchId);

  const filteredTables =
    selectedZone === 'all'
      ? branchTables
      : branchTables.filter((tItem: Table) => tItem.zone === selectedZone);

  const callingTables = branchTables.filter((tItem) => tItem.activeCallWaiter);

  const zones: { id: string; label: string }[] = [
    { id: 'all', label: t('all_zones') },
    { id: 'indoor', label: t('zone_indoor') },
    { id: 'terrace', label: t('zone_terrace') },
    { id: 'vip', label: t('zone_vip') },
    { id: 'bar', label: t('zone_bar') },
  ];

  const handleAddTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTable(newCapacity, newZone);
    setShowAddModal(false);
  };

  const handleConfirmOpenTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (openingTableId) {
      openTable(openingTableId, openGuestsCount);
      setOpeningTableId(null);
    }
  };

  const handleViewQR = (table: Table) => {
    if (onOpenQR) {
      onOpenQR(table);
    } else {
      setQrModalTable(table);
    }
  };

  const handleViewOrder = (table: Table) => {
    if (onOpenOrderForTable) {
      onOpenOrderForTable(table);
    } else {
      navigate('/staff/app/pedidos-qr');
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {callingTables.length > 0 && (
        <div className="bg-amber-500/15 border-2 border-amber-500 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-amber-950 text-sm">
                {t('active_waiter_calls', { count: callingTables.length })}
              </h3>
              <p className="text-xs text-amber-900">
                {t('table_label')}: {callingTables.map((item) => `#${item.number}`).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {callingTables.map((tableItem) => (
              <button
                key={tableItem.id}
                onClick={() => resolveWaiterCall(tableItem.id)}
                className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                {t('attend')} #{tableItem.number}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">{getBranchDisplayName(activeBranch)}</span>
            <span>·</span>
            <span>{branchTables.length} {t('table_label')}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('floor_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('floor_subtitle')}
          </p>
        </div>

        {canManageTables && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('floor_add_table_btn')}</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedZone === z.id
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 overflow-x-auto font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>{t('status_available')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>{t('status_occupied')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>{t('status_reserved')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <span>{t('calling_waiter')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const currentOrder = orders.find((o) => o.id === table.currentOrderId);
          const isCalling = table.activeCallWaiter;
          const isOccupied = table.status === 'occupied';
          const isAvailable = table.status === 'available';
          const isReserved = table.status === 'reserved';

          return (
            <div
              key={table.id}
              className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 relative ${
                isCalling
                  ? 'border-amber-500 ring-4 ring-amber-500/20 shadow-lg'
                  : isOccupied
                  ? 'border-rose-200 shadow-sm'
                  : isReserved
                  ? 'border-blue-200 shadow-sm'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl font-bold text-slate-900">
                      #{table.number}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {table.capacity} {table.capacity === 1 ? t('guest_singular') : t('guest_plural')}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                      isCalling
                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                        : isOccupied
                        ? 'bg-rose-100 text-rose-800'
                        : isReserved
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isCalling
                      ? t('calling_waiter')
                      : isOccupied
                      ? t('status_occupied')
                      : isReserved
                      ? t('status_reserved')
                      : t('status_available')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="capitalize">{t('zone_' + table.zone)}</span>
                  {table.currentGuestsCount && (
                    <span className="text-slate-700 font-medium">
                      {table.currentGuestsCount} {t('guest_plural')}
                    </span>
                  )}
                </div>

                {isCalling && (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <BellRing className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate text-[11px] font-semibold">
                        {table.waiterCallReason || t('call_waiter')}
                      </span>
                    </div>
                    <button
                      onClick={() => resolveWaiterCall(table.id)}
                      className="py-1 px-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shrink-0 shadow-xs"
                    >
                      {t('attend')}
                    </button>
                  </div>
                )}

                {currentOrder && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800">{currentOrder.orderNumber}</span>
                      <span className="font-mono text-amber-600 font-bold">
                        {formatPrice(currentOrder.totalMinorUnits ?? currentOrder.total ?? 0)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {currentOrder.items.length} · <strong>{t(`status_${currentOrder.status}`)}</strong>
                    </div>
                    {table.billRequested && (
                      <span className="inline-block mt-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                        {t('bill_requested')}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleViewOrder(table)}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Utensils className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('view_order')}</span>
                  </button>

                  <button
                    onClick={() => handleViewQR(table)}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t('action_view_qr')}</span>
                  </button>
                </div>

                {isAvailable && (
                  <button
                    onClick={() => {
                      setOpeningTableId(table.id);
                      setOpenGuestsCount(table.capacity);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                  >
                    + {t('open_table')}
                  </button>
                )}

                {isOccupied && (
                  <button
                    onClick={() => clearTable(table.id)}
                    className="w-full py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>{t('clear_table')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {openingTableId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">{t('floor_open_modal_title')}</h3>
            <p className="text-xs text-slate-500">{t('floor_open_modal_desc')}</p>

            <form onSubmit={handleConfirmOpenTable} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('party_size')}
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={openGuestsCount}
                  onChange={(e) => setOpenGuestsCount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpeningTableId(null)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
                >
                  {t('confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">{t('floor_add_modal_title')}</h3>
            <form onSubmit={handleAddTableSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('capacity_label')}
                </label>
                <select
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  {[2, 4, 6, 8, 10, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} {t('guest_plural')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('floor_zone_label')}
                </label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value as TableZone)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="indoor">{t('zone_indoor')}</option>
                  <option value="terrace">{t('zone_terrace')}</option>
                  <option value="vip">{t('zone_vip')}</option>
                  <option value="bar">{t('zone_bar')}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
                >
                  {t('create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {qrModalTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {t('qr_code_menu')} · #{qrModalTable.number}
              </h3>
              <button
                onClick={() => setQrModalTable(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
              <QrCode className="w-28 h-28 text-slate-900" />
              <p className="text-xs font-mono text-slate-500 break-all">
                /#/mesa/{qrModalTable.branchId}/{qrModalTable.id}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setQrModalTable(null)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('close')}
              </button>
              <a
                href={`/#/mesa/${qrModalTable.branchId}/${qrModalTable.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <span>{t('open_new_tab')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
