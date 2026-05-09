import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ban, Edit, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import './UserManagement.css';
import { supabase } from '../../lib/supabaseClient';

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
};

const displayStatus = (status) => (status === 'inactive' ? 'Banned' : 'Active');

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const syncResult = await supabase.rpc('sync_auth_users_to_profiles');
      if (syncResult.error) {
        console.warn('Profile sync skipped:', syncResult.error.message || syncResult.error);
      }

      const { data, error: listError } = await supabase.rpc('admin_list_users');
      if (listError) {
        throw listError;
      }

      setUsers((data || []).map((user) => ({
        ...user,
        id: user.user_id,
        balance: parseNumber(user.balance),
        status: user.status || 'active',
        profile_exists: user.profile_exists !== false
      })));
    } catch (err) {
      setError(err.message || 'Unable to load Supabase users.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => (
      [user.email, user.full_name, user.user_id, user.phone, user.country]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    ));
  }, [search, users]);

  const updateUserProfile = async (user, patch) => {
    const payload = {
      id: user.user_id,
      email: user.email || '',
      full_name: user.full_name || '',
      role: user.role || 'user',
      status: user.status || 'active',
      balance: parseNumber(user.balance),
      kyc_status: user.kyc_status || 'pending',
      ...patch
    };

    const query = user.profile_exists === false
      ? supabase.from('profiles').upsert(payload, { onConflict: 'id' })
      : supabase.from('profiles').update(patch).eq('id', user.user_id);

    const { error: updateError } = await query;
    if (updateError) throw updateError;
    await fetchUsers();
  };

  const handleEdit = async (user) => {
    const nextBalance = window.prompt(`Set balance for ${user.email}`, String(user.balance || 0));
    if (nextBalance === null) return;

    const parsedBalance = Number(nextBalance);
    if (!Number.isFinite(parsedBalance) || parsedBalance < 0) {
      setError('Enter a valid balance.');
      return;
    }

    try {
      await updateUserProfile(user, { balance: parsedBalance });
    } catch (err) {
      setError(err.message || 'Unable to update user balance.');
    }
  };

  const handleBanToggle = async (user) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = nextStatus === 'inactive' ? 'ban' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${user.email}?`)) return;

    try {
      await updateUserProfile(user, { status: nextStatus });
    } catch (err) {
      setError(err.message || 'Unable to update user status.');
    }
  };

  return (
    <div className="user-management">
      <div className="header-actions">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="text-muted">Live Supabase Auth users with editable profile, balance, and access status.</p>
        </div>
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <button className="action-btn edit" onClick={fetchUsers} disabled={isLoading}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div className="admin-error">
          <ShieldCheck size={18} />
          {error}
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Balance (USD)</th>
              <th>Status</th>
              <th>KYC</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#a0a8b1' }}>Loading Supabase users...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#a0a8b1' }}>No Supabase users found.</td></tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user.user_id}>
                  <td className="text-muted">#{index + 1}</td>
                  <td className="font-medium">{user.email || '-'}</td>
                  <td>{user.full_name || '-'}</td>
                  <td className="text-green">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`status-badge ${displayStatus(user.status).toLowerCase()}`}>
                      {displayStatus(user.status)}
                    </span>
                  </td>
                  <td className="text-muted">{user.kyc_status || 'pending'}</td>
                  <td className="text-muted">{formatDate(user.created_at || user.auth_created_at)}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" title="Edit Balance" onClick={() => handleEdit(user)}>
                      <Edit size={16} /> Edit
                    </button>
                    <button className="action-btn ban" title="Ban User" onClick={() => handleBanToggle(user)}>
                      <Ban size={16} /> {user.status === 'active' ? 'Ban' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
