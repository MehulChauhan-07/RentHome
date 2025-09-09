const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Property = require('../models/Property');
const { protect, admin, resourceOwnerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's favorites
// @route   GET /api/users/favorites
// @access  Private
router.get('/favorites', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        match: { status: 'approved', isAvailable: true },
        populate: { path: 'owner', select: 'firstName lastName email phone' }
      });

    res.json({
      success: true,
      data: { 
        favorites: user.favorites || [],
        count: user.favorites ? user.favorites.length : 0
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get user's properties
// @route   GET /api/users/properties
// @access  Private
router.get('/properties', protect, async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .populate('bookings', 'startDate endDate status totalAmount');

    res.json({
      success: true,
      data: { 
        properties,
        count: properties.length
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get user's bookings
// @route   GET /api/users/bookings
// @access  Private
router.get('/bookings', protect, async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    
    const bookings = await Booking.findByUser(req.user._id);

    res.json({
      success: true,
      data: { 
        bookings,
        count: bookings.length
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Upgrade user to owner
// @route   POST /api/users/upgrade-to-owner
// @access  Private
router.post('/upgrade-to-owner', protect, [
  body('ownerInfo.businessName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters'),
  body('ownerInfo.businessAddress.street')
    .optional()
    .notEmpty()
    .withMessage('Street address is required'),
  body('ownerInfo.businessAddress.city')
    .optional()
    .notEmpty()
    .withMessage('City is required'),
  body('ownerInfo.businessAddress.state')
    .optional()
    .notEmpty()
    .withMessage('State is required'),
  body('ownerInfo.businessAddress.zipCode')
    .optional()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Please provide a valid ZIP code')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user._id);

    if (user.role === 'owner' || user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is already an owner or admin'
      });
    }

    // Update user role to owner
    user.role = 'owner';
    
    // Update owner info if provided
    if (req.body.ownerInfo) {
      user.ownerInfo = { ...user.ownerInfo?.toObject(), ...req.body.ownerInfo };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Successfully upgraded to property owner',
      data: { user }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
