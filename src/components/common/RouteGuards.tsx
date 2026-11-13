import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { can, Permission } from '../../core/permissions';
import { UserRole } from '../../types';
import { ShieldAlert } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to={`/staff?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (currentUser.role === 'customer') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

interface RequireRoleProps {
  allowedRoles: (UserRole | string)[];
  children: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles, children }) => {
  const { currentUser, t } = useApp();

  if (!currentUser) {
    return <Navigate to="/staff" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="p-8 text-center bg-slate-900 min-h-screen text-slate-100 flex items-center justify-center font-sans">
        <div className="max-w-md p-6 bg-slate-800 rounded-3xl border border-rose-800/80 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">{t('err_forbidden_title')}</h2>
          <p className="text-xs text-slate-300 mb-4">
            {t('err_forbidden_role_msg', { role: currentUser.role })}
          </p>
          <Link
            to="/staff"
            className="inline-block px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
          >
            {t('err_back_to_panel')}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

interface RequirePermissionProps {
  permission: Permission;
  children: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({ permission, children }) => {
  const { currentUser, activeBranchId, t } = useApp();

  if (!currentUser) {
    return <Navigate to="/staff" replace />;
  }

  const branchScope = currentUser.assignedBranchId || currentUser.branchId || activeBranchId;
  const hasPermission = can(currentUser, permission, { branchId: branchScope });

  if (!hasPermission) {
    return (
      <div className="p-8 text-center bg-slate-900 min-h-screen text-slate-100 flex items-center justify-center font-sans">
        <div className="max-w-md p-6 bg-slate-800 rounded-3xl border border-rose-800/80 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">{t('err_forbidden_perm_title')}</h2>
          <p className="text-xs text-slate-300 mb-4">
            {t('err_forbidden_perm_msg', { permission })}
          </p>
          <Link
            to="/staff"
            className="inline-block px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
          >
            {t('err_back_to_panel')}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
