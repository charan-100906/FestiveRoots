const User = require('../models/User');
const ArtisanProfile = require('../models/ArtisanProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Festival = require('../models/Festival');
const Region = require('../models/Region');

// @desc    Get Admin Dashboard Overview Stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalCustomers,
      totalArtisans,
      totalProducts,
      pendingProductApprovals,
      pendingArtisanVerifications,
      totalOrders,
      revenueStats,
      recentOrders
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'artisan' }),
      Product.countDocuments(),
      Product.countDocuments({ approvalStatus: 'PENDING' }),
      ArtisanProfile.countDocuments({ verificationStatus: 'PENDING' }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { overallStatus: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ]),
      Order.find().sort({ createdAt: -1 }).limit(6).populate('customer', 'name email')
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalArtisans,
        totalProducts,
        pendingProductApprovals,
        pendingArtisanVerifications,
        totalOrders,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending products for approval
// @route   GET /api/admin/products/pending
// @access  Private (Admin)
const getPendingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ approvalStatus: 'PENDING' })
      .populate('artisan', 'businessName craftSpecialization state district verificationStatus')
      .populate('category', 'name')
      .populate('festival', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a product listing
// @route   PATCH /api/admin/products/:id/approval
// @access  Private (Admin)
const updateProductApproval = async (req, res, next) => {
  try {
    const { status, rejectionReason, originVerificationStatus, originVerificationDetails } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be either APPROVED or REJECTED' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.approvalStatus = status;

    if (status === 'APPROVED') {
      product.approvedAt = new Date();
      product.rejectionReason = '';
      if (originVerificationStatus) product.originVerificationStatus = originVerificationStatus;
      if (originVerificationDetails) product.originVerificationDetails = originVerificationDetails;
    } else {
      product.rejectionReason = rejectionReason || 'Listing does not comply with regional handicraft quality standards.';
    }

    await product.save();

    res.json({
      success: true,
      message: `Product ${status.toLowerCase()} successfully`,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending artisans for verification
// @route   GET /api/admin/artisans/pending
// @access  Private (Admin)
const getPendingArtisans = async (req, res, next) => {
  try {
    const artisans = await ArtisanProfile.find({ verificationStatus: 'PENDING' })
      .populate('user', 'name email phone createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: artisans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or reject artisan registration
// @route   PATCH /api/admin/artisans/:id/verification
// @access  Private (Admin)
const updateArtisanVerification = async (req, res, next) => {
  try {
    const { status, rejectionReason, verificationNotes } = req.body;

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be either VERIFIED or REJECTED' });
    }

    const artisan = await ArtisanProfile.findById(req.params.id);
    if (!artisan) {
      return res.status(404).json({ success: false, message: 'Artisan profile not found' });
    }

    artisan.verificationStatus = status;

    if (status === 'VERIFIED') {
      artisan.verifiedAt = new Date();
      artisan.rejectionReason = '';
      if (verificationNotes) artisan.verificationNotes = verificationNotes;
    } else {
      artisan.rejectionReason = rejectionReason || 'Artisan credentials or regional craft identity could not be established.';
    }

    await artisan.save();

    res.json({
      success: true,
      message: `Artisan verification updated to ${status}`,
      data: artisan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders across the platform
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (customers and artisans)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle block/unblock user
// @route   PATCH /api/admin/users/:id/block
// @access  Private (Admin)
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Administrator accounts cannot be suspended' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? 'suspended' : 're-activated'} successfully`,
      data: { _id: user._id, isBlocked: user.isBlocked }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getPendingProducts,
  updateProductApproval,
  getPendingArtisans,
  updateArtisanVerification,
  getAllOrders,
  getAllUsers,
  toggleBlockUser
};
