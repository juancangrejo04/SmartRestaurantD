import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgClass = 'bg-slate-900 border-slate-800 text-white';
        let Icon = Info;
        let iconColor = 'text-amber-400';

        if (toast.type === 'success') {
          bgClass = 'bg-slate-900 border-emerald-500/40 text-emerald-300';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          bgClass = 'bg-slate-900 border-amber-500/40 text-amber-300';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        } else if (toast.type === 'error') {
          bgClass = 'bg-slate-900 border-rose-500/40 text-rose-300';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-2xl flex items-start gap-3 text-xs backdrop-blur-md animate-fade-in ${bgClass}`}
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
            <p className="flex-1 font-medium leading-relaxed">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
};
