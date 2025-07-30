// src/modules/core/routes/index.js
import { Router } from 'express';

import organizacionRoutes from './organizacionRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import rolRoutes from './rolRoutes.js';
import permisoRoutes from './permisoRoutes.js';
import auditLogRoutes from './auditLogRoutes.js';

const router = Router();

// Health check del módulo
router.get('/', (req, res) => {
  res.json({ module: 'core', status: 'ok' });
});

// Montaje de subrutas
router.use('/organizaciones', organizacionRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/roles', rolRoutes);
router.use('/permisos', permisoRoutes);
router.use('/audit-logs', auditLogRoutes);

export default router;
