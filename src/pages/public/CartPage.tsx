import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getRegionProfile } from '../../data/regions';
import { MoneyUtils } from '../../core/money';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  MapPin,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    deliveryCart,
    branches,
    restaurants,
    updateDeliveryCartQty,
    removeFromDeliveryCart,
    clearDeliveryCart,
    getBranchDisplayName,
    getBranchCityName,
    loc,
    t,
  } = useApp();

  if (!deliveryCart || deliveryCart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBF6EC] py-16 px-4 font-sans">
        <div className="max-w-md mx-auto bg-[#FFFDF8] rounded-3xl p-10 border border-[#E9DFCC] shadow-md text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#E8A33D] mx-auto opacity-70" />
          <h1 className="font-serif font-bold text-2xl text-[#1F1A17]">
            {t('cart_title')}
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

  const branch =
    branches.find((b) => b.id === deliveryCart.branchId) || branches[0];
  const restaurant =
    restaurants.find((r) => r.id === branch.restaurantId) || restaurants[0];
  const branchProfile = getRegionProfile(branch.country);

  const subtotalMinorUnits = deliveryCart.items.reduce(
    (sum, item) => sum + item.subtotalMinorUnits,
    0
  );
  const deliveryFeeMinorUnits = branchProfile.revenueModel.baseDeliveryFeeMinorUnits;
  const estTotalMinorUnits = subtotalMinorUnits + deliveryFeeMinorUnits;

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to={`/sucursal/${branch.id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-[#7A6E65] hover:text-[#1F1A17]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{getBranchDisplayName(branch)}</span>
          </Link>
          <button
            onClick={clearDeliveryCart}
            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('empty_cart')}</span>
          </button>
        </div>

        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-xl space-y-6">
          <div className="pb-4 border-b border-[#E9DFCC]">
            <h1 className="font-serif font-bold text-2xl text-[#1F1A17]">
              {t('cart_title')}
            </h1>
            <p className="text-xs text-[#7A6E65] flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C8452C]" />
              <span>
                {restaurant.name} — {getBranchDisplayName(branch)} ({getBranchCityName(branch)})
              </span>
            </p>
          </div>

          <div className="divide-y divide-[#E9DFCC]/70">
            {deliveryCart.items.map((item) => (
              <div
                key={item.menuItemId}
                className="py-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif font-bold text-sm text-[#1F1A17] truncate">
                    {loc(item.name)}
                  </h3>
                  <p className="text-xs font-mono text-[#7A6E65]">
                    {MoneyUtils.format(
                      { amount: item.unitPriceMinorUnits, currency: branchProfile.currency },
                      branchProfile
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-2 py-1">
                    <button
                      onClick={() =>
                        updateDeliveryCartQty(item.menuItemId, item.quantity - 1)
                      }
                      className="p-1 text-[#7A6E65] hover:text-[#C8452C]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-xs px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateDeliveryCartQty(item.menuItemId, item.quantity + 1)
                      }
                      className="p-1 text-[#7A6E65] hover:text-[#C8452C]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-mono font-bold text-xs text-[#1F1A17] w-20 text-right">
                    {MoneyUtils.format(
                      { amount: item.subtotalMinorUnits, currency: branchProfile.currency },
                      branchProfile
                    )}
                  </span>

                  <button
                    onClick={() => removeFromDeliveryCart(item.menuItemId)}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                    title={t('delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E9DFCC] space-y-2 text-xs">
            <div className="flex justify-between text-[#7A6E65]">
              <span>{t('subtotal')}</span>
              <span className="font-mono text-[#1F1A17]">
                {MoneyUtils.format(
                  { amount: subtotalMinorUnits, currency: branchProfile.currency },
                  branchProfile
                )}
              </span>
            </div>
            <div className="flex justify-between text-[#7A6E65]">
              <span>{t('delivery_fee')}</span>
              <span className="font-mono text-[#1F1A17]">
                {MoneyUtils.format(
                  { amount: deliveryFeeMinorUnits, currency: branchProfile.currency },
                  branchProfile
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#1F1A17] pt-2 border-t border-[#E9DFCC]">
              <span>{t('total')} ({t('cart_before_taxes')})</span>
              <span className="font-mono text-[#C8452C]">
                {MoneyUtils.format(
                  { amount: estTotalMinorUnits, currency: branchProfile.currency },
                  branchProfile
                )}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
          >
            <span>{t('cart_proceed_checkout')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
