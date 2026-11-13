import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { validatePasswordStrength } from '../../core/security';
import { NameFields } from '../../components/common/NameFields';
import { PhoneInput } from '../../components/common/PhoneInput';
import { ShieldCheck, UserCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export const CustomerRegisterPage: React.FC = () => {
  const { profile, country, language, registerCustomerAccount, showToast, t } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const given = givenName.trim();
    const family = familyName.trim();
    if (!given || !family) {
      setErrorMsg(t('required_field'));
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(t('auth_err_invalid_email'));
      return;
    }

    const phoneClean = phone.trim();
    const phonePattern = new RegExp(profile.phoneRegex);
    if (!phoneClean || !phonePattern.test(phoneClean)) {
      setErrorMsg(t('auth_err_invalid_phone', { format: profile.phoneFormatPlaceholder }));
      return;
    }

    const pwdCheck = validatePasswordStrength(password);
    if (!pwdCheck.valid) {
      setErrorMsg(t(pwdCheck.messageKey || 'auth_err_pwd_short'));
      return;
    }

    if (!consentAccepted) {
      setErrorMsg(t('auth_err_consent_required'));
      return;
    }

    const fullName =
      profile.nameOrder === 'family_given' ? `${family} ${given}` : `${given} ${family}`;

    setLoading(true);
    try {
      await registerCustomerAccount({
        name: fullName,
        firstName: given,
        lastName: family,
        email: email.trim().toLowerCase(),
        phone: `${profile.phonePrefix} ${phoneClean}`,
        password,
        country,
        preferredLanguage: language,
        consentAccepted: true,
      });

      showToast(t('auth_register_welcome', { name: fullName }), 'success');
      navigate(redirectUrl);
    } catch (err: any) {
      if (err.message === 'ERR_EMAIL_EXISTS') {
        setErrorMsg(t('auth_err_email_exists'));
      } else {
        setErrorMsg(t(err.message || 'error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
      <div className="max-w-md w-full bg-[#FFFDF8] rounded-3xl p-8 border border-[#E9DFCC] shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E8A33D] to-[#C8452C] flex items-center justify-center text-white mx-auto shadow-md shadow-[#C8452C]/20 mb-3">
            <UserCheck className="w-7 h-7" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#1F1A17]">{t('auth_register_title')}</h1>
          <p className="text-xs text-[#7A6E65] mt-1">{t('auth_register_subtitle')}</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <NameFields
            profile={profile}
            language={language}
            givenName={givenName}
            familyName={familyName}
            onGivenNameChange={setGivenName}
            onFamilyNameChange={setFamilyName}
          />

          <div>
            <label className="block text-xs font-semibold text-[#1F1A17] mb-1">{t('email')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7A6E65] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FBF6EC] border border-[#E9DFCC] text-xs text-[#1F1A17] focus:outline-none focus:ring-2 focus:ring-[#C8452C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1A17] mb-1">{t('phone')}</label>
            <PhoneInput profile={profile} value={phone} onChange={setPhone} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1A17] mb-1">
              {t('auth_password_label')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7A6E65] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth_password_policy_hint')}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FBF6EC] border border-[#E9DFCC] text-xs text-[#1F1A17] focus:outline-none focus:ring-2 focus:ring-[#C8452C]"
              />
            </div>
            <p className="text-[10px] text-[#7A6E65] mt-1">{t('auth_password_policy_hint')}</p>
          </div>

          {/* Regional Data Protection Legal Consent */}
          <div className="pt-2">
            <div className="p-3 bg-[#FBF6EC] rounded-2xl border border-[#E9DFCC] space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-[#E9DFCC] text-[#C8452C] focus:ring-[#C8452C]"
                />
                <span className="text-[11px] text-[#1F1A17] leading-relaxed">
                  {t('auth_consent_label', { law: profile.dataResidency.applicableLaw })}{' '}
                  <Link to="/privacidad" className="text-[#C8452C] font-semibold underline">
                    {t('footer_privacy')}
                  </Link>
                </span>
              </label>
              <div className="text-[10px] text-[#7A6E65] flex items-center gap-1.5 pt-1 border-t border-[#E9DFCC]/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {profile.dataResidency.legalBasis} · {profile.dataResidency.dataRegion}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#C8452C]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? t('loading') : t('auth_register_submit')}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#7A6E65]">
          {t('auth_already_registered')}{' '}
          <Link to="/login" className="font-bold text-[#C8452C] hover:underline">
            {t('login_button')}
          </Link>
        </div>
      </div>
    </div>
  );
};
