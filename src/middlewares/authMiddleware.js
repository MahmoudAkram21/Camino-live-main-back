const { verifyToken } = require('../config/jwt');
const models = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'No token provided. Please include a Bearer token in the Authorization header.',
        },
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await models.User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not found. Token is invalid.',
        },
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: error.message || 'Invalid or expired token',
      },
    });
  }
};

module.exports = authMiddleware;

