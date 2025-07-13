const express = require('express');
const router = express.Router();
const countriesController = require('../../controllers/countriesController');
const { validateLimit } = require('../../middleware/validation');
const { strictLimiter } = require('../../middleware/security');
const asyncHandler = require('../../middleware/asyncHandler');

// Apply strict rate limiting to all routes in this file
router.use(strictLimiter);

/**
 * @route   GET /api/v1/countries
 * @desc    Get all countries data
 * @access  Public
 */
router.get('/', asyncHandler(countriesController.getAllCountries));

/**
 * @route   GET /api/v1/countries/top/:limit
 * @desc    Get top N countries by population
 * @access  Public
 * @param   {number} limit - Number of countries to return (1-300)
 */
router.get('/top/:limit', validateLimit, asyncHandler(countriesController.getTopCountries));

/**
 * @route   GET /api/v1/countries/bottom/:limit
 * @desc    Get bottom N countries by population
 * @access  Public
 * @param   {number} limit - Number of countries to return (1-300)
 */
router.get('/bottom/:limit', validateLimit, asyncHandler(countriesController.getBottomCountries));

/**
 * @route   GET /api/v1/countries/regions
 * @desc    Get region statistics
 * @access  Public
 */
router.get('/regions', asyncHandler(countriesController.getRegionStatistics));

/**
 * @route   GET /api/v1/countries/world-stats
 * @desc    Get world statistics
 * @access  Public
 */
router.get('/world-stats', asyncHandler(countriesController.getWorldStatistics));

module.exports = router;