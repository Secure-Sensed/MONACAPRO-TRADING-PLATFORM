import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Shield, Award, Users, Globe, TrendingUp, Target, Heart, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Company = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Your funds and data are protected with bank-grade encryption and security protocols. We implement multi-layer security measures to ensure your trading experience is safe and secure.'
    },
    {
      icon: Heart,
      title: 'Client-Centric',
      description: 'We put our clients at the heart of everything we do. Our 24/7 support team is always ready to assist you, and we continuously improve our platform based on your feedback.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology to provide you with the best trading experience. From AI-powered insights to real-time analytics, we are always evolving.'
    },
    {
      icon: Target,
      title: 'Transparency',
      description: 'Complete transparency in pricing, execution, and reporting. No hidden fees, no surprises. You always know exactly what you are paying for and what you are getting.'
    }
  ];

  const milestones = [
    { year: '2020', event: 'Company Founded', description: 'Monacap Trading Pro was established with a vision to democratize trading' },
    { year: '2021', event: '10,000 Users', description: 'Reached our first major milestone of active traders' },
    { year: '2022', event: 'Global Expansion', description: 'Expanded services to over 130 countries worldwide' },
    { year: '2023', event: 'Award Winner', description: 'Recognized as Best Copy Trading Platform' },
    { year: '2024', event: '1M+ Traders', description: 'Surpassed 1 million active trading accounts' },
    { year: '2025', event: 'Industry Leader', description: 'Leading innovation in automated copy trading' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="text-cyan-400">Monacap Trading Pro</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            We are a global financial services provider specializing in online trading and copy trading solutions. Our mission is to empower traders of all levels with professional tools, expert insights, and a secure platform for financial success.
          </p>
        </motion.div>

        {/* Statistics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { icon: Users, value: '1M+', label: 'Active Traders' },
            { icon: Globe, value: '130+', label: 'Countries Served' },
            { icon: TrendingUp, value: '$211M', label: 'Monthly Volume' },
            { icon: Award, value: '50+', label: 'Industry Awards' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <stat.icon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Story */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Our <span className="text-cyan-400">Story</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Founded in 2020, Monacap Trading Pro emerged from a simple yet powerful idea: make professional trading accessible to everyone. Our founders, experienced traders and technology experts, recognized that many individuals wanted to participate in financial markets but lacked the time, knowledge, or confidence to trade independently.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                We developed a revolutionary copy trading platform that allows anyone to automatically replicate the strategies of expert traders. Today, we serve over 1 million traders across 130+ countries, processing billions in monthly trading volume.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our commitment to innovation, security, and client success has earned us numerous industry awards and the trust of traders worldwide.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=600" 
                alt="Trading Team" 
                className="relative rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Core <span className="text-cyan-400">Values</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className="bg-[#1a2942]/80 border-gray-700 h-full hover:border-cyan-400/50 transition-all">
                  <CardContent className="p-8">
                    <value.icon className="w-14 h-14 text-cyan-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company Timeline */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our <span className="text-cyan-400">Journey</span>
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-cyan-400/30"></div>
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className={`relative mb-8 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className={`flex items-center ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                  <Card className="bg-[#1a2942]/80 border-gray-700 max-w-md hover:border-cyan-400/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">{milestone.year}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{milestone.event}</h3>
                      </div>
                      <p className="text-gray-400">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Regulatory Information */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Card className="bg-[#1a2942]/80 border-gray-700">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Regulatory <span className="text-cyan-400">Information</span>
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">Monacap Trading Pro</strong> operates under MCT Limited, a registered financial services company. We are committed to maintaining the highest standards of regulatory compliance and client protection.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-[#0a1628]/50 p-6 rounded-lg">
                    <h4 className="text-white font-bold mb-2">Company Information</h4>
                    <p className="text-sm text-gray-400 mb-1">MCT Limited</p>
                    <p className="text-sm text-gray-400 mb-1">Registration: 2023-00465</p>
                    <p className="text-sm text-gray-400">Licensed in Canada & United Kingdom</p>
                  </div>
                  <div className="bg-[#0a1628]/50 p-6 rounded-lg">
                    <h4 className="text-white font-bold mb-2">Contact</h4>
                    <p className="text-sm text-gray-400 mb-1">Email: support@monacaptradingpro.com</p>
                    <p className="text-sm text-gray-400 mb-1">Phone: +1 (800) 555-0123</p>
                    <p className="text-sm text-gray-400">Address: 123 Financial District, Sydney, NSW 2000</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our <span className="text-cyan-400">Success Story</span>
          </h2>
          <p className="text-gray-400 mb-8">Start your trading journey with a trusted global partner</p>
          <Button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-12 py-6 text-lg"
          >
            Open Free Account
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Company;