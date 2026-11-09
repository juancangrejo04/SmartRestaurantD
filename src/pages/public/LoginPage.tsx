import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/authService';
import { UserRole } from '../../types';
import {
  KeyRound,
  Shield,
  ArrowRight,
  Sparkles,
  ChefHat,
  Users,
  UtensilsCrossed,
  LayoutDashboard,
  Check,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { currentUser, switchUserRole, showToast } = useApp();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const demoAccounts = authService.getDemoUsers();

  const handleRoleSelect = (role: UserRole) => {
    switchUserRole(role);
    showToast(`Sesión iniciada con éxito como ${role.toUpperCase()}`, 'success');
    if (role === 'customer') {
      navigate('/');
    } else if (role === 'kitchen') {
      navigate('/app/cocina');
    } else {
      navigate('/app/dashboard');
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleRoleSelect('admin');
  };

  const roleMeta: Record<
    UserRole,
    { label: string; desc: string; icon: any; color: string }
  > = {
    owner: {
      label: 'Propietario Multinacional',
      desc: 'Control global de marcas, finanzas, analítica y monitor distribuido.',
      icon: Shield,
      color: 'from-amber-600 to-amber-800',
    },
    admin: {
      label: 'Administrador de Sede',
      desc: 'Gestión de mesas, menú, horarios de reserva y reportes operativos.',
      icon: LayoutDashboard,
      color: 'from-blue-600 to-blue-800',
    },
    waiter: {
      label: 'Mesero / Salón',
      desc: 'Mapa de mesas en vivo, toma de comandas y despacho a comensales.',
      icon: Users,
      color: 'from-emerald-600 to-emerald-800',
    },
    kitchen: {
      label: 'Jefe de Cocina / KDS',
      desc: 'Pantalla KDS con cronómetro de cocción y despacho de tickets.',
      icon: ChefHat,
      color: 'from-rose-600 to-rose-800',
    },
    customer: {
      label: 'Cliente Final',
      desc: 'Reservaciones en línea, lectura de menú QR y pedidos en mesa.',
      icon: UtensilsCrossed,
      color: 'from-purple-600 to-purple-800',
    },
  };

  return (
    <div className="min-h-screen bg-[#FBF6EC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1F1A17]">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8A33D] to-[#C8452C] flex items-center justify-center text-white mx-auto shadow-md">
              <span className="font-serif italic font-bold text-2xl">S</span>
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#1F1A17]">
            Acceso a SmartRestaurant
          </h1>
          <p className="text-xs text-[#7A6E65]">
            Inicia sesión o selecciona cualquiera de los 5 roles preconfigurados para evaluación directa.
          </p>
        </div>

        {/* 5 Quick Role Selection Cards */}
        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C8452C] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Acceso Rápido por Rol de Demostración</span>
            </div>
            <span className="text-[11px] text-[#7A6E65]">1 Clic para evaluar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {demoAccounts.map((u) => {
              const meta = roleMeta[u.role];
              const isCurrent = currentUser.role === u.role;

              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleRoleSelect(u.role)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                    isCurrent
                      ? 'bg-[#1F1A17] text-white border-[#1F1A17] shadow-lg'
                      : 'bg-[#FBF6EC] hover:bg-[#E9DFCC]/50 border-[#E9DFCC] text-[#1F1A17]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white shadow-xs`}
                      >
                        <meta.icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          isCurrent
                            ? 'bg-[#E8A33D] text-[#1F1A17]'
                            : 'bg-[#E9DFCC] text-[#7A6E65]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm leading-snug">
                      {meta.label}
                    </h4>
                    <p
                      className={`text-[11px] mt-1 leading-relaxed ${
                        isCurrent ? 'text-[#E9DFCC]/80' : 'text-[#7A6E65]'
                      }`}
                    >
                      {meta.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-current/10 flex items-center justify-between text-[11px] font-mono font-bold">
                    <span>{u.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Manual Credential Form */}
          <div className="pt-6 border-t border-[#E9DFCC] space-y-4">
            <span className="text-xs font-mono font-bold text-[#7A6E65] uppercase tracking-wider block">
              O ingresa con credenciales
            </span>
            <form onSubmit={handleCustomLogin} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="email"
                placeholder="correo@smartrestaurant.io"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
              />
              <input
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
              />
              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-[#C8452C] hover:bg-[#A83720] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Entrar como Administrador</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
