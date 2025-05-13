// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AppState, AppStateStatus, Modal, StyleSheet, Text, View } from 'react-native';

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
  getUserInfo: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  account: null,
  login: () => {},
  logout: () => {},
  getUserInfo: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [account, setAccount] = useState<Account[] | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const login = (token: string, userId: number, account: Account[]) => {
    setToken(token);
    setUserId(userId);
    setAccount(account);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setAccount(null);
    setShowSessionModal(false); // hide modal on logout
  };

  const getUserInfo = async () => {
    if (!token || !account || account.length === 0) return;

    try {
      const response = await axios.get(
        `https://paynest.coinxness.com/api/account/info/${account[0].id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === true) {
        setAccount([response.data.user]);
      }
    } catch (error) {
      console.error('Failed to fetch user info', error);
    }
  };

  // 👇 Auto logout after 10 seconds of background/inactive
  const appState = useRef(AppState.currentState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        timeoutRef.current = setTimeout(() => {
          setShowSessionModal(true); // Show modal
          setTimeout(() => {
            logout(); // Then logout after 2 seconds
          }, 2000);
        }, 10000); // 10 seconds timeout
      }

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, userId, account, login, logout, getUserInfo }}
    >
      {children}

      {/* Session Expired Modal */}
      <Modal visible={showSessionModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Your session has expired.</Text>
          </View>
        </View>
      </Modal>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    elevation: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
});