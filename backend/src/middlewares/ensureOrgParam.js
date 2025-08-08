// src/middlewares/ensureOrgParam.js
import ApiError from '../utils/ApiError.js';
import { OrganizacionUsuario } from '../modules/core/models/index.js';

export const ensureOrgParam = async (req, _res, next) => {
  const { orgId } = req.params;
  const userId = req.user?.id;

  if (!orgId || !userId) {
    return next(new ApiError(400, 'Organización y usuario requeridos', 'ORG_PARAM_REQUIRED'));
  }

  const membership = await OrganizacionUsuario.findOne({
    where: { usuario_id: userId, organizacion_id: orgId, estado: 'activo' }
  });

  if (!membership) {
    return next(new ApiError(403, 'No perteneces a esta organización', 'ORG_ACCESS_DENEGADO'));
  }

  req.user.orgContextId = orgId;
  next();
};
