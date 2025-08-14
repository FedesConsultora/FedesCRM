import { Router } from 'express';
import * as controller from '../controllers/permisoController.js';
import { idParamValidator } from '../validators/permisoValidator.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

const router = Router();
router.use(authMiddleware);

// Admin global (solo lectura por ahora)
router.get('/admin/permisos', requirePermiso('permisos_global.ver'), controller.listarGlobal);
router.get('/admin/permisos/:id', idParamValidator, requirePermiso('permisos_global.ver'), controller.obtenerGlobal);

export default router;
