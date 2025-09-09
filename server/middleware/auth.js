const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Middleware to protect routes (requires authentication)
const protect = passport.authenticate('jwt', { session: false });

// Alternative protect middleware that checks both headers and cookies
const protectWithCookie = passport.authenticate('jwt-cookie', { session: false });

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin()) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

// Middleware to check if user is owner or admin
const ownerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isOwner() || req.user.isAdmin())) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Property owner or admin privileges required.'
    });
  }
};

// Middleware to check if user owns the resource or is admin
const resourceOwnerOrAdmin = (resourceField = 'owner') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // If admin, allow access
    if (req.user.isAdmin()) {
      return next();
    }
    
    // Check if user owns the resource
    const resource = req.body || req.params;
    const resourceOwnerId = resource[resourceField] || req[resourceField];
    
    if (resourceOwnerId && resourceOwnerId.toString() === req.user._id.toString()) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  };
};

// Middleware to check if user can access property
const propertyAccess = async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    const propertyId = req.params.id || req.params.propertyId;
    
    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Property ID is required'
      });
    }
    
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Admin can access any property
    if (req.user.isAdmin()) {
      req.property = property;
      return next();
    }
    
    // Owner can access their own properties
    if (property.owner.toString() === req.user._id.toString()) {
      req.property = property;
      return next();
    }
    
    // For GET requests, allow if property is approved and available
    if (req.method === 'GET' && property.status === 'approved') {
      req.property = property;
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. You do not have permission to access this property.'
    });
    
  } catch (error) {
    console.error('Property access middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking property access'
    });
  }
};

// Middleware to check if user can access booking
const bookingAccess = async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    const bookingId = req.params.id || req.params.bookingId;
    
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }
    
    const booking = await Booking.findById(bookingId).populate('property');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Admin can access any booking
    if (req.user.isAdmin()) {
      req.booking = booking;
      return next();
    }
    
    // User can access their own bookings
    if (booking.user.toString() === req.user._id.toString()) {
      req.booking = booking;
      return next();
    }
    
    // Property owner can access bookings for their properties
    if (booking.owner.toString() === req.user._id.toString()) {
      req.booking = booking;
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. You do not have permission to access this booking.'
    });
    
  } catch (error) {
    console.error('Booking access middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking booking access'
    });
  }
};

// Middleware to validate user role transition
const validateRoleChange = (req, res, next) => {
  const { role } = req.body;
  
  if (!role) {
    return next();
  }
  
  const allowedRoles = ['user', 'owner', 'admin'];
  
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role specified'
    });
  }
  
  // Only admins can set admin role
  if (role === 'admin' && !req.user.isAdmin()) {
    return res.status(403).json({
      success: false,
      message: 'Only administrators can assign admin role'
    });
  }
  
  next();
};

// Middleware to check if user account is active
const activeUser = (req, res, next) => {
  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated. Please contact support.'
    });
  }
  next();
};

// Middleware to check if user is verified
const verifiedUser = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email address.'
    });
  }
  next();
};

// Optional authentication middleware (doesn't require login)
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.jwt;
  
  if (!token) {
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.id)
      .select('-password')
      .then(user => {
        if (user && user.isActive) {
          req.user = user;
        }
        next();
      })
      .catch(() => next());
  } catch (error) {
    next();
  }
};

module.exports = {
  generateToken,
  protect,
  protectWithCookie,
  admin,
  ownerOrAdmin,
  resourceOwnerOrAdmin,
  propertyAccess,
  bookingAccess,
  validateRoleChange,
  activeUser,
  verifiedUser,
  optionalAuth
};
