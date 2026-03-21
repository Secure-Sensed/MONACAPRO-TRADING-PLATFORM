import React from 'react';
import { Users, DollarSign, Activity } from 'lucide-react';
import './AdminDashboard.css';

const DashboardHome = () => {
  return (
    <div className="dashboard-home">
      <h1 className="page-title">Platform Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Users</h3>
            <Users size={24} className="stat-icon blue" />
          </div>
          <div className="stat-value">1,248</div>
          <div className="stat-trend positive">+12% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Platform Balance</h3>
            <DollarSign size={24} className="stat-icon green" />
          </div>
          <div className="stat-value">$14.2M</div>
          <div className="stat-trend positive">+5.4% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Active Trades</h3>
            <Activity size={24} className="stat-icon purple" />
          </div>
          <div className="stat-value">342</div>
          <div className="stat-trend negative">-2% from last week</div>
        </div>
      </div>

      <div className="recent-activity-section mt-8">
        <h2 className="section-title">Recent Registrations</h2>
        <div className="activity-card mt-4">
          <p className="text-muted">You can connect this block to the Supabase raw users table to see real-time signups.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
