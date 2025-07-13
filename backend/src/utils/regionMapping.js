const regionMapping = {
  'Asia': [
    'China', 'India', 'Japan', 'Indonesia', 'Pakistan', 'Bangladesh', 'Vietnam', 'Thailand', 'Iran', 'Turkey', 
    'Iraq', 'Afghanistan', 'Saudi Arabia', 'Uzbekistan', 'Yemen', 'Malaysia', 'Nepal', 'North Korea', 'Sri Lanka', 
    'Kazakhstan', 'Syria', 'Cambodia', 'Jordan', 'Azerbaijan', 'United Arab Emirates', 'Tajikistan', 'Israel', 
    'Laos', 'Lebanon', 'Kyrgyzstan', 'Turkmenistan', 'Singapore', 'Oman', 'State of Palestine', 'Kuwait', 
    'Georgia', 'Mongolia', 'Armenia', 'Qatar', 'Bahrain', 'Timor-Leste', 'Cyprus', 'Bhutan', 'Maldives', 
    'Brunei', 'Taiwan', 'Hong Kong', 'Macao'
  ],
  'Europe': [
    'Russia', 'Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Ukraine', 'Poland', 'Romania', 
    'Netherlands', 'Belgium', 'Czech Republic', 'Greece', 'Portugal', 'Sweden', 'Hungary', 'Belarus', 
    'Austria', 'Serbia', 'Switzerland', 'Bulgaria', 'Denmark', 'Finland', 'Slovakia', 'Norway', 'Ireland', 
    'Croatia', 'Moldova', 'Bosnia and Herzegovina', 'Albania', 'Lithuania', 'North Macedonia', 'Slovenia', 
    'Latvia', 'Estonia', 'Montenegro', 'Luxembourg', 'Malta', 'Iceland', 'Andorra', 'Monaco', 'Liechtenstein', 
    'San Marino', 'Holy See'
  ],
  'Africa': [
    'Nigeria', 'Ethiopia', 'Egypt', 'DR Congo', 'Tanzania', 'South Africa', 'Kenya', 'Uganda', 'Sudan', 
    'Algeria', 'Morocco', 'Angola', 'Ghana', 'Mozambique', 'Madagascar', 'Cameroon', 'Côte d\'Ivoire', 'Niger', 
    'Burkina Faso', 'Mali', 'Malawi', 'Zambia', 'Senegal', 'Chad', 'Somalia', 'Zimbabwe', 'Guinea', 'Rwanda', 
    'Benin', 'Burundi', 'Tunisia', 'South Sudan', 'Togo', 'Sierra Leone', 'Libya', 'Congo', 'Liberia', 
    'Central African Republic', 'Mauritania', 'Eritrea', 'Namibia', 'Gambia', 'Botswana', 'Gabon', 'Lesotho', 
    'Guinea-Bissau', 'Equatorial Guinea', 'Mauritius', 'Eswatini', 'Djibouti', 'Comoros', 'Cabo Verde', 
    'Sao Tome & Principe', 'Seychelles', 'Mayotte', 'Western Sahara', 'Saint Helena'
  ],
  'Americas': [
    'United States', 'Brazil', 'Mexico', 'Colombia', 'Argentina', 'Peru', 'Venezuela', 'Chile', 'Guatemala', 
    'Ecuador', 'Bolivia', 'Haiti', 'Cuba', 'Dominican Republic', 'Honduras', 'Paraguay', 'Nicaragua', 
    'El Salvador', 'Costa Rica', 'Panama', 'Uruguay', 'Jamaica', 'Trinidad and Tobago', 'Guyana', 'Suriname', 
    'French Guiana', 'Belize', 'Bahamas', 'Barbados', 'Saint Lucia', 'Grenada', 'Saint Vincent & Grenadines', 
    'Antigua and Barbuda', 'Dominica', 'Saint Kitts & Nevis', 'Turks and Caicos', 'Cayman Islands', 'Bermuda', 
    'Greenland', 'Falkland Islands'
  ],
  'Oceania': [
    'Australia', 'Papua New Guinea', 'New Zealand', 'Fiji', 'Solomon Islands', 'Vanuatu', 'New Caledonia', 
    'French Polynesia', 'Samoa', 'Guam', 'Kiribati', 'Micronesia', 'Tonga', 'American Samoa', 'Marshall Islands', 
    'Palau', 'Cook Islands', 'Nauru', 'Tuvalu', 'Niue', 'Tokelau'
  ]
};

function getRegionByCountry(countryName) {
  for (const [region, countries] of Object.entries(regionMapping)) {
    if (countries.includes(countryName)) {
      return region;
    }
  }
  return 'Unknown';
}

function getAllRegions() {
  return Object.keys(regionMapping);
}

function getCountriesByRegion(regionName) {
  return regionMapping[regionName] || [];
}

module.exports = {
  regionMapping,
  getRegionByCountry,
  getAllRegions,
  getCountriesByRegion
};