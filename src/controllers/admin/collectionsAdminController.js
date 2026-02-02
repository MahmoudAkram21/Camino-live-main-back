const models = require('../../models');
const { Op } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../../config/database');

// Get all collections with pagination
const getAllCollections = async (req, res) => {
  try {
    const {
      search,
      status, // 'active', 'inactive', 'all'
      page = 1,
      limit = 20,
      sortBy = 'display_order',
      sortOrder = 'ASC',
    } = req.query;

    const where = {};

    if (status === 'active') where.is_active = true;
    else if (status === 'inactive') where.is_active = false;

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await models.Collection.findAndCountAll({
      where,
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
    console.error('Error fetching collections (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch collections',
        details: error.message,
      },
    });
  }
};

// Get collection by ID
const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await models.Collection.findByPk(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Collection not found',
        },
      });
    }

    res.json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error('Error fetching collection (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch collection',
        details: error.message,
      },
    });
  }
};

// Create new collection
const createCollection = async (req, res) => {
  try {
    const {
      title,
      description,
      short_description,
      image_url,
      display_order = 0,
      is_active = true,
      meta_title,
      meta_description,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Title is required',
        },
      });
    }

    let slug = slugify(title, { lower: true, strict: true });
    let existingCollection = await models.Collection.findOne({ where: { slug } });
    let counter = 1;
    while (existingCollection) {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
      existingCollection = await models.Collection.findOne({ where: { slug } });
      counter++;
    }

    const collection = await models.Collection.create({
      slug,
      title,
      description,
      short_description,
      image_url,
      display_order: parseInt(display_order) || 0,
      is_active: Boolean(is_active),
      meta_title: meta_title || title,
      meta_description: meta_description || short_description || description?.substring(0, 160),
    });

    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: collection,
    });
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create collection',
        details: error.message,
      },
    });
  }
};

// Update collection
const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      short_description,
      image_url,
      display_order,
      is_active,
      meta_title,
      meta_description,
    } = req.body;

    const collection = await models.Collection.findByPk(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Collection not found',
        },
      });
    }

    // Update slug if title changed
    if (title && title !== collection.title) {
      let slug = slugify(title, { lower: true, strict: true });
      let existingCollection = await models.Collection.findOne({
        where: { slug, id: { [Op.ne]: id } },
      });
      let counter = 1;
      while (existingCollection) {
        slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
        existingCollection = await models.Collection.findOne({
          where: { slug, id: { [Op.ne]: id } },
        });
        counter++;
      }
      collection.slug = slug;
    }

    if (title !== undefined) collection.title = title;
    if (description !== undefined) collection.description = description;
    if (short_description !== undefined) collection.short_description = short_description;
    if (image_url !== undefined) collection.image_url = image_url;
    if (display_order !== undefined) collection.display_order = parseInt(display_order);
    if (is_active !== undefined) collection.is_active = Boolean(is_active);
    if (meta_title !== undefined) collection.meta_title = meta_title;
    if (meta_description !== undefined) collection.meta_description = meta_description;

    await collection.save();

    res.json({
      success: true,
      message: 'Collection updated successfully',
      data: collection,
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update collection',
        details: error.message,
      },
    });
  }
};

// Delete collection (soft delete)
const deleteCollection = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { hard = false } = req.query;

    const collection = await models.Collection.findByPk(id, { transaction });

    if (!collection) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: {
          message: 'Collection not found',
        },
      });
    }

    // Check if collection has trips
    const tripsCount = await models.Trip.count({
      where: { collection_id: id },
      transaction,
    });

    if (tripsCount > 0 && hard !== 'true' && hard !== true) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: {
          message: `Cannot delete collection with ${tripsCount} associated trip(s). Set ?hard=true to force delete.`,
        },
      });
    }

    if (hard === 'true' || hard === true) {
      // Unlink trips from collection
      await models.Trip.update(
        { collection_id: null },
        { where: { collection_id: id }, transaction }
      );
      await collection.destroy({ transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: 'Collection permanently deleted',
      });
    } else {
      collection.is_active = false;
      await collection.save({ transaction });
      await transaction.commit();
      
      res.json({
        success: true,
        message: 'Collection deactivated successfully',
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting collection:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete collection',
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllCollections,
  createCollection,
  getCollectionById,
  updateCollection,
  deleteCollection,
};

