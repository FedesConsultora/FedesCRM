// src/api/core.js
import api from './axios';

// --- Auth ---
export const login = (data) => api.post('/core/auth/login', data);
export const register = (data) => api.post('/core/auth/register', data);
export const googleLogin = (data) => api.post('/core/auth/google', data);
export const forgotPassword = (data) => api.post('/core/auth/forgot-password', data);
export const resetPassword = (data) => api.post('/core/auth/reset-password', data);
export const registerOrganization = (data) => api.post('/core/auth/register-org', data);
export const verifyEmail = (token) => {
  return api.post('/core/auth/verify-email', { token }); // ✅ Asegura que sea un objeto
};
export const me = () => api.get('/api/core/auth/me');

// --- 2FA ---
export const login2FA = (data) => api.post('/core/auth/2fa', data);
export const setup2FA = () => api.post('/core/auth/2fa/setup');
export const verify2FA = (data) => api.post('/core/auth/2fa/verify', data);
export const disable2FA = () => api.post('/core/auth/2fa/disable');

// --- Google OAuth URL ---
export const googleUrl = () => `${process.env.REACT_APP_API_URL}/core/auth/google`;


// --- Usuarios ---
export const getUsuarios = () => api.get('/api/core/usuarios');
export const getUsuario = (id) => api.get(`/api/core/usuarios/${id}`);
export const createUsuario = (data) => api.post('/api/core/usuarios', data);
export const updateUsuario = (id, data) => api.patch(`/api/core/usuarios/${id}`, data);
export const deleteUsuario = (id) => api.delete(`/api/core/usuarios/${id}`);

// --- Roles ---
export const getRoles = () => api.get('/core/roles');
export const getRol = (id) => api.get(`/core/roles/${id}`);
export const createRol = (data) => api.post('/core/roles', data);
export const updateRol = (id, data) => api.patch(`/core/roles/${id}`, data);
export const deleteRol = (id) => api.delete(`/core/roles/${id}`);
export const assignPermiso = (rolId, permisoId) =>
  api.post(`/core/roles/${rolId}/permisos`, { permisoId });
export const removePermiso = (rolId, permisoId) =>
  api.delete(`/core/roles/${rolId}/permisos/${permisoId}`);

// --- Permisos ---
export const getPermisos = () => api.get('/core/permisos');

// --- Organizaciones ---
export const getOrganizaciones = () => api.get('/core/organizaciones');
export const getOrganizacion = (id) => api.get(`/core/organizaciones/${id}`);
export const createOrganizacion = (data) => api.post('/core/organizaciones', data);
export const updateOrganizacion = (id, data) => api.patch(`/core/organizaciones/${id}`, data);
export const deleteOrganizacion = (id) => api.delete(`/core/organizaciones/${id}`);
