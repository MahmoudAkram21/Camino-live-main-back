const models = require('../models');
const { Op } = require('sequelize');
const { getLocaleFromRequest, transformLocalizedFields } = require('../utils/localeHelper');

const getAllFAQs = async (req, res) => {
  try {
    const { category } = req.query;
    const where = { is_active: true };
    
    if (category) where.category = category;

    const faqs = await models.FAQ.findAll({
      where,
      order: [['display_order', 'ASC'], ['category', 'ASC']],
    });

    // Get locale and transform fields
    const locale = getLocaleFromRequest(req);
    const transformedFAQs = faqs.map(faq => {
      const faqData = faq.toJSON();
      return transformLocalizedFields(faqData, ['question', 'answer'], locale);
    });

    res.json({ success: true, data: transformedFAQs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch FAQs' } });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await models.FAQ.findAll({
      attributes: ['category'],
      where: { is_active: true, category: { [Op.ne]: null } },
      group: ['category'],
      raw: true,
    });

    const uniqueCategories = [...new Set(categories.map(c => c.category))];

    res.json({ success: true, data: uniqueCategories });
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch categories' } });
  }
};

module.exports = { getAllFAQs, getCategories };

