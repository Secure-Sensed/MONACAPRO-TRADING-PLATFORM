import React from 'react';
import './FeaturesStrip.css';

const features = [
  { value: '0.0', label: 'Pip Spreads' },
  { value: '1:2000', label: 'Leverage up to' },
  { value: '0.01', label: 'Micro Lot Trading' },
  { value: 'Fast', label: 'Withdrawals' },
  { value: 'Negative', label: 'Balance Protection' }
];

const FeaturesStrip = () => {
  return (
    <section className="features-strip">
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <h3 className="feature-value">{feature.value}</h3>
            <p className="feature-label">{feature.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesStrip;
