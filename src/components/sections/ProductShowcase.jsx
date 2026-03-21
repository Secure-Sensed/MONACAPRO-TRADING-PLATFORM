import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import './ProductShowcase.css';

const ProductShowcase = () => {
  return (
    <section className="product-showcase py-16">
      <div className="container">
        
        <div className="showcase-grid">
          
          <div className="showcase-content">
            <h2 className="section-title">
              Experience the Power of <br/>
              <span className="text-gradient">Moncaplus Trading</span>
            </h2>
            <p className="section-subtitle mt-4 mb-8">
              Everything you need to trade smarter. Our platform provides institutional-grade tools with a user-friendly interface.
            </p>

            <ul className="showcase-benefits">
              <li>
                <CheckCircle2 className="benefit-icon" />
                <div>
                  <h4>Advanced Charting</h4>
                  <p className="text-muted">Analyze markets with over 100 technical indicators.</p>
                </div>
              </li>
              <li>
                <CheckCircle2 className="benefit-icon" />
                <div>
                  <h4>One-Click Trading</h4>
                  <p className="text-muted">Execute trades instantly direct from the chart.</p>
                </div>
              </li>
              <li>
                <CheckCircle2 className="benefit-icon" />
                <div>
                  <h4>Automated Strategies</h4>
                  <p className="text-muted">Build, test, and deploy automated trading bots.</p>
                </div>
              </li>
            </ul>

            <button className="btn btn-primary btn-lg mt-8">Explore Features</button>
          </div>

          <div className="showcase-visual">
            <div className="mockup-container glass-panel">
              <div className="mockup-header">
                <div className="mac-buttons">
                  <span></span><span></span><span></span>
                </div>
                <div className="mockup-title">Moncaplus Web Terminal</div>
              </div>
              <div className="mockup-body">
                {/* CSS representation of a chart to avoid missing image assets */}
                <div className="chart-wrapper">
                  <div className="chart-sidebar">
                    <div className="chart-item"></div>
                    <div className="chart-item"></div>
                    <div className="chart-item"></div>
                    <div className="chart-item"></div>
                  </div>
                  <div className="chart-main">
                    <div className="chart-candles">
                      <div className="candle up h-1"></div>
                      <div className="candle down h-2"></div>
                      <div className="candle up h-3"></div>
                      <div className="candle up h-4"></div>
                      <div className="candle down h-5"></div>
                      <div className="candle up h-6"></div>
                      <div className="candle up h-7"></div>
                      <div className="candle down h-8"></div>
                      <div className="candle up h-9"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mockup-floating glass-panel">
              <div className="floating-stat">
                <span className="stat-value text-accent">+24.5%</span>
                <span className="stat-label">Monthly Return</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProductShowcase;
