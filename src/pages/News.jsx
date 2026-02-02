import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TrendingUp, TrendingDown, Clock, Share2, Bookmark, Heart, AlertCircle, RefreshCw } from 'lucide-react';

// Simulated real-time news data - in production, connect to real API
const mockNewsData = [
  {
    id: 1,
    title: 'Federal Reserve Holds Interest Rates Steady, Eyes Inflation Trends',
    excerpt: 'The Fed maintains its current policy stance as inflation shows signs of stabilization. Market analysts expect rate cuts in Q2 2025.',
    category: 'Economic',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 15 * 60000),
    source: 'Reuters',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400',
    impact: 'High'
  },
  {
    id: 2,
    title: 'Bitcoin Surges Past $45,000 on Institutional Buying',
    excerpt: 'Cryptocurrency markets rally as major institutional investors increase exposure. Ethereum follows with 8% gain.',
    category: 'Cryptocurrency',
    sentiment: 'bullish',
    timestamp: new Date(Date.now() - 25 * 60000),
    source: 'Bloomberg',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400',
    impact: 'High'
  },
  {
    id: 3,
    title: 'Tech Stocks Rally on AI Innovation Announcements',
    excerpt: 'Major tech companies announce groundbreaking AI initiatives. Nasdaq composite up 2.1% as investors embrace growth opportunities.',
    category: 'Stocks',
    sentiment: 'bullish',
    timestamp: new Date(Date.now() - 45 * 60000),
    source: 'CNBC',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400',
    impact: 'Medium'
  },
  {
    id: 4,
    title: 'Oil Markets Volatile Amid Geopolitical Tensions',
    excerpt: 'Crude prices fluctuate as global supply concerns resurface. OPEC signals potential production adjustments.',
    category: 'Commodities',
    sentiment: 'bearish',
    timestamp: new Date(Date.now() - 60 * 60000),
    source: 'MarketWatch',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400',
    impact: 'Medium'
  },
  {
    id: 5,
    title: 'Euro Strengthens Against Dollar on Economic Data',
    excerpt: 'European economic indicators exceed expectations, pushing EUR/USD to 6-month highs.',
    category: 'Forex',
    sentiment: 'bullish',
    timestamp: new Date(Date.now() - 90 * 60000),
    source: 'Financial Times',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=400',
    impact: 'Medium'
  },
  {
    id: 6,
    title: 'Trade Negotiations Boost Market Sentiment',
    excerpt: 'Breakthrough in international trade talks lifts global markets. Stock indices reach new records.',
    category: 'Economic',
    sentiment: 'bullish',
    timestamp: new Date(Date.now() - 120 * 60000),
    source: 'AP News',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&h=400',
    impact: 'High'
  },
  {
    id: 7,
    title: 'Central Bank Digital Currencies Making Progress',
    excerpt: 'Multiple countries advance CBDC initiatives. Industry experts predict mainstream adoption by 2026.',
    category: 'Cryptocurrency',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 150 * 60000),
    source: 'CoinDesk',
    image: 'https://images.unsplash.com/photo-1640361674519-86162ff8020b?w=600&h=400',
    impact: 'Medium'
  },
  {
    id: 8,
    title: 'Corporate Earnings Beat Expectations in Q4',
    excerpt: 'S&P 500 companies deliver strong earnings results. Forward guidance remains optimistic.',
    category: 'Stocks',
    sentiment: 'bullish',
    timestamp: new Date(Date.now() - 180 * 60000),
    source: 'FactSet',
    image: 'https://images.unsplash.com/photo-1542783509-3efd6d9c7d5d?w=600&h=400',
    impact: 'High'
  }
];

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNews(mockNewsData);
      setLoading(false);
    }, 800);

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In production, fetch fresh data here
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [mockNewsData]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setNews(mockNewsData.sort(() => Math.random() - 0.5));
      setLastUpdate(new Date());
      setLoading(false);
    }, 600);
  };

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const categories = ['all', 'Economic', 'Stocks', 'Cryptocurrency', 'Forex', 'Commodities'];

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-emerald-400';
      case 'bearish':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getImpactBadgeColor = (impact) => {
    switch (impact) {
      case 'High':
        return 'bg-red-400/20 text-red-300 border-red-400/30';
      case 'Medium':
        return 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30';
      case 'Low':
        return 'bg-blue-400/20 text-blue-300 border-blue-400/30';
      default:
        return 'bg-slate-400/20 text-slate-300 border-slate-400/30';
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 font-['Gloock']">
                Trading <span className="text-cyan-400">News</span>
              </h1>
              <p className="text-slate-300 text-lg">Real-time market updates and financial news</p>
            </div>
            <motion.button
              onClick={handleRefresh}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-cyan-400/20 border border-cyan-400/40 hover:bg-cyan-400/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-cyan-300 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>

          {/* Last Update */}
          <motion.div
            className="flex items-center space-x-2 text-slate-400 text-sm"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="mb-8 flex gap-2 overflow-x-auto pb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* News List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading latest news...</p>
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {filteredNews.map((article, index) => (
              <motion.div
                key={article.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 hover:border-cyan-400/40 transition-all overflow-hidden">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-[1fr_200px] gap-6 items-start">
                      {/* Content */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-400/20 text-cyan-300">
                            {article.category}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getImpactBadgeColor(article.impact)}`}>
                            {article.impact} Impact
                          </span>
                          <div className={`flex items-center gap-1 ${getSentimentColor(article.sentiment)}`}>
                            {article.sentiment === 'bullish' ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : article.sentiment === 'bearish' ? (
                              <TrendingDown className="w-4 h-4" />
                            ) : (
                              <AlertCircle className="w-4 h-4" />
                            )}
                            <span className="text-xs uppercase font-semibold">{article.sentiment}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white leading-tight hover:text-cyan-300 transition-colors cursor-pointer">
                          {article.title}
                        </h3>

                        <p className="text-slate-400 leading-relaxed">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-6 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {timeAgo(article.timestamp)}
                            </div>
                            <span className="font-semibold text-slate-300">{article.source}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <Share2 className="w-4 h-4 text-slate-400 hover:text-cyan-300" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSavedArticles(prev => 
                                  prev.includes(article.id)
                                    ? prev.filter(id => id !== article.id)
                                    : [...prev, article.id]
                                );
                              }}
                              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <Bookmark 
                                className={`w-4 h-4 ${savedArticles.includes(article.id) ? 'fill-cyan-300 text-cyan-300' : 'text-slate-400 hover:text-cyan-300'}`}
                              />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Image */}
                      <motion.div
                        className="hidden md:block"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-40 object-cover rounded-xl"
                        />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-6"
          >
            Load More Articles
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default News;
