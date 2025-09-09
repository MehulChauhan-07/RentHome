import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { protect, admin, ownerOrAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all properties with filtering and pagination
// @route   GET /api/properties
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('bedrooms').optional().isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
  query('bathrooms').optional().isInt({ min: 0 }).withMessage('Bathrooms must be a non-negative integer'),
  query('sort').optional().isIn(['price', '-price', 'createdAt', '-createdAt', 'rating', '-rating', 'views', '-views']).withMessage('Invalid sort option')
], optionalAuth, async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {
      status: 'approved',
      isAvailable: true
    };

    // Add filters based on query parameters
    if (req.query.location) {
      const locationRegex = new RegExp(req.query.location, 'i');
      filter.$or = [
        { 'location.city': locationRegex },
        { 'location.state': locationRegex },
        { 'location.address': locationRegex }
      ];
    }

    if (req.query.type && req.query.type !== 'all') {
      filter.type = req.query.type;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    if (req.query.bedrooms) {
      filter.bedrooms = { $gte: parseInt(req.query.bedrooms) };
    }

    if (req.query.bathrooms) {
      filter.bathrooms = { $gte: parseInt(req.query.bathrooms) };
    }

    if (req.query.amenities) {
      const amenities = Array.isArray(req.query.amenities) 
        ? req.query.amenities 
        : req.query.amenities.split(',');
      filter.amenities = { $in: amenities };
    }

    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }

    // Text search
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Sort options
    let sortOptions = { isFeatured: -1, createdAt: -1 }; // Default sort
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') ? req.query.sort.slice(1) : req.query.sort;
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      sortOptions = { [sortField]: sortOrder };
    }

    // Execute queries
    const [properties, totalProperties] = await Promise.all([
      Property.find(filter)
        .populate('owner', 'firstName lastName email phone ownerInfo.rating ownerInfo.totalRatings')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      Property.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalProperties / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page,
          limit,
          totalProperties,
          totalPages,
          hasNextPage,
          hasPrevPage
        },
        filters: req.query
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
router.get('/featured', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const properties = await Property.find({
      isFeatured: true,
      status: 'approved',
      isAvailable: true
    })
      .populate('owner', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: { properties }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone ownerInfo avatar')
      .populate('bookings', 'startDate endDate status');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if property can be viewed
    if (property.status !== 'approved' && (!req.user || 
        (req.user._id.toString() !== property.owner._id.toString() && !req.user.isAdmin()))) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment view count (only for approved properties viewed by non-owners)
    if (property.status === 'approved' && 
        (!req.user || req.user._id.toString() !== property.owner._id.toString())) {
      await property.incrementViews();
    }

    res.json({
      success: true,
      data: { property }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Owner/Admin)
router.post('/', protect, [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('location.address')
    .notEmpty()
    .withMessage('Address is required'),
  body('location.city')
    .notEmpty()
    .withMessage('City is required'),
  body('location.state')
    .notEmpty()
    .withMessage('State is required'),
  body('location.zipCode')
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Please provide a valid ZIP code'),
  body('type')
    .isIn(['apartment', 'house', 'studio', 'villa', 'condo', 'townhouse'])
    .withMessage('Invalid property type'),
  body('bedrooms')
    .isInt({ min: 0, max: 50 })
    .withMessage('Bedrooms must be between 0 and 50'),
  body('bathrooms')
    .isInt({ min: 0, max: 50 })
    .withMessage('Bathrooms must be between 0 and 50'),
  body('area')
    .isInt({ min: 1 })
    .withMessage('Area must be at least 1 square foot'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array')
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

    // Set owner to current user
    const propertyData = {
      ...req.body,
      owner: req.user._id
    };

    // Auto-approve if user is admin
    if (req.user.isAdmin()) {
      propertyData.status = 'approved';
      propertyData.isVerified = true;
      propertyData.verificationDate = new Date();
      propertyData.verifiedBy = req.user._id;
    }

    // Create property
    const property = await Property.create(propertyData);

    // Update user's properties array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { properties: property._id } },
      { runValidators: false }
    );

    // Populate owner info before sending response
    await property.populate('owner', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: { property }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
router.put('/:id', protect, [
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('type')
    .optional()
    .isIn(['apartment', 'house', 'studio', 'villa', 'condo', 'townhouse'])
    .withMessage('Invalid property type'),
  body('bedrooms')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Bedrooms must be between 0 and 50'),
  body('bathrooms')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Bathrooms must be between 0 and 50'),
  body('area')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Area must be at least 1 square foot')
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

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check permissions
    if (!req.user.isAdmin() && property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('owner', 'firstName lastName email phone');

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: { property: updatedProperty }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check permissions
    if (!req.user.isAdmin() && property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    // Remove property from owner's properties array
    await User.findByIdAndUpdate(
      property.owner,
      { $pull: { properties: property._id } },
      { runValidators: false }
    );

    // Delete the property
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Add property to favorites
// @route   POST /api/properties/:id/favorite
// @access  Private
router.post('/:id/favorite', protect, async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if already in favorites
    const user = await User.findById(req.user._id);
    const isAlreadyFavorite = user.favorites.includes(property._id);

    if (isAlreadyFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Property is already in favorites'
      });
    }

    // Add to favorites
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { favorites: property._id } },
      { runValidators: false }
    );

    // Increment property favorites count
    property.favorites += 1;
    await property.save();

    res.json({
      success: true,
      message: 'Property added to favorites'
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Remove property from favorites
// @route   DELETE /api/properties/:id/favorite
// @access  Private
router.delete('/:id/favorite', protect, async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if in favorites
    const user = await User.findById(req.user._id);
    const isInFavorites = user.favorites.includes(property._id);

    if (!isInFavorites) {
      return res.status(400).json({
        success: false,
        message: 'Property is not in favorites'
      });
    }

    // Remove from favorites
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: property._id } },
      { runValidators: false }
    );

    // Decrement property favorites count
    property.favorites = Math.max(0, property.favorites - 1);
    await property.save();

    res.json({
      success: true,
      message: 'Property removed from favorites'
    });

  } catch (error) {
    next(error);
  }
});

export default router;
