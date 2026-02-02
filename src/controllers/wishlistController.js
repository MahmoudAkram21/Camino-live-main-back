const models = require('../models');
const { Op } = require('sequelize');

// Debug: Log available models
console.log('Available models:', Object.keys(models));

// Add trip to wishlist
const addToWishlist = async (req, res) => {
  try {
    // Check if Wishlist model exists
    if (!models.Wishlist) {
      console.error('Wishlist model not found in models');
      return res.status(500).json({
        success: false,
        error: {
          message: 'Wishlist model not available',
        },
      });
    }

    const { tripId } = req.params;
    const userId = req.user?.id || null;
    const sessionId = req.session?.id || req.headers['x-session-id'] || null;

    // Find trip by ID or slug
    const tripIdNum = parseInt(tripId);
    const trip = !isNaN(tripIdNum) 
      ? await models.Trip.findByPk(tripIdNum)
      : await models.Trip.findOne({ where: { slug: tripId } });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Trip not found',
        },
      });
    }

    const actualTripId = trip.id;

    // Check if already in wishlist
    const existing = await models.Wishlist.findOne({
      where: {
        trip_id: actualTripId,
        [Op.or]: [
          ...(userId ? [{ user_id: userId }] : []),
          ...(sessionId ? [{ session_id: sessionId }] : []),
        ],
      },
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Trip already in wishlist',
        data: existing,
      });
    }

    // Create wishlist entry
    const wishlistItem = await models.Wishlist.create({
      user_id: userId,
      trip_id: actualTripId,
      session_id: sessionId,
    });

    res.status(201).json({
      success: true,
      message: 'Trip added to wishlist',
      data: wishlistItem,
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to add trip to wishlist',
        details: error.message,
      },
    });
  }
};

// Remove trip from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    // Check if Wishlist model exists
    if (!models.Wishlist) {
      console.error('Wishlist model not found in models');
      return res.status(500).json({
        success: false,
        error: {
          message: 'Wishlist model not available',
        },
      });
    }

    const { tripId } = req.params;
    const userId = req.user?.id || null;
    const sessionId = req.session?.id || req.headers['x-session-id'] || null;

    // Find trip by ID or slug
    const tripIdNum = parseInt(tripId);
    const trip = !isNaN(tripIdNum) 
      ? await models.Trip.findByPk(tripIdNum)
      : await models.Trip.findOne({ where: { slug: tripId } });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Trip not found',
        },
      });
    }

    const actualTripId = trip.id;

    const whereClause = {
      trip_id: actualTripId,
      [Op.or]: [
        ...(userId ? [{ user_id: userId }] : []),
        ...(sessionId ? [{ session_id: sessionId }] : []),
      ],
    };

    const deleted = await models.Wishlist.destroy({
      where: whereClause,
    });

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Trip not found in wishlist',
        },
      });
    }

    res.json({
      success: true,
      message: 'Trip removed from wishlist',
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to remove trip from wishlist',
        details: error.message,
      },
    });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.session?.id || req.headers['x-session-id'] || null;

    // Check if Wishlist model exists
    if (!models.Wishlist) {
      console.error('Wishlist model not found in models');
      return res.status(500).json({
        success: false,
        error: {
          message: 'Wishlist model not available',
        },
      });
    }

    const whereClause = {
      [Op.or]: [
        ...(userId ? [{ user_id: userId }] : []),
        ...(sessionId ? [{ session_id: sessionId }] : []),
      ],
    };

    // If no user or session, return empty array
    if (!userId && !sessionId) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const wishlistItems = await models.Wishlist.findAll({
      where: whereClause,
      include: [
        {
          model: models.Trip,
          as: 'trip',
          include: [
            { model: models.Country, as: 'country', attributes: ['id', 'name', 'code'] },
            { model: models.Collection, as: 'collection', attributes: ['id', 'slug', 'title'] },
            { 
              model: models.TripImage, 
              as: 'images', 
              attributes: ['id', 'image_url', 'image_alt', 'display_order', 'is_hero'],
              order: [['display_order', 'ASC']],
              limit: 1,
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: wishlistItems,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch wishlist',
        details: error.message,
      },
    });
  }
};

// Check if trip is in wishlist
const checkWishlistStatus = async (req, res) => {
  try {
    // Check if Wishlist model exists
    if (!models.Wishlist) {
      console.error('Wishlist model not found in models');
      return res.status(500).json({
        success: false,
        error: {
          message: 'Wishlist model not available',
        },
      });
    }

    const { tripId } = req.params;
    const userId = req.user?.id || null;
    const sessionId = req.session?.id || req.headers['x-session-id'] || null;

    // Find trip by ID or slug
    const tripIdNum = parseInt(tripId);
    const trip = !isNaN(tripIdNum) 
      ? await models.Trip.findByPk(tripIdNum)
      : await models.Trip.findOne({ where: { slug: tripId } });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Trip not found',
        },
      });
    }

    const actualTripId = trip.id;

    const wishlistItem = await models.Wishlist.findOne({
      where: {
        trip_id: actualTripId,
        [Op.or]: [
          ...(userId ? [{ user_id: userId }] : []),
          ...(sessionId ? [{ session_id: sessionId }] : []),
        ],
      },
    });

    res.json({
      success: true,
      data: {
        isInWishlist: !!wishlistItem,
      },
    });
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to check wishlist status',
        details: error.message,
      },
    });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus,
};

