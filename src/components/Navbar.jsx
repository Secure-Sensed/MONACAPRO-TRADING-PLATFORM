import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Building2, TrendingUp, Copy, MonitorPlay, Lightbulb } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container nav-container">
        
        <div className="logo-section flex-center">
          <img src="https://moncapluscopytrading.com/assets/logo.png" alt="moncaplus" className="original-logo-hidden" style={{display: 'none'}} />
          <div className="custom-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#2E8BFF"/>
              <path d="M12 18V12L8 9.5M12 12L16 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="logo-text">
              <span className="logo-moncaplus">moncaplus</span><br/>
              <span className="logo-trading">trading</span>
            </div>
          </div>
        </div>

        <nav className="nav-links premium-links">
          <Link to="/company" className="premium-link">
            <Building2 size={18} className="link-icon" /> <span>Company</span>
          </Link>
          <Link to="/mirror-trading" className="premium-link">
            <Copy size={18} className="link-icon" /> <span>Mirror Trading</span>
          </Link>
          <Link to="/stocks" className="premium-link">
            <TrendingUp size={18} className="link-icon" /> <span>Stocks</span>
          </Link>
          <Link to="/software" className="premium-link">
            <MonitorPlay size={18} className="link-icon" /> <span>Software</span>
          </Link>
          <Link to="/insight" className="premium-link">
            <Lightbulb size={18} className="link-icon" /> <span>Insight</span>
          </Link>
        </nav>

        <div className="nav-actions">
          <button className="lang-dropdown fade-in-on-hover">
            <img src="https://flagcdn.com/w20/gb.png" alt="English" className="flag-icon" />
            English <ChevronDown size={14} />
          </button>
          <Link to="/register" className="btn btn-register premium-button" style={{textDecoration: 'none'}}>
            Get Started
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
