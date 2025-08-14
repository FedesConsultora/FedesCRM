import { Router } from 'express';
import * as controller from '../controllers/usuarioController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { ensureOrgParam } from '../../../middlewares/ensureOrgParam.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';
import {
  crearUsuarioValidator,
  actualizarUsuarioValidator,
  userIdParam
} from '../validators/orgUsuarioValidator.js';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/users', ensureOrgParam, requirePermiso('usuarios.ver'), controller.listar);
router.get('/users/:id', ensureOrgParam, requirePermiso('usuarios.ver'), userIdParam, controller.obtener);
router.post('/users', ensureOrgParam, requirePermiso('usuarios.crear'), crearUsuarioValidator, controller.crear);
router.patch('/users/:id', ensureOrgParam, requirePermiso('usuarios.editar'), userIdParam, actualizarUsuarioValidator, controller.actualizar);
router.delete('/users/:id', ensureOrgParam, requirePermiso('usuarios.eliminar'), userIdParam, controller.eliminar);

export default router;
