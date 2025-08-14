import {
  Usuario,
  OrganizacionUsuario,
  Organizacion,
  Rol
} from '../models/index.js';

export const findAllByOrg = async (orgId, options = {}) => {
  return OrganizacionUsuario.findAll({
    where: { organizacionId: orgId },
    include: [
      { model: Usuario, as: 'usuario' },
      { model: Rol, as: 'rol' },
      { model: Organizacion, as: 'organizacion' }
    ],
    order: [['created_at', 'DESC']],
    ...options
  });
};

export const findByOrgAndUser = async (orgId, userId) => {
  return OrganizacionUsuario.findOne({
    where: { organizacionId: orgId, usuarioId: userId },
    include: [
      { model: Usuario, as: 'usuario' },
      { model: Rol, as: 'rol' },
      { model: Organizacion, as: 'organizacion' }
    ]
  });
};

export const createMembership = async ({ orgId, userId, rolId = null, estado = 'pendiente' }, tx) => {
  return OrganizacionUsuario.create({
    organizacionId: orgId,
    usuarioId: userId,
    rolId,
    estado
  }, { transaction: tx });
};

export const updateMembership = async (orgId, userId, data = {}, tx) => {
  const membership = await OrganizacionUsuario.findOne({
    where: { organizacionId: orgId, usuarioId: userId }
  });
  if (!membership) return null;
  return membership.update(data, { transaction: tx });
};

export const deleteMembership = async (orgId, userId, tx) => {
  return OrganizacionUsuario.destroy({
    where: { organizacionId: orgId, usuarioId: userId },
    transaction: tx
  });
};

export const countMembershipsForUser = async (userId, tx) => {
  return OrganizacionUsuario.count({ where: { usuarioId: userId }, transaction: tx });
};

// Utilidades de Usuario
export const findUserByEmail = async (email) => {
  return Usuario.scope(null).findOne({ where: { email } });
};

export const createUser = async (data, tx) => {
  return Usuario.create(data, { transaction: tx });
};

export const updateUser = async (userId, data, tx) => {
  const u = await Usuario.findByPk(userId);
  if (!u) return null;
  return u.update(data, { transaction: tx });
};

export const softDeleteUserIfOrphan = async (userId, tx) => {
  const left = await OrganizacionUsuario.count({ where: { usuarioId: userId }, transaction: tx });
  if (left === 0) {
    const u = await Usuario.findByPk(userId, { transaction: tx });
    if (u) await u.destroy({ transaction: tx });
  }
};
