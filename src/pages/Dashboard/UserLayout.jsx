import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowRightLeft, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import './UserLayout.css';

const UserLayout = () => {
  const { currentUser } = useAppContext();

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="logo-accent">MCT</span> Dashboard
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <LayoutDashboard size={20} /> Overview
          </NavLink>
          <NavLink to="/dashboard/deposit" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Wallet size={20} /> Deposit Funds
          </NavLink>
          <NavLink to="/dashboard/trade" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <ArrowRightLeft size={20} /> Trade Terminal
          </NavLink>
        </nav>

        <div className="admin-bottom">
          <NavLink to="/" className="nav-item logout-btn">
            <LogOut size={20} /> Sign Out
          </NavLink>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title">My Portfolio</div>
          <div className="header-profile">
            <div className="balance-pill">
              Balance: <span className="text-green">${currentUser?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="avatar">U</div>
            <span>{currentUser?.name || 'Trader'}</span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
