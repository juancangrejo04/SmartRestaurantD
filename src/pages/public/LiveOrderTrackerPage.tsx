import React, { useState } from 'react';
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
  Star,
  Receipt,
  FileCheck,
} from 'lucide-react';

export const LiveOrderTrackerPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const {
    orders,
    branches,
    restaurants,
    country,
    formatPrice,
    advanceKitchenOrder,
    callWaiter,
    requestBill,
    addReview,
    currentUser,
    showToast,
  } = useApp();

  const order = orders.find((o) => o.id === orderId) || orders[0];
  const branch = branches.find((b) => b.id === order?.branchId);
  const restaurant = restaurants.find((r) => r.id === order?.restaurantId);
  const orderCountry = order?.currency === 'COP' ? 'CO' : order?.currency === 'MXN' ? 'MX' : order?.currency === 'BRL' ? 'BR' : order?.currency === 'JPY' ? 'JP' : 'US';

  // State for Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [dishesRating, setDishesRating] = useState<Record<string, number>>({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const steps: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      status: 'received',
      label: 'Comanda Recibida',
      desc: 'Tu pedido ha entrado al sistema y se encuentra en cola de cocina.',
      icon: CheckCircle2,
    },
    {
      status: 'preparing',
      label: 'En Cocina',
      desc: 'Nuestros cocineros están preparando tus platos en este momento.',
      icon: Flame,
    },
    {
      status: 'ready',
      label: 'Listo para Servir',
      desc: 'Tus platos han sido emplatados en barra y el mesero los lleva a tu mesa.',
      icon: ChefHat,
    },
    {
      status: 'delivered',
      label: 'Entregado en Mesa',
      desc: '¡Buen provecho! Tu pedido fue servido con éxito.',
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
  const isDelivered = order?.status === 'delivered';

  const handleCallWaiter = () => {
    if (order?.tableId) {
      callWaiter(order.tableId, 'Atención solicitada desde seguimiento de comanda');
    } else {
      showToast('Mesero notificado.', 'info');
    }
  };

  const handleRequestBill = () => {
    if (order?.tableId) {
      requestBill(order.tableId);
    } else {
      showToast('Cuenta solicitada al personal de sala.', 'success');
    }
  };

  const handleDishRatingChange = (menuItemId: string, rating: number) => {
    setDishesRating((prev) => ({ ...prev, [menuItemId]: rating }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Por favor incluye un comentario sobre la experiencia.', 'warning');
      return;
    }

    const dishRatingsPayload = (order?.items || []).map((it) => ({
      menuItemId: it.menuItemId,
      dishName: it.name,
      rating: dishesRating[it.menuItemId] || reviewRating,
    }));

    addReview({
      branchId: order?.branchId || branch?.id || 'branch-aura-co-bogota',
      restaurantId: order?.restaurantId || restaurant?.id || 'brand-aura',
      customerName: order?.customerName || currentUser.name || 'Comensal en Mesa',
      customerEmail: currentUser.email || 'comensal@smartrestaurant.io',
      rating: reviewRating,
      comment: reviewComment,
      orderId: order?.id,
      dishesRating: dishRatingsPayload,
    });

    setReviewSubmitted(true);
    setIsReviewModalOpen(false);
  };

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
                <span>SEGUIMIENTO EN VIVO</span>
              </div>
              <h1 className="font-serif font-bold text-2xl text-[#1F1A17]">
                Comanda {order?.orderNumber || 'CMD-001'}
              </h1>
              <p className="text-xs text-[#7A6E65]">
                {restaurant?.name || 'SmartRestaurant'} · {branch?.name} · <strong className="text-[#1F1A17]">Mesa #{order?.tableNumber || 1}</strong>
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-[#7A6E65] block uppercase font-bold">Total con Impuestos</span>
              <span className="font-bold text-xl text-[#C8452C]">
                {formatPrice(order?.total || 0, orderCountry)}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-6 py-2">
            {steps.map((st, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;

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

          {/* Quick Table Service Actions */}
          <div className="pt-4 border-t border-[#E9DFCC] grid grid-cols-2 gap-3">
            <button
              onClick={handleCallWaiter}
              className="py-2.5 px-4 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] text-xs font-semibold border border-[#E9DFCC] transition-colors flex items-center justify-center gap-1.5"
            >
              <BellRing className="w-4 h-4 text-[#C8452C]" />
              <span>Llamar al Mesero</span>
            </button>

            <button
              onClick={handleRequestBill}
              className="py-2.5 px-4 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] text-xs font-semibold border border-[#E9DFCC] transition-colors flex items-center justify-center gap-1.5"
            >
              <Receipt className="w-4 h-4 text-[#E8A33D]" />
              <span>Pedir la Cuenta</span>
            </button>
          </div>

          {/* Rate Order CTA when Delivered */}
          {isDelivered && (
            <div className="pt-4 border-t border-[#E9DFCC] bg-[#FBF6EC] rounded-2xl p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-[#E8A33D] text-[#E8A33D]" />
                ))}
              </div>
              <h3 className="font-serif font-bold text-base text-[#1F1A17]">
                ¿Cómo estuvo tu experiencia en {restaurant?.name}?
              </h3>
              <p className="text-xs text-[#7A6E65] max-w-sm mx-auto">
                {reviewSubmitted
                  ? '¡Muchas gracias por calificar tu comanda! Tu opinión ha sido publicada.'
                  : 'Califica la sazón de tus platos y el servicio recibido.'}
              </p>
              {!reviewSubmitted && (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all inline-flex items-center gap-1.5"
                >
                  <Star className="w-4 h-4" />
                  <span>Calificar este Pedido</span>
                </button>
              )}
            </div>
          )}

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
                      {formatPrice(it.subtotal, orderCountry)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demo progression control for test presentation */}
          {order && order.status !== 'delivered' && (
            <div className="pt-4 border-t border-[#E9DFCC] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#7A6E65]">
                Control de demostración:
              </span>
              <button
                type="button"
                onClick={() => advanceKitchenOrder(order.id)}
                className="py-2 px-3.5 rounded-xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
              >
                <ChefHat className="w-3.5 h-3.5 text-[#E8A33D]" />
                <span>Avanzar Estado en Cocina</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E9DFCC] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-[#E8A33D] text-[#E8A33D]" />
                <h3 className="font-serif font-bold text-xl text-[#1F1A17]">
                  Calificar Comanda {order.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Overall Star rating */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Calificación General
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating ? 'fill-[#E8A33D] text-[#E8A33D]' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-[#C8452C] ml-2">
                    {reviewRating} de 5 estrellas
                  </span>
                </div>
              </div>

              {/* Per-dish rating */}
              {order?.items && order.items.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#E9DFCC]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block">
                    Califica los platos consumidos
                  </label>
                  <div className="divide-y divide-[#E9DFCC]/60 bg-[#FBF6EC] p-3 rounded-2xl">
                    {order.items.map((it) => {
                      const currentDishRating = dishesRating[it.menuItemId] || reviewRating;
                      return (
                        <div key={it.menuItemId} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                          <span className="font-medium text-[#1F1A17]">{it.name}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => handleDishRatingChange(it.menuItemId, s)}
                                className="p-0.5"
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    s <= currentDishRating ? 'fill-[#E8A33D] text-[#E8A33D]' : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Comment */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Tu Opinión / Comentarios
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="La presentación, el sabor, la temperatura de los platos y el tiempo de entrega..."
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl p-3 text-xs font-medium text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E9DFCC]">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-[#7A6E65]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all"
                >
                  Enviar Calificación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
