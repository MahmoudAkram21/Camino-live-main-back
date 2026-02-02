const models = require('../../models');
const { Op } = require('sequelize');

// Get all bookings with filters
const getAllBookings = async (req, res) => {
  try {
    const {
      search,
      status,
      payment_status,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query;

    const where = {};

    if (status) where.status = status;
    if (payment_status) where.payment_status = payment_status;

    if (search) {
      where[Op.or] = [
        { booking_reference: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await models.Booking.findAndCountAll({
      where,
      include: [
        {
          model: models.Trip,
          as: 'trip',
          attributes: ['id', 'slug', 'title', 'hero_image_url', 'duration_days'],
        },
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
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
    console.error('Error fetching bookings (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch bookings',
        details: error.message,
      },
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await models.Booking.findByPk(id, {
      include: [
        {
          model: models.Trip,
          as: 'trip',
        },
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { message: 'Booking not found' },
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch booking',
        details: error.message,
      },
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const booking = await models.Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { message: 'Booking not found' },
      });
    }

    // Update status if provided
    if (status && ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      booking.status = status;
    }

    // Update payment status if provided
    if (payment_status && ['pending', 'paid', 'failed', 'refunded'].includes(payment_status)) {
      booking.payment_status = payment_status;
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Error updating booking (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update booking',
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
};

