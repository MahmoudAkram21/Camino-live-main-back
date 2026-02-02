const models = require('../../models');

const seedCountries = async (models) => {
  const countriesData = [
    { name: 'United Kingdom', code: 'GB', region: 'UK & Ireland', coordinates_lat: 55.3781, coordinates_lng: -3.4360 },
    { name: 'Ireland', code: 'IE', region: 'UK & Ireland', coordinates_lat: 53.4129, coordinates_lng: -8.2439 },
    { name: 'France', code: 'FR', region: 'Western Europe', coordinates_lat: 46.6034, coordinates_lng: 1.8883 },
    { name: 'Italy', code: 'IT', region: 'Southern Europe', coordinates_lat: 41.8719, coordinates_lng: 12.5674 },
    { name: 'Spain', code: 'ES', region: 'Southern Europe', coordinates_lat: 40.4637, coordinates_lng: -3.7492 },
    { name: 'Switzerland', code: 'CH', region: 'Northern Europe', coordinates_lat: 46.8182, coordinates_lng: 8.2275 },
    { name: 'Austria', code: 'AT', region: 'Northern Europe', coordinates_lat: 47.5162, coordinates_lng: 14.5501 },
    { name: 'Germany', code: 'DE', region: 'Northern Europe', coordinates_lat: 51.1657, coordinates_lng: 10.4515 },
    { name: 'Portugal', code: 'PT', region: 'Southern Europe', coordinates_lat: 39.3999, coordinates_lng: -8.2245 },
    { name: 'Belgium', code: 'BE', region: 'Northern Europe', coordinates_lat: 50.5039, coordinates_lng: 4.4699 },
    { name: 'Netherlands', code: 'NL', region: 'Northern Europe', coordinates_lat: 52.1326, coordinates_lng: 5.2913 },
    { name: 'Denmark', code: 'DK', region: 'Northern Europe', coordinates_lat: 56.2639, coordinates_lng: 9.5018 },
    { name: 'Sweden', code: 'SE', region: 'Northern Europe', coordinates_lat: 60.1282, coordinates_lng: 18.6435 },
    { name: 'Norway', code: 'NO', region: 'Northern Europe', coordinates_lat: 60.4720, coordinates_lng: 8.4689 },
    { name: 'Poland', code: 'PL', region: 'Eastern Europe', coordinates_lat: 51.9194, coordinates_lng: 19.1451 },
    { name: 'Czech Republic', code: 'CZ', region: 'Eastern Europe', coordinates_lat: 49.8175, coordinates_lng: 15.4730 },
    { name: 'Greece', code: 'GR', region: 'Southern Europe', coordinates_lat: 39.0742, coordinates_lng: 21.8243 },
    { name: 'Croatia', code: 'HR', region: 'Southern Europe', coordinates_lat: 45.1000, coordinates_lng: 15.2000 },
    { name: 'Slovenia', code: 'SI', region: 'Southern Europe', coordinates_lat: 46.1512, coordinates_lng: 14.9955 },
    { name: 'Finland', code: 'FI', region: 'Northern Europe', coordinates_lat: 61.9241, coordinates_lng: 25.7482 },
    { name: 'Iceland', code: 'IS', region: 'Northern Europe', coordinates_lat: 64.9631, coordinates_lng: -19.0208 },
  ];

  const countries = [];
  for (const countryData of countriesData) {
    const [country, created] = await models.Country.findOrCreate({
      where: { code: countryData.code },
      defaults: {
        ...countryData,
        description: `Beautiful ${countryData.name} with stunning landscapes and rich culture.`,
        flag_image_url: `https://flagcdn.com/w160/${countryData.code.toLowerCase()}.png`,
      },
    });
    countries.push(country);
  }

  return countries;
};

module.exports = seedCountries;

