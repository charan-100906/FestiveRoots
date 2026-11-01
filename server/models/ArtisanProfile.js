const mongoose = require('mongoose');

const artisanProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    businessName: {
      type: String,
      trim: true,
      maxlength: [120, 'Business name cannot exceed 120 characters']
    },
    craftSpecialization: {
      type: String,
      required: [true, 'Please provide your craft specialization (e.g. Kondapalli Toys, Terracotta Pottery)'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    townVillage: {
      type: String,
      required: [true, 'Town or village is required'],
      trim: true
    },
    bio: {
      type: String,
      required: [true, 'Please provide an artisan biography and background'],
      maxlength: [2000, 'Bio cannot exceed 2000 characters']
    },
    profileImage: {
      type: String,
      default: ''
    },
    claimedTraditionHistory: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      trim: true
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    verificationNotes: {
      type: String,
      default: ''
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    verifiedAt: {
      type: Date
    },
    ratingAverage: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ArtisanProfile', artisanProfileSchema);
