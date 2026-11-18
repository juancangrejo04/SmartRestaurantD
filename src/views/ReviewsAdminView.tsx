import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useCan } from '../core/permissions';
import {
  Star,
  MessageSquare,
  Eye,
  EyeOff,
  CornerDownRight,
  Send,
  Store,
} from 'lucide-react';

export const ReviewsAdminView: React.FC = () => {
  const {
    reviews,
    restaurants,
    branches,
    replyReview,
    toggleHideReview,
    showToast,
    getBranchLabel,
    language,
    loc,
    t,
  } = useApp();
  const canReply = useCan('reviews.reply');
  const canModerate = useCan('reviews.moderate');

  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'approved' | 'hidden'>('all');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const regionDisplay = new Intl.DisplayNames([language], { type: 'region' });

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
      showToast(t('reviews_err_empty_reply'), 'warning');
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
            {t('reviews_admin_badge')}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('reviews_admin_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('reviews_admin_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="font-bold text-sm text-slate-900">{avgRating}</span>
            <span className="text-xs text-slate-400">
              ({totalReviews} {t('reviews_opinions_count')})
            </span>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label
              htmlFor="reviews-branch-filter"
              className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            >
              {t('reviews_filter_branch')}
            </label>
            <select
              id="reviews-branch-filter"
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
            >
              <option value="all">
                {t('reviews_all_branches_count', { count: branches.length })}
              </option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {getBranchLabel(b)} ({regionDisplay.of(b.country) || b.country})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="reviews-status-filter"
              className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            >
              {t('reviews_filter_status')}
            </label>
            <select
              id="reviews-status-filter"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as 'all' | 'approved' | 'hidden')}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
            >
              <option value="all">{t('reviews_status_all')}</option>
              <option value="approved">{t('reviews_status_approved')}</option>
              <option value="hidden">{t('reviews_status_hidden')}</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500">
          {t('reviews_showing_count', { count: filteredReviews.length })}
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-semibold text-slate-800 text-sm">{t('reviews_empty_title')}</h3>
            <p className="text-xs text-slate-500">{t('reviews_empty_subtitle')}</p>
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
                      <span>
                        {branch ? getBranchLabel(branch, rest?.name) : (rest?.name || '')}{' '}
                        ({branch ? regionDisplay.of(branch.country) || branch.country : ''})
                      </span>
                      <span>·</span>
                      <span className="font-mono">
                        {new Date(rev.createdAt).toLocaleDateString(language)}
                      </span>
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
                      {rev.status === 'approved'
                        ? t('reviews_visible_badge')
                        : t('reviews_hidden_badge')}
                    </span>

                    {canModerate && (
                      <button
                        onClick={() => toggleHideReview(rev.id)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title={
                          rev.status === 'approved'
                            ? t('reviews_hide_title')
                            : t('reviews_show_title')
                        }
                        aria-label={
                          rev.status === 'approved'
                            ? t('reviews_hide_title')
                            : t('reviews_show_title')
                        }
                      >
                        {rev.status === 'approved' ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-rose-500" />
                            <span>{t('reviews_hide_btn')}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t('reviews_show_btn')}</span>
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
                        <span>
                          {t('reviews_staff_reply_label', {
                            role: t(`role_${(rev.reply.userRole || 'branch_admin').toLowerCase()}`),
                          })}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] text-amber-700">
                        {new Date(rev.reply.createdAt || rev.reply.repliedAt || '').toLocaleDateString(language)}
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
                          placeholder={t('reviews_reply_placeholder')}
                          aria-label={t('reviews_reply_placeholder')}
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
                            {t('cancel')}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendReply(rev.id)}
                            className="py-1 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>{t('reviews_publish_reply')}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyingToId(rev.id);
                          setReplyText(
                            t('reviews_reply_prefill', {
                              customer: rev.customerName || t('guest_diner'),
                              restaurant: rest?.name || '',
                            })
                          );
                        }}
                        className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>{t('reviews_reply_btn')}</span>
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
