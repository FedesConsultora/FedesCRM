import * as service from '../services/usuarioService.js';

// -------- Contexto por Organización --------
export const listar = async (req, res, next) => {
  try {
    const data = await service.listarUsuarios(req.user.orgContextId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const obtener = async (req, res, next) => {
  try {
    const data = await service.obtenerUsuario(req.user.orgContextId, req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const crear = async (req, res, next) => {
  try {
    const data = await service.crearUsuario(req.user.orgContextId, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const actualizar = async (req, res, next) => {
  try {
    const data = await service.actualizarUsuario(req.user.orgContextId, req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const eliminar = async (req, res, next) => {
  try {
    await service.eliminarUsuario(req.user.orgContextId, req.params.id);
    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (err) { next(err); }
};

// -------- Contexto Global --------
export const listarGlobal = async (_req, res, next) => {
  try {
    const data = await service.listarUsuariosGlobal();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const obtenerGlobal = async (req, res, next) => {
  try {
    const data = await service.obtenerUsuarioGlobal(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const crearGlobal = async (req, res, next) => {
  try {
    const data = await service.crearUsuarioGlobal(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const actualizarGlobal = async (req, res, next) => {
  try {
    const data = await service.actualizarUsuarioGlobal(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const eliminarGlobal = async (req, res, next) => {
  try {
    await service.eliminarUsuarioGlobal(req.params.id);
    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (err) { next(err); }
};
