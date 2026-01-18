import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a1628] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo and Description */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-white font-bold text-xl">Monacap Trading Pro Copy Trading</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              <strong>Risk Warning:</strong> CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider copying a Lead Trader we provide that understand how CFDs work without the risk of losing your money.
            </p>
            <p className="text-gray-400 text-sm">
              <strong>Monacap Trading Pro Copy Trading</strong> is a global financial services provider that operates among various entities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/mirror-trading" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                  Mirror Trading
                </Link>
              </li>
              <li>
                <Link to="/stocks" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                  Stocks
                </Link>
              </li>
              <li>
                <Link to="/software" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                  Software
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">
                MCT Limited
              </li>
              <li className="text-gray-400 text-sm">
                Registration: 2023-00465
              </li>
              <li className="text-gray-400 text-sm">
                Canada & United Kingdom
              </li>
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