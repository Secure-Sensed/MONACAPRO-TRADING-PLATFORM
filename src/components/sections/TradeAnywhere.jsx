import React from 'react';
import './TradeAnywhere.css';

const TradeAnywhere = () => {
  return (
    <section className="trade-anywhere">
      <div className="ta-banner">
        <h1 className="ta-text ta-text-left">TRADE</h1>
        <div className="ta-image-wrapper">
          <img src="https://moncapluscopytrading.com/assets/app-men.png" alt="Trade Anywhere App Man" className="ta-man" onError={(e) => { e.target.src = 'https://moncapluscopytrading.com/assets/960.webp'; }} />
        </div>
        <h1 className="ta-text ta-text-right">ANYWHERE</h1>
      </div>
    </section>
  );
};

export default TradeAnywhere;
