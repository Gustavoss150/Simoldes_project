// utils/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para configurar o token no cabeçalho
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
