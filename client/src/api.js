import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message || (err?.message === 'Network Error' ? 'Cannot reach the server.' : fallback);

export default api;
