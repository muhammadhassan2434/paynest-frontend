// context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Account {
  id: number;
  user_id: number;
  paynest_id: string;
  phone: string;
  gender: string;
  address: string;
  balance: string;
  held_balance: string;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  otp: string;
  user: User;
}

interface AuthContextType {
  token: string | null;
  userId: number | null;
  account: Account[] | null;
  login: (token: string, userId: number, account: Account[]) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  account: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [account, setAccount] = useState<Account[] | null>(null);

  const login = (token: string, userId: number, account: Account[]) => {
    setToken(token);
    setUserId(userId);
    setAccount(account);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setAccount(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, account, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
