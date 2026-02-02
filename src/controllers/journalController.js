const models = require('../models');
const { Op } = require('sequelize');
const { getLocaleFromRequest, transformLocalizedFields } = require('../utils/localeHelper');

const MAX_PAGE_LIMIT = 50;

const getAllArticles = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, search } = req.query;
    const where = { is_published: true };
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), MAX_PAGE_LIMIT);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);

    if (category) where.category = category;

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (safePage - 1) * safeLimit;

    const { count, rows } = await models.JournalArticle.findAndCountAll({
      where,
      include: [{ model: models.User, as: 'author', attributes: ['id', 'name', 'email'] }],
      order: [['published_at', 'DESC'], ['is_featured', 'DESC']],
      limit: safeLimit,
      offset,
    });

    // Get locale and transform fields
    const locale = getLocaleFromRequest(req);
    const transformedRows = rows.map(article => {
      const articleData = article.toJSON();
      return transformLocalizedFields(articleData, ['title', 'excerpt', 'content'], locale);
    });

    res.json({
      success: true,
      data: transformedRows,
      pagination: {
        total: count,
        page: safePage,
        limit: safeLimit,
        pages: Math.ceil(count / safeLimit),
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch articles' } });
  }
};

const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await models.JournalArticle.findOne({
      where: { slug, is_published: true },
      include: [{ model: models.User, as: 'author', attributes: ['id', 'name', 'email'] }],
    });

    if (!article) {
      return res.status(404).json({ success: false, error: { message: 'Article not found' } });
    }

    await article.increment('views_count');

    // Get locale and transform fields
    const locale = getLocaleFromRequest(req);
    const articleData = article.toJSON();
    const transformedArticle = transformLocalizedFields(articleData, ['title', 'excerpt', 'content'], locale);

    res.json({ success: true, data: transformedArticle });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch article' } });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await models.JournalArticle.findAll({
      attributes: ['category'],
      where: { is_published: true, category: { [Op.ne]: null } },
      group: ['category'],
      raw: true,
    });

    const uniqueCategories = [...new Set(categories.map(c => c.category))];

    res.json({ success: true, data: uniqueCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch categories' } });
  }
};

module.exports = { getAllArticles, getArticleBySlug, getCategories };

