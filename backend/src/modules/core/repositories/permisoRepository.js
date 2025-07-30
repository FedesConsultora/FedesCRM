// src/modules/core/repositories/permisoRepository.js
import { Permiso } from '../models/index.js';

export const findAll = async (options = {}) => {
  return await Permiso.findAll({ order: [['createdAt', 'DESC']], ...options });
};

export const findById = async (id) => {
  return await Permiso.findByPk(id);
};
