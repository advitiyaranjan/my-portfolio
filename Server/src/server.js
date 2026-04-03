import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import xss from 'xss-clean';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Import database
import { connectDB } from './config/db.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { verifyEmailConnection } from './utils/emailService.js';
import { logger } from './utils/logger.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import caseStudyRoutes from './routes/caseStudyRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import leadershipRoutes from './routes/leadershipRoutes.js';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

// Initialize Express app
const app = express();

// ============================================
// ENVIRONMENT VARIABLES
// ============================================
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet());
app.use(xss());

// Disable caching for API endpoints (prevent 304 Not Modified responses)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin requests (e.g., on Vercel)
      if (!origin) return callback(null, true);
      // Allow configured frontend URL
      if (origin === FRONTEND_URL) return callback(null, true);
      // Allow *.vercel.app pattern for any Vercel deployment
      if (origin && origin.includes('vercel.app')) return callback(null, true);
      // Allow localhost for development
      if (origin && origin.includes('localhost')) return callback(null, true);
      callback(null, true); // Allow all for now (can restrict later)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logger middleware
app.use(
  morgan('combined', {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Contact form rate limiting (stricter)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per hour
  message: 'Too many contact form submissions from this IP, please try again later.',
  skipSuccessfulRequests: true,
});

// ============================================
// STATIC FILE SERVING
// ============================================
// Serve uploaded images (safe for serverless)
try {
  const uploadsPath = path.join(__dirname, 'uploads/images');
  if (fs.existsSync(uploadsPath)) {
    app.use('/api/uploads/images', express.static(uploadsPath));
    app.use('/uploads/images', express.static(uploadsPath));
  }
} catch (err) {
  logger.warn('Could not serve uploads (serverless environment)', err.message);
}

// ============================================
// API ROUTES
// ============================================

// API version prefix
const API_PREFIX = '/api';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/portfolio`, portfolioRoutes);
app.use(`${API_PREFIX}/projects`, projectRoutes);
app.use(`${API_PREFIX}/contact`, contactLimiter, contactRoutes);
app.use(`${API_PREFIX}/skills`, skillRoutes);
app.use(`${API_PREFIX}/experience`, experienceRoutes);
app.use(`${API_PREFIX}/case-studies`, caseStudyRoutes);
app.use(`${API_PREFIX}/achievements`, leadershipRoutes);
app.use(`${API_PREFIX}/resumes`, resumeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// SERVE STATIC FILES (Production)
// ============================================

// In production, serve the client build
if (NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../Client/dist');
  app.use(express.static(clientBuildPath));

  // Serve index.html for all non-API routes (SPA routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// DATABASE CONNECTION & SERVER START
// ============================================

let initializationPromise;

export const initializeApp = async () => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      await connectDB();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.warn('Database connection failed. Running in offline mode.', { error: error.message });
      logger.warn('API endpoints requiring database will return mock data or errors.');
    }

    const emailConnected = await verifyEmailConnection();
    if (emailConnected) {
      logger.info('Email service connected');
    } else {
      logger.warn('Email service is not configured properly. Contact form emails may not be sent.');
    }

    return app;
  })();

  return initializationPromise;
};

const startServer = async () => {
  await initializeApp();

  // Start server (regardless of database connection)
  app.listen(PORT, () => {
    logger.info(`Server started on http://localhost:${PORT}`);
    logger.info(`Environment: ${NODE_ENV}`);
    logger.info(`Frontend URL: ${FRONTEND_URL}`);
  });
};

// Handle unhandled promise rejections
if (isDirectRun) {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', { reason, promise });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', { error: error.message });
    process.exit(1);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
  });
}

// Start the server
if (isDirectRun) {
  startServer();
}

export default app;
