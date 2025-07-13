const express = require('express');
const router = express.Router();

// Import route modules
const countriesRoutes = require('./countries');
const healthRoutes = require('./health');

// Mount routes
router.use('/countries', countriesRoutes);
router.use('/health', healthRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Countries in Real Time API v1',
    version: '1.0.0',
    endpoints: {
      countries: '/api/v1/countries',
      topCountries: '/api/v1/countries/top/:limit',
      bottomCountries: '/api/v1/countries/bottom/:limit',
      regions: '/api/v1/countries/regions',
      worldStats: '/api/v1/countries/world-stats',
      health: '/api/v1/health',
      readiness: '/api/v1/health/ready'
    },
    documentation: 'https://github.com/bruno-t-cardoso/countries-in-real-time'
  });
});

module.exports = router;