import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Mock Data mimicking a Database
  const [currentUser, setCurrentUser] = useState({ id: '1', role: 'user', email: 'user@test.com', name: 'John Doe', balance: 0.00 });
  
  // Admin Wallet Addresses
  const [adminWallets, setAdminWallets] = useState([
    { id: 1, currency: 'BTC', address: 'bc1qxxx...adminbtc', network: 'Bitcoin' },
    { id: 2, currency: 'USDT', address: '0x123...adminusdt', network: 'ERC20' },
  ]);

  // Pending deposits/withdrawals
  const [transactions, setTransactions] = useState([
    { id: 101, userId: '1', userEmail: 'user@test.com', type: 'Deposit', amount: 500, currency: 'USDT', status: 'Pending', hash: '0xabc123...', date: new Date().toISOString() }
  ]);

  const [users, setUsers] = useState([
    { id: '1', email: 'user@test.com', name: 'John Doe', balance: 0.00, status: 'Active' },
    { id: '2', email: 'admin@moncaplus.com', name: 'Super Admin', balance: 0.00, status: 'Active', role: 'admin' },
  ]);

  // Actions
  const addTransaction = (tx) => {
    setTransactions([{ ...tx, id: Math.random(), status: 'Pending', date: new Date().toISOString() }, ...transactions]);
  };

  const approveTransaction = (id) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === id && tx.status === 'Pending') {
        if (tx.type === 'Deposit') {
          updateUserBalance(tx.userId, tx.amount);
        }
        return { ...tx, status: 'Approved' };
      }
      return tx;
    }));
  };

  const rejectTransaction = (id) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: 'Rejected' } : tx));
  };

  const updateUserBalance = (userId, amount) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: u.balance + amount } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, balance: prev.balance + amount }));
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      adminWallets, setAdminWallets,
      transactions, addTransaction, approveTransaction, rejectTransaction,
      users, setUsers, updateUserBalance
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
