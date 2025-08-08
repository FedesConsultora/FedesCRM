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
import  { ensureOrgParam }  from '../../../middlewares/ensureOrgParam.js';

const router = Router();

// Todas requieren autenticación
router.use(authMiddleware);

/**
 * Listar TODAS las organizaciones que el usuario puede ver
 * (si es superadmin puede ver todas, si no, solo las que pertenece)
 */
router.get(
  '/',
  requirePermiso('organizaciones.ver'),
  controller.listar
);

/**
 * Obtener una organización específica
 * Valida que el usuario pertenezca a ella o tenga permiso global
 */
router.get(
  '/:id',
  idParamValidator,
  requirePermiso('organizaciones.ver'),
  ensureOrgParam,
  controller.obtener
);

/**
 * Crear nueva organización
 * Generalmente reservado a superadmins
 */
router.post(
  '/',
  crearOrganizacionValidator,
  requirePermiso('organizaciones.crear'),
  controller.crear
);

/**
 * Actualizar organización
 * Valida pertenencia
 */
router.patch(
  '/:id',
  actualizarOrganizacionValidator,
  requirePermiso('organizaciones.editar'),
  ensureOrgParam,
  controller.actualizar
);

/**
 * Eliminar organización
 * Generalmente reservado a superadmins
 */
router.delete(
  '/:id',
  idParamValidator,
  requirePermiso('organizaciones.eliminar'),
  controller.eliminar
);

export default router;
