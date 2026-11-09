import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Reservation } from '../../types';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const MyReservationsPage: React.FC = () => {
  const { reservations, branches, restaurants, updateReservationStatus, showToast, t } = useApp();

  const handleCancel = (resId: string) => {
    updateReservationStatus(resId, 'cancelled');
    showToast('Reservación cancelada.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1F1A17]">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9DFCC]">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
              Gestión de Comensal
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#1F1A17]">
              Mis Reservaciones
            </h1>
            <p className="text-xs text-[#7A6E65]">
              Consulta y gestiona las reservas activas en cualquiera de nuestras sucursales.
            </p>
          </div>

          <Link
            to="/reservar"
            className="py-2.5 px-5 rounded-xl bg-[#C8452C] hover:bg-[#A83720] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Reservación</span>
          </Link>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFDF8] rounded-3xl border border-[#E9DFCC] p-8 space-y-3">
            <Calendar className="w-12 h-12 text-[#E8A33D] mx-auto" />
            <h3 className="font-serif font-bold text-lg text-[#1F1A17]">
              No tienes reservaciones registradas
            </h3>
            <p className="text-xs text-[#7A6E65] max-w-sm mx-auto">
              Elige uno de nuestros restaurantes de alta gastronomía y agenda tu mesa ahora mismo.
            </p>
            <Link
              to="/reservar"
              className="inline-block mt-2 py-2 px-4 rounded-xl bg-[#C8452C] text-white text-xs font-bold"
            >
              Reservar Mesa
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.slice(0, 8).map((res: Reservation) => {
              const br = branches.find((b) => b.id === res.branchId);
              const rest = br ? restaurants.find((r) => r.id === br.restaurantId) : null;

              return (
                <div
                  key={res.id}
                  className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#E9DFCC] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#C8452C] bg-[#C8452C]/10 px-2 py-0.5 rounded">
                        {res.code || res.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                          res.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#1F1A17]">
                      {rest?.name || 'SmartRestaurant'} — {br?.name || 'Sede Principal'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#7A6E65]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C8452C]" />
                        <span>{res.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C8452C]" />
                        <span>{res.time} hrs</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#C8452C]" />
                        <span>{res.guestsCount} personas</span>
                      </span>
                      <span className="font-mono font-bold text-[#1F1A17]">
                        Mesa #{res.tableNumber}
                      </span>
                    </div>
                  </div>

                  {res.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => handleCancel(res.id)}
                      className="py-1.5 px-3 rounded-xl bg-[#FBF6EC] hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-[#E9DFCC] text-xs font-semibold transition-colors"
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
