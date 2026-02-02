const models = require('../../models');
const { Op } = require('sequelize');

// Get all FAQs with pagination
const getAllFAQs = async (req, res) => {
  try {
    const {
      search,
      category,
      status, // 'active', 'inactive', 'all'
      page = 1,
      limit = 20,
      sortBy = 'display_order',
      sortOrder = 'ASC',
    } = req.query;

    const where = {};

    if (status === 'active') where.is_active = true;
    else if (status === 'inactive') where.is_active = false;

    if (category) where.category = category;

    if (search) {
      where[Op.or] = [
        { question: { [Op.like]: `%${search}%` } },
        { answer: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await models.FAQ.findAndCountAll({
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
    console.error('Error fetching FAQs (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch FAQs',
        details: error.message,
      },
    });
  }
};

// Get FAQ by ID
const getFAQById = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await models.FAQ.findByPk(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'FAQ not found',
        },
      });
    }

    res.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error('Error fetching FAQ (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch FAQ',
        details: error.message,
      },
    });
  }
};

// Create new FAQ
const createFAQ = async (req, res) => {
  try {
    const {
      question,
      answer,
      category,
      display_order = 0,
      is_active = true,
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Question and answer are required',
        },
      });
    }

    const faq = await models.FAQ.create({
      question,
      answer,
      category: category || null,
      display_order: parseInt(display_order) || 0,
      is_active: Boolean(is_active),
    });

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create FAQ',
        details: error.message,
      },
    });
  }
};

// Update FAQ
const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      question,
      answer,
      category,
      display_order,
      is_active,
    } = req.body;

    const faq = await models.FAQ.findByPk(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'FAQ not found',
        },
      });
    }

    if (question !== undefined) faq.question = question;
    if (answer !== undefined) faq.answer = answer;
    if (category !== undefined) faq.category = category;
    if (display_order !== undefined) faq.display_order = parseInt(display_order);
    if (is_active !== undefined) faq.is_active = Boolean(is_active);

    await faq.save();

    res.json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq,
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update FAQ',
        details: error.message,
      },
    });
  }
};

// Delete FAQ
const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard = false } = req.query;

    const faq = await models.FAQ.findByPk(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'FAQ not found',
        },
      });
    }

    if (hard === 'true' || hard === true) {
      await faq.destroy();
      res.json({
        success: true,
        message: 'FAQ permanently deleted',
      });
    } else {
      faq.is_active = false;
      await faq.save();
      res.json({
        success: true,
        message: 'FAQ deactivated successfully',
      });
    }
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete FAQ',
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllFAQs,
  createFAQ,
  getFAQById,
  updateFAQ,
  deleteFAQ,
};
