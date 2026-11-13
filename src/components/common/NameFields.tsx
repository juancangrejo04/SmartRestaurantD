import React from 'react';
import { Language, RegionProfile } from '../../types';
import { getTranslation } from '../../i18n/translations';

interface NameFieldsProps {
  profile: RegionProfile;
  language?: Language;
  givenName: string;
  familyName: string;
  onGivenNameChange: (val: string) => void;
  onFamilyNameChange: (val: string) => void;
  givenNameError?: string;
  familyNameError?: string;
  disabled?: boolean;
  theme?: 'light' | 'dark';
}

export const NameFields: React.FC<NameFieldsProps> = ({
  profile,
  language,
  givenName,
  familyName,
  onGivenNameChange,
  onFamilyNameChange,
  givenNameError,
  familyNameError,
  disabled = false,
  theme = 'light',
}) => {
  const lang = language || profile.defaultLanguage;
  const isFamilyGiven = profile.nameOrder === 'family_given';
  const isDark = theme === 'dark';

  const labelCls = isDark ? 'text-slate-300' : 'text-[#1F1A17]';
  const baseInputCls = isDark
    ? 'bg-slate-900 text-white placeholder-slate-500 border-slate-700 focus:border-amber-500 focus:ring-amber-500'
    : 'bg-[#FFFDF8] text-[#1F1A17] border-[#E9DFCC] focus:border-[#E8A33D] focus:ring-[#E8A33D]';

  const familyField = (
    <div key="family" className="space-y-1">
      <label className={`text-xs font-semibold flex items-center justify-between ${labelCls}`}>
        <span>{getTranslation(lang, 'name_family_label')}</span>
        <span className="text-[10px] text-[#C8452C] font-mono">*</span>
      </label>
      <input
        type="text"
        value={familyName}
        disabled={disabled}
        placeholder={getTranslation(lang, 'name_family_placeholder')}
        onChange={(e) => onFamilyNameChange(e.target.value)}
        className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
          familyNameError ? 'border-rose-500 focus:ring-rose-500' : baseInputCls
        } disabled:opacity-50`}
      />
      {familyNameError && <p className="text-[10px] text-rose-500 font-medium">{familyNameError}</p>}
    </div>
  );

  const givenField = (
    <div key="given" className="space-y-1">
      <label className={`text-xs font-semibold flex items-center justify-between ${labelCls}`}>
        <span>{getTranslation(lang, 'name_given_label')}</span>
        <span className="text-[10px] text-[#C8452C] font-mono">*</span>
      </label>
      <input
        type="text"
        value={givenName}
        disabled={disabled}
        placeholder={getTranslation(lang, 'name_given_placeholder')}
        onChange={(e) => onGivenNameChange(e.target.value)}
        className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
          givenNameError ? 'border-rose-500 focus:ring-rose-500' : baseInputCls
        } disabled:opacity-50`}
      />
      {givenNameError && <p className="text-[10px] text-rose-500 font-medium">{givenNameError}</p>}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {isFamilyGiven ? [familyField, givenField] : [givenField, familyField]}
    </div>
  );
};
