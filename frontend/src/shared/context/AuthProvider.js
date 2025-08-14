// src/shared/context/AuthProvider.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { me, switchOrg } from '../../api/core';
import { handleApiError } from '../utils/handleApiError';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [activeOrgId, setActiveOrgId]   = useState(null);
  const [organizations, setOrganizations] = useState([]);

  const applyMeResponse = useCallback((data) => {
    const u = data?.user ?? null;
    setUser(u);
    setActiveOrgId(u?.organizacion?.id ?? null);
    setOrganizations(u?.organizations ?? []);
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      const res = await me();
      console.log('usuario: ', res.data)
      applyMeResponse(res.data);
    } catch (error) {
      // si no hay sesión, quedamos en null
      setUser(null);
      setActiveOrgId(null);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, [applyMeResponse]);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  useEffect(() => {
    const onInvalid = () => fetchMe();
    document.addEventListener('authStateInvalid', onInvalid);
    return () => document.removeEventListener('authStateInvalid', onInvalid);
  }, [fetchMe]);

  const changeOrg = useCallback(async (orgId) => {
    if (!orgId || orgId === activeOrgId) return;
    try {
      await switchOrg(orgId);   // el back setea nueva cookie
      await fetchMe();
    } catch (error) {
      handleApiError(error);
    }
  }, [activeOrgId, fetchMe]);

  // login exitoso: si el back devolvió { user }, podemos setear directo; si no, hacemos /me
  const login = useCallback(async (userData = null) => {
    if (userData) {
      setUser(userData);
      setActiveOrgId(userData?.organizacion?.id ?? null);
      setOrganizations(userData?.organizations ?? []);
    } else {
      await fetchMe();
    }
  }, [fetchMe]);

  const logout = useCallback(() => {
    // el botón de logout debería llamar a /auth/logout; acá solo limpiamos estado.
    setUser(null);
    setActiveOrgId(null);
    setOrganizations([]);
  }, []);

  const hasPermiso = useCallback((permiso) => user?.permisos?.includes(permiso), [user]);
  const hasRol     = useCallback((rol) => user?.rol === rol, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        organizations,
        activeOrgId,
        setActiveOrgId,
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
