import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table, TableStatus, TableZone, Branch, Order } from '../types';
import { useCan } from '../core/permissions';
import {
  Grid,
  Plus,
  Users,
  QrCode,
  CheckCircle,
  Clock,
  Sparkles,
  Utensils,
  X,
  Layers,
  BellRing,
  Check,
  Receipt,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface FloorViewProps {
  onOpenQR: (table: Table) => void;
  onOpenOrderForTable: (table: Table) => void;
}

export const FloorView: React.FC<FloorViewProps> = ({ onOpenQR, onOpenOrderForTable }) => {
  const {
    tables,
    activeBranchId,
    branches,
    orders,
    addTable,
    updateTableStatus,
    openTable,
    clearTable,
    resolveWaiterCall,
    formatPrice,
    showToast,
  } = useApp();

  const canManageTables = useCan('tables.manage');
  const canBill = useCan('tables.bill');

  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCapacity, setNewCapacity] = useState<number>(4);
  const [newZone, setNewZone] = useState<TableZone>('indoor');

  // Modal to open a table
  const [openingTableId, setOpeningTableId] = useState<string | null>(null);
  const [openGuestsCount, setOpenGuestsCount] = useState<number>(2);

  const activeBranch = branches.find((b: Branch) => b.id === activeBranchId);
  const branchTables = tables.filter((t: Table) => t.branchId === activeBranchId);

  const filteredTables =
    selectedZone === 'all'
      ? branchTables
      : branchTables.filter((t: Table) => t.zone === selectedZone);

  const callingTables = branchTables.filter((t) => t.activeCallWaiter);

  const zones: { id: string; label: string }[] = [
    { id: 'all', label: 'Todas las Zonas' },
    { id: 'indoor', label: 'Salón Principal' },
    { id: 'terrace', label: 'Terraza' },
    { id: 'vip', label: 'Zona VIP' },
    { id: 'bar', label: 'Barra' },
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

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Active Waiter Call Notification Banner */}
      {callingTables.length > 0 && (
        <div className="bg-amber-500/15 border-2 border-amber-500 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-amber-950 text-sm">
                ¡Llamadas activas de comensales ({callingTables.length})!
              </h3>
              <p className="text-xs text-amber-900">
                Mesas:{' '}
                {callingTables.map((t) => `#${t.number}`).join(', ')} requieren atención inmediata en sala.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {callingTables.map((t) => (
              <button
                key={t.id}
                onClick={() => resolveWaiterCall(t.id)}
                className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Atender Mesa #{t.number}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">{activeBranch?.name}</span>
            <span>·</span>
            <span>{branchTables.length} mesas registradas</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Plano de Mesas en Sala
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervisa el estado en tiempo real, atiende llamados de clientes y administra comandas.
          </p>
        </div>

        {canManageTables && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Mesa</span>
          </button>
        )}
      </div>

      {/* Zone Filters & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Zone buttons */}
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

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-600 overflow-x-auto font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Ocupada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Reservada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <span>Llamando</span>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
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
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl font-bold text-slate-900">
                      #{table.number}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {table.capacity} personas
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
                    {isCalling ? 'Llamando' : table.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="capitalize">Zona {table.zone}</span>
                  {table.currentGuestsCount && (
                    <span className="text-slate-700 font-medium">
                      {table.currentGuestsCount} en mesa
                    </span>
                  )}
                </div>

                {/* If calling waiter */}
                {isCalling && (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <BellRing className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate text-[11px] font-semibold">{table.waiterCallReason || 'Llamada al mesero'}</span>
                    </div>
                    <button
                      onClick={() => resolveWaiterCall(table.id)}
                      className="py-1 px-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shrink-0 shadow-xs"
                    >
                      Resolver
                    </button>
                  </div>
                )}

                {/* Active Order snippet if occupied */}
                {currentOrder && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800">{currentOrder.orderNumber}</span>
                      <span className="font-mono text-amber-600 font-bold">
                        {formatPrice(currentOrder.total)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {currentOrder.items.length} platos · Estado: <strong>{currentOrder.status}</strong>
                    </div>
                    {table.billRequested && (
                      <span className="inline-block mt-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                        Cuenta Solicitada
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenOrderForTable(table)}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Utensils className="w-3.5 h-3.5 text-amber-400" />
                    <span>Comanda</span>
                  </button>

                  <button
                    onClick={() => onOpenQR(table)}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-slate-600" />
                    <span>Ver QR</span>
                  </button>
                </div>

                {/* Status Toggle buttons */}
                {isAvailable && (
                  <button
                    onClick={() => {
                      setOpeningTableId(table.id);
                      setOpenGuestsCount(table.capacity);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                  >
                    + Abrir Mesa
                  </button>
                )}

                {isOccupied && (
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Liberar Mesa #${table.number} y dejarla disponible?`)) {
                        clearTable(table.id);
                      }
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Liberar Mesa</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Open Table with Guests Count */}
      {openingTableId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-lg text-slate-900">
              Abrir Mesa para Comensales
            </h3>
            <p className="text-xs text-slate-500">
              Indica cuántas personas van a ocupar la mesa para inicializar la atención en sala.
            </p>

            <form onSubmit={handleConfirmOpenTable} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Número de Comensales
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
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
                >
                  Confirmar Apertura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Table */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-lg text-slate-900">
              Agregar Nueva Mesa a Sala
            </h3>
            <form onSubmit={handleAddTableSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Capacidad de Personas
                </label>
                <select
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  {[2, 4, 6, 8, 10, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} personas
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Zona
                </label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value as TableZone)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="indoor">Salón Principal</option>
                  <option value="terrace">Terraza</option>
                  <option value="vip">Zona VIP</option>
                  <option value="bar">Barra</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
                >
                  Crear Mesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
