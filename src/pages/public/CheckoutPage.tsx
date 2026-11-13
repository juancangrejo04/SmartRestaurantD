import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getRegionProfile } from '../../data/regions';
import { MoneyUtils } from '../../core/money';
import { orderService } from '../../services/orderService';
import { AddressForm } from '../../components/common/AddressForm';
import { NameFields } from '../../components/common/NameFields';
import { PhoneInput } from '../../components/common/PhoneInput';
import { DeliveryAddress, OrderItem } from '../../types';
import {
  CreditCard,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  ArrowLeft,
  Info,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    deliveryCart,
    branches,
    restaurants,
    currentUser,
    language,
    placeDeliveryOrder,
    getBranchDisplayName,
    getBranchCityName,
    loc,
    t,
  } = useApp();

  const navigate = useNavigate();

  const checkoutBranch = deliveryCart
    ? branches.find((b) => b.id === deliveryCart.branchId) || branches[0]
    : branches[0];
  const restaurant =
    restaurants.find((r) => r.id === checkoutBranch.restaurantId) || restaurants[0];
  const checkoutProfile = getRegionProfile(checkoutBranch.country);

  const initialNameParts = (currentUser?.name || '').trim().split(/\s+/);
  const [givenName, setGivenName] = useState(
    currentUser?.firstName || initialNameParts[0] || ''
  );
  const [familyName, setFamilyName] = useState(
    currentUser?.lastName || initialNameParts.slice(1).join(' ') || ''
  );
  const [customerPhone, setCustomerPhone] = useState(
    (currentUser?.phone || '').replace(checkoutProfile.phonePrefix, '').trim()
  );
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [kitchenNotes, setKitchenNotes] = useState('');

  const [addressValues, setAddressValues] = useState<Record<string, string>>({
    streetLine: '',
    suiteOrApt: '',
    neighborhood: checkoutBranch.neighborhood || '',
    city: checkoutBranch.city,
    stateOrPrefecture: '',
    postalCode: '',
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<{
    givenName?: string;
    familyName?: string;
    phone?: string;
    email?: string;
  }>({});

  const [selectedTipBps, setSelectedTipBps] = useState<number>(
    checkoutProfile.tipPolicy.defaultBps
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    checkoutProfile.paymentMethods[0]?.id || 'card'
  );
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    setAddressValues((prev) => ({
      ...prev,
      city: checkoutBranch.city,
      neighborhood: prev.neighborhood || checkoutBranch.neighborhood || '',
    }));
    setSelectedTipBps(checkoutProfile.tipPolicy.defaultBps);
    setSelectedPaymentMethod(checkoutProfile.paymentMethods[0]?.id || 'card');
  }, [checkoutBranch.id, checkoutBranch.city, checkoutBranch.neighborhood, checkoutProfile]);

  if (!deliveryCart || deliveryCart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBF6EC] py-16 px-4 font-sans">
        <div className="max-w-md mx-auto bg-[#FFFDF8] rounded-3xl p-10 border border-[#E9DFCC] shadow-md text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#E8A33D] mx-auto opacity-70" />
          <h1 className="font-serif font-bold text-2xl text-[#1F1A17]">
            {t('checkout_empty_title')}
          </h1>
          <p className="text-xs text-[#7A6E65]">{t('cart_empty')}</p>
          <Link
            to="/restaurantes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8452C] text-white text-xs font-bold shadow-md"
          >
            <span>{t('cta_explore')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const orderItems: OrderItem[] = deliveryCart.items.map((ci) => ({
    menuItemId: ci.menuItemId,
    name: loc(ci.name),
    quantity: ci.quantity,
    unitPriceMinorUnits: ci.unitPriceMinorUnits,
    subtotalMinorUnits: ci.subtotalMinorUnits,
  }));

  const subtotalMinorUnits = orderItems.reduce(
    (sum, item) => sum + (item.subtotalMinorUnits || 0),
    0
  );
  const deliveryFeeMinorUnits = checkoutProfile.revenueModel.baseDeliveryFeeMinorUnits;
  const tipAmountMinorUnits = checkoutProfile.tipPolicy.showWidget
    ? orderService.calculateTip(subtotalMinorUnits, selectedTipBps)
    : 0;

  const jurisdictionHint =
    addressValues.stateOrPrefecture?.trim() || addressValues.city?.trim() || checkoutBranch.city;

  const { taxBreakdown, totalTaxMinorUnits } = orderService.calculateTaxes(
    subtotalMinorUnits,
    deliveryFeeMinorUnits,
    checkoutBranch.country,
    'delivery',
    jurisdictionHint
  );

  const grandTotalMinorUnits =
    subtotalMinorUnits + deliveryFeeMinorUnits + totalTaxMinorUnits + tipAmountMinorUnits;

  const handleAddressChange = (key: string, value: string) => {
    setAddressValues((prev) => ({ ...prev, [key]: value }));
    setAddressErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateForm = (): boolean => {
    const nextAddrErrors: Record<string, string> = {};
    for (const field of checkoutProfile.addressFields) {
      const val = (addressValues[field.key] || '').trim();
      if (field.required && !val) {
        nextAddrErrors[field.key] = t('checkout_err_required');
      } else if (field.key === 'postalCode' && val && checkoutProfile.postalCodeRegex) {
        try {
          if (!new RegExp(checkoutProfile.postalCodeRegex).test(val)) {
            nextAddrErrors[field.key] = t('checkout_err_postal', {
              mask: checkoutProfile.postalCodeMask,
            });
          }
        } catch {
          // ignore malformed regex
        }
      }
    }

    const nextFormErrors: {
      givenName?: string;
      familyName?: string;
      phone?: string;
      email?: string;
    } = {};
    if (!givenName.trim()) nextFormErrors.givenName = t('checkout_err_required');
    if (!familyName.trim()) nextFormErrors.familyName = t('checkout_err_required');

    const cleanPhone = customerPhone.trim();
    if (!cleanPhone) {
      nextFormErrors.phone = t('checkout_err_required');
    } else if (checkoutProfile.phoneRegex) {
      try {
        if (!new RegExp(checkoutProfile.phoneRegex).test(cleanPhone)) {
          nextFormErrors.phone = t('checkout_err_phone', {
            example: checkoutProfile.phoneFormatPlaceholder,
          });
        }
      } catch {
        // ignore
      }
    }

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      nextFormErrors.email = t('checkout_err_email');
    }

    setAddressErrors(nextAddrErrors);
    setFormErrors(nextFormErrors);

    return (
      Object.keys(nextAddrErrors).length === 0 &&
      Object.keys(nextFormErrors).length === 0
    );
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (!termsAccepted) {
      setCheckoutError(t('checkout_err_terms'));
      return;
    }

    if (!validateForm()) {
      setCheckoutError(t('checkout_err_fix_fields'));
      return;
    }

    setLoading(true);
    try {
      const deliveryAddress: DeliveryAddress = {
        streetLine: (addressValues.streetLine || '').trim(),
        suiteOrApt: (addressValues.suiteOrApt || '').trim() || undefined,
        neighborhood: (addressValues.neighborhood || '').trim() || undefined,
        city: (addressValues.city || checkoutBranch.city).trim(),
        stateOrPrefecture: (addressValues.stateOrPrefecture || '').trim() || undefined,
        postalCode: (addressValues.postalCode || '').trim(),
        country: checkoutBranch.country,
      };

      const fullName =
        checkoutProfile.nameOrder === 'family_given'
          ? `${familyName.trim()} ${givenName.trim()}`
          : `${givenName.trim()} ${familyName.trim()}`;

      const branchLat = checkoutBranch.coordinates?.lat ?? 4.65;
      const branchLng = checkoutBranch.coordinates?.lng ?? -74.05;

      const res = await placeDeliveryOrder({
        branch: checkoutBranch,
        items: orderItems,
        deliveryAddress,
        deliveryCoords: {
          latitude: branchLat + 0.014,
          longitude: branchLng + 0.012,
        },
        customerName: fullName,
        customerPhone: `${checkoutProfile.phonePrefix} ${customerPhone.trim()}`,
        customerEmail: customerEmail.trim(),
        tipBps: selectedTipBps,
        paymentMethod: selectedPaymentMethod,
        kitchenNotes: kitchenNotes.trim() || undefined,
        simulatePaymentFailure: simulateFailure,
      });

      if (!res.success) {
        setCheckoutError(t(res.errorKey || 'checkout_err_payment_declined'));
        setLoading(false);
        return;
      }

      navigate(`/pedido/${res.order.id}`);
    } catch {
      setCheckoutError(t('checkout_err_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <Link
              to="/carrito"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A6E65] hover:text-[#1F1A17] mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('cart_title')}</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1F1A17]">
              {t('checkout_title')}
            </h1>
            <p className="text-xs text-[#7A6E65] mt-1">
              {restaurant.name} — <strong className="text-[#1F1A17]">{getBranchDisplayName(checkoutBranch)}</strong> ({getBranchCityName(checkoutBranch)}, {checkoutProfile.nativeName})
            </p>
          </div>
        </div>

        {checkoutError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-3 shadow-md">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">{t('checkout_error_title')}</strong>
              <span>{checkoutError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Delivery Address */}
            <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-md space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E9DFCC]">
                <MapPin className="w-4 h-4 text-[#C8452C]" />
                <h2 className="text-sm font-bold text-[#1F1A17]">
                  1. {t('checkout_step_address')} ({getBranchCityName(checkoutBranch)})
                </h2>
              </div>

              <AddressForm
                profile={checkoutProfile}
                language={language}
                values={addressValues}
                errors={addressErrors}
                onChange={handleAddressChange}
                disabled={loading}
              />
            </div>

            {/* 2. Customer Contact */}
            <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-md space-y-4">
              <h2 className="text-sm font-bold text-[#1F1A17] pb-3 border-b border-[#E9DFCC]">
                2. {t('checkout_step_contact')}
              </h2>

              <NameFields
                profile={checkoutProfile}
                language={language}
                givenName={givenName}
                familyName={familyName}
                onGivenNameChange={setGivenName}
                onFamilyNameChange={setFamilyName}
                givenNameError={formErrors.givenName}
                familyNameError={formErrors.familyName}
                disabled={loading}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1F1A17] block">
                    {t('phone_label')} *
                  </label>
                  <PhoneInput
                    profile={checkoutProfile}
                    value={customerPhone}
                    onChange={setCustomerPhone}
                    error={formErrors.phone}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1F1A17] block">
                    {t('email_label')} *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    disabled={loading}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border bg-[#FFFDF8] text-[#1F1A17] focus:outline-none focus:ring-1 ${
                      formErrors.email
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-[#E9DFCC] focus:border-[#E8A33D] focus:ring-[#E8A33D]'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-[10px] text-rose-500 font-medium">{formErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="block font-semibold text-[#1F1A17]">
                  {t('kitchen_notes_label')}
                </label>
                <input
                  type="text"
                  value={kitchenNotes}
                  disabled={loading}
                  onChange={(e) => setKitchenNotes(e.target.value)}
                  placeholder={t('kitchen_notes_placeholder')}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] border border-[#E9DFCC] text-[#1F1A17] focus:outline-none focus:border-[#E8A33D]"
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
                <h2 className="text-sm font-bold text-[#1F1A17] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C8452C]" />
                  <span>
                    3. {t('checkout_step_payment')} ({checkoutProfile.nativeName})
                  </span>
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                  {t('demo_payment_badge')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {checkoutProfile.paymentMethods.map((pm) => {
                  const isSelected = selectedPaymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(pm.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#C8452C] bg-[#C8452C]/10 text-[#1F1A17] font-bold shadow-xs ring-1 ring-[#C8452C]'
                          : 'border-[#E9DFCC] bg-[#FBF6EC] text-[#7A6E65] hover:text-[#1F1A17]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">{t(pm.labelKey)}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#C8452C]" />}
                      </div>
                      <span className="text-[10px] text-[#7A6E65] font-mono capitalize">
                        {pm.kind}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-[#FBF6EC] rounded-2xl border border-[#E9DFCC] text-xs">
                <label className="flex items-center justify-between cursor-pointer gap-3">
                  <div>
                    <span className="font-bold text-[#1F1A17] block">
                      {t('checkout_test_decline_title')}
                    </span>
                    <span className="text-[11px] text-[#7A6E65]">
                      {t('checkout_test_decline_desc')}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="w-4 h-4 rounded border-[#E9DFCC] text-[#C8452C] focus:ring-[#C8452C]"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-xl space-y-5 sticky top-24">
              <h2 className="text-base font-bold text-[#1F1A17] pb-3 border-b border-[#E9DFCC] flex items-center justify-between">
                <span>{t('checkout_summary_title')}</span>
                <span className="text-xs font-mono font-bold text-[#C8452C]">
                  {checkoutProfile.currency}
                </span>
              </h2>

              <div className="divide-y divide-[#E9DFCC]/60 text-xs">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
                    <span className="font-bold text-[#1F1A17]">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-mono font-bold text-[#1F1A17] shrink-0">
                      {MoneyUtils.format(
                        {
                          amount: item.subtotalMinorUnits || 0,
                          currency: checkoutProfile.currency,
                        },
                        checkoutProfile
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {checkoutProfile.tipPolicy.showWidget && (
                <div className="p-3 bg-[#FBF6EC] rounded-2xl border border-[#E9DFCC] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#1F1A17]">{t('tip_label')}:</span>
                    <span className="font-mono font-bold text-[#C8452C]">
                      {MoneyUtils.format(
                        { amount: tipAmountMinorUnits, currency: checkoutProfile.currency },
                        checkoutProfile
                      )}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {checkoutProfile.tipPolicy.suggestionsBps.map((bps) => {
                      const isSel = selectedTipBps === bps;
                      return (
                        <button
                          key={bps}
                          type="button"
                          onClick={() => setSelectedTipBps(bps)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold font-mono transition-colors ${
                            isSel
                              ? 'bg-[#C8452C] text-white shadow-xs'
                              : 'bg-white text-[#1F1A17] border border-[#E9DFCC] hover:bg-[#E9DFCC]/50'
                          }`}
                        >
                          {bps === 0 ? '0%' : `${bps / 100}%`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {checkoutProfile.ui.serviceIncludedNotice && (
                <div className="p-3 rounded-2xl bg-[#FBF6EC] border border-[#E9DFCC] text-[11px] text-[#7A6E65] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#C8452C] shrink-0" />
                  <span>{t('checkout_service_included_notice')}</span>
                </div>
              )}

              <div className="border-t border-[#E9DFCC] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#7A6E65]">
                  <span>{t('subtotal')}:</span>
                  <span className="font-mono font-medium text-[#1F1A17]">
                    {MoneyUtils.format(
                      { amount: subtotalMinorUnits, currency: checkoutProfile.currency },
                      checkoutProfile
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[#7A6E65]">
                  <span>
                    {t('delivery_fee')} ({getBranchCityName(checkoutBranch)}):
                  </span>
                  <span className="font-mono font-medium text-[#1F1A17]">
                    {MoneyUtils.format(
                      { amount: deliveryFeeMinorUnits, currency: checkoutProfile.currency },
                      checkoutProfile
                    )}
                  </span>
                </div>

                {taxBreakdown.map((tb, idx) => (
                  <div key={idx} className="flex justify-between text-[#7A6E65]">
                    <span>
                      {t(tb.labelKey)} ({(tb.rateBps / 100).toFixed(1)}%):
                    </span>
                    <span className="font-mono font-medium text-[#1F1A17]">
                      {MoneyUtils.format(
                        { amount: tb.amountMinorUnits, currency: checkoutProfile.currency },
                        checkoutProfile
                      )}
                    </span>
                  </div>
                ))}

                {tipAmountMinorUnits > 0 && (
                  <div className="flex justify-between text-[#7A6E65]">
                    <span>{t('tip_label')}:</span>
                    <span className="font-mono font-medium text-[#1F1A17]">
                      {MoneyUtils.format(
                        { amount: tipAmountMinorUnits, currency: checkoutProfile.currency },
                        checkoutProfile
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-[#1F1A17] pt-2 border-t border-[#E9DFCC]">
                  <span>{t('total_to_pay')}:</span>
                  <span className="font-mono text-[#C8452C]">
                    {MoneyUtils.format(
                      { amount: grandTotalMinorUnits, currency: checkoutProfile.currency },
                      checkoutProfile
                    )}
                  </span>
                </div>
              </div>

              <label className="flex items-start gap-2 pt-2 text-[11px] text-[#7A6E65] cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-[#E9DFCC] text-[#C8452C] focus:ring-[#C8452C]"
                />
                <span>{t('checkout_accept_terms')}</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-[#C8452C]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>{t('checkout_processing')}</span>
                ) : (
                  <>
                    <span>{t('checkout_confirm_pay')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
