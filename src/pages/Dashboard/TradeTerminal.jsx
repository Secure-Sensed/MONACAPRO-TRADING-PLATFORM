import React, { useState } from 'react';
import TradingChart from '../../components/Charting/TradingChart';
import { useAppContext } from '../../context/AppContext';
import { Bitcoin, Activity, TrendingUp, TrendingDown, Clock, Search, Briefcase } from 'lucide-react';
import './TradeTerminal.css';

const ASSETS = [
  { id: 'BINANCE:BTCUSDT', name: 'Bitcoin', symbol: 'BTC/USD', icon: <Bitcoin size={18} color="#f7931a"/>, price: '65,240.50' },
  { id: 'BINANCE:ETHUSDT', name: 'Ethereum', symbol: 'ETH/USD', icon: <Activity size={18} color="#627eea"/>, price: '3,540.20' },
  { id: 'OANDA:XAU_USD', name: 'Gold', symbol: 'XAU/USD', icon: <Briefcase size={18} color="#ffd700"/>, price: '2,340.80' },
];

const TradeTerminal = () => {
  const { currentUser, updateUserBalance } = useAppContext();
  const [activeAsset, setActiveAsset] = useState(ASSETS[0]);
  const [lotSize, setLotSize] = useState(0.1);
  const [leverage, setLeverage] = useState(100);
  const [positions, setPositions] = useState([]);

  const handleExecuteOrder = (type) => {
    // Determine margin requirement. Roughly: (Price * Lot * 100,000) / Leverage -> Fake simplified formula
    const requiredMargin = ( parseFloat(activeAsset.price.replace(',','')) * lotSize * 100 ) / leverage;
    
    if (requiredMargin > currentUser.balance) {
      alert("Insufficient Balance to open this position.");
      return;
    }

    // Execute Trade
    const newPosition = {
      id: Math.random().toString(),
      symbol: activeAsset.symbol,
      type: type,
      lot: lotSize,
      openPrice: activeAsset.price,
      leverage: leverage,
      pnl: 0.00,
      margin: requiredMargin,
      time: new Date().toLocaleTimeString()
    };

    setPositions([newPosition, ...positions]);
    // Deduct margin from active balance
    updateUserBalance(currentUser.id, -requiredMargin);
  };

  const closePosition = (posId, margin) => {
    setPositions(positions.filter(p => p.id !== posId));
    // Refund margin + PnL to balance
    updateUserBalance(currentUser.id, margin);
  };

  return (
    <div className="trade-terminal">
      {/* LEFT PANEL: INSTRUMENTS */}
      <aside className="assets-panel">
        <div className="panel-header">
          <h3>Markets</h3>
          <div className="search-box">
             <Search size={14} color="#a0a8b1"/>
             <input type="text" placeholder="Search instruments..." />
          </div>
        </div>
        <div className="asset-list">
          {ASSETS.map(asset => (
             <div 
               key={asset.id} 
               className={`asset-row ${activeAsset.id === asset.id ? 'active' : ''}`}
               onClick={() => setActiveAsset(asset)}
             >
                <div className="asset-icon">{asset.icon}</div>
                <div className="asset-info">
                  <span className="asset-ticker">{asset.symbol}</span>
                  <span className="asset-name">{asset.name}</span>
                </div>
                <div className="asset-price">{asset.price}</div>
             </div>
          ))}
        </div>
      </aside>

      {/* CENTER PANEL: CHART */}
      <main className="chart-panel">
        <div className="chart-header">
           <div className="active-chart-title">
             {activeAsset.icon}
             <h2>{activeAsset.symbol}</h2>
           </div>
           <div className="chart-controls">
             <button>M1</button>
             <button>M5</button>
             <button className="active">H1</button>
             <button>D1</button>
           </div>
        </div>
        <div className="chart-container-wrapper">
           <TradingChart symbol={activeAsset.id} />
        </div>
        
        {/* BOTTOM PANEL: POSITIONS */}
        <div className="positions-panel">
          <div className="panel-header">
            <h3><Clock size={16} /> Open Positions ({positions.length})</h3>
          </div>
          <div className="positions-table-wrapper">
            <table className="terminal-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Type</th>
                  <th>Volume</th>
                  <th>Open Price</th>
                  <th>Current PnL</th>
                  <th>Margin</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => (
                  <tr key={pos.id}>
                    <td className="font-medium" style={{color: '#fff'}}>{pos.symbol}</td>
                    <td className={pos.type === 'BUY' ? 'text-green' : 'text-danger'}>{pos.type}</td>
                    <td>{pos.lot}</td>
                    <td>{pos.openPrice}</td>
                    <td className={pos.pnl >= 0 ? 'text-green' : 'text-danger'}>${pos.pnl.toFixed(2)}</td>
                    <td>${pos.margin.toFixed(2)}</td>
                    <td>
                      <button className="btn-close" onClick={() => closePosition(pos.id, pos.margin)}>Close</button>
                    </td>
                  </tr>
                ))}
                {positions.length === 0 && (
                  <tr><td colSpan="7" className="text-muted text-center" style={{padding: '20px'}}>No open positions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* RIGHT PANEL: EXECUTION */}
      <aside className="execution-panel">
         <div className="panel-header">
            <h3>New Order</h3>
         </div>
         <div className="execution-form">
            <div className="pair-display text-center">
              <h1>{activeAsset.symbol}</h1>
              <p className="text-muted">{activeAsset.name}</p>
            </div>

            <div className="input-group dark-input-group mt-4">
               <label>Volume (Lots)</label>
               <div className="stepper-input">
                 <button onClick={() => setLotSize(Math.max(0.01, lotSize - 0.01))}>-</button>
                 <input type="number" step="0.01" value={lotSize} onChange={e => setLotSize(parseFloat(e.target.value))} />
                 <button onClick={() => setLotSize(lotSize + 0.01)}>+</button>
               </div>
            </div>

            <div className="input-group dark-input-group mt-4">
               <label>Leverage (1:{leverage})</label>
               <input type="range" min="1" max="2000" value={leverage} onChange={e => setLeverage(parseInt(e.target.value))} className="slider" />
            </div>

            <div className="margin-calc mt-4">
               <span>Required Margin:</span>
               <span className="text-white font-medium">${((parseFloat(activeAsset.price.replace(',','')) * lotSize * 100) / leverage).toFixed(2)}</span>
            </div>

            <div className="execution-buttons mt-6">
               <button className="btn-sell" onClick={() => handleExecuteOrder('SELL')}>
                 <TrendingDown size={18} /> SELL by Market
               </button>
               <button className="btn-buy" onClick={() => handleExecuteOrder('BUY')}>
                 <TrendingUp size={18} /> BUY by Market
               </button>
            </div>
            
            <p className="text-muted text-center mt-4" style={{fontSize: '11px'}}>
              Available Free Margin: ${currentUser.balance.toLocaleString()}
            </p>
         </div>
      </aside>
    </div>
  );
};

export default TradeTerminal;
