const models = require('../../models');
const { Op } = require('sequelize');
const slugify = require('slugify');

// Get all destinations with pagination
const getAllDestinations = async (req, res) => {
  try {
    const {
      search,
      country_id,
      region,
      status, // 'active', 'inactive', 'all'
      page = 1,
      limit = 20,
      sortBy = 'display_order',
      sortOrder = 'ASC',
    } = req.query;

    const where = {};

    if (status === 'active') where.is_active = true;
    else if (status === 'inactive') where.is_active = false;

    if (country_id) where.country_id = parseInt(country_id);
    if (region) where.region = region;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await models.Destination.findAndCountAll({
      where,
      include: [
        { model: models.Country, as: 'country', attributes: ['id', 'name', 'code'] },
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
    console.error('Error fetching destinations (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch destinations',
        details: error.message,
      },
    });
  }
};

// Get destination by ID
const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await models.Destination.findByPk(id, {
      include: [
        { model: models.Country, as: 'country' },
      ],
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Destination not found',
        },
      });
    }

    res.json({
      success: true,
      data: destination,
    });
  } catch (error) {
    console.error('Error fetching destination (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch destination',
        details: error.message,
      },
    });
  }
};

// Create new destination
const createDestination = async (req, res) => {
  try {
    const {
      name,
      country_id,
      region,
      description,
      image_url,
      coordinates_lat,
      coordinates_lng,
      is_featured = false,
      is_active = true,
      display_order = 0,
      meta_title,
      meta_description,
    } = req.body;

    if (!name || !country_id) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Name and country_id are required',
        },
      });
    }

    // Verify country exists
    const country = await models.Country.findByPk(country_id);
    if (!country) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Country not found',
        },
      });
    }

    let slug = slugify(name, { lower: true, strict: true });
    let existingDestination = await models.Destination.findOne({ where: { slug } });
    let counter = 1;
    while (existingDestination) {
      slug = `${slugify(name, { lower: true, strict: true })}-${counter}`;
      existingDestination = await models.Destination.findOne({ where: { slug } });
      counter++;
    }

    const destination = await models.Destination.create({
      slug,
      name,
      country_id: parseInt(country_id),
      region: region || country.region,
      description,
      image_url,
      coordinates_lat: coordinates_lat ? parseFloat(coordinates_lat) : null,
      coordinates_lng: coordinates_lng ? parseFloat(coordinates_lng) : null,
      is_featured: Boolean(is_featured),
      is_active: Boolean(is_active),
      display_order: parseInt(display_order) || 0,
      meta_title: meta_title || name,
      meta_description: meta_description || description?.substring(0, 160),
    });

    const createdDestination = await models.Destination.findByPk(destination.id, {
      include: [
        { model: models.Country, as: 'country' },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: createdDestination,
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create destination',
        details: error.message,
      },
    });
  }
};

// Update destination
const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      country_id,
      region,
      description,
      image_url,
      coordinates_lat,
      coordinates_lng,
      is_featured,
      is_active,
      display_order,
      meta_title,
      meta_description,
    } = req.body;

    const destination = await models.Destination.findByPk(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Destination not found',
        },
      });
    }

    // Update slug if name changed
    if (name && name !== destination.name) {
      let slug = slugify(name, { lower: true, strict: true });
      let existingDestination = await models.Destination.findOne({
        where: { slug, id: { [Op.ne]: id } },
      });
      let counter = 1;
      while (existingDestination) {
        slug = `${slugify(name, { lower: true, strict: true })}-${counter}`;
        existingDestination = await models.Destination.findOne({
          where: { slug, id: { [Op.ne]: id } },
        });
        counter++;
      }
      destination.slug = slug;
    }

    if (name !== undefined) destination.name = name;
    if (country_id !== undefined) {
      const country = await models.Country.findByPk(country_id);
      if (!country) {
        return res.status(400).json({
          success: false,
          error: { message: 'Country not found' },
        });
      }
      destination.country_id = parseInt(country_id);
    }
    if (region !== undefined) destination.region = region;
    if (description !== undefined) destination.description = description;
    if (image_url !== undefined) destination.image_url = image_url;
    if (coordinates_lat !== undefined) destination.coordinates_lat = coordinates_lat ? parseFloat(coordinates_lat) : null;
    if (coordinates_lng !== undefined) destination.coordinates_lng = coordinates_lng ? parseFloat(coordinates_lng) : null;
    if (is_featured !== undefined) destination.is_featured = Boolean(is_featured);
    if (is_active !== undefined) destination.is_active = Boolean(is_active);
    if (display_order !== undefined) destination.display_order = parseInt(display_order);
    if (meta_title !== undefined) destination.meta_title = meta_title;
    if (meta_description !== undefined) destination.meta_description = meta_description;

    await destination.save();

    const updatedDestination = await models.Destination.findByPk(id, {
      include: [
        { model: models.Country, as: 'country' },
      ],
    });

    res.json({
      success: true,
      message: 'Destination updated successfully',
      data: updatedDestination,
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update destination',
        details: error.message,
      },
    });
  }
};

// Delete destination (soft delete)
const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard = false } = req.query;

    const destination = await models.Destination.findByPk(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Destination not found',
        },
      });
    }

    if (hard === 'true' || hard === true) {
      await destination.destroy();
      res.json({
        success: true,
        message: 'Destination permanently deleted',
      });
    } else {
      destination.is_active = false;
      await destination.save();
      res.json({
        success: true,
        message: 'Destination deactivated successfully',
      });
    }
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete destination',
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllDestinations,
  createDestination,
  getDestinationById,
  updateDestination,
  deleteDestination,
};
