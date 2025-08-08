// src/middlewares/permisoMiddleware.js
import ApiError from '../utils/ApiError.js';

export const requirePermiso = (permiso) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'No autenticado', 'AUTH_REQUIRED'));
    }
    if (!req.user.permisos.includes(permiso)) {
      return next(new ApiError(403, 'No tienes permisos para esta acción', 'PERMISO_DENEGADO'));
    }
    next();
  };
};
