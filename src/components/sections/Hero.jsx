import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, LogIn } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Unlock your financial potential with <span className="text-blue">moncaplus</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            A trading platform that supports your financial goals by providing advanced tools, expert insights, and a secure environment for your investments.
          </motion.p>

          <motion.div 
            className="hero-assets"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="asset-circle fb"><img src="https://moncapluscopytrading.com/assets/asset-fb.svg" alt="fb"/></div>
            <div className="asset-circle mc"><img src="https://moncapluscopytrading.com/assets/asset-mcdonalds.svg" alt="mc"/></div>
            <div className="asset-circle tsla"><img src="https://moncapluscopytrading.com/assets/asset-tesla.svg" alt="tsla"/></div>
            <div className="asset-circle gg"><img src="https://moncapluscopytrading.com/assets/asset-google.svg" alt="google"/></div>
            <div className="asset-circle aapl"><img src="https://moncapluscopytrading.com/assets/asset-apple.svg" alt="apple"/></div>
            <div className="asset-pill">+100 assets</div>
          </motion.div>
          
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Link to="/register" className="btn btn-green premium-cta-btn" style={{textDecoration: 'none'}}>
              <Rocket size={18} /> Register Account
            </Link>
            <Link to="/login" className="btn btn-white premium-cta-btn" style={{textDecoration: 'none'}}>
              <LogIn size={18} /> Secure Login
            </Link>
          </motion.div>
        </div>

        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          <img src="https://moncapluscopytrading.com/assets/exclusive-funded-banner-graphic.svg" alt="Trading Terminal Illustration" />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
