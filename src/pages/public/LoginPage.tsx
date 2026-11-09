import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  UserPlus,
  LogIn,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { currentUser, switchUserRole, registerCustomer, loginUser, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '';

  const [activeTab, setActiveTab] = useState<'roles' | 'register' | 'credentials'>('roles');

  // Credentials login state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const demoAccounts = authService.getDemoUsers();

  const handleRoleSelect = (role: UserRole) => {
    switchUserRole(role);
    showToast(`Sesión iniciada con éxito como ${role.toUpperCase()}`, 'success');

    if (redirectUrl) {
      navigate(redirectUrl);
    } else if (role === 'customer') {
      navigate('/');
    } else if (role === 'kitchen') {
      navigate('/app/cocina');
    } else {
      navigate('/app/dashboard');
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      showToast('Por favor introduce tu correo electrónico.', 'warning');
      return;
    }
    loginUser(emailInput, passwordInput);
    if (redirectUrl) {
      navigate(redirectUrl);
    } else {
      navigate('/');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      showToast('Por favor completa tu nombre y correo.', 'warning');
      return;
    }
    registerCustomer(regName, regEmail, regPhone, regPassword);
    if (redirectUrl) {
      navigate(redirectUrl);
    } else {
      navigate('/');
    }
  };

  const roleMeta: Record<
    UserRole,
    { label: string; desc: string; icon: any; color: string }
  > = {
    owner: {
      label: 'Propietario Multinacional',
      desc: 'Control global de marcas, finanzas, analítica y configuración.',
      icon: Shield,
      color: 'from-amber-600 to-amber-800',
    },
    admin: {
      label: 'Administrador de Sede',
      desc: 'Gestión de mesas, menú, comensales y reportes de sala.',
      icon: LayoutDashboard,
      color: 'from-blue-600 to-blue-800',
    },
    waiter: {
      label: 'Mesero / Salón',
      desc: 'Mapa de mesas, recepción de llamadas y entrega de comandas.',
      icon: Users,
      color: 'from-emerald-600 to-emerald-800',
    },
    kitchen: {
      label: 'Jefe de Cocina / KDS',
      desc: 'Pantalla KDS con cronómetro de preparación y despacho.',
      icon: ChefHat,
      color: 'from-rose-600 to-rose-800',
    },
    customer: {
      label: 'Comensal Gourmet',
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
            Inicia sesión como comensal o selecciona un rol para evaluar la plataforma.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto bg-[#FFFDF8] p-1.5 rounded-2xl border border-[#E9DFCC]">
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'roles'
                ? 'bg-[#1F1A17] text-white shadow-xs'
                : 'text-[#7A6E65] hover:text-[#1F1A17]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8A33D]" />
            <span>Roles Demo</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-[#1F1A17] text-white shadow-xs'
                : 'text-[#7A6E65] hover:text-[#1F1A17]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Nuevo Comensal</span>
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'credentials'
                ? 'bg-[#1F1A17] text-white shadow-xs'
                : 'text-[#7A6E65] hover:text-[#1F1A17]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Credenciales</span>
          </button>
        </div>

        {/* Tab 1: Roles Selection */}
        {activeTab === 'roles' && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-lg space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C8452C] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Acceso Rápido por Perfil</span>
              </div>
              <span className="text-[11px] text-[#7A6E65]">1 Clic para alternar permisos</span>
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
          </div>
        )}

        {/* Tab 2: Register New Customer */}
        {activeTab === 'register' && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 max-w-lg mx-auto border border-[#E9DFCC] shadow-lg space-y-5 animate-in fade-in">
            <div className="space-y-1 pb-3 border-b border-[#E9DFCC]">
              <h3 className="font-serif font-bold text-xl text-[#1F1A17]">
                Crear Cuenta de Comensal
              </h3>
              <p className="text-xs text-[#7A6E65]">
                Regístrate para guardar tus reservas y calificar tus comandas.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sofía Valenzuela"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="sofia@cliente.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  placeholder="+57 312 900 8000"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Registrarme y Acceder</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Credentials Login */}
        {activeTab === 'credentials' && (
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 max-w-lg mx-auto border border-[#E9DFCC] shadow-lg space-y-5 animate-in fade-in">
            <div className="space-y-1 pb-3 border-b border-[#E9DFCC]">
              <h3 className="font-serif font-bold text-xl text-[#1F1A17]">
                Ingreso con Credenciales
              </h3>
              <p className="text-xs text-[#7A6E65]">
                Introduce tus datos para acceder a tu cuenta.
              </p>
            </div>

            <form onSubmit={handleCustomLogin} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-6 rounded-2xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#E8A33D]" />
                <span>Ingresar</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
