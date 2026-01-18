import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Copy, 
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CopyTraderDialog from '../components/CopyTraderDialog';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [portfolio, setPortfolio] = useState({
    balance: 0,
    profit: 0,
    profitPercentage: 0,
    activeCopies: 0,
    totalTrades: 0
  });

  const [leadTraders, setLeadTraders] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  const handleCopyTrader = (trader) => {
    setSelectedTrader(trader);
    setShowCopyDialog(true);
  };

  useEffect(() => {
    fetchDashboardData();
    fetchLeadTraders();
    fetchCryptoPrices();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setPortfolio(response.data.portfolio);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadTraders = async () => {
    try {
      const response = await axios.get(`${API_URL}/traders`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setLeadTraders(response.data.traders);
      }
    } catch (error) {
      console.error('Error fetching traders:', error);
    }
  };

  const fetchCryptoPrices = async () => {
    try {
      // Fetch real-time crypto prices from CoinGecko
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await response.json();
      
      const prices = [
        { 
          name: 'Bitcoin', 
          symbol: 'BTC', 
          price: data.bitcoin.usd, 
          change: data.bitcoin.usd_24h_change 
        },
        { 
          name: 'Ethereum', 
          symbol: 'ETH', 
          price: data.ethereum.usd, 
          change: data.ethereum.usd_24h_change 
        },
        { 
          name: 'BNB', 
          symbol: 'BNB', 
          price: data.binancecoin.usd, 
          change: data.binancecoin.usd_24h_change 
        },
        { 
          name: 'Cardano', 
          symbol: 'ADA', 
          price: data.cardano.usd, 
          change: data.cardano.usd_24h_change 
        },
        { 
          name: 'Solana', 
          symbol: 'SOL', 
          price: data.solana.usd, 
          change: data.solana.usd_24h_change 
        }
      ];
      
      setCryptoPrices(prices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] flex items-center justify-center pt-20">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.full_name}</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="border-gray-600 text-white hover:bg-white/10"
          >
            Logout
          </Button>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1a2942]/80 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Balance</p>
                  <h3 className="text-2xl font-bold text-white">${portfolio.balance.toLocaleString()}</h3>
                </div>
                <Wallet className="w-10 h-10 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942]/80 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Profit</p>
                  <h3 className="text-2xl font-bold text-green-400">${portfolio.profit.toLocaleString()}</h3>
                  <p className="text-green-400 text-sm flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{portfolio.profitPercentage}%
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942]/80 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Active Copies</p>
                  <h3 className="text-2xl font-bold text-white">{portfolio.activeCopies}</h3>
                </div>
                <Copy className="w-10 h-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942]/80 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Trades</p>
                  <h3 className="text-2xl font-bold text-white">148</h3>
                </div>
                <Activity className="w-10 h-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#1a2942]/80 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">Overview</TabsTrigger>
            <TabsTrigger value="copytrading" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">Copy Trading</TabsTrigger>
            <TabsTrigger value="markets" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">Markets</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Active Traders */}
              <Card className="bg-[#1a2942]/80 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Traders You're Copying</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leadTraders.slice(0, 3).map((trader) => (
                    <div key={trader.trader_id} className="flex items-center justify-between p-4 bg-[#0a1628]/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img src={trader.image} alt={trader.name} className="w-12 h-12 rounded-full" />
                        <div>
                          <h4 className="text-white font-semibold">{trader.name}</h4>
                          <p className="text-gray-400 text-sm">Win Rate: {trader.win_rate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">{trader.profit}</p>
                        <p className="text-gray-400 text-sm">{trader.followers} followers</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-[#1a2942]/80 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center py-8">
                    No recent transactions to display
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="copytrading" className="space-y-6">
            <Card className="bg-[#1a2942]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Lead Traders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {leadTraders.map((trader) => (
                    <div key={trader.trader_id} className="p-6 bg-[#0a1628]/50 rounded-lg border border-gray-700 hover:border-cyan-400/50 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img src={trader.image} alt={trader.name} className="w-16 h-16 rounded-full" />
                          <div>
                            <h4 className="text-white font-bold text-lg">{trader.name}</h4>
                            <p className="text-gray-400 text-sm">Risk: {trader.risk}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm font-semibold">
                          {trader.profit}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-xs">Followers</p>
                          <p className="text-white font-semibold">{trader.followers}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Trades</p>
                          <p className="text-white font-semibold">{trader.trades}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Win Rate</p>
                          <p className="text-white font-semibold">{trader.win_rate}</p>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white"
                        onClick={() => handleCopyTrader(trader)}
                      >
                        Copy Trader
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markets" className="space-y-6">
            <Card className="bg-[#1a2942]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Live Cryptocurrency Prices</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-gray-400 text-center py-8">Loading prices...</p>
                ) : (
                  <div className="space-y-3">
                    {cryptoPrices.map((crypto) => (
                      <div key={crypto.symbol} className="flex items-center justify-between p-4 bg-[#0a1628]/50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{crypto.symbol.substring(0, 2)}</span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{crypto.name}</h4>
                            <p className="text-gray-400 text-sm">{crypto.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-lg">${crypto.price.toLocaleString()}</p>
                          <p className={`text-sm flex items-center justify-end ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {crypto.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                            {Math.abs(crypto.change).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-[#1a2942]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center py-8">
                  No transactions to display
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Copy Trader Dialog */}
        <CopyTraderDialog
          trader={selectedTrader}
          isOpen={showCopyDialog}
          onClose={() => setShowCopyDialog(false)}
          userBalance={portfolio.balance}
        />
      </div>
    </div>
  );
};

export default Dashboard;