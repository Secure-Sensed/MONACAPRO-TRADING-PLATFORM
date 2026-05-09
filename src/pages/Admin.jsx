import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  CheckCircle,
  CircleDollarSign,
  ClipboardList,
  Edit,
  Eye,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  XCircle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { toast } from '../hooks/use-toast';
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
  TableRow
} from '../components/ui/table';

const emptyUserForm = {
  full_name: '',
  email: '',
  phone: '',
  country: '',
  role: 'user',
  status: 'active',
  balance: '0',
  kyc_status: 'pending'
};

const emptyTraderForm = {
  name: '',
  image: '',
  profit: '',
  risk: 'Medium',
  win_rate: '',
  win_rate_percent: '',
  monthly_return: '',
  max_drawdown: '',
  rating: '',
  followers: '0',
  trades: '0',
  is_active: true
};

const emptyPlanForm = {
  name: '',
  price: '',
  duration: '',
  features: '',
  popular: false,
  is_active: true
};

const defaultPlatformSettings = {
  platform_name: 'Monacap Trading Pro',
  support_email: 'support@monacaptradingpro.com',
  support_phone: '+1 (800) 555-0123',
  support_address: '123 Financial District, Sydney, NSW 2000, Australia',
  min_deposit: '250',
  min_withdrawal: '100',
  max_withdrawal: '100000',
  max_leverage: '1:2000',
  registrations_enabled: true,
  deposits_enabled: true,
  withdrawals_enabled: true,
  copy_trading_enabled: true,
  maintenance_mode: false,
  announcement: ''
};

const parseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === '') return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const nullableNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const currency = (value) =>
  `$${parseNumber(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;

const shortId = (value = '') => (value ? `${value.slice(0, 8)}...` : '-');

const formatPaymentMethod = (method = '') =>
  method
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const serializeDepositAccount = (address) => {
  if (address === null || address === undefined) return '';
  if (typeof address === 'string') return address;
  return JSON.stringify(address, null, 2);
};

const parseDepositAccount = (value) => {
  const trimmed = value.trim();
  if (!trimmed) throw new Error('Deposit account details are required');

  try {
    return JSON.parse(trimmed);
  } catch (_error) {
    return trimmed;
  }
};

const renderDepositAccount = (address) => {
  if (address === null || address === undefined) return 'Not configured';
  if (typeof address === 'string') return address;
  if (Array.isArray(address)) return address.join(', ');
  if (typeof address === 'object') {
    return Object.entries(address)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${formatPaymentMethod(key)}: ${value}`)
      .join(' | ');
  }
  return String(address);
};

const renderTransactionDetails = (details) => {
  if (!details) return '-';
  if (details.address) return details.address;
  if (details.account) return renderDepositAccount(details.account);
  if (details.deposit_account) return renderDepositAccount(details.deposit_account);
  return renderDepositAccount(details);
};

const statusClass = (status) => {
  if (status === 'active' || status === 'completed' || status === 'verified') {
    return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300';
  }
  if (status === 'inactive' || status === 'rejected') {
    return 'border-rose-400/30 bg-rose-400/10 text-rose-300';
  }
  return 'border-amber-400/30 bg-amber-400/10 text-amber-300';
};

const Pill = ({ children, className = '' }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}>
    {children}
  </span>
);

const adminTabs = [
  ['users', Users, 'Users'],
  ['transactions', Wallet, 'Transactions'],
  ['copy-trades', BarChart3, 'Copy Trades'],
  ['traders', TrendingUp, 'Traders'],
  ['plans', ClipboardList, 'Plans'],
  ['funding', CircleDollarSign, 'Deposit Accounts'],
  ['messages', Mail, 'Messages'],
  ['settings', Settings, 'Settings'],
  ['audit', Activity, 'Audit']
];

const tabFromPath = (pathname) => {
  const lastSegment = pathname.split('/').filter(Boolean).pop();
  if (!lastSegment || lastSegment === 'admin') return 'users';
  return adminTabs.some(([value]) => value === lastSegment) ? lastSegment : 'users';
};

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const activeTab = tabFromPath(location.pathname);

  const [users, setUsers] = useState([]);
  const [traders, setTraders] = useState([]);
  const [plans, setPlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [depositAccounts, setDepositAccounts] = useState([]);
  const [copyTrades, setCopyTrades] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [platformSettings, setPlatformSettings] = useState(defaultPlatformSettings);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [transactionFilter, setTransactionFilter] = useState({ type: 'all', status: 'all' });

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [editingTraderId, setEditingTraderId] = useState(null);
  const [traderForm, setTraderForm] = useState(emptyTraderForm);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState(emptyPlanForm);
  const [editingAccountMethod, setEditingAccountMethod] = useState(null);
  const [accountForm, setAccountForm] = useState({ method: '', address: '' });

  const fetchUsers = useCallback(async () => {
    const syncResult = await supabase.rpc('sync_auth_users_to_profiles');
    if (syncResult.error) {
      console.warn('sync_auth_users_to_profiles unavailable:', syncResult.error.message || syncResult.error);
    }

    const rpcResult = await supabase.rpc('admin_list_users');

    if (!rpcResult.error) {
      setUsers(
        (rpcResult.data || []).map((row) => ({
          ...row,
          id: row.user_id,
          balance: parseNumber(row.balance),
          profile_exists: row.profile_exists !== false
        }))
      );
      return;
    }

    console.warn('admin_list_users unavailable, falling back to profiles:', rpcResult.error.message || rpcResult.error);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setUsers(
      (data || []).map((row) => ({
        ...row,
        user_id: row.id,
        balance: parseNumber(row.balance),
        profile_exists: true
      }))
    );
  }, []);

  const fetchTraders = useCallback(async () => {
    const { data, error } = await supabase
      .from('traders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setTraders((data || []).map((row) => ({ ...row, trader_id: row.id })));
  }, []);

  const fetchPlans = useCallback(async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;
    setPlans((data || []).map((row) => ({ ...row, plan_id: row.id, price: parseNumber(row.price) })));
  }, []);

  const fetchTransactions = useCallback(async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, profile:profiles(full_name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setTransactions(
      (data || []).map((row) => ({
        ...row,
        transaction_id: row.id,
        user_name: row.profile?.full_name,
        user_email: row.profile?.email,
        amount: parseNumber(row.amount),
        date: row.created_at
      }))
    );
  }, []);

  const fetchDepositAccounts = useCallback(async () => {
    const { data, error } = await supabase
      .from('wallet_addresses')
      .select('method, address, updated_at')
      .order('method', { ascending: true });

    if (error) throw error;
    setDepositAccounts(data || []);
  }, []);

  const fetchCopyTrades = useCallback(async () => {
    const { data, error } = await supabase
      .from('copy_trades')
      .select('*, trader:traders(name), profile:profiles(full_name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setCopyTrades((data || []).map((row) => ({ ...row, amount: parseNumber(row.amount) })));
  }, []);

  const fetchActivityLogs = useCallback(async () => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*, profile:profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.warn('Activity logs unavailable:', error.message || error);
      setActivityLogs([]);
      return;
    }
    setActivityLogs(data || []);
  }, []);

  const fetchContactMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Contact messages unavailable:', error.message || error);
      setContactMessages([]);
      return;
    }
    setContactMessages(data || []);
  }, []);

  const fetchPlatformSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error) {
      console.warn('Platform settings unavailable:', error.message || error);
      return;
    }

    if (data) {
      setPlatformSettings({
        ...defaultPlatformSettings,
        ...data,
        min_deposit: String(data.min_deposit ?? defaultPlatformSettings.min_deposit),
        min_withdrawal: String(data.min_withdrawal ?? defaultPlatformSettings.min_withdrawal),
        max_withdrawal: String(data.max_withdrawal ?? defaultPlatformSettings.max_withdrawal)
      });
    }
  }, []);

  const fetchAllData = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setRefreshing(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchTraders(),
        fetchPlans(),
        fetchTransactions(),
        fetchDepositAccounts(),
        fetchCopyTrades(),
        fetchActivityLogs(),
        fetchContactMessages(),
        fetchPlatformSettings()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Unable to load admin data',
        description: error?.message || 'Check your Supabase permissions and try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchActivityLogs, fetchContactMessages, fetchCopyTrades, fetchDepositAccounts, fetchPlans, fetchPlatformSettings, fetchTraders, fetchTransactions, fetchUsers]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchAllData();
  }, [fetchAllData, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return undefined;

    const channel = supabase
      .channel('admin-command-center')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchUsers();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchTransactions();
        fetchUsers();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallet_addresses' }, fetchDepositAccounts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'traders' }, fetchTraders)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'plans' }, fetchPlans)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'copy_trades' }, fetchCopyTrades)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, fetchActivityLogs)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, fetchContactMessages)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'platform_settings' }, fetchPlatformSettings)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchActivityLogs, fetchContactMessages, fetchCopyTrades, fetchDepositAccounts, fetchPlans, fetchPlatformSettings, fetchTraders, fetchTransactions, fetchUsers, isAdmin]);

  const selectedUser = useMemo(
    () => users.find((row) => row.user_id === selectedUserId) || null,
    [selectedUserId, users]
  );

  useEffect(() => {
    if (!selectedUser) return;
    setUserForm({
      full_name: selectedUser.full_name || '',
      email: selectedUser.email || '',
      phone: selectedUser.phone || '',
      country: selectedUser.country || '',
      role: selectedUser.role || 'user',
      status: selectedUser.status || 'active',
      balance: String(parseNumber(selectedUser.balance)),
      kyc_status: selectedUser.kyc_status || 'pending'
    });
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUserId && users.length > 0) {
      const firstNonAdmin = users.find((row) => row.role !== 'admin') || users[0];
      setSelectedUserId(firstNonAdmin.user_id);
    }
  }, [selectedUserId, users]);

  const metrics = useMemo(() => {
    const userRows = users.filter((row) => row.role !== 'admin');
    const completedDeposits = transactions.filter((tx) => tx.type === 'deposit' && tx.status === 'completed');
    const pendingTransactions = transactions.filter((tx) => tx.status === 'pending');
    const pendingWithdrawals = pendingTransactions.filter((tx) => tx.type === 'withdrawal');
    const totalBalances = userRows.reduce((sum, row) => sum + parseNumber(row.balance), 0);
    const totalRevenue = completedDeposits.reduce((sum, row) => sum + parseNumber(row.amount), 0);
    const activeCopyValue = copyTrades
      .filter((row) => row.status === 'active')
      .reduce((sum, row) => sum + parseNumber(row.amount), 0);

    return {
      totalUsers: userRows.length,
      activeUsers: userRows.filter((row) => row.status === 'active').length,
      kycPending: userRows.filter((row) => row.kyc_status === 'pending').length,
      totalBalances,
      totalRevenue,
      pendingTransactions: pendingTransactions.length,
      pendingWithdrawals: pendingWithdrawals.length,
      activeCopyValue,
      activeTraders: traders.filter((row) => row.is_active).length,
      activePlans: plans.filter((row) => row.is_active !== false).length,
      unreadMessages: contactMessages.filter((row) => row.status === 'new').length
    };
  }, [contactMessages, copyTrades, plans, traders, transactions, users]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    return users.filter((row) => {
      const statusMatch = userStatusFilter === 'all' || row.status === userStatusFilter || row.kyc_status === userStatusFilter;
      const queryMatch =
        !query ||
        [row.full_name, row.email, row.phone, row.country, row.user_id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return statusMatch && queryMatch;
    });
  }, [userSearch, userStatusFilter, users]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const typeMatch = transactionFilter.type === 'all' || tx.type === transactionFilter.type;
      const statusMatch = transactionFilter.status === 'all' || tx.status === transactionFilter.status;
      return typeMatch && statusMatch;
    });
  }, [transactionFilter, transactions]);

  const recentQueue = useMemo(
    () => transactions.filter((tx) => tx.status === 'pending').slice(0, 6),
    [transactions]
  );

  const saveActivity = async (action, entityType, entityId, changes = {}) => {
    if (!user?.user_id) return;
    await supabase.from('activity_logs').insert({
      user_id: user.user_id,
      action,
      entity_type: entityType,
      entity_id: entityId ? String(entityId) : null,
      changes
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleSaveUser = async (event) => {
    event.preventDefault();
    if (!selectedUser) return;

    setSaving(true);
    try {
      const payload = {
        full_name: userForm.full_name.trim(),
        email: userForm.email.trim(),
        phone: userForm.phone.trim() || null,
        country: userForm.country.trim() || null,
        role: userForm.role,
        status: userForm.status,
        balance: parseNumber(userForm.balance),
        kyc_status: userForm.kyc_status
      };

      const query = selectedUser.profile_exists === false
        ? supabase.from('profiles').upsert({ id: selectedUser.user_id, ...payload }, { onConflict: 'id' })
        : supabase.from('profiles').update(payload).eq('id', selectedUser.user_id);
      const { error } = await query;
      if (error) throw error;

      await saveActivity('update_user', 'profiles', selectedUser.user_id, payload);
      toast({ title: 'User updated', description: `${payload.full_name || payload.email} has been updated.` });
      await Promise.all([fetchUsers(), fetchActivityLogs()]);
    } catch (error) {
      toast({
        title: 'Unable to update user',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleUserStatus = async (targetUser) => {
    const nextStatus = targetUser.status === 'active' ? 'inactive' : 'active';
    try {
      const payload = {
        id: targetUser.user_id,
        email: targetUser.email || '',
        full_name: targetUser.full_name || '',
        role: targetUser.role || 'user',
        status: nextStatus,
        balance: parseNumber(targetUser.balance),
        kyc_status: targetUser.kyc_status || 'pending'
      };
      const query = targetUser.profile_exists === false
        ? supabase.from('profiles').upsert(payload, { onConflict: 'id' })
        : supabase.from('profiles').update({ status: nextStatus }).eq('id', targetUser.user_id);
      const { error } = await query;
      if (error) throw error;
      await saveActivity('toggle_user_status', 'profiles', targetUser.user_id, { status: nextStatus });
      toast({ title: 'Status updated', description: `${targetUser.email} is now ${nextStatus}.` });
      await Promise.all([fetchUsers(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to update status', description: error?.message, variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!window.confirm(`Delete ${targetUser.email}? This removes their profile and linked records.`)) return;

    try {
      const { error } = await supabase.rpc('admin_delete_user', { target_id: targetUser.user_id });
      if (error) throw error;
      if (selectedUserId === targetUser.user_id) setSelectedUserId(null);
      toast({ title: 'User deleted', description: `${targetUser.email} has been removed.` });
      await fetchAllData({ quiet: true });
    } catch (error) {
      toast({ title: 'Unable to delete user', description: error?.message, variant: 'destructive' });
    }
  };

  const handleApproveTransaction = async (transactionId) => {
    try {
      const { error } = await supabase.rpc('approve_transaction', { transaction_id: transactionId });
      if (error) throw error;
      await saveActivity('approve_transaction', 'transactions', transactionId);
      toast({ title: 'Transaction approved', description: 'Balance and transaction status were updated.' });
      await Promise.all([fetchTransactions(), fetchUsers(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to approve transaction', description: error?.message, variant: 'destructive' });
    }
  };

  const handleRejectTransaction = async (transactionId) => {
    if (!window.confirm('Reject this transaction?')) return;

    try {
      const { error } = await supabase.rpc('reject_transaction', { transaction_id: transactionId });
      if (error) throw error;
      await saveActivity('reject_transaction', 'transactions', transactionId);
      toast({ title: 'Transaction rejected', description: 'The request has been marked as rejected.' });
      await Promise.all([fetchTransactions(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to reject transaction', description: error?.message, variant: 'destructive' });
    }
  };

  const startEditTrader = (trader) => {
    setEditingTraderId(trader.trader_id);
    setTraderForm({
      name: trader.name || '',
      image: trader.image || '',
      profit: trader.profit || '',
      risk: trader.risk || 'Medium',
      win_rate: trader.win_rate || '',
      win_rate_percent: trader.win_rate_percent ?? '',
      monthly_return: trader.monthly_return ?? '',
      max_drawdown: trader.max_drawdown ?? '',
      rating: trader.rating ?? '',
      followers: String(trader.followers || 0),
      trades: String(trader.trades || 0),
      is_active: trader.is_active !== false
    });
  };

  const resetTraderForm = () => {
    setEditingTraderId(null);
    setTraderForm(emptyTraderForm);
  };

  const handleSaveTrader = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: traderForm.name.trim(),
        image: traderForm.image.trim() || null,
        profit: traderForm.profit.trim() || null,
        risk: traderForm.risk,
        win_rate: traderForm.win_rate.trim() || null,
        win_rate_percent: nullableNumber(traderForm.win_rate_percent),
        monthly_return: nullableNumber(traderForm.monthly_return),
        max_drawdown: nullableNumber(traderForm.max_drawdown),
        rating: nullableNumber(traderForm.rating),
        followers: Math.round(parseNumber(traderForm.followers)),
        trades: Math.round(parseNumber(traderForm.trades)),
        is_active: Boolean(traderForm.is_active)
      };

      const query = editingTraderId
        ? supabase.from('traders').update(payload).eq('id', editingTraderId)
        : supabase.from('traders').insert(payload);
      const { error } = await query;
      if (error) throw error;

      await saveActivity(editingTraderId ? 'update_trader' : 'create_trader', 'traders', editingTraderId || payload.name, payload);
      toast({ title: editingTraderId ? 'Trader updated' : 'Trader added', description: `${payload.name} is saved.` });
      resetTraderForm();
      await Promise.all([fetchTraders(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to save trader', description: error?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrader = async (trader) => {
    if (!window.confirm(`Delete trader ${trader.name}?`)) return;
    try {
      const { error } = await supabase.from('traders').delete().eq('id', trader.trader_id);
      if (error) throw error;
      await saveActivity('delete_trader', 'traders', trader.trader_id, { name: trader.name });
      if (editingTraderId === trader.trader_id) resetTraderForm();
      toast({ title: 'Trader deleted', description: `${trader.name} has been removed.` });
      await Promise.all([fetchTraders(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to delete trader', description: error?.message, variant: 'destructive' });
    }
  };

  const startEditPlan = (plan) => {
    setEditingPlanId(plan.plan_id);
    setPlanForm({
      name: plan.name || '',
      price: String(parseNumber(plan.price)),
      duration: plan.duration || '',
      features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      popular: Boolean(plan.popular),
      is_active: plan.is_active !== false
    });
  };

  const resetPlanForm = () => {
    setEditingPlanId(null);
    setPlanForm(emptyPlanForm);
  };

  const handleSavePlan = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: planForm.name.trim(),
        price: parseNumber(planForm.price),
        duration: planForm.duration.trim(),
        features: planForm.features
          .split('\n')
          .map((feature) => feature.trim())
          .filter(Boolean),
        popular: Boolean(planForm.popular),
        is_active: Boolean(planForm.is_active)
      };

      const query = editingPlanId
        ? supabase.from('plans').update(payload).eq('id', editingPlanId)
        : supabase.from('plans').insert(payload);
      const { error } = await query;
      if (error) throw error;

      await saveActivity(editingPlanId ? 'update_plan' : 'create_plan', 'plans', editingPlanId || payload.name, payload);
      toast({ title: editingPlanId ? 'Plan updated' : 'Plan added', description: `${payload.name} is saved.` });
      resetPlanForm();
      await Promise.all([fetchPlans(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to save plan', description: error?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (plan) => {
    if (!window.confirm(`Delete plan ${plan.name}?`)) return;
    try {
      const { error } = await supabase.from('plans').delete().eq('id', plan.plan_id);
      if (error) throw error;
      await saveActivity('delete_plan', 'plans', plan.plan_id, { name: plan.name });
      if (editingPlanId === plan.plan_id) resetPlanForm();
      toast({ title: 'Plan deleted', description: `${plan.name} has been removed.` });
      await Promise.all([fetchPlans(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to delete plan', description: error?.message, variant: 'destructive' });
    }
  };

  const handleEditDepositAccount = (account) => {
    setEditingAccountMethod(account.method);
    setAccountForm({
      method: account.method,
      address: serializeDepositAccount(account.address)
    });
  };

  const resetAccountForm = () => {
    setEditingAccountMethod(null);
    setAccountForm({ method: '', address: '' });
  };

  const handleSaveDepositAccount = async (event) => {
    event.preventDefault();
    const method = accountForm.method.trim().toLowerCase().replace(/\s+/g, '_');

    if (!method) {
      toast({ title: 'Method required', description: 'Enter a method name.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const address = parseDepositAccount(accountForm.address);
      const { error } = await supabase
        .from('wallet_addresses')
        .upsert({ method, address, updated_at: new Date().toISOString() }, { onConflict: 'method' });
      if (error) throw error;

      await saveActivity(editingAccountMethod ? 'update_wallet' : 'create_wallet', 'wallet_addresses', method, { method });
      toast({ title: 'Deposit account saved', description: `${formatPaymentMethod(method)} is available to users.` });
      resetAccountForm();
      await Promise.all([fetchDepositAccounts(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to save account', description: error?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepositAccount = async (method) => {
    if (!window.confirm(`Remove ${formatPaymentMethod(method)} from deposit options?`)) return;

    try {
      const { error } = await supabase.from('wallet_addresses').delete().eq('method', method);
      if (error) throw error;
      await saveActivity('delete_wallet', 'wallet_addresses', method);
      if (editingAccountMethod === method) resetAccountForm();
      toast({ title: 'Deposit account removed', description: `${formatPaymentMethod(method)} was removed.` });
      await Promise.all([fetchDepositAccounts(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to remove account', description: error?.message, variant: 'destructive' });
    }
  };

  const handleCopyTradeStatus = async (copyTrade, status) => {
    try {
      const { error } = await supabase
        .from('copy_trades')
        .update({ status, ended_at: status === 'active' ? null : new Date().toISOString() })
        .eq('id', copyTrade.id);
      if (error) throw error;
      await saveActivity('update_copy_trade_status', 'copy_trades', copyTrade.id, { status });
      toast({ title: 'Copy trade updated', description: `Status changed to ${status}.` });
      await Promise.all([fetchCopyTrades(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to update copy trade', description: error?.message, variant: 'destructive' });
    }
  };

  const handleMessageStatus = async (message, status) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', message.id);
      if (error) throw error;

      await saveActivity('update_contact_message', 'contact_messages', message.id, { status });
      toast({ title: 'Message updated', description: `Message marked as ${status}.` });
      await Promise.all([fetchContactMessages(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to update message', description: error?.message, variant: 'destructive' });
    }
  };

  const handleSavePlatformSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        id: 'default',
        platform_name: platformSettings.platform_name.trim(),
        support_email: platformSettings.support_email.trim(),
        support_phone: platformSettings.support_phone.trim(),
        support_address: platformSettings.support_address.trim(),
        min_deposit: parseNumber(platformSettings.min_deposit, 250),
        min_withdrawal: parseNumber(platformSettings.min_withdrawal, 100),
        max_withdrawal: parseNumber(platformSettings.max_withdrawal, 100000),
        max_leverage: platformSettings.max_leverage.trim(),
        registrations_enabled: Boolean(platformSettings.registrations_enabled),
        deposits_enabled: Boolean(platformSettings.deposits_enabled),
        withdrawals_enabled: Boolean(platformSettings.withdrawals_enabled),
        copy_trading_enabled: Boolean(platformSettings.copy_trading_enabled),
        maintenance_mode: Boolean(platformSettings.maintenance_mode),
        announcement: platformSettings.announcement.trim() || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('platform_settings')
        .upsert(payload, { onConflict: 'id' });
      if (error) throw error;

      await saveActivity('update_platform_settings', 'platform_settings', 'default', payload);
      toast({ title: 'Settings saved', description: 'Website controls were updated.' });
      await Promise.all([fetchPlatformSettings(), fetchActivityLogs()]);
    } catch (error) {
      toast({ title: 'Unable to save settings', description: error?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] pt-20">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center text-white">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-emerald-300" />
            <p className="text-lg font-semibold">Loading command center</p>
            <p className="text-sm text-slate-400">Syncing users, balances, trades, and funding controls.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] pt-20 text-slate-100">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.22),_transparent_28%),linear-gradient(135deg,_#081421_0%,_#0d1727_50%,_#101013_100%)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Pill className="border-teal-300/30 bg-teal-300/10 text-teal-200">
                  <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                  Admin Control Room
                </Pill>
                <Pill className="border-white/10 bg-white/5 text-slate-300">
                  Realtime Supabase sync
                </Pill>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Monacap Operations Dashboard</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage users, funding, withdrawals, copy trades, traders, subscription plans, deposit accounts, and operational audit activity from one workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => fetchAllData({ quiet: true })}
                disabled={refreshing}
                className="bg-white text-slate-950 hover:bg-slate-200"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleLogout} variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Managed Users', value: metrics.totalUsers, sub: `${metrics.activeUsers} active`, icon: Users, tone: 'text-teal-300' },
              { label: 'Client Balances', value: currency(metrics.totalBalances), sub: `${metrics.kycPending} KYC pending`, icon: CircleDollarSign, tone: 'text-emerald-300' },
              { label: 'Deposit Revenue', value: currency(metrics.totalRevenue), sub: `${metrics.pendingTransactions} pending tx`, icon: TrendingUp, tone: 'text-sky-300' },
              { label: 'Copy Exposure', value: currency(metrics.activeCopyValue), sub: `${metrics.activeTraders} active traders`, icon: BarChart3, tone: 'text-amber-300' }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.sub}</p>
                    </div>
                    <Icon className={`h-9 w-9 ${item.tone}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="border-white/10 bg-[#0c1828] text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <ClipboardList className="h-5 w-5 text-amber-300" />
                Approval Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {recentQueue.length === 0 ? (
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
                    No pending deposits or withdrawals.
                  </div>
                ) : (
                  recentQueue.map((tx) => (
                    <div key={tx.transaction_id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Pill className={statusClass(tx.status)}>{tx.type}</Pill>
                          <p className="mt-3 text-lg font-bold text-white">{currency(tx.amount)}</p>
                          <p className="text-sm text-slate-400">{tx.user_name || tx.user_email || shortId(tx.user_id)}</p>
                          <p className="mt-1 text-xs text-slate-500">{tx.method || tx.asset || 'No method'} • {new Date(tx.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleApproveTransaction(tx.transaction_id)} className="bg-emerald-500 text-white hover:bg-emerald-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRejectTransaction(tx.transaction_id)} className="border-rose-400/40 text-rose-300 hover:bg-rose-400/10">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0c1828] text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-teal-300" />
                System Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                ['Pending withdrawals', metrics.pendingWithdrawals],
                ['Deposit accounts', depositAccounts.length],
                ['Active plans', metrics.activePlans],
                ['Contact inbox', metrics.unreadMessages],
                ['Audit records', activityLogs.length]
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="text-lg font-bold text-white">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => navigate(`/admin/${value}`)}
          className="space-y-6"
        >
          <TabsList className="h-auto flex flex-wrap justify-start gap-2 border border-white/10 bg-[#0c1828] p-2">
            {adminTabs.map(([value, Icon, label]) => (
              <TabsTrigger key={value} value={value} className="gap-2 data-[state=active]:bg-teal-400 data-[state=active]:text-slate-950">
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
              <Card className="border-white/10 bg-[#0c1828] text-white">
                <CardHeader>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-white">User Management</CardTitle>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                          value={userSearch}
                          onChange={(event) => setUserSearch(event.target.value)}
                          placeholder="Search users"
                          className="w-full border-white/10 bg-[#07111f] pl-9 text-white placeholder:text-slate-500 sm:w-64"
                        />
                      </div>
                      <select
                        value={userStatusFilter}
                        onChange={(event) => setUserStatusFilter(event.target.value)}
                        className="rounded-md border border-white/10 bg-[#07111f] px-3 py-2 text-sm text-white"
                      >
                        <option value="all">All users</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">KYC Pending</option>
                        <option value="verified">KYC Verified</option>
                        <option value="rejected">KYC Rejected</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-slate-400">User</TableHead>
                        <TableHead className="text-slate-400">Balance</TableHead>
                        <TableHead className="text-slate-400">KYC</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Joined</TableHead>
                        <TableHead className="text-slate-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((row) => (
                        <TableRow key={row.user_id} className="border-white/10">
                          <TableCell>
                            <button type="button" onClick={() => setSelectedUserId(row.user_id)} className="text-left">
                              <span className="block font-semibold text-white">{row.full_name || 'Unnamed user'}</span>
                              <span className="block text-xs text-slate-400">{row.email || shortId(row.user_id)}</span>
                            </button>
                          </TableCell>
                          <TableCell className="font-semibold text-white">{currency(row.balance)}</TableCell>
                          <TableCell><Pill className={statusClass(row.kyc_status)}>{row.kyc_status || 'pending'}</Pill></TableCell>
                          <TableCell><Pill className={statusClass(row.status)}>{row.status}</Pill></TableCell>
                          <TableCell className="text-slate-400">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setSelectedUserId(row.user_id)} className="border-white/15 text-white hover:bg-white/10">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleToggleUserStatus(row)} className="border-white/15 text-white hover:bg-white/10">
                                <UserCheck className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteUser(row)} className="border-rose-400/40 text-rose-300 hover:bg-rose-400/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#0c1828] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <SlidersHorizontal className="h-5 w-5 text-teal-300" />
                    User Console
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedUser ? (
                    <form onSubmit={handleSaveUser} className="space-y-4">
                      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Selected User</p>
                        <p className="mt-2 font-mono text-xs text-slate-300">{selectedUser.user_id}</p>
                        {selectedUser.profile_exists === false && (
                          <p className="mt-2 text-xs text-amber-300">
                            Auth user found without a profile row. Saving will create the missing profile.
                          </p>
                        )}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Full Name">
                          <Input value={userForm.full_name} onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                        </Field>
                        <Field label="Email">
                          <Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                        </Field>
                        <Field label="Phone">
                          <Input value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                        </Field>
                        <Field label="Country">
                          <Input value={userForm.country} onChange={(e) => setUserForm({ ...userForm, country: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                        </Field>
                        <Field label="Balance">
                          <Input type="number" value={userForm.balance} onChange={(e) => setUserForm({ ...userForm, balance: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                        </Field>
                        <Field label="Role">
                          <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} className="w-full rounded-md border border-white/10 bg-[#07111f] px-3 py-2 text-sm text-white">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </Field>
                        <Field label="Status">
                          <select value={userForm.status} onChange={(e) => setUserForm({ ...userForm, status: e.target.value })} className="w-full rounded-md border border-white/10 bg-[#07111f] px-3 py-2 text-sm text-white">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </Field>
                        <Field label="KYC Status">
                          <select value={userForm.kyc_status} onChange={(e) => setUserForm({ ...userForm, kyc_status: e.target.value })} className="w-full rounded-md border border-white/10 bg-[#07111f] px-3 py-2 text-sm text-white">
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </Field>
                      </div>
                      <Button type="submit" disabled={saving} className="w-full bg-teal-400 text-slate-950 hover:bg-teal-300">
                        <Lock className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save User Changes'}
                      </Button>
                    </form>
                  ) : (
                    <p className="text-sm text-slate-400">Select a user to manage their account.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="border-white/10 bg-[#0c1828] text-white">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="text-white">Transaction Management</CardTitle>
                  <div className="flex gap-3">
                    <select value={transactionFilter.type} onChange={(e) => setTransactionFilter({ ...transactionFilter, type: e.target.value })} className="rounded-md border border-white/10 bg-[#07111f] px-3 py-2 text-sm text-white">
                      <option value="all">All types</option>
                      <option value="deposit">Deposits</option>
                      <option value="withdrawal">Withdrawals</option>
                      <option value="trade">Trades</option>
                    </select>
                    <select value={transactionFilter.status} onChange={(e) => setTransactionFilter({ ...transactionFilter, status: e.target.value })} className="rounded-md border border-white/10 bg-[#07111f] px-3 py-2 text-sm text-white">
                      <option value="all">All status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-slate-400">User</TableHead>
                      <TableHead className="text-slate-400">Type</TableHead>
                      <TableHead className="text-slate-400">Amount</TableHead>
                      <TableHead className="text-slate-400">Method</TableHead>
                      <TableHead className="text-slate-400">Details</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Date</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.transaction_id} className="border-white/10">
                        <TableCell>
                          <div className="font-semibold text-white">{tx.user_name || 'User'}</div>
                          <div className="text-xs text-slate-500">{tx.user_email || shortId(tx.user_id)}</div>
                        </TableCell>
                        <TableCell className="capitalize text-slate-300">{tx.type}</TableCell>
                        <TableCell className="font-semibold text-white">{currency(tx.amount)}</TableCell>
                        <TableCell className="text-slate-400">{tx.method || tx.asset || '-'}</TableCell>
                        <TableCell className="max-w-xs break-all text-xs text-slate-400">{renderTransactionDetails(tx.details)}</TableCell>
                        <TableCell><Pill className={statusClass(tx.status)}>{tx.status}</Pill></TableCell>
                        <TableCell className="text-slate-400">{tx.created_at ? new Date(tx.created_at).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          {tx.status === 'pending' ? (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleApproveTransaction(tx.transaction_id)} className="bg-emerald-500 text-white hover:bg-emerald-600">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleRejectTransaction(tx.transaction_id)} className="border-rose-400/40 text-rose-300 hover:bg-rose-400/10">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">Processed</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="copy-trades">
            <Card className="border-white/10 bg-[#0c1828] text-white">
              <CardHeader>
                <CardTitle className="text-white">Copy Trade Oversight</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-slate-400">Client</TableHead>
                      <TableHead className="text-slate-400">Trader</TableHead>
                      <TableHead className="text-slate-400">Amount</TableHead>
                      <TableHead className="text-slate-400">Profit</TableHead>
                      <TableHead className="text-slate-400">Risk</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {copyTrades.map((copy) => (
                      <TableRow key={copy.id} className="border-white/10">
                        <TableCell>
                          <div className="font-semibold text-white">{copy.profile?.full_name || 'Client'}</div>
                          <div className="text-xs text-slate-500">{copy.profile?.email || shortId(copy.user_id)}</div>
                        </TableCell>
                        <TableCell className="text-slate-300">{copy.trader?.name || 'Unassigned'}</TableCell>
                        <TableCell className="font-semibold text-white">{currency(copy.amount)}</TableCell>
                        <TableCell className={parseNumber(copy.current_profit) >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{currency(copy.current_profit)}</TableCell>
                        <TableCell className="text-slate-400">{copy.allocated_percentage}% / {copy.leverage_used}x</TableCell>
                        <TableCell><Pill className={statusClass(copy.status)}>{copy.status}</Pill></TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleCopyTradeStatus(copy, 'active')} className="bg-teal-400 text-slate-950 hover:bg-teal-300">Active</Button>
                            <Button size="sm" variant="outline" onClick={() => handleCopyTradeStatus(copy, 'stopped')} className="border-white/15 text-white hover:bg-white/10">Stop</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traders">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
              <Card className="border-white/10 bg-[#0c1828] text-white">
                <CardHeader><CardTitle className="text-white">Lead Traders</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {traders.map((trader) => (
                      <div key={trader.trader_id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={trader.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=160&auto=format&fit=crop'} alt={trader.name} className="h-12 w-12 rounded-md object-cover" />
                            <div>
                              <p className="font-bold text-white">{trader.name}</p>
                              <p className="text-xs text-slate-400">{trader.risk} risk • {trader.followers || 0} followers</p>
                            </div>
                          </div>
                          <Pill className={trader.is_active ? statusClass('active') : statusClass('inactive')}>{trader.is_active ? 'active' : 'inactive'}</Pill>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                          <div><p className="text-slate-500">Profit</p><p className="font-semibold text-emerald-300">{trader.profit || '-'}</p></div>
                          <div><p className="text-slate-500">Win</p><p className="font-semibold text-white">{trader.win_rate || '-'}</p></div>
                          <div><p className="text-slate-500">Trades</p><p className="font-semibold text-white">{trader.trades || 0}</p></div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" onClick={() => startEditTrader(trader)} className="bg-teal-400 text-slate-950 hover:bg-teal-300">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteTrader(trader)} className="border-rose-400/40 text-rose-300 hover:bg-rose-400/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <TraderForm
                form={traderForm}
                setForm={setTraderForm}
                editingId={editingTraderId}
                saving={saving}
                onSubmit={handleSaveTrader}
                onCancel={resetTraderForm}
              />
            </div>
          </TabsContent>

          <TabsContent value="plans">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
              <Card className="border-white/10 bg-[#0c1828] text-white">
                <CardHeader><CardTitle className="text-white">Trading Plans</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {plans.map((plan) => (
                      <div key={plan.plan_id} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                        <div className="mb-4 flex items-center justify-between">
                          {plan.popular ? <Pill className="border-teal-300/30 bg-teal-300/10 text-teal-200">Popular</Pill> : <span />}
                          <Pill className={plan.is_active !== false ? statusClass('active') : statusClass('inactive')}>{plan.is_active !== false ? 'active' : 'inactive'}</Pill>
                        </div>
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        <p className="mt-2 text-3xl font-bold text-teal-300">{currency(plan.price)}</p>
                        <p className="mt-1 text-sm text-slate-400">{plan.duration}</p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-300">
                          {(plan.features || []).slice(0, 5).map((feature) => (
                            <li key={feature} className="flex gap-2">
                              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-5 flex gap-2">
                          <Button size="sm" onClick={() => startEditPlan(plan)} className="bg-teal-400 text-slate-950 hover:bg-teal-300">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeletePlan(plan)} className="border-rose-400/40 text-rose-300 hover:bg-rose-400/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <PlanForm
                form={planForm}
                setForm={setPlanForm}
                editingId={editingPlanId}
                saving={saving}
                onSubmit={handleSavePlan}
                onCancel={resetPlanForm}
              />
            </div>
          </TabsContent>

          <TabsContent value="funding">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
              <Card className="border-white/10 bg-[#0c1828] text-white">
                <CardHeader><CardTitle className="text-white">Deposit Accounts</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-slate-400">Method</TableHead>
                        <TableHead className="text-slate-400">Account Details</TableHead>
                        <TableHead className="text-slate-400">Updated</TableHead>
                        <TableHead className="text-slate-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {depositAccounts.map((account) => (
                        <TableRow key={account.method} className="border-white/10">
                          <TableCell className="font-semibold text-white">{formatPaymentMethod(account.method)}</TableCell>
                          <TableCell className="max-w-xl break-all text-xs text-slate-400">{renderDepositAccount(account.address)}</TableCell>
                          <TableCell className="text-slate-400">{account.updated_at ? new Date(account.updated_at).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleEditDepositAccount(account)} className="bg-teal-400 text-slate-950 hover:bg-teal-300">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteDepositAccount(account.method)} className="border-rose-400/40 text-rose-300 hover:bg-rose-400/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#0c1828] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Plus className="h-5 w-5 text-teal-300" />
                    {editingAccountMethod ? 'Edit Deposit Account' : 'Add Deposit Account'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveDepositAccount} className="space-y-4">
                    <Field label="Payment Method">
                      <Input value={accountForm.method} disabled={Boolean(editingAccountMethod)} onChange={(e) => setAccountForm({ ...accountForm, method: e.target.value })} placeholder="bitcoin, usdt_trc20, bank_transfer" className="border-white/10 bg-[#07111f] text-white" required />
                    </Field>
                    <Field label="Account Details">
                      <textarea value={accountForm.address} onChange={(e) => setAccountForm({ ...accountForm, address: e.target.value })} placeholder='Wallet address or JSON like {"bank_name":"...","account_number":"..."}' className="min-h-[180px] w-full rounded-md border border-white/10 bg-[#07111f] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" required />
                    </Field>
                    <div className="flex gap-3">
                      <Button type="submit" disabled={saving} className="flex-1 bg-teal-400 text-slate-950 hover:bg-teal-300">{saving ? 'Saving...' : 'Save Account'}</Button>
                      {editingAccountMethod && <Button type="button" variant="outline" onClick={resetAccountForm} className="border-white/15 text-white hover:bg-white/10">Cancel</Button>}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="border-white/10 bg-[#0c1828] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5 text-teal-300" />
                  Contact Message Inbox
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMessages.length === 0 ? (
                  <p className="text-sm text-slate-400">No contact messages yet.</p>
                ) : (
                  contactMessages.map((message) => (
                    <div key={message.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Pill className={statusClass(message.status)}>{message.status}</Pill>
                            <span className="text-xs text-slate-500">
                              {message.created_at ? new Date(message.created_at).toLocaleString() : '-'}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-white">{message.subject}</p>
                          <p className="text-sm text-slate-400">{message.name} • {message.email}</p>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{message.message}</p>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <Button size="sm" onClick={() => handleMessageStatus(message, 'in_progress')} className="bg-teal-400 text-slate-950 hover:bg-teal-300">
                            In Progress
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleMessageStatus(message, 'resolved')} className="border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10">
                            Resolved
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleMessageStatus(message, 'archived')} className="border-white/15 text-white hover:bg-white/10">
                            Archive
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-white/10 bg-[#0c1828] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5 text-teal-300" />
                  Website Function Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePlatformSettings} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Platform Name">
                      <Input value={platformSettings.platform_name} onChange={(e) => setPlatformSettings({ ...platformSettings, platform_name: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                    </Field>
                    <Field label="Support Email">
                      <Input type="email" value={platformSettings.support_email} onChange={(e) => setPlatformSettings({ ...platformSettings, support_email: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                    </Field>
                    <Field label="Support Phone">
                      <Input value={platformSettings.support_phone} onChange={(e) => setPlatformSettings({ ...platformSettings, support_phone: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                    </Field>
                    <Field label="Max Leverage Label">
                      <Input value={platformSettings.max_leverage} onChange={(e) => setPlatformSettings({ ...platformSettings, max_leverage: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                    </Field>
                    <Field label="Minimum Deposit">
                      <Input type="number" value={platformSettings.min_deposit} onChange={(e) => setPlatformSettings({ ...platformSettings, min_deposit: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                    </Field>
                    <Field label="Minimum Withdrawal">
                      <Input type="number" value={platformSettings.min_withdrawal} onChange={(e) => setPlatformSettings({ ...platformSettings, min_withdrawal: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                    </Field>
                    <Field label="Maximum Withdrawal">
                      <Input type="number" value={platformSettings.max_withdrawal} onChange={(e) => setPlatformSettings({ ...platformSettings, max_withdrawal: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                    </Field>
                    <Field label="Support Address">
                      <Input value={platformSettings.support_address} onChange={(e) => setPlatformSettings({ ...platformSettings, support_address: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
                    </Field>
                  </div>

                  <Field label="Site Announcement">
                    <textarea value={platformSettings.announcement || ''} onChange={(e) => setPlatformSettings({ ...platformSettings, announcement: e.target.value })} placeholder="Optional message to show users later" className="min-h-[100px] w-full rounded-md border border-white/10 bg-[#07111f] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                  </Field>

                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                    {[
                      ['registrations_enabled', 'Registrations'],
                      ['deposits_enabled', 'Deposits'],
                      ['withdrawals_enabled', 'Withdrawals'],
                      ['copy_trading_enabled', 'Copy Trading'],
                      ['maintenance_mode', 'Maintenance Mode']
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
                        <span>{label}</span>
                        <input
                          type="checkbox"
                          checked={Boolean(platformSettings[key])}
                          onChange={(e) => setPlatformSettings({ ...platformSettings, [key]: e.target.checked })}
                        />
                      </label>
                    ))}
                  </div>

                  <Button type="submit" disabled={saving} className="bg-teal-400 text-slate-950 hover:bg-teal-300">
                    <Settings className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Website Controls'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="border-white/10 bg-[#0c1828] text-white">
              <CardHeader><CardTitle className="text-white">Operational Audit Trail</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {activityLogs.length === 0 ? (
                  <p className="text-sm text-slate-400">No audit records yet.</p>
                ) : (
                  activityLogs.map((log) => (
                    <div key={log.id} className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">{log.action}</p>
                        <p className="text-sm text-slate-400">{log.entity_type} {log.entity_id ? `• ${shortId(log.entity_id)}` : ''}</p>
                      </div>
                      <div className="text-sm text-slate-400 sm:text-right">
                        <p>{log.profile?.full_name || log.profile?.email || 'System'}</p>
                        <p>{log.created_at ? new Date(log.created_at).toLocaleString() : '-'}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <Label className="text-sm text-slate-300">{label}</Label>
    {children}
  </div>
);

const TraderForm = ({ form, setForm, editingId, saving, onSubmit, onCancel }) => (
  <Card className="border-white/10 bg-[#0c1828] text-white">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-white">
        <Plus className="h-5 w-5 text-teal-300" />
        {editingId ? 'Edit Trader' : 'Add Trader'}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Name">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border-white/10 bg-[#07111f] text-white" required />
        </Field>
        <Field label="Image URL">
          <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Profit Label">
            <Input value={form.profit} onChange={(e) => setForm({ ...form, profit: e.target.value })} placeholder="+32%" className="border-white/10 bg-[#07111f] text-white" />
          </Field>
          <Field label="Risk">
            <select value={form.risk} onChange={(e) => setForm({ ...form, risk: e.target.value })} className="w-full rounded-md border border-white/10 bg-[#07111f] px-3 py-2 text-sm text-white">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </Field>
          <Field label="Win Rate Label">
            <Input value={form.win_rate} onChange={(e) => setForm({ ...form, win_rate: e.target.value })} placeholder="81%" className="border-white/10 bg-[#07111f] text-white" />
          </Field>
          <Field label="Win Rate %">
            <Input type="number" value={form.win_rate_percent} onChange={(e) => setForm({ ...form, win_rate_percent: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
          </Field>
          <Field label="Monthly Return">
            <Input type="number" value={form.monthly_return} onChange={(e) => setForm({ ...form, monthly_return: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
          </Field>
          <Field label="Max Drawdown %">
            <Input type="number" value={form.max_drawdown} onChange={(e) => setForm({ ...form, max_drawdown: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
          </Field>
          <Field label="Rating">
            <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
          </Field>
          <Field label="Followers">
            <Input type="number" value={form.followers} onChange={(e) => setForm({ ...form, followers: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
          </Field>
          <Field label="Trades">
            <Input type="number" value={form.trades} onChange={(e) => setForm({ ...form, trades: e.target.value })} className="border-white/10 bg-[#07111f] text-white" />
          </Field>
          <label className="flex items-center gap-3 pt-7 text-sm text-slate-300">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active trader
          </label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="flex-1 bg-teal-400 text-slate-950 hover:bg-teal-300">{saving ? 'Saving...' : editingId ? 'Update Trader' : 'Add Trader'}</Button>
          {editingId && <Button type="button" variant="outline" onClick={onCancel} className="border-white/15 text-white hover:bg-white/10">Cancel</Button>}
        </div>
      </form>
    </CardContent>
  </Card>
);

const PlanForm = ({ form, setForm, editingId, saving, onSubmit, onCancel }) => (
  <Card className="border-white/10 bg-[#0c1828] text-white">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-white">
        <Plus className="h-5 w-5 text-teal-300" />
        {editingId ? 'Edit Plan' : 'Add Plan'}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Plan Name">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border-white/10 bg-[#07111f] text-white" required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Price">
            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border-white/10 bg-[#07111f] text-white" required />
          </Field>
          <Field label="Duration">
            <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="border-white/10 bg-[#07111f] text-white" required />
          </Field>
        </div>
        <Field label="Features">
          <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="One feature per line" className="min-h-[160px] w-full rounded-md border border-white/10 bg-[#07111f] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </Field>
        <div className="flex flex-wrap gap-5 text-sm text-slate-300">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
            Popular
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active
          </label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="flex-1 bg-teal-400 text-slate-950 hover:bg-teal-300">{saving ? 'Saving...' : editingId ? 'Update Plan' : 'Add Plan'}</Button>
          {editingId && <Button type="button" variant="outline" onClick={onCancel} className="border-white/15 text-white hover:bg-white/10">Cancel</Button>}
        </div>
      </form>
    </CardContent>
  </Card>
);

export default Admin;
