import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Monitor, Smartphone, Globe, Zap, Shield, BarChart3, Download, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Software = () => {
  const navigate = useNavigate();

  const platforms = [
    {
      icon: Monitor,
      title: 'Desktop Platform',
      description: 'Our powerful desktop application offers advanced charting, technical analysis tools, and lightning-fast execution.',
      features: ['Advanced charting', 'One-click trading', 'Custom indicators', 'Automated trading'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600'
    },
    {
      icon: Globe,
      title: 'Web Trader',
      description: 'Trade directly from your browser without any downloads. Access your account from any computer, anywhere.',
      features: ['No installation needed', 'Cross-browser compatible', 'Secure connection', 'Real-time data'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'
    },
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Take your trading on the go with our iOS and Android apps. Never miss a trading opportunity.',
      features: ['iOS & Android', 'Push notifications', 'Biometric login', 'Full functionality'],
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600'
    }
  ];

  const features = [
    { icon: Zap, title: 'Ultra-Fast Execution', desc: 'Execute trades in milliseconds with our optimized infrastructure' },
    { icon: Shield, title: 'Bank-Grade Security', desc: '256-bit SSL encryption and two-factor authentication' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Professional charting tools with 50+ technical indicators' },
    { icon: Globe, title: 'Global Access', desc: 'Trade from anywhere in the world, 24/7' }
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
            Trading <span className="text-cyan-400">Software</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Experience professional-grade trading technology. Our platforms are designed for speed, reliability, and ease of use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-6 text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Now
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-8 py-6 text-lg"
            >
              Try Web Trader
            </Button>
          </div>
        </motion.div>

        {/* Key Features Bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-[#1a2942]/50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <feature.icon className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-1">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Platforms */}
        <motion.div
          className="space-y-16 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
            >
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <platform.icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">{platform.title}</h2>
                </div>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">{platform.description}</p>
                <ul className="space-y-3 mb-6">
                  {platform.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white">
                  Learn More
                </Button>
              </div>
              <div className={`relative ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur-xl"></div>
                <img 
                  src={platform.image} 
                  alt={platform.title}
                  className="relative rounded-lg shadow-2xl w-full"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* System Requirements */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            System <span className="text-cyan-400">Requirements</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Windows',
                reqs: ['Windows 10 or later', '4GB RAM minimum', '500MB free space', 'Intel Core i3 or equivalent']
              },
              {
                title: 'Mac',
                reqs: ['macOS 10.14 or later', '4GB RAM minimum', '500MB free space', 'Intel or Apple Silicon']
              },
              {
                title: 'Mobile',
                reqs: ['iOS 13+ / Android 8+', '2GB RAM minimum', '100MB free space', 'Internet connection']
              }
            ].map((os, index) => (
              <Card key={index} className="bg-[#1a2942]/80 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">{os.title}</h3>
                  <ul className="space-y-2">
                    {os.reqs.map((req, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-gray-400">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center bg-[#1a2942]/80 rounded-2xl p-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to <span className="text-cyan-400">Start Trading</span>?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Download our platform today and experience the difference. Free demo account available.
          </p>
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

export default Software;
