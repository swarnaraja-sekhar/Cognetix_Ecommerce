/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing auth on mount - Requires fresh login, not auto-login
  useEffect(() => {
    // Don't auto-login users on new device or page refresh
    // Users must explicitly login via the login form
    // This ensures security and proper authentication flow
    setLoading(false);
  }, []);

  // Register new user
  const register = async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.register({ name, email, password });
      
      if (response.success) {
        const { token, ...userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        const { token, ...userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  // Switch user without logging out the previous one (for testing concurrent access)
  const switchUser = async (email, password) => {
    try {
      setError(null);
      
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        const { token, ...userData } = response.data;
        // Store multiple users for concurrent access testing
        const existingUsers = JSON.parse(localStorage.getItem('userSessions') || '[]');
        
        // Check if this user is already logged in
        const userIndex = existingUsers.findIndex(u => u.email === userData.email);
        if (userIndex >= 0) {
          existingUsers[userIndex] = { ...userData, token };
        } else {
          existingUsers.push({ ...userData, token });
        }
        
        localStorage.setItem('userSessions', JSON.stringify(existingUsers));
        
        // Set current user
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Switch user failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Get all logged in user sessions
  const getActiveSessions = () => {
    try {
      return JSON.parse(localStorage.getItem('userSessions') || '[]');
    } catch {
      return [];
    }
  };

  // Switch to a different logged in user
  const switchToSession = (email) => {
    const sessions = getActiveSessions();
    const session = sessions.find(s => s.email === email);
    
    if (session) {
      localStorage.setItem('token', session.token);
      localStorage.setItem('user', JSON.stringify(session));
      setUser(session);
      return { success: true };
    }
    
    return { success: false, message: 'Session not found' };
  };

  // Logout specific user session
  const logoutSession = (email) => {
    const sessions = getActiveSessions();
    const filteredSessions = sessions.filter(s => s.email !== email);
    localStorage.setItem('userSessions', JSON.stringify(filteredSessions));
    
    // If logging out current user, switch to another or fully logout
    if (user?.email === email) {
      if (filteredSessions.length > 0) {
        switchToSession(filteredSessions[0].email);
      } else {
        logout();
      }
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(userData);
      
      if (response.success) {
        const { token, ...updatedUser } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      return { success: false, message };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    register,
    login,
    logout,
    updateProfile,
    setError,
    switchUser,
    switchToSession,
    logoutSession,
    getActiveSessions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
