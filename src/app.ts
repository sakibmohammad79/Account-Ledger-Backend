import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config } from './app/config';
import router from './routes';
import { apiNotFoundHandler } from './app/middlewares/ApiNotFoundHandler';
import { globalErrorHandler } from './app/middlewares/GlobalErrorHandler';

const app = express();

// Trust proxy (Vercel requirement)
app.set('trust proxy', 1);

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Rate limit only API
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// CORS
app.use(
  cors({
    origin:
      config.app.nodeEnv === 'production'
        ? config.cors.allowedOrigin
        : 'http://localhost:3000',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan(config.app.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Health
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    environment: config.app.nodeEnv,
  });
});

// Root
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'WELCOME TO ACCOUNT LEDGER',
    version: '1.0.0',
  });
});

// Routes
app.use('/api/v1', router);

// Errors
app.use(apiNotFoundHandler);
app.use(globalErrorHandler);

export default app;
