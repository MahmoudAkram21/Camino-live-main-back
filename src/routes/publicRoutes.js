const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/tripsController');
const collectionsController = require('../controllers/collectionsController');
const destinationsController = require('../controllers/destinationsController');
const countriesController = require('../controllers/countriesController');
const journalController = require('../controllers/journalController');
const faqsController = require('../controllers/faqsController');
const reviewsController = require('../controllers/reviewsController');
const contactController = require('../controllers/contactController');
const newsletterController = require('../controllers/newsletterController');
const wishlistController = require('../controllers/wishlistController');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Trips
router.get('/trips', tripsController.getAllTrips);
router.get('/trips/:slug', tripsController.getTripBySlug);
router.get('/trips/:slug/related', tripsController.getRelatedTrips);

// Collections
router.get('/collections', collectionsController.getAllCollections);
router.get('/collections/:slug', collectionsController.getCollectionBySlug);

// Destinations
router.get('/destinations', destinationsController.getAllDestinations);
router.get('/destinations/:slug', destinationsController.getDestinationBySlug);

// Countries
router.get('/countries', countriesController.getAllCountries);

// Journal
router.get('/journal', journalController.getAllArticles);
router.get('/journal/:slug', journalController.getArticleBySlug);
router.get('/journal/categories', journalController.getCategories);

// FAQs
router.get('/faqs', faqsController.getAllFAQs);
router.get('/faqs/categories', faqsController.getCategories);

// Reviews
router.get('/reviews', reviewsController.getAllReviews);
router.get('/reviews/trip/:tripSlug', reviewsController.getReviewsByTrip);

// Contact & Newsletter
router.post('/contact', contactController.submitContact);
router.post('/newsletter/subscribe', newsletterController.subscribe);
router.post('/newsletter/unsubscribe', newsletterController.unsubscribe);

// Wishlist
router.get('/wishlist', wishlistController.getWishlist);
router.post('/wishlist/:tripId', wishlistController.addToWishlist);
router.delete('/wishlist/:tripId', wishlistController.removeFromWishlist);
router.get('/wishlist/check/:tripId', wishlistController.checkWishlistStatus);

// Bookings (requires authentication)
router.post('/bookings', authMiddleware, bookingController.createBooking);
router.get('/bookings', authMiddleware, bookingController.getUserBookings);
router.get('/bookings/:id', authMiddleware, bookingController.getBookingById);

module.exports = (app) => {
  app.use('/api', router);
};

