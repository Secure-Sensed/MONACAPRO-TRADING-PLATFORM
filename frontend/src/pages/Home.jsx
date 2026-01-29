import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  TrendingUp,
  Shield,
  Zap,
  Users,
  Globe,
  DollarSign,
  BarChart3,
  Monitor,
  Smartphone,
  CheckCircle
} from 'lucide-react';
import { tradingStats, features, tradingAssets, achievements } from '../data/mockData';

// Animated text variants
const textVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut' }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: 'easeOut' }
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: 'easeOut' }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

// Animated Text Component
const AnimatedText = ({ text, className = '' }) => {
  return (
    <motion.div
      className={className}
      variants={textVariants}
      initial="hidden"
      animate="visible"
    >
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={letterVariants}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroPillars = [
    { icon: Shield, title: 'Risk-layered security', detail: 'Multi-signal fraud detection & guarded workflows' },
    { icon: Zap, title: 'Low-latency execution', detail: 'Optimized routing for fast order placement' },
    { icon: Globe, title: 'Multi-asset access', detail: 'FX, crypto, indices, commodities, and more' }
  ];

  const premiumFeatures = [
    {
      icon: Users,
      title: 'Copy Trading',
      description: 'Mirror top strategies with clear risk bands and transparent performance breakdowns.',
      highlights: ['Strategy filters', 'Risk controls', 'Auto-stop options']
    },
    {
      icon: TrendingUp,
      title: 'Futures & CFDs',
      description: 'Navigate global markets with curated instruments and institutional-style execution.',
      highlights: ['Tight spreads', 'Deep liquidity', 'Multi-venue access']
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Make confident decisions with advanced analytics, signals, and real-time insights.',
      highlights: ['Signal dashboard', 'Heatmaps', 'Performance attribution']
    },
    {
      icon: DollarSign,
      title: 'Funding & Payouts',
      description: 'Streamlined deposits and withdrawals with transparent status tracking.',
      highlights: ['Fast approvals', 'Multi-rail support', 'Clear processing windows']
    },
    {
      icon: Shield,
      title: 'Asset Security',
      description: 'Safeguard your funds with layered protection and resilient account controls.',
      highlights: ['Secure custody', 'Account alerts', 'Device protection']
    },
    {
      icon: Globe,
      title: 'Global Trading Suite',
      description: 'Access global markets through a unified dashboard optimized for speed and clarity.',
      highlights: ['Unified watchlists', 'Trade from anywhere', 'Custom views']
    }
  ];

  const toolStack = [
    {
      icon: Monitor,
      title: 'Pro-grade terminals',
      description: 'Multi-chart layouts, technical indicators, and watchlist intelligence.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-first control',
      description: 'Trade, manage risk, and monitor positions from any device.'
    },
    {
      icon: Zap,
      title: 'Smart alerts',
      description: 'Get notified when price, volatility, or risk thresholds are met.'
    },
    {
      icon: Shield,
      title: 'Account protection',
      description: 'Session monitoring, device checks, and customizable security layers.'
    }
  ];

  const accountSteps = [
    {
      step: '1',
      title: 'Register',
      description: 'Open your account in minutes with a guided onboarding flow.'
    },
    {
      step: '2',
      title: 'Verify',
      description: 'Complete streamlined verification to unlock full platform access.'
    },
    {
      step: '3',
      title: 'Fund',
      description: 'Choose your preferred funding method and start building positions.'
    },
    {
      step: '4',
      title: 'Copy & Trade',
      description: 'Follow expert strategies or trade manually with pro tools.'
    }
  ];

  const trustPillars = [
    {
      title: 'Transparency',
      description: 'Clear pricing, visible performance, and open reporting across the platform.'
    },
    {
      title: 'Trust & Security',
      description: 'Account protection baked into every workflow with strong internal controls.'
    },
    {
      title: 'Empowerment',
      description: 'Education, insights, and actionable tools built for every experience level.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05070f] via-[#0f1929] to-[#05070f] text-white overflow-hidden">
      {/* Hero Section with Video Theme */}
      <section className="relative overflow-hidden pt-28 pb-24 px-4 min-h-screen flex items-center">
        {/* Cinematic Background Effects */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_60%)]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/25 to-blue-700/15 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-300/15 to-orange-500/10 blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            y: [0, -40, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          <div>
            <motion.p
              className="uppercase tracking-[0.3em] text-xs text-cyan-300 font-semibold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              MONACAP TRADING PRO
            </motion.p>

            {/* Animated Main Heading */}
            <div className="mb-8 overflow-hidden">
              <motion.h1
                className="text-5xl md:text-7xl font-bold leading-tight font-['Gloock']"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
              >
                <div className="mb-4">
                  <AnimatedText text="Build wealth" className="text-white" />
                </div>
                <div className="mb-4">
                  <AnimatedText 
                    text="with a premium"
                    className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400"
                  />
                </div>
                <div>
                  <AnimatedText 
                    text="trading experience"
                    className="text-white"
                  />
                </div>
              </motion.h1>
            </div>

            <motion.p
              className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Trade global markets with clarity, confidence, and control. Monacap Trading Pro combines copy trading,
              professional analytics, and smart risk management in one elevated platform.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(34, 211, 238, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-600 text-white px-8 py-6 text-lg shadow-2xl shadow-cyan-500/40 transition-all"
                >
                  Open an account
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border border-cyan-300 text-cyan-200 hover:bg-cyan-300/10 px-8 py-6 text-lg transition-all"
                >
                  Access dashboard
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {heroPillars.map((pillar) => (
                <motion.div
                  key={pillar.title}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur transition-all cursor-pointer"
                >
                  <pillar.icon className="h-6 w-6 text-cyan-300 mb-3" />
                  <p className="text-sm font-semibold text-white">{pillar.title}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{pillar.detail}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex justify-end mb-8">
              <img
                src="https://moncapluscopytrading.com/assets/exclusive-funded-banner-graphic.svg"
                alt="Exclusive funded banner"
                className="w-full max-w-md h-auto"
              />
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-transparent rounded-[32px] blur-2xl"
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <div className="relative bg-[#0b1220] border border-white/10 rounded-[32px] p-6 shadow-[0_40px_120px_-40px_rgba(34,211,238,0.6)]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">Live Desk</p>
                <span className="text-xs text-cyan-300 bg-cyan-300/10 px-3 py-1 rounded-full">Online</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-400">Total Balance</p>
                  <p className="text-2xl font-semibold text-white mt-2">$128,520.45</p>
                  <p className="text-xs text-emerald-300 mt-1">+4.6% today</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-400">Active Copies</p>
                  <p className="text-2xl font-semibold text-white mt-2">12</p>
                  <p className="text-xs text-cyan-300 mt-1">Top 5% strategies</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-400">Market Pulse</p>
                  <p className="text-lg font-semibold text-white mt-2">Bullish Bias</p>
                  <p className="text-xs text-emerald-300 mt-1">Volatility easing</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-400">Risk Score</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
                    </div>
                    <span className="text-xs text-slate-300">68</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Balanced</p>
                </div>
              </div>
              <div className="mt-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white font-semibold">Strategy Performance</p>
                  <span className="text-xs text-cyan-300">Last 30d</span>
                </div>
                <div className="mt-3 h-16 rounded-xl bg-[linear-gradient(120deg,_rgba(34,211,238,0.2),_rgba(59,130,246,0.15)_45%,_rgba(15,23,42,0.6)_100%)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Metrics */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature) => (
              <motion.div key={feature.label} variants={scaleIn}>
                <Card className="bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/20 transition-all h-full">
                  <CardContent className="p-6 text-center">
                    <p className="text-2xl font-semibold text-white">{feature.value}</p>
                    <p className="text-xs text-slate-400 mt-2">{feature.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Copy Trading Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <motion.div {...fadeInLeft}>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">Copy trading</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Gloock']">Copy Trading with MCT</h2>
            <p className="text-slate-300 mt-4 leading-relaxed">
              Copy trading is an innovative strategy that allows you to replicate the trades of experienced
              professionals in real time. Choose a trader to follow and their positions are mirrored in your
              account automatically, so you stay aligned with expert market decisions.
            </p>
            <p className="text-slate-400 mt-6 leading-relaxed">
              This approach is ideal for investors who want market exposure without monitoring charts all day.
              You remain fully in control — set your allocation, pause a trader, or diversify across multiple
              strategies whenever you like.
            </p>
          </motion.div>

          <motion.div {...fadeInRight} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-transparent rounded-[32px] blur-2xl" />
            <div className="relative bg-white/5 border border-white/10 rounded-[32px] p-4 backdrop-blur">
              <video
                src="https://moncapluscopytrading.com/assets/anim.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">What we offer</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Gloock']">A complete trading ecosystem</h2>
            <p className="text-slate-300 mt-4 leading-relaxed">
              Monacap Trading Pro blends copy trading, professional analytics, and full market access to deliver a premium
              experience built for performance and confidence.
            </p>
          </motion.div>
      {/* Premium Features Section with Video-Themed Backgrounds */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Themed background gradients */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/15 to-blue-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-cyan-400/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="mb-16 text-center" {...fadeInUp}>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">Premium Features</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Gloock'] mb-6">Everything you need to trade like a pro</h2>
            <p className="text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed">
              Comprehensive tools and features designed for every trader, from beginners to professionals
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {premiumFeatures.map((feature, index) => (
              <motion.div 
                key={feature.title} 
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 30px 80px -40px rgba(34,211,238,0.6)'
                }}
              >
                <div className="relative group h-full">
                  {/* Animated gradient border */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                  />
                  <Card className="bg-gradient-to-br from-[#0b1220]/80 to-[#0f1929]/60 border border-white/10 rounded-3xl h-full backdrop-blur-sm hover:border-cyan-400/40 transition-all relative z-10">
                    <CardContent className="p-8 flex flex-col gap-6 h-full">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <feature.icon className="h-10 w-10 text-cyan-300" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                        <p className="text-sm text-slate-400 mt-3 leading-relaxed">{feature.description}</p>
                      </div>
                      <ul className="mt-auto space-y-3">
                        {feature.highlights.map((item, i) => (
                          <motion.li 
                            key={item} 
                            className="flex items-center text-sm text-slate-300"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + i * 0.05 }}
                          >
                            <CheckCircle className="h-4 w-4 text-emerald-300 mr-3 flex-shrink-0" />
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trading Assets Section with Video-Themed Design */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#05070f] via-[#0a0f1f] to-[#05070f] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div className="max-w-3xl mb-10" {...fadeInLeft}>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">Markets</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Gloock']">Institutional-grade access to global markets</h2>
            <p className="text-slate-300 mt-4 leading-relaxed">
              Trade the instruments you care about with competitive pricing, deep liquidity, and a unified experience
              across every asset class.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {tradingAssets.map((asset) => (
              <motion.div key={asset.id} variants={scaleIn}>
                <Card className="bg-white/5 border border-white/10 rounded-3xl h-full hover:border-cyan-400/40 transition-all">
                  <CardContent className="p-6 flex flex-col gap-4 h-full">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{asset.name}</h3>
                      <p className="text-sm text-slate-400 mt-2 leading-relaxed">{asset.description}</p>
                    </div>
                    <div className="mt-auto grid grid-cols-2 gap-2">
                      {asset.markets.map((market) => (
                        <div key={market} className="text-xs text-cyan-200 bg-cyan-200/10 rounded-full px-3 py-2">
                          {market}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <motion.div {...fadeInLeft}>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">Tools</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Gloock']">Great investment requires great tools</h2>
            <p className="text-slate-300 mt-4 leading-relaxed">
              Harness advanced analytics, real-time sentiment, and portfolio intelligence. Every tool is designed to help
              you move faster with higher conviction.
            </p>
            <div className="mt-6 space-y-4">
              {toolStack.map((tool) => (
                <div key={tool.title} className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-300/10 flex items-center justify-center">
                    <tool.icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{tool.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{tool.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => navigate('/software')}
              className="mt-8 bg-white/10 border border-white/20 hover:border-cyan-400/60 text-white"
            >
              Explore the platform
            </Button>
          </motion.div>

          <motion.div className="relative" {...fadeInRight}>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-transparent rounded-[32px] blur-2xl" />
            <div className="relative space-y-6">
              <div className="bg-[#0b1220] border border-white/10 rounded-[32px] p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Market Intelligence</p>
                  <span className="text-xs text-emerald-300 bg-emerald-300/10 px-3 py-1 rounded-full">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {[
                    { label: 'Sentiment Signal', value: 'Bullish' },
                    { label: 'Score', value: '81 / 100' },
                    { label: 'Volatility', value: 'Moderate' },
                    { label: 'Momentum', value: 'Rising' }
                  ].map((item) => (
                    <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-lg text-white mt-2">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-400">Peer Comparison</p>
                  <div className="mt-3 space-y-2">
                    {['AlphaTech', 'Nova Energy', 'QRS Holdings', 'Vector Labs'].map((name) => (
                      <div key={name} className="flex items-center justify-between text-xs text-slate-300">
                        <span>{name}</span>
                        <span className="text-emerald-300">Bullish</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[32px] p-4">
                <video
                  src="https://moncapluscopytrading.com/assets/play_720p.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4 bg-[#0b1220]">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">Get started</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Gloock']">Open an account in 4 simple steps</h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {accountSteps.map((step) => (
              <motion.div key={step.step} variants={scaleIn}>
                <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl h-full">
                  <CardContent className="p-6">
                    <p className="text-3xl font-semibold text-cyan-300">{step.step}</p>
                    <h3 className="text-lg font-semibold text-white mt-4">{step.title}</h3>
                    <p className="text-sm text-slate-400 mt-3 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <motion.div {...fadeInLeft}>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">Trust & compliance</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Gloock']">Confidence built into every layer</h2>
            <p className="text-slate-300 mt-4 leading-relaxed">
              Our platform is built to protect your capital with safeguards across onboarding, trading, and withdrawal
              workflows. You stay informed with transparent reporting and configurable controls.
            </p>
            <div className="mt-8 space-y-3">
              {[
                'Real-time monitoring and account alerts',
                'Risk management guardrails with smart thresholds',
                'Granular access controls and session visibility',
                'Transparent transaction status and reporting'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <Shield className="h-4 w-4 text-cyan-300" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeInRight} className="grid gap-4">
            {trustPillars.map((pillar) => (
              <div key={pillar.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                <p className="text-sm text-slate-400 mt-2">{pillar.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#05070f] via-[#0b1220] to-[#05070f]">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">Certificates & awards</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Gloock']">Recognized for excellence</h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.title}
                variants={scaleIn}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:border-cyan-400/40 transition-all"
                whileHover={{ y: -6 }}
              >
                <img src={achievement.image} alt={achievement.alt} className="h-16 w-16 object-contain" />
                <p className="text-xs text-slate-300 mt-3">{achievement.title}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              { icon: Globe, value: tradingStats.countries, label: 'Countries' },
              { icon: Users, value: tradingStats.traderAccounts, label: 'Trader accounts' },
              { icon: TrendingUp, value: tradingStats.monthlyTransactions, label: 'Monthly transactions' },
              { icon: DollarSign, value: tradingStats.averageMonthlyPayouts, label: 'Average monthly payouts' },
              { icon: BarChart3, value: tradingStats.monthlyTradeTurnover, label: 'Monthly trade turnover' }
            ].map((stat) => (
              <motion.div key={stat.label} variants={scaleIn} className="space-y-2">
                <stat.icon className="w-10 h-10 text-cyan-300 mx-auto" />
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-5xl mx-auto text-center bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-white/10 rounded-[32px] p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold font-['Gloock'] mb-6"
            animate={{
              textShadow: [
                '0 0 20px rgba(34, 211, 238, 0)',
                '0 0 30px rgba(34, 211, 238, 0.4)',
                '0 0 20px rgba(34, 211, 238, 0)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Start your trading journey with Monacap Trading Pro
          </motion.h2>
          <p className="text-lg text-slate-300 mb-8">
            Join a platform designed to deliver clarity, confidence, and premium control for every type of trader.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-600 text-white px-12 py-6 text-lg shadow-2xl shadow-cyan-500/50"
            >
              Get started
            </Button>
            <Button
              onClick={() => navigate('/company')}
              variant="outline"
              className="border border-white/20 text-white hover:bg-white/10 px-12 py-6 text-lg"
            >
              Why Monacap
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
