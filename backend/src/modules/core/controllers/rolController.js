// src/modules/core/controllers/rolController.js
import * as service from '../services/rolService.js';

export const listar = async (req, res, next) => {
  try {
    const data = await service.listarRoles();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const obtener = async (req, res, next) => {
  try {
    const data = await service.obtenerRol(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const crear = async (req, res, next) => {
  try {
    const data = await service.crearRol(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const actualizar = async (req, res, next) => {
  try {
    const data = await service.actualizarRol(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const eliminar = async (req, res, next) => {
  try {
    await service.eliminarRol(req.params.id);
    res.json({ success: true, message: 'Rol eliminado correctamente' });
  } catch (err) { next(err); }
};

// ────────── PERMISOS ──────────
export const asignarPermiso = async (req, res, next) => {
  try {
    await service.asignarPermiso(req.params.id, req.body.permisoId);
    res.json({ success: true, message: 'Permiso asignado correctamente' });
  } catch (err) { next(err); }
};

export const quitarPermiso = async (req, res, next) => {
  try {
    await service.quitarPermiso(req.params.id, req.params.permisoId);
    res.json({ success: true, message: 'Permiso quitado correctamente' });
  } catch (err) { next(err); }
};
