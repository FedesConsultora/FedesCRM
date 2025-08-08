// src/middlewares/pendingTokenMiddleware.js
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

export const pendingTokenMiddleware = (req, _res, next) => {
  const token = req.body.pendingToken || req.headers['x-pending-token'];

  if (!token) {
    return next(new ApiError(401, 'Token de registro requerido', 'REGISTER_TOKEN_MISSING'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Guardamos info mínima para el controller
    req.pendingUser = {
      id: decoded.userId,
      email: decoded.email
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'El token de registro expiró', 'REGISTER_TOKEN_EXPIRED'));
    }
    return next(new ApiError(401, 'Token de registro inválido', 'REGISTER_TOKEN_INVALID'));
  }
};
