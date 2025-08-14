import { Router } from 'express';
import * as controller from '../controllers/usuarioController.js';
import {
  crearUsuarioValidator,
  actualizarUsuarioValidator,
  idParamValidator
} from '../validators/usuarioValidator.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

const router = Router();
router.use(authMiddleware);

// Admin global
router.get('/admin/users', requirePermiso('usuarios_global.ver'), controller.listarGlobal);
router.get('/admin/users/:id', idParamValidator, requirePermiso('usuarios_global.ver'), controller.obtenerGlobal);
router.post('/admin/users', crearUsuarioValidator, requirePermiso('usuarios_global.crear'), controller.crearGlobal);
router.patch('/admin/users/:id', actualizarUsuarioValidator, requirePermiso('usuarios_global.editar'), controller.actualizarGlobal);
router.delete('/admin/users/:id', idParamValidator, requirePermiso('usuarios_global.eliminar'), controller.eliminarGlobal);

export default router;
