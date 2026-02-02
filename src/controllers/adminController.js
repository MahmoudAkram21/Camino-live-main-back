const models = require('../models');
const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalTrips,
      activeTrips,
      totalCollections,
      totalDestinations,
      totalArticles,
      publishedArticles,
      totalReviews,
      approvedReviews,
      totalUsers,
      totalBookings,
    ] = await Promise.all([
      models.Trip.count(),
      models.Trip.count({ where: { is_active: true } }),
      models.Collection.count({ where: { is_active: true } }),
      models.Destination.count({ where: { is_active: true } }),
      models.JournalArticle.count(),
      models.JournalArticle.count({ where: { is_published: true } }),
      models.Review.count(),
      models.Review.count({ where: { is_approved: true } }),
      models.User.count(),
      models.BookingDraft.count(),
    ]);

    // Get recent bookings
    const recentBookings = await models.BookingDraft.findAll({
      include: [
        { model: models.Trip, as: 'trip', attributes: ['id', 'title', 'slug'] },
        { model: models.User, as: 'user', attributes: ['id', 'name', 'email'], required: false },
      ],
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    // Get recent contact leads
    const recentLeads = await models.ContactLead.findAll({
      where: { status: 'new' },
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    // Format recent activity
    const recentActivity = [];
    
    // Add recent bookings to activity
    recentBookings.forEach((booking) => {
      const tripTitle = booking.trip && booking.trip.title ? booking.trip.title : 'Unknown Trip';
      const createdAt = booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '';
      recentActivity.push({
        type: 'New Booking',
        description: `Booking for trip: ${tripTitle}`,
        time: createdAt,
      });
    });

    // Add recent leads to activity
    recentLeads.forEach((lead) => {
      const leadName = lead.name || lead.email || 'Unknown';
      const createdAt = lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '';
      recentActivity.push({
        type: 'New Contact Lead',
        description: `Contact from: ${leadName}`,
        time: createdAt,
      });
    });

    // Sort by time (most recent first)
    recentActivity.sort((a, b) => {
      if (!a.time || !b.time) return 0;
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    res.json({
      success: true,
      data: {
        trips: {
          total: totalTrips,
          active: activeTrips,
        },
        collections: {
          total: totalCollections,
          active: totalCollections,
        },
        destinations: {
          total: totalDestinations,
          active: totalDestinations,
        },
        journal: {
          total: totalArticles,
          published: publishedArticles,
        },
        reviews: {
          total: totalReviews,
          approved: approvedReviews,
        },
        users: {
          total: totalUsers,
          active: totalUsers,
        },
        bookings: {
          total: totalBookings,
        },
        recentActivity: recentActivity.slice(0, 10), // Limit to 10 most recent
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch dashboard statistics' },
    });
  }
};

const getTripsStats = async (req, res) => {
  try {
    const stats = await models.Trip.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.col('views_count')), 'totalViews'],
        [sequelize.fn('AVG', sequelize.col('price_from')), 'avgPrice'],
      ],
      where: { is_active: true },
      raw: true,
    });

    const byRegion = await models.Trip.findAll({
      attributes: [
        'region',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: { is_active: true, region: { [Sequelize.Op.ne]: null } },
      group: ['region'],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        overview: stats[0] || { total: 0, totalViews: 0, avgPrice: 0 },
        byRegion,
      },
    });
  } catch (error) {
    console.error('Error fetching trips stats:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch trips statistics' },
    });
  }
};

const getBookingsStats = async (req, res) => {
  try {
    const stats = await models.BookingDraft.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    const total = await models.BookingDraft.count();

    res.json({
      success: true,
      data: {
        total,
        byStatus: stats,
      },
    });
  } catch (error) {
    console.error('Error fetching bookings stats:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch bookings statistics' },
    });
  }
};

const getUsersStats = async (req, res) => {
  try {
    const stats = await models.User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['role'],
      raw: true,
    });

    const total = await models.User.count();

    res.json({
      success: true,
      data: {
        total,
        byRole: stats,
      },
    });
  } catch (error) {
    console.error('Error fetching users stats:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch users statistics' },
    });
  }
};

module.exports = {
  getDashboardStats,
  getTripsStats,
  getBookingsStats,
  getUsersStats,
};

