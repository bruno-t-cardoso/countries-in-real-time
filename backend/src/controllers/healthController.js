const cacheService = require('../services/cacheService');
const config = require('../config');

class HealthController {
  async getHealthCheck(req, res) {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const cacheStats = cacheService.getStats();
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
      environment: config.server.nodeEnv,
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
      },
      cache: {
        entries: cacheStats.size,
        keys: cacheStats.keys
      }
    };

    res.status(200).json({
      success: true,
      data: healthData
    });
  }

  async getReadinessCheck(req, res) {
    try {
      // Add any readiness checks here (database connections, external services, etc.)
      res.status(200).json({
        success: true,
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        status: 'not ready',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new HealthController();