// src/modules/core/repositories/usuarioRepository.js
import { Usuario, Rol, Organizacion } from '../models/index.js';

export const findAll = async (options = {}) => {
  return await Usuario.findAll({
    include: [
      { model: Rol, as: 'rol', attributes: ['id', 'nombre'] },
      { model: Organizacion, attributes: ['id', 'nombre', 'dominio'] }
    ],
    ...options
  });
};

export const findById = async (id) => {
  return await Usuario.findByPk(id, {
    include: [
      { model: Rol, as: 'rol', attributes: ['id', 'nombre'] },
      { model: Organizacion, attributes: ['id', 'nombre', 'dominio'] }
    ]
  });
};

export const findByEmail = async (email) => {
  return await Usuario.findOne({ where: { email } });
};

export const create = async (data) => {
  return await Usuario.create(data);
};

export const update = async (id, data) => {
  const user = await Usuario.findByPk(id);
  if (!user) return null;
  return await user.update(data);
};

export const softDelete = async (id) => {
  const user = await Usuario.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
};
