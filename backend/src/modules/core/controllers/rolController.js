import * as service from '../services/rolService.js';

// -------- Contexto por Organización --------
export const listar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.listarRoles(req.user.orgContextId) }); }
  catch (err) { next(err); }
};

export const obtener = async (req, res, next) => {
  try { res.json({ success: true, data: await service.obtenerRol(req.user.orgContextId, req.params.id) }); }
  catch (err) { next(err); }
};

export const crear = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.crearRol(req.user.orgContextId, req.body) }); }
  catch (err) { next(err); }
};

export const actualizar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.actualizarRol(req.user.orgContextId, req.params.id, req.body) }); }
  catch (err) { next(err); }
};

export const eliminar = async (req, res, next) => {
  try { await service.eliminarRol(req.user.orgContextId, req.params.id); res.json({ success: true, message: 'Rol eliminado correctamente' }); }
  catch (err) { next(err); }
};

// Gestión de permisos (scoped)
export const asignarPermiso = async (req, res, next) => {
  try { await service.asignarPermiso(req.user.orgContextId, req.params.id, req.body.permisoId);
        res.json({ success: true, message: 'Permiso asignado correctamente' }); }
  catch (err) { next(err); }
};
export const quitarPermiso = async (req, res, next) => {
  try { await service.quitarPermiso(req.user.orgContextId, req.params.id, req.params.permisoId);
        res.json({ success: true, message: 'Permiso quitado correctamente' }); }
  catch (err) { next(err); }
};

// -------- Global admin --------
export const listarGlobal = async (_req, res, next) => {
  try { res.json({ success: true, data: await service.listarRolesGlobal() }); }
  catch (err) { next(err); }
};
export const obtenerGlobal = async (req, res, next) => {
  try { res.json({ success: true, data: await service.obtenerRolGlobal(req.params.id) }); }
  catch (err) { next(err); }
};
export const crearGlobal = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.crearRolGlobal(req.body) }); }
  catch (err) { next(err); }
};
export const actualizarGlobal = async (req, res, next) => {
  try { res.json({ success: true, data: await service.actualizarRolGlobal(req.params.id, req.body) }); }
  catch (err) { next(err); }
};
export const eliminarGlobal = async (req, res, next) => {
  try { await service.eliminarRolGlobal(req.params.id); res.json({ success: true, message: 'Rol eliminado correctamente' }); }
  catch (err) { next(err); }
};
export const asignarPermisoGlobal = async (req, res, next) => {
  try { await service.asignarPermisoGlobal(req.params.id, req.body.permisoId);
        res.json({ success: true, message: 'Permiso asignado correctamente (global)' }); }
  catch (err) { next(err); }
};
export const quitarPermisoGlobal = async (req, res, next) => {
  try { await service.quitarPermisoGlobal(req.params.id, req.params.permisoId);
        res.json({ success: true, message: 'Permiso quitado correctamente (global)' }); }
  catch (err) { next(err); }
};
