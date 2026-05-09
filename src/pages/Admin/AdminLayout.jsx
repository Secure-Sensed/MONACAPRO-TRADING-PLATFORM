import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Wallet, LogOut } from 'lucide-react';
import { supabase, supabaseConfigError } from '../../lib/supabaseClient';
import './AdminLayout.css';

const AdminLayout = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verifyAdminSession = async () => {
      setIsCheckingAuth(true);
      setAuthError('');

      try {
        if (!supabase) {
          throw new Error(supabaseConfigError);
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const user = sessionData.session?.user;
        if (!user) {
          navigate('/admin/login', { replace: true, state: { from: location.pathname } });
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, full_name, email')
          .eq('id', user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          await supabase.auth.signOut();
          navigate('/admin/login', { replace: true, state: { from: location.pathname } });
          return;
        }

        if (isMounted) {
          setAdminUser({
            email: profile.email || user.email,
            name: profile.full_name || profile.email || user.email
          });
        }
      } catch (err) {
        if (isMounted) {
          setAuthError(err.message || 'Unable to verify administrator access.');
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    verifyAdminSession();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate('/admin/login', { replace: true });
  };

  if (isCheckingAuth) {
    return (
      <div className="admin-auth-state">
        <div className="admin-auth-panel">
          <div className="admin-auth-spinner" />
          <p>Verifying administrator access...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="admin-auth-state">
        <div className="admin-auth-panel">
          <h1>Admin Access Unavailable</h1>
          <p>{authError}</p>
          <button onClick={() => navigate('/admin/login', { replace: true })}>Back to Admin Login</button>
        </div>
      </div>
    );
  }

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
          <button className="nav-item logout-btn" onClick={handleSignOut}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title">Admin Control Panel</div>
          <div className="header-profile">
            <div className="avatar">A</div>
            <span>{adminUser?.name || 'Super Admin'}</span>
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
