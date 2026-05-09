import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*, profile:profiles(full_name, email)')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load Supabase transactions.');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleApprove = async (transactionId) => {
    try {
      const { error: approveError } = await supabase.rpc('approve_transaction', { transaction_id: transactionId });
      if (approveError) throw approveError;
      await fetchTransactions();
    } catch (err) {
      setError(err.message || 'Unable to approve transaction.');
    }
  };

  const handleReject = async (transactionId) => {
    if (!window.confirm('Reject this transaction?')) return;

    try {
      const { error: rejectError } = await supabase.rpc('reject_transaction', { transaction_id: transactionId });
      if (rejectError) throw rejectError;
      await fetchTransactions();
    } catch (err) {
      setError(err.message || 'Unable to reject transaction.');
    }
  };

  return (
    <div className="user-management">
      <div className="header-actions">
        <div>
          <h1 className="page-title">Transaction Approvals</h1>
          <p className="text-muted">Live deposits and withdrawals from Supabase.</p>
        </div>
        <button className="action-btn edit" onClick={fetchTransactions} disabled={isLoading}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Method / Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#a0a8b1' }}>Loading transactions...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#a0a8b1' }}>No transactions to display</td></tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="text-muted">#{String(tx.id).slice(0, 8)}</td>
                  <td className="font-medium">{tx.profile?.email || tx.user_id}</td>
                  <td>{tx.type}</td>
                  <td className="text-green">${parseNumber(tx.amount).toLocaleString()}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#a0a8b1' }}>
                    {tx.method || tx.asset || tx.details?.address || '-'}
                  </td>
                  <td>
                    <span className={`status-badge ${tx.status === 'completed' ? 'active' : tx.status === 'rejected' ? 'banned' : 'pending'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {tx.status === 'pending' ? (
                      <>
                        <button onClick={() => handleApprove(tx.id)} className="action-btn" style={{ background: 'rgba(31, 255, 69, 0.1)', color: '#1fff45' }}>
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button onClick={() => handleReject(tx.id)} className="action-btn" style={{ background: 'rgba(255, 77, 79, 0.1)', color: '#ff4d4f' }}>
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-muted">Processed</span>
                    )}
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

export default AdminTransactions;
