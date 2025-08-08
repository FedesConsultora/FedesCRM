// src/middlewares/authMiddleware.js
export const authMiddleware = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'No se encontró el token', 'AUTH_NO_TOKEN');
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err?.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'El token expiró', 'AUTH_TOKEN_EXPIRED'));
      }
      return next(new ApiError(401, 'Token inválido', 'AUTH_INVALID_TOKEN'));
    }

    const { id: userId, orgId } = payload;
    if (!userId) {
      throw new ApiError(401, 'Token sin información de usuario', 'AUTH_PAYLOAD_INVALID');
    }

    const user = await Usuario.findByPk(userId);
    if (!user) {
      throw new ApiError(401, 'Usuario no encontrado', 'AUTH_USER_NOT_FOUND');
    }

    // Si el usuario NO es superadmin_global, necesita orgId
    if (user.rolGlobal !== 'superadmin_global') {
      if (!orgId) {
        throw new ApiError(401, 'Token sin organización válida', 'AUTH_PAYLOAD_INVALID');
      }

      const membership = await OrganizacionUsuario.findOne({
        where: { usuario_id: userId, organizacion_id: orgId, estado: 'activo' },
        include: [{ model: Rol, as: 'rol', include: [{ model: Permiso }] }]
      });

      if (!membership) {
        throw new ApiError(403, 'No perteneces a esta organización', 'ORG_ACCESS_DENIED');
      }

      req.user = {
        id: user.id,
        email: user.email,
        orgId,
        rol: membership.rol?.nombre || null,
        permisos: membership.rol?.Permisos?.map(p => p.nombre) || []
      };
    } else {
      // superadmin_global → acceso global
      req.user = {
        id: user.id,
        email: user.email,
        rol: 'superadmin_global',
        permisos: ['*'] // todos los permisos globales
      };
    }

    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    return next(new ApiError(401, 'Token inválido o expirado', 'AUTH_INVALID_TOKEN'));
  }
};
