// src/api/core.js
import api from './axios';

// Helper para rutas con orgId
const orgPath = (orgId, path = '') => `/core/orgs/${orgId}${path}`;

/* ------------------------------ AUTH / ACCOUNT ----------------------------- */
export const register          = (data)  => api.post('/core/auth/register', data);
export const registerOrg       = (data)  => api.post('/core/auth/register-org', data); // requiere pendingToken en cookie/header según tu middleware
export const joinOrgWithToken  = (data)  => api.post('/core/auth/join-org', data);     // flujo con pendingToken middleware
export const joinOrgAuth       = (data)  => api.post('/core/auth/join-org-auth', data);// usuario logueado

export const login             = (data)  => api.post('/core/auth/login', data);
export const switchOrg         = (orgId) => api.post('/core/auth/switch-org', { orgId });

export const login2FA          = (data)  => api.post('/core/auth/2fa', data);
export const setup2FA          = ()      => api.post('/core/auth/2fa/setup');
export const verify2FA         = (data)  => api.post('/core/auth/2fa/verify', data);
export const disable2FA        = ()      => api.post('/core/auth/2fa/disable');

export const googleLogin       = (data)  => api.post('/core/auth/google', data); // intercambio del token de Google en tu back

export const verifyEmail       = (token) => api.post('/core/auth/verify-email', { token });
export const forgotPassword    = (data)  => api.post('/core/auth/forgot-password', data);
export const resetPassword     = (data)  => api.post('/core/auth/reset-password', data);

export const me                = ()      => api.get('/core/auth/me');

/* -------------------------------- ORGANIZACIONES --------------------------- */
// Montadas en /api/core/organizaciones
export const getOrganizaciones    = (params)          => api.get('/core/organizaciones', { params });
export const getOrganizacion      = (id)              => api.get(`/core/organizaciones/${id}`);
export const createOrganizacion   = (data)            => api.post('/core/organizaciones', data);
export const updateOrganizacion   = (id, data)        => api.patch(`/core/organizaciones/${id}`, data);
export const deleteOrganizacion   = (id)              => api.delete(`/core/organizaciones/${id}`);

/* ----------------------------------- USUARIOS (scoped) --------------------- */
// /api/core/orgs/:orgId/users
export const getUsuarios       = (orgId, params)        => api.get(orgPath(orgId, '/users'), { params });
export const getUsuario        = (orgId, id)            => api.get(orgPath(orgId, `/users/${id}`));
export const createUsuario     = (orgId, data)          => api.post(orgPath(orgId, '/users'), data);
export const updateUsuario     = (orgId, id, data)      => api.patch(orgPath(orgId, `/users/${id}`), data);
export const deleteUsuario     = (orgId, id)            => api.delete(orgPath(orgId, `/users/${id}`));

// Global admin (si tu user tiene permisos globales)
export const getUsuariosGlobal   = (params)             => api.get('/core/admin/users', { params });
export const getUsuarioGlobal    = (id)                 => api.get(`/core/admin/users/${id}`);
export const createUsuarioGlobal = (data)               => api.post('/core/admin/users', data);
export const updateUsuarioGlobal = (id, data)           => api.patch(`/core/admin/users/${id}`, data);
export const deleteUsuarioGlobal = (id)                 => api.delete(`/core/admin/users/${id}`);

/* ----------------------------------- ROLES (scoped) ------------------------ */
// /api/core/orgs/:orgId/roles
export const getRoles          = (orgId, params)        => api.get(orgPath(orgId, '/roles'), { params });
export const getRol            = (orgId, id)            => api.get(orgPath(orgId, `/roles/${id}`));
export const createRol         = (orgId, data)          => api.post(orgPath(orgId, '/roles'), data);
export const updateRol         = (orgId, id, data)      => api.patch(orgPath(orgId, `/roles/${id}`), data);
export const deleteRol         = (orgId, id)            => api.delete(orgPath(orgId, `/roles/${id}`));

// Permisos de rol (scoped)
export const assignPermiso     = (orgId, rolId, permisoId) => api.post(orgPath(orgId, `/roles/${rolId}/permisos`), { permisoId });
export const removePermiso     = (orgId, rolId, permisoId) => api.delete(orgPath(orgId, `/roles/${rolId}/permisos/${permisoId}`));

// Global admin roles
export const getRolesGlobal    = (params)               => api.get('/core/admin/roles', { params });
export const getRolGlobal      = (id)                   => api.get(`/core/admin/roles/${id}`);
export const createRolGlobal   = (data)                 => api.post('/core/admin/roles', data);
export const updateRolGlobal   = (id, data)             => api.patch(`/core/admin/roles/${id}`, data);
export const deleteRolGlobal   = (id)                   => api.delete(`/core/admin/roles/${id}`);
export const assignPermisoGlobal = (rolId, permisoId)   => api.post(`/core/admin/roles/${rolId}/permisos`, { permisoId });
export const removePermisoGlobal = (rolId, permisoId)   => api.delete(`/core/admin/roles/${rolId}/permisos/${permisoId}`);

/* -------------------------------- PERMISOS (scoped) ------------------------ */
// /api/core/orgs/:orgId/permisos
export const getPermisos       = (orgId, params)        => api.get(orgPath(orgId, '/permisos'), { params });
export const getPermiso        = (orgId, id)            => api.get(orgPath(orgId, `/permisos/${id}`));

// Global admin permisos
export const getPermisosGlobal = (params)               => api.get('/core/admin/permisos', { params });
export const getPermisoGlobal  = (id)                   => api.get(`/core/admin/permisos/${id}`);

/* --------------------------------- MEMBRESÍAS ------------------------------ */
// Montado en /api/core (router de membresías expone /orgs/:orgId/...)
export const listMembers       = (orgId, params)        => api.get(orgPath(orgId, '/members'), { params });
export const approveMember     = (orgId, membershipId)  => api.post(orgPath(orgId, `/members/${membershipId}/approve`));
export const rejectMember      = (orgId, membershipId)  => api.post(orgPath(orgId, `/members/${membershipId}/reject`));
export const changeMemberRole  = (orgId, membershipId, data) => api.patch(orgPath(orgId, `/members/${membershipId}/role`), data);
export const joinRequest       = (orgId)                => api.post(orgPath(orgId, '/join-request'));

/* --------------------------------- AUDIT LOGS ------------------------------ */
// /api/core/audit-logs (auth + permiso 'audit-logs.ver')
export const getAuditLogs      = (params)               => api.get('/core/audit-logs', { params });
