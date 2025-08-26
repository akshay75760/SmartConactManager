import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081';

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle responses or errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If a 401 Unauthorized response is received, clear token
    if (error.response && error.response.status === 401) {
      console.log('🚨 Received 401, clearing authentication data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete instance.defaults.headers.common['Authorization'];
      
      // Only redirect if we're not already on login page
      if (window.location.pathname !== '/login') {
        // Use a gentle redirect with a delay to avoid immediate redirects
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
