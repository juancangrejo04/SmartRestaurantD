import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table, TableStatus, TableZone, Branch, Order } from '../types';
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
} from 'lucide-react';

interface FloorViewProps {
  onOpenQR: (table: Table) => void;
  onOpenOrderForTable: (table: Table) => void;
}

export const FloorView: React.FC<FloorViewProps> = ({ onOpenQR, onOpenOrderForTable }) => {
  const {
    t,
    tables,
    activeBranchId,
    branches,
    addTable,
    updateTableStatus,
    orders,
    formatPrice,
  } = useApp();

  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCapacity, setNewCapacity] = useState<number>(4);
  const [newZone, setNewZone] = useState<TableZone>('indoor');

  const activeBranch = branches.find((b: Branch) => b.id === activeBranchId);
  const branchTables = tables.filter((t: Table) => t.branchId === activeBranchId);

  const filteredTables =
    selectedZone === 'all'
      ? branchTables
      : branchTables.filter((t: Table) => t.zone === selectedZone);

  const zones: { id: string; label: string }[] = [
    { id: 'all', label: 'Todas las Zonas' },
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

  const getStatusColor = (status: TableStatus): { bg: string; dot: string; badge: string } => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800',
          dot: 'bg-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800',
        };
      case 'occupied':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-800',
          dot: 'bg-rose-500',
          badge: 'bg-rose-100 text-rose-800',
        };
      case 'reserved':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-800',
          dot: 'bg-blue-500',
          badge: 'bg-blue-100 text-blue-800',
        };
      case 'cleaning':
      default:
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-800',
          dot: 'bg-amber-500',
          badge: 'bg-amber-100 text-amber-800',
        };
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{activeBranch?.name}</span>
            <span>·</span>
            <span>{branchTables.length} mesas registradas</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('floor_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('floor_subtitle')}</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add_table')}</span>
        </button>
      </div>

      {/* Zone Filters & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Zone buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedZone === z.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-600 overflow-x-auto">
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
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>{t('status_cleaning')}</span>
          </div>
        </div>
      </div>

      {/* Table Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table: Table) => {
          const style = getStatusColor(table.status);
          const activeOrder = orders.find((o: Order) => o.id === table.currentOrderId);

          return (
            <div
              key={table.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between bg-white shadow-xs hover:shadow-md ${style.bg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black font-mono text-slate-900">
                      #{table.number}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 capitalize">
                      {table.zone}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${style.badge}`}
                  >
                    {t(`status_${table.status}`)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {table.capacity} {t('capacity_person')}
                  </span>
                </div>

                {/* If occupied, show live ticket summary */}
                {activeOrder && (
                  <div className="mb-3 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="flex justify-between font-mono font-semibold text-slate-800">
                      <span>{activeOrder.orderNumber}</span>
                      <span className="text-amber-600">{formatPrice(activeOrder.total)}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                      {activeOrder.items.length} ítems · Estado: {activeOrder.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200/80 space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  {/* Status Toggle Button */}
                  <select
                    value={table.status}
                    onChange={(e) => updateTableStatus(table.id, e.target.value as TableStatus)}
                    className="w-full text-[11px] font-medium bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="available">{t('status_available')}</option>
                    <option value="occupied">{t('status_occupied')}</option>
                    <option value="reserved">{t('status_reserved')}</option>
                    <option value="cleaning">{t('status_cleaning')}</option>
                  </select>

                  {/* QR Code Action */}
                  <button
                    onClick={() => onOpenQR(table)}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-medium transition-colors"
                    title="Ver QR de Mesa"
                  >
                    <QrCode className="w-3.5 h-3.5 text-slate-600" />
                    <span>Ver QR</span>
                  </button>
                </div>

                {/* Open order / ticket */}
                <button
                  onClick={() => onOpenOrderForTable(table)}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>{activeOrder ? 'Ver Comanda' : 'Tomar Pedido'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 text-slate-900">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900">{t('add_table')}</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTableSubmit} className="p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Capacidad de Comensales
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Zona del Restaurante
                </label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value as TableZone)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="indoor">{t('zone_indoor')}</option>
                  <option value="terrace">{t('zone_terrace')}</option>
                  <option value="vip">{t('zone_vip')}</option>
                  <option value="bar">{t('zone_bar')}</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
