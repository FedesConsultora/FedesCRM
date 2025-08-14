import { Router } from 'express';
import orgUsuarioRoutes from './orgUsuarioRoutes.js';
import orgRolRoutes from './orgRolRoutes.js';
import orgPermisoRoutes from './orgPermisoRoutes.js';
import orgMembresiaRoutes from './orgMembresiaRoutes.js';
import orgInvitacionRoutes from './orgInvitacionRoutes.js';

const router = Router({ mergeParams: true });

router.use('/', orgUsuarioRoutes);
router.use('/', orgRolRoutes);
router.use('/', orgPermisoRoutes);
router.use('/', orgMembresiaRoutes);
router.use('/', orgInvitacionRoutes);

export default router;
