import * as repo from '../repositories/permisoRepository.js';
import ApiError from '../../../utils/ApiError.js';

// -------- Contexto por Organización --------
export const listarPermisos = async (orgId) => {
  return await repo.findAllByOrg(orgId);
};

export const obtenerPermiso = async (orgId, id) => {
  const permiso = await repo.findByIdAndOrg(id, orgId);
  if (!permiso) throw new ApiError(404, 'Permiso no encontrado', 'PERMISO_NOT_FOUND');
  return permiso;
};

// -------- Contexto Global --------
export const listarPermisosGlobal = async () => {
  return await repo.findAll();
};

export const obtenerPermisoGlobal = async (id) => {
  const permiso = await repo.findById(id);
  if (!permiso) throw new ApiError(404, 'Permiso no encontrado', 'PERMISO_NOT_FOUND');
  return permiso;
};
