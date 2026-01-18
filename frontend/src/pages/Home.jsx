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
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0a1628]"></div>
          <motion.img 
            src="https://images.unsplash.com/photo-1651176118867-f4ac0b1d6da4?w=800" 
            alt="Trading" 
            className="w-full h-full object-cover opacity-30"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 1.2 }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              {...fadeInUp}
            >
              Unlock your financial potential with{' '}
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                moncaplus
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              A trading platform that supports your financial goals by providing advanced tools, expert insights, and a secure environment for your investments.
            </motion.p>
            
            {/* Asset Icons */}
            <motion.div 
              className="flex items-center space-x-4 mb-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {['F', 'M', 'T', 'G', 'A'].map((letter, index) => (
                <motion.div
                  key={letter}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-blue-600' :
                    index === 1 ? 'bg-yellow-500' :
                    index === 2 ? 'bg-gray-700' :
                    index === 3 ? 'bg-red-600' : 'bg-gray-900'
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                >
                  <span className="text-white font-bold">{letter}</span>
                </motion.div>
              ))}
              <motion.span 
                className="text-cyan-400 font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                +100 assets
              </motion.span>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-6 text-lg transition-all shadow-lg shadow-cyan-500/50"
                >
                  Register
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-8 py-6 text-lg transition-all"
                >
                  Login
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="bg-[#1a2942]/50 border-gray-700 backdrop-blur-sm hover:bg-[#1a2942]/80 transition-all hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20">
                  <CardContent className="p-6 text-center">
                    <motion.h3 
                      className="text-2xl font-bold text-white mb-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      {feature.value}
                    </motion.h3>
                    <p className="text-gray-400 text-sm">{feature.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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