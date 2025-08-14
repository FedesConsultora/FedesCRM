import { Router } from 'express';
import * as controller from '../controllers/membresiaController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { ensureOrgParam } from '../../../middlewares/ensureOrgParam.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/members', ensureOrgParam, requirePermiso('membresias.ver'), controller.listarMiembros);
router.post('/members/:membershipId/approve', ensureOrgParam, requirePermiso('membresias.aprobar'), controller.aprobar);
router.post('/members/:membershipId/reject', ensureOrgParam, requirePermiso('membresias.rechazar'), controller.rechazar);
router.patch('/members/:membershipId/role', ensureOrgParam, requirePermiso('membresias.cambiar-rol'), controller.cambiarRol);
router.post('/join-request', ensureOrgParam, controller.solicitarUnion);

export default router;
