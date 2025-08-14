// app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import routes from './src/routes/index.js';
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();
const isProd = process.env.NODE_ENV === 'production';

const parseList = (s = '') => s.split(',').map(x => x.trim()).filter(Boolean);
const FALLBACK_DEV = ['http://localhost:3000','http://127.0.0.1:3000','http://localhost:5173'];

const ALLOWED_ORIGINS = (() => {
  const list = parseList(process.env.CORS_ORIGINS);
  return list.length ? list : (!isProd ? FALLBACK_DEV : []);
})();

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','X-CSRF-Token','Authorization'],
  optionsSuccessStatus: 204,
};

app.set('trust proxy', 1);

// COOP off (Google popup) + CORP cross-origin
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: false,
}));

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(isProd ? 'combined' : 'dev'));

app.use('/api', routes);
app.use(errorHandler);

export default app;