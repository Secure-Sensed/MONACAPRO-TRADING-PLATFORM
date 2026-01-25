import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/apiClient';
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
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    pendingWithdrawals: 0
  });
  const [traders, setTraders] = useState([]);
  const [plans, setPlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionFilter, setTransactionFilter] = useState({
    type: 'all',
    status: 'all'
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchUsers(),
        fetchStats(),
        fetchTraders(),
        fetchPlans(),
        fetchTransactions()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTraders = async () => {
    try {
      const response = await api.get('/traders');
      if (response.data.success) {
        setTraders(response.data.traders);
      }
    } catch (error) {
      console.error('Error fetching traders:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      if (response.data.success) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/users/${userId}`);
      toast({
        title: 'User Deleted',
        description: 'User has been removed from the system'
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await api.put(`/users/${userId}`, { status: newStatus });
      toast({
        title: 'Status Updated',
        description: 'User status has been changed'
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive'
      });
    }
  };

  const handleApproveTransaction = async (transactionId) => {
    try {
      await api.put(`/transactions/${transactionId}/approve`, {});
      toast({
        title: 'Transaction Approved',
        description: 'Transaction has been processed successfully'
      });
      fetchTransactions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve transaction',
        variant: 'destructive'
      });
    }
  };

  const handleRejectTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to reject this transaction?')) return;
    
    try {
      await api.put(`/transactions/${transactionId}/reject`, {});
      toast({
        title: 'Transaction Rejected',
        description: 'Transaction has been cancelled'
      });
      fetchTransactions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject transaction',
        variant: 'destructive'
      });
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const typeMatch = transactionFilter.type === 'all' || tx.type === transactionFilter.type;
    const statusMatch = transactionFilter.status === 'all' || tx.status === transactionFilter.status;
    return typeMatch && statusMatch;
  });

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] flex items-center justify-center pt-20">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading admin panel...</p>
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
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome, {user?.full_name} ({user?.username})</p>
          </div>
          <Button 
            onClick={handleLogout}
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
                      <TableRow key={user.user_id} className="border-gray-700">
                        <TableCell className="text-white">{user.user_id}</TableCell>
                        <TableCell className="text-white">{user.full_name}</TableCell>
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
                        <TableCell className="text-gray-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleUserStatus(user.user_id, user.status)}
                              className="border-gray-600 text-white hover:bg-white/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user.user_id)}
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
                    <div key={trader.trader_id} className="p-6 bg-[#0a1628]/50 rounded-lg border border-gray-700">
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
                          <p className="text-white font-semibold">{trader.win_rate}</p>
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
                    <div key={plan.plan_id} className="p-6 bg-[#0a1628]/50 rounded-lg border border-gray-700">
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
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Filter by Type</Label>
                    <select
                      value={transactionFilter.type}
                      onChange={(e) => setTransactionFilter({ ...transactionFilter, type: e.target.value })}
                      className="w-full bg-[#0a1628] border border-gray-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="all">All</option>
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="trade">Trade</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Filter by Status</Label>
                    <select
                      value={transactionFilter.status}
                      onChange={(e) => setTransactionFilter({ ...transactionFilter, status: e.target.value })}
                      className="w-full bg-[#0a1628] border border-gray-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">ID</TableHead>
                      <TableHead className="text-gray-400">User</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Amount</TableHead>
                      <TableHead className="text-gray-400">Method</TableHead>
                      <TableHead className="text-gray-400">Details</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.transaction_id} className="border-gray-700">
                        <TableCell className="text-white">{transaction.transaction_id}</TableCell>
                        <TableCell className="text-gray-400">
                          <div className="text-sm text-white">{transaction.user_name || 'User'}</div>
                          <div className="text-xs text-gray-500">{transaction.user_email || transaction.user_id}</div>
                        </TableCell>
                        <TableCell className="text-white capitalize">{transaction.type}</TableCell>
                        <TableCell className="text-white">${transaction.amount}</TableCell>
                        <TableCell className="text-gray-400">{transaction.method || transaction.asset || 'N/A'}</TableCell>
                        <TableCell className="text-gray-400 text-xs">
                          {transaction.details?.address || transaction.details?.account || '—'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === 'completed' 
                              ? 'bg-green-400/20 text-green-400' 
                              : transaction.status === 'rejected'
                                ? 'bg-red-400/20 text-red-400'
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
                                onClick={() => handleApproveTransaction(transaction.transaction_id)}
                                className="bg-green-400 hover:bg-green-500 text-white"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectTransaction(transaction.transaction_id)}
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
                      defaultValue="Monacap Trading Pro"
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
                      defaultValue="support@monacaptradingpro.com"
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
