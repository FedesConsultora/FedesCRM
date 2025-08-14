// src/modules/core/services/usuarioService.js
import { sequelize } from '../models/index.js';
import ApiError from '../../../utils/ApiError.js';
import * as repo from '../repositories/organizacionUsuarioRepository.js';
import { Usuario } from '../models/index.js';

const allowedEstados = new Set(['activo', 'invitado', 'pendiente', 'suspendido']);

/* -------------------------- Scoped por organización -------------------------- */

export const listarUsuarios = async (orgId) => {
  return repo.findAllByOrg(orgId);
};

export const obtenerUsuario = async (orgId, userId) => {
  const row = await repo.findByOrgAndUser(orgId, userId);
  if (!row) throw new ApiError(404, 'Usuario no encontrado en la organización', 'ORG_USER_NOT_FOUND');
  return row;
};

/**
 * Crea (o vincula) un usuario a la organización.
 * payload: { email, nombre?, apellido?, telefono?, password?, rolId?, estado? }
 * - Si existe el usuario (mismo email): crea sólo la membresía (si no existía)
 * - Si NO existe: crea Usuario + membresía
 */
export const crearUsuario = async (orgId, payload) => {
  const {
    email,
    nombre = null,
    apellido = null,
    telefono = null,
    password = null,
    rolId = null,
    estado = 'pendiente'
  } = payload || {};

  if (!email) throw new ApiError(422, 'Email requerido', 'VALIDATION_ERROR');
  if (estado && !allowedEstados.has(estado)) {
    throw new ApiError(422, 'Estado inválido', 'VALIDATION_ERROR');
  }

  return sequelize.transaction(async (tx) => {
    const existing = await repo.findUserByEmail(email);

    let user = existing;
    if (!existing) {
      user = await repo.createUser({
        email,
        nombre,
        apellido,
        telefono,
        password,
        activo: true
      }, tx);
    }

    // ¿Ya tiene membresía?
    const already = await repo.findByOrgAndUser(orgId, user.id);
    if (already) throw new ApiError(409, 'El usuario ya pertenece a la organización', 'ORG_USER_DUP');

    await repo.createMembership({ orgId, userId: user.id, rolId, estado }, tx);

    return repo.findByOrgAndUser(orgId, user.id); // con includes
  });
};

/**
 * Actualiza datos del usuario y/o su membresía en la organización
 * payload: { nombre?, apellido?, telefono?, password?, rolId?, estado? }
 */
export const actualizarUsuario = async (orgId, userId, payload) => {
  const {
    nombre,
    apellido,
    telefono,
    password,
    rolId,
    estado
  } = payload || {};

  if (estado && !allowedEstados.has(estado)) {
    throw new ApiError(422, 'Estado inválido', 'VALIDATION_ERROR');
  }

  return sequelize.transaction(async (tx) => {
    // 1) asegurar membresía
    const membership = await repo.findByOrgAndUser(orgId, userId);
    if (!membership) throw new ApiError(404, 'Usuario no encontrado en la organización', 'ORG_USER_NOT_FOUND');

    // 2) actualizar usuario si viene algo
    const userPatch = {};
    if (typeof nombre   !== 'undefined') userPatch.nombre   = nombre;
    if (typeof apellido !== 'undefined') userPatch.apellido = apellido;
    if (typeof telefono !== 'undefined') userPatch.telefono = telefono;
    if (typeof password !== 'undefined') userPatch.password = password;

    if (Object.keys(userPatch).length) {
      const updated = await repo.updateUser(userId, userPatch, tx);
      if (!updated) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
    }

    // 3) actualizar membresía si corresponde
    const memPatch = {};
    if (typeof rolId  !== 'undefined') memPatch.rolId = rolId || null;
    if (typeof estado !== 'undefined') memPatch.estado = estado;

    if (Object.keys(memPatch).length) {
      await repo.updateMembership(orgId, userId, memPatch, tx);
    }

    return repo.findByOrgAndUser(orgId, userId);
  });
};

export const eliminarUsuario = async (orgId, userId) => {
  return sequelize.transaction(async (tx) => {
    // Eliminar membresía
    const deleted = await repo.deleteMembership(orgId, userId, tx);
    if (!deleted) throw new ApiError(404, 'Usuario no encontrado en la organización', 'ORG_USER_NOT_FOUND');

    // Si queda huérfano de todas las orgs → soft delete del usuario
    await repo.softDeleteUserIfOrphan(userId, tx);

    return true;
  });
};

/* ------------------------------ Contexto Global ----------------------------- */

export const listarUsuariosGlobal = async () => {
  // Sólo ejemplo simple: lista todos los usuarios (según permisos en controller)
  return Usuario.findAll({ order: [['created_at', 'DESC']] });
};

export const obtenerUsuarioGlobal = async (userId) => {
  const u = await Usuario.findByPk(userId);
  if (!u) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  return u;
};

export const crearUsuarioGlobal = async (payload) => {
  return Usuario.create(payload);
};

export const actualizarUsuarioGlobal = async (userId, payload) => {
  const u = await Usuario.findByPk(userId);
  if (!u) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  return u.update(payload);
};

export const eliminarUsuarioGlobal = async (userId) => {
  const u = await Usuario.findByPk(userId);
  if (!u) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  await u.destroy();
  return true;
};