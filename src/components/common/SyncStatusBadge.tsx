import React from 'react';
import { useApp } from '../../context/AppContext';

interface SyncStatusBadgeProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({
  variant = 'dark',
  className = '',
}) => {
  const { syncStatus, t } = useApp();

  const label =
    syncStatus === 'online'
      ? t('sync_online')
      : syncStatus === 'connecting'
      ? t('sync_connecting')
      : t('sync_offline');

  const dotClass =
    syncStatus === 'online'
      ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]'
      : syncStatus === 'connecting'
      ? 'bg-amber-400 animate-pulse'
      : 'bg-slate-400';

  const containerClass =
    variant === 'dark'
      ? 'bg-slate-800/80 border-slate-700 text-slate-300'
      : 'bg-white border-[#E9DFCC] text-[#7A6E65] shadow-xs';

  return (
    <div
      title={label}
      data-sync-status={syncStatus}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-medium whitespace-nowrap ${containerClass} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
      <span className="truncate max-w-[170px]">{label}</span>
    </div>
  );
};
