/**
 * @license
 * Authentication Context for Mora Herivi Admin
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api.js';
import type { User } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setupInitialAdmin: (payload: { username: string; password: string; fullName: string; email?: string }) => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    setIsLoading(true);
    // If no token in memory/storage and no session cookie, visitor is unauthenticated
    const hasToken = Boolean(api.getToken());
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('mora_admin_session');

    if (!hasToken && !hasCookie) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch {
      setUser(null);
      api.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.login(username, password);
    setUser(res.user);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const setupInitialAdmin = async (payload: { username: string; password: string; fullName: string; email?: string }) => {
    const res = await api.setupInitialAdmin(payload);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setupInitialAdmin, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
