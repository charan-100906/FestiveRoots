const Fulfilment = require('../models/Fulfilment');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all fulfilment items for logged in artisan
// @route   GET /api/fulfilments/artisan/my-orders
// @access  Private (Artisan)
const getArtisanFulfilments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { artisanUser: req.user._id };

    if (status && status !== 'ALL') {
      query.fulfilmentStatus = status;
    }

    const fulfilments = await Fulfilment.find(query)
      .populate('order', 'shippingAddress customerName customerPhone paymentMethod paymentStatus createdAt')
      .populate('artisan', 'businessName craftSpecialization state district')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: fulfilments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update fulfilment status (Artisan workflow / Admin simulation)
// @route   PATCH /api/fulfilments/:id/status
// @access  Private (Artisan / Admin)
const updateFulfilmentStatus = async (req, res, next) => {
  try {
    const fulfilment = await Fulfilment.findById(req.params.id);
    if (!fulfilment) {
      return res.status(404).json({ success: false, message: 'Fulfilment record not found' });
    }

    // Ownership check: must be the assigned artisan or administrator
    if (req.user.role !== 'admin' && fulfilment.artisanUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You are not assigned to fulfil these items'
      });
    }

    const { status, note, rejectionReason } = req.body;

    const validStatuses = [
      'CONFIRMED',
      'PREPARING',
      'READY_FOR_COLLECTION',
      'COLLECTION_SCHEDULED',
      'SHIPPED',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'REJECTED'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid fulfilment status: ${status}. Allowed values: ${validStatuses.join(', ')}`
      });
    }

    // Handle rejection
    if (status === 'REJECTED') {
      if (!rejectionReason || rejectionReason.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Please provide a clear rejection reason explaining why these items cannot be prepared'
        });
      }
      fulfilment.rejectionReason = rejectionReason.trim();

      // Restore product inventory for rejected items
      for (const item of fulfilment.items) {
        const prod = await Product.findById(item.product);
        if (prod && !prod.isMadeToOrder) {
          prod.stock += item.quantity;
          await prod.save();
        }
      }
    }

    // Handle simulated collection and tracking
    if (status === 'COLLECTION_SCHEDULED') {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 1); // tomorrow
      fulfilment.collectionScheduledDate = scheduledDate;
    }

    if (status === 'SHIPPED' && !fulfilment.simulatedTrackingCode) {
      fulfilment.simulatedTrackingCode =
        'FR-SHIP-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-IND';
    }

    fulfilment.fulfilmentStatus = status;

    // Append to tracking history
    const statusDescriptions = {
      CONFIRMED: 'Artisan confirmed item availability and craft feasibility.',
      PREPARING: 'Artisan is actively handcrafting / preparing the items for packaging.',
      READY_FOR_COLLECTION: 'Craft items are packaged and ready for regional pickup collection.',
      COLLECTION_SCHEDULED: 'Platform logistics partner scheduled for craft workshop pickup (Simulated).',
      SHIPPED: `Dispatched from artisan regional cluster. Tracking ID: ${fulfilment.simulatedTrackingCode || 'Assigned'} (Simulated).`,
      OUT_FOR_DELIVERY: 'Consignment reached destination delivery hub; out for final delivery (Simulated).',
      DELIVERED: 'Package successfully delivered to customer address (Simulated).',
      REJECTED: `Artisan was unable to fulfil this item: ${rejectionReason || 'Unavailable'}`
    };

    fulfilment.trackingHistory.push({
      status,
      timestamp: new Date(),
      note: note || statusDescriptions[status] || 'Status updated',
      actor: req.user.role === 'admin' ? 'Administrator (Simulated Logistics)' : 'Artisan Workshop'
    });

    await fulfilment.save();

    // Re-evaluate parent order overall status
    const parentOrder = await Order.findById(fulfilment.order);
    if (parentOrder) {
      const allSiblings = await Fulfilment.find({ order: parentOrder._id });
      const statuses = allSiblings.map((s) => s.fulfilmentStatus);

      if (statuses.every((s) => s === 'DELIVERED')) {
        parentOrder.overallStatus = 'DELIVERED';
      } else if (statuses.some((s) => s === 'OUT_FOR_DELIVERY')) {
        parentOrder.overallStatus = 'OUT_FOR_DELIVERY';
      } else if (statuses.some((s) => s === 'SHIPPED')) {
        parentOrder.overallStatus = 'SHIPPED';
      } else if (statuses.some((s) => s === 'COLLECTION_SCHEDULED')) {
        parentOrder.overallStatus = 'COLLECTION_SCHEDULED';
      } else if (statuses.some((s) => s === 'READY_FOR_COLLECTION')) {
        parentOrder.overallStatus = 'READY_FOR_COLLECTION';
      } else if (statuses.some((s) => s === 'PREPARING')) {
        parentOrder.overallStatus = 'PREPARING';
      } else if (statuses.every((s) => s === 'CONFIRMED')) {
        parentOrder.overallStatus = 'CONFIRMED';
      } else if (statuses.every((s) => s === 'REJECTED')) {
        parentOrder.overallStatus = 'CANCELLED';
        parentOrder.cancellationReason = 'All artisans rejected the requested items';
      }

      await parentOrder.save();
    }

    res.json({
      success: true,
      message: `Fulfilment status updated to ${status}`,
      data: fulfilment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArtisanFulfilments,
  updateFulfilmentStatus
};
