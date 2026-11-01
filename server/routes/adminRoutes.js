const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPendingProducts,
  updateProductApproval,
  getPendingArtisans,
  updateArtisanVerification,
  getAllOrders,
  getAllUsers,
  toggleBlockUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/products/pending', getPendingProducts);
router.patch('/products/:id/approval', updateProductApproval);
router.get('/artisans/pending', getPendingArtisans);
router.patch('/artisans/:id/verification', updateArtisanVerification);
router.get('/orders', getAllOrders);
router.get('/users', getAllUsers);
router.patch('/users/:id/block', toggleBlockUser);

module.exports = router;
