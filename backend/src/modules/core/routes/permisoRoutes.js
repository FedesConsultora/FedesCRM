// src/modules/core/routes/permisoRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/permisoController.js';
import { idParamValidator } from '../validators/permisoValidator.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';
import { ensureOrgParam } from '../../../middlewares/ensureOrgParam.js'; 

const router = Router();
router.use(authMiddleware);

/* -------------------------------------------------------------------------- */
/*                               RUTAS POR ORG                                */
/* -------------------------------------------------------------------------- */
router.get(
  '/orgs/:orgId/permisos',
  ensureOrgParam,
  requirePermiso('permisos.ver'),
  controller.listar
);
router.get(
  '/orgs/:orgId/permisos/:id',
  ensureOrgParam,
  idParamValidator,
  requirePermiso('permisos.ver'),
  controller.obtener
);

/* -------------------------------------------------------------------------- */
/*                              RUTAS GLOBALES                                */
/* -------------------------------------------------------------------------- */
router.get(
  '/admin/permisos',
  requirePermiso('permisos_global.ver'),
  controller.listarGlobal
);
router.get(
  '/admin/permisos/:id',
  idParamValidator,
  requirePermiso('permisos_global.ver'),
  controller.obtenerGlobal
);

export default router;
