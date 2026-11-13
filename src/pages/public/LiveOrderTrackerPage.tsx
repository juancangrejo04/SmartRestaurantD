import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getRegionProfile } from '../../data/regions';
import { formatRegionalTime } from '../../core/money';
import { formatRegionalDistance, haversineDistanceKm, interpolateCoordinates } from '../../core/geo';
import {
  CheckCircle2,
  Flame,
  ChefHat,
  Bike,
  Utensils,
  ArrowLeft,
  FileText,
  Star,
  MapPin,
  RotateCcw,
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const LiveOrderTrackerPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const {
    orders,
    branches,
    restaurants,
    users,
    country,
    cancelOrderWithCompensation,
    submitOrderRatings,
    getBranchDisplayName,
    getBranchCityName,
    showToast,
    t,
  } = useApp();

  const order = orders.find((o) => o.id === orderId) || orders[0];
  const branch = branches.find((b) => b.id === order?.branchId) || branches[0];
  const restaurant = restaurants.find((r) => r.id === order?.restaurantId) || restaurants[0];
  const profile = getRegionProfile(branch?.country || country);

  const [courierProgress, setCourierProgress] = useState(
    order?.status === 'delivering' ? 45 : order?.status === 'delivered' ? 100 : 15
  );
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [commerceScore, setCommerceScore] = useState(5);
  const [commerceComment, setCommerceComment] = useState('');
  const [courierScore, setCourierScore] = useState(5);
  const [courierComment, setCourierComment] = useState('');

  useEffect(() => {
    if (order?.status === 'delivering') {
      const interval = setInterval(() => {
        setCourierProgress((prev) => (prev >= 95 ? 95 : prev + 3));
      }, 3000);
      return () => clearInterval(interval);
    } else if (order?.status === 'delivered') {
      setCourierProgress(100);
    }
  }, [order?.status]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FBF6EC] p-8 text-center font-sans">
        <h2 className="text-lg font-bold text-[#1F1A17]">{t('tracker_not_found')}</h2>
        <Link to="/" className="text-[#C8452C] font-semibold mt-2 inline-block text-xs">
          {t('back_to_home')}
        </Link>
      </div>
    );
  }

  const isDelivery = order.orderType === 'delivery' || !order.tableNumber;
  const assignedCourier = users.find((u) => u.id === order.courierId);
  const displayCourierName = order.courierName || assignedCourier?.name || t('tracker_courier_pending');

  const steps: { status: OrderStatus; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      status: 'received',
      label: t('order_status_received'),
      desc: t('tracker_step_received_desc'),
      icon: CheckCircle2,
    },
    {
      status: 'preparing',
      label: t('order_status_preparing'),
      desc: t('tracker_step_preparing_desc'),
      icon: Flame,
    },
    {
      status: 'ready',
      label: isDelivery ? t('tracker_step_ready_delivery') : t('tracker_step_ready_table'),
      desc: isDelivery ? t('tracker_step_ready_delivery_desc') : t('tracker_step_ready_table_desc'),
      icon: ChefHat,
    },
    {
      status: 'delivering',
      label: isDelivery ? t('order_status_delivering') : t('tracker_step_served'),
      desc: isDelivery ? t('tracker_step_delivering_desc') : t('tracker_step_served_desc'),
      icon: isDelivery ? Bike : Utensils,
    },
    {
      status: 'delivered',
      label: t('order_status_delivered'),
      desc: t('tracker_step_delivered_desc'),
      icon: CheckCircle2,
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
      case 'delivering':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';
  const hasSubmittedRatings = Boolean(order.commerceRating);

  const handleCancelOrder = async () => {
    if (window.confirm(t('tracker_confirm_cancel'))) {
      await cancelOrderWithCompensation(order.id, t('tracker_cancelled_by_customer'));
      showToast(t('tracker_cancelled_toast'), 'info');
    }
  };

  const handleSubmitRatings = () => {
    if (hasSubmittedRatings) return;
    submitOrderRatings(order.id, {
      commerceRating: { rating: commerceScore, comment: commerceComment.trim() || undefined },
      courierRating:
        isDelivery && order.courierId
          ? { rating: courierScore, comment: courierComment.trim() || undefined }
          : undefined,
    });
    setShowRatingModal(false);
  };

  const startCoords = { latitude: branch.coordinates?.lat ?? 4.65, longitude: branch.coordinates?.lng ?? -74.05 };
  const destCoords = { latitude: startCoords.latitude + 0.014, longitude: startCoords.longitude + 0.012 };
  const routeDistanceKm = haversineDistanceKm(startCoords, destCoords);
  const interpolated = interpolateCoordinates(startCoords, destCoords, courierProgress / 100);

  const startX = 60;
  const startY = 140;
  const endX = 340;
  const endY = 60;
  const currentCourierX = startX + ((endX - startX) * courierProgress) / 100;
  const currentCourierY = startY + ((endY - startY) * courierProgress) / 100;

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/restaurantes"
            className="flex items-center gap-2 text-xs font-bold text-[#7A6E65] hover:text-[#1F1A17] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('cta_explore')}</span>
          </Link>

          <Link
            to={`/comprobante/${order.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E9DFCC] text-xs font-bold text-[#1F1A17] hover:bg-[#FBF6EC] transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4 text-[#C8452C]" />
            <span>{t('tracker_view_receipt')}</span>
          </Link>
        </div>

        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-[#C8452C]">
                  #{order.orderNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isCancelled
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : isDelivered
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {isCancelled
                    ? t('order_status_cancelled')
                    : t(`order_status_${order.status}`)}
                </span>
              </div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#1F1A17] mt-1">
                {restaurant.name} — {getBranchDisplayName(branch)}
              </h1>
              <p className="text-xs text-[#7A6E65]">
                {getBranchCityName(branch)}, {profile.nativeName} • {t('tracker_placed_at')}{' '}
                {formatRegionalTime(order.createdAt, profile)}
              </p>
            </div>

            {isDelivery && order.deliveryPin && !isDelivered && !isCancelled && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-center sm:text-right">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
                  {t('tracker_pin_label')}
                </span>
                <span className="font-mono text-2xl font-bold tracking-widest text-[#C8452C]">
                  {order.deliveryPin}
                </span>
                <span className="text-[9px] text-[#7A6E65] block">
                  {t('tracker_pin_hint')}
                </span>
              </div>
            )}
          </div>

          {!isCancelled && (
            <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
                {steps.map((st, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const Icon = st.icon;
                  return (
                    <div
                      key={st.status}
                      className={`p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-[#C8452C]/10 border-[#C8452C] ring-2 ring-[#C8452C]/20'
                          : isDone
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-[#FBF6EC] border-[#E9DFCC] text-[#7A6E65] opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon
                          className={`w-4 h-4 ${
                            isCurrent
                              ? 'text-[#C8452C]'
                              : isDone
                              ? 'text-emerald-600'
                              : 'text-[#7A6E65]'
                          }`}
                        />
                        <span className="font-bold text-xs">{st.label}</span>
                      </div>
                      <p className="text-[10px] leading-tight text-[#7A6E65]">{st.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isDelivery && !isCancelled && (
            <div className="rounded-2xl overflow-hidden border border-[#E9DFCC] bg-[#F4EFE6] relative p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1F1A17] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C8452C]" />
                  <span>
                    {t('tracker_route_title')} ({getBranchCityName(branch)})
                  </span>
                </span>
                <span className="text-[11px] font-mono text-[#7A6E65]">
                  {isDelivered
                    ? t('order_status_delivered')
                    : `ETA ~${Math.max(4, 20 - Math.round((courierProgress * 15) / 100))} min`}
                </span>
              </div>

              <div className="relative w-full h-48 bg-[#ECE4D5] rounded-xl overflow-hidden border border-[#E9DFCC]">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <line x1="0" y1="40" x2="400" y2="40" stroke="#DFD5C2" strokeWidth="6" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#DFD5C2" strokeWidth="8" />
                  <line x1="0" y1="160" x2="400" y2="160" stroke="#DFD5C2" strokeWidth="5" />
                  <line x1="80" y1="0" x2="80" y2="200" stroke="#DFD5C2" strokeWidth="6" />
                  <line x1="200" y1="0" x2="200" y2="200" stroke="#DFD5C2" strokeWidth="7" />
                  <line x1="320" y1="0" x2="320" y2="200" stroke="#DFD5C2" strokeWidth="5" />

                  <path
                    d={`M ${startX} ${startY} Q 180 160, 200 100 T ${endX} ${endY}`}
                    fill="none"
                    stroke="#C8452C"
                    strokeWidth="4"
                    strokeDasharray="6 4"
                  />

                  <circle cx={startX} cy={startY} r="10" fill="#1F1A17" />
                  <circle cx={startX} cy={startY} r="6" fill="#E8A33D" />
                  <text x={startX - 18} y={startY + 22} fontSize="10" fontWeight="bold" fill="#1F1A17">
                    {t('tracker_map_restaurant')}
                  </text>

                  <circle cx={endX} cy={endY} r="10" fill="#C8452C" />
                  <circle cx={endX} cy={endY} r="5" fill="#FFFFFF" />
                  <text x={endX - 14} y={endY + 22} fontSize="10" fontWeight="bold" fill="#C8452C">
                    {t('tracker_map_customer')}
                  </text>

                  <circle cx={currentCourierX} cy={currentCourierY} r="12" fill="#E8A33D" opacity="0.4" className="animate-ping" />
                  <circle cx={currentCourierX} cy={currentCourierY} r="8" fill="#1F1A17" stroke="#E8A33D" strokeWidth="2" />
                  <text x={currentCourierX - 20} y={currentCourierY - 14} fontSize="9" fontWeight="bold" fill="#1F1A17">
                    {t('role_courier')}
                  </text>
                </svg>
              </div>

              <div className="mt-2 flex flex-wrap justify-between items-center gap-2 text-[11px] text-[#7A6E65]">
                <span>
                  {t('role_courier')}: <strong className="text-[#1F1A17]">{displayCourierName}</strong>
                </span>
                <span className="font-mono">
                  {t('tracker_distance')}: ~{formatRegionalDistance(routeDistanceKm, profile)} ·{' '}
                  {interpolated.latitude.toFixed(3)}, {interpolated.longitude.toFixed(3)}
                </span>
              </div>
            </div>
          )}

          {!isDelivered && !isCancelled && currentStepIdx < 2 && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCancelOrder}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('tracker_cancel_order')}</span>
              </button>
            </div>
          )}

          {isDelivered && (
            <div className="pt-4 border-t border-[#E9DFCC] text-center space-y-3">
              {hasSubmittedRatings ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
                  <div className="font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('tracker_ratings_recorded')}</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-[#1F1A17]">
                    <span>
                      {restaurant.name}: <strong>{order.commerceRating?.rating}★</strong>
                    </span>
                    {order.courierRating && (
                      <span>
                        {displayCourierName}: <strong>{order.courierRating.rating}★</strong>
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400" />
                    ))}
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1F1A17]">
                    {t('tracker_rate_prompt_title')}
                  </h3>
                  <p className="text-xs text-[#7A6E65]">{t('tracker_rate_prompt_desc')}</p>
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="px-5 py-2.5 rounded-2xl bg-[#C8452C] hover:bg-[#a6341f] text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <Star className="w-4 h-4 fill-white" />
                    <span>{t('tracker_rate_cta')}</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {showRatingModal && !hasSubmittedRatings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
            <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] max-w-md w-full shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-[#E9DFCC]">
                <h3 className="font-bold text-base text-[#1F1A17]">
                  {t('tracker_rate_modal_title')}
                </h3>
                <button onClick={() => setShowRatingModal(false)} className="text-[#7A6E65]">
                  ✕
                </button>
              </div>

              <div className="p-4 bg-[#FBF6EC] rounded-2xl border border-[#E9DFCC] space-y-2">
                <span className="text-xs font-bold text-[#1F1A17] block">
                  1. {restaurant.name} ({getBranchDisplayName(branch)})
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCommerceScore(star)}
                      className={`p-1.5 rounded-lg ${
                        commerceScore >= star ? 'text-amber-500' : 'text-slate-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={commerceComment}
                  onChange={(e) => setCommerceComment(e.target.value)}
                  placeholder={t('tracker_rate_commerce_placeholder')}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E9DFCC] text-xs text-[#1F1A17]"
                />
              </div>

              {isDelivery && order.courierId && (
                <div className="p-4 bg-[#FBF6EC] rounded-2xl border border-[#E9DFCC] space-y-2">
                  <span className="text-xs font-bold text-[#1F1A17] block">
                    2. {t('role_courier')} ({displayCourierName})
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCourierScore(star)}
                        className={`p-1.5 rounded-lg ${
                          courierScore >= star ? 'text-amber-500' : 'text-slate-300'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={courierComment}
                    onChange={(e) => setCourierComment(e.target.value)}
                    placeholder={t('tracker_rate_courier_placeholder')}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E9DFCC] text-xs text-[#1F1A17]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#FBF6EC] text-[#7A6E65] text-xs"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleSubmitRatings}
                  className="px-4 py-2 rounded-xl bg-[#C8452C] hover:bg-[#a6341f] text-white font-bold text-xs shadow-md"
                >
                  {t('tracker_submit_ratings')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
