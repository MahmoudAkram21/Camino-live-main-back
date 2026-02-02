const models = require('../../models');
const { Op } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../../config/database');

// Get all trips with pagination and filters (Admin view - includes inactive)
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
      status, // 'active', 'inactive', 'all'
      search,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query;

    const where = {};

    // Status filter
    if (status === 'active') where.is_active = true;
    else if (status === 'inactive') where.is_active = false;
    // If status is 'all' or not provided, show all

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    // Apply other filters
    if (region) where.region = region;
    if (pace) where.pace = pace;
    if (collection) {
      const collectionRecord = await models.Collection.findOne({ where: { slug: collection } });
      if (collectionRecord) where.collection_id = collectionRecord.id;
    }
    if (country) {
      const countryRecord = await models.Country.findOne({ where: { name: country } });
      if (countryRecord) where.country_id = countryRecord.id;
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
        { model: models.TripImage, as: 'images', attributes: ['id', 'image_url', 'display_order'], limit: 1 },
        { model: models.User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching trips (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch trips',
        details: error.message,
      },
    });
  }
};

// Get single trip by ID (Admin view - includes inactive)
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await models.Trip.findByPk(id, {
      include: [
        { model: models.Country, as: 'country' },
        { model: models.Collection, as: 'collection' },
        {
          model: models.TripImage,
          as: 'images',
          order: [['display_order', 'ASC']],
        },
        {
          model: models.TripStop,
          as: 'stops',
          order: [['display_order', 'ASC']],
        },
        { model: models.User, as: 'creator', attributes: ['id', 'name', 'email'] },
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

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error('Error fetching trip (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch trip',
        details: error.message,
      },
    });
  }
};

// Create new trip with stops and images
const createTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      title,
      title_en,
      title_ar,
      description,
      description_en,
      description_ar,
      short_description,
      short_description_en,
      short_description_ar,
      hero_image_url,
      price_from,
      currency = 'EUR',
      duration_days,
      region,
      country_id,
      pace,
      collection_id,
      co2_emissions,
      co2_unit = 'kg',
      route_cities,
      included_items,
      practical_info,
      is_featured = false,
      is_trending = false,
      is_active = true,
      display_order = 0,
      meta_title,
      meta_title_en,
      meta_title_ar,
      meta_description,
      meta_description_en,
      meta_description_ar,
      stops = [],
      images = [],
    } = req.body;

    // Validate required fields
    if (!title || !price_from || !duration_days) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: {
          message: 'Missing required fields: title, price_from, duration_days',
        },
      });
    }

    // Generate slug from title
    let slug = slugify(title, { lower: true, strict: true });
    
    // Ensure unique slug
    let existingTrip = await models.Trip.findOne({ where: { slug }, transaction });
    let counter = 1;
    const maxAttempts = 1000; // Prevent infinite loop
    while (existingTrip && counter < maxAttempts) {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
      existingTrip = await models.Trip.findOne({ where: { slug }, transaction });
      counter++;
    }
    if (counter >= maxAttempts) {
      throw new Error('Failed to generate unique slug after maximum attempts');
    }

    // Create trip
    const trip = await models.Trip.create({
      slug,
      title: title || title_en || title_ar || '',
      title_en: title_en || '',
      title_ar: title_ar || '',
      description: description || description_en || description_ar || '',
      description_en: description_en || '',
      description_ar: description_ar || '',
      short_description: short_description || short_description_en || short_description_ar || '',
      short_description_en: short_description_en || '',
      short_description_ar: short_description_ar || '',
      hero_image_url: hero_image_url || (images.length > 0 ? images[0].image_url : null),
      price_from: parseFloat(price_from),
      currency,
      duration_days: parseInt(duration_days),
      region,
      country_id: country_id ? parseInt(country_id) : null,
      pace,
      collection_id: collection_id ? parseInt(collection_id) : null,
      co2_emissions: co2_emissions ? parseFloat(co2_emissions) : null,
      co2_unit,
      route_cities: Array.isArray(route_cities) ? route_cities : [],
      included_items: Array.isArray(included_items) ? included_items : [],
      practical_info: practical_info || {},
      is_featured: Boolean(is_featured),
      is_trending: Boolean(is_trending),
      is_active: Boolean(is_active),
      display_order: parseInt(display_order) || 0,
      meta_title: meta_title || meta_title_en || meta_title_ar || title,
      meta_title_en: meta_title_en || '',
      meta_title_ar: meta_title_ar || '',
      meta_description: meta_description || meta_description_en || meta_description_ar || short_description || description?.substring(0, 160),
      meta_description_en: meta_description_en || '',
      meta_description_ar: meta_description_ar || '',
      created_by: req.user.id,
    }, { transaction });

    // Create stops if provided
    if (Array.isArray(stops) && stops.length > 0) {
      const stopsData = stops.map((stop, index) => {
        // Normalize recommendations - ensure it's an array of objects with text property
        let recommendations = null;
        if (stop.recommendations) {
          if (Array.isArray(stop.recommendations) && stop.recommendations.length > 0) {
            // Filter out empty recommendations and ensure format
            const validRecs = stop.recommendations
              .map((rec) => {
                if (typeof rec === 'string' && rec.trim()) {
                  return { text: rec.trim() };
                } else if (rec && typeof rec === 'object' && rec.text && rec.text.trim()) {
                  return { text: rec.text.trim() };
                }
                return null;
              })
              .filter((rec) => rec !== null);
            
            if (validRecs.length > 0) {
              recommendations = validRecs;
            }
          }
        }
        
        return {
          trip_id: trip.id,
          city: stop.city || stop.city_en || stop.city_ar || '',
          city_en: stop.city_en || '',
          city_ar: stop.city_ar || '',
          country: stop.country || null,
          nights: parseInt(stop.nights) || 0,
          display_order: stop.display_order !== undefined ? parseInt(stop.display_order) : index,
          coordinates_lat: stop.coordinates_lat ? parseFloat(stop.coordinates_lat) : null,
          coordinates_lng: stop.coordinates_lng ? parseFloat(stop.coordinates_lng) : null,
          description: stop.description || stop.description_en || stop.description_ar || null,
          description_en: stop.description_en || '',
          description_ar: stop.description_ar || '',
          image_url: stop.image_url || null,
          transport_type: stop.transport_type || null,
          departure_time: stop.departure_time || null,
          arrival_time: stop.arrival_time || null,
          duration: stop.duration || null,
          date_range: stop.date_range || null,
          travel_class: stop.travel_class || null,
          stay_date_range: stop.stay_date_range || null,
          recommendations: recommendations,
        };
      });
      
      await models.TripStop.bulkCreate(stopsData, { transaction });
    }

    // Create images if provided
    if (Array.isArray(images) && images.length > 0) {
      const imagesData = images.map((image, index) => ({
        trip_id: trip.id,
        image_url: image.image_url || image,
        image_alt: image.image_alt || title,
        display_order: image.display_order !== undefined ? parseInt(image.display_order) : index,
        is_hero: index === 0 || Boolean(image.is_hero),
      }));
      
      await models.TripImage.bulkCreate(imagesData, { transaction });
    }

    await transaction.commit();

    // Fetch complete trip with relations
    const createdTrip = await models.Trip.findByPk(trip.id, {
      include: [
        { model: models.Country, as: 'country' },
        { model: models.Collection, as: 'collection' },
        { model: models.TripImage, as: 'images', order: [['display_order', 'ASC']] },
        { model: models.TripStop, as: 'stops', order: [['display_order', 'ASC']] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: createdTrip,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating trip:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create trip',
        details: error.message,
      },
    });
  }
};

// Update trip
const updateTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const {
      title,
      title_en,
      title_ar,
      description,
      description_en,
      description_ar,
      short_description,
      short_description_en,
      short_description_ar,
      hero_image_url,
      price_from,
      currency,
      duration_days,
      region,
      country_id,
      pace,
      collection_id,
      co2_emissions,
      co2_unit,
      route_cities,
      included_items,
      practical_info,
      is_featured,
      is_trending,
      is_active,
      display_order,
      meta_title,
      meta_title_en,
      meta_title_ar,
      meta_description,
      meta_description_en,
      meta_description_ar,
    } = req.body;

    const trip = await models.Trip.findByPk(id, { transaction });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: {
          message: 'Trip not found',
        },
      });
    }

    // Update slug if title changed
    if (title && title !== trip.title) {
      let slug = slugify(title, { lower: true, strict: true });
      let existingTrip = await models.Trip.findOne({
        where: { slug, id: { [Op.ne]: id } },
        transaction,
      });
      let counter = 1;
      const maxAttempts = 1000; // Prevent infinite loop
      while (existingTrip && counter < maxAttempts) {
        slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
        existingTrip = await models.Trip.findOne({
          where: { slug, id: { [Op.ne]: id } },
          transaction,
        });
        counter++;
      }
      if (counter >= maxAttempts) {
        throw new Error('Failed to generate unique slug after maximum attempts');
      }
      trip.slug = slug;
    }

    // Update fields
    if (title !== undefined) trip.title = title || title_en || title_ar || '';
    if (title_en !== undefined) trip.title_en = title_en;
    if (title_ar !== undefined) trip.title_ar = title_ar;
    if (description !== undefined) trip.description = description || description_en || description_ar || '';
    if (description_en !== undefined) trip.description_en = description_en;
    if (description_ar !== undefined) trip.description_ar = description_ar;
    if (short_description !== undefined) trip.short_description = short_description || short_description_en || short_description_ar || '';
    if (short_description_en !== undefined) trip.short_description_en = short_description_en;
    if (short_description_ar !== undefined) trip.short_description_ar = short_description_ar;
    if (hero_image_url !== undefined) trip.hero_image_url = hero_image_url;
    if (price_from !== undefined) trip.price_from = parseFloat(price_from);
    if (currency !== undefined) trip.currency = currency;
    if (duration_days !== undefined) trip.duration_days = parseInt(duration_days);
    if (region !== undefined) trip.region = region;
    if (country_id !== undefined) trip.country_id = country_id ? parseInt(country_id) : null;
    if (pace !== undefined) trip.pace = pace;
    if (collection_id !== undefined) trip.collection_id = collection_id ? parseInt(collection_id) : null;
    if (co2_emissions !== undefined) trip.co2_emissions = co2_emissions ? parseFloat(co2_emissions) : null;
    if (co2_unit !== undefined) trip.co2_unit = co2_unit;
    if (route_cities !== undefined) trip.route_cities = Array.isArray(route_cities) ? route_cities : [];
    if (included_items !== undefined) trip.included_items = Array.isArray(included_items) ? included_items : [];
    if (practical_info !== undefined) trip.practical_info = practical_info || {};
    if (is_featured !== undefined) trip.is_featured = Boolean(is_featured);
    if (is_trending !== undefined) trip.is_trending = Boolean(is_trending);
    if (is_active !== undefined) trip.is_active = Boolean(is_active);
    if (display_order !== undefined) trip.display_order = parseInt(display_order);
    if (meta_title !== undefined) trip.meta_title = meta_title || meta_title_en || meta_title_ar || trip.title;
    if (meta_title_en !== undefined) trip.meta_title_en = meta_title_en;
    if (meta_title_ar !== undefined) trip.meta_title_ar = meta_title_ar;
    if (meta_description !== undefined) trip.meta_description = meta_description || meta_description_en || meta_description_ar || trip.short_description;
    if (meta_description_en !== undefined) trip.meta_description_en = meta_description_en;
    if (meta_description_ar !== undefined) trip.meta_description_ar = meta_description_ar;

    await trip.save({ transaction });
    await transaction.commit();

    // Fetch updated trip with relations
    const updatedTrip = await models.Trip.findByPk(id, {
      include: [
        { model: models.Country, as: 'country' },
        { model: models.Collection, as: 'collection' },
        { model: models.TripImage, as: 'images', order: [['display_order', 'ASC']] },
        { model: models.TripStop, as: 'stops', order: [['display_order', 'ASC']] },
      ],
    });

    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: updatedTrip,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating trip:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update trip',
        details: error.message,
      },
    });
  }
};

// Delete trip (soft delete by setting is_active to false, or hard delete)
const deleteTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { hard = false } = req.query; // ?hard=true for permanent delete

    const trip = await models.Trip.findByPk(id, { transaction });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: {
          message: 'Trip not found',
        },
      });
    }

    if (hard === 'true' || hard === true) {
      // Hard delete - delete related records first
      await models.TripStop.destroy({ where: { trip_id: id }, transaction });
      await models.TripImage.destroy({ where: { trip_id: id }, transaction });
      await models.Review.destroy({ where: { trip_id: id }, transaction });
      await models.BookingDraft.destroy({ where: { trip_id: id }, transaction });
      await trip.destroy({ transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: 'Trip permanently deleted',
      });
    } else {
      // Soft delete
      trip.is_active = false;
      await trip.save({ transaction });
      await transaction.commit();
      
      res.json({
        success: true,
        message: 'Trip deactivated successfully',
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting trip:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete trip',
        details: error.message,
      },
    });
  }
};

// Add images to trip
const addTripImages = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { images } = req.body; // Array of { image_url, image_alt, display_order, is_hero }

    const trip = await models.Trip.findByPk(id, { transaction });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: {
          message: 'Trip not found',
        },
      });
    }

    if (!Array.isArray(images) || images.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: {
          message: 'Images array is required',
        },
      });
    }

    // Get current max display_order
    const maxOrder = await models.TripImage.max('display_order', {
      where: { trip_id: id },
      transaction,
    }) || 0;

    const imagesData = images.map((image, index) => ({
      trip_id: parseInt(id),
      image_url: image.image_url || image,
      image_alt: image.image_alt || trip.title,
      display_order: image.display_order !== undefined ? parseInt(image.display_order) : maxOrder + index + 1,
      is_hero: Boolean(image.is_hero),
    }));

    // If any image is marked as hero, unset others
    if (imagesData.some(img => img.is_hero)) {
      await models.TripImage.update(
        { is_hero: false },
        { where: { trip_id: id, is_hero: true }, transaction }
      );
    }

    const createdImages = await models.TripImage.bulkCreate(imagesData, { transaction });
    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Images added successfully',
      data: createdImages,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error adding trip images:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to add images',
        details: error.message,
      },
    });
  }
};

// Delete trip image
const deleteTripImage = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id, imageId } = req.params;

    const trip = await models.Trip.findByPk(id, { transaction });
    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: {
          message: 'Trip not found',
        },
      });
    }

    const image = await models.TripImage.findOne({
      where: { id: imageId, trip_id: id },
      transaction,
    });

    if (!image) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: {
          message: 'Image not found',
        },
      });
    }

    await image.destroy({ transaction });
    await transaction.commit();

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting trip image:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete image',
        details: error.message,
      },
    });
  }
};

// Update trip stops (replace all stops)
const updateTripStops = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { stops } = req.body; // Array of stops

    const trip = await models.Trip.findByPk(id, { transaction });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: {
          message: 'Trip not found',
        },
      });
    }

    if (!Array.isArray(stops)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: {
          message: 'Stops must be an array',
        },
      });
    }

    // Delete existing stops
    await models.TripStop.destroy({ where: { trip_id: id }, transaction });

    // Create new stops if provided
    if (stops.length > 0) {
      const stopsData = stops.map((stop, index) => {
        // Normalize recommendations - ensure it's an array of objects with text property
        let recommendations = null;
        if (stop.recommendations) {
          if (Array.isArray(stop.recommendations) && stop.recommendations.length > 0) {
            // Filter out empty recommendations and ensure format
            const validRecs = stop.recommendations
              .map((rec) => {
                if (typeof rec === 'string' && rec.trim()) {
                  return { text: rec.trim() };
                } else if (rec && typeof rec === 'object' && rec.text && rec.text.trim()) {
                  return { text: rec.text.trim() };
                }
                return null;
              })
              .filter((rec) => rec !== null);
            
            if (validRecs.length > 0) {
              recommendations = validRecs;
            }
          }
        }
        
        return {
          trip_id: parseInt(id),
          city: stop.city,
          country: stop.country || null,
          nights: parseInt(stop.nights) || 0,
          display_order: stop.display_order !== undefined ? parseInt(stop.display_order) : index,
          coordinates_lat: stop.coordinates_lat ? parseFloat(stop.coordinates_lat) : null,
          coordinates_lng: stop.coordinates_lng ? parseFloat(stop.coordinates_lng) : null,
          description: stop.description || null,
          image_url: stop.image_url || null,
          transport_type: stop.transport_type || null,
          departure_time: stop.departure_time || null,
          arrival_time: stop.arrival_time || null,
          duration: stop.duration || null,
          date_range: stop.date_range || null,
          travel_class: stop.travel_class || null,
          stay_date_range: stop.stay_date_range || null,
          recommendations: recommendations,
        };
      });

      await models.TripStop.bulkCreate(stopsData, { transaction });
    }

    await transaction.commit();

    // Fetch updated stops
    const updatedStops = await models.TripStop.findAll({
      where: { trip_id: id },
      order: [['display_order', 'ASC']],
    });

    res.json({
      success: true,
      message: 'Trip stops updated successfully',
      data: updatedStops,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating trip stops:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update stops',
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllTrips,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
  addTripImages,
  deleteTripImage,
  updateTripStops,
};

