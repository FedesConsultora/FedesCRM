import { Rol, Permiso } from '../models/index.js';

// ---------- GLOBAL ----------
export const findAll = async (options = {}) => {
  return await Rol.findAll({
    include: [{ model: Permiso, through: { attributes: [] } }],
    ...options
  });
};

export const findById = async (id) => {
  return await Rol.findByPk(id, {
    include: [{ model: Permiso, through: { attributes: [] } }]
  });
};

// ---------- POR ORGANIZACIÓN ----------
export const findAllByOrg = async (orgId, options = {}) => {
  return await Rol.findAll({
    where: { organizacion_id: orgId },
    include: [{ model: Permiso, through: { attributes: [] } }],
    ...options
  });
};

export const findByIdAndOrg = async (id, orgId) => {
  return await Rol.findOne({
    where: { id, organizacion_id: orgId },
    include: [{ model: Permiso, through: { attributes: [] } }]
  });
};

// ---------- CRUD ----------
export const create = async (data) => {
  return await Rol.create(data);
};

export const update = async (id, data) => {
  const rol = await Rol.findByPk(id);
  if (!rol) return null;
  return await rol.update(data);
};

export const updateByOrg = async (id, orgId, data) => {
  const rol = await Rol.findOne({ where: { id, organizacion_id: orgId } });
  if (!rol) return null;
  return await rol.update(data);
};

export const softDelete = async (id) => {
  const rol = await Rol.findByPk(id);
  if (!rol) return null;
  await rol.destroy();
  return true;
};

export const softDeleteByOrg = async (id, orgId) => {
  const rol = await Rol.findOne({ where: { id, organizacion_id: orgId } });
  if (!rol) return null;
  await rol.destroy();
  return true;
};

// ---------- PERMISOS ----------
export const assignPermission = async (rolId, permisoId) => {
  const rol = await Rol.findByPk(rolId);
  if (!rol) return null;
  await rol.addPermiso(permisoId);
  return true;
};

export const assignPermissionByOrg = async (rolId, orgId, permisoId) => {
  const rol = await Rol.findOne({ where: { id: rolId, organizacion_id: orgId } });
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

export const removePermissionByOrg = async (rolId, orgId, permisoId) => {
  const rol = await Rol.findOne({ where: { id: rolId, organizacion_id: orgId } });
  if (!rol) return null;
  await rol.removePermiso(permisoId);
  return true;
};
