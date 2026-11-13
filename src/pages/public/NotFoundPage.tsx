import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-[#FBF6EC] flex items-center justify-center px-4 py-16 font-sans">
      <div className="max-w-md w-full bg-[#FFFDF8] rounded-3xl p-8 border border-[#E9DFCC] shadow-xl text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8A33D]/20 text-[#C8452C] flex items-center justify-center">
          <Compass className="w-7 h-7" />
        </div>
        <div className="font-mono text-3xl font-bold text-[#C8452C]">404</div>
        <h1 className="font-serif text-2xl font-bold text-[#1F1A17]">
          {t('not_found_title')}
        </h1>
        <p className="text-xs text-[#7A6E65] leading-relaxed">
          {t('not_found_desc')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F1A17] hover:bg-[#332B25] text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#E8A33D]" />
          <span>{t('back_to_home')}</span>
        </Link>
      </div>
    </div>
  );
};
