// src/modules/core/validators/authValidator.js
import { body } from 'express-validator';
import validateRequest from '../../../middlewares/validateRequest.js';

export const loginValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  body('orgId').optional().isUUID().withMessage('orgId inválido'),
  validateRequest
];
export const registerValidator = [
  body('nombre').notEmpty(),
  body('apellido').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  validateRequest
];

export const registerOrganizationValidator = [
  body('pendingToken').notEmpty(),
  body('nombre').notEmpty(),
  body('dominio').notEmpty(),
  body('sector').optional().isString(),
  body('descripcionProblema').optional().isLength({ max: 500 }),
  validateRequest
];

// Para flujo con pendingToken (registro)
export const joinOrganizationWithPendingValidator = [
  body('pendingToken').notEmpty().withMessage('pendingToken requerido'),
  body().custom((val) => {
    if (!val.inviteToken && !val.orgId && !val.dominio) {
      throw new Error('Debes indicar inviteToken, orgId o dominio');
    }
    return true;
  }),
  body('inviteToken').optional().isString(),
  body('orgId').optional().isUUID(),
  body('dominio').optional().isString(),
  validateRequest
];

// Para flujo con JWT (usuario ya autenticado)
export const joinOrganizationValidator = [
  body().custom((val) => {
    if (!val.inviteToken && !val.orgId && !val.dominio) {
      throw new Error('Debes indicar inviteToken, orgId o dominio');
    }
    return true;
  }),
  body('inviteToken').optional().isString(),
  body('orgId').optional().isUUID(),
  body('dominio').optional().isString(),
  validateRequest
];

export const switchOrgValidator = [
  body('orgId').isUUID().withMessage('orgId inválido'),
  validateRequest
];

export const forgotPasswordValidator = [
  body('email').isEmail(),
  validateRequest
];

export const resetPasswordValidator = [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  validateRequest
];

export const verifyEmailValidator = [
  body('token').notEmpty(),
  validateRequest
];

export const resendVerificationValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  validateRequest
];
