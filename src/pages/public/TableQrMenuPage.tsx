import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { MenuItem, OrderItem, Branch, Restaurant, Table, MenuCategory } from '../../types';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
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
  BellRing,
  ChevronRight,
  ArrowLeft,
  FileText,
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
    callWaiter,
    formatPrice,
    showToast,
    language,
    currentUser,
    isAuthenticated,
  } = useApp();

  const currentBranch = branches.find((b) => b.id === branchId) || branches[0];
  const currentRestaurant = currentBranch
    ? restaurants.find((r) => r.id === currentBranch.restaurantId)
    : restaurants[0];
  const currentTable = tables.find((t) => t.id === tableId) || tables[0];

  // The branch governs the currency, timezone, and tax!
  const branchCountry = currentBranch?.country || country;
  const branchConfig = COUNTRIES[branchCountry];

  // Category & search filter
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [customerName, setCustomerName] = useState<string>(currentUser.name || 'Comensal en Mesa');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'cash' | 'digital'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);

  // Filter items for this restaurant and branch country
  const branchMenuItems = menuItems.filter((item) => {
    if (item.restaurantId && item.restaurantId !== currentRestaurant?.id) return false;
    if (item.countryCode && item.countryCode !== branchCountry) return false;
    return true;
  });

  const displayedItems = branchMenuItems.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name =
        typeof item.name === 'string'
          ? (item.name as string).toLowerCase()
          : String(item.name[language] || item.name.es).toLowerCase();
      if (!name.includes(q)) return false;
    }
    return true;
  });

  // Cart Calculations with branch tax
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const taxRate = branchConfig.taxRate;
  const taxAmount = subtotal * taxRate;
  const tipAmount = subtotal * (tipPercent / 100);
  const total = subtotal + taxAmount + tipAmount;

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (item: MenuItem) => {
    if (!item.available) {
      showToast('Este producto se encuentra agotado momentáneamente en cocina.', 'warning');
      return;
    }

    const itemName = item.name[language] || item.name.es;
    const unitPrice = item.basePriceUSD || item.price || 15;

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

  const handleCallWaiter = () => {
    setIsCallingWaiter(true);
    callWaiter(currentTable.id, 'Atención solicitada desde menú digital QR');
    setTimeout(() => {
      setIsCallingWaiter(false);
    }, 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Tu comanda está vacía. Selecciona algún plato.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder = await createOrder(
        currentTable.id,
        cart,
        tipPercent,
        customerName,
        orderNotes
      );

      showToast(`¡Comanda ${newOrder.orderNumber} enviada a cocina!`, 'success');
      setCart([]);
      setIsCartOpen(false);
      navigate(`/pedido/${newOrder.id}`);
    } catch (err) {
      showToast('Ocurrió un error al procesar el pedido. Por favor intenta de nuevo.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'starters', label: 'Entradas' },
    { id: 'mains', label: 'Platos Fuertes' },
    { id: 'desserts', label: 'Postres' },
    { id: 'drinks', label: 'Bebidas & Coctelería' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF6EC] pb-24 font-sans text-[#1F1A17]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E9DFCC] shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-1.5 rounded-xl hover:bg-[#FBF6EC] text-[#7A6E65] transition-colors"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-[#1F1A17]">
                  {currentRestaurant?.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8A33D]/20 text-[#C8452C] font-mono font-bold">
                  {branchConfig.flagEmoji} {branchConfig.currency}
                </span>
              </div>
              <p className="text-[11px] text-[#7A6E65]">
                {currentBranch?.name} · <strong className="text-[#1F1A17]">Mesa #{currentTable?.number}</strong>
              </p>
            </div>
          </div>

          {/* Action buttons: Call Waiter & Cart Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCallWaiter}
              disabled={isCallingWaiter || currentTable?.activeCallWaiter}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                currentTable?.activeCallWaiter
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                  : 'bg-[#FBF6EC] hover:bg-[#E9DFCC] text-[#1F1A17] border border-[#E9DFCC]'
              }`}
              title="Solicitar atención de un mesero en la mesa"
            >
              <BellRing className={`w-3.5 h-3.5 ${currentTable?.activeCallWaiter ? 'text-amber-600' : 'text-[#C8452C]'}`} />
              <span className="hidden sm:inline">
                {currentTable?.activeCallWaiter ? 'Mesero en camino' : 'Llamar al Mesero'}
              </span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 hover:opacity-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Comanda</span>
              {totalCartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#C8452C] font-mono font-bold text-[10px] flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Table Welcome Banner */}
        <div className="bg-[#FFFDF8] rounded-3xl p-5 border border-[#E9DFCC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8452C]">
              Atención Digital en Sala
            </span>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#1F1A17]">
              Bienvenido a la Mesa #{currentTable?.number}
            </h1>
            <p className="text-xs text-[#7A6E65]">
              Selecciona tus platos y bebidas favoritos. Tu pedido irá directamente a la barra y cocina.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#7A6E65] block uppercase">Impuestos Locales</span>
              <span className="font-mono font-bold text-xs text-[#C8452C]">
                {branchConfig.taxName} ({(branchConfig.taxRate * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#E8A33D]/20 flex items-center justify-center text-[#C8452C] font-bold">
              #{currentTable?.number}
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1F1A17] text-white shadow-xs'
                  : 'bg-[#FFFDF8] border border-[#E9DFCC] text-[#7A6E65] hover:text-[#1F1A17]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedItems.map((item) => {
            const itemName = item.name[language] || item.name.es;
            const itemDesc = item.description[language] || item.description.es;
            const itemPrice = item.basePriceUSD || item.price || 15;
            const inCart = cart.find((ci) => ci.menuItemId === item.id);

            return (
              <div
                key={item.id}
                className="bg-[#FFFDF8] rounded-2xl overflow-hidden border border-[#E9DFCC] p-4 flex gap-4 shadow-xs hover:shadow-md transition-shadow justify-between"
              >
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-sm text-[#1F1A17] leading-snug">
                        {itemName}
                      </h3>
                      {item.popular && (
                        <span className="bg-[#C8452C]/10 text-[#C8452C] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7A6E65] line-clamp-2 mt-1 leading-relaxed">
                      {itemDesc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono font-bold text-sm text-[#C8452C]">
                      {formatPrice(itemPrice, branchCountry)}
                    </span>

                    {item.available ? (
                      inCart ? (
                        <div className="flex items-center gap-2 bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-2 py-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="text-[#7A6E65] hover:text-[#C8452C] p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs px-1 text-[#1F1A17]">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="text-[#7A6E65] hover:text-[#C8452C] p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="py-1.5 px-3 rounded-xl bg-[#FBF6EC] hover:bg-[#E8A33D]/20 text-[#1F1A17] text-xs font-bold border border-[#E9DFCC] transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#C8452C]" />
                          <span>Agregar</span>
                        </button>
                      )
                    ) : (
                      <span className="text-[10px] text-rose-600 font-mono font-bold">
                        Agotado
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-[#E9DFCC]">
                  <ImageWithFallback
                    src={item.image}
                    alt={itemName}
                    fallbackEmoji={item.fallbackEmoji || '🍲'}
                    fallbackGradient={item.fallbackGradient}
                    fallbackTitle={itemName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40 animate-in slide-in-from-bottom-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#1F1A17] to-[#332B25] text-white flex items-center justify-between shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C8452C] flex items-center justify-center font-mono font-bold text-xs">
                {totalCartCount}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block">Ver mi Comanda</span>
                <span className="text-[10px] text-[#E9DFCC]/70">Mesa #{currentTable?.number}</span>
              </div>
            </div>

            <span className="font-mono font-bold text-sm text-[#E8A33D]">
              {formatPrice(total, branchCountry)}
            </span>
          </button>
        </div>
      )}

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col border border-[#E9DFCC] shadow-2xl animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="p-5 border-b border-[#E9DFCC] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1A17]">
                  Comanda de Mesa #{currentTable?.number}
                </h3>
                <p className="text-[11px] text-[#7A6E65]">
                  {currentRestaurant?.name} · {currentBranch?.name}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-xl hover:bg-[#FBF6EC] text-[#7A6E65]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#7A6E65]">
                  No has agregado platos a la comanda todavía.
                </div>
              ) : (
                <div className="divide-y divide-[#E9DFCC]/60">
                  {cart.map((item) => (
                    <div key={item.menuItemId} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-serif font-bold text-xs text-[#1F1A17]">
                          {item.name}
                        </h4>
                        <span className="text-[11px] font-mono text-[#7A6E65]">
                          {formatPrice(item.unitPrice, branchCountry)} c/u
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-2 py-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.menuItemId, -1)}
                            className="text-[#7A6E65] hover:text-[#C8452C] p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.menuItemId, 1)}
                            className="text-[#7A6E65] hover:text-[#C8452C] p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-xs text-[#1F1A17] w-16 text-right">
                          {formatPrice(item.subtotal, branchCountry)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Special Kitchen Notes */}
              <div className="pt-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Notas Especiales para Cocina (opcional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ej: salsa aparte, término medio, sin cebolla..."
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-medium text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                />
              </div>

              {/* Tip Selection */}
              <div className="pt-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1.5">
                  Propina para el Personal de Sala
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercent(pct)}
                      className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        tipPercent === pct
                          ? 'bg-[#1F1A17] text-white shadow-xs'
                          : 'bg-[#FBF6EC] border border-[#E9DFCC] text-[#7A6E65] hover:text-[#1F1A17]'
                      }`}
                    >
                      {pct === 0 ? 'Sin propina' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discreet Demo Payment Method Badge */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65]">
                    Método de Pago
                  </label>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    Pago de demostración
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      selectedPaymentMethod === 'card'
                        ? 'bg-[#FBF6EC] border-[#C8452C] text-[#C8452C]'
                        : 'border-[#E9DFCC] text-[#7A6E65]'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Tarjeta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('cash')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      selectedPaymentMethod === 'cash'
                        ? 'bg-[#FBF6EC] border-[#C8452C] text-[#C8452C]'
                        : 'border-[#E9DFCC] text-[#7A6E65]'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Efectivo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('digital')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      selectedPaymentMethod === 'digital'
                        ? 'bg-[#FBF6EC] border-[#C8452C] text-[#C8452C]'
                        : 'border-[#E9DFCC] text-[#7A6E65]'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Digital</span>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#E9DFCC] space-y-1.5 text-xs text-[#7A6E65]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-[#1F1A17]">{formatPrice(subtotal, branchCountry)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{branchConfig.taxName} ({(branchConfig.taxRate * 100).toFixed(0)}%):</span>
                  <span className="font-mono text-[#1F1A17]">{formatPrice(taxAmount, branchCountry)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Propina ({tipPercent}%):</span>
                    <span className="font-mono text-[#1F1A17]">{formatPrice(tipAmount, branchCountry)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#E9DFCC] text-sm font-bold text-[#1F1A17]">
                  <span>Total a Pagar:</span>
                  <span className="font-mono text-base text-[#C8452C]">{formatPrice(total, branchCountry)}</span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="p-5 border-t border-[#E9DFCC] bg-[#FFFDF8]">
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#C8452C]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Enviando comanda...' : 'Confirmar y Enviar a Cocina'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
