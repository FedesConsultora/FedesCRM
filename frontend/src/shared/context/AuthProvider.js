// src/shared/context/AuthProvider.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { me, switchOrg } from '../../api/core';
import { handleApiError } from '../utils/handleApiError';

export const AuthContext = createContext();

const decodeJwt = (jwt) => {
  try { return JSON.parse(atob(jwt.split('.')[1])); } catch { return {}; }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [token, setToken]               = useState(localStorage.getItem('token') || null);
  const [activeOrgId, setActiveOrgId]   = useState(null);
  const [organizations, setOrganizations] = useState([]);

  // --- Guardar o limpiar token en localStorage + derivar org activa desde el JWT ---
  const saveToken = useCallback((jwt) => {
    setToken(jwt || null);
    if (jwt) localStorage.setItem('token', jwt);
    else localStorage.removeItem('token');

    // Derivar orgId del JWT si viene
    const payload = jwt ? decodeJwt(jwt) : {};
    setActiveOrgId(payload?.orgId ?? null);

    // Notificar a listeners (e.g. Axios interceptor / otros)
    document.dispatchEvent(new Event('authTokenUpdated'));
  }, []);

  // --- Cerrar sesión (estable) ---
  const logout = useCallback(() => {
    saveToken(null);
    setUser(null);
    setOrganizations([]);
    setActiveOrgId(null);
  }, [saveToken]);

  // --- Normaliza la respuesta de /me ---
  const applyMeResponse = useCallback((data) => {
    // Aceptamos ambas variantes: { user, organizations, activeOrgId } o user.organizations
    const u = data?.user ?? null;
    setUser(u);

    const orgs = data?.organizations ?? u?.organizations ?? [];
    setOrganizations(Array.isArray(orgs) ? orgs : []);

    // Si el back manda activeOrgId en /me, priorizarlo sobre el del JWT
    if (data?.activeOrgId) setActiveOrgId(data.activeOrgId);
  }, []);

  // --- Obtener perfil de usuario (me) ---
  const fetchMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setOrganizations([]);
      setActiveOrgId(null);
      setLoading(false);
      return;
    }
    try {
      const res = await me();
      applyMeResponse(res.data);
    } catch (error) {
      handleApiError(error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout, applyMeResponse]);

  // Cargar me al montar o cuando cambia token
  useEffect(() => { fetchMe(); }, [fetchMe]);

  // Si otro lado del app cambia el token, refrescamos
  useEffect(() => {
    const onAuthTokenUpdated = () => fetchMe();
    document.addEventListener('authTokenUpdated', onAuthTokenUpdated);
    return () => document.removeEventListener('authTokenUpdated', onAuthTokenUpdated);
  }, [fetchMe]);

  // --- Cambiar organización activa (devuelve nuevo JWT con orgId) ---
  const changeOrg = useCallback(async (orgId) => {
    if (!orgId || orgId === activeOrgId) return;
    try {
      const { data } = await switchOrg(orgId); // espera { token, ... }
      if (data?.token) saveToken(data.token);
      await fetchMe();
    } catch (error) {
      handleApiError(error);
    }
  }, [activeOrgId, fetchMe, saveToken]);

  const hasPermiso = useCallback((permiso) => user?.permisos?.includes(permiso), [user]);
  const hasRol     = useCallback((rol) => user?.rol === rol, [user]);

  // Usado por el login exitoso del front si ya llega { token, user }
  const login = useCallback((jwt, userData = null) => {
    saveToken(jwt);
    if (userData) {
      setUser(userData);
      // Si llega activeOrgId/orgs en la respuesta de login, setear también:
      setActiveOrgId(userData?.activeOrgId ?? decodeJwt(jwt)?.orgId ?? null);
      setOrganizations(userData?.organizations ?? []);
    } else {
      // Si no llega el user, hacemos /me para sincronizar
      fetchMe();
    }
  }, [fetchMe, saveToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        organizations,
        activeOrgId,
        setActiveOrgId, // por si querés controlarlo externamente
        changeOrg,
        login,
        logout,
        hasPermiso,
        hasRol,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
