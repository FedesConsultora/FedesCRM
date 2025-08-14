// src/middlewares/ensureOrgParam.js
import ApiError from '../utils/ApiError.js';
import { OrganizacionUsuario } from '../modules/core/models/index.js';

/**
 * Valida :orgId o :id (según la ruta) y setea req.user.orgContextId
 * - superadmin_global: pasa directo
 * - resto: requiere membresía activa
 */
export const ensureOrgParam = async (req, _res, next) => {
  try {
    const orgId = req.params.orgId || req.params.id;
    if (!orgId) throw new ApiError(400, 'Organización requerida', 'ORG_PARAM_REQUIRED');

    if (req.user?.rol === 'superadmin_global') {
      req.user.orgContextId = orgId;
      return next();
    }

    const membership = await OrganizacionUsuario.findOne({
      where: { usuario_id: req.user.id, organizacion_id: orgId, estado: 'activo' },
    });

    if (!membership) throw new ApiError(403, 'No pertenecés a esta organización', 'ORG_ACCESS_DENIED');

    req.user.orgContextId = orgId;
    next();
  } catch (err) {
    next(err instanceof ApiError ? err : new ApiError(400, 'Organización requerida', 'ORG_PARAM_REQUIRED'));
  }
};
