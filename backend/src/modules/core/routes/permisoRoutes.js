import { Router } from 'express';
import * as controller from '../controllers/permisoController.js';
import { idParamValidator } from '../validators/permisoValidator.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

const router = Router();

// Todas requieren auth
router.use(authMiddleware);

// Ver permisos
router.get('/', requirePermiso('permisos.ver'), controller.listar);
router.get('/:id', idParamValidator, requirePermiso('permisos.ver'), controller.obtener);

export default router;
