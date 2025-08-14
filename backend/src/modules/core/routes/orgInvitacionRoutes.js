import { Router } from 'express';
import * as controller from '../controllers/invitacionController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { ensureOrgParam } from '../../../middlewares/ensureOrgParam.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/invitaciones', ensureOrgParam, requirePermiso('invitaciones.ver'), controller.listar);
router.post('/invitaciones', ensureOrgParam, requirePermiso('invitaciones.crear'), controller.crear);
router.delete('/invitaciones/:inviteId', ensureOrgParam, requirePermiso('invitaciones.eliminar'), controller.revocar);

export default router;
