import * as repo from '../repositories/rolRepository.js';
import ApiError from '../../../utils/ApiError.js';

// -------- Contexto por Organización --------
export const listarRoles = async (orgId) => {
  return await repo.findAllByOrg(orgId, { order: [['createdAt', 'DESC']] });
};

export const obtenerRol = async (orgId, id) => {
  const rol = await repo.findByIdAndOrg(id, orgId);
  if (!rol) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return rol;
};

export const crearRol = async (orgId, data) => {
  return await repo.create({ ...data, organizacion_id: orgId });
};

export const actualizarRol = async (orgId, id, data) => {
  const rol = await repo.updateByOrg(id, orgId, data);
  if (!rol) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return rol;
};

export const eliminarRol = async (orgId, id) => {
  const eliminado = await repo.softDeleteByOrg(id, orgId);
  if (!eliminado) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return true;
};

export const asignarPermiso = async (orgId, rolId, permisoId) => {
  const ok = await repo.assignPermissionByOrg(rolId, orgId, permisoId);
  if (!ok) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return true;
};

export const quitarPermiso = async (orgId, rolId, permisoId) => {
  const ok = await repo.removePermissionByOrg(rolId, orgId, permisoId);
  if (!ok) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return true;
};

// -------- Contexto Global --------
export const listarRolesGlobal = async () => {
  return await repo.findAll({ order: [['createdAt', 'DESC']] });
};

export const obtenerRolGlobal = async (id) => {
  const rol = await repo.findById(id);
  if (!rol) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return rol;
};

export const crearRolGlobal = async (data) => {
  return await repo.create(data);
};

export const actualizarRolGlobal = async (id, data) => {
  const rol = await repo.update(id, data);
  if (!rol) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return rol;
};

export const eliminarRolGlobal = async (id) => {
  const eliminado = await repo.softDelete(id);
  if (!eliminado) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return true;
};

// -------- Gestión de permisos (global) --------
export const asignarPermisoGlobal = async (rolId, permisoId) => {
  const ok = await repo.assignPermission(rolId, permisoId);
  if (!ok) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return true;
};

export const quitarPermisoGlobal = async (rolId, permisoId) => {
  const ok = await repo.removePermission(rolId, permisoId);
  if (!ok) throw new ApiError(404, 'Rol no encontrado', 'ROL_NOT_FOUND');
  return true;
};

