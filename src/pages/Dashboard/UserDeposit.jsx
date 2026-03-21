import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Copy, CheckCircle } from 'lucide-react';
import './UserDeposit.css';

const UserDeposit = () => {
  const { currentUser, adminWallets, addTransaction } = useAppContext();
  const [selectedCurrency, setSelectedCurrency] = useState(adminWallets[0] || null);
  const [amount, setAmount] = useState('');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !hash || !selectedCurrency) return;

    addTransaction({
      userId: currentUser.id,
      userEmail: currentUser.email,
      type: 'Deposit',
      amount: parseFloat(amount),
      currency: selectedCurrency.currency,
      hash: hash
    });
    setSuccess(true);
    setAmount('');
    setHash('');
    setTimeout(() => setSuccess(false), 5000);
  };

  if (!selectedCurrency) return <div style={{color:'#fff'}}>Loading wallets...</div>;

  return (
    <div className="deposit-page">
      <h1 className="page-title">Deposit Crypto Funds</h1>
      <p className="subtitle">Select a cryptocurrency and send funds to the generated wallet address.</p>

      <div className="deposit-grid">
        <div className="deposit-card">
          <h3>1. Select Currency</h3>
          <div className="currency-selector">
            {adminWallets.map(wallet => (
              <button 
                key={wallet.id}
                className={`currency-btn ${selectedCurrency.id === wallet.id ? 'active' : ''}`}
                onClick={() => setSelectedCurrency(wallet)}
              >
                {wallet.currency} ({wallet.network})
              </button>
            ))}
          </div>

          <div className="wallet-details mt-8">
            <h3>2. Send Funds</h3>
            <p className="text-muted">Send <strong>only {selectedCurrency.currency}</strong> to this address. Any other currency will be permanently lost.</p>
            
            <div className="address-box">
              <span className="address-text">{selectedCurrency.address}</span>
              <button className="copy-btn" onClick={() => handleCopy(selectedCurrency.address)}>
                {copied ? <CheckCircle size={18} className="text-green" /> : <Copy size={18} />}
              </button>
            </div>
            {/* Mock QR CODE */}
            <div className="qr-container">
               <div className="mock-qr">
                  {selectedCurrency.currency} QR CODE
               </div>
            </div>
          </div>
        </div>

        <div className="deposit-card">
          <h3>3. Submit Transaction Details</h3>
          <p className="text-muted">Once you have sent the funds, please provide the exact amount and the Transaction Hash (TxID) below so we can verify your deposit rapidly.</p>

          {success && (
            <div className="success-banner">
              <CheckCircle size={20} />
              Your deposit request has been submitted and is awaiting administrator approval!
            </div>
          )}

          <form className="deposit-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Amount Sent (USD Equivalent)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="10"
              />
            </div>
            
            <div className="input-group">
              <label>Transaction Hash (TxID)</label>
              <input 
                type="text" 
                placeholder="e.g. 0xabc123..." 
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-green w-100 mt-4">Submit for Verification</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDeposit;
