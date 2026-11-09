import React, { useState } from 'react';
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
import { Table } from './types';
import { Menu, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ActiveView>('dashboard');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrSelectedTable, setQrSelectedTable] = useState<Table | null>(null);

  const handleOpenQRForTable = (table: Table) => {
    setQrSelectedTable(table);
    setCurrentView('orders_qr');
  };

  const handleOpenOrderForTable = (table: Table) => {
    setQrSelectedTable(table);
    setCurrentView('orders_qr');
  };

  const handleSelectView = (view: ActiveView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        onNavigateToMonitor={() => setCurrentView('monitor')}
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

          {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} />}
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
          {currentView === 'monitor' && <DistributedMonitorView />}
          {currentView === 'branches' && <BranchesView />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <DemoAccountsModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
