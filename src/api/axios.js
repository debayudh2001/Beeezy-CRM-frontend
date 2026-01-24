import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY } from '../utils/constants';
import toast from 'react-hot-toast';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if this is an auth endpoint (login/register) - let authSlice handle those errors
    const isAuthEndpoint = error.config?.url?.includes('/api/auth/login') || 
                          error.config?.url?.includes('/api/auth/register');
    
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized (token expired or invalid)
      if (status === 401 && !isAuthEndpoint) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      }
      
      // Handle 403 Forbidden (insufficient permissions)
      else if (status === 403 && !isAuthEndpoint) {
        toast.error('You do not have permission to perform this action.');
      }
      
      // Handle 404 Not Found
      else if (status === 404 && !isAuthEndpoint) {
        toast.error(data?.message || 'Resource not found.');
      }
      
      // Handle 500 Server Error
      else if (status === 500 && !isAuthEndpoint) {
        toast.error('Server error. Please try again later.');
      }
      
      // Handle other errors (but not for auth endpoints)
      else if (!isAuthEndpoint) {
        toast.error(data?.message || 'An error occurred.');
      }
    } else if (error.request && !isAuthEndpoint) {
      toast.error('Network error. Please check your connection.');
    } else if (!isAuthEndpoint) {
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
