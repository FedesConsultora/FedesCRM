// src/modules/core/controllers/permisoController.js
import * as service from '../services/permisoService.js';

export const listar = async (req, res, next) => {
  try {
    const data = await service.listarPermisos();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const data = await service.obtenerPermiso(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
