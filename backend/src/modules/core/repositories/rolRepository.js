// src/modules/core/repositories/rolRepository.js
import { Rol, Permiso } from '../models/index.js';

export const findAll = async (options = {}) => {
  return await Rol.findAll({
    include: [
      { model: Permiso, through: { attributes: [] } } // Incluye permisos sin atributos de pivot
    ],
    ...options
  });
};

export const findById = async (id) => {
  return await Rol.findByPk(id, {
    include: [
      { model: Permiso, through: { attributes: [] } }
    ]
  });
};

export const create = async (data) => {
  return await Rol.create(data);
};

export const update = async (id, data) => {
  const rol = await Rol.findByPk(id);
  if (!rol) return null;
  return await rol.update(data);
};

export const softDelete = async (id) => {
  const rol = await Rol.findByPk(id);
  if (!rol) return null;
  await rol.destroy(); // paranoid → soft delete
  return true;
};

// ────────── GESTIÓN DE PERMISOS ──────────
export const assignPermission = async (rolId, permisoId) => {
  const rol = await Rol.findByPk(rolId);
  if (!rol) return null;
  await rol.addPermiso(permisoId);
  return true;
};

export const removePermission = async (rolId, permisoId) => {
  const rol = await Rol.findByPk(rolId);
  if (!rol) return null;
  await rol.removePermiso(permisoId);
  return true;
};
