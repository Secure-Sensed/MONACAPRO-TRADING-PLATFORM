import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Wallet, LogOut } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="logo-accent">M</span> Admin Pro
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/transactions" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Wallet size={20} /> Deposits & Withdrawals
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Users size={20} /> User Management
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Settings size={20} /> System Settings
          </NavLink>
        </nav>

        <div className="admin-bottom">
          <button className="nav-item logout-btn">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title">Admin Control Panel</div>
          <div className="header-profile">
            <div className="avatar">A</div>
            <span>Super Admin</span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
