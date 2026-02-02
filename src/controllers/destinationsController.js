const models = require('../models');
const { Op } = require('sequelize');
const { getLocaleFromRequest, transformLocalizedFields } = require('../utils/localeHelper');

const getAllDestinations = async (req, res) => {
  try {
    const { search } = req.query;
    const where = { is_active: true };

    // Search filter
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    const destinations = await models.Destination.findAll({
      where,
      include: [{ model: models.Country, as: 'country', attributes: ['id', 'name', 'code'] }],
      order: [['display_order', 'ASC'], ['name', 'ASC']],
    });

    // Get locale and transform fields
    const locale = getLocaleFromRequest(req);
    const transformedDestinations = destinations.map(destination => {
      const destinationData = destination.toJSON();
      return transformLocalizedFields(destinationData, ['name', 'description'], locale);
    });

    res.json({ success: true, data: transformedDestinations });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch destinations' } });
  }
};

const getDestinationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const destination = await models.Destination.findOne({
      where: { slug, is_active: true },
      include: [
        { model: models.Country, as: 'country' },
      ],
    });

    if (!destination) {
      return res.status(404).json({ success: false, error: { message: 'Destination not found' } });
    }

    // Get trips for this destination
    const countryTrips = await models.Trip.findAll({
      where: { country_id: destination.country_id, is_active: true },
      include: [
        { model: models.Country, as: 'country', attributes: ['name', 'code'] },
        { model: models.TripImage, as: 'images', attributes: ['image_url'], limit: 1 },
      ],
      limit: 12,
    });

    // Get locale and transform fields
    const locale = getLocaleFromRequest(req);
    const destinationData = destination.toJSON();
    const transformedDestination = transformLocalizedFields(destinationData, ['name', 'description'], locale);
    
    // Transform trips
    const transformedTrips = countryTrips.map(trip => {
      const tripData = trip.toJSON();
      return transformLocalizedFields(tripData, ['title', 'description', 'short_description'], locale);
    });

    res.json({
      success: true,
      data: {
        ...transformedDestination,
        trips: transformedTrips,
      },
    });
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch destination' } });
  }
};

module.exports = { getAllDestinations, getDestinationBySlug };

