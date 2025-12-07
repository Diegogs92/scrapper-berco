'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';

interface UserData {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: UserData) => void;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Cargar usuario del localStorage
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = (newToken: string, userData: UserData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;

    const roleHierarchy: Record<UserRole, number> = {
      desarrollador: 3,
      administrador: 2,
      consultante: 1,
    };

    return roleHierarchy[user.rol] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
