import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Trash2,
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { leadTraders, tradingPlans, recentTransactions } from '../data/mockData';

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', balance: 5000, status: 'active', joined: '2024-12-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', balance: 12000, status: 'active', joined: '2024-11-20' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', balance: 8500, status: 'inactive', joined: '2024-10-05' },
  ]);

  const [stats, setStats] = useState({
    totalUsers: 1234,
    activeUsers: 987,
    totalRevenue: 458900,
    pendingWithdrawals: 12
  });

  const [traders, setTraders] = useState(leadTraders);
  const [plans, setPlans] = useState(tradingPlans);
  const [transactions, setTransactions] = useState(recentTransactions);

  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: 'User Deleted',
      description: 'User has been removed from the system'
    });
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
    toast({
      title: 'Status Updated',
      description: 'User status has been changed'
    });
  };

  const handleApproveTransaction = (transactionId) => {
    setTransactions(transactions.map(t =>
      t.id === transactionId
        ? { ...t, status: 'completed' }
        : t
    ));
    toast({
      title: 'Transaction Approved',
      description: 'Transaction has been processed successfully'
    });
  };

  const handleRejectTransaction = (transactionId) => {
    setTransactions(transactions.filter(t => t.id !== transactionId));
    toast({
      title: 'Transaction Rejected',
      description: 'Transaction has been cancelled'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your trading platform</p>
          </div>
          <Button 
            onClick={() => {
              localStorage.removeItem('isAdmin');
              navigate('/');
            }}
            variant="outline" 
            className="border-gray-600 text-white hover:bg-white/10"
          >
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1a2942]/80 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Users</p>
                  <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
                </div>
                <Users className="w-10 h-10 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942]/80 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Active Users</p>
                  <h3 className="text-2xl font-bold text-white">{stats.activeUsers}</h3>
                </div>
                <Users className="w-10 h-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942]/80 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</h3>
                </div>
                <DollarSign className="w-10 h-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942]/80 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Pending Withdrawals</p>
                  <h3 className="text-2xl font-bold text-white">{stats.pendingWithdrawals}</h3>
                </div>
                <TrendingUp className="w-10 h-10 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-[#1a2942]/80 border border-gray-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">Users</TabsTrigger>
            <TabsTrigger value="traders" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">Lead Traders</TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">Plans</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">Transactions</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">Settings</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-[#1a2942]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">ID</TableHead>
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Balance</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Joined</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-gray-700">
                        <TableCell className="text-white">{user.id}</TableCell>
                        <TableCell className="text-white">{user.name}</TableCell>
                        <TableCell className="text-gray-400">{user.email}</TableCell>
                        <TableCell className="text-white">${user.balance.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' 
                              ? 'bg-green-400/20 text-green-400' 
                              : 'bg-red-400/20 text-red-400'
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-400">{user.joined}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleUserStatus(user.id)}
                              className="border-gray-600 text-white hover:bg-white/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user.id)}
                              className="border-red-600 text-red-400 hover:bg-red-400/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lead Traders Tab */}
          <TabsContent value="traders">
            <Card className="bg-[#1a2942]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Lead Traders Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {traders.map((trader) => (
                    <div key={trader.id} className="p-6 bg-[#0a1628]/50 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
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
                          <p className="text-white font-semibold">{trader.winRate}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-white">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-400/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans">
            <Card className="bg-[#1a2942]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Trading Plans Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div key={plan.id} className="p-6 bg-[#0a1628]/50 rounded-lg border border-gray-700">
                      {plan.popular && (
                        <span className="inline-block px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-xs font-semibold mb-4">
                          Most Popular
                        </span>
                      )}
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-4xl font-bold text-cyan-400 mb-4">${plan.price}</p>
                      <p className="text-gray-400 mb-4">{plan.duration}</p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-white">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-400/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="bg-[#1a2942]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Transaction Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">ID</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Amount</TableHead>
                      <TableHead className="text-gray-400">Method</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-gray-700">
                        <TableCell className="text-white">{transaction.id}</TableCell>
                        <TableCell className="text-white capitalize">{transaction.type}</TableCell>
                        <TableCell className="text-white">${transaction.amount}</TableCell>
                        <TableCell className="text-gray-400">{transaction.method || transaction.asset}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === 'completed' 
                              ? 'bg-green-400/20 text-green-400' 
                              : 'bg-yellow-400/20 text-yellow-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {transaction.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveTransaction(transaction.id)}
                                className="bg-green-400 hover:bg-green-500 text-white"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectTransaction(transaction.id)}
                                className="border-red-600 text-red-400 hover:bg-red-400/10"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-[#1a2942]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">General Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="platformName" className="text-gray-300">Platform Name</Label>
                    <Input
                      id="platformName"
                      defaultValue="Moncaplus Copy Trading"
                      className="bg-[#0a1628] border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minDeposit" className="text-gray-300">Minimum Deposit ($)</Label>
                    <Input
                      id="minDeposit"
                      type="number"
                      defaultValue="500"
                      className="bg-[#0a1628] border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLeverage" className="text-gray-300">Maximum Leverage</Label>
                    <Input
                      id="maxLeverage"
                      defaultValue="1:2000"
                      className="bg-[#0a1628] border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Email Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail" className="text-gray-300">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      defaultValue="support@moncaplus.com"
                      className="bg-[#0a1628] border-gray-600 text-white"
                    />
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
