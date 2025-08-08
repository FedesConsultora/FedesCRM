import { Permiso } from '../models/index.js';

// ---------- GLOBAL ----------
export const findAll = async (options = {}) => {
  return await Permiso.findAll({ order: [['createdAt', 'DESC']], ...options });
};

export const findById = async (id) => {
  return await Permiso.findByPk(id);
};

// ---------- POR ORGANIZACIÓN ----------
export const findAllByOrg = async (orgId, options = {}) => {
  return await Permiso.findAll({
    where: { organizacion_id: orgId },
    order: [['createdAt', 'DESC']],
    ...options
  });
};

export const findByIdAndOrg = async (id, orgId) => {
  return await Permiso.findOne({ where: { id, organizacion_id: orgId } });
};
