// src/modules/core/controllers/organizacionController.js
import * as service from '../services/organizacionService.js';

export const listar = async (req, res, next) => {
  try {
    const data = await service.listarOrganizaciones();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const data = await service.obtenerOrganizacion(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const crear = async (req, res, next) => {
  try {
    const data = await service.crearOrganizacion(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const data = await service.actualizarOrganizacion(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    await service.eliminarOrganizacion(req.params.id);
    res.json({ success: true, message: 'Organización eliminada correctamente' });
  } catch (err) {
    next(err);
  }
};
