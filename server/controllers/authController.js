const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ArtisanProfile = require('../models/ArtisanProfile');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'festiveroots_super_secure_jwt_secret_dev_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a customer
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Role cannot be overridden to admin through public registration
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'customer',
      phone: phone || '',
      address: address || {}
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register an artisan
// @route   POST /api/auth/register-artisan
// @access  Public
const registerArtisan = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      businessName,
      craftSpecialization,
      state,
      district,
      townVillage,
      bio,
      profileImage,
      claimedTraditionHistory
    } = req.body;

    if (!name || !email || !password || !craftSpecialization || !state || !district || !townVillage || !bio) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields: name, email, password, craft specialization, state, district, town/village, and bio'
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // 1. Create User account with role 'artisan'
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'artisan',
      phone: phone || ''
    });

    // 2. Create ArtisanProfile with PENDING verification status
    const profile = await ArtisanProfile.create({
      user: user._id,
      businessName: businessName || name + ' Handicrafts',
      craftSpecialization,
      state,
      district,
      townVillage,
      bio,
      profileImage: profileImage || '',
      claimedTraditionHistory: claimedTraditionHistory || '',
      phone: phone || '',
      verificationStatus: 'PENDING'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Artisan registration submitted successfully! Your profile is pending administrative verification.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        artisanProfile: profile,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Customer, Artisan, Admin)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by administration' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let artisanProfile = null;
    if (user.role === 'artisan') {
      artisanProfile = await ArtisanProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        artisanProfile,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let artisanProfile = null;
    if (user.role === 'artisan') {
      artisanProfile = await ArtisanProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        artisanProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, address } = req.body;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  registerArtisan,
  loginUser,
  getCurrentUser,
  updateProfile
};
