import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // References
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required for booking']
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required for booking']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required']
  },
  
  // Booking details
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Start date cannot be in the past'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  
  // Pricing
  monthlyRate: {
    type: Number,
    required: [true, 'Monthly rate is required'],
    min: [0, 'Monthly rate cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  securityDeposit: {
    type: Number,
    default: 0,
    min: [0, 'Security deposit cannot be negative']
  },
  
  // Booking status
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed', 'in_progress'],
      message: '{VALUE} is not a valid booking status'
    },
    default: 'pending'
  },
  
  // Contact and communication
  guestInfo: {
    firstName: {
      type: String,
      required: [true, 'Guest first name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Guest last name is required']
    },
    email: {
      type: String,
      required: [true, 'Guest email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Guest phone is required']
    },
    adults: {
      type: Number,
      required: [true, 'Number of adults is required'],
      min: [1, 'At least one adult is required'],
      max: [20, 'Too many adults']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children cannot be negative'],
      max: [10, 'Too many children']
    }
  },
  
  // Special requests and notes
  specialRequests: {
    type: String,
    maxlength: [1000, 'Special requests cannot exceed 1000 characters']
  },
  ownerNotes: {
    type: String,
    maxlength: [1000, 'Owner notes cannot exceed 1000 characters']
  },
  
  // Payment information
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'other'],
      default: 'credit_card'
    },
    transactionId: String,
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded', 'failed'],
      default: 'pending'
    },
    paymentDate: Date,
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative']
    },
    refundDate: Date
  },
  
  // Important dates
  confirmationDate: Date,
  cancellationDate: Date,
  checkInDate: Date,
  checkOutDate: Date,
  
  // Cancellation info
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['user', 'owner', 'admin']
    },
    refundPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict', 'non_refundable'],
      default: 'moderate'
    }
  },
  
  // Reviews and ratings
  reviews: {
    userReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      reviewDate: Date
    },
    ownerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      reviewDate: Date
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for duration in days
bookingSchema.virtual('duration').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for duration in months
bookingSchema.virtual('durationMonths').get(function() {
  const startDate = new Date(this.startDate);
  const endDate = new Date(this.endDate);
  
  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months -= startDate.getMonth();
  months += endDate.getMonth();
  
  return months <= 0 ? 1 : months; // Minimum 1 month
});

// Virtual for total guests
bookingSchema.virtual('totalGuests').get(function() {
  return this.guestInfo.adults + this.guestInfo.children;
});

// Virtual for guest full name
bookingSchema.virtual('guestFullName').get(function() {
  return `${this.guestInfo.firstName} ${this.guestInfo.lastName}`;
});

// Virtual for remaining balance
bookingSchema.virtual('remainingBalance').get(function() {
  return Math.max(0, this.totalAmount - this.payment.paidAmount);
});

// Indexes
bookingSchema.index({ user: 1 });
bookingSchema.index({ property: 1 });
bookingSchema.index({ owner: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ 'payment.paymentStatus': 1 });

// Compound indexes
bookingSchema.index({ property: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ user: 1, status: 1, createdAt: -1 });
bookingSchema.index({ owner: 1, status: 1, createdAt: -1 });

// Pre-save middleware
bookingSchema.pre('save', function(next) {
  // Calculate total amount based on duration and monthly rate
  if (this.isModified('startDate') || this.isModified('endDate') || this.isModified('monthlyRate')) {
    const months = this.durationMonths;
    this.totalAmount = this.monthlyRate * months + this.securityDeposit;
  }
  
  // Set confirmation date when status changes to confirmed
  if (this.isModified('status') && this.status === 'confirmed' && !this.confirmationDate) {
    this.confirmationDate = new Date();
  }
  
  // Set cancellation date when status changes to cancelled
  if (this.isModified('status') && this.status === 'cancelled' && !this.cancellationDate) {
    this.cancellationDate = new Date();
  }
  
  next();
});

// Static methods
bookingSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId })
    .populate('property', 'title images location price')
    .populate('owner', 'firstName lastName email phone')
    .sort({ createdAt: -1 });
};

bookingSchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId })
    .populate('property', 'title images location price')
    .populate('user', 'firstName lastName email phone')
    .sort({ createdAt: -1 });
};

bookingSchema.statics.findByProperty = function(propertyId) {
  return this.find({ property: propertyId })
    .populate('user', 'firstName lastName email phone')
    .sort({ startDate: 1 });
};

bookingSchema.statics.findActiveBookings = function() {
  return this.find({ 
    status: { $in: ['confirmed', 'in_progress'] },
    endDate: { $gte: new Date() }
  });
};

bookingSchema.statics.findUpcomingBookings = function() {
  return this.find({
    status: 'confirmed',
    startDate: { $gte: new Date() }
  });
};

bookingSchema.statics.checkAvailability = function(propertyId, startDate, endDate, excludeBookingId = null) {
  const query = {
    property: propertyId,
    status: { $in: ['confirmed', 'in_progress'] },
    $or: [
      {
        startDate: { $lte: startDate },
        endDate: { $gte: startDate }
      },
      {
        startDate: { $lte: endDate },
        endDate: { $gte: endDate }
      },
      {
        startDate: { $gte: startDate },
        endDate: { $lte: endDate }
      }
    ]
  };
  
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  
  return this.findOne(query);
};

// Instance methods
bookingSchema.methods.isActive = function() {
  return ['confirmed', 'in_progress'].includes(this.status) && 
         this.endDate >= new Date();
};

bookingSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status) && 
         this.startDate > new Date();
};

bookingSchema.methods.calculateRefund = function() {
  if (this.status !== 'cancelled') return 0;
  
  const daysToCancellation = Math.ceil((this.cancellationDate - this.createdAt) / (1000 * 60 * 60 * 24));
  
  switch (this.cancellation.refundPolicy) {
    case 'flexible':
      return daysToCancellation >= 1 ? this.payment.paidAmount * 0.95 : this.payment.paidAmount * 0.5;
    case 'moderate':
      return daysToCancellation >= 5 ? this.payment.paidAmount * 0.9 : 
             daysToCancellation >= 1 ? this.payment.paidAmount * 0.5 : 0;
    case 'strict':
      return daysToCancellation >= 7 ? this.payment.paidAmount * 0.8 : 0;
    case 'non_refundable':
      return 0;
    default:
      return 0;
  }
};

export default mongoose.model('Booking', bookingSchema);
