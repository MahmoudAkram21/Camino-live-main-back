const models = require('../models');
const { Op } = require('sequelize');
const { getLocaleFromRequest, transformLocalizedFields } = require('../utils/localeHelper');

const getAllTrips = async (req, res) => {
  try {
    const {
      region,
      country,
      duration,
      priceMin,
      priceMax,
      pace,
      collection,
      page = 1,
      limit = 20,
      featured,
      trending,
      search,
    } = req.query;

    const where = { is_active: true };

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    // Apply filters
    if (region) where.region = region;
    if (country) {
      const countryRecord = await models.Country.findOne({ where: { name: country } });
      if (countryRecord) where.country_id = countryRecord.id;
    }
    if (pace) where.pace = pace;
    if (featured === 'true') where.is_featured = true;
    if (trending === 'true') where.is_trending = true;
    if (collection) {
      const collectionRecord = await models.Collection.findOne({ where: { slug: collection } });
      if (collectionRecord) where.collection_id = collectionRecord.id;
    }
    if (priceMin) where.price_from = { [Op.gte]: parseFloat(priceMin) };
    if (priceMax) {
      where.price_from = {
        ...where.price_from,
        [Op.lte]: parseFloat(priceMax),
      };
    }

    // Duration filter
    if (duration) {
      const [min, max] = duration.split('-').map(Number);
      if (max) {
        where.duration_days = { [Op.between]: [min, max] };
      } else {
        where.duration_days = { [Op.gte]: min };
      }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await models.Trip.findAndCountAll({
      where,
      include: [
        { model: models.Country, as: 'country', attributes: ['id', 'name', 'code'] },
        { model: models.Collection, as: 'collection', attributes: ['id', 'slug', 'title'] },
        { model: models.TripImage, as: 'images', attributes: ['id', 'image_url', 'image_alt', 'display_order'], limit: 5 },
      ],
      order: [['display_order', 'ASC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    // Increment views (optional - you might want to do this only for individual trip views)
    // await models.Trip.increment('views_count', { where });

    // Get locale and transform fields
    const locale = getLocaleFromRequest(req);
    const transformedRows = rows.map(trip => {
      const tripData = trip.toJSON();
      return transformLocalizedFields(tripData, ['title', 'description', 'short_description'], locale);
    });

    res.json({
      success: true,
      data: transformedRows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch trips',
        details: error.message,
      },
    });
  }
};

const getTripBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const trip = await models.Trip.findOne({
      where: { slug, is_active: true },
      include: [
        { model: models.Country, as: 'country', attributes: ['id', 'name', 'code', 'region'] },
        { model: models.Collection, as: 'collection', attributes: ['id', 'slug', 'title'] },
        {
          model: models.TripImage,
          as: 'images',
          attributes: ['id', 'image_url', 'image_alt', 'display_order', 'is_hero'],
          order: [['display_order', 'ASC']],
        },
        {
          model: models.TripStop,
          as: 'stops',
          order: [['display_order', 'ASC']],
        },
        {
          model: models.Review,
          as: 'reviews',
          where: { is_approved: true },
          required: false,
          limit: 10,
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Trip not found',
        },
      });
    }

    // Increment views count
    await trip.increment('views_count');

    // Get locale and transform fields
    const locale = getLocaleFromRequest(req);
    const tripData = trip.toJSON();
    const transformedTrip = transformLocalizedFields(tripData, ['title', 'description', 'short_description'], locale);
    
    // Transform stops
    if (transformedTrip.stops && Array.isArray(transformedTrip.stops)) {
      transformedTrip.stops = transformedTrip.stops.map(stop => {
        return transformLocalizedFields(stop, ['city', 'description'], locale);
      });
    }

    res.json({
      success: true,
      data: transformedTrip,
    });
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch trip',
        details: error.message,
      },
    });
  }
};

const getRelatedTrips = async (req, res) => {
  try {
    const { slug } = req.params;

    const currentTrip = await models.Trip.findOne({
      where: { slug },
      attributes: ['id', 'region', 'country_id', 'collection_id'],
    });

    if (!currentTrip) {
      return res.status(404).json({
        success: false,
        error: { message: 'Trip not found' },
      });
    }

    const where = {
      is_active: true,
      id: { [Op.ne]: currentTrip.id },
      [Op.or]: [
        { region: currentTrip.region },
        { country_id: currentTrip.country_id },
        { collection_id: currentTrip.collection_id },
      ],
    };

    const relatedTrips = await models.Trip.findAll({
      where,
      include: [
        { model: models.Country, as: 'country', attributes: ['name', 'code'] },
        { model: models.TripImage, as: 'images', attributes: ['image_url'], limit: 1 },
      ],
      limit: 6,
      order: [['views_count', 'DESC']],
    });

    res.json({
      success: true,
      data: relatedTrips,
    });
  } catch (error) {
    console.error('Error fetching related trips:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch related trips',
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllTrips,
  getTripBySlug,
  getRelatedTrips,
};

