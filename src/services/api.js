import axios from 'axios';
// Default to backend on port 5000 if VITE_API_BASE_URL is not provided
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

