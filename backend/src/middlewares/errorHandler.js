// src/middlewares/errorHandler.js
import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let code = err.code || 'ERROR_INTERNO';

  // Si el error no es controlado
  if (!(err instanceof ApiError)) {
    console.error('❌ Error no manejado:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code
  });
};

export default errorHandler;
