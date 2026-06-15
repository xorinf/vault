import { createContext, useReducer, useEffect, useCallback } from 'react';
import * as authAPI from '../api/auth.api';

/** @type {React.Context} */
export const AuthContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem('vault_user') || 'null'),
  token: localStorage.getItem('vault_token') || null,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false, error: null };
    case 'AUTH_FAILURE':
      return { ...state, user: null, token: null, loading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...state, user: null, token: null, loading: false, error: null };
    case 'AUTH_LOADED':
      return { ...state, loading: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('vault_token');
      if (!token) {
        dispatch({ type: 'AUTH_LOADED' });
        return;
      }
      try {
        const data = await authAPI.checkAuth();
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: data.payload, token },
        });
      } catch {
        localStorage.removeItem('vault_token');
        localStorage.removeItem('vault_user');
        dispatch({ type: 'AUTH_LOADED' });
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const data = await authAPI.login(credentials);
      localStorage.setItem('vault_token', data.token);
      localStorage.setItem('vault_user', JSON.stringify(data.payload));
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: data.payload, token: data.token },
      });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: msg });
      throw err;
    }
  }, []);

  const register = useCallback(async (formData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const data = await authAPI.register(formData);
      dispatch({ type: 'AUTH_LOADED' });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: msg });
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('vault_token');
    localStorage.removeItem('vault_user');
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'ADMIN',
    login,
    register,
    logout,
    dispatch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
