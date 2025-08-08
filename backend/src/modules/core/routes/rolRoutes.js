// src/modules/core/routes/rolRoutes.js
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
import { ensureOrgParam } from '../../../middlewares/ensureOrgParam.js'; 

const router = Router();
router.use(authMiddleware);

/* -------------------------------------------------------------------------- */
/*                               RUTAS POR ORG                                */
/* -------------------------------------------------------------------------- */
router.get(
  '/orgs/:orgId/roles',
  ensureOrgParam,
  requirePermiso('roles.ver'),
  controller.listar
);
router.get(
  '/orgs/:orgId/roles/:id',
  ensureOrgParam,
  idParamValidator,
  requirePermiso('roles.ver'),
  controller.obtener
);
router.post(
  '/orgs/:orgId/roles',
  ensureOrgParam,
  crearRolValidator,
  requirePermiso('roles.crear'),
  controller.crear
);
router.patch(
  '/orgs/:orgId/roles/:id',
  ensureOrgParam,
  actualizarRolValidator,
  requirePermiso('roles.editar'),
  controller.actualizar
);
router.delete(
  '/orgs/:orgId/roles/:id',
  ensureOrgParam,
  idParamValidator,
  requirePermiso('roles.eliminar'),
  controller.eliminar
);

// Gestión de permisos (por org)
router.post(
  '/orgs/:orgId/roles/:id/permisos',
  ensureOrgParam,
  asignarPermisoValidator,
  requirePermiso('roles.editar'),
  controller.asignarPermiso
);
router.delete(
  '/orgs/:orgId/roles/:id/permisos/:permisoId',
  ensureOrgParam,
  idParamValidator,
  requirePermiso('roles.editar'),
  controller.quitarPermiso
);

/* -------------------------------------------------------------------------- */
/*                              RUTAS GLOBALES                                */
/* -------------------------------------------------------------------------- */
router.get(
  '/admin/roles',
  requirePermiso('roles_global.ver'),
  controller.listarGlobal
);
router.get(
  '/admin/roles/:id',
  idParamValidator,
  requirePermiso('roles_global.ver'),
  controller.obtenerGlobal
);
router.post(
  '/admin/roles',
  crearRolValidator,
  requirePermiso('roles_global.crear'),
  controller.crearGlobal
);
router.patch(
  '/admin/roles/:id',
  actualizarRolValidator,
  requirePermiso('roles_global.editar'),
  controller.actualizarGlobal
);
router.delete(
  '/admin/roles/:id',
  idParamValidator,
  requirePermiso('roles_global.eliminar'),
  controller.eliminarGlobal
);

// Gestión de permisos (global)
router.post(
  '/admin/roles/:id/permisos',
  asignarPermisoValidator,
  requirePermiso('roles_global.editar'),
  controller.asignarPermisoGlobal
);
router.delete(
  '/admin/roles/:id/permisos/:permisoId',
  idParamValidator,
  requirePermiso('roles_global.editar'),
  controller.quitarPermisoGlobal
);

export default router;
