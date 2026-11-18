import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Language } from '../../types';
import { getTranslation } from '../../i18n/translations';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'app_name',
  '/restaurantes': 'nav_restaurants',
  '/resenas': 'nav_reviews',
  '/reservar': 'nav_reserve',
  '/carrito': 'cart_title',
  '/checkout': 'checkout_title',
  '/mis-pedidos': 'nav_my_orders',
  '/mis-reservas': 'my_reservations',
  '/mis-datos': 'privacy_my_data_title',
  '/privacidad': 'privacy_policy_title',
  '/ayuda': 'nav_faq',
  '/login': 'nav_login',
  '/registro': 'auth_register_title',
  '/staff': 'staff_portal_title',
  '/staff/app/owner': 'staff_nav_owner_dashboard',
  '/staff/app/branch_admin': 'staff_nav_branch_ops',
  '/staff/app/waiter': 'staff_nav_waiter_floor',
  '/staff/app/kitchen': 'nav_kitchen',
  '/staff/app/courier': 'staff_nav_courier',
  '/staff/app/platform_admin': 'staff_nav_platform_console',
  '/staff/app/equipo': 'staff_nav_team_roles',
  '/staff/app/sistema': 'staff_nav_system',
  '/staff/app/prueba-localizacion': 'staff_nav_loc_test',
  '/staff/app/floor': 'nav_floor',
  '/staff/app/menu': 'nav_menu',
  '/staff/app/reservations': 'nav_reservations',
  '/staff/app/analytics': 'nav_analytics',
  '/staff/app/branches': 'nav_branches',
  '/staff/app/reviews': 'nav_reviews',
  '/staff/app/monitor': 'staff_nav_monitor',
};

const ROUTE_PREFIX_TITLES: Array<[string, string]> = [
  ['/restaurantes/', 'nav_restaurants'],
  ['/sucursal/', 'nav_branches'],
  ['/pedido/', 'nav_my_orders'],
  ['/comprobante/', 'receipt_title'],
  ['/mesa/', 'qr_code_menu'],
];

export function useDocumentMeta(language: Language) {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';

    if (language === 'ja') {
      document.body.classList.add('font-cjk');
    } else {
      document.body.classList.remove('font-cjk');
    }

    const isStaffRoute = location.pathname.startsWith('/staff');
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (isStaffRoute) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else if (robotsMeta) {
      robotsMeta.setAttribute('content', 'index, follow');
    }

    let matchedKey = ROUTE_TITLES[location.pathname];
    if (!matchedKey) {
      const prefixMatch = ROUTE_PREFIX_TITLES.find(([prefix]) =>
        location.pathname.startsWith(prefix)
      );
      matchedKey = prefixMatch ? prefixMatch[1] : 'app_name';
    }

    const pageName = getTranslation(language, matchedKey);
    const appName = getTranslation(language, 'app_name');
    const subtitle = getTranslation(language, 'app_subtitle');

    if (location.pathname === '/') {
      document.title = `${appName} — ${subtitle}`;
    } else {
      document.title = `${pageName} · ${appName}`;
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `${appName}: ${subtitle}`);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', document.title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', `${appName}: ${subtitle}`);
    }
  }, [language, location.pathname]);
}
