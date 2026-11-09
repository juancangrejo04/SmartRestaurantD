import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { Table, Branch, Restaurant } from '../../types';
import { reservationService } from '../../services/reservationService';
import { generateQrSvgPath } from '../../core/qr';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  User as UserIcon,
  QrCode,
  ArrowRight,
  Lock,
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
    registerCustomer,
    loginUser,
    showToast,
    language,
  } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
  const [customerName, setCustomerName] = useState<string>(currentUser.name || 'Familia Jiménez');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser.email || 'reservas@cliente.com');
  const [customerPhone, setCustomerPhone] = useState<string>('+57 310 987 6543');
  const [notes, setNotes] = useState<string>('Celebración especial. Mesa tranquila.');

  // Quick auth tab inside Step 4 if not authenticated
  const [step4AuthMode, setStep4AuthMode] = useState<'guest' | 'login' | 'register'>('guest');
  const [loginEmail, setLoginEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Confirmed result
  const [confirmedReservationCode, setConfirmedReservationCode] = useState<string | null>(null);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];
  const selectedRestaurant = selectedBranch
    ? restaurants.find((r) => r.id === selectedBranch.restaurantId)
    : restaurants[0];

  // Available tables for this branch
  const branchTables = tables.filter((t) => t.branchId === selectedBranch?.id);

  // Filter tables matching capacity
  const eligibleTables = branchTables.filter((t) => t.capacity >= guestsCount);

  // Collision Check helper
  const checkTableCollision = (table: Table) => {
    return reservationService.checkTableCollision(reservations, table.id, date, time);
  };

  const handleStep1Next = () => {
    if (!selectedBranchId) {
      showToast('Por favor selecciona una sucursal', 'warning');
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    if (!date || !time) {
      showToast('Por favor selecciona fecha y hora', 'warning');
      return;
    }
    setCurrentStep(3);
  };

  const handleStep3Next = () => {
    if (!selectedTableId) {
      showToast('Por favor selecciona una mesa para continuar', 'warning');
      return;
    }
    setCurrentStep(4);
  };

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      showToast('Por favor completa tu nombre y correo', 'warning');
      return;
    }
    const user = registerCustomer(regName, regEmail, regPhone);
    setCustomerName(user.name);
    setCustomerEmail(user.email);
    if (user.phone) setCustomerPhone(user.phone);
    setStep4AuthMode('guest');
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      showToast('Por favor introduce tu correo', 'warning');
      return;
    }
    loginUser(loginEmail);
    setCustomerName(loginEmail.split('@')[0]);
    setCustomerEmail(loginEmail);
    setStep4AuthMode('guest');
  };

  const handleConfirmReservation = () => {
    if (!customerName || !customerEmail || !customerPhone) {
      showToast('Por favor completa tus datos de contacto', 'warning');
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

    if (res.success && res.reservation) {
      setConfirmedReservationCode(res.reservation.code || res.reservation.id.slice(0, 8).toUpperCase());
      setCurrentStep(5);
    } else {
      showToast(res.error || 'No se pudo crear la reserva', 'error');
    }
  };

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const branchCountry = selectedBranch?.country || country;
  const branchConfig = COUNTRIES[branchCountry];

  // Demo QR path for confirmed reservation
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
            <span>RESERVA EN LÍNEA SIN ESPERAS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1A17]">
            Agenda tu Mesa Culinaria
          </h1>
          <p className="text-xs text-[#7A6E65]">
            Asignación directa con confirmación instantánea.
          </p>
        </div>

        {/* Progress Bar (4 Steps) */}
        {currentStep <= 4 && (
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
            {[
              { num: 1, label: 'Sucursal' },
              { num: 2, label: 'Fecha y Hora' },
              { num: 3, label: 'Mesa' },
              { num: 4, label: 'Confirmación' },
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
                <span className="font-mono text-[10px] block opacity-75">PASO {st.num}</span>
                <span className="font-serif text-xs">{st.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Select Brand & Branch */}
        {currentStep === 1 && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-md space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
              <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                Paso 1: Elige el Restaurante y la Sucursal
              </h2>
              <span className="text-xs font-mono text-[#7A6E65]">
                {branches.length} sedes disponibles
              </span>
            </div>

            <div className="space-y-4">
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
                        <p className="text-xs font-semibold text-[#C8452C]">{b.name}</p>
                        <p className="text-[11px] text-[#7A6E65] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C8452C]" />
                          <span>{b.address}, {b.city}</span>
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#E9DFCC]/60 flex items-center justify-between text-[10px] font-mono text-[#7A6E65]">
                        <span>{b.totalTables} mesas</span>
                        <span>{cConfig.currency}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-[#E9DFCC]">
              <button
                type="button"
                onClick={handleStep1Next}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all flex items-center gap-2"
              >
                <span>Siguiente: Fecha y Comensales</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Guests, Date, and Time */}
        {currentStep === 2 && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-md space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                  Paso 2: Comensales y Horario
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {selectedRestaurant?.name} — {selectedBranch?.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Número de Personas
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'persona' : 'personas'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Fecha de la Reserva
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
                  Hora de Llegada
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                >
                  {['12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map((h) => (
                    <option key={h} value={h}>
                      {h} hrs
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
                <span>Volver</span>
              </button>

              <button
                type="button"
                onClick={handleStep2Next}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all flex items-center gap-2"
              >
                <span>Siguiente: Seleccionar Mesa</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Table Selection & Collision Detection */}
        {currentStep === 3 && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-md space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                  Paso 3: Selecciona tu Mesa en Plano
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  Mostrando mesas con capacidad para {guestsCount}+ comensales en {selectedBranch?.name}
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
                          Mesa #{tbl.number}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {tbl.capacity}p
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7A6E65] capitalize">
                        Zona {tbl.zone}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-current/10">
                      {isOccupiedByDate ? (
                        <span className="text-[10px] text-rose-600 font-bold block truncate">
                          Ocupada ({collision.conflictingReservation?.time})
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Disponible</span>
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
                <span>Volver</span>
              </button>

              <button
                type="button"
                disabled={!selectedTableId}
                onClick={handleStep3Next}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span>Siguiente: Datos de Contacto</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Contact details & Quick customer registration */}
        {currentStep === 4 && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-md space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                  Paso 4: Confirmación y Datos de Contacto
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  Revisa los detalles y completa tu información para la reserva.
                </p>
              </div>
            </div>

            {/* Reservation Summary Pill */}
            <div className="bg-[#FBF6EC] rounded-2xl p-4 border border-[#E9DFCC] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block font-mono">Restaurante</span>
                <span className="font-semibold text-[#1F1A17]">{selectedRestaurant?.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block font-mono">Sucursal</span>
                <span className="font-semibold text-[#1F1A17]">{selectedBranch?.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block font-mono">Fecha & Hora</span>
                <span className="font-semibold text-[#1F1A17]">{date} · {time} hrs</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block font-mono">Mesa & Personas</span>
                <span className="font-semibold text-[#C8452C]">Mesa #{selectedTable?.number} ({guestsCount}p)</span>
              </div>
            </div>

            {/* Quick account switch / registration for seamless session */}
            {!isAuthenticated && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>¿Deseas guardar esta reserva en tu perfil de comensal?</span>
                  </span>
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setStep4AuthMode('register')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        step4AuthMode === 'register' ? 'bg-[#1F1A17] text-white' : 'text-amber-900 hover:underline'
                      }`}
                    >
                      Crear Cuenta
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep4AuthMode('login')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        step4AuthMode === 'login' ? 'bg-[#1F1A17] text-white' : 'text-amber-900 hover:underline'
                      }`}
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                </div>

                {step4AuthMode === 'register' && (
                  <form onSubmit={handleQuickRegister} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Tu nombre completo"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs font-medium"
                      required
                    />
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs font-medium"
                      required
                    />
                    <button
                      type="submit"
                      className="py-1.5 px-3 bg-[#1F1A17] text-white text-xs font-bold rounded-xl"
                    >
                      Registrarme y Continuar
                    </button>
                  </form>
                )}

                {step4AuthMode === 'login' && (
                  <form onSubmit={handleQuickLogin} className="flex gap-2 pt-2">
                    <input
                      type="email"
                      placeholder="Tu correo registrado"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="flex-1 bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs font-medium"
                      required
                    />
                    <button
                      type="submit"
                      className="py-1.5 px-4 bg-[#1F1A17] text-white text-xs font-bold rounded-xl"
                    >
                      Acceder
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Direct Contact Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                Peticiones Especiales (opcional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alergias, silla para bebé, motivo de celebración..."
                className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl p-3 text-xs font-medium text-[#1F1A17]"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#E9DFCC]">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#7A6E65] hover:bg-[#FBF6EC] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmReservation}
                className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#C8452C]/30 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Reservación</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Success Confirmation Card */}
        {currentStep === 5 && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-xl text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="font-serif font-bold text-2xl text-[#1F1A17]">
                ¡Reservación Confirmada con Éxito!
              </h2>
              <p className="text-xs text-[#7A6E65]">
                Hemos reservado tu mesa. Presenta este código al llegar a la sucursal.
              </p>
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
                <p><strong className="text-[#1F1A17]">{selectedRestaurant?.name}</strong> — {selectedBranch?.name}</p>
                <p>{date} a las {time} hrs</p>
                <p>Mesa #{selectedTable?.number} · {guestsCount} comensales</p>
                <p className="font-medium text-[#1F1A17]">Titular: {customerName}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/mis-reservas"
                className="py-2.5 px-6 rounded-xl bg-[#1F1A17] text-white text-xs font-bold hover:bg-[#332B25] transition-colors"
              >
                Ver Mis Reservaciones
              </Link>

              <Link
                to="/"
                className="py-2.5 px-6 rounded-xl bg-[#FBF6EC] text-[#1F1A17] text-xs font-semibold border border-[#E9DFCC] hover:bg-[#E9DFCC] transition-colors"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
