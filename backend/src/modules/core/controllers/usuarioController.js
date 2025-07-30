// src/modules/core/controllers/usuarioController.js
import * as service from '../services/usuarioService.js';

export const listar = async (req, res, next) => {
  try {
    const data = await service.listarUsuarios();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const data = await service.obtenerUsuario(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const crear = async (req, res, next) => {
  try {
    const data = await service.crearUsuario(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const data = await service.actualizarUsuario(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    await service.eliminarUsuario(req.params.id);
    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};
