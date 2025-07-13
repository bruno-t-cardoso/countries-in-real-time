const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const config = require('../config');
const logger = require('../utils/logger');

// Rate limiting
const createRateLimiter = (windowMs = config.rateLimit.windowMs, max = config.rateLimit.maxRequests) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        error: 'Too many requests from this IP, please try again later'
      });
    }
  });
};

// General API rate limiter
const apiLimiter = createRateLimiter();

// Moderate rate limiter for API endpoints (allowing for real-time polling)
const strictLimiter = createRateLimiter(1 * 60 * 1000, 120); // 120 requests per minute

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

module.exports = {
  apiLimiter,
  strictLimiter,
  securityHeaders
};