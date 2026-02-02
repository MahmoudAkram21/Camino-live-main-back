const models = require('../models');
const { Op } = require('sequelize');
const { getLocaleFromRequest, transformLocalizedFields } = require('../utils/localeHelper');

const getAllCollections = async (req, res) => {
  try {
    const { search } = req.query;
    const where = { is_active: true };

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    const collections = await models.Collection.findAll({
      where,
      include: [{
        model: models.Trip,
        as: 'trips',
        where: { is_active: true },
        required: false,
        attributes: ['id', 'slug', 'title', 'hero_image_url', 'price_from', 'currency', 'duration_days'],
        limit: 6,
      }],
      order: [['display_order', 'ASC']],
      limit: 100,
    });

    // Get locale and transform fields
    const locale = getLocaleFromRequest(req);
    const transformedCollections = collections.map(collection => {
      const collectionData = collection.toJSON();
      const transformed = transformLocalizedFields(collectionData, ['title', 'description'], locale);
      // Transform trips if they exist
      if (transformed.trips && Array.isArray(transformed.trips)) {
        transformed.trips = transformed.trips.map(trip => {
          return transformLocalizedFields(trip, ['title', 'description', 'short_description'], locale);
        });
      }
      return transformed;
    });

    res.json({ success: true, data: transformedCollections });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch collections' } });
  }
};

const getCollectionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const collection = await models.Collection.findOne({
      where: { slug, is_active: true },
      include: [{
        model: models.Trip,
        as: 'trips',
        where: { is_active: true },
        required: false,
        include: [
          { model: models.Country, as: 'country', attributes: ['name', 'code'] },
          { model: models.TripImage, as: 'images', attributes: ['image_url'], limit: 1 },
        ],
      }],
    });

    if (!collection) {
      return res.status(404).json({ success: false, error: { message: 'Collection not found' } });
    }

    // Get locale and transform fields
    const locale = getLocaleFromRequest(req);
    const collectionData = collection.toJSON();
    const transformedCollection = transformLocalizedFields(collectionData, ['title', 'description'], locale);
    
    // Transform trips if they exist
    if (transformedCollection.trips && Array.isArray(transformedCollection.trips)) {
      transformedCollection.trips = transformedCollection.trips.map(trip => {
        return transformLocalizedFields(trip, ['title', 'description', 'short_description'], locale);
      });
    }

    res.json({ success: true, data: transformedCollection });
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch collection' } });
  }
};

module.exports = { getAllCollections, getCollectionBySlug };

