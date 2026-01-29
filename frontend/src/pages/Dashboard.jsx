import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Copy, 
  Wallet,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../hooks/use-toast';
import CopyTraderDialog from '../components/CopyTraderDialog';
import RealTimeTradingChart from '../components/RealTimeTradingChart';

const DEFAULT_WALLETS = {
  bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  ethereum: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8',
  usdt_trc20: 'TXYZopYRdj2D9XRtbG4uTdwZjX9c2V4h9q',
  usdt_erc20: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8',
  bank_transfer: {
    bank_name: 'Chase Bank',
    account_name: 'Monacap Trading Pro LLC',
    account_number: '1234567890',
    routing_number: '021000021',
    swift_code: 'CHASUS33'
  },
  paypal: 'payments@monacaptradingpro.com'
};

const parseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
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
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState({});
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    country: '',
    picture: ''
  });
  const [depositForm, setDepositForm] = useState({
    amount: '',
    method: 'bitcoin'
  });
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    method: 'bitcoin',
    address: ''
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const MIN_DEPOSIT = 250;
  const MIN_WITHDRAWAL = 100;
  const MAX_WITHDRAWAL = 100000;

  const handleCopyTrader = (trader) => {
    setSelectedTrader(trader);
    setShowCopyDialog(true);
  };

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        phone: user.phone || '',
        country: user.country || '',
        picture: user.picture || ''
      });
    }
  }, [user]);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.user_id) return;
    try {
      const refreshed = await refreshUser();
      const balance = parseNumber(refreshed?.balance ?? user?.balance, 0);

      const { data: activeCopies, error: copiesError } = await supabase
        .from('copy_trades')
        .select('current_profit')
        .eq('user_id', user.user_id)
        .eq('status', 'active');

      if (copiesError) {
        console.error('Error fetching copy trades:', copiesError.message || copiesError);
      }

      const totalProfit = (activeCopies || []).reduce(
        (sum, row) => sum + parseNumber(row.current_profit),
        0
      );

      const { count: totalTrades, error: tradesError } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.user_id)
        .eq('type', 'trade');

      if (tradesError) {
        console.error('Error fetching trade count:', tradesError.message || tradesError);
      }

      const activeCopiesCount = activeCopies?.length ?? 0;
      const profitPercentage = balance > 0 ? (totalProfit / balance) * 100 : 0;

      setPortfolio({
        balance,
        profit: totalProfit,
        profitPercentage: Math.round(profitPercentage * 100) / 100,
        activeCopies: activeCopiesCount,
        totalTrades: totalTrades || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.user_id, user?.balance, refreshUser]);

  const fetchLeadTraders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('traders')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching traders:', error.message || error);
        return;
      }

      const mapped = (data || []).map((row) => ({
        trader_id: row.id,
        name: row.name,
        image: row.image,
        profit: row.profit,
        risk: row.risk,
        win_rate: row.win_rate,
        followers: row.followers,
        trades: row.trades,
        is_active: row.is_active,
        created_at: row.created_at
      }));

      setLeadTraders(mapped);
    } catch (error) {
      console.error('Error fetching traders:', error);
    }
  }, []);

  const fetchCryptoPrices = useCallback(async () => {
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
  }, []);

  const fetchTransactions = useCallback(async () => {
    if (!user?.user_id) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error.message || error);
        return;
      }

      const mapped = (data || []).map((row) => ({
        transaction_id: row.id,
        user_id: row.user_id,
        type: row.type,
        amount: parseNumber(row.amount),
        method: row.method,
        asset: row.asset,
        details: row.details,
        status: row.status,
        processed_by: row.processed_by,
        processed_at: row.processed_at,
        date: row.created_at,
        created_at: row.created_at
      }));

      setTransactions(mapped);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [user?.user_id]);

  const fetchWallets = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('wallet_addresses').select('method, address');
      if (error) {
        console.error('Error fetching wallets:', error.message || error);
      }
      const walletMap = { ...DEFAULT_WALLETS };
      (data || []).forEach((row) => {
        walletMap[row.method] = row.address;
      });
      setWallets(walletMap);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  }, []);

  useEffect(() => {
    fetchCryptoPrices();
    const priceInterval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(priceInterval);
  }, [fetchCryptoPrices]);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
    fetchLeadTraders();
    fetchTransactions();
    fetchWallets();
  }, [user, fetchDashboardData, fetchLeadTraders, fetchTransactions, fetchWallets]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = Number(depositForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Enter a valid deposit amount.',
        variant: 'destructive'
      });
      return;
    }
    if (amount < MIN_DEPOSIT) {
      toast({
        title: 'Deposit too small',
        description: `Minimum deposit is $${MIN_DEPOSIT}.`,
        variant: 'destructive'
      });
      return;
    }
    setActionLoading(true);
    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: user.user_id,
        type: 'deposit',
        amount,
        method: depositForm.method
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Deposit submitted',
        description: 'Your deposit request is pending approval.'
      });
      setDepositForm({ amount: '', method: depositForm.method });
      await fetchTransactions();
      await fetchDashboardData();
    } catch (error) {
      toast({
        title: 'Deposit failed',
        description: error?.message || 'Unable to submit deposit',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const amount = Number(withdrawForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Enter a valid withdrawal amount.',
        variant: 'destructive'
      });
      return;
    }
    if (amount < MIN_WITHDRAWAL) {
      toast({
        title: 'Withdrawal too small',
        description: `Minimum withdrawal is $${MIN_WITHDRAWAL}.`,
        variant: 'destructive'
      });
      return;
    }
    if (amount > MAX_WITHDRAWAL) {
      toast({
        title: 'Withdrawal too large',
        description: `Maximum withdrawal is $${MAX_WITHDRAWAL}.`,
        variant: 'destructive'
      });
      return;
    }
    if (amount > portfolio.balance) {
      toast({
        title: 'Insufficient balance',
        description: 'Your balance is too low for this withdrawal.',
        variant: 'destructive'
      });
      return;
    }
    setActionLoading(true);
    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: user.user_id,
        type: 'withdrawal',
        amount,
        method: withdrawForm.method,
        details: {
          address: withdrawForm.address
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Withdrawal submitted',
        description: 'Your withdrawal request is pending approval.'
      });
      setWithdrawForm({ amount: '', method: withdrawForm.method, address: '' });
      await fetchTransactions();
      await fetchDashboardData();
    } catch (error) {
      toast({
        title: 'Withdrawal failed',
        description: error?.message || 'Unable to submit withdrawal',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = { ...profileForm };
      const { error } = await supabase.from('profiles').update(payload).eq('id', user.user_id);
      if (error) {
        throw error;
      }
      toast({
        title: 'Profile updated',
        description: 'Your profile changes have been saved.'
      });
      await refreshUser();
    } catch (error) {
      toast({
        title: 'Profile update failed',
        description: error?.message || 'Unable to update profile',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartCopy = async (amount) => {
    if (!selectedTrader?.trader_id) {
      return { success: false, error: 'Select a trader to copy.' };
    }
    if (!user?.user_id) {
      return { success: false, error: 'Please log in to start copying.' };
    }
    if (amount > portfolio.balance) {
      return { success: false, error: 'Insufficient balance.' };
    }

    const { error } = await supabase.from('copy_trades').insert({
      user_id: user.user_id,
      trader_id: selectedTrader.trader_id,
      amount,
      status: 'active',
      current_profit: 0
    });

    if (error) {
      return { success: false, error: error.message || 'Unable to start copy trade.' };
    }

    await fetchDashboardData();
    return { success: true };
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
    : 'MP';

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white"
        style={{
          fontFamily: "'Manrope', sans-serif",
          background: 'radial-gradient(1200px 500px at 20% -10%, rgba(122, 167, 255, 0.2), transparent 60%), radial-gradient(900px 400px at 85% 10%, rgba(233, 190, 116, 0.18), transparent 60%), #05070f'
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-300 mx-auto mb-4"></div>
          <p className="text-lg tracking-wide text-gray-200">Preparing your private terminal...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden text-white"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: 'radial-gradient(1200px 500px at 20% -10%, rgba(122, 167, 255, 0.25), transparent 60%), radial-gradient(900px 400px at 85% 10%, rgba(233, 190, 116, 0.2), transparent 60%), #05070f'
      }}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-[120px] animate-pulse-slow"></div>
      <div className="pointer-events-none absolute top-40 -left-24 h-80 w-80 rounded-full bg-amber-300/20 blur-[130px] animate-pulse-slow"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200/80">
              Private Trading Terminal
            </div>
            <h1 className="text-4xl sm:text-5xl text-white" style={{ fontFamily: "'Gloock', serif" }}>
              Portfolio Concierge
            </h1>
            <p className="text-gray-300 max-w-2xl">
              Welcome back, {user?.full_name}. Monitor liquidity, manage positions, and route capital with institutional-grade control.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
              <div>
                <p className="text-sm text-gray-200">{user?.email}</p>
                <p className="text-xs text-gray-500">Member tier: Platinum</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setActiveTab('funding')}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white"
              >
                Fund Account
              </Button>
              <Button
                onClick={() => setActiveTab('profile')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Edit Profile
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: 'Total Balance',
              value: `$${portfolio.balance.toLocaleString()}`,
              icon: Wallet,
              accent: 'text-cyan-300'
            },
            {
              label: 'Net Profit',
              value: `$${portfolio.profit.toLocaleString()}`,
              icon: DollarSign,
              accent: 'text-emerald-300',
              meta: `${portfolio.profitPercentage >= 0 ? '+' : ''}${portfolio.profitPercentage}%`
            },
            {
              label: 'Active Copies',
              value: portfolio.activeCopies,
              icon: Copy,
              accent: 'text-sky-300'
            },
            {
              label: 'Total Trades',
              value: portfolio.totalTrades,
              icon: Activity,
              accent: 'text-amber-300'
            }
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-3xl p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10">
                <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">{card.label}</p>
                      <h3 className="text-2xl font-semibold text-white">{card.value}</h3>
                      {card.meta && (
                        <p className="text-sm text-emerald-300 mt-2 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {card.meta}
                        </p>
                      )}
                    </div>
                    <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${card.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-Time Trading Chart */}
        <div className="mb-10 rounded-[32px] p-[1px] bg-gradient-to-r from-white/10 via-white/5 to-white/10">
          <div className="rounded-[32px] bg-[#0b1220]/80 border border-white/5 backdrop-blur-xl p-4">
            <RealTimeTradingChart symbol="BTC/USD" interval={1000} />
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 rounded-full px-2 py-2 gap-2 flex flex-wrap">
            {[
              { value: 'overview', label: 'Overview' },
              { value: 'copytrading', label: 'Copy Trading' },
              { value: 'markets', label: 'Markets' },
              { value: 'funding', label: 'Funding' },
              { value: 'transactions', label: 'Transactions' },
              { value: 'profile', label: 'Profile' }
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-full px-4 data-[state=active]:bg-white/15 data-[state=active]:text-white text-gray-300"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-white">Traders You&apos;re Copying</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leadTraders.slice(0, 3).map((trader) => (
                    <div key={trader.trader_id} className="flex items-center justify-between p-4 bg-[#0a1628]/50 rounded-2xl border border-white/5">
                      <div className="flex items-center space-x-3">
                        <img src={trader.image} alt={trader.name} className="w-12 h-12 rounded-full border border-white/10" />
                        <div>
                          <h4 className="text-white font-semibold">{trader.name}</h4>
                          <p className="text-gray-400 text-sm">Win Rate: {trader.win_rate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-300 font-semibold">{trader.profit}</p>
                        <p className="text-gray-500 text-sm">{trader.followers} followers</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      No recent transactions to display
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {transactions.slice(0, 3).map((tx) => (
                        <div key={tx.transaction_id} className="flex items-center justify-between p-4 bg-[#0a1628]/50 rounded-2xl border border-white/5">
                          <div>
                            <p className="text-white font-semibold capitalize">{tx.type}</p>
                            <p className="text-gray-500 text-sm">{tx.method || 'N/A'} • {new Date(tx.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">${Number(tx.amount || 0).toLocaleString()}</p>
                            <p className={`text-xs ${tx.status === 'completed' ? 'text-emerald-300' : 'text-amber-300'}`}>{tx.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="copytrading" className="space-y-6">
            <Card className="bg-white/5 border border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white">Top Lead Traders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {leadTraders.map((trader) => (
                    <div key={trader.trader_id} className="p-6 bg-[#0a1628]/60 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img src={trader.image} alt={trader.name} className="w-16 h-16 rounded-full border border-white/10" />
                          <div>
                            <h4 className="text-white font-bold text-lg">{trader.name}</h4>
                            <p className="text-gray-400 text-sm">Risk: {trader.risk}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-emerald-400/20 text-emerald-300 rounded-full text-sm font-semibold">
                          {trader.profit}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-gray-500 text-xs">Followers</p>
                          <p className="text-white font-semibold">{trader.followers}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Trades</p>
                          <p className="text-white font-semibold">{trader.trades}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Win Rate</p>
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
            <Card className="bg-white/5 border border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white">Live Cryptocurrency Prices</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-gray-400 text-center py-8">Loading prices...</p>
                ) : (
                  <div className="space-y-3">
                    {cryptoPrices.map((crypto) => (
                      <div key={crypto.symbol} className="flex items-center justify-between p-4 bg-[#0a1628]/50 rounded-2xl border border-white/5">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{crypto.symbol.substring(0, 2)}</span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{crypto.name}</h4>
                            <p className="text-gray-500 text-sm">{crypto.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-lg">${crypto.price.toLocaleString()}</p>
                          <p className={`text-sm flex items-center justify-end ${crypto.change >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>
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

          <TabsContent value="funding" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-white">Deposit Funds</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDeposit} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Amount (USD)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={depositForm.amount}
                        onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                        className="bg-[#0a1628] border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Payment Method</Label>
                      <select
                        value={depositForm.method}
                        onChange={(e) => setDepositForm({ ...depositForm, method: e.target.value })}
                        className="w-full bg-[#0a1628] border border-gray-600 text-white rounded-md px-3 py-2"
                      >
                        {Object.keys(wallets).length === 0 && <option value="bitcoin">bitcoin</option>}
                        {Object.keys(wallets).map((method) => (
                          <option key={method} value={method}>
                            {method.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                      {wallets[depositForm.method] && (
                        <p className="text-xs text-gray-400 break-all">
                          Deposit address: {typeof wallets[depositForm.method] === 'string' ? wallets[depositForm.method] : JSON.stringify(wallets[depositForm.method])}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">Minimum deposit: ${MIN_DEPOSIT}</p>
                    </div>
                    <Button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white"
                    >
                      Submit Deposit
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-white">Withdraw Funds</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleWithdrawal} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Amount (USD)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={withdrawForm.amount}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                        className="bg-[#0a1628] border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Withdrawal Method</Label>
                      <select
                        value={withdrawForm.method}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })}
                        className="w-full bg-[#0a1628] border border-gray-600 text-white rounded-md px-3 py-2"
                      >
                        {Object.keys(wallets).length === 0 && <option value="bitcoin">bitcoin</option>}
                        {Object.keys(wallets).map((method) => (
                          <option key={method} value={method}>
                            {method.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Destination Address / Account</Label>
                      <Input
                        value={withdrawForm.address}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, address: e.target.value })}
                        className="bg-[#0a1628] border-gray-600 text-white"
                        placeholder="Enter wallet address or account details"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Minimum withdrawal: ${MIN_WITHDRAWAL} · Maximum withdrawal: ${MAX_WITHDRAWAL}
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white"
                    >
                      Submit Withdrawal
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-white/5 border border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No transactions to display
                  </p>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div key={transaction.transaction_id} className="flex items-center justify-between p-4 bg-[#0a1628]/50 rounded-2xl border border-white/5">
                        <div>
                          <p className="text-white font-semibold capitalize">{transaction.type}</p>
                          <p className="text-gray-500 text-sm">
                            {transaction.method || transaction.asset || 'N/A'} • {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">${Number(transaction.amount || 0).toLocaleString()}</p>
                          <p className={`text-xs ${transaction.status === 'completed' ? 'text-emerald-300' : transaction.status === 'rejected' ? 'text-red-400' : 'text-amber-300'}`}>
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/5 border border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-24 w-24 rounded-full overflow-hidden border border-white/20 bg-white/10 flex items-center justify-center text-xl font-semibold">
                      {profileForm.picture ? (
                        <img src={profileForm.picture} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <p className="text-xs text-gray-400">Profile status: Verified</p>
                  </div>
                  <form onSubmit={handleProfileSave} className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Full Name</Label>
                      <Input
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                        className="bg-[#0a1628] border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Phone</Label>
                        <Input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="bg-[#0a1628] border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Country</Label>
                        <Input
                          value={profileForm.country}
                          onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                          className="bg-[#0a1628] border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Profile Image URL</Label>
                      <Input
                        value={profileForm.picture}
                        onChange={(e) => setProfileForm({ ...profileForm, picture: e.target.value })}
                        className="bg-[#0a1628] border-gray-600 text-white"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={actionLoading}
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white"
                    >
                      Save Profile
                    </Button>
                  </form>
                </div>
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
          onStartCopy={handleStartCopy}
        />
      </div>
    </div>
  );
};

export default Dashboard;
