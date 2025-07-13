const config = require('../config');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = config.cache.duration;
  }

  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      logger.debug(`Cache miss for key: ${key}`);
      return null;
    }

    const { data, timestamp } = cached;
    const now = Date.now();
    
    if ((now - timestamp) > this.cacheDuration) {
      logger.debug(`Cache expired for key: ${key}`);
      this.cache.delete(key);
      return null;
    }

    logger.debug(`Cache hit for key: ${key}`);
    return data;
  }

  set(key, data) {
    const timestamp = Date.now();
    this.cache.set(key, { data, timestamp });
    logger.debug(`Data cached for key: ${key}`);
  }

  clear() {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

module.exports = new CacheService();