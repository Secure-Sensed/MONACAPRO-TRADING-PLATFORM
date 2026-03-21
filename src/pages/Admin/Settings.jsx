import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus, Trash2 } from 'lucide-react';

const Settings = () => {
  const { adminWallets, setAdminWallets } = useAppContext();
  const [newCurrency, setNewCurrency] = useState('');
  const [newNetwork, setNewNetwork] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleAddWallet = (e) => {
    e.preventDefault();
    if(!newCurrency || !newAddress) return;
    setAdminWallets([...adminWallets, { id: Math.random(), currency: newCurrency.toUpperCase(), network: newNetwork, address: newAddress }]);
    setNewCurrency(''); setNewNetwork(''); setNewAddress('');
  };

  const removeWallet = (id) => {
    setAdminWallets(adminWallets.filter(w => w.id !== id));
  };

  return (
    <div className="dashboard-home">
      <h1 className="page-title">Wallet & Payment Settings</h1>
      
      <div className="table-container mt-4" style={{padding: '30px'}}>
        <h2 className="section-title">Global Receiving Addresses</h2>
        <p className="text-muted" style={{marginBottom: '24px'}}>These are the crypto wallets shown to users when they attempt to deposit funds.</p>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {adminWallets.map(w => (
            <div key={w.id} style={{display: 'flex', justifyContent: 'space-between', background: '#0b1120', padding: '16px', borderRadius: '8px', border: '1px solid #1a2744'}}>
              <div>
                <strong style={{color: '#fff', fontSize: '18px'}}>{w.currency}</strong> <span className="text-muted">({w.network})</span>
                <p style={{color: '#1fff45', fontFamily: 'monospace', marginTop: '8px'}}>{w.address}</p>
              </div>
              <button 
                onClick={() => removeWallet(w.id)}
                style={{background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer'}}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddWallet} style={{marginTop: '40px', background: '#0b1120', padding: '24px', borderRadius: '8px', border: '1px dashed #334b82'}}>
          <h3 style={{color: '#fff', marginBottom: '16px'}}>Add New Wallet</h3>
          <div style={{display: 'flex', gap: '16px', marginBottom: '16px'}}>
            <input type="text" placeholder="Currency (e.g. BTC)" value={newCurrency} onChange={e => setNewCurrency(e.target.value)} required style={{flex: 1, padding: '10px', background: '#111a2e', border: '1px solid #1a2744', color: '#fff', borderRadius: '4px'}}/>
            <input type="text" placeholder="Network (e.g. BEP20)" value={newNetwork} onChange={e => setNewNetwork(e.target.value)} required style={{flex: 1, padding: '10px', background: '#111a2e', border: '1px solid #1a2744', color: '#fff', borderRadius: '4px'}}/>
          </div>
          <input type="text" placeholder="Wallet Address" value={newAddress} onChange={e => setNewAddress(e.target.value)} required style={{width: '100%', padding: '10px', background: '#111a2e', border: '1px solid #1a2744', color: '#fff', borderRadius: '4px', marginBottom: '16px'}}/>
          
          <button type="submit" className="btn btn-green" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Plus size={16}/> Add Wallet</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
