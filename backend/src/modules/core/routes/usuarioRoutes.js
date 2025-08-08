// src/modules/core/routes/usuarioRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/usuarioController.js';
import {
  crearUsuarioValidator,
  actualizarUsuarioValidator,
  idParamValidator
} from '../validators/usuarioValidator.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';
import { ensureOrgParam } from '../../../middlewares/ensureOrgParam.js';

const router = Router();

// Todas requieren auth
router.use(authMiddleware);

/* -------------------------------------------------------------------------- */
/*                               RUTAS POR ORG                                */
/* -------------------------------------------------------------------------- */
router.get(
  '/orgs/:orgId/users',
  ensureOrgParam,
  requirePermiso('usuarios.ver'),
  controller.listar
);
router.get(
  '/orgs/:orgId/users/:id',
  ensureOrgParam,
  idParamValidator,
  requirePermiso('usuarios.ver'),
  controller.obtener
);
router.post(
  '/orgs/:orgId/users',
  ensureOrgParam,
  crearUsuarioValidator,
  requirePermiso('usuarios.crear'),
  controller.crear
);
router.patch(
  '/orgs/:orgId/users/:id',
  ensureOrgParam,
  actualizarUsuarioValidator,
  requirePermiso('usuarios.editar'),
  controller.actualizar
);
router.delete(
  '/orgs/:orgId/users/:id',
  ensureOrgParam,
  idParamValidator,
  requirePermiso('usuarios.eliminar'),
  controller.eliminar
);

/* -------------------------------------------------------------------------- */
/*                              RUTAS GLOBALES                                */
/* -------------------------------------------------------------------------- */
router.get(
  '/admin/users',
  requirePermiso('usuarios_global.ver'),
  controller.listarGlobal
);
router.get(
  '/admin/users/:id',
  idParamValidator,
  requirePermiso('usuarios_global.ver'),
  controller.obtenerGlobal
);
router.post(
  '/admin/users',
  crearUsuarioValidator,
  requirePermiso('usuarios_global.crear'),
  controller.crearGlobal
);
router.patch(
  '/admin/users/:id',
  actualizarUsuarioValidator,
  requirePermiso('usuarios_global.editar'),
  controller.actualizarGlobal
);
router.delete(
  '/admin/users/:id',
  idParamValidator,
  requirePermiso('usuarios_global.eliminar'),
  controller.eliminarGlobal
);

export default router;
