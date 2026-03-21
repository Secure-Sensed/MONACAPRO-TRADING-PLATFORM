import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer pt-16 pb-8">
      <div className="container">
        
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo mb-4">
              <span className="logo-accent">MCT</span> Moncaplus Trading
            </div>
            <p className="text-muted text-sm max-w-sm">
              Moncaplus Trading provides a world-class trading experience with powerful tools and analytics. Join millions of traders worldwide and take control of your financial future.
            </p>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#news">Newsroom</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Products</h4>
            <ul>
              <li><a href="#mirror">Mirror Trading</a></li>
              <li><a href="#copy">Copy Trading</a></li>
              <li><a href="#options">Options</a></li>
              <li><a href="#crypto">Crypto</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#academy">Trading Academy</a></li>
              <li><a href="#fees">Fees & Limits</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Compliance</h4>
            <ul>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#kyc">KYC & AML</a></li>
              <li><a href="#risk">Risk Disclosure</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-offices mt-16 pt-8 border-top">
          <div className="office-grid">
            <div className="office">
              <h5>Canada</h5>
              <p>123 Financial District, Toronto, ON M5V 3L9</p>
            </div>
            <div className="office">
              <h5>United Kingdom</h5>
              <p>45 King William St, London EC4R 9AN</p>
            </div>
            <div className="office">
              <h5>Australia</h5>
              <p>Level 25/100 Barangaroo Ave, Sydney NSW 2000</p>
            </div>
          </div>
        </div>

        <div className="footer-legal mt-8">
          <p className="text-muted text-xs">
            <strong>Risk Warning:</strong> Trading Forex and Leveraged Financial Instruments involves significant risk and can result in the loss of your invested capital. You should not invest more than you can afford to lose and should ensure that you fully understand the risks involved. Please read our detailed Risk Disclosure.
          </p>
          <div className="copyright mt-4">
            <p className="text-muted text-xs">&copy; {new Date().getFullYear()} Moncaplus Trading. All rights reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
