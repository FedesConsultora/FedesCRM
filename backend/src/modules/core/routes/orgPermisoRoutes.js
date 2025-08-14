import { Router } from 'express';
import * as controller from '../controllers/permisoController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { ensureOrgParam } from '../../../middlewares/ensureOrgParam.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

// Por ahora solo lectura (lo que usa el FE)
router.get('/permisos', ensureOrgParam, requirePermiso('permisos.ver'), controller.listar);
router.get('/permisos/:id', ensureOrgParam, requirePermiso('permisos.ver'), controller.obtener);

/* Si luego querés CRUD por org, descomentá y usá los stubs del controller
router.post('/permisos', ensureOrgParam, requirePermiso('permisos.crear'), controller.crear);
router.patch('/permisos/:id', ensureOrgParam, requirePermiso('permisos.editar'), controller.actualizar);
router.delete('/permisos/:id', ensureOrgParam, requirePermiso('permisos.eliminar'), controller.eliminar);
*/

export default router;
