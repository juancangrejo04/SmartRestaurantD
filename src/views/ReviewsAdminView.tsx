import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Review } from '../types';
import { useCan } from '../core/permissions';
import {
  Star,
  MessageSquare,
  Eye,
  EyeOff,
  CornerDownRight,
  Send,
  Filter,
  CheckCircle2,
  Calendar,
  Utensils,
  Store,
  ShieldAlert,
} from 'lucide-react';

export const ReviewsAdminView: React.FC = () => {
  const { reviews, restaurants, branches, replyReview, toggleHideReview, currentUser, showToast, loc } = useApp();
  const canReply = useCan('reviews.reply');
  const canModerate = useCan('reviews.moderate');

  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'approved' | 'hidden'>('all');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredReviews = reviews.filter((r) => {
    if (selectedBranchFilter !== 'all' && r.branchId !== selectedBranchFilter) return false;
    if (selectedStatusFilter !== 'all' && r.status !== selectedStatusFilter) return false;
    return true;
  });

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) {
      showToast('Por favor escribe el texto de respuesta.', 'warning');
      return;
    }
    replyReview(reviewId, replyText);
    setReplyingToId(null);
    setReplyText('');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600">
            Atención al Cliente & Reputación
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gestión y Moderación de Reseñas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitorea valoraciones de comensales, responde públicamente y modera contenido.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="font-bold text-sm text-slate-900">{avgRating}</span>
            <span className="text-xs text-slate-400">({totalReviews} opiniones)</span>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Sucursal
            </label>
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todas las sucursales ({branches.length})</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.country})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Estado
            </label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todas las reseñas</option>
              <option value="approved">Visibles en sitio</option>
              <option value="hidden">Ocultas / Moderadas</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Mostrando {filteredReviews.length} reseñas
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-semibold text-slate-800 text-sm">No se encontraron reseñas con los filtros seleccionados</h3>
            <p className="text-xs text-slate-500">Prueba ajustando la sucursal o el estado de moderación.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const rest = restaurants.find((r) => r.id === rev.restaurantId);
            const branch = branches.find((b) => b.id === rev.branchId);
            const isReplying = replyingToId === rev.id;

            return (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-sm text-slate-900">{rev.customerName}</span>
                      <span className="text-xs text-slate-400 font-mono">({rev.customerEmail})</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Store className="w-3.5 h-3.5 text-amber-600" />
                      <span>{rest?.name}</span>
                      <span>·</span>
                      <span>{branch?.name} ({branch?.country})</span>
                      <span>·</span>
                      <span className="font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                        rev.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rev.status === 'approved' ? 'Visible' : 'Oculta'}
                    </span>

                    {canModerate && (
                      <button
                        onClick={() => toggleHideReview(rev.id)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title={rev.status === 'approved' ? 'Ocultar del sitio público' : 'Hacer visible'}
                      >
                        {rev.status === 'approved' ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-rose-500" />
                            <span>Ocultar</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mostrar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Comment body */}
                <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{loc(rev.comment)}"
                </p>

                {/* Per-dish feedback if exists */}
                {(rev.dishesRating || rev.dishRatings) && (rev.dishesRating || rev.dishRatings)!.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {(rev.dishesRating || rev.dishRatings)!.map((dr: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono"
                      >
                        {dr.dishName}: <strong>{dr.rating}★</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Staff Reply Display */}
                {rev.reply && (
                  <div className="bg-amber-50/60 rounded-xl p-3 border-l-4 border-amber-500 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                      <span className="flex items-center gap-1">
                        <CornerDownRight className="w-3.5 h-3.5 text-amber-600" />
                        <span>Respuesta publicada por Staff ({(rev.reply.userRole || 'STAFF').toUpperCase()})</span>
                      </span>
                      <span className="font-mono text-[10px] text-amber-700">
                        {new Date(rev.reply.createdAt || rev.reply.repliedAt || '').toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{loc(rev.reply.text)}</p>
                  </div>
                )}

                {/* Reply Form Trigger */}
                {canReply && !rev.reply && (
                  <div>
                    {isReplying ? (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Escribe la respuesta oficial que verá el comensal..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingToId(null);
                              setReplyText('');
                            }}
                            className="py-1 px-3 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendReply(rev.id)}
                            className="py-1 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Publicar Respuesta</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyingToId(rev.id);
                          setReplyText(`Estimado/a ${rev.customerName}, muchas gracias por compartir tu experiencia en ${rest?.name}. `);
                        }}
                        className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Responder a esta reseña</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
