// src/modules/core/validators/permisoValidator.js
import { param } from 'express-validator';
import validateRequest from '../../../middlewares/validateRequest.js';

export const idParamValidator = [
  param('id').isUUID().withMessage('ID inválido'),
  validateRequest
];
