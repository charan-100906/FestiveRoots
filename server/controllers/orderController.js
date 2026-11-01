const Order = require('../models/Order');
const Fulfilment = require('../models/Fulfilment');
const Product = require('../models/Product');
const ArtisanProfile = require('../models/ArtisanProfile');

// @desc    Create new order with server-side price & stock validation and multi-artisan fulfilment splitting
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'COD' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty. Please add items to checkout.' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address (street, city, state, postal code) is required'
      });
    }

    // Server-side validation of products, live prices, and inventory
    const validatedItems = [];
    let subtotal = 0;
    const artisanGroups = {}; // key: artisanId, value: array of items

    for (const cartItem of items) {
      const productId = cartItem.productId || cartItem.product || cartItem._id;
      const quantity = Number(cartItem.quantity) || 1;

      if (quantity < 1) {
        return res.status(400).json({ success: false, message: 'Item quantity must be at least 1' });
      }

      const product = await Product.findById(productId).populate('artisan');
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${productId}` });
      }

      if (product.approvalStatus !== 'APPROVED' || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is currently unavailable for purchase`
        });
      }

      // Check stock availability
      if (!product.isMadeToOrder && product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for "${product.name}". Only ${product.stock} available in stock.`
        });
      }

      const itemPrice = product.price; // Always trust database price
      const itemSubtotal = itemPrice * quantity;
      subtotal += itemSubtotal;

      const artisanIdStr = product.artisan._id.toString();

      const itemSnapshot = {
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: itemPrice,
        quantity,
        artisan: product.artisan._id,
        artisanName: product.artisan.businessName || 'Artisan',
        craftType: product.craftType || ''
      };

      validatedItems.push(itemSnapshot);

      if (!artisanGroups[artisanIdStr]) {
        artisanGroups[artisanIdStr] = {
          artisan: product.artisan,
          artisanUser: product.artisanUser,
          items: []
        };
      }
      artisanGroups[artisanIdStr].items.push(itemSnapshot);

      // Decrement stock in database
      if (!product.isMadeToOrder) {
        product.stock -= quantity;
        await product.save();
      }
    }

    // Delivery charge calculation: free above ₹999, else ₹80
    const deliveryCharge = subtotal >= 999 ? 0 : 80;
    const totalAmount = subtotal + deliveryCharge;

    const orderNumber = 'FR-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

    // Create Parent Order
    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || '',
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'India'
      },
      orderItems: validatedItems,
      paymentMethod,
      paymentStatus: paymentMethod === 'ONLINE_DEMO' ? 'PAID' : 'PENDING',
      paymentDetails:
        paymentMethod === 'ONLINE_DEMO'
          ? {
              transactionId: 'TXN-DEMO-' + Date.now(),
              gateway: 'FestiveRoots Simulated UPI / Card Test Mode',
              paidAt: new Date()
            }
          : undefined,
      subtotal,
      deliveryCharge,
      totalAmount,
      overallStatus: 'PLACED'
    });

    // Create Artisan Fulfilment records (sub-orders)
    const createdFulfilments = [];
    for (const artisanIdStr in artisanGroups) {
      const group = artisanGroups[artisanIdStr];
      const artisanSubtotal = group.items.reduce((sum, it) => sum + it.price * it.quantity, 0);

      const fulfilment = await Fulfilment.create({
        order: order._id,
        orderNumber: order.orderNumber,
        artisan: group.artisan._id,
        artisanUser: group.artisanUser,
        items: group.items,
        subtotal: artisanSubtotal,
        fulfilmentStatus: 'AWAITING_ARTISAN_CONFIRMATION',
        trackingHistory: [
          {
            status: 'AWAITING_ARTISAN_CONFIRMATION',
            timestamp: new Date(),
            note: `Order assigned to ${group.artisan.businessName || 'Artisan'} for availability and craft preparation confirmation.`,
            actor: 'FestiveRoots Coordination Platform'
          }
        ]
      });

      // Update fulfilmentId in order items
      order.orderItems.forEach((it) => {
        if (it.artisan.toString() === artisanIdStr) {
          it.fulfilmentId = fulfilment._id;
        }
      });

      createdFulfilments.push(fulfilment);
    }

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully! Artisan fulfilment workflows have been initialized.',
      data: {
        order,
        fulfilments: createdFulfilments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in customer's orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });

    // Fetch associated fulfilment records for timeline view
    const orderIds = orders.map((o) => o._id);
    const fulfilments = await Fulfilment.find({ order: { $in: orderIds } }).populate(
      'artisan',
      'businessName craftSpecialization state district'
    );

    const fulfilmentsByOrder = {};
    fulfilments.forEach((f) => {
      const oId = f.order.toString();
      if (!fulfilmentsByOrder[oId]) fulfilmentsByOrder[oId] = [];
      fulfilmentsByOrder[oId].push(f);
    });

    const ordersWithFulfilments = orders.map((o) => ({
      ...o.toObject(),
      fulfilments: fulfilmentsByOrder[o._id.toString()] || []
    }));

    res.json({
      success: true,
      data: ordersWithFulfilments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID (customer, artisan, admin)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Role verification
    const isCustomerOwner = req.user.role === 'customer' && order.customer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isArtisan = req.user.role === 'artisan';

    if (!isCustomerOwner && !isAdmin && !isArtisan) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
    }

    const fulfilments = await Fulfilment.find({ order: order._id }).populate(
      'artisan',
      'businessName craftSpecialization state district phone'
    );

    // If caller is an artisan, make sure they only see fulfilments relevant to them or if they're part of the order
    if (isArtisan && !isAdmin) {
      const hasItem = fulfilments.some((f) => f.artisanUser.toString() === req.user._id.toString());
      if (!hasItem) {
        return res.status(403).json({ success: false, message: 'You have no assigned items in this order' });
      }
    }

    res.json({
      success: true,
      data: {
        order,
        fulfilments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer can cancel if order is in PLACED state)
// @route   POST /api/orders/:id/cancel
// @access  Private (Customer)
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this order' });
    }

    if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(order.overallStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled at this stage (current status: ${order.overallStatus})`
      });
    }

    const { reason } = req.body;
    order.overallStatus = 'CANCELLED';
    order.cancellationReason = reason || 'Cancelled by customer';
    order.cancelledAt = new Date();
    await order.save();

    // Restore inventory
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product && !product.isMadeToOrder) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update child fulfilments
    await Fulfilment.updateMany(
      { order: order._id },
      {
        fulfilmentStatus: 'CANCELLED',
        rejectionReason: 'Parent order cancelled by customer',
        $push: {
          trackingHistory: {
            status: 'CANCELLED',
            timestamp: new Date(),
            note: 'Order cancelled by customer. Product preparation halted.',
            actor: req.user.name
          }
        }
      }
    );

    res.json({
      success: true,
      message: 'Order cancelled successfully and stock restored',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
};
