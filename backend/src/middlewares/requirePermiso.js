// src/middlewares/permisoMiddleware.js
import ApiError from '../utils/ApiError.js';

export const requirePermiso = (permiso) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'No autenticado', 'AUTH_REQUIRED'));
    }

    const permisosUsuario = req.user.permisos || [];

    // Fix: si es admin global o tiene el permiso requerido
    if (!permisosUsuario.includes(permiso) && !permisosUsuario.includes('admin.global')) {
      return next(new ApiError(403, 'No tienes permisos para esta acción', 'PERMISO_DENEGADO'));
    }

    next();
  };
};
