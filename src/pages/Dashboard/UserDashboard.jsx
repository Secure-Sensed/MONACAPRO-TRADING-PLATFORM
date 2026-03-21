import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  return (
    <div style={{ padding: '50px', color: '#fff', background: '#060c18', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>User Trading Dashboard</h1>
      <p style={{ color: '#a0a8b1', fontSize: '18px' }}>Welcome! Your balance is: <strong style={{ color: '#1fff45'}}>$10,000.00</strong></p>
      
      <div style={{ marginTop: '40px' }}>
        <p>This is a placeholder for the full User Trading Interface you requested.</p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <button style={{ padding: '10px 20px', background: '#1fff45', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Trade Now</button>
          <button style={{ padding: '10px 20px', background: '#1a2744', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Deposit Funds</button>
        </div>
      </div>
      
      <div style={{ marginTop: '60px' }}>
        <Link to="/admin" style={{ color: '#20a0ff' }}>Go to Admin Panel</Link>
      </div>
    </div>
  );
};

export default UserDashboard;
