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

// CRUD roles
router.get('/', requirePermiso('roles.ver'), controller.listar);
router.get('/:id', idParamValidator, requirePermiso('roles.ver'), controller.obtener);
router.post('/', crearRolValidator, requirePermiso('roles.crear'), controller.crear);
router.patch('/:id', actualizarRolValidator, requirePermiso('roles.editar'), controller.actualizar);
router.delete('/:id', idParamValidator, requirePermiso('roles.eliminar'), controller.eliminar);

// Gestión de permisos
router.post('/:id/permisos', asignarPermisoValidator, requirePermiso('roles.editar'), controller.asignarPermiso);
router.delete('/:id/permisos/:permisoId', idParamValidator, requirePermiso('roles.editar'), controller.quitarPermiso);

export default router;
