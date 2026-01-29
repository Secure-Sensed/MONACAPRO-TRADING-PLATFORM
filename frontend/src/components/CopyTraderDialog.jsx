import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, Copy } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const CopyTraderDialog = ({ trader, isOpen, onClose, userBalance = 0, onStartCopy }) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  // Mock trading history data
  const tradingHistory = [
    {
      id: 1,
      date: '2025-01-17',
      asset: 'BTC/USD',
      type: 'Buy',
      entry: 42500,
      exit: 43200,
      profit: '+1.65%',
      amount: 500,
      result: 'profit'
    },
    {
      id: 2,
      date: '2025-01-16',
      asset: 'ETH/USD',
      type: 'Sell',
      entry: 2250,
      exit: 2180,
      profit: '+3.11%',
      amount: 750,
      result: 'profit'
    },
    {
      id: 3,
      date: '2025-01-15',
      asset: 'XRP/USD',
      type: 'Buy',
      entry: 0.58,
      exit: 0.56,
      profit: '-3.45%',
      amount: 300,
      result: 'loss'
    },
    {
      id: 4,
      date: '2025-01-14',
      asset: 'BTC/USD',
      type: 'Buy',
      entry: 41800,
      exit: 42500,
      profit: '+1.67%',
      amount: 1000,
      result: 'profit'
    },
    {
      id: 5,
      date: '2025-01-13',
      asset: 'SOL/USD',
      type: 'Buy',
      entry: 98,
      exit: 105,
      profit: '+7.14%',
      amount: 600,
      result: 'profit'
    }
  ];

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid deposit amount',
        variant: 'destructive'
      });
      return;
    }

    if (amount < 100) {
      toast({
        title: 'Minimum Deposit',
        description: 'Minimum deposit amount is $100',
        variant: 'destructive'
      });
      return;
    }

    if (amount > userBalance) {
      toast({
        title: 'Insufficient Balance',
        description: 'Your balance is too low to start this copy trade.',
        variant: 'destructive'
      });
      return;
    }

    setIsDepositing(true);

    try {
      if (!onStartCopy) {
        throw new Error('Copy trading is not available.');
      }

      const result = await onStartCopy(amount);
      if (!result?.success) {
        throw new Error(result?.error || 'Unable to start copy trade.');
      }

      toast({
        title: 'Copy Trade Started',
        description: `You are now copying ${trader.name} with $${amount}`
      });
      setDepositAmount('');
      onClose();
    } catch (error) {
      toast({
        title: 'Copy Trade Failed',
        description: error?.message || 'Unable to start copy trade',
        variant: 'destructive'
      });
    } finally {
      setIsDepositing(false);
    }
  };

  if (!trader) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a2942] border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={trader.image} alt={trader.name} className="w-12 h-12 rounded-full" />
              <div className="flex items-center space-x-2">
                <span>{trader.name}</span>
                <span className="text-green-400 text-lg">{trader.profit}</span>
              </div>
            </div>
            <motion.div
              className="flex items-center space-x-2 bg-cyan-400/10 px-3 py-1.5 rounded-full"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Copy className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-semibold">Auto-Copy</span>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="deposit" className="mt-4">
          <TabsList className="bg-[#0a1628] border border-gray-700 w-full">
            <TabsTrigger 
              value="deposit" 
              className="flex-1 data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400"
            >
              Deposit & Copy
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex-1 data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400"
            >
              Trading History
            </TabsTrigger>
          </TabsList>

          {/* Deposit Tab */}
          <TabsContent value="deposit" className="space-y-6 mt-6">
            {/* Trader Stats */}
            <div className="grid grid-cols-4 gap-4">
              <motion.div 
                className="bg-[#0a1628]/50 p-4 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-gray-400 text-sm mb-1">Risk Level</p>
                <p className="text-white font-bold">{trader.risk}</p>
              </motion.div>
              <motion.div 
                className="bg-[#0a1628]/50 p-4 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                <p className="text-white font-bold">{trader.win_rate}</p>
              </motion.div>
              <motion.div 
                className="bg-[#0a1628]/50 p-4 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-gray-400 text-sm mb-1">Trades</p>
                <p className="text-white font-bold">{trader.trades}</p>
              </motion.div>
              <motion.div 
                className="bg-[#0a1628]/50 p-4 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-gray-400 text-sm mb-1">Followers</p>
                <p className="text-white font-bold">{trader.followers}</p>
              </motion.div>
            </div>

            {/* Current Balance */}
            <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">Your Current Balance:</span>
                </div>
                <span className="text-2xl font-bold text-white">${userBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Deposit Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="depositAmount" className="text-gray-300 mb-2 block">
                  Deposit Amount (Minimum $100)
                </Label>
                <Input
                  id="depositAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-[#0a1628] border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-400"
                />
                <p className="text-gray-400 text-sm mt-2">
                  This amount will be used to automatically copy {trader.name}'s trades
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleDeposit}
                  disabled={isDepositing}
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white py-6 text-lg"
                >
                  {isDepositing ? 'Processing...' : 'Deposit & Start Copying'}
                </Button>
              </motion.div>

              <div className="text-center text-gray-400 text-sm">
                <p>By copying this trader, their trades will be automatically replicated in your account</p>
                <p className="mt-2">You can stop copying at any time</p>
              </div>
            </div>
          </TabsContent>

          {/* Trading History Tab */}
          <TabsContent value="history" className="space-y-4 mt-6">
            <div className="bg-[#0a1628]/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
                Recent Trading History
              </h3>
              
              <div className="space-y-3">
                {tradingHistory.map((trade) => (
                  <motion.div
                    key={trade.id}
                    className="bg-[#0a1628]/50 p-4 rounded-lg border border-gray-700 hover:border-cyan-400/50 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          trade.result === 'profit' ? 'bg-green-400/20' : 'bg-red-400/20'
                        }`}>
                          {trade.result === 'profit' ? (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{trade.asset}</h4>
                          <p className="text-gray-400 text-sm flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {trade.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          trade.result === 'profit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.profit}
                        </p>
                        <p className="text-gray-400 text-sm">${trade.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-700">
                      <span className="text-gray-400">Entry: ${trade.entry.toLocaleString()}</span>
                      <span className="text-gray-400">Exit: ${trade.exit.toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded ${
                        trade.type === 'Buy' ? 'bg-blue-400/20 text-blue-400' : 'bg-purple-400/20 text-purple-400'
                      }`}>
                        {trade.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
                  onClick={() => {
                    // Switch to deposit tab
                    const depositTab = document.querySelector('[value="deposit"]');
                    if (depositTab) depositTab.click();
                  }}
                >
                  Start Copying This Trader
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CopyTraderDialog;
