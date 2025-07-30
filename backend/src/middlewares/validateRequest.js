// src/middlewares/validateRequest.js
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    // Creamos un ApiError con status 422 Unprocessable Entity
    const apiError = new ApiError(
      422,
      'Errores de validación',
      'VALIDATION_ERROR'
    );

    // Adjuntamos detalles para el front
    apiError.details = formatted;

    return next(apiError);
  }

  next();
};

export default validateRequest;
