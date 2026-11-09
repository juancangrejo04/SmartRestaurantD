import React from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/authService';
import { UserRole } from '../../types';
import { X, Check, Shield, UserCheck, KeyRound } from 'lucide-react';

interface DemoAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoAccountsModal: React.FC<DemoAccountsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchUserRole } = useApp();
  const demoUsers = authService.getDemoUsers();

  if (!isOpen) return null;

  const roleDescriptions: Record<UserRole, { title: string; desc: string; access: string }> = {
    owner: {
      title: 'Propietario Multinacional (Owner)',
      desc: 'Control corporativo total de todos los restaurantes, países, finanzas y monitor distribuido.',
      access: 'Acceso Total (Global)',
    },
    admin: {
      title: 'Administrador de Sede (Admin)',
      desc: 'Gestión local de mesas, menú de precios, reservas entrantes, personal y reportes.',
      access: 'Gestión Operativa Completa',
    },
    waiter: {
      title: 'Mesero / Host de Salón (Waiter)',
      desc: 'Mapa interactivo de mesas en vivo, toma de comandas, comensales y entrega de platos.',
      access: 'Salón, Mesas y Comandas',
    },
    kitchen: {
      title: 'Jefe de Cocina / KDS (Kitchen)',
      desc: 'Pantalla de cocina (KDS), cronómetro por comanda y despacho de tickets en línea.',
      access: 'Pantalla KDS y Tiempos de Preparación',
    },
    customer: {
      title: 'Cliente Final (Customer)',
      desc: 'Reserva de mesas en tiempo real y simulación de pedidos directos escaneando QR.',
      access: 'Reservas y Pedido Móvil QR',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Cuentas de Demostración y Roles</h2>
              <p className="text-xs text-slate-400">
                Cambie instantáneamente de rol para evaluar los diferentes módulos y permisos del sistema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Users list */}
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {demoUsers.map((u) => {
            const isCurrent = currentUser.id === u.id;
            const details = roleDescriptions[u.role];

            return (
              <div
                key={u.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{u.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-amber-400 border border-slate-700">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</p>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">{details?.desc}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-amber-400/90 font-medium">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{details?.access}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  {isCurrent ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs">
                      <Check className="w-4 h-4" />
                      <span>Sesión Activa</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        switchUserRole(u.role);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-amber-400" />
                      <span>Asumir Rol</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>La sesión y cambios se conservan en LocalStorage.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
