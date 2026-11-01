const mongoose = require('mongoose');

const trackingEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
  actor: { type: String, default: 'System' }
});

const fulfilmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    orderNumber: {
      type: String,
      required: true
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
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    subtotal: {
      type: Number,
      required: true
    },
    fulfilmentStatus: {
      type: String,
      enum: [
        'AWAITING_ARTISAN_CONFIRMATION',
        'CONFIRMED',
        'PREPARING',
        'READY_FOR_COLLECTION',
        'COLLECTION_SCHEDULED',
        'SHIPPED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'REJECTED',
        'DELIVERY_FAILED'
      ],
      default: 'AWAITING_ARTISAN_CONFIRMATION'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    collectionScheduledDate: {
      type: Date
    },
    simulatedTrackingCode: {
      type: String,
      default: ''
    },
    simulatedCourierName: {
      type: String,
      default: 'FestiveRoots Regional Heritage Logistics (Simulated)'
    },
    trackingHistory: [trackingEventSchema]
  },
  {
    timestamps: true
  }
);

fulfilmentSchema.index({ artisan: 1, fulfilmentStatus: 1 });
fulfilmentSchema.index({ order: 1 });

module.exports = mongoose.model('Fulfilment', fulfilmentSchema);
