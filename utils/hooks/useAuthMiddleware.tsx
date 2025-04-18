// utils/hooks/useAuthMiddleware.tsx
import { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { useAuth } from './AuthContext';

const useAuthMiddleware = () => {
  const { token, login } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (token) {
      // If token exists, the user is logged in. You can handle this in any way you want.
      // For example, redirect the user to a specific page if needed.
      navigate("(tabs)"); // or the page where the logged-in user should land
    } else {
      // Redirect to login screen if no token is found.
      navigate("login");
    }
  }, [token, navigate]);
};

export default useAuthMiddleware;
