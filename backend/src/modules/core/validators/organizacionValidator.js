// src/modules/core/validators/organizacionValidator.js
import { body, param } from 'express-validator';
import validateRequest from '../../../middlewares/validateRequest.js';

export const crearOrganizacionValidator = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('dominio').isString().notEmpty().withMessage('El dominio es obligatorio'),
  validateRequest
];

export const actualizarOrganizacionValidator = [
  param('id').isUUID().withMessage('ID inválido'),
  body('nombre').optional().isString(),
  body('dominio').optional().isString(),
  validateRequest
];

export const idParamValidator = [
  param('id').isUUID().withMessage('ID inválido'),
  validateRequest
];
