// src/modules/core/routes/authRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { pendingTokenMiddleware } from '../../../middlewares/pendingTokenMiddleware.js';
import {
  loginValidator,
  registerValidator,
  registerOrganizationValidator,
  joinOrganizationValidator,
  switchOrgValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator
} from '../validators/authValidator.js';

const router = Router();

// Step 1 y Step 2
router.post('/register', registerValidator, controller.register);
router.post('/register-org', pendingTokenMiddleware, registerOrganizationValidator, controller.registerOrganization);

// Join org con pendingToken (registro)
router.post('/join-org', pendingTokenMiddleware, joinOrganizationValidator, controller.joinOrganization);

// Join org con JWT (usuario activo)
router.post('/join-org-auth', authMiddleware, joinOrganizationValidator, controller.joinOrganization);

// Login y cambio de org
router.post('/login', loginValidator, controller.login);
router.post('/switch-org', authMiddleware, switchOrgValidator, controller.switchOrganization);

// 2FA
router.post('/2fa', controller.login2FA);
router.post('/2fa/setup', authMiddleware, controller.setup2FA);
router.post('/2fa/verify', authMiddleware, controller.verify2FA);
router.post('/2fa/disable', authMiddleware, controller.disable2FA);

// Google
router.post('/google', controller.googleLogin);

// Verificación email y recuperación
router.post('/verify-email', verifyEmailValidator, controller.verifyEmail);
router.post('/forgot-password', forgotPasswordValidator, controller.forgotPassword);
router.post('/reset-password', resetPasswordValidator, controller.resetPassword);

// Perfil
router.get('/me', authMiddleware, controller.me);

export default router;
