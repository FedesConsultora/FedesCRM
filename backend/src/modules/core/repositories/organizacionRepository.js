// src/modules/core/repositories/organizacionRepository.js
import { Organizacion } from '../models/index.js';

export const findAll = async (options = {}) => {
  return await Organizacion.findAll(options);
};

export const findById = async (id) => {
  return await Organizacion.findByPk(id);
};

export const create = async (data) => {
  return await Organizacion.create(data);
};

export const update = async (id, data) => {
  const org = await Organizacion.findByPk(id);
  if (!org) return null;
  return await org.update(data);
};

export const softDelete = async (id) => {
  const org = await Organizacion.findByPk(id);
  if (!org) return null;
  await org.destroy(); // paranoid → soft delete
  return true;
};
