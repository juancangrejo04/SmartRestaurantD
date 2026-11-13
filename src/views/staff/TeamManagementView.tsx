import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Shield,
  FileText,
  UserPlus,
  Trash2,
  Copy,
  Check,
  Search,
  ShieldAlert,
  Pencil,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { auditService } from '../../services/auditService';
import {
  validatePrivilegeEscalation,
  ROLE_DEFAULT_PERMISSIONS,
  Permission,
} from '../../core/permissions';
import { validatePasswordStrength } from '../../core/security';
import { getRegionProfile } from '../../data/regions';
import { NameFields } from '../../components/common/NameFields';
import { PhoneInput } from '../../components/common/PhoneInput';
import { User, CountryCode, AuditLogEntry, CustomRole } from '../../types';

export const TeamManagementView: React.FC = () => {
  const {
    currentUser,
    branches,
    profile,
    language,
    refreshUsers,
    getBranchDisplayName,
    getBranchCityName,
    loc,
    showToast,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit'>('users');
  const [users, setUsers] = useState<User[]>(() => authService.getUsers());
  const [customRoles, setCustomRoles] = useState<CustomRole[]>(() => authService.getCustomRoles());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => auditService.getAll());
  const [searchTerm, setSearchTerm] = useState('');

  const isBranchAdmin = currentUser?.role === 'branch_admin' || currentUser?.role === 'admin';
  const actorBranchId = currentUser?.assignedBranchId || currentUser?.branchId;
  const availableBranches = isBranchAdmin && actorBranchId
    ? branches.filter((b) => b.id === actorBranchId)
    : branches;

  const initialBranch = availableBranches[0] || branches[0];

  // Create user modal state
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userRole, setUserRole] = useState<string>('waiter');
  const [userBranchId, setUserBranchId] = useState<string>(initialBranch?.id || '');
  const [userCountry, setUserCountry] = useState<CountryCode>(initialBranch?.country || 'CO');
  const [userPassword, setUserPassword] = useState('');
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [copiedPwd, setCopiedPwd] = useState(false);
  const [formError, setFormError] = useState('');

  // Edit user modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editGivenName, setEditGivenName] = useState('');
  const [editFamilyName, setEditFamilyName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<string>('waiter');
  const [editBranchId, setEditBranchId] = useState<string>('');
  const [editError, setEditError] = useState('');

  // Create custom role state
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [newRoleId, setNewRoleId] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([
    'tables.bill',
    'notifications.view',
  ]);
  const [roleError, setRoleError] = useState('');

  // Password reset modal state
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [resetError, setResetError] = useState('');

  const createProfile = getRegionProfile(userCountry);
  const editBranch = branches.find((b) => b.id === editBranchId);
  const editProfile = getRegionProfile(editBranch?.country || editingUser?.country || 'CO');

  const PERMISSION_GROUPS: { groupKey: string; perms: { key: Permission; labelKey: string }[] }[] = [
    {
      groupKey: 'perm_group_platform',
      perms: [
        { key: 'global.console', labelKey: 'perm_global_console' },
        { key: 'regions.edit', labelKey: 'perm_regions_edit' },
        { key: 'approvals.manage', labelKey: 'perm_approvals_manage' },
      ],
    },
    {
      groupKey: 'perm_group_branches',
      perms: [
        { key: 'dashboard.consolidated', labelKey: 'perm_dashboard_consolidated' },
        { key: 'dashboard.branch', labelKey: 'perm_dashboard_branch' },
        { key: 'analytics.view', labelKey: 'perm_analytics_view' },
        { key: 'branches.manage', labelKey: 'perm_branches_manage' },
        { key: 'team.manage', labelKey: 'perm_team_manage' },
      ],
    },
    {
      groupKey: 'perm_group_operations',
      perms: [
        { key: 'menu.edit', labelKey: 'perm_menu_edit' },
        { key: 'menu.toggleAvailability', labelKey: 'perm_menu_toggle' },
        { key: 'kitchen.operate', labelKey: 'perm_kitchen_operate' },
        { key: 'floor.operate', labelKey: 'perm_floor_operate' },
        { key: 'reservations.manage', labelKey: 'perm_reservations_manage' },
      ],
    },
    {
      groupKey: 'perm_group_billing',
      perms: [
        { key: 'tables.bill', labelKey: 'perm_tables_bill' },
        { key: 'discounts.refunds', labelKey: 'perm_discounts_refunds' },
        { key: 'orders.acceptDelivery', labelKey: 'perm_orders_accept_delivery' },
        { key: 'orders.cancelDish', labelKey: 'perm_orders_cancel_dish' },
        { key: 'reviews.moderate', labelKey: 'perm_reviews_moderate' },
        { key: 'notifications.view', labelKey: 'perm_notifications_view' },
      ],
    },
  ];

  const syncState = () => {
    setUsers(authService.getUsers());
    setCustomRoles(authService.getCustomRoles());
    setAuditLogs(auditService.getAll());
    refreshUsers();
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let pwd = 'Sr#';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pwd += '9!';
    setUserPassword(pwd);
  };

  const handleCopyPassword = () => {
    if (userPassword) {
      navigator.clipboard.writeText(userPassword);
      setCopiedPwd(true);
      setTimeout(() => setCopiedPwd(false), 2000);
      showToast(t('team_password_copied'), 'info');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!currentUser) return;

    const fullName =
      createProfile.nameOrder === 'family_given'
        ? `${familyName.trim()} ${givenName.trim()}`
        : `${givenName.trim()} ${familyName.trim()}`;

    if (!givenName.trim() || !familyName.trim()) {
      setFormError(t('required_field'));
      return;
    }

    const customMatch = customRoles.find((r) => r.id === userRole);
    const escalationCheck = validatePrivilegeEscalation(
      currentUser,
      userRole,
      userBranchId,
      customMatch?.permissions as Permission[] | undefined
    );
    if (!escalationCheck.allowed) {
      setFormError(`ERR_FORBIDDEN: ${t(escalationCheck.errorMessageKey || 'err_forbidden_action')}`);
      return;
    }

    const pwdCheck = validatePasswordStrength(userPassword);
    if (!pwdCheck.valid) {
      setFormError(t(pwdCheck.messageKey || 'auth_err_pwd_short'));
      return;
    }

    try {
      await authService.createTeamUser(currentUser, {
        name: fullName,
        firstName: givenName.trim(),
        lastName: familyName.trim(),
        email: userEmail.trim().toLowerCase(),
        phone: `${createProfile.phonePrefix} ${userPhone.trim()}`,
        role: userRole,
        assignedBranchId: userBranchId,
        country: userCountry,
        password: userPassword,
        mustChangePasswordOnFirstLogin: mustChangePassword,
      });

      syncState();
      showToast(t('team_user_created_toast', { name: fullName }), 'success');
      setShowCreateUserModal(false);
      setGivenName('');
      setFamilyName('');
      setUserEmail('');
      setUserPhone('');
      setUserPassword('');
    } catch (err: any) {
      setFormError(
        err.message === 'ERR_EMAIL_EXISTS'
          ? t('auth_err_email_exists')
          : t(err.message || 'err_forbidden_action')
      );
    }
  };

  const openEditUserModal = (u: User) => {
    setEditError('');
    setEditingUser(u);
    setEditGivenName(u.firstName || u.name.split(' ')[0] || '');
    setEditFamilyName(u.lastName || u.name.split(' ').slice(1).join(' ') || '-');
    setEditPhone(u.phone ? u.phone.replace(/^\+\d+\s*/, '') : '');
    setEditRole(u.role);
    setEditBranchId(u.assignedBranchId || u.branchId || availableBranches[0]?.id || '');
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editingUser) return;
    setEditError('');

    const fullName =
      editProfile.nameOrder === 'family_given'
        ? `${editFamilyName.trim()} ${editGivenName.trim()}`
        : `${editGivenName.trim()} ${editFamilyName.trim()}`;

    try {
      authService.updateTeamUser(currentUser, editingUser.id, {
        name: fullName,
        firstName: editGivenName.trim(),
        lastName: editFamilyName.trim(),
        phone: `${editProfile.phonePrefix} ${editPhone.trim()}`,
        role: editRole,
        assignedBranchId: editBranchId,
        country: editBranch?.country || editingUser.country,
      });
      syncState();
      setEditingUser(null);
      showToast(t('team_user_updated_toast', { name: fullName }), 'success');
    } catch (err: any) {
      setEditError(`ERR_FORBIDDEN: ${t(err.message || 'err_forbidden_action')}`);
    }
  };

  const handleToggleDeactivate = (u: User) => {
    if (!currentUser) return;
    try {
      if (u.status === 'active') {
        authService.deactivateUser(currentUser, u.id);
        showToast(t('team_user_deactivated_toast', { name: u.name }), 'warning');
      } else {
        authService.reactivateUser(currentUser, u.id);
        showToast(t('team_user_reactivated_toast', { name: u.name }), 'success');
      }
      syncState();
    } catch (err: any) {
      showToast(`ERR_FORBIDDEN: ${t(err.message || 'err_forbidden_action')}`, 'error');
    }
  };

  const handleDeleteUser = (u: User) => {
    if (!currentUser) return;
    try {
      authService.deleteUser(currentUser, u.id);
      syncState();
      showToast(t('team_user_deleted_toast', { name: u.name }), 'info');
    } catch (err: any) {
      showToast(`ERR_FORBIDDEN: ${t(err.message || 'err_forbidden_action')}`, 'error');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser || !currentUser) return;
    setResetError('');
    try {
      await authService.resetUserPassword(currentUser, resettingUser.id, newResetPassword);
      syncState();
      showToast(t('team_password_reset_toast', { name: resettingUser.name }), 'success');
      setResettingUser(null);
      setNewResetPassword('');
    } catch (err: any) {
      setResetError(t(err.message || 'err_forbidden_action'));
    }
  };

  const handleTogglePermission = (key: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    setRoleError('');
    if (!currentUser) return;

    const cleanId = newRoleId.toLowerCase().trim().replace(/\s+/g, '_');
    const check = validatePrivilegeEscalation(
      currentUser,
      cleanId,
      isBranchAdmin ? actorBranchId : undefined,
      selectedPermissions
    );
    if (!check.allowed) {
      setRoleError(`ERR_FORBIDDEN: ${t(check.errorMessageKey || 'err_cannot_grant_extra_permissions')}`);
      return;
    }

    try {
      authService.createCustomRole(currentUser, {
        id: cleanId,
        name: {
          es: newRoleName.trim(),
          en: newRoleName.trim(),
          pt: newRoleName.trim(),
          fr: newRoleName.trim(),
          ja: newRoleName.trim(),
        },
        description: {
          es: newRoleDesc.trim(),
          en: newRoleDesc.trim(),
          pt: newRoleDesc.trim(),
          fr: newRoleDesc.trim(),
          ja: newRoleDesc.trim(),
        },
        permissions: selectedPermissions,
        branchId: isBranchAdmin ? actorBranchId : undefined,
      });

      syncState();
      showToast(t('team_role_created_toast', { name: newRoleName.trim() }), 'success');
      setShowCreateRoleModal(false);
      setNewRoleId('');
      setNewRoleName('');
      setNewRoleDesc('');
    } catch (err: any) {
      setRoleError(`ERR_FORBIDDEN: ${t(err.message || 'err_forbidden_action')}`);
    }
  };

  // Scope visible users to current actor's authority
  const visibleUsers = users.filter((u) => {
    if (isBranchAdmin && actorBranchId) {
      const uBranch = u.assignedBranchId || u.branchId;
      if (uBranch && uBranch !== actorBranchId) return false;
      if (!uBranch && u.role !== 'courier') return false;
      if (u.role === 'courier' && u.country !== currentUser?.country) return false;
    }
    const q = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const actorTimeZone = currentUser?.timeZone || profile.timeZone;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
            {t('team_badge')}
          </span>
          <h1 className="text-2xl font-bold font-serif text-white mt-1">{t('team_title')}</h1>
          <p className="text-xs text-slate-400">{t('team_subtitle')}</p>
        </div>

        {activeTab === 'users' && (
          <button
            onClick={() => {
              setFormError('');
              handleGeneratePassword();
              setShowCreateUserModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('team_create_user_btn')}</span>
          </button>
        )}

        {activeTab === 'roles' && (
          <button
            onClick={() => {
              setRoleError('');
              setShowCreateRoleModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>{t('team_new_role_btn')}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>
            {t('team_tab_users')} ({visibleUsers.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>
            {t('team_tab_roles')} ({customRoles.length + 6})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>
            {t('team_tab_audit')} ({auditLogs.length})
          </span>
        </button>
      </div>

      {/* TAB 1: USERS LIST */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-3">{t('team_col_user')}</th>
                  <th className="py-3 px-3">{t('team_col_role')}</th>
                  <th className="py-3 px-3">{t('assigned_branch')}</th>
                  <th className="py-3 px-3">{t('status')}</th>
                  <th className="py-3 px-3 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {visibleUsers.map((u) => {
                  const uBranchId = u.assignedBranchId || u.branchId;
                  const userBranch = branches.find((b) => b.id === uBranchId);
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <div className="font-bold text-white">{u.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-amber-300 border border-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-300">
                          {userBranch
                            ? `${getBranchDisplayName(userBranch)} (${getBranchCityName(userBranch)})`
                            : t('scope_global')}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.status === 'active'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                              : u.status === 'pending'
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => openEditUserModal(u)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title={t('edit')}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setResetError('');
                            setResettingUser(u);
                            setNewResetPassword('Sede#2026!');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                        >
                          {t('team_reset_pwd_btn')}
                        </button>
                        <button
                          onClick={() => handleToggleDeactivate(u)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            u.status === 'active'
                              ? 'bg-slate-800 hover:bg-amber-950/60 text-amber-300'
                              : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300'
                          }`}
                        >
                          {u.status === 'active' ? t('team_deactivate_btn') : t('team_reactivate_btn')}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM ROLE BUILDER */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['platform_admin', 'owner', 'branch_admin', 'waiter', 'kitchen', 'courier'].map((r) => {
            const perms = ROLE_DEFAULT_PERMISSIONS[r] || [];
            return (
              <div key={r} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400 uppercase text-xs">
                    {t(`role_${r}`)}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {t('team_role_system')}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {t(`role_${r}_desc`)}
                </p>
                <div className="text-[10px] text-slate-500 font-mono max-h-24 overflow-y-auto">
                  {perms.join(' • ')}
                </div>
              </div>
            );
          })}

          {customRoles.map((cr) => (
            <div
              key={cr.id}
              className="p-5 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-400 uppercase text-xs">
                  {loc(cr.name)} ({cr.id})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {t('team_role_custom')}
                </span>
              </div>
              <p className="text-xs text-slate-300">{loc(cr.description)}</p>
              <div className="text-[10px] text-slate-400 font-mono">
                {cr.permissions.length} {t('team_permissions_count')}: {cr.permissions.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              {t('team_audit_heading')} ({actorTimeZone})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-3">{t('date')}</th>
                  <th className="py-3 px-3">{t('team_col_actor')}</th>
                  <th className="py-3 px-3">{t('team_col_role')}</th>
                  <th className="py-3 px-3">{t('actions')}</th>
                  <th className="py-3 px-3">{t('team_col_details')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => {
                  const localDate = new Date(log.timestampUtc).toLocaleString(language, {
                    timeZone: actorTimeZone,
                  });
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {localDate}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">{log.actorName}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[10px] text-amber-300 uppercase">
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-200">{log.action}</td>
                      <td className="py-3 px-3 text-slate-300 text-[11px]">{log.details}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE USER */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-slate-900 rounded-3xl border border-slate-700 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">{t('team_create_user_btn')}</h3>
              <button onClick={() => setShowCreateUserModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <NameFields
                theme="dark"
                profile={createProfile}
                language={language}
                givenName={givenName}
                familyName={familyName}
                onGivenNameChange={setGivenName}
                onFamilyNameChange={setFamilyName}
              />

              <div>
                <label className="block font-semibold text-slate-300 mb-1">{t('email')}</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="staff@smartrestaurant.app"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">{t('phone')}</label>
                <PhoneInput
                  theme="dark"
                  profile={createProfile}
                  value={userPhone}
                  onChange={setUserPhone}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">{t('select_role')}</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="waiter">{t('role_waiter')}</option>
                    <option value="kitchen">{t('role_kitchen')}</option>
                    <option value="courier">{t('role_courier')}</option>
                    <option value="branch_admin">{t('role_branch_admin')}</option>
                    {customRoles.map((cr) => (
                      <option key={cr.id} value={cr.id}>
                        {loc(cr.name)} ({cr.id})
                      </option>
                    ))}
                    <option value="owner">{t('role_owner')}</option>
                    {currentUser?.role === 'platform_admin' && (
                      <option value="platform_admin">{t('role_platform_admin')}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">{t('assigned_branch')}</label>
                  <select
                    value={userBranchId}
                    disabled={isBranchAdmin}
                    onChange={(e) => {
                      setUserBranchId(e.target.value);
                      const b = branches.find((br) => br.id === e.target.value);
                      if (b) setUserCountry(b.country);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white disabled:opacity-70"
                  >
                    {availableBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {getBranchDisplayName(b)} ({getBranchCityName(b)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password Generator */}
              <div className="p-3 bg-slate-800/80 rounded-xl space-y-2 border border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-300">{t('auth_password_label')}</span>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-amber-400 hover:underline font-bold text-[11px]"
                  >
                    {t('team_regenerate_pwd')}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-1"
                    title={t('copy_link')}
                  >
                    {copiedPwd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={mustChangePassword}
                    onChange={(e) => setMustChangePassword(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500"
                  />
                  <span className="text-[11px] text-slate-300">{t('team_force_pwd_change')}</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-slate-900 rounded-3xl border border-slate-700 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">{t('edit')} — {editingUser.email}</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-3 text-xs">
              <NameFields
                theme="dark"
                profile={editProfile}
                language={language}
                givenName={editGivenName}
                familyName={editFamilyName}
                onGivenNameChange={setEditGivenName}
                onFamilyNameChange={setEditFamilyName}
              />

              <div>
                <label className="block font-semibold text-slate-300 mb-1">{t('phone')}</label>
                <PhoneInput
                  theme="dark"
                  profile={editProfile}
                  value={editPhone}
                  onChange={setEditPhone}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">{t('select_role')}</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="waiter">{t('role_waiter')}</option>
                    <option value="kitchen">{t('role_kitchen')}</option>
                    <option value="courier">{t('role_courier')}</option>
                    <option value="branch_admin">{t('role_branch_admin')}</option>
                    {customRoles.map((cr) => (
                      <option key={cr.id} value={cr.id}>
                        {loc(cr.name)} ({cr.id})
                      </option>
                    ))}
                    <option value="owner">{t('role_owner')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">{t('assigned_branch')}</label>
                  <select
                    value={editBranchId}
                    disabled={isBranchAdmin}
                    onChange={(e) => setEditBranchId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white disabled:opacity-70"
                  >
                    {availableBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {getBranchDisplayName(b)} ({getBranchCityName(b)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-slate-900 rounded-3xl border border-slate-700 max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">{t('team_reset_pwd_btn')}</h3>
            <p className="text-xs text-slate-400">
              <strong className="text-white">{resettingUser.name}</strong> ({resettingUser.email})
            </p>

            {resetError && (
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                {resetError}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">{t('auth_new_password_label')}</label>
                <input
                  type="text"
                  required
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CUSTOM ROLE */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-slate-900 rounded-3xl border border-slate-700 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">{t('team_new_role_btn')}</h3>
              <button onClick={() => setShowCreateRoleModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {roleError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{roleError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCustomRole} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">{t('team_role_id_label')}</label>
                  <input
                    type="text"
                    required
                    value={newRoleId}
                    onChange={(e) => setNewRoleId(e.target.value)}
                    placeholder="sommelier"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{t('team_role_name_label')}</label>
                  <input
                    type="text"
                    required
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Sommelier"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">{t('team_role_desc_label')}</label>
                <input
                  type="text"
                  required
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* Grouped Permission Checkboxes */}
              <div className="space-y-3 pt-2">
                <span className="font-bold text-white block">{t('team_permissions_select_title')}</span>
                <div className="space-y-3">
                  {PERMISSION_GROUPS.map((group) => (
                    <div key={group.groupKey} className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                        {t(group.groupKey)}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.perms.map((p) => {
                          const isChecked = selectedPermissions.includes(p.key);
                          return (
                            <label
                              key={p.key}
                              className={`flex items-start gap-2 p-2 rounded-xl cursor-pointer transition-colors ${
                                isChecked ? 'bg-amber-500/10 text-white' : 'text-slate-400 hover:bg-slate-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(p.key)}
                                className="mt-0.5 rounded border-slate-700 text-amber-500"
                              />
                              <div>
                                <span className="font-medium block text-slate-200">{t(p.labelKey)}</span>
                                <span className="font-mono text-[9px] text-slate-500">{p.key}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRoleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
