import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { Order, OrderStatus } from '../../types';
import {
  Clock,
  CheckCircle2,
  Flame,
  Utensils,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  ChefHat,
  BellRing,
} from 'lucide-react';

export const LiveOrderTrackerPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, country, formatPrice, advanceKitchenOrder, t } = useApp();

  const order = orders.find((o) => o.id === orderId) || orders[0];
  const countryConfig = COUNTRIES[country];

  const steps: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      status: 'received',
      label: 'Comanda Recibida',
      desc: 'El pedido ha entrado al sistema distribuido y fue enviado a cocina.',
      icon: CheckCircle2,
    },
    {
      status: 'preparing',
      label: 'En Preparación',
      desc: 'Nuestros cocineros están elaborando tus platos en este momento.',
      icon: Flame,
    },
    {
      status: 'ready',
      label: 'Lista para Servir',
      desc: 'Platos emplatados en barra, el mesero los lleva a tu mesa.',
      icon: ChefHat,
    },
    {
      status: 'delivered',
      label: 'Entregada en Mesa',
      desc: '¡Buen provecho! Comanda completada y entregada con éxito.',
      icon: Utensils,
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'created':
      case 'received':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1F1A17]">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8452C] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </Link>

        {/* Order Header Card */}
        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E9DFCC]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A33D]/20 text-[#C8452C] text-xs font-mono font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SEGUIMIENTO EN TIEMPO REAL</span>
              </div>
              <h1 className="font-serif font-bold text-2xl text-[#1F1A17]">
                Comanda {order?.orderNumber || 'CMD-001'}
              </h1>
              <p className="text-xs text-[#7A6E65]">
                Mesa #{order?.tableNumber || 3} • Creada hace unos momentos
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-[#7A6E65] block uppercase font-bold">Total</span>
              <span className="font-bold text-xl text-[#C8452C]">
                {formatPrice(order?.total || 0)}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-6 py-2">
            {steps.map((st, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const isPending = idx > currentStepIdx;

              return (
                <div key={st.status} className="flex items-start gap-4 relative">
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-5 top-10 bottom-0 w-0.5 -mb-6 ${
                        isPast ? 'bg-[#6B7A3A]' : 'bg-[#E9DFCC]'
                      }`}
                    />
                  )}

                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all ${
                      isPast
                        ? 'bg-[#6B7A3A] text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#C8452C] text-white shadow-lg ring-4 ring-[#C8452C]/20 animate-pulse'
                        : 'bg-[#E9DFCC] text-[#7A6E65]'
                    }`}
                  >
                    <st.icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`font-serif font-bold text-sm ${
                          isCurrent ? 'text-[#C8452C]' : isPast ? 'text-[#1F1A17]' : 'text-[#7A6E65]'
                        }`}
                      >
                        {st.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8452C]/10 text-[#C8452C] font-bold">
                          FASE ACTUAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A6E65] mt-0.5 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Items Summary */}
          {order?.items && (
            <div className="pt-4 border-t border-[#E9DFCC] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block font-mono">
                Platos en esta Comanda ({order.items.length})
              </span>
              <div className="divide-y divide-[#E9DFCC]/60 bg-[#FBF6EC] rounded-2xl p-3 border border-[#E9DFCC]">
                {order.items.map((it, idx) => (
                  <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1F1A17]">
                      {it.quantity}x {it.name}
                    </span>
                    <span className="font-mono text-[#7A6E65]">
                      {formatPrice(it.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Simulation Advancement Button */}
          {order && order.status !== 'delivered' && (
            <div className="pt-4 border-t border-[#E9DFCC] flex items-center justify-between">
              <span className="text-[11px] text-[#7A6E65] italic">
                ¿Deseas probar la simulación de avance de cocina?
              </span>
              <button
                type="button"
                onClick={() => advanceKitchenOrder(order.id)}
                className="py-2 px-4 rounded-xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <ChefHat className="w-3.5 h-3.5 text-[#E8A33D]" />
                <span>Avanzar Estado en Cocina</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
