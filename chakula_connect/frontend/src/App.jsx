import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HeatMap from './components/HeatMap';
import DashboardStats from './components/DashboardStats';
import WalletModal from './components/WalletModal';
import Logistics from './pages/Logistics';
import FarmerEntry from './pages/FarmerEntry';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LanguageToggle from './components/LanguageToggle';
import { LogOut, User, ShoppingBag } from 'lucide-react';
import Marketplace from './pages/Marketplace';

function Dashboard() {
  const { t } = useLanguage();
  return (
    <div className="max-w-7xl mx-auto">
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-white mb-4">{t.heatMap.title}</h2>
          <HeatMap />
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-brand-dark p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold gradient-text tracking-tighter">{t.appTitle}</h1>
            <p className="text-gray-400 mt-1">{t.appSubtitle}</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <LanguageToggle />

            {user ? (
              <>
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="px-6 py-2 rounded-full bg-brand-green/20 text-brand-green border border-brand-green hover:bg-brand-green hover:text-white transition-colors font-semibold"
                >
                  {t.connectWallet}
                </button>
                <Link to="/entry" className="px-6 py-2 rounded-full bg-brand-accent/20 text-brand-accent border border-brand-accent hover:bg-brand-accent hover:text-brand-dark transition-colors font-semibold">
                  {t.addFarmer}
                </Link>
                <Link to="/logistics" className="px-6 py-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 font-semibold">
                  {t.logisticsPanel}
                </Link>
                <Link to="/marketplace" className="px-6 py-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 font-semibold flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Market
                </Link>
                <button onClick={logout} className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-accent text-brand-dark font-bold hover:opacity-90 transition-opacity">
                <User className="w-4 h-4" /> Login
              </Link>
            )}
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logistics" element={
            <PrivateRoute>
              <Logistics />
            </PrivateRoute>
          } />
          <Route path="/entry" element={
            <PrivateRoute>
              <FarmerEntry />
            </PrivateRoute>
          } />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>

        {/* Wallet Modal */}
        <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
