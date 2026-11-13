import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { Table } from '../../types';
import { reservationService } from '../../services/reservationService';
import { generateQrSvgPath } from '../../core/qr';
import { getRegionProfile } from '../../data/regions';
import { NameFields } from '../../components/common/NameFields';
import { PhoneInput } from '../../components/common/PhoneInput';
import {
  Calendar,
  CheckCircle2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ReservationWizardPage: React.FC = () => {
  const {
    country,
    restaurants,
    branches,
    tables,
    reservations,
    createReservation,
    currentUser,
    isAuthenticated,
    loginWithCredentials,
    showToast,
    language,
    getBranchDisplayName,
    getBranchCityName,
    t,
  } = useApp();
  const [searchParams] = useSearchParams();

  const preselectedRestId = searchParams.get('restaurantId') || '';
  const preselectedBranchId = searchParams.get('branchId') || '';
  const preselectedGuests = Number(searchParams.get('guests')) || 2;
  const preselectedDate =
    searchParams.get('date') ||
    new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const preselectedTime = searchParams.get('time') || '20:00';

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    if (preselectedBranchId) return preselectedBranchId;
    if (preselectedRestId) {
      const matchBr = branches.find((b) => b.restaurantId === preselectedRestId);
      if (matchBr) return matchBr.id;
    }
    const countryBranch = branches.find((b) => b.country === country);
    return countryBranch ? countryBranch.id : branches[0]?.id || '';
  });

  const [guestsCount, setGuestsCount] = useState<number>(preselectedGuests);
  const [date, setDate] = useState<string>(preselectedDate);
  const [time, setTime] = useState<string>(preselectedTime);
  const [selectedTableId, setSelectedTableId] = useState<string>('');

  const [givenName, setGivenName] = useState<string>(
    currentUser?.firstName || currentUser?.name?.split(' ')[0] || ''
  );
  const [familyName, setFamilyName] = useState<string>(
    currentUser?.lastName || currentUser?.name?.split(' ').slice(1).join(' ') || ''
  );
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState<string>(
    currentUser?.phone ? currentUser.phone.replace(/^\+\d+\s*/, '') : ''
  );
  const [notes, setNotes] = useState<string>('');

  // Quick sign in in Step 4 for existing accounts
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Confirmed result
  const [confirmedReservationCode, setConfirmedReservationCode] = useState<string | null>(null);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];
  const selectedRestaurant = selectedBranch
    ? restaurants.find((r) => r.id === selectedBranch.restaurantId)
    : restaurants[0];
  const branchProfile = getRegionProfile(selectedBranch?.country || country);

  const branchTables = tables.filter((tb) => tb.branchId === selectedBranch?.id);
  const eligibleTables = branchTables.filter((tb) => tb.capacity >= guestsCount);

  const checkTableCollision = (table: Table) => {
    return reservationService.checkTableCollision(reservations, table.id, date, time);
  };

  const handleStep1Next = () => {
    if (!selectedBranchId) {
      showToast(t('select_branch'), 'warning');
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    if (!date || !time) {
      showToast(t('select_datetime_party'), 'warning');
      return;
    }
    setCurrentStep(3);
  };

  const handleStep3Next = () => {
    if (!selectedTableId) {
      showToast(t('select_table'), 'warning');
      return;
    }
    setCurrentStep(4);
  };

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setLoginLoading(true);
    try {
      const res = await loginWithCredentials(loginEmail, loginPassword);
      if (res.success && res.user) {
        setGivenName(res.user.firstName || res.user.name.split(' ')[0] || res.user.name);
        setFamilyName(res.user.lastName || res.user.name.split(' ').slice(1).join(' ') || '-');
        setCustomerEmail(res.user.email);
        if (res.user.phone) {
          setCustomerPhone(res.user.phone.replace(/^\+\d+\s*/, ''));
        }
        setShowQuickLogin(false);
        showToast(t('auth_welcome_back', { name: res.user.name }), 'success');
      } else {
        showToast(t(res.messageKey || 'auth_err_invalid_credentials'), 'error');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleConfirmReservation = () => {
    const fullName =
      currentUser?.name ||
      (branchProfile.nameOrder === 'family_given'
        ? `${familyName.trim()} ${givenName.trim()}`
        : `${givenName.trim()} ${familyName.trim()}`
      ).trim();

    if (!fullName || !customerEmail.trim() || !customerPhone.trim()) {
      showToast(t('required_field'), 'warning');
      return;
    }

    const res = createReservation({
      customerName: fullName,
      customerEmail: customerEmail.trim(),
      customerPhone: `${branchProfile.phonePrefix} ${customerPhone.trim()}`,
      date,
      time,
      guestsCount,
      tableId: selectedTableId,
      notes,
    });

    if (res.success && res.reservation) {
      setConfirmedReservationCode(
        res.reservation.code || res.reservation.id.slice(0, 8).toUpperCase()
      );
      setCurrentStep(5);
    } else {
      showToast(res.error || t('error'), 'error');
    }
  };

  const selectedTable = tables.find((tb) => tb.id === selectedTableId);
  const reservationQrSvg = confirmedReservationCode
    ? generateQrSvgPath(`SMARTRESTAURANT-RES:${confirmedReservationCode}`, 29)
    : '';

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1F1A17]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Wizard Steps Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A33D]/20 text-[#C8452C] text-xs font-mono font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('cta_reserve')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1A17]">
            {t('res_title')}
          </h1>
          <p className="text-xs text-[#7A6E65]">{t('res_subtitle')}</p>
        </div>

        {/* Progress Bar */}
        {currentStep <= 4 && (
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
            {[
              { num: 1, label: t('wizard_step_1') },
              { num: 2, label: t('wizard_step_2') },
              { num: 3, label: t('wizard_step_3') },
              { num: 4, label: t('wizard_step_4') },
            ].map((st) => (
              <div
                key={st.num}
                className={`p-2.5 rounded-2xl border transition-all ${
                  currentStep === st.num
                    ? 'bg-[#1F1A17] text-white border-[#1F1A17] shadow-md'
                    : currentStep > st.num
                    ? 'bg-[#6B7A3A]/10 text-[#6B7A3A] border-[#6B7A3A]/30'
                    : 'bg-[#FFFDF8] text-[#7A6E65] border-[#E9DFCC]'
                }`}
              >
                <span className="font-mono text-[10px] block opacity-75">0{st.num}</span>
                <span className="font-serif text-xs truncate block">{st.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Select Brand & Branch */}
        {currentStep === 1 && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
              <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                {t('select_restaurant_branch')}
              </h2>
              <span className="text-xs font-mono text-[#7A6E65]">
                {branches.length} {t('branch_plural')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {branches.map((b) => {
                const rest = restaurants.find((r) => r.id === b.restaurantId);
                const isSelected = selectedBranchId === b.id;
                const cConfig = COUNTRIES[b.country];

                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#C8452C] bg-[#FBF6EC] ring-2 ring-[#C8452C]/20 shadow-md'
                        : 'border-[#E9DFCC] bg-white hover:border-[#E8A33D]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-[#1F1A17]">
                          {rest?.name}
                        </span>
                        <span className="text-sm">{cConfig.flagEmoji}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#C8452C]">
                        {getBranchDisplayName(b)}
                      </p>
                      <p className="text-[11px] text-[#7A6E65] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C8452C]" />
                        <span>
                          {b.address}, {getBranchCityName(b)}
                        </span>
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#E9DFCC]/60 flex items-center justify-between text-[10px] font-mono text-[#7A6E65]">
                      <span>
                        {b.totalTables} {t('table')}
                      </span>
                      <span>{cConfig.currency}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end border-t border-[#E9DFCC]">
              <button
                type="button"
                onClick={handleStep1Next}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all flex items-center gap-2"
              >
                <span>{t('next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Guests, Date, and Time */}
        {currentStep === 2 && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                  {t('select_datetime_party')}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {selectedRestaurant?.name} — {getBranchDisplayName(selectedBranch)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  {t('res_guests')}
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? t('guest_singular') : t('guest_plural')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  {t('res_date')}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  {t('res_time')}
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                >
                  {['12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#E9DFCC]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#7A6E65] hover:bg-[#FBF6EC] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('back')}</span>
              </button>

              <button
                type="button"
                onClick={handleStep2Next}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all flex items-center gap-2"
              >
                <span>{t('next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Table Selection & Collision Detection */}
        {currentStep === 3 && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                  {t('select_table')}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {getBranchDisplayName(selectedBranch)} · {guestsCount}+ {t('guests')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {eligibleTables.map((tbl) => {
                const collision = checkTableCollision(tbl);
                const isSelected = selectedTableId === tbl.id;
                const isOccupiedByDate = collision.hasCollision;

                return (
                  <button
                    key={tbl.id}
                    type="button"
                    disabled={isOccupiedByDate}
                    onClick={() => setSelectedTableId(tbl.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#C8452C] bg-[#FBF6EC] ring-2 ring-[#C8452C]/20 shadow-md'
                        : isOccupiedByDate
                        ? 'bg-slate-100/60 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                        : 'bg-white border-[#E9DFCC] hover:border-[#E8A33D]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-sm text-[#1F1A17]">
                          {t('table_label', { number: tbl.number })}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {tbl.capacity}p
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7A6E65] capitalize">
                        {t(`zone_${tbl.zone}`)}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-current/10">
                      {isOccupiedByDate ? (
                        <span className="text-[10px] text-rose-600 font-bold block truncate">
                          {t('slot_unavailable')} ({collision.conflictingReservation?.time})
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{t('status_available')}</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#E9DFCC]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#7A6E65] hover:bg-[#FBF6EC] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('back')}</span>
              </button>

              <button
                type="button"
                disabled={!selectedTableId}
                onClick={handleStep3Next}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span>{t('next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Contact details & Sign In option */}
        {currentStep === 4 && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                  {t('guest_details')}
                </h2>
                <p className="text-xs text-[#7A6E65]">{t('res_subtitle')}</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#FBF6EC] rounded-2xl p-4 border border-[#E9DFCC] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block font-mono">
                  {t('select_restaurant')}
                </span>
                <span className="font-semibold text-[#1F1A17]">{selectedRestaurant?.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block font-mono">
                  {t('select_branch')}
                </span>
                <span className="font-semibold text-[#1F1A17]">
                  {getBranchDisplayName(selectedBranch)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block font-mono">
                  {t('date')}
                </span>
                <span className="font-semibold text-[#1F1A17]">
                  {date} · {time}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block font-mono">
                  {t('res_table')}
                </span>
                <span className="font-semibold text-[#C8452C]">
                  {t('table_label', { number: selectedTable?.number || 1 })} ({guestsCount}p)
                </span>
              </div>
            </div>

            {/* Optional quick sign in */}
            {!isAuthenticated && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{t('res_save_to_account_prompt')}</span>
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setShowQuickLogin(!showQuickLogin)}
                      className="px-2.5 py-1 rounded-lg bg-[#1F1A17] text-white font-semibold"
                    >
                      {t('login_button')}
                    </button>
                    <Link
                      to="/registro?redirect=/reservar"
                      className="px-2.5 py-1 rounded-lg border border-amber-300 text-amber-950 font-semibold hover:bg-amber-100"
                    >
                      {t('auth_register_link')}
                    </Link>
                  </div>
                </div>

                {showQuickLogin && (
                  <form onSubmit={handleQuickLogin} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <input
                      type="email"
                      placeholder={t('email')}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs font-medium"
                      required
                    />
                    <input
                      type="password"
                      placeholder={t('auth_password_label')}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs font-medium"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="py-1.5 px-4 bg-[#1F1A17] text-white text-xs font-bold rounded-xl disabled:opacity-50"
                    >
                      {loginLoading ? t('loading') : t('login_button')}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Contact Fields using localized NameFields & PhoneInput */}
            <NameFields
              profile={branchProfile}
              language={language}
              givenName={givenName}
              familyName={familyName}
              onGivenNameChange={setGivenName}
              onFamilyNameChange={setFamilyName}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#1F1A17] block mb-1">
                  {t('res_customer_email')}
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#FFFDF8] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-medium text-[#1F1A17]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F1A17] block mb-1">
                  {t('res_customer_phone')}
                </label>
                <PhoneInput
                  profile={branchProfile}
                  value={customerPhone}
                  onChange={setCustomerPhone}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1F1A17] block mb-1">
                {t('res_notes')}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('special_notes')}
                className="w-full bg-[#FFFDF8] border border-[#E9DFCC] rounded-xl p-3 text-xs font-medium text-[#1F1A17]"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#E9DFCC]">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#7A6E65] hover:bg-[#FBF6EC] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('back')}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmReservation}
                className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#C8452C]/30 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('confirm_reservation')}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Success Confirmation Card */}
        {currentStep === 5 && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="font-serif font-bold text-2xl text-[#1F1A17]">
                {t('reservation_confirmed_title')}
              </h2>
              <p className="text-xs text-[#7A6E65]">{t('reservation_confirmed_desc')}</p>
            </div>

            <div className="max-w-sm mx-auto bg-[#FBF6EC] rounded-2xl p-6 border border-[#E9DFCC] space-y-4">
              <div className="font-mono text-2xl font-bold text-[#C8452C] tracking-wider">
                {confirmedReservationCode}
              </div>

              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-[#E9DFCC]">
                <svg viewBox="0 0 29 29" className="w-full h-full">
                  <path d={reservationQrSvg} fill="#1F1A17" />
                </svg>
              </div>

              <div className="text-xs text-[#7A6E65] space-y-1">
                <p>
                  <strong className="text-[#1F1A17]">{selectedRestaurant?.name}</strong> —{' '}
                  {getBranchDisplayName(selectedBranch)}
                </p>
                <p>
                  {date} · {time}
                </p>
                <p>
                  {t('table_label', { number: selectedTable?.number || 1 })} · {guestsCount}{' '}
                  {t('guests')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {isAuthenticated && (
                <Link
                  to="/mis-reservas"
                  className="py-2.5 px-6 rounded-xl bg-[#1F1A17] text-white text-xs font-bold hover:bg-[#332B25] transition-colors"
                >
                  {t('nav_my_reservations')}
                </Link>
              )}

              <Link
                to="/"
                className="py-2.5 px-6 rounded-xl bg-[#FBF6EC] text-[#1F1A17] text-xs font-semibold border border-[#E9DFCC] hover:bg-[#E9DFCC] transition-colors"
              >
                {t('back_to_home')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
