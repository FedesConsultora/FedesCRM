// src/app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './src/routes/index.js';
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rutas del sistema
app.use('/api', routes);

// Manejador de errores central
app.use(errorHandler);

export default app;
