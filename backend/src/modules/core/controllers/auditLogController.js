// src/modules/core/controllers/auditLogController.js
import * as service from '../services/auditLogService.js';

export const listar = async (req, res, next) => {
  try {
    const { usuarioId, accion, fechaDesde, fechaHasta } = req.query;

    const data = await service.listarAuditLogs({
      usuarioId,
      accion,
      fechaDesde,
      fechaHasta
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
