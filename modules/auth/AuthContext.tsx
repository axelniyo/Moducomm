import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../../types';

interface AuthData {
  user: User;
  token: string;
}

interface AuthContextType {
  auth: AuthData | null;
  loginUser: (authData: AuthData) => void;
  logoutUser: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedAuth = localStorage.getItem('moducomm_auth');
        if (storedAuth) {
          try {
            setAuth(JSON.parse(storedAuth));
          } catch (e) {
            console.error("Failed to parse auth from storage", e);
            localStorage.removeItem('moducomm_auth');
          }
        }
      } catch (e) {
        console.error("Auth initialization failed", e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginUser = (authData: AuthData) => {
    setAuth(authData);
    try {
      localStorage.setItem('moducomm_auth', JSON.stringify(authData));
    } catch (e) {
      console.error("Failed to save auth to storage", e);
    }
  };

  const logoutUser = () => {
    setAuth(null);
    try {
      localStorage.removeItem('moducomm_auth');
    } catch (e) {
      console.error("Failed to clear auth from storage", e);
    }
  };

  const user = auth ? auth.user : null;
  const isAuthenticated = !!auth;
  const isAdmin = auth?.user?.role === UserRole.ADMIN;

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-gray-500">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ auth, user, loginUser, logoutUser, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
