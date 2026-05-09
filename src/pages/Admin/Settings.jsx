import React, { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { supabase, supabaseConfigError } from '../../lib/supabaseClient';

const formatMethod = (method = '') => method.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const Settings = () => {
  const [wallets, setWallets] = useState([]);
  const [method, setMethod] = useState('');
  const [network, setNetwork] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWallets = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!supabase) {
        throw new Error(supabaseConfigError);
      }

      const { data, error: fetchError } = await supabase
        .from('wallet_addresses')
        .select('method, address, updated_at')
        .order('method', { ascending: true });
      if (fetchError) throw fetchError;
      setWallets(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load Supabase wallet settings.');
      setWallets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleAddWallet = async (event) => {
    event.preventDefault();
    const normalizedMethod = method.trim().toLowerCase().replace(/\s+/g, '_');
    if (!normalizedMethod || !address.trim()) return;

    const walletPayload = network.trim()
      ? { network: network.trim(), address: address.trim() }
      : address.trim();

    try {
      if (!supabase) {
        throw new Error(supabaseConfigError);
      }

      const { error: upsertError } = await supabase
        .from('wallet_addresses')
        .upsert({ method: normalizedMethod, address: walletPayload, updated_at: new Date().toISOString() }, { onConflict: 'method' });
      if (upsertError) throw upsertError;

      setMethod('');
      setNetwork('');
      setAddress('');
      await fetchWallets();
    } catch (err) {
      setError(err.message || 'Unable to save wallet.');
    }
  };

  const removeWallet = async (walletMethod) => {
    if (!window.confirm(`Remove ${formatMethod(walletMethod)} from user deposit options?`)) return;

    try {
      if (!supabase) {
        throw new Error(supabaseConfigError);
      }

      const { error: deleteError } = await supabase
        .from('wallet_addresses')
        .delete()
        .eq('method', walletMethod);
      if (deleteError) throw deleteError;
      await fetchWallets();
    } catch (err) {
      setError(err.message || 'Unable to remove wallet.');
    }
  };

  const renderAddress = (wallet) => {
    if (!wallet.address) return '-';
    if (typeof wallet.address === 'string') return wallet.address;
    if (wallet.address.address) return wallet.address.address;
    return JSON.stringify(wallet.address);
  };

  const renderNetwork = (wallet) => {
    if (wallet.address && typeof wallet.address === 'object' && wallet.address.network) return wallet.address.network;
    return formatMethod(wallet.method);
  };

  return (
    <div className="dashboard-home">
      <div className="header-actions">
        <div>
          <h1 className="page-title">Wallet & Payment Settings</h1>
          <p className="text-muted">These Supabase wallet records are shown to users when they deposit funds.</p>
        </div>
        <button className="action-btn edit" onClick={fetchWallets} disabled={isLoading}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="table-container mt-4" style={{ padding: '30px' }}>
        <h2 className="section-title">Global Receiving Addresses</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isLoading ? (
            <p className="text-muted">Loading wallets...</p>
          ) : wallets.length === 0 ? (
            <p className="text-muted">No wallet addresses configured.</p>
          ) : (
            wallets.map((wallet) => (
              <div key={wallet.method} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', background: '#0b1120', padding: '16px', borderRadius: '8px', border: '1px solid #1a2744' }}>
                <div>
                  <strong style={{ color: '#fff', fontSize: '18px' }}>{formatMethod(wallet.method)}</strong>
                  <span className="text-muted"> ({renderNetwork(wallet)})</span>
                  <p style={{ color: '#1fff45', fontFamily: 'monospace', marginTop: '8px', wordBreak: 'break-all' }}>{renderAddress(wallet)}</p>
                </div>
                <button
                  onClick={() => removeWallet(wallet.method)}
                  style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddWallet} style={{ marginTop: '40px', background: '#0b1120', padding: '24px', borderRadius: '8px', border: '1px dashed #334b82' }}>
          <h3 style={{ color: '#fff', marginBottom: '16px' }}>Add / Update Wallet</h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <input type="text" placeholder="Method (e.g. bitcoin)" value={method} onChange={(e) => setMethod(e.target.value)} required style={{ flex: 1, padding: '10px', background: '#111a2e', border: '1px solid #1a2744', color: '#fff', borderRadius: '4px' }} />
            <input type="text" placeholder="Network (e.g. TRC20)" value={network} onChange={(e) => setNetwork(e.target.value)} style={{ flex: 1, padding: '10px', background: '#111a2e', border: '1px solid #1a2744', color: '#fff', borderRadius: '4px' }} />
          </div>
          <input type="text" placeholder="Wallet Address" value={address} onChange={(e) => setAddress(e.target.value)} required style={{ width: '100%', padding: '10px', background: '#111a2e', border: '1px solid #1a2744', color: '#fff', borderRadius: '4px', marginBottom: '16px' }} />

          <button type="submit" className="btn btn-green" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Save Wallet
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
