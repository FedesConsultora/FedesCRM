import { Router } from 'express';
import * as controller from '../controllers/invitacionController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';
import {
  crearInvitacionValidator,
  aceptarInvitacionValidator
} from '../validators/invitacionValidator.js';

const router = Router({ mergeParams: true });

// /orgs/:orgId/invitations
router.post(
  '/orgs/:orgId/invitations',
  authMiddleware,
  requirePermiso('usuarios.invitar'),
  crearInvitacionValidator,
  controller.crear
);

router.get(
  '/orgs/:orgId/invitations',
  authMiddleware,
  requirePermiso('usuarios.ver'),
  controller.listar
);

router.delete(
  '/orgs/:orgId/invitations/:inviteId',
  authMiddleware,
  requirePermiso('usuarios.invitar'),
  controller.revocar
);

// Aceptar invitación (usuario logueado)
router.post(
  '/invitations/accept',
  authMiddleware,
  aceptarInvitacionValidator,
  controller.aceptar
);

export default router;
