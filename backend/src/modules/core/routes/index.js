import { Router } from 'express';

import authRoutes from './authRoutes.js';
import auditLogRoutes from './auditLogRoutes.js';
import organizacionRoutes from './organizacionRoutes.js';

// Admin global (empiezan con /admin/...)
import usuarioRoutes from './usuarioRoutes.js';
import rolRoutes from './rolRoutes.js';
import permisoRoutes from './permisoRoutes.js';

// Scoped por organización
import orgsRoutes from './orgsRoutes.js';

// Invitaciones (endpoint global para aceptar)
import invitacionRoutes from './invitacionRoutes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ module: 'core', status: 'ok' });
});

/* Global / auth */
router.use('/auth', authRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/organizaciones', organizacionRoutes);

/* Admin global: estos archivos definen rutas /admin/... internamente */
router.use('/', usuarioRoutes);
router.use('/', rolRoutes);
router.use('/', permisoRoutes);

/* Invitación (aceptar) – endpoint global */
router.use('/', invitacionRoutes);

/* Scoped por organización */
router.use('/orgs/:orgId', orgsRoutes);

export default router;
