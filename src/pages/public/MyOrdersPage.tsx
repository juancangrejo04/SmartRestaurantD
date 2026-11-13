import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ArrowRight, FileText, Bike, Utensils, LogIn } from 'lucide-react';
import { MoneyUtils, formatRegionalDate, formatRegionalTime } from '../../core/money';
import { getRegionProfile } from '../../data/regions';

export const MyOrdersPage: React.FC = () => {
  const {
    orders,
    currentUser,
    isAuthenticated,
    branches,
    country,
    getBranchDisplayName,
    t,
  } = useApp();

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-[#FBF6EC] py-16 px-4 text-center font-sans">
        <div className="max-w-md mx-auto bg-[#FFFDF8] rounded-3xl p-8 border border-[#E9DFCC] shadow-lg space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#E8A33D] mx-auto" />
          <h2 className="font-serif font-bold text-xl text-[#1F1A17]">
            {t('my_orders_title')}
          </h2>
          <p className="text-xs text-[#7A6E65]">{t('my_orders_login_prompt')}</p>
          <Link
            to="/login?redirect=/mis-pedidos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C8452C] text-white text-xs font-bold"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('auth_login_btn')}</span>
          </Link>
        </div>
      </div>
    );
  }

  const isStaff = ['owner', 'platform_admin', 'admin', 'branch_admin'].includes(currentUser.role);
  const userOrders = isStaff
    ? orders
    : orders.filter(
        (o) =>
          o.userId === currentUser.id ||
          (currentUser.email &&
            o.customerEmail &&
            o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8452C] px-2 py-0.5 rounded bg-[#C8452C]/10 border border-[#C8452C]/20">
            {t('my_orders_badge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1F1A17] mt-1">
            {t('my_orders_title')}
          </h1>
          <p className="text-xs text-[#7A6E65]">{t('my_orders_subtitle')}</p>
        </div>

        {userOrders.length === 0 ? (
          <div className="bg-[#FFFDF8] rounded-3xl p-12 text-center border border-[#E9DFCC] shadow-md space-y-3">
            <ShoppingBag className="w-12 h-12 text-[#E8A33D] mx-auto opacity-60" />
            <h3 className="font-serif font-bold text-base text-[#1F1A17]">
              {t('my_orders_empty_title')}
            </h3>
            <p className="text-xs text-[#7A6E65] max-w-sm mx-auto">
              {t('my_orders_empty_desc')}
            </p>
            <Link
              to="/restaurantes"
              className="inline-block mt-2 px-5 py-2.5 rounded-2xl bg-[#C8452C] text-white text-xs font-bold shadow-md"
            >
              {t('cta_explore')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => {
              const branch = branches.find((b) => b.id === order.branchId);
              const profile = getRegionProfile(branch?.country || country);
              const isDelivery = order.orderType === 'delivery' || !order.tableNumber;
              const formattedTotal = MoneyUtils.format(
                { amount: order.totalMinorUnits || 0, currency: order.currency },
                profile
              );

              return (
                <div
                  key={order.id}
                  className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#C8452C]/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#C8452C]">
                        #{order.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FBF6EC] border border-[#E9DFCC] text-[#1F1A17]">
                        {t(`order_status_${order.status}`)}
                      </span>
                      <span className="text-[11px] text-[#7A6E65] flex items-center gap-1">
                        {isDelivery ? (
                          <Bike className="w-3.5 h-3.5" />
                        ) : (
                          <Utensils className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isDelivery
                            ? t('order_type_delivery')
                            : `${t('table_label')} #${order.tableNumber}`}
                        </span>
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#1F1A17]">
                      {branch ? getBranchDisplayName(branch) : t('branch_label')}
                    </h3>

                    <p className="text-xs text-[#7A6E65]">
                      {formatRegionalDate(order.createdAt, profile)} ·{' '}
                      {formatRegionalTime(order.createdAt, profile)} • {order.items.length}{' '}
                      {t('items_label')}
                    </p>

                    <div className="text-xs font-mono font-bold text-[#1F1A17] pt-1">
                      {t('total')}: <span className="text-[#C8452C]">{formattedTotal}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <Link
                      to={`/comprobante/${order.id}`}
                      className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-white border border-[#E9DFCC] text-xs font-bold text-[#1F1A17] hover:bg-[#FBF6EC] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#7A6E65]" />
                      <span>{t('receipt_short')}</span>
                    </Link>
                    <Link
                      to={`/pedido/${order.id}`}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#C8452C] hover:bg-[#a6341f] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{t('tracker_short')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
