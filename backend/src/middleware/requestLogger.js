const morgan = require('morgan');
const logger = require('../utils/logger');
const config = require('../config');

// Custom token for response time
morgan.token('response-time', (req, res) => {
  if (!req._startAt || !res._startAt) {
    return '-';
  }

  const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6;

  return ms.toFixed(3);
});

// Custom format
const morganFormat = config.server.nodeEnv === 'production' 
  ? 'combined' 
  : ':method :url :status :res[content-length] - :response-time ms';

// Create Morgan logger middleware
const requestLogger = morgan(morganFormat, {
  stream: {
    write: (message) => {
      logger.http(message.trim());
    }
  },
  skip: (req, res) => {
    // Skip logging for health check endpoints in production
    if (config.server.nodeEnv === 'production' && req.url.includes('/health')) {
      return true;
    }
    return false;
  }
});

module.exports = requestLogger;