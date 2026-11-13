import React from 'react';
import { RegionProfile } from '../../types';

interface PhoneInputProps {
  profile: RegionProfile;
  value: string;
  error?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  theme?: 'light' | 'dark';
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  profile,
  value,
  error,
  onChange,
  disabled = false,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-1">
      <div
        className={`flex rounded-xl border overflow-hidden focus-within:ring-1 ${
          isDark
            ? 'border-slate-700 bg-slate-900 focus-within:border-amber-500 focus-within:ring-amber-500'
            : 'border-[#E9DFCC] bg-[#FFFDF8] focus-within:border-[#E8A33D] focus-within:ring-[#E8A33D]'
        }`}
      >
        <div
          className={`px-3 py-2 border-r text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 select-none ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-slate-300'
              : 'bg-[#FBF6EC] border-[#E9DFCC] text-[#7A6E65]'
          }`}
        >
          <span>{profile.flagEmoji}</span>
          <span>{profile.phonePrefix}</span>
        </div>

        <input
          type="tel"
          value={value}
          disabled={disabled}
          placeholder={profile.phoneFormatPlaceholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 text-xs bg-transparent focus:outline-none disabled:opacity-50 font-mono ${
            isDark ? 'text-white placeholder-slate-500' : 'text-[#1F1A17]'
          }`}
        />
      </div>

      {error && <p className="text-[10px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
