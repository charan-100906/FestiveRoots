const express = require('express');
const router = express.Router();
const {
  getArtisanFulfilments,
  updateFulfilmentStatus
} = require('../controllers/fulfilmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/artisan/my-orders', protect, authorize('artisan'), getArtisanFulfilments);
router.patch('/:id/status', protect, authorize('artisan', 'admin'), updateFulfilmentStatus);

module.exports = router;
