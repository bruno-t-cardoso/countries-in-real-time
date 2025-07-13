const express = require('express');
const cors = require('cors');
const config = require('./config');
const logger = require('./utils/logger');

// Import middleware
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const { securityHeaders, apiLimiter } = require('./middleware/security');
const { xssProtection, noSQLProtection } = require('./middleware/sanitization');

// Import routes
const routes = require('./routes');

const app = express();

// Trust proxy if behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(apiLimiter);

// CORS configuration
const corsOptions = {
  origin: config.server.nodeEnv === 'production' 
    ? ['https://yourdomain.com'] // Add your production domains
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitization middleware
app.use(noSQLProtection);
app.use(xssProtection);

// Request logging
app.use(requestLogger);

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Countries in Real Time API Server',
    version: '1.0.0',
    environment: config.server.nodeEnv,
    uptime: process.uptime(),
    endpoints: {
      api: '/api',
      health: '/api/v1/health',
      countries: '/api/v1/countries'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;