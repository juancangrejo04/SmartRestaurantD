import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reservation, ReservationStatus, Table } from '../types';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';

export const ReservationsView: React.FC = () => {
  const {
    t,
    reservations,
    tables,
    activeBranchId,
    createReservation,
    updateReservationStatus,
    formatDate,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('20:00');
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [notes, setNotes] = useState('');

  const branchTables = tables.filter((t: Table) => t.branchId === activeBranchId);
  const branchReservations = reservations.filter((r: Reservation) => r.branchId === activeBranchId);

  const filteredReservations = branchReservations.filter((r: Reservation) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      `mesa ${r.tableNumber}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedTableId) {
      setFormError('Por favor seleccione una mesa.');
      return;
    }

    const res = createReservation({
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      guestsCount,
      tableId: selectedTableId,
      notes,
    });

    if (!res.success) {
      setFormError(res.error || 'Error al crear la reservación.');
    } else {
      setShowNewModal(false);
      // Reset form
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setNotes('');
      setFormError(null);
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'no-show':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('res_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('res_subtitle')}</p>
        </div>

        <button
          onClick={() => {
            setSelectedTableId(branchTables[0]?.id || '');
            setShowNewModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('new_reservation')}</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por cliente o mesa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'all' ? 'Todas' : t(`res_status_${st}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-3">Fecha y Hora</th>
                <th className="py-3 px-3">Mesa</th>
                <th className="py-3 px-3">Personas</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No se encontraron reservaciones en esta sucursal.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res: Reservation) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{res.customerName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{res.customerEmail}</span>
                        <span>·</span>
                        <span>{res.customerPhone}</span>
                      </div>
                      {res.notes && (
                        <p className="text-[11px] text-amber-700 mt-1 italic">
                          "{res.notes}"
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-mono">
                      <div className="font-semibold text-slate-800">{res.date}</div>
                      <div className="text-[11px] text-slate-500">{res.time} hrs</div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        Mesa #{res.tableNumber}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-mono">
                      {res.guestsCount} comensales
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                          res.status
                        )}`}
                      >
                        {t(`res_status_${res.status}`)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'pending' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'confirmed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition-colors"
                          >
                            {t('confirm_reservation')}
                          </button>
                        )}
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'completed')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-medium transition-colors"
                          >
                            Completar
                          </button>
                        )}
                        {res.status !== 'cancelled' && res.status !== 'completed' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'cancelled')}
                            className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded text-[11px] font-medium transition-colors"
                          >
                            {t('cancel_reservation')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Reservation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 text-slate-900">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">{t('new_reservation')}</h2>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t('res_customer_name')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t('res_customer_phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+57 300 123 4567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('res_customer_email')} *
                </label>
                <input
                  type="email"
                  required
                  placeholder="cliente@ejemplo.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t('res_date')} *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t('res_time')} *
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t('res_guests')} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    required
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('res_table')} (con comprobación anti-colisión ±90 min) *
                </label>
                <select
                  required
                  value={selectedTableId}
                  onChange={(e) => setSelectedTableId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500 font-medium"
                >
                  {branchTables.map((t: Table) => (
                    <option key={t.id} value={t.id}>
                      Mesa #{t.number} ({t.capacity} personas · Zona {t.zone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('res_notes')}
                </label>
                <textarea
                  rows={2}
                  placeholder="Alergias, cumpleaños, ubicación preferida..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Guardar Reservación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
