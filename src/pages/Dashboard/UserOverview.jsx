import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Wallet, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const UserOverview = () => {
  const { currentUser, transactions, positions } = useAppContext();

  const totalMarginUsed = positions.reduce((acc, pos) => acc + pos.margin, 0);
  const totalPnL = positions.reduce((acc, pos) => acc + pos.pnl, 0);
  const activeEquity = currentUser.balance + totalPnL;
  const marginLevel = totalMarginUsed === 0 ? "100" : ((activeEquity / totalMarginUsed) * 100).toFixed(2);
  
  const userTx = transactions.filter(t => t.userId === currentUser.id);

  return (
    <div className="dashboard-home">
      <h1 className="page-title">Welcome back, {currentUser.name}!</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Available Balance</h3>
            <Wallet size={24} className="stat-icon green" />
          </div>
          <div className="stat-value">${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Active Equity</h3>
            <Activity size={24} className="stat-icon blue" />
          </div>
          <p className="stat-value">${activeEquity.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          <span className="stat-change positive">+${totalPnL.toFixed(2)} (Open PnL)</span>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <h3>Margin Level</h3>
            <Activity size={24} className="stat-icon purple" /> {/* Assuming a different icon or color for Margin Level */}
          </div>
          <p className="stat-value">{marginLevel}%</p>
          <span className="stat-change text-muted">Used Margin: ${totalMarginUsed.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
      </div>

      <div className="recent-activity-section mt-8">
        <h2 className="section-title">Recent Transactions</h2>
        <div className="table-container mt-4">
          {userTx.length === 0 ? (
            <div style={{padding: '40px', textAlign: 'center', color: '#a0a8b1'}}>No recent transactions found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {userTx.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        {tx.type === 'Deposit' ? <ArrowDownRight size={16} className="text-green"/> : <ArrowUpRight size={16} style={{color:'#ff4d4f'}}/>}
                        {tx.type}
                      </div>
                    </td>
                    <td className="font-medium">${tx.amount.toLocaleString()}</td>
                    <td className="text-muted">{tx.currency}</td>
                    <td><span className={`status-badge ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                    <td className="text-muted">{new Date(tx.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
