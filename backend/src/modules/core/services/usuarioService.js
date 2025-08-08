import * as repo from '../repositories/usuarioRepository.js';
import ApiError from '../../../utils/ApiError.js';

// -------- Contexto por Organización --------
export const listarUsuarios = async (orgId) => {
  return await repo.findAllByOrg(orgId, { order: [['createdAt', 'DESC']] });
};

export const obtenerUsuario = async (orgId, id) => {
  const usuario = await repo.findByIdAndOrg(id, orgId);
  if (!usuario) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  return usuario;
};

export const crearUsuario = async (orgId, data) => {
  const existente = await repo.findByEmailAndOrg(data.email, orgId);
  if (existente) throw new ApiError(400, 'Email ya registrado', 'EMAIL_EXISTS');
  return await repo.create({ ...data, organizacion_id: orgId });
};

export const actualizarUsuario = async (orgId, id, data) => {
  const usuario = await repo.updateByOrg(id, orgId, data);
  if (!usuario) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  return usuario;
};

export const eliminarUsuario = async (orgId, id) => {
  const eliminado = await repo.softDeleteByOrg(id, orgId);
  if (!eliminado) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  return true;
};

// -------- Contexto Global --------
export const listarUsuariosGlobal = async () => {
  return await repo.findAll({ order: [['createdAt', 'DESC']] });
};

export const obtenerUsuarioGlobal = async (id) => {
  const usuario = await repo.findById(id);
  if (!usuario) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  return usuario;
};

export const crearUsuarioGlobal = async (data) => {
  const existente = await repo.findByEmail(data.email);
  if (existente) throw new ApiError(400, 'Email ya registrado', 'EMAIL_EXISTS');
  return await repo.create(data);
};

export const actualizarUsuarioGlobal = async (id, data) => {
  const usuario = await repo.update(id, data);
  if (!usuario) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  return usuario;
};

export const eliminarUsuarioGlobal = async (id) => {
  const eliminado = await repo.softDelete(id);
  if (!eliminado) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  return true;
};
