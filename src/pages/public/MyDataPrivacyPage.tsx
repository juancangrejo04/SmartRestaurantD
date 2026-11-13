import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getRegionProfile } from '../../data/regions';
import { authService } from '../../services/authService';
import {
  ShieldCheck,
  Download,
  Trash2,
  AlertTriangle,
  FileText,
  CheckCircle,
  LogIn,
} from 'lucide-react';

export const MyDataPrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    isAuthenticated,
    orders,
    reservations,
    reviews,
    logoutUser,
    showToast,
    t,
  } = useApp();

  const [erasureConfirmed, setErasureConfirmed] = useState(false);
  const [erasureCompleted, setErasureCompleted] = useState(false);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-[#FBF6EC] py-16 px-4 text-center font-sans">
        <div className="max-w-md mx-auto bg-[#FFFDF8] rounded-3xl p-8 border border-[#E9DFCC] shadow-lg space-y-4">
          <ShieldCheck className="w-12 h-12 text-[#E8A33D] mx-auto" />
          <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
            {t('privacy_portal_title')}
          </h2>
          <p className="text-xs text-[#7A6E65]">{t('privacy_login_prompt')}</p>
          <Link
            to="/login?redirect=/mis-datos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C8452C] text-white text-xs font-bold"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('auth_login_btn')}</span>
          </Link>
        </div>
      </div>
    );
  }

  const homeRegion = currentUser.homeRegion || currentUser.country;
  const homeProfile = getRegionProfile(homeRegion);

  const ownOrdersCount = orders.filter(
    (o) =>
      o.userId === currentUser.id ||
      (o.customerEmail && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  ).length;
  const ownReservationsCount = reservations.filter(
    (r) =>
      r.userId === currentUser.id ||
      (r.customerEmail && r.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  ).length;
  const ownReviewsCount = reviews.filter(
    (rv) =>
      rv.userId === currentUser.id ||
      (rv.customerEmail && rv.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  ).length;

  const handleExportJSON = () => {
    const exported = authService.getPersonalDataForUser(currentUser.id, {
      orders,
      reservations,
      reviews,
    });
    if (!exported) return;

    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal_data_${currentUser.homeRegion || currentUser.country}_${currentUser.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('privacy_export_json_toast'), 'success');
  };

  const handleExportCSV = () => {
    const exported = authService.getPersonalDataForUser(currentUser.id, {
      orders,
      reservations,
      reviews,
    });
    if (!exported) return;

    const escapeCsv = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Section', 'Field', 'Value'].join(','),
      ['Profile', 'UserId', escapeCsv(exported.profile.id)].join(','),
      ['Profile', 'Name', escapeCsv(exported.profile.name)].join(','),
      ['Profile', 'Email', escapeCsv(exported.profile.email)].join(','),
      ['Profile', 'Phone', escapeCsv(exported.profile.phone)].join(','),
      ['Profile', 'HomeRegion', escapeCsv(exported.homeRegion)].join(','),
      ['Profile', 'DataRegion', escapeCsv(exported.dataRegion)].join(','),
      ['Profile', 'ApplicableLaw', escapeCsv(exported.applicableLaw)].join(','),
      ['Profile', 'ConsentAtUtc', escapeCsv(exported.profile.consentAcceptedAtUtc || '')].join(','),
      ...exported.orders.map((o) =>
        ['Order', escapeCsv(o.orderNumber), escapeCsv(`${o.createdAt} | ${o.currency} ${o.totalMinorUnits ?? o.total ?? 0}`)].join(',')
      ),
      ...exported.reservations.map((r) =>
        ['Reservation', escapeCsv(r.code), escapeCsv(`${r.date} ${r.time} (${r.status})`)].join(',')
      ),
      ...exported.reviews.map((rv) =>
        ['Review', escapeCsv(rv.id), escapeCsv(`${rv.rating}★`)].join(',')
      ),
    ].join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal_data_${exported.homeRegion}_${currentUser.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('privacy_export_csv_toast'), 'success');
  };

  const handleRequestErasure = () => {
    const ok = authService.requestDataErasure(currentUser.id);
    if (!ok) {
      showToast(t('privacy_erasure_err'), 'error');
      return;
    }
    setErasureCompleted(true);
    showToast(t('privacy_erasure_success_toast'), 'success');
    setTimeout(() => {
      logoutUser();
      navigate('/');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E8A33D]/20 border border-[#E8A33D]/40 flex items-center justify-center text-[#C8452C]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8452C] px-2 py-0.5 rounded bg-[#C8452C]/10 border border-[#C8452C]/20">
                {t('privacy_portal_badge')}
              </span>
              <h1 className="text-2xl font-bold font-serif text-[#1F1A17] mt-1">
                {t('privacy_portal_title')}
              </h1>
            </div>
          </div>
          <p className="text-xs text-[#7A6E65] leading-relaxed">
            {t('privacy_portal_desc', { law: homeProfile.dataResidency.applicableLaw })}
          </p>
        </div>

        <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-md space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[#1F1A17] pb-3 border-b border-[#E9DFCC]">
            {t('privacy_residency_title')} ({homeProfile.flagEmoji} {homeRegion})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-[#FBF6EC] rounded-2xl border border-[#E9DFCC]">
              <span className="text-[10px] uppercase font-mono text-[#7A6E65] block">
                {t('privacy_node_label')}
              </span>
              <span className="font-bold text-[#1F1A17] block mt-0.5">
                {homeProfile.dataResidency.dataRegion}
              </span>
            </div>

            <div className="p-3 bg-[#FBF6EC] rounded-2xl border border-[#E9DFCC]">
              <span className="text-[10px] uppercase font-mono text-[#7A6E65] block">
                {t('privacy_law_label')}
              </span>
              <span className="font-bold text-[#C8452C] block mt-0.5">
                {homeProfile.dataResidency.applicableLaw}
              </span>
            </div>

            <div className="p-3 bg-[#FBF6EC] rounded-2xl border border-[#E9DFCC]">
              <span className="text-[10px] uppercase font-mono text-[#7A6E65] block">
                {t('privacy_basis_label')}
              </span>
              <span className="font-medium text-[#1F1A17] block mt-0.5">
                {homeProfile.dataResidency.legalBasis}
              </span>
            </div>

            <div className="p-3 bg-[#FBF6EC] rounded-2xl border border-[#E9DFCC]">
              <span className="text-[10px] uppercase font-mono text-[#7A6E65] block">
                {t('privacy_retention_label')}
              </span>
              <span className="font-medium text-[#1F1A17] block mt-0.5">
                {homeProfile.dataResidency.retentionMonths} {t('privacy_months_unit')}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              <strong>{t('privacy_transfer_title')}:</strong> {t('privacy_transfer_desc')}
            </span>
          </div>
        </div>

        <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-md space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[#1F1A17] pb-3 border-b border-[#E9DFCC]">
            {t('privacy_registered_data_title')}
          </h2>

          <div className="divide-y divide-[#E9DFCC]/50 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-[#7A6E65]">{t('full_name_label')}:</span>
              <strong className="text-[#1F1A17]">{currentUser.name}</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#7A6E65]">{t('email_label')}:</span>
              <span className="font-mono text-[#1F1A17]">{currentUser.email}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#7A6E65]">{t('phone_label')}:</span>
              <span className="font-mono text-[#1F1A17]">
                {currentUser.phone || t('not_registered')}
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#7A6E65]">{t('privacy_linked_records')}:</span>
              <span className="font-mono text-[#1F1A17]">
                {ownOrdersCount} · {ownReservationsCount} · {ownReviewsCount}
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#7A6E65]">{t('privacy_consent_label')}:</span>
              <span className="text-emerald-700 font-semibold">
                {currentUser.consentVersion || 'v2026.1'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportJSON}
              className="flex-1 py-2.5 rounded-2xl bg-white hover:bg-[#FBF6EC] border border-[#E9DFCC] text-[#1F1A17] font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#C8452C]" />
              <span>{t('privacy_export_json_btn')}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex-1 py-2.5 rounded-2xl bg-white hover:bg-[#FBF6EC] border border-[#E9DFCC] text-[#1F1A17] font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#C8452C]" />
              <span>{t('privacy_export_csv_btn')}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-rose-200 shadow-md space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-rose-100 text-rose-700">
            <Trash2 className="w-5 h-5 text-rose-600" />
            <h2 className="text-sm font-bold">{t('privacy_erasure_title')}</h2>
          </div>

          <p className="text-xs text-[#7A6E65] leading-relaxed">
            {t('privacy_erasure_desc', { authority: homeProfile.receipt.officialAuthority })}
          </p>

          {erasureCompleted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>{t('privacy_erasure_done')}</span>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#7A6E65]">
                <input
                  type="checkbox"
                  checked={erasureConfirmed}
                  onChange={(e) => setErasureConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-[#E9DFCC] text-rose-600 focus:ring-rose-500"
                />
                <span>{t('privacy_erasure_confirm_checkbox')}</span>
              </label>

              <button
                onClick={handleRequestErasure}
                disabled={!erasureConfirmed}
                className="py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-40"
              >
                {t('privacy_erasure_btn')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
