import axios from 'axios';

// In production, VITE_API_URL points to the deployed backend (e.g. https://festiveroots-backend.onrender.com)
// In local development, Vite proxy forwards '/api' to http://localhost:5000
const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const baseURL = rawBaseUrl ? `${rawBaseUrl.replace(/\/+$/, '')}/api` : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('festiveroots_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: clear token if expired and not on login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // localStorage.removeItem('festiveroots_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
