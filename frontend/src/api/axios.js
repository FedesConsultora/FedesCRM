// src/api/axios.js
import axios from 'axios';
import { handleApiError } from '../shared/utils/handleApiError';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 15000
  // withCredentials: true, // ← habilitar sólo si usás cookies httpOnly en el back
});

// Adjunta JWT si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Solo gestionamos aquí auth/permiso; el resto que lo manejen por pantalla
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // Mostramos feedback centralizado según 'code'
      handleApiError(error);

      // En 401 limpiamos sesión para evitar loops
      if (status === 401) {
        localStorage.removeItem('token');
        document.dispatchEvent(new Event('authTokenUpdated'));
      }
    }
    // Devolvemos el error para que cada caso lo procese si hace falta
    return Promise.reject(error);
  }
);

export default api;
