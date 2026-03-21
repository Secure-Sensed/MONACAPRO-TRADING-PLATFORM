import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminTransactions = () => {
  const { transactions, approveTransaction, rejectTransaction } = useAppContext();

  return (
    <div className="user-management">
      <div className="header-actions">
        <h1 className="page-title">Transaction Approvals</h1>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Gateway / Hash</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="text-muted">#{Math.floor(tx.id * 10000)}</td>
                <td className="font-medium">{tx.userEmail}</td>
                <td>{tx.type}</td>
                <td className="text-green">${tx.amount.toLocaleString()} <span className="text-muted" style={{fontSize:'12px'}}>({tx.currency})</span></td>
                <td style={{fontFamily: 'monospace', fontSize: '12px', color: '#a0a8b1'}}>{tx.hash}</td>
                <td>
                  <span className={`status-badge ${tx.status.toLowerCase()}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="actions-cell">
                  {tx.status === 'Pending' ? (
                    <>
                      <button onClick={() => approveTransaction(tx.id)} className="action-btn" style={{background: 'rgba(31, 255, 69, 0.1)', color: '#1fff45'}}>
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button onClick={() => rejectTransaction(tx.id)} className="action-btn" style={{background: 'rgba(255, 77, 79, 0.1)', color: '#ff4d4f'}}>
                        <XCircle size={16} /> Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-muted">No actions available</span>
                  )}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan="7" style={{textAlign:'center', padding:'40px', color:'#a0a8b1'}}>No transactions to display</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactions;
