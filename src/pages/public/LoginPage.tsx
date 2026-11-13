import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/authService';
import { validatePasswordStrength } from '../../core/security';
import { COUNTRIES } from '../../i18n/countries';
import { User } from '../../types';
import {
  Lock,
  Mail,
  LogIn,
  AlertCircle,
  Sparkles,
  ArrowRight,
  KeyRound,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithCredentials, updateCurrentUser, showToast, t } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockedRemaining, setLockedRemaining] = useState<number | null>(null);

  // Mandatory first-login password rotation modal
  const [pendingPwdUser, setPendingPwdUser] = useState<User | null>(null);
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdModalError, setPwdModalError] = useState('');

  useEffect(() => {
    if (!lockedRemaining || lockedRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockedRemaining((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockedRemaining]);

  const customerDemoAccounts = [
    {
      flag: COUNTRIES.CO.flagEmoji,
      email: 'cliente.bogota@demo.app',
      name: 'Valentina Morales',
      cityKey: 'city_bogota',
    },
    {
      flag: COUNTRIES.BR.flagEmoji,
      email: 'cliente.saopaulo@demo.app',
      name: 'Camila Santos',
      cityKey: 'city_sao_paulo',
    },
    {
      flag: COUNTRIES.US.flagEmoji,
      email: 'cliente.nuevayork@demo.app',
      name: 'Sarah Jenkins',
      cityKey: 'city_new_york',
    },
    {
      flag: COUNTRIES.FR.flagEmoji,
      email: 'cliente.paris@demo.app',
      name: 'Juliette Moreau',
      cityKey: 'city_paris',
    },
    {
      flag: COUNTRIES.JP.flagEmoji,
      email: 'cliente.tokio@demo.app',
      name: '高橋 由紀 (Yuki Takahashi)',
      cityKey: 'city_tokyo',
    },
  ];

  const handleLogin = async (e?: React.FormEvent, directEmail?: string, directPwd?: string) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const targetEmail = (directEmail ?? email).trim().toLowerCase();
    const targetPassword = directPwd ?? password;

    if (!targetEmail || !targetPassword) {
      setErrorMsg(t('auth_err_invalid_credentials'));
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithCredentials(targetEmail, targetPassword);
      if (res.success && res.user) {
        if (res.user.mustChangePasswordOnFirstLogin) {
          setPendingPwdUser(res.user);
          return;
        }
        showToast(t('auth_welcome_back', { name: res.user.name }), 'success');
        navigate(redirectUrl);
      } else {
        if (res.locked) {
          const secs = res.remainingSeconds || 60;
          setLockedRemaining(secs);
          setErrorMsg(t('auth_err_rate_limited', { seconds: secs }));
        } else {
          setErrorMsg(t(res.messageKey || 'auth_err_invalid_credentials'));
        }
      }
    } catch {
      setErrorMsg(t('auth_err_invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleForceChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPwdUser) return;
    setPwdModalError('');

    const check = validatePasswordStrength(newPwd);
    if (!check.valid) {
      setPwdModalError(t(check.messageKey || 'auth_err_pwd_short'));
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdModalError(t('auth_err_pwd_mismatch'));
      return;
    }

    try {
      const updated = await authService.changeOwnPassword(pendingPwdUser.id, newPwd);
      updateCurrentUser(updated);
      setPendingPwdUser(null);
      showToast(t('auth_welcome_back', { name: updated.name }), 'success');
      navigate(redirectUrl);
    } catch (err: any) {
      setPwdModalError(t(err.message || 'error'));
    }
  };

  const handleQuickDemoCustomer = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Cliente#2026');
    handleLogin(undefined, demoEmail, 'Cliente#2026');
  };

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
      <div className="max-w-md w-full bg-[#FFFDF8] rounded-3xl p-8 border border-[#E9DFCC] shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E8A33D] to-[#C8452C] flex items-center justify-center text-white mx-auto shadow-md shadow-[#C8452C]/20 mb-3">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#1F1A17]">{t('login_title')}</h1>
          <p className="text-xs text-[#7A6E65] mt-1">{t('login_customer_subtitle')}</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F1A17] mb-1">{t('email')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7A6E65] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente.bogota@demo.app"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FBF6EC] border border-[#E9DFCC] text-xs text-[#1F1A17] focus:outline-none focus:ring-2 focus:ring-[#C8452C]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#1F1A17]">{t('auth_password_label')}</label>
              <span className="text-[11px] text-[#7A6E65] font-mono">Cliente#2026</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7A6E65] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FBF6EC] border border-[#E9DFCC] text-xs text-[#1F1A17] focus:outline-none focus:ring-2 focus:ring-[#C8452C]"
              />
            </div>
          </div>

          {lockedRemaining !== null && lockedRemaining > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono">
              {t('auth_err_rate_limited', { seconds: lockedRemaining })}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (lockedRemaining !== null && lockedRemaining > 0)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C8452C] to-[#E8A33D] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#C8452C]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? t('loading') : t('login_button')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Customer Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-[#E9DFCC]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F1A17] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E8A33D]" />
            <span>{t('auth_demo_customers_title')}</span>
          </div>
          <div className="space-y-1.5">
            {customerDemoAccounts.map((c) => (
              <button
                key={c.email}
                type="button"
                onClick={() => handleQuickDemoCustomer(c.email)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-[#FBF6EC] hover:bg-[#E9DFCC]/50 border border-[#E9DFCC] text-left text-xs transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-[#1F1A17] flex items-center gap-1.5 truncate">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </div>
                  <div className="text-[10px] text-[#7A6E65] truncate">
                    {c.email} · {t(c.cityKey)}
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-white text-[#C8452C] font-semibold border border-[#E9DFCC] shrink-0">
                  {t('auth_autofill_btn')}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#7A6E65]">
          {t('auth_no_account_yet')}{' '}
          <Link to="/registro" className="font-bold text-[#C8452C] hover:underline">
            {t('auth_register_link')}
          </Link>
        </div>
      </div>

      {/* Mandatory Password Change Modal */}
      {pendingPwdUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="max-w-sm w-full bg-[#FFFDF8] rounded-3xl p-6 border border-[#E9DFCC] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#C8452C] font-bold text-sm">
              <KeyRound className="w-5 h-5" />
              <span>{t('auth_force_pwd_title')}</span>
            </div>
            <p className="text-xs text-[#7A6E65]">{t('auth_force_pwd_desc')}</p>

            {pwdModalError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {pwdModalError}
              </div>
            )}

            <form onSubmit={handleForceChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1F1A17] mb-1">
                  {t('auth_new_password_label')}
                </label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FBF6EC] border border-[#E9DFCC]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1F1A17] mb-1">
                  {t('auth_confirm_password_label')}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FBF6EC] border border-[#E9DFCC]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#C8452C] text-white font-bold"
              >
                {t('save')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
