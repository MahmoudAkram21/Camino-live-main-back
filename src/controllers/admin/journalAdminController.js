const models = require('../../models');
const { Op } = require('sequelize');
const slugify = require('slugify');

// Get all articles with pagination and filters
const getAllArticles = async (req, res) => {
  try {
    const {
      search,
      status, // 'published', 'draft', 'all'
      category,
      author,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query;

    const where = {};

    if (status === 'published') where.is_published = true;
    else if (status === 'draft') where.is_published = false;

    if (category) where.category = category;
    if (author) where.author_id = parseInt(author);

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await models.JournalArticle.findAndCountAll({
      where,
      include: [
        { model: models.User, as: 'author', attributes: ['id', 'name', 'email'] },
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
    console.error('Error fetching articles (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch articles',
        details: error.message,
      },
    });
  }
};

// Get article by ID
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await models.JournalArticle.findByPk(id, {
      include: [
        { model: models.User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: models.User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Article not found',
        },
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Error fetching article (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch article',
        details: error.message,
      },
    });
  }
};

// Create new article
const createArticle = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      image_url,
      author_id,
      author_name,
      category,
      is_featured = false,
      is_published = false,
      meta_title,
      meta_description,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Title and content are required',
        },
      });
    }

    let slug = slugify(title, { lower: true, strict: true });
    let existingArticle = await models.JournalArticle.findOne({ where: { slug } });
    let counter = 1;
    while (existingArticle) {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
      existingArticle = await models.JournalArticle.findOne({ where: { slug } });
      counter++;
    }

    // Get author name if author_id is provided
    let finalAuthorName = author_name;
    if (author_id && !author_name) {
      const author = await models.User.findByPk(author_id);
      if (author) finalAuthorName = author.name;
    } else if (!author_id && !author_name) {
      finalAuthorName = req.user.name;
    }

    const article = await models.JournalArticle.create({
      slug,
      title,
      excerpt,
      content,
      image_url,
      author_id: author_id ? parseInt(author_id) : req.user.id,
      author_name: finalAuthorName,
      category: category || null,
      is_featured: Boolean(is_featured),
      is_published: Boolean(is_published),
      published_at: Boolean(is_published) ? new Date() : null,
      meta_title: meta_title || title,
      meta_description: meta_description || excerpt || content?.substring(0, 160),
      created_by: req.user.id,
    });

    const createdArticle = await models.JournalArticle.findByPk(article.id, {
      include: [
        { model: models.User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: models.User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: createdArticle,
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create article',
        details: error.message,
      },
    });
  }
};

// Update article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      image_url,
      author_id,
      author_name,
      category,
      is_featured,
      is_published,
      meta_title,
      meta_description,
    } = req.body;

    const article = await models.JournalArticle.findByPk(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Article not found',
        },
      });
    }

    // Update slug if title changed
    if (title && title !== article.title) {
      let slug = slugify(title, { lower: true, strict: true });
      let existingArticle = await models.JournalArticle.findOne({
        where: { slug, id: { [Op.ne]: id } },
      });
      let counter = 1;
      while (existingArticle) {
        slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
        existingArticle = await models.JournalArticle.findOne({
          where: { slug, id: { [Op.ne]: id } },
        });
        counter++;
      }
      article.slug = slug;
    }

    if (title !== undefined) article.title = title;
    if (excerpt !== undefined) article.excerpt = excerpt;
    if (content !== undefined) article.content = content;
    if (image_url !== undefined) article.image_url = image_url;
    if (author_id !== undefined) article.author_id = author_id ? parseInt(author_id) : null;
    if (author_name !== undefined) article.author_name = author_name;
    if (category !== undefined) article.category = category;
    if (is_featured !== undefined) article.is_featured = Boolean(is_featured);

    // Handle publish status
    if (is_published !== undefined) {
      const wasPublished = article.is_published;
      article.is_published = Boolean(is_published);
      // Set published_at when first published
      if (!wasPublished && article.is_published && !article.published_at) {
        article.published_at = new Date();
      }
    }

    if (meta_title !== undefined) article.meta_title = meta_title;
    if (meta_description !== undefined) article.meta_description = meta_description;

    await article.save();

    const updatedArticle = await models.JournalArticle.findByPk(id, {
      include: [
        { model: models.User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: models.User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: updatedArticle,
    });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update article',
        details: error.message,
      },
    });
  }
};

// Toggle publish status
const togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;

    const article = await models.JournalArticle.findByPk(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Article not found',
        },
      });
    }

    const newPublishedStatus = is_published !== undefined ? Boolean(is_published) : !article.is_published;
    article.is_published = newPublishedStatus;

    // Set published_at when first published
    if (newPublishedStatus && !article.published_at) {
      article.published_at = new Date();
    }

    await article.save();

    res.json({
      success: true,
      message: `Article ${newPublishedStatus ? 'published' : 'unpublished'} successfully`,
      data: article,
    });
  } catch (error) {
    console.error('Error toggling publish status:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to toggle publish status',
        details: error.message,
      },
    });
  }
};

// Delete article
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard = false } = req.query;

    const article = await models.JournalArticle.findByPk(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Article not found',
        },
      });
    }

    if (hard === 'true' || hard === true) {
      await article.destroy();
      res.json({
        success: true,
        message: 'Article permanently deleted',
      });
    } else {
      // Soft delete - unpublish
      article.is_published = false;
      await article.save();
      res.json({
        success: true,
        message: 'Article unpublished successfully',
      });
    }
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete article',
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  togglePublish,
};

