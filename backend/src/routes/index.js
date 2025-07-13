const express = require('express');
const router = express.Router();

// Import API versions
const v1Routes = require('./v1');

// Mount API versions
router.use('/v1', v1Routes);

// Default to latest version
router.use('/', v1Routes);

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Countries in Real Time API',
    currentVersion: 'v1',
    availableVersions: ['v1'],
    endpoints: {
      v1: '/api/v1',
      latest: '/api'
    }
  });
});

module.exports = router;