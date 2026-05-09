import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MARKET_IDS = {
  'BTC/USD': 'bitcoin',
  'ETH/USD': 'ethereum',
  'BNB/USD': 'binancecoin',
  'ADA/USD': 'cardano',
  'SOL/USD': 'solana'
};

const MIN_POLL_INTERVAL = 30000;

const RealTimeTradingChart = ({ symbol = 'BTC/USD', interval = MIN_POLL_INTERVAL }) => {
  const [data, setData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [isPositive, setIsPositive] = useState(true);
  const [marketError, setMarketError] = useState('');
  const startPriceRef = useRef(0);
  const dataPointsLimit = 50;

  const fetchMarketPrice = useCallback(async () => {
    const marketId = MARKET_IDS[symbol] || 'bitcoin';
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${marketId}&vs_currencies=usd&include_24hr_change=true`
    );
    if (!response.ok) {
      throw new Error(`Market data request failed with status ${response.status}`);
    }
    const result = await response.json();
    const quote = result[marketId];
    if (!quote?.usd) {
      throw new Error('Market data response did not include a USD price');
    }
    return {
      price: Number(quote.usd),
      change: Number(quote.usd_24h_change || 0)
    };
  }, [symbol]);

  useEffect(() => {
    let isMounted = true;
    const pollInterval = Math.max(interval, MIN_POLL_INTERVAL);

    const pushLivePoint = async () => {
      try {
        const quote = await fetchMarketPrice();
        if (!isMounted) return;

        const time = new Date();
        const newDataPoint = {
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          price: Number(quote.price.toFixed(2)),
          timestamp: time.getTime()
        };

        if (!startPriceRef.current) {
          startPriceRef.current = newDataPoint.price;
        }

        setPriceChange(quote.change);
        setIsPositive(quote.change >= 0);
        setCurrentPrice(newDataPoint.price);
        setMarketError('');
        setData((prevData) => {
          const nextData = [...prevData, newDataPoint];
          if (nextData.length > dataPointsLimit) {
            return nextData.slice(nextData.length - dataPointsLimit);
          }
          return nextData;
        });
      } catch (error) {
        if (!isMounted) return;
        setMarketError(error?.message || 'Unable to load live market data');
      }
    };

    startPriceRef.current = 0;
    setData([]);
    setCurrentPrice(0);
    setPriceChange(0);
    setMarketError('');
    pushLivePoint();
    const intervalId = setInterval(pushLivePoint, pollInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchMarketPrice, interval]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a2942] border border-cyan-400/50 p-3 rounded-lg shadow-lg">
          <p className="text-white font-semibold">${payload[0].value.toLocaleString()}</p>
          <p className="text-gray-400 text-xs">{payload[0].payload.time}</p>
        </div>
      );
    }
    return null;
  };

  const highPrice = data.length ? Math.max(...data.map(d => d.price)) : currentPrice;
  const lowPrice = data.length ? Math.min(...data.map(d => d.price)) : currentPrice;

  return (
    <Card className="bg-[#1a2942]/80 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <span>{symbol}</span>
            <span className="text-sm text-gray-400">Live market feed</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">${currentPrice.toLocaleString()}</p>
            <div className={`flex items-center justify-end space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-semibold">
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        {marketError && (
          <p className="text-xs text-amber-300 mt-3">
            Market feed is temporarily unavailable: {marketError}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#22d3ee" : "#ef4444"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? "#22d3ee" : "#ef4444"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? "#22d3ee" : "#ef4444"}
              strokeWidth={2}
              fill="url(#colorPrice)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Open</p>
            <p className="text-white font-semibold">${Number(startPriceRef.current || currentPrice || 0).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">High</p>
            <p className="text-white font-semibold">
              ${Number(highPrice || 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Low</p>
            <p className="text-white font-semibold">
              ${Number(lowPrice || 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Source</p>
            <p className="text-white font-semibold">CoinGecko</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeTradingChart;
