// src/modules/messaging/routes/routes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ module: 'messaging', status: 'ok' });
});

export default router;
