import { Router } from 'express';
import * as controller from '../controllers/rolController.js';
import {
  crearRolValidator,
  actualizarRolValidator,
  idParamValidator,
  asignarPermisoValidator
} from '../validators/rolValidator.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

const router = Router();
router.use(authMiddleware);

// Admin global
router.get('/admin/roles', requirePermiso('roles_global.ver'), controller.listarGlobal);
router.get('/admin/roles/:id', idParamValidator, requirePermiso('roles_global.ver'), controller.obtenerGlobal);
router.post('/admin/roles', crearRolValidator, requirePermiso('roles_global.crear'), controller.crearGlobal);
router.patch('/admin/roles/:id', actualizarRolValidator, requirePermiso('roles_global.editar'), controller.actualizarGlobal);
router.delete('/admin/roles/:id', idParamValidator, requirePermiso('roles_global.eliminar'), controller.eliminarGlobal);

router.post('/admin/roles/:id/permisos', asignarPermisoValidator, requirePermiso('roles_global.editar'), controller.asignarPermisoGlobal);
router.delete('/admin/roles/:id/permisos/:permisoId', idParamValidator, requirePermiso('roles_global.editar'), controller.quitarPermisoGlobal);

export default router;
