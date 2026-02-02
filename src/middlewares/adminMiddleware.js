const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required',
      },
    });
  }

  // Check if user has admin or editor role
  if (req.user.role !== 'admin' && req.user.role !== 'editor') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Access denied. Admin or editor privileges required.',
      },
    });
  }

  next();
};

module.exports = adminMiddleware;

