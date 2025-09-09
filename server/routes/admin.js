const express = require('express');
const { body, query, validationResult } = require('express-validator');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes in this router
router.use(protect, admin);

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
router.get('/dashboard', async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProperties,
      totalBookings,
      activeProperties,
      pendingProperties,
      recentUsers,
      recentProperties,
      monthlyRevenue
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Property.countDocuments(),
      Booking.countDocuments(),
      Property.countDocuments({ status: 'approved', isAvailable: true }),
      Property.countDocuments({ status: 'pending' }),
      User.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).select('firstName lastName email role createdAt'),
      Property.find().sort({ createdAt: -1 }).limit(5).populate('owner', 'firstName lastName email'),
      Booking.aggregate([
        {
          $match: {
            status: { $in: ['confirmed', 'completed'] },
            createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProperties,
          totalBookings,
          activeProperties,
          pendingProperties,
          monthlyRevenue: monthlyRevenue[0]?.total || 0
        },
        recentActivity: {
          users: recentUsers,
          properties: recentProperties
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get all users with filtering and pagination
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['user', 'owner', 'admin']).withMessage('Invalid role'),
  query('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.isActive = req.query.status === 'active';
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex }
      ];
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('properties', 'title status createdAt')
        .populate('bookings', 'status totalAmount createdAt'),
      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          totalUsers,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Update user status or role
// @route   PUT /api/admin/users/:id
// @access  Admin
router.put('/users/:id', [
  body('role').optional().isIn(['user', 'owner', 'admin']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow admin to deactivate themselves
    if (req.params.id === req.user._id.toString() && req.body.isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    const { role, isActive, isVerified } = req.body;

    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get all properties for admin review
// @route   GET /api/admin/properties
// @access  Admin
router.get('/properties', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['draft', 'pending', 'approved', 'rejected', 'inactive']).withMessage('Invalid status')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { 'location.city': searchRegex },
        { 'location.state': searchRegex }
      ];
    }

    const [properties, totalProperties] = await Promise.all([
      Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('owner', 'firstName lastName email phone')
        .populate('verifiedBy', 'firstName lastName'),
      Property.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalProperties / limit);

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page,
          limit,
          totalProperties,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Approve or reject property
// @route   PUT /api/admin/properties/:id/status
// @access  Admin
router.put('/properties/:id/status', [
  body('status').isIn(['approved', 'rejected', 'inactive']).withMessage('Invalid status'),
  body('adminNotes').optional().isLength({ max: 1000 }).withMessage('Admin notes cannot exceed 1000 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const { status, adminNotes } = req.body;

    property.status = status;
    if (adminNotes) property.adminNotes = adminNotes;

    if (status === 'approved') {
      property.isVerified = true;
      property.verificationDate = new Date();
      property.verifiedBy = req.user._id;
    }

    await property.save();

    res.json({
      success: true,
      message: `Property ${status} successfully`,
      data: { property }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Toggle property featured status
// @route   PUT /api/admin/properties/:id/featured
// @access  Admin
router.put('/properties/:id/featured', async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property.isFeatured = !property.isFeatured;
    await property.save();

    res.json({
      success: true,
      message: `Property ${property.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: { property }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get all bookings for admin
// @route   GET /api/admin/bookings
// @access  Admin
router.get('/bookings', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'rejected', 'cancelled', 'completed', 'in_progress']).withMessage('Invalid status')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [bookings, totalBookings] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'firstName lastName email phone')
        .populate('owner', 'firstName lastName email phone')
        .populate('property', 'title location images price'),
      Booking.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          totalBookings,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
