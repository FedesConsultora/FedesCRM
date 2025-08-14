// src/modules/core/services/permisoService.js
import * as repo from '../repositories/permisoRepository.js';
import ApiError from '../../../utils/ApiError.js';

export const listarPermisos = async (_orgId) => repo.findAll(); // “scoped” devuelve global
export const obtenerPermiso = async (_orgId, id) => {
  const permiso = await repo.findById(id);
  if (!permiso) throw new ApiError(404, 'Permiso no encontrado', 'PERMISO_NOT_FOUND');
  return permiso;
};

export const listarPermisosGlobal = repo.findAll;
export const obtenerPermisoGlobal = async (id) => {
  const permiso = await repo.findById(id);
  if (!permiso) throw new ApiError(404, 'Permiso no encontrado', 'PERMISO_NOT_FOUND');
  return permiso;
};
