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
} from 'lucide-react';

export const ReservationWizardPage: React.FC = () => {
  const {
    country,
    restaurants,
    branches,
    tables,
    reservations,
    createReservation,
    showToast,
    t,
  } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedRestId = searchParams.get('restaurantId') || '';
  const preselectedGuests = Number(searchParams.get('guests')) || 2;
  const preselectedDate =
    searchParams.get('date') ||
    new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const preselectedTime = searchParams.get('time') || '20:00';

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
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
  const [customerName, setCustomerName] = useState<string>('Familia Jiménez');
  const [customerEmail, setCustomerEmail] = useState<string>('reservas@cliente.com');
  const [customerPhone, setCustomerPhone] = useState<string>('+57 310 987 6543');
  const [notes, setNotes] = useState<string>('Celebración de aniversario. Mesa tranquila si es posible.');

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

    if (res.success) {
      const generatedCode = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedReservationCode(generatedCode);
      showToast(`¡Reserva confirmada con éxito! Código: ${generatedCode}`, 'success');
    } else {
      showToast(res.error || 'No fue posible confirmar la reserva.', 'error');
    }
  };

  // QR path for confirmation
  const qrSvgPath = confirmedReservationCode
    ? generateQrSvgPath(`SMARTRESTAURANT-RES:${confirmedReservationCode}`, 29)
    : '';

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Wizard Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C]">
            Asistente de Reservaciones en Línea
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1A17]">
            {confirmedReservationCode ? '¡Tu Mesa Está Reservada!' : 'Reserva Tu Experiencia'}
          </h1>
          <p className="text-xs text-[#7A6E65]">
            Confirmación inmediata, sin esperas y con garantía de disponibilidad.
          </p>
        </div>

        {/* Progress Stepper */}
        {!confirmedReservationCode && (
          <div className="flex items-center justify-between max-w-lg mx-auto px-4">
            {[
              { num: 1, label: 'Sucursal' },
              { num: 2, label: 'Horario' },
              { num: 3, label: 'Mesa' },
              { num: 4, label: 'Confirmación' },
            ].map((step, idx) => {
              const isPast = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div key={step.num} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPast
                          ? 'bg-[#6B7A3A] text-white'
                          : isCurrent
                          ? 'bg-[#C8452C] text-white shadow-md'
                          : 'bg-[#E9DFCC] text-[#7A6E65]'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-medium ${
                        isCurrent ? 'text-[#C8452C] font-bold' : 'text-[#7A6E65]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < 3 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        currentStep > step.num ? 'bg-[#6B7A3A]' : 'bg-[#E9DFCC]'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Wizard Card Body */}
        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-lg">
          {/* STEP 1: RESTAURANT & BRANCH */}
          {currentStep === 1 && !confirmedReservationCode && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                1. Selecciona la Sede y el Número de Personas
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#7A6E65] uppercase tracking-wider block mb-2">
                    Restaurante y Sucursal
                  </label>
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-4 py-3 text-sm font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                  >
                    {branches.map((b) => {
                      const rest = restaurants.find((r) => r.id === b.restaurantId);
                      const c = COUNTRIES[b.country];
                      return (
                        <option key={b.id} value={b.id}>
                          {c.flagEmoji} {rest?.name} — {b.name} ({b.city})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedRestaurant && selectedBranch && (
                  <div className="p-4 rounded-2xl bg-[#FBF6EC] border border-[#E9DFCC] flex items-center gap-4">
                    <img
                      src={selectedRestaurant.heroImage}
                      alt={selectedRestaurant.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1F1A17]">
                        {selectedRestaurant.name}
                      </h4>
                      <p className="text-xs text-[#7A6E65]">
                        {selectedBranch.address}, {selectedBranch.city}
                      </p>
                      <p className="text-[11px] text-[#C8452C] font-mono mt-1">
                        Horario: {selectedBranch.openingHours}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-[#7A6E65] uppercase tracking-wider block mb-2">
                    Número de Comensales
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestsCount(num)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                          guestsCount === num
                            ? 'bg-[#C8452C] text-white shadow-md'
                            : 'bg-[#FBF6EC] text-[#1F1A17] hover:bg-[#E9DFCC] border border-[#E9DFCC]'
                        }`}
                      >
                        {num} {num === 1 ? 'p' : 'p'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E9DFCC] flex justify-end">
                <button
                  onClick={handleStep1Next}
                  className="py-2.5 px-6 rounded-xl bg-[#C8452C] hover:bg-[#A83720] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <span>Continuar a Fecha y Hora</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME WITH COLLISION SENSING */}
          {currentStep === 2 && !confirmedReservationCode && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                2. Elige la Fecha y Turno de Servicio
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#7A6E65] uppercase tracking-wider block mb-2">
                    Fecha de Reservación
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-4 py-3 text-sm font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#7A6E65] uppercase tracking-wider block mb-2">
                    Horario de Reserva
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-4 py-3 text-sm font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                  >
                    {['12:30', '13:00', '13:30', '14:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map(
                      (tVal) => (
                        <option key={tVal} value={tVal}>
                          {tVal} hrs
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8A33D]/10 border border-[#E8A33D]/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#C8452C] shrink-0 mt-0.5" />
                <div className="text-xs text-[#1F1A17] leading-relaxed">
                  <strong>Control de colisión ±90 minutos activo:</strong> El sistema distribuido de reservas asegura una ventana de 1h30 para tu sobremesa sin que se asignen comensales sobrepuestos a tu mesa.
                </div>
              </div>

              <div className="pt-6 border-t border-[#E9DFCC] flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="py-2.5 px-4 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>
                <button
                  onClick={handleStep2Next}
                  className="py-2.5 px-6 rounded-xl bg-[#C8452C] hover:bg-[#A83720] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <span>Continuar a Selección de Mesa</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TABLE SELECTION */}
          {currentStep === 3 && !confirmedReservationCode && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                    3. Selecciona tu Mesa
                  </h2>
                  <p className="text-xs text-[#7A6E65]">
                    Mesas disponibles para {guestsCount} persona(s) el {date} a las {time}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#6B7A3A]">
                  {eligibleTables.length} mesas encontradas
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {eligibleTables.map((tbl) => {
                  const collision = checkTableCollision(tbl);
                  const isBlocked = collision.hasCollision;
                  const isSelected = selectedTableId === tbl.id;

                  return (
                    <button
                      key={tbl.id}
                      type="button"
                      disabled={isBlocked}
                      onClick={() => setSelectedTableId(tbl.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                        isBlocked
                          ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#C8452C] text-white border-[#C8452C] shadow-md'
                          : 'bg-[#FBF6EC] hover:border-[#E8A33D] text-[#1F1A17] border-[#E9DFCC]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-serif font-bold text-lg">
                          Mesa #{tbl.number}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-[#E9DFCC] text-[#7A6E65]'
                          }`}
                        >
                          {tbl.zone}
                        </span>
                      </div>
                      <div className="text-xs flex items-center gap-1 opacity-90">
                        <Users className="w-3.5 h-3.5" />
                        <span>Capacidad: {tbl.capacity} comensales</span>
                      </div>
                      {isBlocked && (
                        <div className="text-[10px] font-bold text-rose-600 mt-2">
                          Horario ocupado
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-[#E9DFCC] flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="py-2.5 px-4 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>
                <button
                  onClick={handleStep3Next}
                  className="py-2.5 px-6 rounded-xl bg-[#C8452C] hover:bg-[#A83720] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <span>Continuar a Datos de Contacto</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONTACT & CONFIRMATION */}
          {currentStep === 4 && !confirmedReservationCode && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
                4. Datos de Contacto y Confirmación
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#7A6E65] uppercase tracking-wider block mb-1">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#7A6E65] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#7A6E65] uppercase tracking-wider block mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7A6E65] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#7A6E65] uppercase tracking-wider block mb-1">
                    Teléfono Móvil
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#7A6E65] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#7A6E65] uppercase tracking-wider block mb-1">
                    Notas o Requerimientos Especiales
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Alergias, silla para niños, ocasión especial..."
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                  />
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-[#FBF6EC] border border-[#E9DFCC] space-y-2 text-xs text-[#1F1A17]">
                <h4 className="font-bold text-[#C8452C] uppercase tracking-wider text-[10px]">
                  Resumen de la Reservación
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  <div>
                    <span className="text-[#7A6E65] block text-[10px]">Restaurante</span>
                    <span className="font-bold">{selectedRestaurant?.name}</span>
                  </div>
                  <div>
                    <span className="text-[#7A6E65] block text-[10px]">Fecha & Hora</span>
                    <span className="font-bold">{date} • {time}</span>
                  </div>
                  <div>
                    <span className="text-[#7A6E65] block text-[10px]">Personas</span>
                    <span className="font-bold">{guestsCount} comensales</span>
                  </div>
                  <div>
                    <span className="text-[#7A6E65] block text-[10px]">Mesa</span>
                    <span className="font-bold">
                      Mesa #{branchTables.find((t) => t.id === selectedTableId)?.number || '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E9DFCC] flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="py-2.5 px-4 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>
                <button
                  onClick={handleConfirmReservation}
                  className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#C8452C]/30 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Reservación Ahora</span>
                </button>
              </div>
            </div>
          )}

          {/* CONFIRMATION SUCCESS SCREEN */}
          {confirmedReservationCode && (
            <div className="text-center space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-[#6B7A3A]/20 text-[#6B7A3A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#6B7A3A] uppercase tracking-wider">
                  Reservación Confirmada
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#1F1A17]">
                  ¡Te esperamos con entusiasmo!
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  Hemos enviado los detalles a {customerEmail}
                </p>
              </div>

              {/* Booking Pass Card with QR */}
              <div className="max-w-md mx-auto bg-[#FBF6EC] rounded-2xl p-6 border-2 border-dashed border-[#E8A33D] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
                  <span className="font-serif font-bold text-base text-[#1F1A17]">
                    Pase de Comensal
                  </span>
                  <span className="font-mono text-sm font-bold text-[#C8452C]">
                    {confirmedReservationCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left text-xs font-mono">
                  <div>
                    <span className="text-[#7A6E65] block text-[10px]">Titular:</span>
                    <span className="font-bold">{customerName}</span>
                  </div>
                  <div>
                    <span className="text-[#7A6E65] block text-[10px]">Restaurante:</span>
                    <span className="font-bold truncate">{selectedRestaurant?.name}</span>
                  </div>
                  <div>
                    <span className="text-[#7A6E65] block text-[10px]">Cita:</span>
                    <span className="font-bold">{date} • {time}</span>
                  </div>
                  <div>
                    <span className="text-[#7A6E65] block text-[10px]">Mesa Asignada:</span>
                    <span className="font-bold text-[#C8452C]">
                      Mesa #{branchTables.find((t) => t.id === selectedTableId)?.number}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E9DFCC] flex items-center justify-center">
                  <div className="p-2 bg-white rounded-xl border border-[#E9DFCC] shadow-inner">
                    <svg viewBox="0 0 29 29" className="w-32 h-32">
                      <path d={qrSvgPath} fill="#1F1A17" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Link
                  to="/mis-reservas"
                  className="py-2.5 px-5 rounded-xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-bold transition-colors"
                >
                  Ver Mis Reservas
                </Link>
                <Link
                  to="/"
                  className="py-2.5 px-5 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] text-xs font-semibold transition-colors"
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
