import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
