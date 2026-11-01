const express = require('express');
const router = express.Router();
const {
  getFestivals,
  getAdminFestivals,
  createFestival,
  updateFestival,
  deleteFestival
} = require('../controllers/festivalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getFestivals);
router.get('/admin/all', protect, authorize('admin'), getAdminFestivals);
router.post('/', protect, authorize('admin'), createFestival);
router.put('/:id', protect, authorize('admin'), updateFestival);
router.delete('/:id', protect, authorize('admin'), deleteFestival);

module.exports = router;
