import React, { useState } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveView } from './components/layout/Sidebar';
import { DemoAccountsModal } from './components/common/DemoAccountsModal';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardView } from './views/DashboardView';
import { FloorView } from './views/FloorView';
import { ReservationsView } from './views/ReservationsView';
import { MenuView } from './views/MenuView';
import { OrdersQRView } from './views/OrdersQRView';
import { KitchenView } from './views/KitchenView';
import { AnalyticsView } from './views/AnalyticsView';
import { DistributedMonitorView } from './views/DistributedMonitorView';
import { BranchesView } from './views/BranchesView';
import { ReviewsAdminView } from './views/ReviewsAdminView';
import { Table } from './types';
import { Menu } from 'lucide-react';

// Public Pages
import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';
import { HomePage } from './pages/public/HomePage';
import { RestaurantsPage } from './pages/public/RestaurantsPage';
import { RestaurantDetailPage } from './pages/public/RestaurantDetailPage';
import { ReviewsPage } from './pages/public/ReviewsPage';
import { ReservationWizardPage } from './pages/public/ReservationWizardPage';
import { TableQrMenuPage } from './pages/public/TableQrMenuPage';
import { LiveOrderTrackerPage } from './pages/public/LiveOrderTrackerPage';
import { MyReservationsPage } from './pages/public/MyReservationsPage';
import { LoginPage } from './pages/public/LoginPage';

// Public Layout Wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EC]">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
};

// Staff SaaS Portal Layout with Route Protection
const StaffPortal: React.FC = () => {
  const { view } = useParams<{ view: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated } = useApp();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrSelectedTable, setQrSelectedTable] = useState<Table | null>(null);

  // Protected route check: if visitor or only customer, redirect to login with redirect param
  const isStaff = isAuthenticated && ['owner', 'admin', 'waiter', 'kitchen'].includes(currentUser.role);
  if (!isStaff) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const currentView: ActiveView = (view as ActiveView) || 'dashboard';

  const handleSelectView = (newView: ActiveView) => {
    navigate(`/app/${newView}`);
    setMobileMenuOpen(false);
  };

  const handleOpenQRForTable = (table: Table) => {
    setQrSelectedTable(table);
    navigate('/app/orders_qr');
  };

  const handleOpenOrderForTable = (table: Table) => {
    setQrSelectedTable(table);
    navigate('/app/orders_qr');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        onNavigateToMonitor={() => handleSelectView('monitor')}
      />

      {/* Main Body with Sidebar + View Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            currentView={currentView}
            onSelectView={handleSelectView}
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-50 flex">
              <Sidebar
                currentView={currentView}
                onSelectView={handleSelectView}
                onOpenDemoModal={() => {
                  setIsDemoModalOpen(true);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative pb-12">
          {/* Mobile sub-bar to toggle navigation menu */}
          <div className="md:hidden p-3 bg-white border-b border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-800 p-1.5 rounded-lg bg-slate-100"
            >
              <Menu className="w-4 h-4" />
              <span>Menú de Navegación</span>
            </button>
            <span className="text-xs font-bold text-slate-700 capitalize">
              {currentView.replace('_', ' ')}
            </span>
          </div>

          {currentView === 'dashboard' && <DashboardView onNavigate={handleSelectView} />}
          {currentView === 'floor' && (
            <FloorView
              onOpenQR={handleOpenQRForTable}
              onOpenOrderForTable={handleOpenOrderForTable}
            />
          )}
          {currentView === 'reservations' && <ReservationsView />}
          {currentView === 'menu' && <MenuView />}
          {currentView === 'orders_qr' && <OrdersQRView initialTable={qrSelectedTable} />}
          {currentView === 'kitchen' && <KitchenView />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'resenas' && <ReviewsAdminView />}
          {currentView === 'monitor' && <DistributedMonitorView />}
          {currentView === 'branches' && <BranchesView />}
        </main>
      </div>

      {/* Global Modals */}
      <DemoAccountsModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Public Gastronomy Surface */}
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
            path="/pedido/:orderId"
            element={
              <PublicLayout>
                <LiveOrderTrackerPage />
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
          <Route path="/login" element={<LoginPage />} />

          {/* Interactive QR Table Ordering Page */}
          <Route path="/mesa/:branchId/:tableId" element={<TableQrMenuPage />} />

          {/* Staff SaaS Management Portal */}
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/:view" element={<StaffPortal />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer />
      </HashRouter>
    </AppProvider>
  );
}
