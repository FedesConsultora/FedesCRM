// src/modules/agenda/routes/routes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ module: 'agenda', status: 'ok' });
});

export default router;
