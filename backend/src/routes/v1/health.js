const express = require('express');
const router = express.Router();
const healthController = require('../../controllers/healthController');
const asyncHandler = require('../../middleware/asyncHandler');

/**
 * @route   GET /api/v1/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', asyncHandler(healthController.getHealthCheck));

/**
 * @route   GET /api/v1/health/ready
 * @desc    Readiness check endpoint
 * @access  Public
 */
router.get('/ready', asyncHandler(healthController.getReadinessCheck));

module.exports = router;