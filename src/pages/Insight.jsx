import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, TrendingUp, Video, Calendar, ChevronRight, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Insight = () => {
  const navigate = useNavigate();

  const articles = [
    {
      title: 'Understanding Market Volatility in 2025',
      excerpt: 'Learn how to navigate market volatility and turn it into profitable trading opportunities.',
      category: 'Market Analysis',
      date: 'Jan 18, 2025',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600'
    },
    {
      title: 'Copy Trading vs Traditional Trading: Which is Right for You?',
      excerpt: 'A comprehensive comparison to help you decide the best trading approach for your goals.',
      category: 'Education',
      date: 'Jan 15, 2025',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600'
    },
    {
      title: 'Top 5 Cryptocurrency Trends to Watch',
      excerpt: 'Stay ahead of the curve with our analysis of emerging cryptocurrency trends.',
      category: 'Crypto',
      date: 'Jan 12, 2025',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600'
    },
    {
      title: 'Risk Management Strategies for New Traders',
      excerpt: 'Essential risk management techniques every trader should know before starting.',
      category: 'Education',
      date: 'Jan 10, 2025',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600'
    }
  ];

  const webinars = [
    {
      title: 'Live Trading Session with Pro Traders',
      date: 'Jan 25, 2025',
      time: '2:00 PM EST',
      host: 'Sarah Chen'
    },
    {
      title: 'Technical Analysis Masterclass',
      date: 'Jan 28, 2025',
      time: '3:00 PM EST',
      host: 'Michael Johnson'
    },
    {
      title: 'Copy Trading Q&A Session',
      date: 'Feb 1, 2025',
      time: '1:00 PM EST',
      host: 'Trading Team'
    }
  ];

  const categories = [
    { name: 'Market Analysis', count: 45 },
    { name: 'Education', count: 32 },
    { name: 'Crypto', count: 28 },
    { name: 'Trading Tips', count: 24 },
    { name: 'Platform Updates', count: 15 }
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
            Market <span className="text-cyan-400">Insights</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay informed with our expert analysis, educational content, and market updates. Knowledge is your most powerful trading tool.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { icon: BookOpen, value: '500+', label: 'Articles' },
            { icon: Video, value: '100+', label: 'Video Tutorials' },
            { icon: TrendingUp, value: 'Daily', label: 'Market Updates' },
            { icon: Calendar, value: 'Weekly', label: 'Live Webinars' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-[#1a2942]/50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <stat.icon className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Articles */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Latest Articles</h2>
              <div className="space-y-6">
                {articles.map((article, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-[#1a2942]/80 border-gray-700 hover:border-cyan-400/50 transition-all cursor-pointer overflow-hidden">
                      <div className="grid md:grid-cols-3 gap-0">
                        <div className="md:col-span-1">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <CardContent className="md:col-span-2 p-6">
                          <div className="flex items-center space-x-4 mb-3">
                            <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded-full">
                              {article.category}
                            </span>
                            <span className="text-gray-500 text-xs flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {article.readTime}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                          <p className="text-gray-400 mb-4">{article.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-sm">{article.date}</span>
                            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 p-0">
                              Read More <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white">
                  Load More Articles
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Webinars */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-[#1a2942]/80 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Video className="w-5 h-5 text-cyan-400 mr-2" />
                    Upcoming Webinars
                  </h3>
                  <div className="space-y-4">
                    {webinars.map((webinar, index) => (
                      <div key={index} className="p-4 bg-[#0a1628]/50 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">{webinar.title}</h4>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-cyan-400 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {webinar.date}
                          </span>
                          <span className="text-gray-400 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {webinar.time}
                          </span>
                        </div>
                        <div className="flex items-center mt-2 text-gray-500 text-sm">
                          <User className="w-4 h-4 mr-1" />
                          {webinar.host}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white">
                    Register for Webinars
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-[#1a2942]/80 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 bg-[#0a1628]/50 rounded-lg hover:bg-[#0a1628]/80 cursor-pointer transition-colors"
                      >
                        <span className="text-gray-300">{category.name}</span>
                        <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded-full">
                          {category.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border-cyan-400/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
                  <p className="text-gray-400 mb-4 text-sm">
                    Subscribe to our newsletter for weekly market insights.
                  </p>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-[#0a1628] border border-gray-600 text-white placeholder:text-gray-500 rounded-md p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insight;
