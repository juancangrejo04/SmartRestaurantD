import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { CountryCode, Language } from '../../types';
import { Globe, Mail, Phone, Star } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { setCountry, country, language, setLanguage, t } = useApp();

  const languages: { code: Language; label: string }[] = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
    { code: 'fr', label: 'Français' },
    { code: 'ja', label: '日本語' },
  ];

  return (
    <footer className="bg-[#1F1A17] text-[#FFFDF8] pt-16 pb-10 border-t border-[#332B25] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#332B25]">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A33D] to-[#C8452C] flex items-center justify-center text-white shadow-md">
                <span className="font-serif italic font-bold text-xl">S</span>
              </div>
              <span className="font-serif font-bold text-xl text-white">
                {t('app_name')}
              </span>
            </div>
            <p className="text-[#E9DFCC]/70 leading-relaxed font-serif italic text-sm">
              {t('footer_brand_tagline')}
            </p>
            <div className="text-xs text-[#E8A33D] flex items-center gap-1.5 font-sans font-medium">
              <Star className="w-3.5 h-3.5 fill-[#E8A33D]" />
              <span>{t('presence_global')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8A33D] font-mono">
              {t('explore')}
            </h4>
            <ul className="space-y-2 text-xs text-[#E9DFCC]/80">
              <li>
                <Link to="/restaurantes" className="hover:text-white transition-colors">
                  {t('nav_restaurants')}
                </Link>
              </li>
              <li>
                <Link to="/resenas" className="hover:text-white transition-colors">
                  {t('nav_reviews')}
                </Link>
              </li>
              <li>
                <Link to="/reservar" className="hover:text-white transition-colors">
                  {t('nav_reserve')}
                </Link>
              </li>
              <li>
                <Link to="/ayuda" className="hover:text-white transition-colors">
                  {t('nav_faq')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8A33D] font-mono">
              {t('contact_and_support')}
            </h4>
            <ul className="space-y-2 text-xs text-[#E9DFCC]/80">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E8A33D] shrink-0" />
                <span>contacto@smartrestaurant.app</span>
              </li>
              {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
                const c = COUNTRIES[code];
                return (
                  <li key={code} className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#E8A33D] shrink-0" />
                    <span>
                      {c.profile.phonePrefix} ({t(c.profile.nameKey)} ·{' '}
                      {t(c.profile.pilotCityKey)})
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8A33D] font-mono">
              {t('market_and_language')}
            </h4>
            <div className="grid grid-cols-1 gap-1.5 mb-3">
              {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
                const c = COUNTRIES[code];
                const isSelected = code === country;
                return (
                  <button
                    key={code}
                    onClick={() => setCountry(code)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-[#E8A33D]/20 text-[#E8A33D] font-semibold border border-[#E8A33D]/40'
                        : 'bg-[#332B25]/40 hover:bg-[#332B25] text-[#E9DFCC]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{c.flagEmoji}</span>
                      <span>{t(c.profile.nameKey)}</span>
                    </span>
                    <span className="font-mono text-[10px] text-white/70">
                      {c.currency}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 pt-2 border-t border-[#332B25]">
              <Globe className="w-3.5 h-3.5 text-[#E8A33D]" />
              <div className="flex flex-wrap items-center gap-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      language === l.code
                        ? 'bg-[#E8A33D] text-[#1F1A17] font-bold'
                        : 'text-[#E9DFCC]/70 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E9DFCC]/60 font-sans">
          <div>{t('copyright_text')}</div>
          <div className="flex items-center gap-4 text-[11px] text-[#E9DFCC]/60">
            <Link to="/privacidad" className="hover:text-white transition-colors">
              {t('footer_privacy')}
            </Link>
            <span>•</span>
            <Link to="/mis-datos" className="hover:text-white transition-colors">
              {t('nav_privacy_data')}
            </Link>
            <span>•</span>
            <Link to="/ayuda" className="hover:text-white transition-colors">
              {t('nav_faq')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
