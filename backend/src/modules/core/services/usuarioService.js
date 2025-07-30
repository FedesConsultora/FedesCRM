// src/modules/core/services/usuarioService.js
import * as repo from '../repositories/usuarioRepository.js';
import ApiError from '../../../utils/ApiError.js';

export const listarUsuarios = async () => {
  return await repo.findAll({ order: [['createdAt', 'DESC']] });
};

export const obtenerUsuario = async (id) => {
  const usuario = await repo.findById(id);
  if (!usuario) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  return usuario;
};

export const crearUsuario = async (data) => {
  const existente = await repo.findByEmail(data.email);
  if (existente) throw new ApiError(400, 'Email ya registrado', 'EMAIL_EXISTS');
  return await repo.create(data);
};

export const actualizarUsuario = async (id, data) => {
  const usuario = await repo.update(id, data);
  if (!usuario) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  return usuario;
};

export const eliminarUsuario = async (id) => {
  const eliminado = await repo.softDelete(id);
  if (!eliminado) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  return true;
};
