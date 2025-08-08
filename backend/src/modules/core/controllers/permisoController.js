import * as service from '../services/permisoService.js';

// -------- Contexto por Organización --------
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

// -------- Contexto Global --------
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
