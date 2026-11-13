import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { kitchenService } from '../services/kitchenService';
import { Order, OrderStatus, Branch, OrderItem } from '../types';
import {
  Flame,
  Clock,
  CheckCircle,
  ChefHat,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const KitchenView: React.FC = () => {
  const {
    t,
    orders,
    activeBranchId,
    branches,
    advanceKitchenOrder,
    formatPrice,
    getBranchDisplayName,
  } = useApp();

  const [tick, setTick] = useState(0);

  // Re-render every 30 seconds to update elapsed timers
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  const activeBranch = branches.find((b: Branch) => b.id === activeBranchId);
  const kitchenTickets = kitchenService.getKitchenOrders(orders, activeBranchId);

  const renderOrderCard = (order: Order, currentColumn: OrderStatus) => {
    const elapsedMinutes = kitchenService.getElapsedMinutes(order.createdAt);
    const isUrgent = elapsedMinutes > (order.estimatedReadyMinutes || 15);

    let nextBtnLabel = t('start_prep');
    let nextBtnClass = 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold';

    if (currentColumn === 'preparing') {
      nextBtnLabel = t('mark_ready');
      nextBtnClass = 'bg-blue-500 hover:bg-blue-400 text-white font-bold';
    } else if (currentColumn === 'ready') {
      nextBtnLabel = t('mark_delivered');
      nextBtnClass = 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold';
    }

    return (
      <div
        key={order.id}
        className={`p-4 rounded-xl border bg-slate-900 shadow-md text-white flex flex-col justify-between transition-all ${
          isUrgent
            ? 'border-rose-500/80 ring-1 ring-rose-500/50'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm text-amber-400">
                {order.orderNumber}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold">
                {t('table_label')} #{order.tableNumber}
              </span>
            </div>

            <div
              className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                isUrgent
                  ? 'bg-rose-500/20 text-rose-300 font-bold animate-pulse'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{elapsedMinutes}m</span>
            </div>
          </div>

          {/* Customer / Origin */}
          <div className="text-[11px] text-slate-400 mb-3 flex items-center justify-between">
            <span>{order.customerName || `${t('table_label')} ${order.tableNumber}`}</span>
            <span className="font-mono text-slate-500">
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Items checklist */}
          <div className="space-y-2 mb-4">
            {order.items.map((item: OrderItem, idx: number) => (
              <div
                key={idx}
                className="flex items-start justify-between text-xs gap-2 py-1 border-b border-slate-800/40 last:border-0"
              >
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {item.quantity}x
                  </span>
                  <div>
                    <span className="font-medium text-slate-200">{item.name}</span>
                    {item.notes && (
                      <p className="text-[10px] text-amber-400/90 italic mt-0.5">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {currentColumn !== 'delivered' && (
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => advanceKitchenOrder(order.id)}
              className={`w-full py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm ${nextBtnClass}`}
            >
              <span>{nextBtnLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{activeBranch ? getBranchDisplayName(activeBranch) : ''}</span>
            <span>·</span>
            <span className="text-amber-600 font-medium">{t('realtime_sync')}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-amber-500" />
            <span>{t('kds_title')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('kds_subtitle')}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('sync_active')}</span>
        </div>
      </div>

      {/* 4-Column KDS Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Column 1: Received */}
        <div className="flex flex-col bg-slate-100/70 p-3 rounded-2xl border border-slate-200/80 min-h-[550px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                {t('col_received')}
              </h3>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-xs">
              {kitchenTickets.received.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {kitchenTickets.received.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {t('no_results')}
              </div>
            ) : (
              kitchenTickets.received.map((order: Order) => renderOrderCard(order, 'received'))
            )}
          </div>
        </div>

        {/* Column 2: Preparing */}
        <div className="flex flex-col bg-slate-100/70 p-3 rounded-2xl border border-slate-200/80 min-h-[550px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                {t('col_preparing')}
              </h3>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-xs">
              {kitchenTickets.preparing.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {kitchenTickets.preparing.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {t('no_results')}
              </div>
            ) : (
              kitchenTickets.preparing.map((order: Order) => renderOrderCard(order, 'preparing'))
            )}
          </div>
        </div>

        {/* Column 3: Ready for pickup */}
        <div className="flex flex-col bg-slate-100/70 p-3 rounded-2xl border border-slate-200/80 min-h-[550px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                {t('col_ready')}
              </h3>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-xs">
              {kitchenTickets.ready.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {kitchenTickets.ready.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {t('no_results')}
              </div>
            ) : (
              kitchenTickets.ready.map((order: Order) => renderOrderCard(order, 'ready'))
            )}
          </div>
        </div>

        {/* Column 4: Delivered */}
        <div className="flex flex-col bg-slate-100/70 p-3 rounded-2xl border border-slate-200/80 min-h-[550px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                {t('col_delivered')}
              </h3>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-xs">
              {kitchenTickets.delivered.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {kitchenTickets.delivered.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {t('no_results')}
              </div>
            ) : (
              kitchenTickets.delivered.map((order: Order) => renderOrderCard(order, 'delivered'))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
