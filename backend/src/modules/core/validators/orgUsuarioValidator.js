// src/modules/core/validators/orgUsuarioValidator.js
import { body, param } from 'express-validator';
import validateRequest from '../../../middlewares/validateRequest.js';

const estados = ['activo', 'invitado', 'pendiente', 'suspendido'];

export const userIdParam = [
  param('id').isUUID().withMessage('ID inválido'),
  validateRequest
];

export const crearUsuarioValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('nombre').optional().isString(),
  body('apellido').optional().isString(),
  body('telefono').optional().isString(),
  body('password').optional().isLength({ min: 6 }),
  body('rolId').optional().isUUID().withMessage('rolId inválido'),
  body('estado').optional().isIn(estados).withMessage(`Estado inválido (${estados.join(', ')})`),
  validateRequest
];

export const actualizarUsuarioValidator = [
  body('email').not().exists().withMessage('No se puede cambiar el email desde aquí'),
  body('nombre').optional().isString(),
  body('apellido').optional().isString(),
  body('telefono').optional().isString(),
  body('password').optional().isLength({ min: 6 }),
  body('rolId').optional().isUUID().withMessage('rolId inválido'),
  body('estado').optional().isIn(estados).withMessage(`Estado inválido (${estados.join(', ')})`),
  validateRequest
];
