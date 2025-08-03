'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSchema_Type } from '@/schemas/user';
import authService from '@/services/auth.service';
import { isAuthenticated, clearAuthToken } from '@/api/axiosApi';

interface AuthContextType {
  user: UserSchema_Type | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSchema_Type | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // check authentication on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // try to validate existing token (from cookies)
        const currentUser = await authService.validateToken();

        if (currentUser) {
          setUser(currentUser);
          console.log('✅ User authenticated from existing session');
        } else {
          console.log('🚩 No valid session found');
        }
      } catch (error) {
        console.error('🚩 Auth initialization error:', error);
        // clear invalid token
        await clearAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.login(credentials);
      setUser(response.user);

      console.log('✅ Login successful in context');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '🚩 Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
      console.log('✅ Logout successful in context');
    } catch (error) {
      console.error('🚩 Logout error in context:', error);
      // even on error, clear local state
      setUser(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user && isAuthenticated(),
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('🚩 UseAuth must be used within an AuthProvider');
  }
  return context;
}
