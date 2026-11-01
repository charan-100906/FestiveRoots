const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerArtisan,
  loginUser,
  getCurrentUser,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/register-artisan', registerArtisan);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);

module.exports = router;
