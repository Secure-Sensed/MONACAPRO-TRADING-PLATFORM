// Mock data for the trading platform

export const tradingStats = {
  countries: '130+',
  traderAccounts: '1M+',
  monthlyTransactions: '30M+',
  averageMonthlyPayouts: '$16M+',
  monthlyTradeTurnover: '$211M'
};

export const features = [
  { value: '0.0', label: 'Pip Spreads' },
  { value: '1:2000', label: 'Leverage up to' },
  { value: '0.01', label: 'Micro Lot Trading' },
  { value: 'Fast', label: 'Withdrawals' },
  { value: 'Negative', label: 'Balance Protection' }
];

export const tradingAssets = [
  {
    id: 1,
    name: 'Futures',
    icon: '/assets/products_futures.svg',
    description: 'We offer a range of futures trading opportunities for those looking to take advantage of market volatility.',
    markets: [
      '4 Global Futures available to trade',
      'No commissions',
      'Up to 1:200 leverage',
      'Deep Liquidity'
    ]
  },
  {
    id: 2,
    name: 'Stocks CFD',
    icon: '/assets/stocks.svg',
    description: 'Explore a comprehensive array of more than 2100 large-cap Stocks CFDs spanning the ASX, NYSE, and NASDAQ exchanges.',
    markets: [
      '+2100 stocks from ASX, Nasdaq & NYSE',
      'Earn dividends',
      'MT5',
      'Up to 1:20 leverage'
    ]
  },
  {
    id: 3,
    name: 'Cryptocurrency CFD',
    icon: '/assets/crypto.svg',
    description: 'Participate in both long and short positions across our extensive selection of the world\'s largest and most widely traded Cryptocurrencies.',
    markets: [
      '57 of the most popular Cryptocurrency',
      'Trade the market 7 days a week',
      'Long or short',
      '1:200 Leverage MetaTrader4/MT5'
    ]
  },
  {
    id: 4,
    name: 'Forex CFD',
    icon: '/assets/forex.svg',
    description: 'The Forex market offers traders the chance to engage in trading activities 24 hours a day, 5 days a week.',
    markets: [
      '61 currency pairs',
      'Tight spreads from 0.0 pips',
      'Up to 1:1000 leverage',
      'Deep liquidity'
    ]
  },
  {
    id: 5,
    name: 'Commodities CFD',
    icon: '/assets/commodities.svg',
    description: 'Engage in trading energy, agriculture, and metals products akin to currency pairs against the USD or as Futures CFDs.',
    markets: [
      'Over 20 CFDs on Commodities to trade',
      'Energy, agriculture and metals',
      'Spot and Futures CFDs',
      'Up to 1:1000 leverage'
    ]
  },
  {
    id: 6,
    name: 'Indices CFD',
    icon: '/assets/indices.svg',
    description: 'Access the world\'s largest equity markets through our global Indices CFDs offering.',
    markets: [
      '25 Indices to trade from across the globe',
      'Up to 1:200 leverage',
      'No commissions',
      'MT4, MetaTrader 5'
    ]
  }
];

export const leadTraders = [
  {
    id: 1,
    name: 'John Martinez',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    profit: '+58.24%',
    followers: 1250,
    risk: 'Medium',
    trades: 342,
    winRate: '76.71%'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    profit: '+92.15%',
    followers: 2100,
    risk: 'High',
    trades: 521,
    winRate: '82.34%'
  },
  {
    id: 3,
    name: 'Michael Johnson',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    profit: '+45.67%',
    followers: 890,
    risk: 'Low',
    trades: 289,
    winRate: '71.23%'
  },
  {
    id: 4,
    name: 'Emma Williams',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    profit: '+73.89%',
    followers: 1780,
    risk: 'Medium',
    trades: 456,
    winRate: '79.45%'
  }
];

export const tradingPlans = [
  {
    id: 1,
    name: 'Starter',
    price: 500,
    duration: '30 days',
    features: [
      'Copy up to 2 traders',
      'Basic risk management',
      'Email support',
      'Market analysis reports'
    ]
  },
  {
    id: 2,
    name: 'Professional',
    price: 2000,
    duration: '30 days',
    features: [
      'Copy up to 5 traders',
      'Advanced risk management',
      'Priority support',
      'Daily market analysis',
      'Trading signals'
    ],
    popular: true
  },
  {
    id: 3,
    name: 'Elite',
    price: 5000,
    duration: '30 days',
    features: [
      'Copy unlimited traders',
      'Custom risk management',
      '24/7 VIP support',
      'Personal account manager',
      'Premium trading signals',
      'Exclusive webinars'
    ]
  }
];

export const recentTransactions = [
  {
    id: 1,
    type: 'deposit',
    amount: 1000,
    status: 'completed',
    date: '2025-01-15T10:30:00Z',
    method: 'Bank Transfer'
  },
  {
    id: 2,
    type: 'withdrawal',
    amount: 500,
    status: 'pending',
    date: '2025-01-14T15:20:00Z',
    method: 'Credit Card'
  },
  {
    id: 3,
    type: 'trade',
    amount: 250,
    status: 'completed',
    date: '2025-01-14T09:15:00Z',
    asset: 'BTC/USD'
  }
];

export const achievements = [
  { image: 'https://moncapluscopytrading.com/assets/best-partners-program-global-2024-min.svg', alt: 'Best Partners Program Global 2024' },
  { image: 'https://moncapluscopytrading.com/assets/top-trusted-financial-institution-2024-min.svg', alt: 'Top Trusted Financial Institution 2024' },
  { image: 'https://moncapluscopytrading.com/assets/most-trusted-forex-broker-global-2024-min.svg', alt: 'Most Trusted Forex Broker Global 2024' },
  { image: 'https://moncapluscopytrading.com/assets/best-fx-broker-global-2024-min.svg', alt: 'Best FX Broker Global 2024' },
  { image: 'https://moncapluscopytrading.com/assets/best-customer-support-global-2024-min.svg', alt: 'Best Customer Support Global 2024' },
  { image: 'https://moncapluscopytrading.com/assets/most-transparent-broker-asia-2024-min.svg', alt: 'Most Transparent Broker Asia 2024' }
];