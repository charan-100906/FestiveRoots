const express = require('express');
const router = express.Router();
const {
  getRegions,
  getAdminRegions,
  createRegion,
  updateRegion,
  deleteRegion
} = require('../controllers/regionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getRegions);
router.get('/admin/all', protect, authorize('admin'), getAdminRegions);
router.post('/', protect, authorize('admin'), createRegion);
router.put('/:id', protect, authorize('admin'), updateRegion);
router.delete('/:id', protect, authorize('admin'), deleteRegion);

module.exports = router;
