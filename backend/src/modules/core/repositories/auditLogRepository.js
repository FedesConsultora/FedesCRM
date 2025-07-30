// src/modules/core/repositories/auditLogRepository.js
import { AuditLog, Usuario } from '../models/index.js';
import { Op } from 'sequelize';

export const findAll = async (filters = {}) => {
  const where = {};

  if (filters.usuarioId) where.usuarioId = filters.usuarioId;
  if (filters.accion) where.accion = { [Op.iLike]: `%${filters.accion}%` };

  if (filters.fechaDesde || filters.fechaHasta) {
    where.createdAt = {};
    if (filters.fechaDesde) where.createdAt[Op.gte] = new Date(filters.fechaDesde);
    if (filters.fechaHasta) where.createdAt[Op.lte] = new Date(filters.fechaHasta);
  }

  return await AuditLog.findAll({
    where,
    include: [
      { model: Usuario, attributes: ['id', 'nombre', 'apellido', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  });
};
