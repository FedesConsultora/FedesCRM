// src/routes/index.js
import express from 'express';

// Import de rutas por módulo
import coreRoutes from '../modules/core/routes/index.js';
import leadsRoutes from '../modules/leads/routes/routes.js';
import propertiesRoutes from '../modules/properties/routes/routes.js';
import messagingRoutes from '../modules/messaging/routes/routes.js';
import agendaRoutes from '../modules/agenda/routes/routes.js';
import automationRoutes from '../modules/automation/routes/routes.js';
import { sendTemplate } from '../services/email/index.js';

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


router.get('/test-email/verify', async (req, res, next) => {
  try {
    await sendTemplate({
      to      : 'enzopinottii@gmail.com',
      template: 'verify-email',
      subject : 'Verificá tu cuenta en FedesCRM',
      vars    : {
        verifyLink: 'https://fedes.ai/verify/abc123'
      }
    });
    res.json({ ok: true, message: 'Email de verificación enviado' });
  } catch (error) {
    next(error);
  }
});

export default router;
