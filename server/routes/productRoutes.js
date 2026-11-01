const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getArtisanProducts,
  uploadProductImage
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/artisan/my-products', protect, authorize('artisan'), getArtisanProducts);
router.post('/upload-image', protect, authorize('artisan', 'admin'), upload.single('image'), uploadProductImage);
router.get('/:id', getProductById);
router.post('/', protect, authorize('artisan'), createProduct);
router.put('/:id', protect, authorize('artisan', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('artisan', 'admin'), deleteProduct);

module.exports = router;
