import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/**
 * Request interceptor: attach token from localStorage for cross-domain auth.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vault_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor: on 401, redirect to login.
 */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect for auth endpoints (login, register, check-auth)
      const url = error.config?.url || '';
      if (!url.includes('/auth/')) {
        localStorage.removeItem('vault_token');
        localStorage.removeItem('vault_user');
        // Let the component handle redirection
      }
    }
    return Promise.reject(error);
  }
);

export default api;
