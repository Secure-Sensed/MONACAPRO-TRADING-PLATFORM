import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        
        <div className="hero-content">
          <h1 className="hero-title">
            Unlock your financial potential with <span className="text-blue">moncaplus</span>
          </h1>
          
          <p className="hero-subtitle">
            A trading platform that supports your financial goals by providing advanced tools, expert insights, and a secure environment for your investments.
          </p>

          <div className="hero-assets">
            <div className="asset-circle fb"><img src="https://moncapluscopytrading.com/assets/asset-fb.svg" alt="fb"/></div>
            <div className="asset-circle mc"><img src="https://moncapluscopytrading.com/assets/asset-mcdonalds.svg" alt="mc"/></div>
            <div className="asset-circle tsla"><img src="https://moncapluscopytrading.com/assets/asset-tesla.svg" alt="tsla"/></div>
            <div className="asset-circle gg"><img src="https://moncapluscopytrading.com/assets/asset-google.svg" alt="google"/></div>
            <div className="asset-circle aapl"><img src="https://moncapluscopytrading.com/assets/asset-apple.svg" alt="apple"/></div>
            <div className="asset-pill">+100 assets</div>
          </div>
          
          <div className="hero-cta">
            <Link to="/register" className="btn btn-green" style={{textDecoration: 'none'}}>Register</Link>
            <Link to="/login" className="btn btn-white" style={{textDecoration: 'none'}}>Login</Link>
          </div>
        </div>

        <div className="hero-image">
          <img src="https://moncapluscopytrading.com/assets/exclusive-funded-banner-graphic.svg" alt="Trading Terminal Illustration" />
        </div>

      </div>
    </section>
  );
};

export default Hero;
