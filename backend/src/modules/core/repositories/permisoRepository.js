// src/modules/core/repositories/permisoRepository.js
import { Permiso } from '../models/index.js';

export const findAll = (options = {}) => Permiso.findAll({ order: [['created_at','DESC']], ...options });
export const findById = (id) => Permiso.findByPk(id);
