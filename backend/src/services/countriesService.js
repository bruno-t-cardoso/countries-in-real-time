const scraperService = require('./scraperService');
const cacheService = require('./cacheService');
const regionMapping = require('../utils/regionMapping');
const logger = require('../utils/logger');

class CountriesService {
  async getAllCountries() {
    return await this._getDataWithCache();
  }

  async getTopCountriesByPopulation(limit = 10) {
    const data = await this._getDataWithCache();
    const sorted = data.sort((a, b) => {
      const popA = this._parsePopulation(a.population);
      const popB = this._parsePopulation(b.population);
      return popB - popA;
    });
    return sorted.slice(0, limit);
  }

  async getBottomCountriesByPopulation(limit = 10) {
    const data = await this._getDataWithCache();
    const sorted = data.sort((a, b) => {
      const popA = this._parsePopulation(a.population);
      const popB = this._parsePopulation(b.population);
      return popA - popB;
    });
    return sorted.slice(0, limit);
  }

  async getRegionStatistics() {
    const data = await this._getDataWithCache();
    const regions = this._groupCountriesByRegion(data);
    
    return Object.keys(regions).map(region => {
      const countries = regions[region];
      const totalPopulation = countries.reduce((sum, c) => {
        return sum + this._parsePopulation(c.population);
      }, 0);
      
      return {
        name: region,
        countryCount: countries.length,
        totalPopulation: totalPopulation.toLocaleString(),
        worldShare: ((totalPopulation / 8000000000) * 100).toFixed(2) + '%'
      };
    });
  }

  async getWorldStatistics() {
    const data = await this._getDataWithCache();
    const totalCountries = data.length;
    const totalPopulation = data.reduce((sum, c) => {
      return sum + this._parsePopulation(c.population);
    }, 0);
    
    return {
      totalCountries,
      totalPopulation: totalPopulation.toLocaleString(),
      averagePopulation: Math.round(totalPopulation / totalCountries).toLocaleString(),
      averageDensity: Math.round(data.reduce((sum, c) => sum + this._parseDensity(c.density), 0) / totalCountries),
      averageMedianAge: Math.round(data.reduce((sum, c) => sum + parseFloat(c.medianAge || 0), 0) / totalCountries * 10) / 10
    };
  }

  async _getDataWithCache() {
    const cacheKey = 'countries_data';
    let data = cacheService.get(cacheKey);
    
    if (!data) {
      logger.info('Fetching fresh data...');
      data = await scraperService.getCountriesData();
      cacheService.set(cacheKey, data);
    } else {
      logger.info('Using cached data');
    }
    
    return data;
  }

  _parsePopulation(populationStr) {
    return parseInt(populationStr.replace(/,/g, '')) || 0;
  }

  _parseDensity(densityStr) {
    return parseInt(densityStr.replace(/,/g, '')) || 0;
  }

  _groupCountriesByRegion(countries) {
    const regions = {
      'Asia': [],
      'Europe': [],
      'Africa': [],
      'Americas': [],
      'Oceania': []
    };

    countries.forEach(country => {
      const region = regionMapping.getRegionByCountry(country.name);
      if (regions[region]) {
        regions[region].push(country);
      }
    });

    return regions;
  }
}

module.exports = new CountriesService();