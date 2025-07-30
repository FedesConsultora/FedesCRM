import { Router } from 'express';
import * as controller from '../controllers/organizacionController.js';
import {
  crearOrganizacionValidator,
  actualizarOrganizacionValidator,
  idParamValidator
} from '../validators/organizacionValidator.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

const router = Router();

// Todas requieren auth
router.use(authMiddleware);

// Rutas protegidas
router.get('/', requirePermiso('usuarios.ver'), controller.listar);
router.get('/:id', idParamValidator, requirePermiso('usuarios.ver'), controller.obtener);
router.post('/', crearOrganizacionValidator, requirePermiso('usuarios.crear'), controller.crear);
router.patch('/:id', actualizarOrganizacionValidator, requirePermiso('usuarios.editar'), controller.actualizar);
router.delete('/:id', idParamValidator, requirePermiso('usuarios.eliminar'), controller.eliminar);

export default router;
