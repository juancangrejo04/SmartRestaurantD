import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../i18n/countries';
import { CountryCode } from '../../types';
import { Utensils, Globe, Sparkles, Shield, Heart } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { setCountry, country, t } = useApp();

  return (
    <footer className="bg-[#1F1A17] text-[#FFFDF8] pt-16 pb-12 border-t border-[#332B25] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#332B25]">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A33D] to-[#C8452C] flex items-center justify-center text-white">
                <span className="font-serif italic font-bold text-xl">S</span>
              </div>
              <span className="font-serif font-bold text-xl text-white">
                SmartRestaurant
              </span>
            </div>
            <p className="text-xs text-[#E9DFCC]/70 leading-relaxed font-serif italic text-sm">
              "El arte del buen comer, la precisión de la técnica y la calidez del servicio sin fricciones."
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E8A33D] font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulación Distribuida v2.0</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8A33D] font-mono">
              Comensales
            </h4>
            <ul className="space-y-2 text-xs text-[#E9DFCC]/80">
              <li>
                <Link to="/restaurantes" className="hover:text-white transition-colors">
                  Restaurantes y Menús
                </Link>
              </li>
              <li>
                <Link to="/reservar" className="hover:text-white transition-colors">
                  Reservar una Mesa
                </Link>
              </li>
              <li>
                <Link to="/mesa/branch-co-01/table-co-01-03" className="hover:text-white transition-colors">
                  Menú Digital QR en Mesa
                </Link>
              </li>
              <li>
                <Link to="/mis-reservas" className="hover:text-white transition-colors">
                  Consultar Mis Reservas
                </Link>
              </li>
            </ul>
          </div>

          {/* Staff & Architecture links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8A33D] font-mono">
              Gestión & Arquitectura
            </h4>
            <ul className="space-y-2 text-xs text-[#E9DFCC]/80">
              <li>
                <Link to="/app/dashboard" className="hover:text-white transition-colors">
                  Panel de Control (Staff)
                </Link>
              </li>
              <li>
                <Link to="/app/cocina" className="hover:text-white transition-colors">
                  Sistema de Cocina (KDS)
                </Link>
              </li>
              <li>
                <Link to="/app/monitor" className="hover:text-white transition-colors text-[#E8A33D]">
                  Monitor de Eventos Distribuidos
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Cuentas de Demostración
                </Link>
              </li>
            </ul>
          </div>

          {/* 5 Countries Switcher */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8A33D] font-mono">
              Mercados Disponibles (5)
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
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
                    <span className="font-mono text-[10px] text-white/60">
                      {c.currency}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Academic Note & Legal Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E9DFCC]/60 font-mono">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Shield className="w-4 h-4 text-[#E8A33D] shrink-0" />
            <span>
              Proyecto Académico Demostrativo • Arquitectura de Servicios Distribuidos, Event Bus y Persistencia Local
            </span>
          </div>
          <div className="text-[11px] text-[#E9DFCC]/40">
            Diseñado para despliegue directo en Vercel • React + Vite + Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
  );
};
