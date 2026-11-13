import React from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';
import { RequireAuth, RequireRole, RequirePermission } from './components/common/RouteGuards';
import { StaffLayout } from './components/layout/StaffLayout';

// Public Pages
import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';
import { HomePage } from './pages/public/HomePage';
import { RestaurantsPage } from './pages/public/RestaurantsPage';
import { RestaurantDetailPage } from './pages/public/RestaurantDetailPage';
import { BranchDetailPage } from './pages/public/BranchDetailPage';
import { CartPage } from './pages/public/CartPage';
import { ReviewsPage } from './pages/public/ReviewsPage';
import { ReservationWizardPage } from './pages/public/ReservationWizardPage';
import { TableQrMenuPage } from './pages/public/TableQrMenuPage';
import { CheckoutPage } from './pages/public/CheckoutPage';
import { LiveOrderTrackerPage } from './pages/public/LiveOrderTrackerPage';
import { LegalReceiptPage } from './pages/public/LegalReceiptPage';
import { MyOrdersPage } from './pages/public/MyOrdersPage';
import { MyReservationsPage } from './pages/public/MyReservationsPage';
import { MyDataPrivacyPage } from './pages/public/MyDataPrivacyPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { HelpPage } from './pages/public/HelpPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { LoginPage } from './pages/public/LoginPage';
import { CustomerRegisterPage } from './pages/public/CustomerRegisterPage';

// Staff Private Pages & Panels
import { StaffLoginPage } from './pages/staff/StaffLoginPage';
import { OwnerDashboardView } from './views/staff/OwnerDashboardView';
import { BranchAdminDashboardView } from './views/staff/BranchAdminDashboardView';
import { WaiterDashboardView } from './views/staff/WaiterDashboardView';
import { KitchenDashboardView } from './views/staff/KitchenDashboardView';
import { CourierPanelView } from './views/staff/CourierPanelView';
import { PlatformAdminView } from './views/staff/PlatformAdminView';
import { TeamManagementView } from './views/staff/TeamManagementView';
import { PlatformSystemConsoleView } from './views/staff/PlatformSystemConsoleView';
import { LocalizationTestView } from './views/staff/LocalizationTestView';

// Reused Existing Staff Views
import { FloorView } from './views/FloorView';
import { MenuView } from './views/MenuView';
import { ReservationsView } from './views/ReservationsView';
import { AnalyticsView } from './views/AnalyticsView';
import { BranchesView } from './views/BranchesView';
import { ReviewsAdminView } from './views/ReviewsAdminView';
import { DistributedMonitorView } from './views/DistributedMonitorView';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EC]">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* =========================================
              PUBLIC CUSTOMER FACING ROUTES
              ========================================= */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/restaurantes"
            element={
              <PublicLayout>
                <RestaurantsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/restaurantes/:restaurantId"
            element={
              <PublicLayout>
                <RestaurantDetailPage />
              </PublicLayout>
            }
          />
          <Route
            path="/sucursal/:branchId"
            element={
              <PublicLayout>
                <BranchDetailPage />
              </PublicLayout>
            }
          />
          <Route
            path="/carrito"
            element={
              <PublicLayout>
                <CartPage />
              </PublicLayout>
            }
          />
          <Route
            path="/resenas"
            element={
              <PublicLayout>
                <ReviewsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/reservar"
            element={
              <PublicLayout>
                <ReservationWizardPage />
              </PublicLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <PublicLayout>
                <CheckoutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/pedido/:orderId"
            element={
              <PublicLayout>
                <LiveOrderTrackerPage />
              </PublicLayout>
            }
          />
          <Route
            path="/comprobante/:orderId"
            element={
              <PublicLayout>
                <LegalReceiptPage />
              </PublicLayout>
            }
          />
          <Route
            path="/mis-pedidos"
            element={
              <PublicLayout>
                <MyOrdersPage />
              </PublicLayout>
            }
          />
          <Route
            path="/mis-reservas"
            element={
              <PublicLayout>
                <MyReservationsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/mis-datos"
            element={
              <PublicLayout>
                <MyDataPrivacyPage />
              </PublicLayout>
            }
          />
          <Route
            path="/privacidad"
            element={
              <PublicLayout>
                <PrivacyPolicyPage />
              </PublicLayout>
            }
          />
          <Route
            path="/ayuda"
            element={
              <PublicLayout>
                <HelpPage />
              </PublicLayout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<CustomerRegisterPage />} />

          {/* Interactive QR Table Ordering Page */}
          <Route path="/mesa/:branchId/:tableId" element={<TableQrMenuPage />} />

          {/* =========================================
              HIDDEN PRIVATE STAFF PORTAL
              ========================================= */}
          <Route path="/staff" element={<StaffLoginPage />} />

          <Route
            path="/staff/app/owner"
            element={
              <RequireAuth>
                <RequireRole allowedRoles={['owner', 'platform_admin']}>
                  <StaffLayout>
                    <OwnerDashboardView />
                  </StaffLayout>
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/branch_admin"
            element={
              <RequireAuth>
                <RequireRole allowedRoles={['branch_admin', 'owner', 'platform_admin']}>
                  <StaffLayout>
                    <BranchAdminDashboardView />
                  </StaffLayout>
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/waiter"
            element={
              <RequireAuth>
                <RequireRole allowedRoles={['waiter', 'cashier', 'branch_admin', 'owner', 'platform_admin']}>
                  <StaffLayout>
                    <WaiterDashboardView />
                  </StaffLayout>
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/kitchen"
            element={
              <RequireAuth>
                <RequireRole allowedRoles={['kitchen', 'branch_admin', 'owner', 'platform_admin']}>
                  <StaffLayout>
                    <KitchenDashboardView />
                  </StaffLayout>
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/courier"
            element={
              <RequireAuth>
                <RequireRole allowedRoles={['courier', 'platform_admin']}>
                  <StaffLayout>
                    <CourierPanelView />
                  </StaffLayout>
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/platform_admin"
            element={
              <RequireAuth>
                <RequirePermission permission="global.console">
                  <StaffLayout>
                    <PlatformAdminView />
                  </StaffLayout>
                </RequirePermission>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/equipo"
            element={
              <RequireAuth>
                <RequirePermission permission="team.manage">
                  <StaffLayout>
                    <TeamManagementView />
                  </StaffLayout>
                </RequirePermission>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/sistema"
            element={
              <RequireAuth>
                <RequirePermission permission="regions.edit">
                  <StaffLayout>
                    <PlatformSystemConsoleView />
                  </StaffLayout>
                </RequirePermission>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/prueba-localizacion"
            element={
              <RequireAuth>
                <RequirePermission permission="regions.edit">
                  <StaffLayout>
                    <LocalizationTestView />
                  </StaffLayout>
                </RequirePermission>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/floor"
            element={
              <RequireAuth>
                <RequireRole allowedRoles={['waiter', 'cashier', 'branch_admin', 'owner', 'platform_admin']}>
                  <StaffLayout>
                    <FloorView />
                  </StaffLayout>
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/menu"
            element={
              <RequireAuth>
                <RequirePermission permission="menu.edit">
                  <StaffLayout>
                    <MenuView />
                  </StaffLayout>
                </RequirePermission>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/reservations"
            element={
              <RequireAuth>
                <RequirePermission permission="reservations.manage">
                  <StaffLayout>
                    <ReservationsView />
                  </StaffLayout>
                </RequirePermission>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/analytics"
            element={
              <RequireAuth>
                <RequirePermission permission="analytics.view">
                  <StaffLayout>
                    <AnalyticsView />
                  </StaffLayout>
                </RequirePermission>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/branches"
            element={
              <RequireAuth>
                <RequireRole allowedRoles={['owner', 'platform_admin']}>
                  <StaffLayout>
                    <BranchesView />
                  </StaffLayout>
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/reviews"
            element={
              <RequireAuth>
                <RequirePermission permission="reviews.moderate">
                  <StaffLayout>
                    <ReviewsAdminView />
                  </StaffLayout>
                </RequirePermission>
              </RequireAuth>
            }
          />
          <Route
            path="/staff/app/monitor"
            element={
              <RequireAuth>
                <RequirePermission permission="monitor.view">
                  <StaffLayout>
                    <DistributedMonitorView />
                  </StaffLayout>
                </RequirePermission>
              </RequireAuth>
            }
          />

          {/* Legacy /app redirect */}
          <Route path="/app/*" element={<Navigate to="/staff" replace />} />

          {/* Catch-all localized 404 */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <NotFoundPage />
              </PublicLayout>
            }
          />
        </Routes>

        <ToastContainer />
      </HashRouter>
    </AppProvider>
  );
}
