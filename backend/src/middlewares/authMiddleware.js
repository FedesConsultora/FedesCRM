import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import { Usuario, Rol, Permiso } from '../modules/core/models/index.js';

export const authMiddleware = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No se encontró el token', 'AUTH_NO_TOKEN');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Usuario.findByPk(payload.id, {
      include: {
        model: Rol,
        as: 'rol',
        include: { model: Permiso } // Para cargar permisos
      }
    });

    if (!user) throw new ApiError(401, 'Usuario no encontrado', 'AUTH_USER_NOT_FOUND');

    req.user = {
      id: user.id,
      email: user.email,
      rol: user.rol?.nombre,
      permisos: user.rol?.Permisos?.map(p => p.nombre) || []
    };

    next();
  } catch (err) {
    next(new ApiError(401, 'Token inválido o expirado', 'AUTH_INVALID_TOKEN'));
  }
};
