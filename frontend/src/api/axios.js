// src/api/axios.js
import axios from 'axios';
import { handleApiError } from '../shared/utils/handleApiError';
import { getCsrfToken, ensureCsrfTokenLoaded } from '../shared/utils/csrf';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 15000,
  withCredentials: true, // ← imprescindible para cookies httpOnly
});

// Adjuntamos CSRF en mutaciones
api.interceptors.request.use(async (config) => {
  const needsCsrf = /^(post|put|patch|delete)$/i.test(config.method || 'get');
  if (needsCsrf) {
    await ensureCsrfTokenLoaded();
    const token = getCsrfToken();
    if (token) config.headers['X-CSRF-Token'] = token;
  }
  return config;
});

// Manejo de errores 401/403
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const code   = error.response?.data?.code;
    const url    = error.config?.url || '';

    // No spamear ni disparar ciclo al consultar /me sin estar logueado
    const isMeEndpoint = /\/core\/auth\/me$/.test(url);

    if (status === 401 || status === 403) {
      // Mostrar feedback salvo que sea el /me sin token (estado "no logueado" normal)
      if (!(isMeEndpoint && code === 'AUTH_NO_TOKEN')) {
        handleApiError(error);
      }

      // Notificar invalidez de sesión SOLO si no es el /me sin token
      const shouldBroadcast =
        !isMeEndpoint && code !== 'AUTH_NO_TOKEN';

      if (shouldBroadcast) {
        document.dispatchEvent(new Event('authStateInvalid'));
      }
    }

    return Promise.reject(error);
  }
);

export default api;