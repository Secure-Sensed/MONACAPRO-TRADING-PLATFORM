import React from 'react';
import './EverythingSection.css';

const EverythingSection = () => {
  return (
    <section className="everything-section">
      <div className="container es-container">
        
        <div className="es-content">
          <h2 className="es-title">Everything you need to<br/>trade smarter</h2>
          
          <p className="es-body">
            Providing traders with the tools, insights, and strategies to make informed decisions with confidence. From real-time market data and advanced charting tools to AI-powered analysis and customizable alerts, we offer everything you need to stay ahead of the curve. Whether you're managing risk with sophisticated features like stop-loss orders or deepening your knowledge with expert insights and educational resources, our platform is built to support your journey.
          </p>
        </div>

        <div className="es-image">
          {/* Using probable image for the user cards illustration */}
          <img src="https://moncapluscopytrading.com/assets/Group_2793.png" alt="Trader Cards" onError={(e) => { e.target.src = 'https://moncapluscopytrading.com/assets/Group_2648.png'; }} />
        </div>

      </div>
    </section>
  );
};

export default EverythingSection;
