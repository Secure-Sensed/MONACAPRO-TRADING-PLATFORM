import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const RealTimeTradingChart = ({ symbol = 'BTC/USD', interval = 1000 }) => {
  const [data, setData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [isPositive, setIsPositive] = useState(true);
  const startPriceRef = useRef(42500);
  const dataPointsLimit = 50;

  useEffect(() => {
    // Initialize with starting data
    const initialData = [];
    const now = Date.now();
    let price = startPriceRef.current;
    
    for (let i = 30; i >= 0; i--) {
      const time = new Date(now - i * interval);
      price += (Math.random() - 0.5) * 100;
      initialData.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: parseFloat(price.toFixed(2)),
        timestamp: time.getTime()
      });
    }
    
    setData(initialData);
    setCurrentPrice(price);
    startPriceRef.current = price;

    // Update chart in real-time
    const intervalId = setInterval(() => {
      setData(prevData => {
        const lastPrice = prevData[prevData.length - 1]?.price || startPriceRef.current;
        
        // Simulate realistic price movement
        const volatility = 50; // Price movement range
        const trend = Math.random() > 0.5 ? 1 : -1;
        const change = (Math.random() * volatility) * trend;
        const newPrice = parseFloat((lastPrice + change).toFixed(2));
        
        const time = new Date();
        const newDataPoint = {
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          price: newPrice,
          timestamp: time.getTime()
        };

        // Calculate price change
        const changePercent = ((newPrice - startPriceRef.current) / startPriceRef.current) * 100;
        setPriceChange(changePercent);
        setIsPositive(changePercent >= 0);
        setCurrentPrice(newPrice);

        // Keep only last N data points
        const newData = [...prevData, newDataPoint];
        if (newData.length > dataPointsLimit) {
          return newData.slice(1);
        }
        return newData;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

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

  return (
    <Card className="bg-[#1a2942]/80 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <span>{symbol}</span>
            <span className="text-sm text-gray-400">Live</span>
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
            <p className="text-white font-semibold">${startPriceRef.current.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">High</p>
            <p className="text-white font-semibold">
              ${Math.max(...data.map(d => d.price)).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Low</p>
            <p className="text-white font-semibold">
              ${Math.min(...data.map(d => d.price)).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Volume</p>
            <p className="text-white font-semibold">2.4M</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeTradingChart;
