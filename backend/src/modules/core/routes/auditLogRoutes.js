import { Router } from 'express';
import * as controller from '../controllers/auditLogController.js';
import { listarAuditLogsValidator } from '../validators/auditLogValidator.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Solo lectura de logs
router.get('/', listarAuditLogsValidator, requirePermiso('audit-logs.ver'), controller.listar);

export default router;
