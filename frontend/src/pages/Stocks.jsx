import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Search } from 'lucide-react';
import { Input } from '../components/ui/input';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock stock data
  const stockData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.52, change: 2.45, changePercent: 1.39, volume: '52.4M', marketCap: '2.8T' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 384.79, change: -1.23, changePercent: -0.32, volume: '24.1M', marketCap: '2.9T' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 3.67, changePercent: 2.66, volume: '28.7M', marketCap: '1.8T' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.33, change: 4.21, changePercent: 2.79, volume: '43.2M', marketCap: '1.6T' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -5.67, changePercent: -2.28, volume: '112.3M', marketCap: '771B' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 478.42, change: 12.34, changePercent: 2.65, volume: '15.8M', marketCap: '1.2T' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 505.48, change: 8.92, changePercent: 1.80, volume: '38.5M', marketCap: '1.2T' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 167.89, change: -0.45, changePercent: -0.27, volume: '9.2M', marketCap: '485B' },
    { symbol: 'V', name: 'Visa Inc.', price: 279.34, change: 3.12, changePercent: 1.13, volume: '6.8M', marketCap: '583B' },
    { symbol: 'WMT', name: 'Walmart Inc.', price: 165.23, change: 1.89, changePercent: 1.16, volume: '7.3M', marketCap: '442B' },
    { symbol: 'DIS', name: 'The Walt Disney Company', price: 112.45, change: -2.34, changePercent: -2.04, volume: '11.2M', marketCap: '205B' },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 487.93, change: 6.78, changePercent: 1.41, volume: '4.5M', marketCap: '210B' },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStocks(stockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          {...fadeInUp}
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Stock <span className="text-cyan-400">Trading</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Access over 2,100 stocks from ASX, NASDAQ & NYSE exchanges with competitive spreads
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search stocks by symbol or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-[#1a2942] border-gray-700 text-white placeholder:text-gray-500 h-12"
            />
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { icon: BarChart3, title: '2,100+ Stocks', desc: 'Wide selection' },
            { icon: DollarSign, title: 'Low Fees', desc: 'Competitive pricing' },
            { icon: TrendingUp, title: 'Real-Time Data', desc: 'Live market prices' },
            { icon: TrendingUp, title: 'Up to 1:20', desc: 'Leverage available' }
          ].map((feature, idx) => (
            <Card key={idx} className="bg-[#1a2942]/80 border-gray-700">
              <CardContent className="p-6 text-center">
                <feature.icon className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-white font-bold mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Stock List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading stocks...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredStocks.map((stock, index) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#1a2942]/80 border-gray-700 hover:border-cyan-400/50 transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{stock.symbol.substring(0, 2)}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{stock.symbol}</h3>
                          <p className="text-gray-400 text-sm">{stock.name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-white font-bold text-2xl">${stock.price}</p>
                        <div className={`flex items-center justify-end space-x-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-semibold">
                            {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                          </span>
                        </div>
                      </div>

                      <div className="hidden lg:flex space-x-8">
                        <div>
                          <p className="text-gray-400 text-xs">Volume</p>
                          <p className="text-white font-semibold">{stock.volume}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Market Cap</p>
                          <p className="text-white font-semibold">{stock.marketCap}</p>
                        </div>
                      </div>

                      <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white">
                        Trade
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredStocks.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No stocks found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stocks;