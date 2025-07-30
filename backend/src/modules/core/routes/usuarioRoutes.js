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

// CRUD usuarios
router.get('/', requirePermiso('usuarios.ver'), controller.listar);
router.get('/:id', idParamValidator, requirePermiso('usuarios.ver'), controller.obtener);
router.post('/', crearUsuarioValidator, requirePermiso('usuarios.crear'), controller.crear);
router.patch('/:id', actualizarUsuarioValidator, requirePermiso('usuarios.editar'), controller.actualizar);
router.delete('/:id', idParamValidator, requirePermiso('usuarios.eliminar'), controller.eliminar);

export default router;
