// src/routes/index.js
import express from 'express';

// Import de rutas por módulo
import coreRoutes from '../modules/core/routes/routes.js';
import leadsRoutes from '../modules/leads/routes/routes.js';
import propertiesRoutes from '../modules/properties/routes/routes.js';
import messagingRoutes from '../modules/messaging/routes/routes.js';
import agendaRoutes from '../modules/agenda/routes/routes.js';
import automationRoutes from '../modules/automation/routes/routes.js';

const router = express.Router();

// Montaje de rutas modulares
router.use('/core', coreRoutes);
router.use('/leads', leadsRoutes);
router.use('/properties', propertiesRoutes);
router.use('/messaging', messagingRoutes);
router.use('/agenda', agendaRoutes);
router.use('/automation', automationRoutes);

// Ruta base de prueba
router.get('/', (req, res) => {
  res.json({ message: '🧠 FedesCRM API: módulo rutas funcionando' });
});

export default router;
