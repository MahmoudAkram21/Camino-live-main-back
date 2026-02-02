require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing: 1MB in production to avoid OOM on small servers; 10MB in dev for uploads
const bodyLimit = process.env.BODY_LIMIT || (process.env.NODE_ENV === 'production' ? '1mb' : '10mb');
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting. In production use shorter window + lower max to keep in-memory store small (or use Redis store).
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || (process.env.NODE_ENV === 'development' ? 60 * 1000 : 5 * 60 * 1000), // 1 min dev, 5 min prod (smaller store)
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || (process.env.NODE_ENV === 'development' ? 1000 : 80),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    if (process.env.NODE_ENV === 'development') {
      const ip = req.ip || req.connection.remoteAddress;
      return ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1';
    }
    return false;
  },
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Camino Travel Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      trips: '/api/trips',
      collections: '/api/collections',
      destinations: '/api/destinations',
      journal: '/api/journal',
      faqs: '/api/faqs',
      reviews: '/api/reviews',
      admin: '/api/admin',
    },
  });
});

// Request timeout: respond before nginx 504. Default 25s (set REQUEST_TIMEOUT_MS in env).
const requestTimeoutMs = parseInt(process.env.REQUEST_TIMEOUT_MS, 10) || 25000;
app.use((req, res, next) => {
  const t = setTimeout(() => {
    if (!res.headersSent) {
      res.status(503).json({ success: false, error: { message: 'Request timeout' } });
    }
  }, requestTimeoutMs);
  res.on('finish', () => clearTimeout(t));
  res.on('close', () => clearTimeout(t));
  next();
});

// Load API routes at startup (no lazy-load: first request was causing 504 + memory spike)
require('./routes/index')(app);

// Error handling middleware (must be last). In production log only message to avoid large objects.
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  } else {
    console.error('Error:', err?.message || String(err));
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
    },
  });
});

module.exports = app;

