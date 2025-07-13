const countriesService = require('../services/countriesService');
const logger = require('../utils/logger');

class CountriesController {
  async getAllCountries(req, res) {
    try {
      const data = await countriesService.getAllCountries();
      res.status(200).json({
        success: true,
        data,
        count: data.length
      });
    } catch (error) {
      logger.error('Error in getAllCountries:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch countries data'
      });
    }
  }

  async getTopCountries(req, res) {
    try {
      const limit = parseInt(req.params.limit) || 10;
      
      if (limit <= 0 || limit > 300) {
        return res.status(400).json({
          success: false,
          error: 'Limit must be between 1 and 300'
        });
      }

      const data = await countriesService.getTopCountriesByPopulation(limit);
      res.status(200).json({
        success: true,
        data,
        count: data.length,
        limit
      });
    } catch (error) {
      logger.error('Error in getTopCountries:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch top countries data'
      });
    }
  }

  async getBottomCountries(req, res) {
    try {
      const limit = parseInt(req.params.limit) || 10;
      
      if (limit <= 0 || limit > 300) {
        return res.status(400).json({
          success: false,
          error: 'Limit must be between 1 and 300'
        });
      }

      const data = await countriesService.getBottomCountriesByPopulation(limit);
      res.status(200).json({
        success: true,
        data,
        count: data.length,
        limit
      });
    } catch (error) {
      logger.error('Error in getBottomCountries:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bottom countries data'
      });
    }
  }

  async getRegionStatistics(req, res) {
    try {
      const data = await countriesService.getRegionStatistics();
      res.status(200).json({
        success: true,
        data,
        count: data.length
      });
    } catch (error) {
      logger.error('Error in getRegionStatistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch region statistics'
      });
    }
  }

  async getWorldStatistics(req, res) {
    try {
      const data = await countriesService.getWorldStatistics();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger.error('Error in getWorldStatistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch world statistics'
      });
    }
  }
}

module.exports = new CountriesController();