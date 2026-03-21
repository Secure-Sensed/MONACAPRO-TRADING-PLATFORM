import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ChevronDown } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container nav-container">
        
        <div className="logo-section">
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

        <nav className="nav-links">
          <Link to="/company">Company</Link>
          <Link to="/mirror-trading">Mirror trading</Link>
          <Link to="/stocks">Stocks</Link>
          <Link to="/software">Software</Link>
          <Link to="/insight">Insight</Link>
        </nav>

        <div className="nav-actions">
          <button className="lang-dropdown">
            <img src="https://flagcdn.com/w20/gb.png" alt="English" className="flag-icon" />
            English <ChevronDown size={14} />
          </button>
          <Link to="/register" className="btn btn-register" style={{textDecoration: 'none'}}>Registration</Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
