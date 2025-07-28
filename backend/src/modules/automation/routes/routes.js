// src/modules/automation/routes/routes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ module: 'automation', status: 'ok' });
});

export default router;
