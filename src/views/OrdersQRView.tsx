import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table, MenuItem, OrderItem, Branch, Order } from '../types';
import { COUNTRIES } from '../i18n/countries';
import {
  QrCode,
  Smartphone,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  CreditCard,
  Banknote,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface OrdersQRViewProps {
  initialTable?: Table | null;
}

export const OrdersQRView: React.FC<OrdersQRViewProps> = ({ initialTable }) => {
  const {
    t,
    country,
    tables,
    activeBranchId,
    branches,
    menuItems,
    createOrder,
    orders,
    formatPrice,
  } = useApp();

  const branchTables = tables.filter((t: Table) => t.branchId === activeBranchId);
  const [selectedTableId, setSelectedTableId] = useState<string>(() => {
    return initialTable?.id || branchTables[0]?.id || '';
  });

  const [cart, setCart] = useState<OrderItem[]>([]);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [customerName, setCustomerName] = useState<string>('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const activeBranch = branches.find((b: Branch) => b.id === activeBranchId);
  const selectedTable = tables.find((t: Table) => t.id === selectedTableId) || branchTables[0];
  const countryConfig = COUNTRIES[country];
  const currentLang = countryConfig.language;

  // Cart Calculations
  const subtotalUSD = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const taxUSD = subtotalUSD * countryConfig.taxRate;
  const tipUSD = subtotalUSD * (tipPercent / 100);
  const totalUSD = subtotalUSD + taxUSD + tipUSD;

  const confirmedOrder = orders.find((o: Order) => o.id === confirmedOrderId);

  // Cart item management
  const handleAddToCart = (item: MenuItem) => {
    const itemName = item.name[currentLang] || item.name.es;
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItemId === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItemId === item.id
            ? {
                ...ci,
                quantity: ci.quantity + 1,
                subtotal: Number(((ci.quantity + 1) * ci.unitPrice).toFixed(2)),
              }
            : ci
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: itemName,
          quantity: 1,
          unitPrice: item.basePriceUSD || (item.price > 500 ? item.price / 4000 : item.price) || 15,
          subtotal: item.basePriceUSD || (item.price > 500 ? item.price / 4000 : item.price) || 15,
        },
      ];
    });
  };

  const handleUpdateQuantity = (menuItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.menuItemId === menuItemId) {
            const newQty = ci.quantity + delta;
            return {
              ...ci,
              quantity: newQty,
              subtotal: Number((newQty * ci.unitPrice).toFixed(2)),
            };
          }
          return ci;
        })
        .filter((ci) => ci.quantity > 0);
    });
  };

  const handleRemoveItem = (menuItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItemId !== menuItemId));
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0 || !selectedTable) return;
    setIsOrdering(true);

    try {
      const order = await createOrder(
        selectedTable.id,
        cart,
        tipPercent,
        customerName || `Comensal Mesa #${selectedTable.number}`
      );
      setConfirmedOrderId(order.id);
      setCart([]);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('qr_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('qr_subtitle')}</p>
        </div>

        {/* Table selector for simulation */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            {t('select_table_qr')}:
          </span>
          <select
            value={selectedTableId}
            onChange={(e) => {
              setSelectedTableId(e.target.value);
              setConfirmedOrderId(null);
            }}
            className="text-xs font-bold font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs cursor-pointer"
          >
            {branchTables.map((tbl: Table) => (
              <option key={tbl.id} value={tbl.id}>
                Mesa #{tbl.number} ({tbl.capacity} personas · Zona {tbl.zone})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Code Artifact Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col items-center text-center">
          <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
            Código QR de la Mesa
          </div>

          {/* Realistic SVG QR Code Representation */}
          <div className="p-4 bg-slate-950 rounded-2xl shadow-xl text-white mb-4 border-4 border-amber-400/80">
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="currentColor"
              shapeRendering="crispEdges"
            >
              {/* Outer boundary corners */}
              <rect x="0" y="0" width="30" height="30" fill="white" />
              <rect x="4" y="4" width="22" height="22" fill="#020617" />
              <rect x="9" y="9" width="12" height="12" fill="white" />

              <rect x="70" y="0" width="30" height="30" fill="white" />
              <rect x="74" y="4" width="22" height="22" fill="#020617" />
              <rect x="79" y="9" width="12" height="12" fill="white" />

              <rect x="0" y="70" width="30" height="30" fill="white" />
              <rect x="4" y="74" width="22" height="22" fill="#020617" />
              <rect x="9" y="79" width="12" height="12" fill="white" />

              {/* Data pixel simulation */}
              <rect x="36" y="6" width="6" height="6" fill="white" />
              <rect x="48" y="10" width="8" height="6" fill="white" />
              <rect x="36" y="24" width="12" height="6" fill="white" />
              <rect x="52" y="30" width="6" height="10" fill="white" />

              <rect x="12" y="38" width="6" height="6" fill="white" />
              <rect x="24" y="44" width="12" height="6" fill="white" />
              <rect x="40" y="44" width="10" height="10" fill="white" />
              <rect x="60" y="40" width="8" height="8" fill="white" />
              <rect x="76" y="38" width="6" height="12" fill="white" />

              <rect x="36" y="66" width="8" height="8" fill="white" />
              <rect x="52" y="62" width="14" height="6" fill="white" />
              <rect x="48" y="76" width="6" height="10" fill="white" />
              <rect x="68" y="72" width="10" height="6" fill="white" />
              <rect x="84" y="80" width="10" height="10" fill="white" />
            </svg>
          </div>

          <div className="space-y-1 mb-4">
            <h3 className="font-bold text-base text-slate-900">
              {activeBranch?.name}
            </h3>
            <p className="text-sm font-black font-mono text-amber-600">
              Mesa #{selectedTable?.number || 1} · Zona {selectedTable?.zone}
            </p>
            <p className="text-xs text-slate-400">
              Escanee con la cámara de su móvil o use el simulador interactivo
            </p>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Mercado: {countryConfig.name}</span>
            <span className="font-mono font-bold text-slate-800">{countryConfig.currency}</span>
          </div>
        </div>

        {/* Right Column: Smartphone Interactive Dine-in Simulator (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 text-white">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-sm text-white">
                  Simulador de Navegación Móvil del Comensal
                </h3>
                <p className="text-xs text-slate-400">
                  {activeBranch?.name} — Mesa #{selectedTable?.number}
                </p>
              </div>
            </div>

            {confirmedOrder && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                PEDIDO ACTIVO #{confirmedOrder.orderNumber}
              </span>
            )}
          </div>

          {/* Live Order Tracker Banner if an order was placed */}
          {confirmedOrder && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-800 to-amber-500/10 border border-amber-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-sm text-white">
                    ¡Comanda #{confirmedOrder.orderNumber} enviada a Cocina!
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 capitalize px-2 py-0.5 rounded bg-amber-400/10">
                  {confirmedOrder.status}
                </span>
              </div>

              {/* Progress step bar */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                <div className={`p-1.5 rounded ${confirmedOrder.status ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  1. Recibido
                </div>
                <div className={`p-1.5 rounded ${['preparing', 'ready', 'delivered'].includes(confirmedOrder.status) ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  2. Cocina
                </div>
                <div className={`p-1.5 rounded ${['ready', 'delivered'].includes(confirmedOrder.status) ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  3. Listo
                </div>
                <div className={`p-1.5 rounded ${confirmedOrder.status === 'delivered' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  4. Servido
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Dishes list to add (7 cols) */}
            <div className="md:col-span-7 space-y-3 max-h-[500px] overflow-y-auto pr-1">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Seleccione platos para la comanda
              </h4>

              {menuItems
                .filter((item: MenuItem) => item.available)
                .map((item: MenuItem) => {
                  const localizedName = item.name[currentLang] || item.name.es;
                  const localizedDesc = item.description[currentLang] || item.description.es;

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition-colors flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.image}
                        alt={localizedName}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h5 className="font-semibold text-xs text-white truncate">
                            {localizedName}
                          </h5>
                          <span className="font-mono text-xs font-bold text-amber-400 whitespace-nowrap">
                            {formatPrice(item.basePriceUSD || (item.price > 500 ? item.price / 4000 : item.price) || 15)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {localizedDesc}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-transform active:scale-95 shrink-0"
                        title={t('add_to_cart')}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
            </div>

            {/* Live Cart & Checkout (5 cols) */}
            <div className="md:col-span-5 bg-slate-800/80 rounded-2xl p-4 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-3">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    {t('cart')} ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                  </span>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-[10px] text-slate-400 hover:text-rose-400"
                    >
                      Vaciar
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    {t('cart_empty')}
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {cart.map((ci) => (
                      <div
                        key={ci.menuItemId}
                        className="flex items-center justify-between text-xs pb-2 border-b border-slate-700/50"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-medium text-white truncate">{ci.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {formatPrice(ci.unitPrice)} c/u
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleUpdateQuantity(ci.menuItemId, -1)}
                            className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold w-4 text-center">{ci.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(ci.menuItemId, 1)}
                            className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-amber-400 w-16 text-right">
                            {formatPrice(ci.subtotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals & Confirm */}
              <div className="pt-3 border-t border-slate-700 mt-4 space-y-2">
                {/* Tip Buttons */}
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{t('tip')}</span>
                  <div className="flex gap-1">
                    {[0, 5, 10, 15].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setTipPercent(pct)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          tipPercent === pct
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>{t('subtotal')}</span>
                    <span className="font-mono">{formatPrice(subtotalUSD)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{countryConfig.taxName}</span>
                    <span className="font-mono">{formatPrice(taxUSD)}</span>
                  </div>
                  {tipUSD > 0 && (
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Propina ({tipPercent}%)</span>
                      <span className="font-mono">{formatPrice(tipUSD)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-slate-700">
                    <span>{t('total')}</span>
                    <span className="font-mono text-amber-400">{formatPrice(totalUSD)}</span>
                  </div>
                </div>

                <button
                  disabled={cart.length === 0 || isOrdering}
                  onClick={handlePlaceOrder}
                  className="w-full py-2.5 mt-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isOrdering ? 'Procesando en Event Bus...' : t('simulate_payment')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
