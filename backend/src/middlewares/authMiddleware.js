// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import { AUTH_COOKIE_NAME } from '../utils/authCookies.js';
import { Usuario, OrganizacionUsuario, Rol, Permiso } from '../modules/core/models/index.js';

export const authMiddleware = async (req, _res, next) => {
  try {
    const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
    if (!cookieToken) throw new ApiError(401, 'No se encontró el token', 'AUTH_NO_TOKEN');

    let payload;
    try {
      payload = jwt.verify(cookieToken, process.env.JWT_SECRET);
    } catch (err) {
      if (err?.name === 'TokenExpiredError') {
        throw new ApiError(401, 'El token expiró', 'AUTH_TOKEN_EXPIRED');
      }
      throw new ApiError(401, 'Token inválido', 'AUTH_INVALID_TOKEN');
    }

    const { id: userId, orgId } = payload || {};
    if (!userId) throw new ApiError(401, 'Token sin información de usuario', 'AUTH_PAYLOAD_INVALID');

    const user = await Usuario.findByPk(userId);
    if (!user) throw new ApiError(401, 'Usuario no encontrado', 'AUTH_USER_NOT_FOUND');

    if (user.rolGlobal !== 'superadmin_global') {
      if (!orgId) throw new ApiError(401, 'Token sin organización válida', 'AUTH_PAYLOAD_INVALID');

      const membership = await OrganizacionUsuario.findOne({
        where: { usuarioId: userId, organizacionId: orgId, estado: 'activo' },
        include: [{ model: Rol, as: 'rol', include: [{ model: Permiso, as: 'permisos' }] }]
      });
      if (!membership) throw new ApiError(403, 'No perteneces a esta organización', 'ORG_ACCESS_DENIED');

      req.user = {
        id: user.id,
        email: user.email,
        orgId,
        rol: membership.rol?.nombre || null,
        permisos: membership.rol?.permisos?.map(p => p.nombre) || []
      };
    } else {
      req.user = { id: user.id, email: user.email, rol: 'superadmin_global', permisos: ['*'] };
    }

    next();
  } catch (err) {
    next(err instanceof ApiError ? err : new ApiError(401, 'Token inválido o expirado', 'AUTH_INVALID_TOKEN'));
  }
};
