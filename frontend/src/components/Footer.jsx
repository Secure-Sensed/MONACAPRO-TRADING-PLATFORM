import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a1628] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo and Description */}
        <div className="mb-10">
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-white font-bold text-xl">Monacap Trading Pro Copy Trading</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-3xl">
            <strong>Risk Warning:</strong> CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider copying a Lead Trader we provide that understand how CFDs work without the risk of losing your money.
          </p>
          <p className="text-gray-400 text-sm max-w-3xl">
            <strong>Monacap Trading Pro Copy Trading</strong> is a global financial services provider that operates among various entities.
          </p>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Trades</h3>
            <ul className="space-y-2">
              <li><Link to="/stocks" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Swing Trading</Link></li>
              <li><Link to="/stocks" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">FX &amp; Futures</Link></li>
              <li><Link to="/stocks" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Buy Options</Link></li>
              <li><Link to="/stocks" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Oil &amp; Gas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/mirror-trading" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Option Copy Trading</Link></li>
              <li><Link to="/stocks" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">FX &amp; Advance Trading</Link></li>
              <li><Link to="/stocks" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Buy Live Trading</Link></li>
              <li><Link to="/mirror-trading" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Copy Trading</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/company" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">About us</Link></li>
              <li><Link to="/company" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Insurance</Link></li>
              <li><Link to="/mirror-trading" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Lead Traders</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Demo Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">System Status</a></li>
              <li><Link to="/insight" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Latest market news</Link></li>
              <li><Link to="/partnership" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Refer a Friend</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Compliance</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">User Agreement</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Data Protection Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Anti-Money Laundering</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Compliance (SEC)</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            © 2025 Monacap Trading Pro Copy Trading. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
