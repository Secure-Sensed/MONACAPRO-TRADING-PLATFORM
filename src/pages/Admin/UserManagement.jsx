import React, { useState, useEffect } from 'react';
import { Edit, Ban, Search } from 'lucide-react';
import './UserManagement.css';
import { supabase } from '../../lib/supabaseClient';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: '1', email: 'john@example.com', balance: 4500.50, status: 'Active', created_at: '2024-03-21' },
    { id: '2', email: 'sarah@trading.com', balance: 125000.00, status: 'Active', created_at: '2024-03-19' },
    { id: '3', email: 'banned@scam.com', balance: 0.00, status: 'Banned', created_at: '2024-02-10' },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // In a real application, fetch from Supabase:
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const { data, error } = await supabase.from('users').select('*');
  //     if (data) setUsers(data);
  //   };
  //   fetchUsers();
  // }, []);

  return (
    <div className="user-management">
      <div className="header-actions">
        <h1 className="page-title">User Management</h1>
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search by email..." />
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Balance (USD)</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="text-muted">#{user.id}</td>
                <td className="font-medium">{user.email}</td>
                <td className="text-green">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td className="text-muted">{user.created_at}</td>
                <td className="actions-cell">
                  <button className="action-btn edit" title="Edit Balance">
                    <Edit size={16} /> Edit
                  </button>
                  <button className="action-btn ban" title="Ban User">
                    <Ban size={16} /> Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
