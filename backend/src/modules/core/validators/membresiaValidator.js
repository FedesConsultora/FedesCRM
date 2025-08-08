// src/modules/core/validators/membresiaValidator.js
import { body } from 'express-validator';
import validateRequest from '../../../middlewares/validateRequest.js';

export const aprobarMembresiaValidator = [
  body('rolId').optional().isUUID().withMessage('rolId inválido'),
  validateRequest
];

export const cambiarRolMembresiaValidator = [
  body('rolId').isUUID().withMessage('rolId inválido'),
  validateRequest
];


export const joinRequestValidator = [
  // No necesitamos validar el orgId acá porque viene como param y ya lo valida la ruta
  body().custom((_value, { req }) => {
    if (!req.params.orgId) {
      throw new Error('ID de organización requerido');
    }
    return true;
  }),
  validateRequest
];
