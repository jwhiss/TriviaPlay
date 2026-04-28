import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const createGame = async (config) => {
  const response = await api.post('/admin/games', config);
  return response.data;
};

export const getGames = async () => {
  const response = await api.get('/admin/games');
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/admin/categories');
  return response.data;
};

export const getQuestions = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'Any') params.append('category', filters.category);
  if (filters.difficulty && filters.difficulty !== 'Any') params.append('difficulty', filters.difficulty);
  if (filters.type && filters.type !== 'Any') params.append('type', filters.type);
  
  const response = await api.get(`/admin/questions?${params.toString()}`);
  return response.data;
};

export default api;
