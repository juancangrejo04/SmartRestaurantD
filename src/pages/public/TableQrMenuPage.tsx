import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { MenuItem, OrderItem, Branch, Restaurant, Table, MenuCategory } from '../../types';
import {
  UtensilsCrossed,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  Banknote,
  QrCode,
  ArrowRight,
  Flame,
  AlertTriangle,
  X,
  MapPin,
  ChevronRight,
} from 'lucide-react';

export const TableQrMenuPage: React.FC = () => {
  const { branchId, tableId } = useParams<{ branchId: string; tableId: string }>();
  const navigate = useNavigate();

  const {
    country,
    restaurants,
    branches,
    tables,
    menuItems,
    createOrder,
    formatPrice,
    showToast,
    t,
  } = useApp();

  const currentBranch = branches.find((b) => b.id === branchId) || branches[0];
  const currentRestaurant = currentBranch
    ? restaurants.find((r) => r.id === currentBranch.restaurantId)
    : restaurants[0];
  const currentTable = tables.find((t) => t.id === tableId) || tables[0];

  const countryConfig = COUNTRIES[currentBranch?.country || country];
  const currentLang = countryConfig.language;

  // Menu Category Filter
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [customerName, setCustomerName] = useState<string>('Comensal en Mesa');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'cash' | 'qr_transfer'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter items for this restaurant
  const restaurantMenuItems = menuItems.filter(
    (item) => !item.restaurantId || item.restaurantId === currentRestaurant?.id
  );

  const displayedItems = restaurantMenuItems.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name =
        typeof item.name === 'string'
          ? (item.name as string).toLowerCase()
          : String(item.name[currentLang] || item.name.es).toLowerCase();
      if (!name.includes(q)) return false;
    }
    return true;
  });

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const taxRate = countryConfig.taxRate;
  const taxAmount = subtotal * taxRate;
  const tipAmount = subtotal * (tipPercent / 100);
  const total = subtotal + taxAmount + tipAmount;

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (item: MenuItem) => {
    if (!item.available) {
      showToast('Este producto se encuentra agotado en cocina.', 'warning');
      return;
    }

    const itemName =
      typeof item.name === 'string'
        ? item.name
        : item.name[currentLang] || item.name.es;

    const unitPrice = item.basePriceUSD || (item.price > 500 ? item.price / 4000 : item.price) || 15;

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
          unitPrice,
          subtotal: unitPrice,
        },
      ];
    });

    showToast(`"${itemName}" agregado a la comanda`, 'success');
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

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast('Tu carrito está vacío.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder(
        currentTable.id,
        cart,
        tipPercent,
        customerName
      );

      showToast(`¡Comanda enviada a cocina! #${order.orderNumber}`, 'success');
      navigate(`/pedido/${order.id}`);
    } catch (err: any) {
      showToast(err?.message || 'Error al procesar comanda', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Toda la Carta' },
    { id: 'starters', label: 'Entradas' },
    { id: 'mains', label: 'Platos Fuertes' },
    { id: 'desserts', label: 'Postres' },
    { id: 'drinks', label: 'Bebidas' },
    { id: 'specials', label: 'Especiales' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF6EC] pb-28 font-sans text-[#1F1A17]">
      {/* Table Greeting Banner */}
      <div className="bg-[#1F1A17] text-[#FFFDF8] px-4 py-3 sticky top-0 z-30 shadow-md border-b border-[#332B25]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E8A33D] to-[#C8452C] flex items-center justify-center font-bold text-lg text-white">
              {currentTable?.number || 3}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-white">
                  Mesa #{currentTable?.number || 3}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E8A33D]/20 text-[#E8A33D] border border-[#E8A33D]/40">
                  {currentBranch?.name}
                </span>
              </div>
              <p className="text-[11px] text-[#E9DFCC]/80">
                {currentRestaurant?.name} • {countryConfig.name} ({countryConfig.currency})
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-[#FFFDF8] text-[#1F1A17] hover:bg-[#E9DFCC] font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#C8452C]" />
            <span className="hidden sm:inline">Comanda</span>
            {totalCartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C8452C] text-white text-[11px] font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Category Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#C8452C] text-white shadow-md'
                  : 'bg-[#FFFDF8] text-[#1F1A17] hover:bg-[#E9DFCC] border border-[#E9DFCC]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dishes List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedItems.map((item) => {
            const itemName =
              typeof item.name === 'string'
                ? item.name
                : item.name[currentLang] || item.name.es;
            const itemDesc =
              typeof item.description === 'string'
                ? item.description
                : item.description[currentLang] || item.description.es;
            const price = item.basePriceUSD || (item.price > 500 ? item.price / 4000 : item.price) || 15;

            return (
              <div
                key={item.id}
                className={`bg-[#FFFDF8] rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${
                  !item.available
                    ? 'opacity-60 border-slate-300'
                    : 'border-[#E9DFCC] hover:border-[#E8A33D] shadow-xs'
                }`}
              >
                <div className="flex gap-3 p-3">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative bg-slate-100">
                    <img
                      src={item.image}
                      alt={itemName}
                      className="w-full h-full object-cover"
                    />
                    {!item.available && (
                      <div className="absolute inset-0 bg-slate-900/75 flex items-center justify-center p-1 text-center">
                        <span className="text-[10px] font-bold text-white uppercase">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-sm text-[#1F1A17] leading-snug">
                          {itemName}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#7A6E65] line-clamp-2 mt-0.5 leading-relaxed">
                        {itemDesc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-mono font-bold text-sm text-[#C8452C]">
                        {formatPrice(price)}
                      </span>
                      <button
                        type="button"
                        disabled={!item.available}
                        onClick={() => handleAddToCart(item)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                          item.available
                            ? 'bg-[#C8452C] hover:bg-[#A83720] text-white shadow-xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-[11px] pr-1">Agregar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-40 animate-in slide-in-from-bottom-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#1F1A17] hover:bg-[#332B25] text-white shadow-2xl flex items-center justify-between border border-[#E8A33D]/40 transition-transform active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C8452C] flex items-center justify-center font-bold text-xs">
                {totalCartCount}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block">Ver Comanda Activa</span>
                <span className="text-[10px] text-[#E8A33D] font-mono">
                  Impuestos y propina incluidos
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#E8A33D]">
                {formatPrice(total)}
              </span>
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      )}

      {/* Full Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#FFFDF8] rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl border border-[#E9DFCC] text-[#1F1A17] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#E9DFCC] flex items-center justify-between bg-[#FBF6EC]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C8452C]" />
                <h3 className="font-serif font-bold text-base text-[#1F1A17]">
                  Tu Comanda — Mesa #{currentTable?.number || 3}
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#E9DFCC] text-[#7A6E65]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 divide-y divide-[#E9DFCC]/60">
              {cart.map((ci) => (
                <div key={ci.menuItemId} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="font-serif font-bold text-xs text-[#1F1A17]">{ci.name}</h5>
                    <span className="text-[11px] text-[#7A6E65] font-mono">
                      {formatPrice(ci.unitPrice)} c/u
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl p-1">
                      <button
                        onClick={() => handleUpdateQuantity(ci.menuItemId, -1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#1F1A17] hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-xs px-1">{ci.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(ci.menuItemId, 1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#1F1A17] hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-xs text-[#C8452C] min-w-[65px] text-right">
                      {formatPrice(ci.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tax & Tip Breakdown */}
            <div className="p-4 bg-[#FBF6EC] border-t border-[#E9DFCC] space-y-3 font-mono text-xs">
              <div className="flex justify-between text-[#7A6E65]">
                <span>Subtotal Comida:</span>
                <span className="font-bold text-[#1F1A17]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#7A6E65]">
                <span>{countryConfig.taxName}:</span>
                <span className="font-bold text-[#1F1A17]">{formatPrice(taxAmount)}</span>
              </div>

              {/* Tip Percent Selector */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block mb-1">
                  Propina al Servicio:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercent(pct)}
                      className={`py-1 rounded-lg text-xs font-bold transition-all ${
                        tipPercent === pct
                          ? 'bg-[#C8452C] text-white'
                          : 'bg-white border border-[#E9DFCC] text-[#1F1A17]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E9DFCC] flex justify-between items-baseline font-sans">
                <span className="font-serif font-bold text-base text-[#1F1A17]">Total a Pagar:</span>
                <span className="font-mono font-bold text-lg text-[#C8452C]">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { id: 'card', label: 'Tarjeta', icon: CreditCard },
                  { id: 'cash', label: 'Efectivo', icon: Banknote },
                  { id: 'qr_transfer', label: 'QR Móvil', icon: QrCode },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(pm.id as any)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold ${
                      selectedPaymentMethod === pm.id
                        ? 'bg-[#1F1A17] text-white border-[#1F1A17]'
                        : 'bg-white text-[#7A6E65] border-[#E9DFCC]'
                    }`}
                  >
                    <pm.icon className="w-4 h-4" />
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={isSubmitting || cart.length === 0}
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#C8452C]/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isSubmitting ? 'Enviando a Cocina...' : `Confirmar y Enviar Pedido (${formatPrice(total)})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
