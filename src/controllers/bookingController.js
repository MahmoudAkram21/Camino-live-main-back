const models = require('../models');
const { Op } = require('sequelize');

// Generate unique booking reference
function generateBookingReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'CAM';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User must be logged in to create a booking' },
      });
    }

    const {
      trip_id,
      start_date,
      start_from,
      people,
      rooms,
      total_price,
      currency,
      payment_method,
      booking_data,
      customer_info,
    } = req.body;

    if (!trip_id || !total_price) {
      return res.status(400).json({
        success: false,
        error: { message: 'trip_id and total_price are required' },
      });
    }

    // Verify trip exists
    const trip = await models.Trip.findByPk(trip_id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        error: { message: 'Trip not found' },
      });
    }

    // Generate unique booking reference
    let bookingReference;
    let isUnique = false;
    while (!isUnique) {
      bookingReference = generateBookingReference();
      const existing = await models.Booking.findOne({
        where: { booking_reference: bookingReference },
      });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create booking
    const booking = await models.Booking.create({
      trip_id,
      user_id: userId,
      booking_reference: bookingReference,
      start_date: start_date || null,
      start_from: start_from || null,
      people: people || 2,
      rooms: rooms || 1,
      total_price,
      currency: currency || trip.currency || 'EUR',
      payment_method: payment_method || 'cash_on_delivery',
      payment_status: 'pending',
      status: 'pending',
      booking_data: booking_data || null,
      customer_info: customer_info || null,
    });

    // Increment booking count on trip
    await trip.increment('booking_count');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create booking', details: error.message },
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User must be logged in' },
      });
    }

    const bookings = await models.Booking.findAll({
      where: { user_id: userId },
      include: [
        {
          model: models.Trip,
          as: 'trip',
          attributes: ['id', 'slug', 'title', 'hero_image_url', 'duration_days', 'price_from', 'currency'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch bookings', details: error.message },
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const booking = await models.Booking.findOne({
      where: {
        id,
        user_id: userId, // Ensure user can only access their own bookings
      },
      include: [
        {
          model: models.Trip,
          as: 'trip',
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
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch booking', details: error.message },
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
};

