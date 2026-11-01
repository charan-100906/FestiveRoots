const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Submit a review for a purchased product
// @route   POST /api/reviews
// @access  Private (Customer)
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId, rating (1-5), and a review comment'
      });
    }

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Verify customer eligibility: must have a DELIVERED order containing this product
    const eligibleOrder = await Order.findOne({
      customer: req.user._id,
      overallStatus: 'DELIVERED',
      'orderItems.product': productId
    });

    if (!eligibleOrder) {
      return res.status(403).json({
        success: false,
        message: 'Only customers who have received this product (Delivered order) can submit a verified review.'
      });
    }

    // Check for existing review
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this handcrafted item.'
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      order: eligibleOrder._id,
      rating: ratingNum,
      title: title || '',
      comment: comment.trim(),
      isVerifiedPurchase: true
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your verified artisan product review has been published.',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .sort({ createdAt: -1 })
      .populate('user', 'name');

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews
};
