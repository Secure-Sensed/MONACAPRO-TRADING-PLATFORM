import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Pages
import LandingPage from './pages/LandingPage';
import { CompanyPage, StocksPage, MirrorTradingPage, SoftwarePage, InsightPage } from './pages/Content/Pages';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminLogin from './pages/Auth/AdminLogin';

// Admin Pages
import AdminLayout from './pages/Admin/AdminLayout';
import DashboardHome from './pages/Admin/DashboardHome';
import UserManagement from './pages/Admin/UserManagement';
import AdminTransactions from './pages/Admin/AdminTransactions';
import Settings from './pages/Admin/Settings';

// User Dashboard
import UserLayout from './pages/Dashboard/UserLayout';
import UserOverview from './pages/Dashboard/UserOverview';
import UserDeposit from './pages/Dashboard/UserDeposit';
import UserProfile from './pages/Dashboard/UserProfile';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/mirror-trading" element={<MirrorTradingPage />} />
          <Route path="/software" element={<SoftwarePage />} />
          <Route path="/insight" element={<InsightPage />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<UserOverview />} />
            <Route path="deposit" element={<UserDeposit />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
