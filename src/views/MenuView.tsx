import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, MenuCategory } from '../types';
import { COUNTRIES } from '../i18n/countries';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  X,
  Sparkles,
  DollarSign,
} from 'lucide-react';

export const MenuView: React.FC = () => {
  const {
    t,
    country,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    formatPrice,
  } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [nameEs, setNameEs] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descEs, setDescEs] = useState('');
  const [descEn, setDescEn] = useState('');
  const [category, setCategory] = useState<MenuCategory>('mains');
  const [basePriceUSD, setBasePriceUSD] = useState<number>(18);
  const [prepTime, setPrepTime] = useState<number>(15);
  const [imageUrl, setImageUrl] = useState('');
  const [dietaryTag, setDietaryTag] = useState('');

  const currentLang = COUNTRIES[country].language;

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: t('all_categories') },
    { id: 'starters', label: t('cat_starters') },
    { id: 'mains', label: t('cat_mains') },
    { id: 'specials', label: t('cat_specials') },
    { id: 'desserts', label: t('cat_desserts') },
    { id: 'drinks', label: t('cat_drinks') },
  ];

  const filteredItems = menuItems.filter((item: MenuItem) => {
    const localizedName = item.name[currentLang] || item.name.es;
    const matchesSearch =
      localizedName.toLowerCase().includes(search.toLowerCase()) ||
      item.name.es.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setNameEs('');
    setNameEn('');
    setDescEs('');
    setDescEn('');
    setCategory('mains');
    setBasePriceUSD(18);
    setPrepTime(15);
    setImageUrl('https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80');
    setDietaryTag('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setNameEs(item.name.es);
    setNameEn(item.name.en);
    setDescEs(item.description.es);
    setDescEn(item.description.en);
    setCategory(item.category);
    setBasePriceUSD(item.basePriceUSD);
    setPrepTime(item.prepTimeMinutes);
    setImageUrl(item.image);
    setDietaryTag(item.dietary?.join(', ') || '');
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dietaryArray = dietaryTag
      ? dietaryTag.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name: {
          ...editingItem.name,
          es: nameEs,
          en: nameEn || nameEs,
        },
        description: {
          ...editingItem.description,
          es: descEs,
          en: descEn || descEs,
        },
        category,
        basePriceUSD,
        prepTimeMinutes: prepTime,
        image: imageUrl || editingItem.image,
        dietary: dietaryArray,
      });
    } else {
      addMenuItem({
        restaurantId: 'rest-co-01',
        name: {
          es: nameEs,
          en: nameEn || nameEs,
          pt: nameEs,
          ja: nameEs,
        },
        description: {
          es: descEs,
          en: descEn || descEs,
          pt: descEs,
          ja: descEs,
        },
        category,
        basePriceUSD,
        prepTimeMinutes: prepTime,
        available: true,
        image:
          imageUrl ||
          'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
        dietary: dietaryArray,
        popular: false,
      });
    }
    setShowAddModal(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('menu_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('menu_subtitle')}</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('new_product')}</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={t('search_product')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item: MenuItem) => {
          const displayName = item.name[currentLang] || item.name.es;
          const displayDesc = item.description[currentLang] || item.description.es;

          return (
            <div
              key={item.id}
              className={`rounded-xl border bg-white shadow-xs overflow-hidden flex flex-col justify-between transition-all hover:shadow-md ${
                item.available ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div>
                {/* Image */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-sm text-white">
                      {item.category}
                    </span>
                  </div>
                  {item.popular && (
                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {displayName}
                    </h3>
                    <span className="font-mono font-bold text-slate-900 text-sm whitespace-nowrap">
                      {formatPrice(item.basePriceUSD)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                    {displayDesc}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.prepTimeMinutes} {t('minutes')}</span>
                    </div>

                    {item.dietary?.map((tag: string) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => toggleMenuItemAvailability(item.id)}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                    item.available
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {item.available ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('item_available')}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{t('item_unavailable')}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                    title="Editar plato"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar "${item.name.es}" del menú?`)) {
                        deleteMenuItem(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Eliminar plato"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 text-slate-900">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900">
                {editingItem ? 'Editar Producto del Menú' : t('new_product')}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nombre (Español) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Bife de Chorizo a la Parrilla"
                  value={nameEs}
                  onChange={(e) => setNameEs(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nombre (Inglés)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Wood-Fired Strip Steak"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Categoría *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MenuCategory)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500 capitalize"
                  >
                    <option value="starters">{t('cat_starters')}</option>
                    <option value="mains">{t('cat_mains')}</option>
                    <option value="specials">{t('cat_specials')}</option>
                    <option value="desserts">{t('cat_desserts')}</option>
                    <option value="drinks">{t('cat_drinks')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Precio Base USD *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={basePriceUSD}
                    onChange={(e) => setBasePriceUSD(Number(e.target.value))}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Prep. (min) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={prepTime}
                    onChange={(e) => setPrepTime(Number(e.target.value))}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Descripción (Español)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ingredientes clave, término de cocción..."
                  value={descEs}
                  onChange={(e) => setDescEs(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  URL de Imagen (Unsplash u otra)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Etiquetas dietéticas (separadas por coma)
                </label>
                <input
                  type="text"
                  placeholder="Gluten-Free, Vegano, Picante"
                  value={dietaryTag}
                  onChange={(e) => setDietaryTag(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
