import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, AlertCircle, BookOpen, BarChart2 } from 'lucide-react';
import './FinancialNewsFeed.css';

const MOCK_NEWS_STREAMS = {
  stocks: [
    { id: 1, source: 'Reuters', title: 'Global equities surge as tech earnings beat expectations again', time: '10m ago', impact: 'High', type: 'Bullish' },
    { id: 2, source: 'Bloomberg', title: 'Federal Reserve hints at potential rate cuts by Q3', time: '1h ago', impact: 'High', type: 'Neutral' },
    { id: 3, source: 'CNBC', title: 'Tesla drops 4% in pre-market following delivery report', time: '3h ago', impact: 'Medium', type: 'Bearish' },
    { id: 4, source: 'WSJ', title: 'Nvidia breaking all-time highs as AI demand accelerates', time: '5h ago', impact: 'High', type: 'Bullish' },
  ],
  crypto: [
    { id: 5, source: 'CoinDesk', title: 'Bitcoin institutional ETF inflows hit record $1B daily', time: '5m ago', impact: 'High', type: 'Bullish' },
    { id: 6, source: 'CryptoSlate', title: 'Ethereum network upgrade reduces gas fees by 90%', time: '2h ago', impact: 'Medium', type: 'Bullish' },
    { id: 7, source: 'Reuters', title: 'Regulatory committee probing major offshore exchanges', time: '6h ago', impact: 'High', type: 'Bearish' },
  ],
  insight: [
    { id: 8, source: 'mct Analysis', title: 'Daily Market Brief: Key levels to watch on EUR/USD', time: '30m ago', impact: 'Medium', type: 'Neutral' },
    { id: 9, source: 'mct Research', title: 'Quarterly Outlook: Commodities entering a super-cycle?', time: '4h ago', impact: 'High', type: 'Bullish' },
    { id: 10, source: 'Macro Edge', title: 'How employment data will shift bond yields this Friday', time: '1d ago', impact: 'Medium', type: 'Neutral' },
  ],
  company: [
    { id: 11, source: 'mct Press', title: 'Moncaplus Trading surpasses 100,000 active users globally', time: '2d ago', impact: 'High', type: 'Bullish' },
    { id: 12, source: 'mct Press', title: 'Platform update v2.4 brings advanced WebSockets terminal', time: '1w ago', impact: 'Medium', type: 'Neutral' },
  ],
  mirror: [
    { id: 13, source: 'Strategy Hub', title: 'Top algorithmic trader "AlphaOmega" hits 300% annual return', time: '1h ago', impact: 'High', type: 'Bullish' },
    { id: 14, source: 'Risk Desk', title: 'Understanding maximal drawdown limits on copied accounts', time: '12h ago', impact: 'Medium', type: 'Neutral' },
  ]
};

const FinancialNewsFeed = ({ category = 'stocks', title = 'Latest Market News' }) => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate network fetch
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setFeed(MOCK_NEWS_STREAMS[category] || MOCK_NEWS_STREAMS['stocks']);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [category]);

  const getImpactColor = (type) => {
    switch (type) {
      case 'Bullish': return 'text-green border-green';
      case 'Bearish': return 'text-danger border-danger';
      default: return 'text-muted border-muted';
    }
  };

  return (
    <div className="news-feed-container">
      <div className="news-header">
        <h2 className="news-title">
           {category === 'stocks' && <BarChart2 size={24} className="text-blue" />}
           {category === 'insight' && <BookOpen size={24} className="text-blue" />}
           {category === 'company' && <AlertCircle size={24} className="text-blue" />}
           {category === 'mirror' && <TrendingUp size={24} className="text-blue" />}
           {title}
        </h2>
        <div className="live-indicator">
          <span className="pulse-dot"></span> LIVE APP FEED
        </div>
      </div>

      {loading ? (
        <div className="news-loading text-center">
           <div className="spinner"></div>
           <p className="text-muted mt-4">Syncing live events...</p>
        </div>
      ) : (
        <div className="news-stream">
          {feed.map((article) => (
            <div key={article.id} className="news-card fade-in">
              <div className="news-card-header">
                <span className="news-source">{article.source}</span>
                <span className="news-time"><Clock size={12} /> {article.time}</span>
              </div>
              <h3 className="news-headline">{article.title}</h3>
              <div className="news-footer">
                 <span className={`news-impact-badge ${getImpactColor(article.type)}`}>
                   {article.type} Market Impact
                 </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinancialNewsFeed;
