import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('festiveroots_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user on token change or startup
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
        localStorage.removeItem('festiveroots_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Customer / Admin / Artisan Login
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, ...userData } = res.data.data;
      localStorage.setItem('festiveroots_token', newToken);
      setToken(newToken);
      setUser(userData);
      return res.data;
    }
  };

  // Customer Registration
  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const { token: newToken, ...userData } = res.data.data;
      localStorage.setItem('festiveroots_token', newToken);
      setToken(newToken);
      setUser(userData);
      return res.data;
    }
  };

  // Artisan Registration
  const registerArtisan = async (formData) => {
    const res = await api.post('/auth/register-artisan', formData);
    if (res.data.success) {
      const { token: newToken, ...userData } = res.data.data;
      localStorage.setItem('festiveroots_token', newToken);
      setToken(newToken);
      setUser(userData);
      return res.data;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('festiveroots_token');
    setToken(null);
    setUser(null);
  };

  // Update profile
  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    if (res.data.success) {
      setUser((prev) => ({ ...prev, ...res.data.data }));
      return res.data;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isCustomer: user?.role === 'customer',
        isArtisan: user?.role === 'artisan',
        isAdmin: user?.role === 'admin',
        login,
        register,
        registerArtisan,
        logout,
        updateProfile,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
