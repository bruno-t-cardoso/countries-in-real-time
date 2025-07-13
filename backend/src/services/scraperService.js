const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config');
const logger = require('../utils/logger');

class ScraperService {
  constructor() {
    this.url = config.scraper.url;
    this.timeout = config.scraper.timeout;
  }

  async getCountriesData() {
    try {
      logger.info('Fetching data from:', this.url);
      
      const { data } = await axios.get(this.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: this.timeout
      });
      
      logger.info('Data fetched successfully, length:', data.length);
      
      const $ = cheerio.load(data);
      const countries = [];

      logger.debug('Page title:', $('title').text());
      logger.debug('All tables found:', $('table').length);
      logger.debug('All tbody elements found:', $('tbody').length);
      logger.debug('All tr elements found:', $('tr').length);

      let tableRows = this._findDataRows($);
      logger.info(`Processing ${tableRows.length} rows`);

      tableRows.each((i, el) => {
        const country = this._parseCountryRow($, el);
        if (country) {
          countries.push(country);
        }
      });

      logger.info(`Successfully processed ${countries.length} countries`);
      
      if (countries.length > 0) {
        logger.debug('First 3 countries:', countries.slice(0, 3));
      }
      
      return countries;
    } catch (error) {
      logger.error('Error scraping data:', error.message);
      logger.error('Error details:', error);
      throw error;
    }
  }

  _findDataRows($) {
    const possibleSelectors = [
      '#example2 tbody tr',
      '.table tbody tr', 
      'table tbody tr',
      'tbody tr',
      'tr'
    ];
    
    for (const selector of possibleSelectors) {
      const rows = $(selector);
      logger.debug(`Selector "${selector}" found ${rows.length} rows`);
      
      if (rows.length > 0) {
        let validRows = 0;
        rows.each((i, el) => {
          const tds = $(el).find('td');
          if (tds.length >= 12) {
            const firstCell = $(tds[0]).text().trim();
            const secondCell = $(tds[1]).text().trim();
            
            if (/^\d+$/.test(firstCell) && secondCell.length > 0 && secondCell.length < 50) {
              validRows++;
            }
          }
        });
        
        logger.debug(`Selector "${selector}" has ${validRows} valid country rows`);
        
        if (validRows > 10) {
          logger.info(`Using selector: ${selector}`);
          return rows;
        }
      }
    }
    
    return $();
  }

  _parseCountryRow($, el) {
    const tds = $(el).find('td');
    if (tds.length >= 12) {
      const firstCell = $(tds[0]).text().trim();
      const secondCell = $(tds[1]).text().trim();
      
      if (/^\d+$/.test(firstCell) && secondCell.length > 0 && secondCell.length < 50) {
        return {
          rank: firstCell,
          name: secondCell,
          population: $(tds[2]).text().trim(),
          yearlyChange: $(tds[3]).text().trim(),
          netChange: $(tds[4]).text().trim(),
          density: $(tds[5]).text().trim(),
          landArea: $(tds[6]).text().trim(),
          migrants: $(tds[7]).text().trim(),
          fertilityRate: $(tds[8]).text().trim(),
          medianAge: $(tds[9]).text().trim(),
          urbanPop: $(tds[10]).text().trim(),
          worldShare: $(tds[11]).text().trim(),
        };
      }
    }
    return null;
  }
}

module.exports = new ScraperService();