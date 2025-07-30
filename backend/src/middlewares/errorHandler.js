// src/middlewares/errorHandler.js
import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  const code = err.code || 'ERROR_INTERNO';

  if (!(err instanceof ApiError)) {
    console.error('❌ Error no manejado:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    details: err.details || undefined  
  });
};

export default errorHandler;
