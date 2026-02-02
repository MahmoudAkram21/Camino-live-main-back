const models = require('../models');

const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await models.Review.findAndCountAll({
      where: { is_approved: true },
      include: [
        { model: models.Trip, as: 'trip', attributes: ['id', 'slug', 'title'], required: false },
      ],
      order: [['created_at', 'DESC']],
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
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch reviews' } });
  }
};

const getReviewsByTrip = async (req, res) => {
  try {
    const { tripSlug } = req.params;
    
    const trip = await models.Trip.findOne({ where: { slug: tripSlug } });
    if (!trip) {
      return res.status(404).json({ success: false, error: { message: 'Trip not found' } });
    }

    const reviews = await models.Review.findAll({
      where: { trip_id: trip.id, is_approved: true },
      order: [['created_at', 'DESC']],
      limit: 50,
    });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
      },
    });
  } catch (error) {
    console.error('Error fetching trip reviews:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch reviews' } });
  }
};

module.exports = { getAllReviews, getReviewsByTrip };

