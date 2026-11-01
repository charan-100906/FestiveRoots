const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArtisanProfile',
    required: true
  },
  artisanName: { type: String, required: true },
  craftType: { type: String, default: '' },
  fulfilmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fulfilment'
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      required: true
    },
    customerPhone: {
      type: String,
      required: true
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    orderItems: [orderItemSchema],
    paymentMethod: {
      type: String,
      enum: ['COD', 'ONLINE_DEMO'],
      default: 'COD'
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUND_PENDING', 'REFUNDED'],
      default: 'PENDING'
    },
    paymentDetails: {
      transactionId: String,
      gateway: { type: String, default: 'Simulated Demo Gateway' },
      paidAt: Date
    },
    subtotal: {
      type: Number,
      required: true
    },
    deliveryCharge: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    overallStatus: {
      type: String,
      enum: [
        'PLACED',
        'AWAITING_ARTISAN_CONFIRMATION',
        'CONFIRMED',
        'PREPARING',
        'READY_FOR_COLLECTION',
        'COLLECTION_SCHEDULED',
        'SHIPPED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'DELIVERY_FAILED'
      ],
      default: 'PLACED'
    },
    cancellationReason: {
      type: String,
      default: ''
    },
    cancelledAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
