// src/modules/core/routes/organizacionRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/organizacionController.js';
import {
  crearOrganizacionValidator,
  actualizarOrganizacionValidator,
  idParamValidator
} from '../validators/organizacionValidator.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';
import { ensureOrgParam } from '../../../middlewares/ensureOrgParam.js';

const router = Router();

router.use(authMiddleware);

// Listar organizaciones visibles (tu lógica de permisos manda)
router.get(
  '/',
  requirePermiso('organizaciones.ver'),
  controller.listar
);

// Obtener organización específica (valida pertenencia con ensureOrgParam)
router.get(
  '/:id',
  idParamValidator,
  requirePermiso('organizaciones.ver'),
  ensureOrgParam,
  controller.obtener
);

// Crear nueva organización
router.post(
  '/',
  crearOrganizacionValidator,
  requirePermiso('organizaciones.crear'),
  controller.crear
);

// Actualizar organización
router.patch(
  '/:id',
  actualizarOrganizacionValidator,
  requirePermiso('organizaciones.editar'),
  ensureOrgParam,
  controller.actualizar
);

// Eliminar organización
router.delete(
  '/:id',
  idParamValidator,
  requirePermiso('organizaciones.eliminar'),
  controller.eliminar
);

export default router;
