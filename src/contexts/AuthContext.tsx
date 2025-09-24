"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  joinedDate?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('al-hanafiyya-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('al-hanafiyya-user');
      }
    }
  }, []);

  const login = (userData: User) => {
    const userWithDate = {
      ...userData,
      joinedDate: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=7c3aed&color=fff`
    };
    setUser(userWithDate);
    localStorage.setItem('al-hanafiyya-user', JSON.stringify(userWithDate));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('al-hanafiyya-user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
