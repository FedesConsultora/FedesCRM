// src/modules/core/routes/authRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { pendingTokenMiddleware } from '../../../middlewares/pendingTokenMiddleware.js';
import {
  loginValidator,
  registerValidator,
  registerOrganizationValidator,
  joinOrganizationWithPendingValidator,
  joinOrganizationValidator,
  switchOrgValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
  resendVerificationValidator
} from '../validators/authValidator.js';
import { loginLimiter, oauthLimiter } from '../../../middlewares/rateLimiters.js';

const router = Router();

router.get('/csrf', controller.csrf);

// Step 1 + Step 2
router.post('/register', registerValidator, controller.register);
router.post('/register-org', pendingTokenMiddleware, registerOrganizationValidator, controller.registerOrganization);

// Join org con pendingToken (registro)
router.post('/join-org', pendingTokenMiddleware, joinOrganizationWithPendingValidator, controller.joinOrganization);

// Join org con JWT (usuario activo)
router.post('/join-org-auth', authMiddleware, joinOrganizationValidator, controller.joinOrganization);

// Login / cambio org / logout
router.post('/login', loginLimiter, loginValidator, controller.login);
router.post('/switch-org', authMiddleware, switchOrgValidator, controller.switchOrganization);
router.post('/logout', controller.logout);

// 2FA
router.post('/2fa', loginLimiter, controller.login2FA);
router.post('/2fa/setup', authMiddleware, controller.setup2FA);
router.post('/2fa/verify', authMiddleware, controller.verify2FA);
router.post('/2fa/disable', authMiddleware, controller.disable2FA);

// Google
router.post('/google', oauthLimiter, controller.googleLogin);

// Verificación email / recovery
router.post('/verify-email', verifyEmailValidator, controller.verifyEmail);
router.post('/resend-verification', resendVerificationValidator, controller.resendVerification);
router.post('/forgot-password', forgotPasswordValidator, controller.forgotPassword);
router.post('/reset-password', resetPasswordValidator, controller.resetPassword);

// Perfil
router.get('/me', authMiddleware, controller.me);

export default router;
