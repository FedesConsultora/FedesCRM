import { Router } from 'express';
import * as controller from '../controllers/membresiaController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';
import {
  aprobarMembresiaValidator,
  cambiarRolMembresiaValidator,
  joinRequestValidator
} from '../validators/membresiaValidator.js';

const router = Router({ mergeParams: true });

// /orgs/:orgId/members
router.get(
  '/orgs/:orgId/members',
  authMiddleware,
  requirePermiso('usuarios.ver'),
  controller.listarMiembros
);

router.post(
  '/orgs/:orgId/members/:membershipId/approve',
  authMiddleware,
  requirePermiso('usuarios.editar'),
  aprobarMembresiaValidator,
  controller.aprobar
);

router.post(
  '/orgs/:orgId/members/:membershipId/reject',
  authMiddleware,
  requirePermiso('usuarios.editar'),
  controller.rechazar
);

router.patch(
  '/orgs/:orgId/members/:membershipId/role',
  authMiddleware,
  requirePermiso('usuarios.editar'),
  cambiarRolMembresiaValidator,
  controller.cambiarRol
);

router.post(
  '/orgs/:orgId/join-request',
  authMiddleware,
  joinRequestValidator,
  controller.solicitarUnion
);

export default router;
