const express = require('express');
const router = express.Router();
const {
  getArtisans,
  getArtisanById,
  getMyArtisanProfile,
  updateMyArtisanProfile
} = require('../controllers/artisanController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getArtisans);
router.get('/me/profile', protect, authorize('artisan'), getMyArtisanProfile);
router.put('/me/profile', protect, authorize('artisan'), updateMyArtisanProfile);
router.get('/:id', getArtisanById);

module.exports = router;
