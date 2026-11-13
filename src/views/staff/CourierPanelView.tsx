import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bike,
  Power,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Star,
  Navigation,
} from 'lucide-react';
import { dispatchService } from '../../services/dispatchService';
import { authService } from '../../services/authService';
import { DispatchOffer } from '../../types';
import { MoneyUtils } from '../../core/money';
import { formatRegionalDistance } from '../../core/geo';
import { getRegionProfile } from '../../data/regions';

export const CourierPanelView: React.FC = () => {
  const {
    currentUser,
    users,
    refreshUsers,
    orders,
    branches,
    assignCourierToOrder,
    updateDeliveryOrderStatus,
    completeDeliveryWithPin,
    showToast,
    t,
  } = useApp();

  const [offers, setOffers] = useState<DispatchOffer[]>([]);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [nowMs, setNowMs] = useState(() => Date.now());

  const courierProfile = getRegionProfile(currentUser?.country || 'CO');
  const isOnline = currentUser?.isOnline ?? true;

  const activeDelivery =
    orders.find(
      (o) =>
        o.courierId === currentUser?.id &&
        (o.status === 'delivering' || o.status === 'ready' || o.status === 'preparing')
    ) || null;

  const syncOffersAndRedistribute = useCallback(() => {
    if (!currentUser) return;
    setNowMs(Date.now());

    // Check unassigned delivery orders in courier's country and ensure active dispatch offer
    const pendingUnassigned = orders.filter(
      (o) =>
        o.orderType === 'delivery' &&
        !o.courierId &&
        o.status !== 'cancelled' &&
        o.status !== 'delivered'
    );

    pendingUnassigned.forEach((ord) => {
      const branch = branches.find((b) => b.id === ord.branchId);
      if (!branch || branch.country !== currentUser.country) return;
      const existingOffers = dispatchService.getOffersForOrder(ord.id);
      const hasValidOffer = existingOffers.some((off) => {
        const exp = off.expiresAt || off.expiresAtUtc || '';
        return (
          (off.status === 'pending' || off.status === 'offered') &&
          new Date(exp).getTime() > Date.now()
        );
      });
      if (!hasValidOffer) {
        const regionCouriers = users.filter(
          (u) => u.role === 'courier' && u.country === branch.country
        );
        const branchCoords = {
          latitude: branch.coordinates.lat,
          longitude: branch.coordinates.lng,
        };
        dispatchService.createDispatchOffer({
          orderId: ord.id,
          branchId: branch.id,
          branchCoords,
          deliveryCoords: branchCoords,
          couriers: regionCouriers,
          earningsMinorUnits: Math.max(
            100,
            Math.round((ord.deliveryFeeMinorUnits ?? 0) * 0.85)
          ),
          timeoutSeconds: 20,
        });
      }
    });

    const myOffers = isOnline
      ? dispatchService.getPendingOffersForCourier(currentUser.id)
      : [];
    setOffers(myOffers);
  }, [currentUser, orders, branches, users, isOnline]);

  useEffect(() => {
    syncOffersAndRedistribute();
    const interval = setInterval(syncOffersAndRedistribute, 1000);
    return () => clearInterval(interval);
  }, [syncOffersAndRedistribute]);

  const handleToggleOnline = () => {
    if (!currentUser) return;
    const nextOnline = !isOnline;
    authService.updateCourierState(currentUser.id, { isOnline: nextOnline });
    refreshUsers();
    showToast(
      nextOnline ? t('courier_online_toast') : t('courier_offline_toast'),
      'info'
    );
  };

  const handleAcceptOffer = (offer: DispatchOffer) => {
    if (!currentUser) return;
    const res = dispatchService.acceptOffer(offer.id, currentUser.id);
    if (res.success) {
      assignCourierToOrder(offer.orderId, currentUser.id, currentUser.name);
      setOffers((prev) => prev.filter((o) => o.id !== offer.id));
      showToast(t('courier_offer_accepted'), 'success');
    } else {
      showToast(res.error || t('error'), 'error');
    }
  };

  const handleRejectOffer = (offer: DispatchOffer) => {
    if (!currentUser) return;
    dispatchService.rejectOffer(offer.id, currentUser.id);
    setOffers((prev) => prev.filter((o) => o.id !== offer.id));
    showToast(t('courier_offer_rejected'), 'info');
    syncOffersAndRedistribute();
  };

  const handleConfirmPickup = () => {
    if (!activeDelivery) return;
    updateDeliveryOrderStatus(activeDelivery.id, 'delivering');
    showToast(t('courier_picked_up_toast'), 'success');
  };

  const handleVerifyDeliveryPin = () => {
    if (!activeDelivery || !currentUser) return;
    setPinError('');

    const result = completeDeliveryWithPin(
      activeDelivery.id,
      enteredPin,
      currentUser.id
    );
    if (!result.success) {
      setPinError(t(result.errorKey || 'courier_pin_mismatch'));
      return;
    }

    showToast(t('courier_delivered_toast'), 'success');
    setEnteredPin('');
  };

  const formattedEarnings = MoneyUtils.format(
    {
      amount: currentUser?.earningsMinorUnits ?? 0,
      currency: courierProfile.currency,
    },
    courierProfile
  );

  return (
    <div className="max-w-md mx-auto space-y-5 font-sans pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">
                {currentUser?.name || t('role_courier')}
              </h1>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-slate-200">
                  {(currentUser?.courierRating ?? 4.9).toFixed(1)}
                </span>
                <span>
                  •{' '}
                  {t('courier_completed_count', {
                    count: currentUser?.completedDeliveriesCount ?? 0,
                  })}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleOnline}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-2 ${
              isOnline
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-400 shadow-lg shadow-emerald-900/30'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Power className="w-4 h-4" />
            <span className="text-xs font-bold">
              {isOnline ? t('courier_online') : t('courier_offline')}
            </span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">{t('courier_daily_earnings')}:</span>
          <span className="text-base font-mono font-bold text-emerald-400">
            {formattedEarnings}
          </span>
        </div>
      </div>

      {activeDelivery ? (
        <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-mono font-bold text-amber-400 text-sm">
              {t('courier_active_delivery', { number: activeDelivery.orderNumber })}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {t(`status_${activeDelivery.status}`)}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">{t('delivery_address_title')}:</strong>
                <span>
                  {activeDelivery.deliveryAddress?.streetLine},{' '}
                  {activeDelivery.deliveryAddress?.city}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-300 pt-2 border-t border-slate-800/60">
              <Navigation className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">{t('client')}:</strong>
                <span>
                  {activeDelivery.customerName} •{' '}
                  {activeDelivery.customerPhone || '—'}
                </span>
              </div>
            </div>
          </div>

          {activeDelivery.status === 'ready' || activeDelivery.status === 'preparing' ? (
            <button
              onClick={handleConfirmPickup}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t('courier_confirm_pickup')}</span>
            </button>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{t('courier_pin_label')}</span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {t('courier_ask_customer_pin')}
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="4821"
                  className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-center text-lg font-mono font-bold text-white tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {pinError && (
                  <div className="text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{pinError}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleVerifyDeliveryPin}
                disabled={enteredPin.length < 4}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('courier_verify_pin_btn')}</span>
              </button>
            </div>
          )}
        </div>
      ) : null}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{t('courier_offers_title', { count: offers.length })}</span>
          </h2>
        </div>

        {offers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            {isOnline
              ? t('courier_waiting_offers')
              : t('courier_go_online_hint')}
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => {
              const earningsFormatted = MoneyUtils.format(
                {
                  amount:
                    offer.earningsMinorUnits ??
                    courierProfile.revenueModel.baseDeliveryFeeMinorUnits,
                  currency: courierProfile.currency,
                },
                courierProfile
              );
              const expStr = offer.expiresAt || offer.expiresAtUtc || '';
              const remainingSec = Math.max(
                0,
                Math.ceil((new Date(expStr).getTime() - nowMs) / 1000)
              );

              return (
                <div
                  key={offer.id}
                  className="p-4 rounded-2xl bg-slate-800/90 border border-amber-500/40 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-amber-300 text-sm">
                        {t('order')} #{offer.orderId.slice(-4)}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {formatRegionalDistance(
                          offer.distanceKm ?? offer.distanceKmOrMi ?? 1.2,
                          courierProfile
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400 text-sm block">
                        +{earningsFormatted}
                      </span>
                      <span className="text-[10px] text-amber-400 animate-pulse font-mono">
                        {t('courier_offer_expires', { seconds: remainingSec })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60">
                    <button
                      onClick={() => handleRejectOffer(offer)}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                    >
                      {t('action_reject')}
                    </button>
                    <button
                      onClick={() => handleAcceptOffer(offer)}
                      className="py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                    >
                      {t('courier_accept_offer')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
