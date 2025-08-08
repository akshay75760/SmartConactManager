import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider Component
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('🔄 Checking authentication status...');
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          // Validate token with backend
          try {
            const response = await axios.post('/api/auth/validate', { token });
            if (response.data && response.data.token) {
              console.log('✅ Token is valid, user authenticated:', response.data.email);
              setIsAuthenticated(true);
              setUser(JSON.parse(savedUser));
            } else {
              throw new Error('Invalid token response');
            }
          } catch (error) {
            console.log('❌ Token validation failed, clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log('❌ No token or user data found');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Failed to check authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Load user on mount only
    loadUser();
  }, []); // Remove 'user' dependency to prevent loop

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      if (response.data && response.data.token) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          email: response.data.email,
          name: response.data.name,
          roleList: response.data.roles || []
        }));
        
        setIsAuthenticated(true);
        setUser({
          email: response.data.email,
          name: response.data.name,
          roleList: response.data.roles || []
        });
        setLoading(false);
        return response.data; // Return response data on success
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      throw error; // Re-throw to be caught by the component
    }
  };

  const logout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login', { state: { message: { content: 'You have been logged out.', type: 'green' } } });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear auth state on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login', { state: { message: { content: 'Logout completed.', type: 'green' } } });
    }
  };

  // OAuth login method - used by OAuth success page
  const oauthLogin = useCallback((userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setLoading(false);
  }, []);

  // Update user method - used for profile updates
  const updateUser = useCallback((updatedUserData) => {
    console.log('🔄 Updating user data in context:', updatedUserData);
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  }, []);

  const authContextValue = {
    isAuthenticated,
    user,
    loading,
    login,
    oauthLogin,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export everything
export { AuthContext, AuthProvider, useAuth };
