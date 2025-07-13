const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://www.worldometers.info/world-population/population-by-country/';

async function getCountriesData() {
  try {
    console.log('Fetching data from:', URL);
    
    // Add headers to mimic a real browser
    const { data } = await axios.get(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000
    });
    
    console.log('Data fetched successfully, length:', data.length);
    
    const $ = cheerio.load(data);
    const countries = [];

    // Debug: Log page structure
    console.log('Page title:', $('title').text());
    console.log('All tables found:', $('table').length);
    console.log('All tbody elements found:', $('tbody').length);
    console.log('All tr elements found:', $('tr').length);

    // Try to find the main data table
    let tableRows = [];
    
    // Method 1: Look for the specific table structure
    const possibleSelectors = [
      '#example2 tbody tr',
      '.table tbody tr', 
      'table tbody tr',
      'tbody tr',
      'tr'
    ];
    
    for (const selector of possibleSelectors) {
      const rows = $(selector);
      console.log(`Selector "${selector}" found ${rows.length} rows`);
      
      if (rows.length > 0) {
        // Check if these rows contain country data
        let validRows = 0;
        rows.each((i, el) => {
          const tds = $(el).find('td');
          if (tds.length >= 12) {
            const firstCell = $(tds[0]).text().trim();
            const secondCell = $(tds[1]).text().trim();
            
            // Check if this looks like a country row
            if (/^\d+$/.test(firstCell) && secondCell.length > 0 && secondCell.length < 50) {
              validRows++;
            }
          }
        });
        
        console.log(`Selector "${selector}" has ${validRows} valid country rows`);
        
        if (validRows > 10) { // Assume we need at least 10 countries
          tableRows = rows;
          console.log(`Using selector: ${selector}`);
          break;
        }
      }
    }

    console.log(`Processing ${tableRows.length} rows`);

    tableRows.each((i, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 12) {
        const firstCell = $(tds[0]).text().trim();
        const secondCell = $(tds[1]).text().trim();
        
        // Only process if it looks like a country row
        if (/^\d+$/.test(firstCell) && secondCell.length > 0 && secondCell.length < 50) {
          const country = {
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
          
          countries.push(country);
        }
      }
    });

    console.log(`Successfully processed ${countries.length} countries`);
    
    // Log first few countries for debugging
    if (countries.length > 0) {
      console.log('First 3 countries:', countries.slice(0, 3));
    }
    
    return countries;
  } catch (error) {
    console.error('Error scraping data:', error.message);
    console.error('Error details:', error);
    throw error;
  }
}

module.exports = { getCountriesData }; 