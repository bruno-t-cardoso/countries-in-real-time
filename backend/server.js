const express = require('express');
const cors = require('cors');
const { getCountriesData } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Cache for storing scraped data
let cachedData = null;
let lastFetchTime = null;
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute

// Helper function to get fresh data or cached data
async function getData() {
  const now = Date.now();
  if (!cachedData || !lastFetchTime || (now - lastFetchTime) > CACHE_DURATION) {
    console.log('Fetching fresh data...');
    cachedData = await getCountriesData();
    lastFetchTime = now;
  }
  return cachedData;
}

// Get all countries
app.get('/api/countries', async (req, res) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Get top N countries by population
app.get('/api/countries/top/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const data = await getData();
    const sorted = data.sort((a, b) => {
      const popA = parseInt(a.population.replace(/,/g, ''));
      const popB = parseInt(b.population.replace(/,/g, ''));
      return popB - popA;
    });
    res.json(sorted.slice(0, limit));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Get bottom N countries by population
app.get('/api/countries/bottom/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const data = await getData();
    const sorted = data.sort((a, b) => {
      const popA = parseInt(a.population.replace(/,/g, ''));
      const popB = parseInt(b.population.replace(/,/g, ''));
      return popA - popB;
    });
    res.json(sorted.slice(0, limit));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Get countries by region (simple grouping)
app.get('/api/regions', async (req, res) => {
  try {
    const data = await getData();
    const regions = {
      'Asia': data.filter(c => ['China', 'India', 'Japan', 'Indonesia', 'Pakistan', 'Bangladesh', 'Vietnam', 'Thailand', 'Iran', 'Turkey', 'Iraq', 'Afghanistan', 'Saudi Arabia', 'Uzbekistan', 'Yemen', 'Malaysia', 'Nepal', 'North Korea', 'Sri Lanka', 'Kazakhstan', 'Syria', 'Cambodia', 'Jordan', 'Azerbaijan', 'United Arab Emirates', 'Tajikistan', 'Israel', 'Laos', 'Lebanon', 'Kyrgyzstan', 'Turkmenistan', 'Singapore', 'Oman', 'State of Palestine', 'Kuwait', 'Georgia', 'Mongolia', 'Armenia', 'Qatar', 'Bahrain', 'Timor-Leste', 'Cyprus', 'Bhutan', 'Maldives', 'Brunei', 'Taiwan', 'Hong Kong', 'Macao'].includes(c.name)),
      'Europe': data.filter(c => ['Russia', 'Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Ukraine', 'Poland', 'Romania', 'Netherlands', 'Belgium', 'Czech Republic', 'Greece', 'Portugal', 'Sweden', 'Hungary', 'Belarus', 'Austria', 'Serbia', 'Switzerland', 'Bulgaria', 'Denmark', 'Finland', 'Slovakia', 'Norway', 'Ireland', 'Croatia', 'Moldova', 'Bosnia and Herzegovina', 'Albania', 'Lithuania', 'North Macedonia', 'Slovenia', 'Latvia', 'Estonia', 'Montenegro', 'Luxembourg', 'Malta', 'Iceland', 'Andorra', 'Monaco', 'Liechtenstein', 'San Marino', 'Holy See'].includes(c.name)),
      'Africa': data.filter(c => ['Nigeria', 'Ethiopia', 'Egypt', 'DR Congo', 'Tanzania', 'South Africa', 'Kenya', 'Uganda', 'Sudan', 'Algeria', 'Morocco', 'Angola', 'Ghana', 'Mozambique', 'Madagascar', 'Cameroon', 'Côte d\'Ivoire', 'Niger', 'Burkina Faso', 'Mali', 'Malawi', 'Zambia', 'Senegal', 'Chad', 'Somalia', 'Zimbabwe', 'Guinea', 'Rwanda', 'Benin', 'Burundi', 'Tunisia', 'South Sudan', 'Togo', 'Sierra Leone', 'Libya', 'Congo', 'Liberia', 'Central African Republic', 'Mauritania', 'Eritrea', 'Namibia', 'Gambia', 'Botswana', 'Gabon', 'Lesotho', 'Guinea-Bissau', 'Equatorial Guinea', 'Mauritius', 'Eswatini', 'Djibouti', 'Comoros', 'Cabo Verde', 'Sao Tome & Principe', 'Seychelles', 'Mayotte', 'Western Sahara', 'Saint Helena'].includes(c.name)),
      'Americas': data.filter(c => ['United States', 'Brazil', 'Mexico', 'Colombia', 'Argentina', 'Peru', 'Venezuela', 'Chile', 'Guatemala', 'Ecuador', 'Bolivia', 'Haiti', 'Cuba', 'Dominican Republic', 'Honduras', 'Paraguay', 'Nicaragua', 'El Salvador', 'Costa Rica', 'Panama', 'Uruguay', 'Jamaica', 'Trinidad and Tobago', 'Guyana', 'Suriname', 'French Guiana', 'Belize', 'Bahamas', 'Barbados', 'Saint Lucia', 'Grenada', 'Saint Vincent & Grenadines', 'Antigua and Barbuda', 'Dominica', 'Saint Kitts & Nevis', 'Turks and Caicos', 'Cayman Islands', 'Bermuda', 'Greenland', 'Falkland Islands'].includes(c.name)),
      'Oceania': data.filter(c => ['Australia', 'Papua New Guinea', 'New Zealand', 'Fiji', 'Solomon Islands', 'Vanuatu', 'New Caledonia', 'French Polynesia', 'Samoa', 'Guam', 'Kiribati', 'Micronesia', 'Tonga', 'American Samoa', 'Marshall Islands', 'Palau', 'Cook Islands', 'Nauru', 'Tuvalu', 'Niue', 'Tokelau'].includes(c.name))
    };
    
    const regionStats = Object.keys(regions).map(region => {
      const countries = regions[region];
      const totalPopulation = countries.reduce((sum, c) => {
        return sum + parseInt(c.population.replace(/,/g, ''));
      }, 0);
      
      return {
        name: region,
        countryCount: countries.length,
        totalPopulation: totalPopulation.toLocaleString(),
        worldShare: ((totalPopulation / 8000000000) * 100).toFixed(2) + '%'
      };
    });
    
    res.json(regionStats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Get world statistics
app.get('/api/world-stats', async (req, res) => {
  try {
    const data = await getData();
    const totalCountries = data.length;
    const totalPopulation = data.reduce((sum, c) => {
      return sum + parseInt(c.population.replace(/,/g, ''));
    }, 0);
    
    const stats = {
      totalCountries,
      totalPopulation: totalPopulation.toLocaleString(),
      averagePopulation: Math.round(totalPopulation / totalCountries).toLocaleString(),
      averageDensity: Math.round(data.reduce((sum, c) => sum + parseInt(c.density.replace(/,/g, '') || 0), 0) / totalCountries),
      averageMedianAge: Math.round(data.reduce((sum, c) => sum + parseFloat(c.medianAge || 0), 0) / totalCountries * 10) / 10
    };
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 