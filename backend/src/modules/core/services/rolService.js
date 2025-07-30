// src/modules/core/services/rolService.js
import * as repo from '../repositories/rolRepository.js';
import ApiError from '../../../utils/ApiError.js';

export const listarRoles = async () => {
  return await repo.findAll({ order: [['createdAt', 'DESC']] });
};

export const obtenerRol = async (id) => {
  const rol = await repo.findById(id);
  if (!rol) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return rol;
};

export const crearRol = async (data) => {
  return await repo.create(data);
};

export const actualizarRol = async (id, data) => {
  const rol = await repo.update(id, data);
  if (!rol) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return rol;
};

export const eliminarRol = async (id) => {
  const eliminado = await repo.softDelete(id);
  if (!eliminado) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return true;
};

export const asignarPermiso = async (rolId, permisoId) => {
  const ok = await repo.assignPermission(rolId, permisoId);
  if (!ok) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return true;
};

export const quitarPermiso = async (rolId, permisoId) => {
  const ok = await repo.removePermission(rolId, permisoId);
  if (!ok) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return true;
};
