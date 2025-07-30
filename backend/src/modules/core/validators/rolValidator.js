// src/modules/core/validators/rolValidator.js
import { body, param } from 'express-validator';
import validateRequest from '../../../middlewares/validateRequest.js';

export const crearRolValidator = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('descripcion').optional().isString(),
  validateRequest
];

export const actualizarRolValidator = [
  param('id').isUUID().withMessage('ID inválido'),
  body('nombre').optional().isString(),
  body('descripcion').optional().isString(),
  validateRequest
];

export const idParamValidator = [
  param('id').isUUID().withMessage('ID inválido'),
  validateRequest
];

export const asignarPermisoValidator = [
  param('id').isUUID().withMessage('ID de rol inválido'),
  body('permisoId').isUUID().withMessage('ID de permiso inválido'),
  validateRequest
];
