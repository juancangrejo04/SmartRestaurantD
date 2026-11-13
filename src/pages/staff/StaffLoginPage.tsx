import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/authService';
import { validatePasswordStrength } from '../../core/security';
import { can } from '../../core/permissions';
import { COUNTRIES } from '../../i18n/countries';
import { getRegionProfile } from '../../data/regions';
import { NameFields } from '../../components/common/NameFields';
import { PhoneInput } from '../../components/common/PhoneInput';
import { CountryCode, Language, User } from '../../types';
import {
  Lock,
  Mail,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Building,
  Bike,
  LogIn,
  Globe,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export const StaffLoginPage: React.FC = () => {
  const { language, setLanguage, loginWithCredentials, updateCurrentUser, showToast, t } = useApp();
  const navigate = useNavigate();

  // Set robots noindex meta tag
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';
    return () => {
      if (meta) meta.content = 'all';
    };
  }, []);

  const [activeTab, setActiveTab] = useState<'login' | 'register_commerce' | 'register_courier'>('login');
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockedRemaining, setLockedRemaining] = useState<number | null>(null);

  // Mandatory password change modal
  const [pendingPwdUser, setPendingPwdUser] = useState<User | null>(null);
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdModalError, setPwdModalError] = useState('');

  // Commerce registration form
  const [commGivenName, setCommGivenName] = useState('');
  const [commFamilyName, setCommFamilyName] = useState('');
  const [commBrand, setCommBrand] = useState('');
  const [commCountry, setCommCountry] = useState<CountryCode>('CO');
  const [commCity, setCommCity] = useState(t(getRegionProfile('CO').pilotCityKey));
  const [commEmail, setCommEmail] = useState('');
  const [commPhone, setCommPhone] = useState('');
  const [commPassword, setCommPassword] = useState('');

  // Courier registration form
  const [courGivenName, setCourGivenName] = useState('');
  const [courFamilyName, setCourFamilyName] = useState('');
  const [courCountry, setCourCountry] = useState<CountryCode>('CO');
  const [courCity, setCourCity] = useState(t(getRegionProfile('CO').pilotCityKey));
  const [courVehicle, setCourVehicle] = useState<'bicycle' | 'motorcycle' | 'car' | 'electric_scooter'>('motorcycle');
  const [courEmail, setCourEmail] = useState('');
  const [courPhone, setCourPhone] = useState('');
  const [courPassword, setCourPassword] = useState('');

  const commProfile = getRegionProfile(commCountry);
  const courProfile = getRegionProfile(courCountry);

  // Countdown timer for lock
  useEffect(() => {
    if (lockedRemaining && lockedRemaining > 0) {
      const timer = setInterval(() => {
        setLockedRemaining((prev) => (prev && prev > 1 ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockedRemaining]);

  const routeForUser = (user: User): string => {
    switch (user.role) {
      case 'owner':
        return '/staff/app/owner';
      case 'branch_admin':
      case 'admin':
        return '/staff/app/branch_admin';
      case 'waiter':
      case 'cashier':
        return '/staff/app/waiter';
      case 'kitchen':
        return '/staff/app/kitchen';
      case 'courier':
        return '/staff/app/courier';
      case 'platform_admin':
        return '/staff/app/platform_admin';
      default: {
        // Custom role fallback based on granted permissions
        if (can(user, 'floor.operate') || can(user, 'tables.bill')) return '/staff/app/waiter';
        if (can(user, 'kitchen.operate')) return '/staff/app/kitchen';
        if (can(user, 'dashboard.branch')) return '/staff/app/branch_admin';
        if (can(user, 'team.manage')) return '/staff/app/equipo';
        if (can(user, 'menu.edit')) return '/staff/app/menu';
        if (can(user, 'analytics.view')) return '/staff/app/analytics';
        return '/staff';
      }
    }
  };

  const handleLoginSubmit = async (e?: React.FormEvent, customEmail?: string, customPwd?: string) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const targetEmail = (customEmail ?? email).trim().toLowerCase();
    const targetPassword = customPwd ?? password;

    if (!targetEmail || !targetPassword) {
      setErrorMsg(t('auth_err_invalid_credentials'));
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithCredentials(targetEmail, targetPassword);
      if (res.success && res.user) {
        if (res.user.role === 'customer') {
          authService.logout();
          updateCurrentUser(null);
          setErrorMsg(t('auth_err_invalid_credentials'));
          return;
        }
        if (res.user.mustChangePasswordOnFirstLogin) {
          setPendingPwdUser(res.user);
          return;
        }
        showToast(t('auth_welcome_back', { name: res.user.name }), 'success');
        navigate(routeForUser(res.user));
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
      navigate(routeForUser(updated));
    } catch (err: any) {
      setPwdModalError(t(err.message || 'error'));
    }
  };

  const handleRegisterCommerce = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const fullName =
      commProfile.nameOrder === 'family_given'
        ? `${commFamilyName.trim()} ${commGivenName.trim()}`
        : `${commGivenName.trim()} ${commFamilyName.trim()}`;

    const pwdCheck = validatePasswordStrength(commPassword);
    if (!pwdCheck.valid) {
      setErrorMsg(t(pwdCheck.messageKey || 'auth_err_pwd_short'));
      return;
    }

    setLoading(true);
    try {
      await authService.registerPendingCommerce({
        ownerName: fullName,
        firstName: commGivenName.trim(),
        lastName: commFamilyName.trim(),
        commerceName: commBrand.trim(),
        email: commEmail.trim().toLowerCase(),
        phone: `${commProfile.phonePrefix} ${commPhone.trim()}`,
        password: commPassword,
        country: commCountry,
        city: commCity,
        address: commCity,
        cuisine: 'Signature',
      });
      showToast(t('staff_pending_commerce_sent'), 'success');
      setActiveTab('login');
      setEmail(commEmail.trim().toLowerCase());
    } catch (err: any) {
      setErrorMsg(
        err.message === 'ERR_EMAIL_EXISTS' ? t('auth_err_email_exists') : t(err.message || 'error')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const fullName =
      courProfile.nameOrder === 'family_given'
        ? `${courFamilyName.trim()} ${courGivenName.trim()}`
        : `${courGivenName.trim()} ${courFamilyName.trim()}`;

    const pwdCheck = validatePasswordStrength(courPassword);
    if (!pwdCheck.valid) {
      setErrorMsg(t(pwdCheck.messageKey || 'auth_err_pwd_short'));
      return;
    }

    setLoading(true);
    try {
      await authService.registerPendingCourier({
        courierName: fullName,
        firstName: courGivenName.trim(),
        lastName: courFamilyName.trim(),
        email: courEmail.trim().toLowerCase(),
        phone: `${courProfile.phonePrefix} ${courPhone.trim()}`,
        password: courPassword,
        country: courCountry,
        city: courCity,
        vehicleType: courVehicle,
      });
      showToast(t('staff_pending_courier_sent'), 'success');
      setActiveTab('login');
      setEmail(courEmail.trim().toLowerCase());
    } catch (err: any) {
      setErrorMsg(
        err.message === 'ERR_EMAIL_EXISTS' ? t('auth_err_email_exists') : t(err.message || 'error')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = (accEmail: string, accPwd: string) => {
    setEmail(accEmail);
    setPassword(accPwd);
    handleLoginSubmit(undefined, accEmail, accPwd);
  };

  // Section 5.4 Accounts list
  const demoAccounts = [
    { roleKey: 'role_platform_admin', email: 'plataforma@smartrestaurant.app', pass: 'Plataforma#2026', scope: t('scope_global') },
    { roleKey: 'role_owner', email: 'dueno@smartrestaurant.app', pass: 'Dueno#2026', scope: t('scope_all_brand_branches') },
    { roleKey: 'role_branch_admin', email: 'admin.bogota@smartrestaurant.app', pass: 'Sede#2026', scope: t('city_bogota') },
    { roleKey: 'role_branch_admin', email: 'admin.saopaulo@smartrestaurant.app', pass: 'Sede#2026', scope: t('city_sao_paulo') },
    { roleKey: 'role_branch_admin', email: 'admin.nuevayork@smartrestaurant.app', pass: 'Sede#2026', scope: t('city_new_york') },
    { roleKey: 'role_branch_admin', email: 'admin.paris@smartrestaurant.app', pass: 'Sede#2026', scope: t('city_paris') },
    { roleKey: 'role_branch_admin', email: 'admin.tokio@smartrestaurant.app', pass: 'Sede#2026', scope: t('city_tokyo') },
    { roleKey: 'role_waiter', email: 'mesero.bogota@smartrestaurant.app', pass: 'Mesero#2026', scope: t('city_bogota') },
    { roleKey: 'role_waiter', email: 'mesero.saopaulo@smartrestaurant.app', pass: 'Mesero#2026', scope: t('city_sao_paulo') },
    { roleKey: 'role_kitchen', email: 'cocina.bogota@smartrestaurant.app', pass: 'Cocina#2026', scope: t('city_bogota') },
    { roleKey: 'role_kitchen', email: 'cocina.paris@smartrestaurant.app', pass: 'Cocina#2026', scope: t('city_paris') },
    { roleKey: 'role_courier', email: 'repartidor1.bogota@smartrestaurant.app', pass: 'Reparto#2026', scope: t('city_bogota') },
    { roleKey: 'role_courier', email: 'repartidor1.nuevayork@smartrestaurant.app', pass: 'Reparto#2026', scope: t('city_new_york') },
    { roleKey: 'role_cashier', email: 'cajero.bogota@smartrestaurant.app', pass: 'Caja#2026', scope: t('city_bogota') },
    { roleKey: 'staff_pending_commerce_demo', email: 'nuevo.comercio@smartrestaurant.app', pass: 'Comercio#2026', scope: t('moderation_pending') },
  ];

  const countryList = Object.values(COUNTRIES);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top bar */}
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold font-serif">
            S
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              SmartRestaurant
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                {t('staff_private_badge')}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">{t('staff_portal_subtitle')}</div>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          {(['es', 'en', 'pt', 'fr', 'ja'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-2 py-1 text-xs uppercase rounded-lg font-mono font-bold transition-colors ${
                language === l ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main form box */}
        <div className="lg:col-span-6 bg-slate-800/90 rounded-3xl p-8 border border-slate-700 shadow-2xl backdrop-blur-md">
          {/* Navigation tabs */}
          <div className="flex p-1 bg-slate-900/80 rounded-2xl mb-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'login' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('login_button')}
            </button>
            <button
              onClick={() => setActiveTab('register_commerce')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'register_commerce' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('staff_tab_register_commerce')}
            </button>
            <button
              onClick={() => setActiveTab('register_courier')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'register_courier' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('staff_tab_register_courier')}
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('email')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dueno@smartrestaurant.app"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('auth_password_label')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {lockedRemaining !== null && lockedRemaining > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs flex items-center gap-2 font-mono">
                  <span>{t('auth_err_rate_limited', { seconds: lockedRemaining })}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (lockedRemaining !== null && lockedRemaining > 0)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? t('loading') : t('staff_enter_panel_btn')}</span>
                <LogIn className="w-4 h-4 text-slate-950" />
              </button>

              <div className="text-[11px] text-slate-400 text-center pt-2">
                {t('staff_security_notice')}
              </div>
            </form>
          )}

          {activeTab === 'register_commerce' && (
            <form onSubmit={handleRegisterCommerce} className="space-y-3">
              <div className="text-xs text-slate-300 mb-2">{t('staff_commerce_signup_desc')}</div>
              <NameFields
                theme="dark"
                profile={commProfile}
                language={language}
                givenName={commGivenName}
                familyName={commFamilyName}
                onGivenNameChange={setCommGivenName}
                onFamilyNameChange={setCommFamilyName}
              />
              <input
                type="text"
                required
                placeholder={t('staff_commerce_brand_placeholder')}
                value={commBrand}
                onChange={(e) => setCommBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={commCountry}
                  onChange={(e) => {
                    const nextCode = e.target.value as CountryCode;
                    setCommCountry(nextCode);
                    setCommCity(t(getRegionProfile(nextCode).pilotCityKey));
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  {countryList.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flagEmoji} {t(c.profile.nameKey)} ({t(c.profile.pilotCityKey)})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  placeholder={t('field_address_city')}
                  value={commCity}
                  onChange={(e) => setCommCity(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
              <input
                type="email"
                required
                placeholder={t('email')}
                value={commEmail}
                onChange={(e) => setCommEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
              <PhoneInput
                theme="dark"
                profile={commProfile}
                value={commPhone}
                onChange={setCommPhone}
              />
              <input
                type="password"
                required
                placeholder={t('auth_password_policy_hint')}
                value={commPassword}
                onChange={(e) => setCommPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Building className="w-4 h-4" />
                <span>{t('staff_submit_commerce_btn')}</span>
              </button>
            </form>
          )}

          {activeTab === 'register_courier' && (
            <form onSubmit={handleRegisterCourier} className="space-y-3">
              <div className="text-xs text-slate-300 mb-2">{t('staff_courier_signup_desc')}</div>
              <NameFields
                theme="dark"
                profile={courProfile}
                language={language}
                givenName={courGivenName}
                familyName={courFamilyName}
                onGivenNameChange={setCourGivenName}
                onFamilyNameChange={setCourFamilyName}
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={courCountry}
                  onChange={(e) => {
                    const nextCode = e.target.value as CountryCode;
                    setCourCountry(nextCode);
                    setCourCity(t(getRegionProfile(nextCode).pilotCityKey));
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  {countryList.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flagEmoji} {t(c.profile.nameKey)}
                    </option>
                  ))}
                </select>
                <select
                  value={courVehicle}
                  onChange={(e) => setCourVehicle(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="motorcycle">{t('vehicle_motorcycle')}</option>
                  <option value="bicycle">{t('vehicle_bicycle')}</option>
                  <option value="electric_scooter">{t('vehicle_scooter')}</option>
                  <option value="car">{t('vehicle_car')}</option>
                </select>
              </div>
              <input
                type="text"
                required
                placeholder={t('field_address_city')}
                value={courCity}
                onChange={(e) => setCourCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
              <input
                type="email"
                required
                placeholder={t('email')}
                value={courEmail}
                onChange={(e) => setCourEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
              <PhoneInput
                theme="dark"
                profile={courProfile}
                value={courPhone}
                onChange={setCourPhone}
              />
              <input
                type="password"
                required
                placeholder={t('auth_password_policy_hint')}
                value={courPassword}
                onChange={(e) => setCourPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Bike className="w-4 h-4" />
                <span>{t('staff_submit_courier_btn')}</span>
              </button>
            </form>
          )}
        </div>

        {/* Section 5.4 Demo Accounts Collapsible Box */}
        <div className="lg:col-span-6 bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-xl">
          <div
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">{t('demo_credentials_title')}</h2>
            </div>
            <button type="button" className="text-slate-400 hover:text-white p-1">
              {showDemoAccounts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-1 mb-4">{t('demo_credentials_hint')}</p>

          {showDemoAccounts && (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {demoAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between text-xs gap-2 hover:border-slate-600 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-amber-300 truncate">{t(acc.roleKey)}</div>
                    <div className="text-[11px] text-slate-300 font-mono truncate">{acc.email}</div>
                    <div className="text-[10px] text-slate-400">
                      <code className="text-slate-200">{acc.pass}</code> · {acc.scope}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAutoFill(acc.email, acc.pass)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-semibold text-[11px] border border-slate-700 transition-all shrink-0"
                  >
                    {t('auth_autofill_btn')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mandatory First-Login Password Rotation Modal */}
      {pendingPwdUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="max-w-sm w-full bg-slate-900 rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <KeyRound className="w-5 h-5" />
              <span>{t('auth_force_pwd_title')}</span>
            </div>
            <p className="text-xs text-slate-400">{t('auth_force_pwd_desc')}</p>

            {pwdModalError && (
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                {pwdModalError}
              </div>
            )}

            <form onSubmit={handleForceChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t('auth_new_password_label')}
                </label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t('auth_confirm_password_label')}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
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
