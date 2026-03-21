import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const TradingChart = ({ symbol = 'BINANCE:BTCUSDT' }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Initialize Chart
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
         chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 500,
      layout: {
        background: { type: 'solid', color: '#060c18' },
        textColor: '#a0a8b1',
      },
      grid: {
        vertLines: { color: '#1a2744', style: 1 },
        horzLines: { color: '#1a2744', style: 1 },
      },
      crosshair: { mode: 0 },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#1a2744',
      },
      rightPriceScale: {
        borderColor: '#1a2744',
      }
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#1fff45',
      downColor: '#ff4d4f',
      borderVisible: false,
      wickUpColor: '#1fff45',
      wickDownColor: '#ff4d4f',
    });

    const smaSeries = chart.addLineSeries({
      color: '#ffbd2e',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lastValueVisible: true,
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Generate initial historical mock data to populate the chart
    const generateHistory = () => {
       let currentPrice = symbol.includes('BTC') ? 65000 : 3500;
       const history = [];
       const now = Math.floor(Date.now() / 1000);
       for(let i = 150; i > 0; i--) {
          const open = currentPrice + (Math.random() * 20 - 10);
          const close = open + (Math.random() * 40 - 20);
          const high = Math.max(open, close) + Math.random() * 10;
          const low = Math.min(open, close) - Math.random() * 10;
          
          history.push({
            time: now - (i * 60), // 1 minute candles
            open, high, low, close
          });
          currentPrice = close;
       }
       return history;
    };
    
    const historyData = generateHistory();
    
    candlestickSeries.setData(historyData);

    // Calculate SMA (Period 20)
    const smaData = [];
    for (let i = 0; i < historyData.length; i++) {
       if (i < 20) continue;
       let sum = 0;
       for (let j = 0; j < 20; j++) sum += historyData[i - j].close;
       smaData.push({ time: historyData[i].time, value: sum / 20 });
    }
    smaSeries.setData(smaData);

    window.addEventListener('resize', handleResize);

    // 2. Connect to Finnhub WebSocket
    const finnhubKey = process.env.REACT_APP_FINNHUB_API_KEY || '';
    let ws = null;
    let mockInterval = null;

    if (finnhubKey) {
      ws = new WebSocket(`wss://ws.finnhub.io?token=${finnhubKey}`);
      ws.onopen = () => {
        ws.send(JSON.stringify({'type':'subscribe', 'symbol': symbol}));
        console.log(`Subscribed to Finnhub WebSocket: ${symbol}`);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'trade' && data.data && data.data.length > 0) {
           const trade = data.data[0];
           const tradeTime = Math.floor(trade.t / 1000);
           const tradePrice = trade.p;
           // In a real app, you aggregate tick data into OHLC candles based on the timeframe.
           // For simplicity here, we update the latest candle's close price.
           candlestickSeries.update({
             time: tradeTime,
             open: tradePrice, // Simplified aggregation
             high: tradePrice,
             low: tradePrice,
             close: tradePrice
           });
        }
      };

      ws.onerror = (e) => {
        console.error("WebSocket Error:", e);
        setError("WebSocket connection failed. Falling back to simulated data.");
        startMockStream();
      };
    } else {
      console.warn("No REACT_APP_FINNHUB_API_KEY found. Falling back to simulated tick data.");
      startMockStream();
    }

    function startMockStream() {
       let lastCandle = generateHistory().pop();
       mockInterval = setInterval(() => {
          const now = Math.floor(Date.now() / 1000);
          // If 60 seconds passed, make a new candle, else update current
          const isNewCandle = now - lastCandle.time >= 60;
          
          if (isNewCandle) {
             lastCandle = {
                time: now,
                open: lastCandle.close,
                high: lastCandle.close + Math.random() * 5,
                low: lastCandle.close - Math.random() * 5,
                close: lastCandle.close + (Math.random() * 10 - 5)
             };
          } else {
             const change = Math.random() * 6 - 3;
             lastCandle.close += change;
             lastCandle.high = Math.max(lastCandle.high, lastCandle.close);
             lastCandle.low = Math.min(lastCandle.low, lastCandle.close);
          }
          candlestickSeries.update(lastCandle);
          // Simplified real-time SMA curve following price loosely
          smaSeries.update({ time: lastCandle.time, value: lastCandle.close - 2 });
       }, 1000); // Ticks every second
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ws) {
        ws.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}));
        ws.close();
      }
      if (mockInterval) clearInterval(mockInterval);
      chart.remove();
    };
  }, [symbol]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px' }}>
      {error && <div style={{position: 'absolute', top: 10, left: 10, color: '#ffbd2e', zIndex: 10, fontSize: '12px'}}>{error}</div>}
      <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default TradingChart;
