import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { COUNTRIES } from '../../i18n/countries';

export const PrivacyPolicyPage: React.FC = () => {
  const { profile, country, t } = useApp();
  const c = COUNTRIES[country];

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#7A6E65] hover:text-[#1F1A17] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back_to_home')}</span>
        </Link>

        <div className="bg-[#FFFDF8] rounded-3xl p-8 sm:p-12 border border-[#E9DFCC] shadow-xl text-[#1F1A17] space-y-6">
          <div className="border-b border-[#E9DFCC] pb-6 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8452C] px-2.5 py-1 rounded-full bg-[#C8452C]/10 border border-[#C8452C]/20">
              {t('privacy_policy_badge')} ({c.flagEmoji} {c.nativeName})
            </span>
            <h1 className="font-serif font-bold text-3xl text-[#1F1A17]">
              {t('privacy_policy_title')}
            </h1>
            <p className="text-xs text-[#7A6E65]">
              {t('privacy_policy_meta', { region: profile.dataResidency.dataRegion })}
            </p>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-[#1F1A17]/90">
            <h2 className="font-bold text-sm text-[#1F1A17]">{t('privacy_sec1_title')}</h2>
            <p>{t('privacy_sec1_body', { law: profile.dataResidency.applicableLaw })}</p>

            <h2 className="font-bold text-sm text-[#1F1A17]">{t('privacy_sec2_title')}</h2>
            <p>{t('privacy_sec2_body', { region: profile.dataResidency.dataRegion })}</p>

            <h2 className="font-bold text-sm text-[#1F1A17]">{t('privacy_sec3_title')}</h2>
            <p>{t('privacy_sec3_body', { basis: profile.dataResidency.legalBasis })}</p>

            <h2 className="font-bold text-sm text-[#1F1A17]">{t('privacy_sec4_title')}</h2>
            <p>{t('privacy_sec4_body', { months: profile.dataResidency.retentionMonths })}</p>

            <h2 className="font-bold text-sm text-[#1F1A17]">{t('privacy_sec5_title')}</h2>
            <p>
              {t('privacy_sec5_body')}{' '}
              <Link to="/mis-datos" className="text-[#C8452C] font-bold underline">
                {t('nav_my_data')}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
