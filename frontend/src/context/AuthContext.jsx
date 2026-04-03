// context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

const storageKeys = {
  token: 'connectgo_token',
  user: 'connectgo_user',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);   // ✅ add loading state

  useEffect(() => {
    const storedToken = localStorage.getItem(storageKeys.token);
    const storedUser = localStorage.getItem(storageKeys.user);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);   // ✅ always set loading to false after checking
  }, []);

  const persistAuth = (data) => {
    const nextUser = {
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem(storageKeys.token, data.token);
    localStorage.setItem(storageKeys.user, JSON.stringify(nextUser));
    setToken(data.token);
    setUser(nextUser);
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    persistAuth(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persistAuth(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(storageKeys.token);
    localStorage.removeItem(storageKeys.user);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      loading,                      // ✅ expose loading
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'ADMIN',
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}