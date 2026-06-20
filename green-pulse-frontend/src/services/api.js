import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
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

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout on 401 if it's an auth failure (not admin/data endpoint)
    // Don't logout if the error is caught by calling code
    if (error.response?.status === 401) {
      // Check if this is a real auth failure vs permission denied
      const errorMsg = error.response?.data?.message || '';
      // Only logout if it's a token/auth issue, not permission denied
      if (errorMsg.includes('token') || errorMsg.includes('unauthorized') || errorMsg.includes('Unauthorized')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;