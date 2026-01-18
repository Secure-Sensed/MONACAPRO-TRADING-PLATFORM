import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { TrendingUp, Shield, Zap, Users, Globe, DollarSign, BarChart3, Award } from 'lucide-react';
import { tradingStats, features, tradingAssets, achievements } from '../data/mockData';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0a1628]"></div>
          <img 
            src="https://images.unsplash.com/photo-1651176118867-f4ac0b1d6da4?w=800" 
            alt="Trading" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Unlock your financial potential with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                moncaplus
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              A trading platform that supports your financial goals by providing advanced tools, expert insights, and a secure environment for your investments.
            </p>
            
            {/* Asset Icons */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-cyan-400 font-semibold">+100 assets</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-6 text-lg transition-all transform hover:scale-105"
              >
                Register
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-8 py-6 text-lg transition-all"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="bg-[#1a2942]/50 border-gray-700 backdrop-blur-sm hover:bg-[#1a2942]/80 transition-all">
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{feature.value}</h3>
                  <p className="text-gray-400 text-sm">{feature.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Copy Trading Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Copy Trading with <span className="text-cyan-400">MCT</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
            <div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Copy trading is an innovative investment strategy that allows you to automatically replicate the trades of experienced and successful traders. Instead of making trading decisions on your own, you can choose a professional trader to follow, and their trades will be mirrored in your account in real-time.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                This approach is ideal for beginners or those who lack the time to analyze markets, as it enables you to benefit from the expertise of seasoned traders. You maintain full control—choose who to follow, set your investment amount, and stop copying at any time.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1761850167081-473019536383?w=600" 
                alt="Copy Trading" 
                className="relative rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div className="space-y-2">
              <Globe className="w-12 h-12 text-cyan-400 mx-auto" />
              <h3 className="text-4xl font-bold text-white">{tradingStats.countries}</h3>
              <p className="text-gray-400">countries</p>
            </div>
            <div className="space-y-2">
              <Users className="w-12 h-12 text-cyan-400 mx-auto" />
              <h3 className="text-4xl font-bold text-white">{tradingStats.traderAccounts}</h3>
              <p className="text-gray-400">Trader accounts</p>
            </div>
            <div className="space-y-2">
              <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto" />
              <h3 className="text-4xl font-bold text-white">{tradingStats.monthlyTransactions}</h3>
              <p className="text-gray-400">Monthly transactions</p>
            </div>
            <div className="space-y-2">
              <DollarSign className="w-12 h-12 text-cyan-400 mx-auto" />
              <h3 className="text-4xl font-bold text-white">{tradingStats.averageMonthlyPayouts}</h3>
              <p className="text-gray-400">Average monthly payouts</p>
            </div>
            <div className="space-y-2">
              <BarChart3 className="w-12 h-12 text-cyan-400 mx-auto" />
              <h3 className="text-4xl font-bold text-white">{tradingStats.monthlyTradeTurnover}</h3>
              <p className="text-gray-400">Monthly trade turnover</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Assets Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Our Trading <span className="text-cyan-400">Assets</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Trade across multiple asset classes with competitive spreads and deep liquidity
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradingAssets.map((asset) => (
              <Card key={asset.id} className="bg-[#1a2942]/50 border-gray-700 hover:bg-[#1a2942]/80 transition-all hover:border-cyan-400/50">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">{asset.name}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{asset.description}</p>
                  <ul className="space-y-2">
                    {asset.markets.map((market, idx) => (
                      <li key={idx} className="text-cyan-400 text-sm flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        {market}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            <span className="text-cyan-400">Achievements</span>
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="w-32 h-32 flex items-center justify-center bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
                <Award className="w-16 h-16 text-cyan-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Your Trading Journey with <span className="text-cyan-400">Moncaplus</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of traders who trust our platform for their financial success
          </p>
          <Button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-12 py-6 text-lg transition-all transform hover:scale-105"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;