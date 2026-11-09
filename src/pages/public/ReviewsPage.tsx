import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Review } from '../../types';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Filter,
  CheckCircle2,
  Calendar,
  Utensils,
  Store,
  Sparkles,
  ChevronDown,
  Quote,
  CornerDownRight,
  Plus,
} from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { reviews, restaurants, branches, addReview, currentUser, isAuthenticated, showToast } = useApp();

  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Form state for writing a review
  const [formRestaurantId, setFormRestaurantId] = useState(restaurants[0]?.id || 'brand-aura');
  const [formBranchId, setFormBranchId] = useState(branches[0]?.id || 'branch-aura-co-bogota');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formCustomerName, setFormCustomerName] = useState(currentUser.name || 'Comensal Gourmet');
  const [formCustomerEmail, setFormCustomerEmail] = useState(currentUser.email || 'comensal@smartrestaurant.io');

  // Only approved reviews in public view
  const publicReviews = reviews.filter((r) => r.status === 'approved');

  // Filter reviews
  const filteredReviews = publicReviews.filter((r) => {
    if (selectedBrandFilter !== 'all' && r.restaurantId !== selectedBrandFilter) return false;
    if (selectedRatingFilter !== 'all' && r.rating !== selectedRatingFilter) return false;
    return true;
  });

  // Calculate statistics
  const totalCount = publicReviews.length;
  const avgRating = totalCount > 0
    ? (publicReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '5.0';

  const starCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = publicReviews.filter((r) => r.rating === stars).length;
    const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
    return { stars, count, percentage };
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) {
      showToast('Por favor escribe tu comentario sobre la experiencia.', 'warning');
      return;
    }

    addReview({
      branchId: formBranchId,
      restaurantId: formRestaurantId,
      customerName: formCustomerName,
      customerEmail: formCustomerEmail,
      rating: formRating,
      comment: formComment,
    });

    setIsWriteModalOpen(false);
    setFormComment('');
  };

  const selectedBrandBranches = branches.filter((b) => b.restaurantId === formRestaurantId);

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1F1A17]">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A33D]/20 text-[#C8452C] text-xs font-mono font-bold">
            <Star className="w-3.5 h-3.5 fill-[#C8452C]" />
            <span>VOCES DE NUESTROS COMENSALES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1A17]">
            Experiencias Gastronómicas Reales
          </h1>
          <p className="text-xs text-[#7A6E65] leading-relaxed">
            Opiniones verificadas de clientes que han disfrutado de nuestras marcas y sucursales alrededor del mundo.
          </p>
        </div>

        {/* Global Rating Summary Banner */}
        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9DFCC] shadow-md grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Average Box */}
          <div className="text-center md:border-r md:border-[#E9DFCC] md:pr-6 space-y-2">
            <span className="font-serif text-6xl font-bold text-[#1F1A17] tracking-tight">
              {avgRating}
            </span>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(Number(avgRating))
                      ? 'fill-[#E8A33D] text-[#E8A33D]'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-[#7A6E65] font-mono">
              Basado en {totalCount} reseñas verificadas
            </p>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-2 md:col-span-1">
            {starCounts.map((s) => (
              <div key={s.stars} className="flex items-center gap-2 text-xs">
                <span className="w-12 font-mono font-semibold flex items-center gap-1">
                  <span>{s.stars}</span>
                  <Star className="w-3 h-3 fill-[#E8A33D] text-[#E8A33D]" />
                </span>
                <div className="flex-1 h-2 bg-[#FBF6EC] rounded-full overflow-hidden border border-[#E9DFCC]">
                  <div
                    className="h-full bg-[#E8A33D] rounded-full transition-all"
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
                <span className="w-8 font-mono text-right text-[10px] text-[#7A6E65]">
                  {s.count}
                </span>
              </div>
            ))}
          </div>

          {/* Write Review CTA */}
          <div className="text-center md:text-right space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#1F1A17]">
              ¿Has visitado alguno de nuestros restaurantes?
            </h3>
            <p className="text-xs text-[#7A6E65]">
              Tu valoración sincera orienta a otros comensales y perfecciona nuestro servicio.
            </p>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Escribir una Reseña</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#FFFDF8] rounded-2xl p-4 border border-[#E9DFCC] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65]">
              Marca:
            </span>
            <button
              onClick={() => setSelectedBrandFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedBrandFilter === 'all'
                  ? 'bg-[#1F1A17] text-white shadow-xs'
                  : 'bg-[#FBF6EC] text-[#1F1A17] hover:bg-[#E9DFCC]'
              }`}
            >
              Todas las Marcas
            </button>
            {restaurants.map((rest) => (
              <button
                key={rest.id}
                onClick={() => setSelectedBrandFilter(rest.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedBrandFilter === rest.id
                    ? 'bg-[#C8452C] text-white shadow-xs'
                    : 'bg-[#FBF6EC] text-[#1F1A17] hover:bg-[#E9DFCC]'
                }`}
              >
                {rest.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65]">
              Calificación:
            </span>
            <select
              value={selectedRatingFilter}
              onChange={(e) =>
                setSelectedRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="bg-[#FBF6EC] border border-[#E9DFCC] text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#C8452C]"
            >
              <option value="all">Todas las estrellas</option>
              <option value="5">5 Estrellas</option>
              <option value="4">4 Estrellas</option>
              <option value="3">3 Estrellas</option>
              <option value="2">2 Estrellas</option>
              <option value="1">1 Estrella</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => {
            const rest = restaurants.find((r) => r.id === rev.restaurantId);
            const branch = branches.find((b) => b.id === rev.branchId);

            return (
              <div
                key={rev.id}
                className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rev.rating
                                ? 'fill-[#E8A33D] text-[#E8A33D]'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-[#1F1A17]">{rev.customerName}</span>
                        <span className="text-[#7A6E65]">·</span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Visita Verificada</span>
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-[#7A6E65]">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Branch & Brand Tags */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-lg bg-[#FBF6EC] border border-[#E9DFCC] font-serif font-bold text-[#1F1A17]">
                      {rest?.name || 'SmartRestaurant'}
                    </span>
                    <span className="text-[11px] text-[#7A6E65]">
                      {branch?.name} ({branch?.city})
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-[#1F1A17] italic leading-relaxed font-serif text-sm">
                    "{rev.comment}"
                  </p>

                  {/* Dishes ratings if present */}
                  {rev.dishesRating && rev.dishesRating.length > 0 && (
                    <div className="pt-2 border-t border-[#E9DFCC]/60 flex flex-wrap gap-2">
                      {rev.dishesRating.map((dr, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FBF6EC] text-[10px] font-mono border border-[#E9DFCC]"
                        >
                          <Utensils className="w-3 h-3 text-[#C8452C]" />
                          <span className="font-medium text-[#1F1A17]">{dr.dishName}:</span>
                          <span className="text-[#E8A33D] font-bold">{dr.rating}★</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Official Staff Reply */}
                  {rev.reply && (
                    <div className="mt-3 bg-[#FBF6EC] rounded-2xl p-3.5 border-l-4 border-[#C8452C] space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#C8452C] flex items-center gap-1">
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>Respuesta Oficial del Restaurante</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#7A6E65]">
                          {new Date(rev.reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#7A6E65] leading-relaxed">
                        {rev.reply.text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E9DFCC] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFCC]">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-[#E8A33D] text-[#E8A33D]" />
                <h3 className="font-serif font-bold text-xl text-[#1F1A17]">
                  Compartir tu Experiencia
                </h3>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                    Marca
                  </label>
                  <select
                    value={formRestaurantId}
                    onChange={(e) => {
                      setFormRestaurantId(e.target.value);
                      const matchBr = branches.find((b) => b.restaurantId === e.target.value);
                      if (matchBr) setFormBranchId(matchBr.id);
                    }}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] text-xs font-semibold rounded-xl px-3 py-2"
                  >
                    {restaurants.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                    Sucursal
                  </label>
                  <select
                    value={formBranchId}
                    onChange={(e) => setFormBranchId(e.target.value)}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] text-xs font-semibold rounded-xl px-3 py-2"
                  >
                    {selectedBrandBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Star selector */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1.5">
                  Tu Calificación
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= formRating
                            ? 'fill-[#E8A33D] text-[#E8A33D]'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-[#C8452C] ml-2">
                    {formRating} de 5 estrellas
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                  Tu Opinión / Comentarios
                </label>
                <textarea
                  rows={4}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Describe la atmósfera, la sazón de los platos, la atención del mesero..."
                  className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl p-3 text-xs font-medium text-[#1F1A17] focus:outline-none focus:border-[#C8452C]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    value={formCustomerName}
                    onChange={(e) => setFormCustomerName(e.target.value)}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={formCustomerEmail}
                    onChange={(e) => setFormCustomerEmail(e.target.value)}
                    className="w-full bg-[#FBF6EC] border border-[#E9DFCC] rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E9DFCC]">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-[#7A6E65] hover:bg-[#FBF6EC]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#C8452C]/20 transition-all"
                >
                  Publicar Reseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
