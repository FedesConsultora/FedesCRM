// src/modules/leads/routes/routes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ module: 'leads', status: 'ok' });
});

export default router;
