import { Router } from 'express';
import * as controller from '../controllers/invitacionController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { aceptarInvitacionValidator } from '../validators/invitacionValidator.js';

const router = Router();

// Aceptar invitación (usuario logueado)
router.post('/invitations/accept', authMiddleware, aceptarInvitacionValidator, controller.aceptar);

export default router;
