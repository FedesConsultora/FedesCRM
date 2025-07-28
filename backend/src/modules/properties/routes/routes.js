// src/modules/properties/routes/routes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ module: 'properties', status: 'ok' });
});

export default router;
