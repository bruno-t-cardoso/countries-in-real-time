require('dotenv').config();

const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 5000,
    host: process.env.HOST || 'localhost'
  },
  cache: {
    duration: parseInt(process.env.CACHE_DURATION) || 60000 // 1 minute
  },
  scraper: {
    url: process.env.SCRAPER_URL || 'https://www.worldometers.info/world-population/population-by-country/',
    timeout: parseInt(process.env.SCRAPER_TIMEOUT) || 10000
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 5 * 60 * 1000, // 5 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 500 // 500 requests per 5 minutes
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  }
};

module.exports = config;