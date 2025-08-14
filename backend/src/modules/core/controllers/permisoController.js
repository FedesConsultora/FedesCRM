import * as service from '../services/permisoService.js';
import ApiError from '../../../utils/ApiError.js';

/* ----------------------- Por organización (scoped) ----------------------- */
export const listar = async (req, res, next) => {
  try {
    const data = await service.listarPermisos(req.user.orgContextId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const obtener = async (req, res, next) => {
  try {
    const data = await service.obtenerPermiso(req.user.orgContextId, req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

/* Stubs opcionales para CRUD por org (no usado aún en FE) */
export const crear = async (_req, _res, next) => next(new ApiError(501, 'Funcionalidad en desarrollo', 'FEATURE_IN_DEVELOPMENT'));
export const actualizar = async (_req, _res, next) => next(new ApiError(501, 'Funcionalidad en desarrollo', 'FEATURE_IN_DEVELOPMENT'));
export const eliminar = async (_req, _res, next) => next(new ApiError(501, 'Funcionalidad en desarrollo', 'FEATURE_IN_DEVELOPMENT'));

/* ------------------------------ Global admin ------------------------------ */
export const listarGlobal = async (_req, res, next) => {
  try {
    const data = await service.listarPermisosGlobal();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const obtenerGlobal = async (req, res, next) => {
  try {
    const data = await service.obtenerPermisoGlobal(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
