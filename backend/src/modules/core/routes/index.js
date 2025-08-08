// src/modules/core/routes/index.js
import { Router } from 'express';

import organizacionRoutes from './organizacionRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import rolRoutes from './rolRoutes.js';
import permisoRoutes from './permisoRoutes.js';
import auditLogRoutes from './auditLogRoutes.js';
import authRoutes from './authRoutes.js';
import invitacionRoutes from './invitacionRoutes.js';
import membresiaRoutes from './membresiaRoutes.js';

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
router.use('/auth', authRoutes);
router.use('/invitaciones', invitacionRoutes);
router.use('/membresias', membresiaRoutes);

export default router;
