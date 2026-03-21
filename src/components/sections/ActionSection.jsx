import React from 'react';
import './ActionSection.css';

const ActionSection = () => {
  return (
    <section className="action-section">
      <div className="container">
        <div className="action-card">
          
          <div className="action-content">
            <h2 className="action-title">
              TIME TO TAKE ACTION WITH THE INTERNATIONAL MONCAPLUS TRADING BROKER
            </h2>
            
            <p className="action-body">
              Trading will bring you profit with proper support, constant education, and a reasonable approach. MONCAPLUS TRADING is a broker platform that has created all the conditions to help you improve your trading life in every possible way.
            </p>
            
            <p className="action-body mt-4">
              From educational broker's tools, demo accounts, and 24/7 support to your financial success, MONCAPLUS TRADING works tirelessly to remain at the forefront in trading online. Join now! Take full advantage of this online trading leader and make your way into the world of professional trading.
            </p>
            
            <button className="btn btn-green mt-8">Certificate of Incorporation</button>
          </div>

          <div className="action-image">
            <img src="https://moncapluscopytrading.com/assets/euro-copy.webp" alt="EUR USD Trading" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default ActionSection;
