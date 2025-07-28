// src/index.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import db from './config/db.js';

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await db.connect();
    console.log('✅ Conexión a la base de datos establecida');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
    process.exit(1);
  }
})();
