const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const adminController = require('../controllers/adminController');
const tripsAdminController = require('../controllers/admin/tripsAdminController');
const collectionsAdminController = require('../controllers/admin/collectionsAdminController');
const destinationsAdminController = require('../controllers/admin/destinationsAdminController');
const journalAdminController = require('../controllers/admin/journalAdminController');
const faqsAdminController = require('../controllers/admin/faqsAdminController');
const reviewsAdminController = require('../controllers/admin/reviewsAdminController');
const usersAdminController = require('../controllers/admin/usersAdminController');
const bookingsAdminController = require('../controllers/admin/bookingsAdminController');
const uploadController = require('../controllers/uploadController');
const { uploadSingle, uploadMultiple } = require('../middlewares/uploadMiddleware');

// All admin routes require authentication and admin role
router.use('/admin', authMiddleware, adminMiddleware);

// Dashboard Statistics
router.get('/admin/dashboard', adminController.getDashboardStats); // Alias for stats
router.get('/admin/stats', adminController.getDashboardStats);
router.get('/admin/stats/trips', adminController.getTripsStats);
router.get('/admin/stats/bookings', adminController.getBookingsStats);
router.get('/admin/stats/users', adminController.getUsersStats);

// Trips Management
router.get('/admin/trips', tripsAdminController.getAllTrips);
router.post('/admin/trips', tripsAdminController.createTrip);
router.get('/admin/trips/:id', tripsAdminController.getTripById);
router.put('/admin/trips/:id', tripsAdminController.updateTrip);
router.delete('/admin/trips/:id', tripsAdminController.deleteTrip);
router.post('/admin/trips/:id/images', tripsAdminController.addTripImages);
router.delete('/admin/trips/:id/images/:imageId', tripsAdminController.deleteTripImage);
router.put('/admin/trips/:id/stops', tripsAdminController.updateTripStops);

// Collections Management
router.get('/admin/collections', collectionsAdminController.getAllCollections);
router.post('/admin/collections', collectionsAdminController.createCollection);
router.get('/admin/collections/:id', collectionsAdminController.getCollectionById);
router.put('/admin/collections/:id', collectionsAdminController.updateCollection);
router.delete('/admin/collections/:id', collectionsAdminController.deleteCollection);

// Destinations Management
router.get('/admin/destinations', destinationsAdminController.getAllDestinations);
router.post('/admin/destinations', destinationsAdminController.createDestination);
router.get('/admin/destinations/:id', destinationsAdminController.getDestinationById);
router.put('/admin/destinations/:id', destinationsAdminController.updateDestination);
router.delete('/admin/destinations/:id', destinationsAdminController.deleteDestination);

// Journal Management
router.get('/admin/journal', journalAdminController.getAllArticles);
router.post('/admin/journal', journalAdminController.createArticle);
router.get('/admin/journal/:id', journalAdminController.getArticleById);
router.put('/admin/journal/:id', journalAdminController.updateArticle);
router.delete('/admin/journal/:id', journalAdminController.deleteArticle);
router.put('/admin/journal/:id/publish', journalAdminController.togglePublish);

// FAQs Management
router.get('/admin/faqs', faqsAdminController.getAllFAQs);
router.post('/admin/faqs', faqsAdminController.createFAQ);
router.get('/admin/faqs/:id', faqsAdminController.getFAQById);
router.put('/admin/faqs/:id', faqsAdminController.updateFAQ);
router.delete('/admin/faqs/:id', faqsAdminController.deleteFAQ);

// Reviews Management
router.get('/admin/reviews', reviewsAdminController.getAllReviews);
router.put('/admin/reviews/:id/approve', reviewsAdminController.approveReview);
router.put('/admin/reviews/:id/reject', reviewsAdminController.rejectReview);
router.delete('/admin/reviews/:id', reviewsAdminController.deleteReview);

// Users Management
router.get('/admin/users', usersAdminController.getAllUsers);
router.get('/admin/users/:id', usersAdminController.getUserById);
router.put('/admin/users/:id', usersAdminController.updateUser);
router.put('/admin/users/:id/role', usersAdminController.updateUserRole);
router.delete('/admin/users/:id', usersAdminController.deleteUser);

// Bookings Management
router.get('/admin/bookings', bookingsAdminController.getAllBookings);
router.get('/admin/bookings/:id', bookingsAdminController.getBookingById);
router.put('/admin/bookings/:id/status', bookingsAdminController.updateBookingStatus);

// Upload Management
router.post('/admin/upload/single', uploadSingle('image'), uploadController.uploadSingleImage);
router.post('/admin/upload/multiple', uploadMultiple('images', 10), uploadController.uploadMultipleImages);
router.delete('/admin/upload/:publicId', uploadController.deleteImage);

module.exports = (app) => {
  app.use('/api', router);
};

