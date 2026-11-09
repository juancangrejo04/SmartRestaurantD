import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Branch, CountryCode, Restaurant, Table } from '../types';
import { COUNTRIES } from '../i18n/countries';
import {
  Store,
  Plus,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Users,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const BranchesView: React.FC = () => {
  const {
    t,
    country,
    setCountry,
    branches,
    restaurants,
    activeBranchId,
    setActiveBranchId,
    tables,
  } = useApp();

  const handleSelectBranch = (branch: Branch) => {
    setActiveBranchId(branch.id);
    if (branch.country !== country) {
      setCountry(branch.country);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('nav_branches')} & Restaurantes Multinacionales
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Red distribuida de sucursales en Colombia, México, Estados Unidos, Brasil y Japón
          </p>
        </div>
      </div>

      {/* Multinational Restaurant Brands Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {restaurants.map((rest: Restaurant) => {
          const restBranches = branches.filter((b: Branch) => b.restaurantId === rest.id);
          const cConfig = COUNTRIES[rest.country];

          return (
            <div
              key={rest.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{rest.logo}</span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{rest.name}</h3>
                      <p className="text-[11px] text-amber-600 font-medium">{rest.cuisine}</p>
                    </div>
                  </div>

                  <span className="text-lg" title={cConfig.name}>
                    {cConfig.flagEmoji}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {rest.description}
                </p>

                {/* Branches for this restaurant */}
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Sucursales ({restBranches.length})
                  </span>

                  {restBranches.map((br: Branch) => {
                    const isActive = br.id === activeBranchId;
                    const brTables = tables.filter((t: Table) => t.branchId === br.id);

                    return (
                      <div
                        key={br.id}
                        className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-amber-500/10 border-amber-500/40 text-slate-900 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold">{br.name}</span>
                            {isActive && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-slate-950 font-mono font-bold">
                                ACTIVA
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block">{br.address}</span>
                        </div>

                        <button
                          onClick={() => handleSelectBranch(br)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors shrink-0"
                        >
                          Operar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Moneda: {cConfig.currency}</span>
                <span>Zona: {cConfig.timeZone.split('/')[1]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
