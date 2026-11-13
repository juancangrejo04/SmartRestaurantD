import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Language } from '../../types';
import { getTranslation } from '../../i18n/translations';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'app_name',
  '/restaurantes': 'nav_restaurants',
  '/reservar': 'nav_book_table',
  '/carrito': 'cart_title',
  '/checkout': 'checkout_title',
  '/mis-pedidos': 'nav_my_orders',
  '/mis-reservas': 'nav_my_reservations',
  '/mis-datos': 'privacy_my_data_title',
  '/privacidad': 'privacy_policy_title',
  '/resenas': 'nav_reviews',
  '/ayuda': 'nav_faq',
  '/login': 'nav_login',
  '/registro': 'auth_register_title',
  '/staff': 'staff_portal_title',
  '/staff/app/dashboard': 'nav_dashboard',
  '/staff/app/menu': 'nav_menu',
  '/staff/app/reservas': 'nav_reservations',
  '/staff/app/mesas': 'nav_floor',
  '/staff/app/pedidos-qr': 'nav_orders',
  '/staff/app/cocina': 'nav_kitchen',
  '/staff/app/repartidor': 'courier_panel_title',
  '/staff/app/equipo': 'team_title',
  '/staff/app/analitica': 'nav_analytics',
  '/staff/app/sedes': 'nav_branches',
  '/staff/app/plataforma': 'platform_admin_title',
  '/staff/app/sistema': 'system_config_title',
  '/staff/app/monitor': 'nav_monitor',
};

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

    const matchedKey = ROUTE_TITLES[location.pathname] || 'app_name';
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
  }, [language, location.pathname]);
}
