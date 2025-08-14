import { Router } from 'express';
import * as controller from '../controllers/rolController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { ensureOrgParam } from '../../../middlewares/ensureOrgParam.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/roles', ensureOrgParam, requirePermiso('roles.ver'), controller.listar);
router.get('/roles/:id', ensureOrgParam, requirePermiso('roles.ver'), controller.obtener);
router.post('/roles', ensureOrgParam, requirePermiso('roles.crear'), controller.crear);
router.patch('/roles/:id', ensureOrgParam, requirePermiso('roles.editar'), controller.actualizar);
router.delete('/roles/:id', ensureOrgParam, requirePermiso('roles.eliminar'), controller.eliminar);

// ¡OJO nombres! usar los del controller (es/en)
router.post('/roles/:id/permisos', ensureOrgParam, requirePermiso('roles.editar'), controller.asignarPermiso);
router.delete('/roles/:id/permisos/:permisoId', ensureOrgParam, requirePermiso('roles.editar'), controller.quitarPermiso);

export default router;
