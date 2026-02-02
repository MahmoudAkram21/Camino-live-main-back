const models = require('../models');

const getAllCountries = async (req, res) => {
  try {
    const countries = await models.Country.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC'], ['name', 'ASC']],
    });

    res.json({ success: true, data: countries });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch countries' } });
  }
};

module.exports = { getAllCountries };

