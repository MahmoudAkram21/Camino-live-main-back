const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.post('/auth/verify-email', authController.verifyEmail);

// Protected routes
router.post('/auth/logout', authMiddleware, authController.logout);
router.post('/auth/refresh', authController.refreshToken);
router.get('/auth/me', authMiddleware, authController.getMe);

module.exports = (app) => {
  app.use('/api', router);
};

