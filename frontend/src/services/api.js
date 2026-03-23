/**
 * API Service
 * Axios instance and API utilities
 */

import axios from 'axios';
import toast from 'react-hot-toast';

// Get API URL from environment or use proxy in development
const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error?.message || 'Something went wrong';

    // Show toast for errors (except 404s which are handled by components)
    if (error.response?.status !== 404) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
