// src/modules/core/validators/auditLogValidator.js
import { query } from 'express-validator';
import validateRequest from '../../../middlewares/validateRequest.js';

export const listarAuditLogsValidator = [
  query('usuarioId').optional().isUUID().withMessage('usuarioId inválido'),
  query('accion').optional().isString(),
  query('fechaDesde').optional().isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
  query('fechaHasta').optional().isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
  validateRequest
];
