// src/shared/context/AuthProvider.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { me } from '../../api/core';
import { handleApiError } from '../utils/handleApiError';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // --- Guardar o limpiar token en localStorage ---
  const saveToken = useCallback((jwt) => {
    setToken(jwt);
    if (jwt) localStorage.setItem('token', jwt);
    else localStorage.removeItem('token');
    document.dispatchEvent(new Event('authTokenUpdated'));
  }, []);

  // --- Cerrar sesión (estable) ---
  const logout = useCallback(() => {
    saveToken(null);
    setUser(null);
  }, [saveToken]);

  // --- Obtener perfil de usuario (me) ---
  const fetchMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await me();
      setUser(res.data.user);
    } catch (error) {
      handleApiError(error);
      logout(); 
    } finally { 
      setLoading(false);
    }
    
  }, [token, logout]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const hasPermiso = useCallback((permiso) => user?.permisos?.includes(permiso), [user]);
  const hasRol = useCallback((rol) => user?.rol === rol, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login: (jwt, userData) => {
          saveToken(jwt);
          setUser(userData);
        },
        logout,
        hasPermiso,
        hasRol,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
