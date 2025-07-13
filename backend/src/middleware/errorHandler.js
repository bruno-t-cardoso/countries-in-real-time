const logger = require('../utils/logger');
const config = require('../config');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  // Axios/Network errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    statusCode = 503;
    message = 'External service unavailable';
  }

  // Timeout errors
  if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
    statusCode = 504;
    message = 'Request timeout';
  }

  // Don't leak error details in production
  const isDevelopment = config.server.nodeEnv === 'development';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isDevelopment && { stack: err.stack, details: err.message })
  });
};

module.exports = errorHandler;