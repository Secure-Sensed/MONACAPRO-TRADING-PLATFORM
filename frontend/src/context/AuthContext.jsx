import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

const parseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const buildUser = (profile, authUser) => {
  if (!profile && !authUser) return null;
  return {
    user_id: profile?.id || authUser?.id || null,
    email: profile?.email || authUser?.email || '',
    full_name: profile?.full_name || authUser?.user_metadata?.full_name || '',
    role: profile?.role || 'user',
    status: profile?.status || 'active',
    balance: parseNumber(profile?.balance, 0),
    phone: profile?.phone || '',
    country: profile?.country || '',
    picture: profile?.picture || '',
    created_at: profile?.created_at,
    updated_at: profile?.updated_at
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchProfile = async (userId) => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.warn('Failed to fetch profile:', error.message || error);
      return null;
    }
    return data;
  };

  const refreshUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data?.session?.user) {
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }

    const profile = await fetchProfile(data.session.user.id);
    const mapped = buildUser(profile, data.session.user);
    setUser(mapped);
    setIsAuthenticated(true);
    return mapped;
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error || !data?.session?.user) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      const profile = await fetchProfile(data.session.user.id);
      const mapped = buildUser(profile, data.session.user);
      setUser(mapped);
      setIsAuthenticated(true);
      setLoading(false);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (!session?.user) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      const profile = await fetchProfile(session.user.id);
      const mapped = buildUser(profile, session.user);
      setUser(mapped);
      setIsAuthenticated(true);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const register = async (fullName, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) {
        return { success: false, error: error.message || 'Registration failed' };
      }

      if (data?.user?.id && fullName) {
        await supabase.from('profiles').update({ full_name: fullName }).eq('id', data.user.id);
      }

      if (!data?.session) {
        return { success: true, needsEmailConfirmation: true };
      }

      // Send signup email asynchronously (don't block registration on this)
      setTimeout(() => {
        supabase.functions.invoke('send-auth-email', {
          body: { type: 'signup' }
        }).catch(error => {
          console.warn('Signup email failed:', error?.message || error);
        });
      }, 0);

      const profile = await fetchProfile(data.user.id);
      const mapped = buildUser(profile, data.user);
      setUser(mapped);
      setIsAuthenticated(true);
      return { success: true, user: mapped };
    } catch (error) {
      if (error?.message?.includes('postMessage')) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            const profile = await fetchProfile(sessionData.session.user.id);
            const mapped = buildUser(profile, sessionData.session.user);
            setUser(mapped);
            setIsAuthenticated(true);
            return { success: true, user: mapped };
          }
        } catch (sessionError) {
          console.warn('Session recovery failed:', sessionError?.message || sessionError);
        }
        return {
          success: false,
          error: 'Registration completed but the session update failed. Please refresh and log in again.'
        };
      }
      return {
        success: false,
        error: error?.message || 'Registration failed'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        return { success: false, error: error.message || 'Login failed' };
      }

      // Send login email asynchronously (don't block login on this)
      setTimeout(() => {
        supabase.functions.invoke('send-auth-email', {
          body: { type: 'login' }
        }).catch(error => {
          console.warn('Login email failed:', error?.message || error);
        });
      }, 0);

      const profile = await fetchProfile(data.user.id);
      const mapped = buildUser(profile, data.user);
      setUser(mapped);
      setIsAuthenticated(true);
      return { success: true, user: mapped };
    } catch (error) {
      if (error?.message?.includes('postMessage')) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            const profile = await fetchProfile(sessionData.session.user.id);
            const mapped = buildUser(profile, sessionData.session.user);
            setUser(mapped);
            setIsAuthenticated(true);
            return { success: true, user: mapped };
          }
        } catch (sessionError) {
          console.warn('Session recovery failed:', sessionError?.message || sessionError);
        }
        return {
          success: false,
          error: 'Login completed but the session update failed. Please refresh and try again.'
        };
      }
      return {
        success: false,
        error: error?.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    refreshUser,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
