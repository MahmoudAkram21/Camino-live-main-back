const models = require('../../models');
const { Op } = require('sequelize');

// Get all reviews with pagination and filters
const getAllReviews = async (req, res) => {
  try {
    const {
      search,
      trip_id,
      status, // 'approved', 'pending', 'all'
      rating,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query;

    const where = {};

    if (status === 'approved') where.is_approved = true;
    else if (status === 'pending') where.is_approved = false;

    if (trip_id) where.trip_id = parseInt(trip_id);
    if (rating) where.rating = parseInt(rating);

    if (search) {
      where[Op.or] = [
        { author_name: { [Op.like]: `%${search}%` } },
        { comment: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await models.Review.findAndCountAll({
      where,
      include: [
        { model: models.Trip, as: 'trip', attributes: ['id', 'title', 'slug'] },
        { model: models.User, as: 'user', attributes: ['id', 'name', 'email'] },
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
    console.error('Error fetching reviews (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch reviews',
        details: error.message,
      },
    });
  }
};

// Approve review
const approveReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await models.Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Review not found',
        },
      });
    }

    review.is_approved = true;
    await review.save();

    const updatedReview = await models.Review.findByPk(id, {
      include: [
        { model: models.Trip, as: 'trip', attributes: ['id', 'title', 'slug'] },
        { model: models.User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json({
      success: true,
      message: 'Review approved successfully',
      data: updatedReview,
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to approve review',
        details: error.message,
      },
    });
  }
};

// Reject review
const rejectReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await models.Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Review not found',
        },
      });
    }

    review.is_approved = false;
    await review.save();

    const updatedReview = await models.Review.findByPk(id, {
      include: [
        { model: models.Trip, as: 'trip', attributes: ['id', 'title', 'slug'] },
        { model: models.User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json({
      success: true,
      message: 'Review rejected successfully',
      data: updatedReview,
    });
  } catch (error) {
    console.error('Error rejecting review:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to reject review',
        details: error.message,
      },
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await models.Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Review not found',
        },
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete review',
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
};
