import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Handshake, DollarSign, Users, Award, Globe, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Partnership = () => {
  const navigate = useNavigate();

  const partnerTypes = [
    {
      icon: Users,
      title: 'Introducing Broker (IB)',
      description: 'Earn competitive commissions by referring new clients to our platform. Get rewarded for every trade your referrals make.',
      features: ['Up to $15 per lot', 'Real-time tracking', 'Monthly payouts', 'Marketing materials']
    },
    {
      icon: Globe,
      title: 'Affiliate Partner',
      description: 'Promote our platform through your website, social media, or other channels and earn attractive CPA rates.',
      features: ['High CPA rates', 'Custom tracking links', 'Dedicated support', 'No limits on earnings']
    },
    {
      icon: Handshake,
      title: 'White Label Solution',
      description: 'Launch your own branded trading platform powered by our technology and infrastructure.',
      features: ['Full customization', 'Technical support', 'Compliance assistance', 'Revenue sharing']
    }
  ];

  const benefits = [
    { icon: DollarSign, title: 'Competitive Commissions', desc: 'Industry-leading payout rates' },
    { icon: TrendingUp, title: 'Lifetime Earnings', desc: 'Earn on every client trade, forever' },
    { icon: Award, title: 'Premium Support', desc: 'Dedicated partner account manager' },
    { icon: Globe, title: 'Global Reach', desc: 'Promote to clients worldwide' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Partner <span className="text-cyan-400">With Us</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Join our partnership program and unlock new revenue streams. Whether you're an influencer, financial advisor, or business owner, we have a program for you.
          </p>
          <Button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-6 text-lg"
          >
            Become a Partner
          </Button>
        </motion.div>

        {/* Benefits Bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-[#1a2942]/50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <benefit.icon className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-1">{benefit.title}</h3>
              <p className="text-gray-400 text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Partnership Types */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Partnership <span className="text-cyan-400">Programs</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-[#1a2942]/80 border-gray-700 h-full hover:border-cyan-400/50 transition-all">
                  <CardContent className="p-8">
                    <type.icon className="w-14 h-14 text-cyan-400 mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">{type.title}</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">{type.description}</p>
                    <ul className="space-y-3">
                      {type.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white">
                      Apply Now
                    </Button>
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
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It <span className="text-cyan-400">Works</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Apply', desc: 'Fill out our simple partner application form' },
              { step: '2', title: 'Get Approved', desc: 'Our team will review and approve your application' },
              { step: '3', title: 'Promote', desc: 'Start promoting using your unique referral links' },
              { step: '4', title: 'Earn', desc: 'Receive commissions for every referral you bring' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center bg-[#1a2942]/80 rounded-2xl p-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start <span className="text-cyan-400">Earning</span>?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of successful partners who are already earning with Monacap Trading Pro. Apply today and start your journey to financial success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-6 text-lg"
            >
              Apply Now
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-8 py-6 text-lg"
            >
              Contact Us
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Partnership;
