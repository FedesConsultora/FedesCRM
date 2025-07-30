// src/modules/core/services/auditLogService.js
import * as repo from '../repositories/auditLogRepository.js';

export const listarAuditLogs = async (filters) => {
  return await repo.findAll(filters);
};
