import { body } from 'express-validator';
import validateRequest from '../../../middlewares/validateRequest.js';

export const loginValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validateRequest
];

export const registerValidator = [
  body('nombre').notEmpty().withMessage('Nombre es requerido'),
  body('apellido').notEmpty().withMessage('Apellido es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
  body('organizacionId').notEmpty().withMessage('Organización es requerida'),
  validateRequest
];

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  validateRequest
];

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Token requerido'),
  body('newPassword').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
  validateRequest
];

export const verifyEmailValidator = [
  body('token').notEmpty().withMessage('Token requerido'),
  validateRequest
];
