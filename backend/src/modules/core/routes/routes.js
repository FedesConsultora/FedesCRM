// src/modules/core/routes/routes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ module: 'core', status: 'ok' });
});

export default router;
