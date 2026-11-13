import React from 'react';
import { AddressField, Language, RegionProfile } from '../../types';
import { getTranslation } from '../../i18n/translations';

interface AddressFormProps {
  profile: RegionProfile;
  language?: Language;
  values: Record<string, string>;
  errors?: Record<string, string>;
  onChange: (key: string, value: string) => void;
  disabled?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  profile,
  language,
  values,
  errors = {},
  onChange,
  disabled = false,
}) => {
  const lang = language || profile.defaultLanguage;

  return (
    <div className="space-y-3">
      {profile.addressFields.map((field: AddressField) => {
        const val = values[field.key] || '';
        const err = errors[field.key];
        const label = getTranslation(lang, field.labelKey);
        const placeholder = field.placeholderKey ? getTranslation(lang, field.placeholderKey) : '';

        return (
          <div key={field.key} className="space-y-1">
            <label className="text-xs font-semibold text-[#1F1A17] flex items-center justify-between">
              <span>{label}</span>
              {field.required && (
                <span className="text-[10px] text-[#C8452C] font-mono">*</span>
              )}
            </label>

            {field.type === 'select' && field.options && field.options.length > 0 ? (
              <select
                value={val}
                disabled={disabled}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border bg-[#FFFDF8] text-[#1F1A17] transition-colors focus:outline-none focus:ring-1 ${
                  err
                    ? 'border-[#C8452C] focus:ring-[#C8452C]'
                    : 'border-[#E9DFCC] focus:border-[#E8A33D] focus:ring-[#E8A33D]'
                } disabled:opacity-50`}
              >
                <option value="">{placeholder || label}</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {getTranslation(lang, opt.labelKey)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={val}
                disabled={disabled}
                placeholder={placeholder}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border bg-[#FFFDF8] text-[#1F1A17] transition-colors focus:outline-none focus:ring-1 ${
                  err
                    ? 'border-[#C8452C] focus:ring-[#C8452C]'
                    : 'border-[#E9DFCC] focus:border-[#E8A33D] focus:ring-[#E8A33D]'
                } disabled:opacity-50`}
              />
            )}

            {err && <p className="text-[10px] text-[#C8452C] font-medium">{err}</p>}
          </div>
        );
      })}
    </div>
  );
};
