import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Reservation } from '../../types';
import { Calendar, Clock, Users, Plus, LogIn } from 'lucide-react';

export const MyReservationsPage: React.FC = () => {
  const {
    reservations,
    branches,
    restaurants,
    currentUser,
    isAuthenticated,
    updateReservationStatus,
    getBranchDisplayName,
    showToast,
    t,
  } = useApp();

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-[#FBF6EC] py-16 px-4 font-sans text-center">
        <div className="max-w-md mx-auto bg-[#FFFDF8] rounded-3xl p-8 border border-[#E9DFCC] shadow-lg space-y-4">
          <Calendar className="w-12 h-12 text-[#E8A33D] mx-auto" />
          <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
            {t('my_reservations_title')}
          </h2>
          <p className="text-xs text-[#7A6E65]">{t('my_reservations_login_prompt')}</p>
          <Link
            to="/login?redirect=/mis-reservas"
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] text-white text-xs font-bold shadow-md shadow-[#C8452C]/20"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('auth_login_btn')}</span>
          </Link>
        </div>
      </div>
    );
  }

  const isStaff = ['owner', 'platform_admin', 'admin', 'branch_admin'].includes(currentUser.role);
  const myReservations = isStaff
    ? reservations
    : reservations.filter(
        (r) =>
          r.userId === currentUser.id ||
          (currentUser.email &&
            r.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
      );

  const handleCancel = (resId: string) => {
    if (window.confirm(t('my_reservations_cancel_confirm'))) {
      updateReservationStatus(resId, 'cancelled');
      showToast(t('my_reservations_cancelled_toast'), 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1F1A17]">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9DFCC]">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
              {t('my_reservations_badge')}
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#1F1A17]">
              {t('my_reservations_title')}
            </h1>
            <p className="text-xs text-[#7A6E65]">{t('my_reservations_subtitle')}</p>
          </div>

          <Link
            to="/reservar"
            className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('my_reservations_new_btn')}</span>
          </Link>
        </div>

        {myReservations.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFDF8] rounded-3xl border border-[#E9DFCC] p-8 space-y-3">
            <Calendar className="w-12 h-12 text-[#E8A33D] mx-auto" />
            <h3 className="font-serif font-bold text-lg text-[#1F1A17]">
              {t('my_reservations_empty_title')}
            </h3>
            <p className="text-xs text-[#7A6E65] max-w-sm mx-auto">
              {t('my_reservations_empty_desc')}
            </p>
            <Link
              to="/reservar"
              className="inline-block mt-2 py-2.5 px-6 rounded-2xl bg-[#C8452C] text-white text-xs font-bold shadow-md shadow-[#C8452C]/20"
            >
              {t('cta_reserve')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myReservations.map((res: Reservation) => {
              const br = branches.find((b) => b.id === res.branchId);
              const rest = restaurants.find(
                (r) => r.id === res.restaurantId || r.id === br?.restaurantId
              );

              return (
                <div
                  key={res.id}
                  className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#E9DFCC] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#C8452C] bg-[#C8452C]/10 px-2.5 py-0.5 rounded-full">
                        {res.code || res.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                          res.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.status === 'cancelled' || res.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t(`res_status_${res.status}`)}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#1F1A17]">
                      {rest?.name || 'SmartRestaurant'} — {br ? getBranchDisplayName(br) : t('branch_label')}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#7A6E65]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C8452C]" />
                        <span>{res.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C8452C]" />
                        <span>{res.time}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#C8452C]" />
                        <span>
                          {res.guestsCount} {t('guests_label')}
                        </span>
                      </span>
                      <span className="font-mono font-bold text-[#1F1A17]">
                        {t('table_label')} #{res.tableNumber}
                      </span>
                    </div>
                  </div>

                  {res.status !== 'cancelled' &&
                    res.status !== 'completed' &&
                    res.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => handleCancel(res.id)}
                        className="py-1.5 px-3 rounded-xl bg-[#FBF6EC] hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-[#E9DFCC] text-xs font-semibold transition-colors"
                      >
                        {t('my_reservations_cancel_btn')}
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
