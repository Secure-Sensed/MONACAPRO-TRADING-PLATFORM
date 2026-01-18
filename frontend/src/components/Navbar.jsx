import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a1628]/98 backdrop-blur-md shadow-lg shadow-cyan-500/10' : 'bg-[#0a1628]/95 backdrop-blur-sm'
      } border-b border-gray-800`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white font-bold text-xl">M</span>
            </motion.div>
            <motion.span 
              className="text-white font-bold text-xl hidden sm:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              moncaplus
            </motion.span>
            <motion.span 
              className="text-cyan-400 text-sm hidden sm:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              copy trading
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {['Company', 'Mirror trading', 'Stocks', 'Software', 'Insight'].map((item, index) => (
              <motion.div
                key={item}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to={`/${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-gray-300 hover:text-white transition-colors relative group"
                >
                  {item}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"
                  ></motion.span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Language Selector & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <img src="https://flagcdn.com/w20/gb.png" alt="English" className="w-5 h-4" />
              <span>English</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {!isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white transition-all"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white transition-all"
                >
                  Registration
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white transition-all"
              >
                Dashboard
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a1628] border-t border-gray-800">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className="block text-gray-300 hover:text-white py-2">
              Company
            </Link>
            <Link to="/mirror-trading" className="block text-gray-300 hover:text-white py-2">
              Mirror trading
            </Link>
            <Link to="/stocks" className="block text-gray-300 hover:text-white py-2">
              Stocks
            </Link>
            <Link to="/software" className="block text-gray-300 hover:text-white py-2">
              Software
            </Link>
            <Link to="/insight" className="block text-gray-300 hover:text-white py-2">
              Insight
            </Link>
            {!isLoggedIn ? (
              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="border-cyan-400 text-cyan-400 w-full"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white w-full"
                >
                  Registration
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white w-full"
              >
                Dashboard
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;