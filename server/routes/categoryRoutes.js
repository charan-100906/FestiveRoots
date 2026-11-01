const express = require('express');
const router = express.Router();
const {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCategories);
router.get('/admin/all', protect, authorize('admin'), getAdminCategories);
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
