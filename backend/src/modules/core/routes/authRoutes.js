import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import {
  loginValidator,
  registerValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator
} from '../validators/authValidator.js';

const router = Router();

// Registro y login
router.post('/register', registerValidator, controller.register);
router.post('/login', loginValidator, controller.login);

// Google OAuth
router.post('/google', controller.googleLogin);

// Verificación de email
router.post('/verify-email', verifyEmailValidator, controller.verifyEmail);

// Reset password
router.post('/forgot-password', forgotPasswordValidator, controller.forgotPassword);
router.post('/reset-password', resetPasswordValidator, controller.resetPassword);

// Perfil actual
router.get('/me', authMiddleware, controller.me);

export default router;
