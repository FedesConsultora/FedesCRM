// src/modules/core/validators/invitacionValidator.js
import { body } from 'express-validator';
import validateRequest from '../../../middlewares/validateRequest.js';

export const crearInvitacionValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('rolId').optional().isUUID().withMessage('rolId inválido'),
  body('dias').optional().isInt({ min: 1, max: 60 }).withMessage('Días inválidos'),
  body('resend').optional().isBoolean().withMessage('Resend debe ser booleano'),
  validateRequest
];

export const aceptarInvitacionValidator = [
  body('token').notEmpty().withMessage('Token requerido'),
  validateRequest
];
