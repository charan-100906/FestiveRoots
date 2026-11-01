const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [4000, 'Description cannot exceed 4000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least ₹1']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A product must have at least one image'
      }
    },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArtisanProfile',
      required: true
    },
    artisanUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    festival: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Festival'
    },
    festivalName: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      required: [true, 'State of craft origin is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District of craft origin is required'],
      trim: true
    },
    townVillage: {
      type: String,
      trim: true,
      default: ''
    },
    craftType: {
      type: String,
      required: [true, 'Craft type is required (e.g., Softwood Carving, Lacquer Turned Wood)'],
      trim: true
    },
    claimedOrigin: {
      type: String,
      required: [true, 'Claimed origin must be specified'],
      trim: true
    },
    originVerificationStatus: {
      type: String,
      enum: ['DECLARED_BY_ARTISAN', 'INDEPENDENTLY_VERIFIED'],
      default: 'DECLARED_BY_ARTISAN'
    },
    originVerificationDetails: {
      type: String,
      default: 'Artisan self-declared regional craft origin; pending platform cluster audit.'
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 1
    },
    isMadeToOrder: {
      type: Boolean,
      default: false
    },
    preparationTimeDays: {
      type: Number,
      default: 3,
      min: [0, 'Preparation time cannot be negative']
    },
    estimatedDispatchDays: {
      type: Number,
      default: 5,
      min: [1, 'Estimated dispatch time must be at least 1 day']
    },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    approvedAt: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
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

productSchema.index({ name: 'text', description: 'text', craftType: 'text', claimedOrigin: 'text' });
productSchema.index({ category: 1, approvalStatus: 1, isActive: 1 });
productSchema.index({ festival: 1, approvalStatus: 1, isActive: 1 });
productSchema.index({ state: 1, district: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
