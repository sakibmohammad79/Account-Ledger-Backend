import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from "cookie-parser";
import { config } from './app/config';
// import router from './routes';
// import { apiNotFoundHandler } from './app/middlewares/apiNotFoundHandler';
// import { globalErrorHandler } from './app/middlewares/globalErrorHandler';



// Load environment variables
dotenv.config();

const app = express();

// Trust proxy - Important for Vercel to get real IP
app.set('trust proxy', 1);

// Security Middleware - with cross-origin support
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiting - Only on API routes to avoid health check blocking
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});
app.use('/api', limiter);


// CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? config.cors.allowedOrigin 
      : 'http://localhost:3000',           
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// Logging - environment based
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body Parsing & Compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Main route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'WELCOME TO ACCOUNT LEDGER',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    status: 'running',
  });
});

// Application routes
// app.use('/api/v1', router);

// 404 Handler
// app.use(apiNotFoundHandler);

// // Global error handler
// app.use(globalErrorHandler);

export default app;