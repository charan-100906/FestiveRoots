const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ArtisanProfile = require('../models/ArtisanProfile');

// Protect routes: verify JWT Bearer token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'festiveroots_super_secure_jwt_secret_dev_key_2026');

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found with this token' });
      }

      if (req.user.isBlocked) {
        return res.status(403).json({ success: false, message: 'Your account has been suspended by administration' });
      }

      return next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no authentication token provided' });
  }
};

// Authorize specific roles (e.g. 'admin', 'artisan', 'customer')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};

// Check if artisan profile is verified (for creating live products, etc.)
const requireVerifiedArtisan = async (req, res, next) => {
  try {
    const profile = await ArtisanProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Artisan profile not found. Please complete registration.' });
    }
    req.artisanProfile = profile;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  protect,
  authorize,
  requireVerifiedArtisan
};
