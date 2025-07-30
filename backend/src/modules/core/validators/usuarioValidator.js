// src/modules/core/validators/usuarioValidator.js
import { body, param } from 'express-validator';
import validateRequest from '../../../middlewares/validateRequest.js';

export const crearUsuarioValidator = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').optional().isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
  body('rolId').optional().isUUID().withMessage('Rol inválido'),
  body('organizacionId').notEmpty().isUUID().withMessage('Organización requerida'),
  validateRequest
];

export const actualizarUsuarioValidator = [
  param('id').isUUID().withMessage('ID inválido'),
  body('email').optional().isEmail(),
  body('rolId').optional().isUUID(),
  validateRequest
];

export const idParamValidator = [
  param('id').isUUID().withMessage('ID inválido'),
  validateRequest
];
