// src/modules/core/services/permisoService.js
import * as repo from '../repositories/permisoRepository.js';
import ApiError from '../../../utils/ApiError.js';

export const listarPermisos = async () => {
  return await repo.findAll();
};

export const obtenerPermiso = async (id) => {
  const permiso = await repo.findById(id);
  if (!permiso) throw new ApiError(404, 'Permiso no encontrado', 'PERMISO_NOT_FOUND');
  return permiso;
};
