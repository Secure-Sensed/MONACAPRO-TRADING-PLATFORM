import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Copy, Users, TrendingUp, Shield, Zap, BarChart3, CheckCircle } from 'lucide-react';

const MirrorTrading = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Copy,
      title: 'Automatic Copying',
      description: 'All trades from expert traders are automatically replicated in your account in real-time'
    },
    {
      icon: Users,
      title: 'Expert Traders',
      description: 'Follow top-performing traders with proven track records and high win rates'
    },
    {
      icon: TrendingUp,
      title: 'Consistent Returns',
      description: 'Benefit from professional trading strategies without needing market expertise'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Set your own risk limits and stop copying at any time with full control'
    },
    {
      icon: Zap,
      title: 'Real-Time Execution',
      description: 'Trades are copied instantly with minimal latency for optimal results'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track your copied trades with detailed statistics and performance metrics'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Choose a Trader',
      description: 'Browse our list of expert traders and review their performance history, win rates, and trading style'
    },
    {
      step: '2',
      title: 'Set Your Investment',
      description: 'Decide how much you want to allocate to copying that trader\'s strategy'
    },
    {
      step: '3',
      title: 'Auto-Copy Trades',
      description: 'All trades made by your selected trader are automatically replicated in your account'
    },
    {
      step: '4',
      title: 'Monitor & Adjust',
      description: 'Track performance in real-time and adjust your settings or stop copying anytime'
    }
  ];

  const topTraders = [
    { name: 'Sarah Chen', profit: '+92.15%', trades: 521, winRate: '82.34%', followers: 2100, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
    { name: 'Michael Johnson', profit: '+73.89%', trades: 456, winRate: '79.45%', followers: 1780, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
    { name: 'John Martinez', profit: '+58.24%', trades: 342, winRate: '76.71%', followers: 1250, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          {...fadeInUp}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Mirror <span className="text-cyan-400">Trading</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Copy the trades of expert traders automatically. Benefit from professional strategies without needing to trade yourself.
          </p>
          <Button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-6 text-lg"
          >
            Start Copying Now
          </Button>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose <span className="text-cyan-400">Mirror Trading</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-[#1a2942]/80 border-gray-700 h-full hover:border-cyan-400/50 transition-all">
                  <CardContent className="p-6">
                    <benefit.icon className="w-12 h-12 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It <span className="text-cyan-400">Works</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="bg-[#1a2942]/80 border-gray-700 text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl font-bold">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Traders Preview */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Top <span className="text-cyan-400">Performing Traders</span>
          </h2>
          <p className="text-gray-400 text-center mb-12">Start copying these expert traders today</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {topTraders.map((trader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-[#1a2942]/80 border-gray-700 hover:border-cyan-400/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <img src={trader.image} alt={trader.name} className="w-16 h-16 rounded-full" />
                      <div>
                        <h3 className="text-white font-bold text-lg">{trader.name}</h3>
                        <p className="text-green-400 font-semibold">{trader.profit}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs">Trades</p>
                        <p className="text-white font-semibold">{trader.trades}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Win Rate</p>
                        <p className="text-white font-semibold">{trader.winRate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Followers</p>
                        <p className="text-white font-semibold">{trader.followers}</p>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white">
                      Copy Trader
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
            >
              View All Traders
            </Button>
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-[#1a2942]/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">Platform Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Copy multiple traders simultaneously',
                  'Set custom risk parameters',
                  'Stop copying anytime',
                  'Real-time performance tracking',
                  'Detailed trade history',
                  'Mobile app access',
                  'No hidden fees',
                  '24/7 customer support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start <span className="text-cyan-400">Mirror Trading</span>?
          </h2>
          <p className="text-gray-400 mb-8">Join thousands of successful copy traders today</p>
          <Button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-12 py-6 text-lg"
          >
            Get Started Free
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MirrorTrading;