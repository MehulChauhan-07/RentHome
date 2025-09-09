import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  // Basic property information
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Price must be a positive number']
  },
  
  // Location information
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true,
      match: [/^\d{5}(-\d{4})?$/, 'Please provide a valid ZIP code']
    },
    country: {
      type: String,
      default: 'USA',
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Property details
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: {
      values: ['apartment', 'house', 'studio', 'villa', 'condo', 'townhouse'],
      message: '{VALUE} is not a valid property type'
    }
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative'],
    max: [50, 'Bedrooms cannot exceed 50']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative'],
    max: [50, 'Bathrooms cannot exceed 50']
  },
  area: {
    type: Number,
    required: [true, 'Property area is required'],
    min: [1, 'Area must be at least 1 square foot']
  },
  
  // Media
  images: [{
    type: String,
    required: true
  }],
  virtualTourUrl: String,
  
  // Amenities and features
  amenities: [{
    type: String,
    enum: [
      'Air Conditioning', 'Heating', 'Parking', 'Gym', 'Pool', 'Security',
      'Elevator', 'Balcony', 'Garden', 'Garage', 'Fireplace', 'Dishwasher',
      'Laundry', 'Wi-Fi', 'Cable TV', 'Internet', 'Furnished', 'Pet Friendly',
      'Smoking Allowed', 'Wheelchair Accessible', 'Storage', 'Concierge',
      'Doorman', 'Rooftop Access', 'City View', 'Ocean View', 'Mountain View',
      'Lake View', 'Historic Character', 'Renovated', 'Walking Distance'
    ]
  }],
  
  // Property status and availability
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'inactive'],
    default: 'pending'
  },
  
  // Owner information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required']
  },
  
  // Lease terms
  leaseTerms: {
    minimumStay: {
      type: Number,
      default: 1, // months
      min: [1, 'Minimum stay must be at least 1 month']
    },
    maximumStay: {
      type: Number,
      default: 12, // months
      min: [1, 'Maximum stay must be at least 1 month']
    },
    securityDeposit: {
      type: Number,
      min: [0, 'Security deposit cannot be negative']
    },
    utilitiesIncluded: {
      type: Boolean,
      default: false
    },
    petsAllowed: {
      type: Boolean,
      default: false
    },
    smokingAllowed: {
      type: Boolean,
      default: false
    }
  },
  
  // Statistics and ratings
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Admin fields
  adminNotes: String,
  verificationDate: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Bookings
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.price);
});

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} ${this.location.zipCode}`;
});

// Virtual for property age (if we had dateBuilt)
propertySchema.virtual('isNew').get(function() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return this.createdAt >= threeMonthsAgo;
});

// Indexes for better query performance
propertySchema.index({ 'location.city': 1, 'location.state': 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ bedrooms: 1 });
propertySchema.index({ bathrooms: 1 });
propertySchema.index({ isAvailable: 1 });
propertySchema.index({ isFeatured: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ views: -1 });
propertySchema.index({ 'rating.average': -1 });

// Compound indexes for common queries
propertySchema.index({ 
  'location.city': 1, 
  'location.state': 1, 
  price: 1, 
  bedrooms: 1 
});
propertySchema.index({ 
  isAvailable: 1, 
  status: 1, 
  isFeatured: -1, 
  createdAt: -1 
});

// Text index for search functionality
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.address': 'text',
  'location.city': 'text',
  'location.state': 'text',
  amenities: 'text'
});

// Pre-save middleware
propertySchema.pre('save', function(next) {
  // Ensure at least one image
  if (!this.images || this.images.length === 0) {
    return next(new Error('At least one image is required'));
  }
  
  // Auto-verify if owner is admin
  if (this.isNew && this.populate && this.owner && this.owner.role === 'admin') {
    this.isVerified = true;
    this.status = 'approved';
    this.verificationDate = new Date();
    this.verifiedBy = this.owner._id;
  }
  
  next();
});

// Static methods
propertySchema.statics.findAvailable = function() {
  return this.find({ 
    isAvailable: true, 
    status: 'approved' 
  });
};

propertySchema.statics.findFeatured = function() {
  return this.find({ 
    isFeatured: true, 
    isAvailable: true, 
    status: 'approved' 
  });
};

propertySchema.statics.findByLocation = function(city, state) {
  return this.find({ 
    'location.city': new RegExp(city, 'i'),
    'location.state': new RegExp(state, 'i'),
    isAvailable: true,
    status: 'approved'
  });
};

propertySchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  const query = { 
    isAvailable: true, 
    status: 'approved' 
  };
  
  if (minPrice) query.price = { $gte: minPrice };
  if (maxPrice) {
    if (query.price) {
      query.price.$lte = maxPrice;
    } else {
      query.price = { $lte: maxPrice };
    }
  }
  
  return this.find(query);
};

// Instance methods
propertySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

propertySchema.methods.toggleFavorite = function() {
  this.isFeatured = !this.isFeatured;
  return this.save();
};

propertySchema.methods.updateRating = function(newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  return this.save();
};

export default mongoose.model('Property', propertySchema);
