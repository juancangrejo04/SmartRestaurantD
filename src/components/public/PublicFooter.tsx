import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { CountryCode, Language } from '../../types';
import { Globe, Heart, Mail, Phone, MapPin, Star } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { setCountry, country, language, setLanguage } = useApp();

  const languages: { code: Language; label: string }[] = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
    { code: 'ja', label: '日本語' },
  ];

  return (
    <footer className="bg-[#1F1A17] text-[#FFFDF8] pt-16 pb-10 border-t border-[#332B25] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#332B25]">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A33D] to-[#C8452C] flex items-center justify-center text-white shadow-md">
                <span className="font-serif italic font-bold text-xl">S</span>
              </div>
              <span className="font-serif font-bold text-xl text-white">
                SmartRestaurant
              </span>
            </div>
            <p className="text-xs text-[#E9DFCC]/70 leading-relaxed font-serif italic text-sm">
              "El arte del buen comer, la precisión de la técnica culinaria y la calidez del servicio sin esperas innecesarias."
            </p>
            <div className="text-xs text-[#E8A33D] flex items-center gap-1.5 font-sans font-medium">
              <Star className="w-3.5 h-3.5 fill-[#E8A33D]" />
              <span>Gastronomía de autor en 5 países</span>
            </div>
          </div>

          {/* Real Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8A33D] font-mono">
              Explorar
            </h4>
            <ul className="space-y-2 text-xs text-[#E9DFCC]/80">
              <li>
                <Link to="/restaurantes" className="hover:text-white transition-colors">
                  Nuestras Marcas y Restaurantes
                </Link>
              </li>
              <li>
                <Link to="/resenas" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Opiniones de Comensales</span>
                  <span className="text-[10px] px-1 rounded bg-[#E8A33D]/20 text-[#E8A33D] font-mono">Nuevo</span>
                </Link>
              </li>
              <li>
                <Link to="/reservar" className="hover:text-white transition-colors">
                  Reservar una Mesa
                </Link>
              </li>
              <li>
                <Link to="/mesa/branch-aura-co-bogota/tbl-co-bogota-3" className="hover:text-white transition-colors">
                  Menú Digital QR
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact per country */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8A33D] font-mono">
              Contacto y Atención
            </h4>
            <ul className="space-y-2 text-xs text-[#E9DFCC]/80">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E8A33D] shrink-0" />
                <span>contacto@smartrestaurant.io</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E8A33D] shrink-0" />
                <span>+57 601 800 2345 (Colombia)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E8A33D] shrink-0" />
                <span>+52 55 9000 1200 (México)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E8A33D] shrink-0" />
                <span>+1 212 555 0198 (Estados Unidos)</span>
              </li>
            </ul>
          </div>

          {/* 5 Countries & Language Switcher */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8A33D] font-mono">
              Mercado & Idioma
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
                      <span>{c.name}</span>
                    </span>
                    <span className="font-mono text-[10px] text-white/70">
                      {c.currency}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Language bar */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-[#332B25]">
              <Globe className="w-3.5 h-3.5 text-[#E8A33D]" />
              <div className="flex items-center gap-1">
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

        {/* Clean Copyright & Brand Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E9DFCC]/60 font-sans">
          <div>
            © 2026 SmartRestaurant. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#E9DFCC]/40">
            <span>Privacidad</span>
            <span>•</span>
            <span>Términos de Servicio</span>
            <span>•</span>
            <span>Guía de Alérgenos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
