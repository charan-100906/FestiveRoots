const ArtisanProfile = require('../models/ArtisanProfile');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get all verified artisans (public)
// @route   GET /api/artisans
// @access  Public
const getArtisans = async (req, res, next) => {
  try {
    const { state, craft } = req.query;
    const query = { verificationStatus: 'VERIFIED' };

    if (state && state !== 'all') {
      query.state = new RegExp('^' + state.trim() + '$', 'i');
    }

    if (craft && craft !== 'all') {
      query.craftSpecialization = new RegExp(craft.trim(), 'i');
    }

    const artisans = await ArtisanProfile.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: artisans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get artisan profile and their approved products
// @route   GET /api/artisans/:id
// @access  Public
const getArtisanById = async (req, res, next) => {
  try {
    const artisan = await ArtisanProfile.findById(req.params.id).populate('user', 'name email phone');
    if (!artisan) {
      return res.status(404).json({ success: false, message: 'Artisan profile not found' });
    }

    // Fetch approved products by this artisan
    const products = await Product.find({
      artisan: artisan._id,
      approvalStatus: 'APPROVED',
      isActive: true
    }).populate('category', 'name slug');

    res.json({
      success: true,
      data: {
        artisan,
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in artisan's own profile
// @route   GET /api/artisans/me/profile
// @access  Private (Artisan)
const getMyArtisanProfile = async (req, res, next) => {
  try {
    const artisan = await ArtisanProfile.findOne({ user: req.user._id }).populate('user', 'name email phone');
    if (!artisan) {
      return res.status(404).json({ success: false, message: 'Artisan profile not found for this account' });
    }

    res.json({
      success: true,
      data: artisan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged in artisan's profile
// @route   PUT /api/artisans/me/profile
// @access  Private (Artisan)
const updateMyArtisanProfile = async (req, res, next) => {
  try {
    const artisan = await ArtisanProfile.findOne({ user: req.user._id });
    if (!artisan) {
      return res.status(404).json({ success: false, message: 'Artisan profile not found' });
    }

    const {
      businessName,
      craftSpecialization,
      state,
      district,
      townVillage,
      bio,
      profileImage,
      claimedTraditionHistory,
      phone
    } = req.body;

    if (businessName) artisan.businessName = businessName;
    if (craftSpecialization) artisan.craftSpecialization = craftSpecialization;
    if (state) artisan.state = state;
    if (district) artisan.district = district;
    if (townVillage) artisan.townVillage = townVillage;
    if (bio) artisan.bio = bio;
    if (profileImage !== undefined) artisan.profileImage = profileImage;
    if (claimedTraditionHistory !== undefined) artisan.claimedTraditionHistory = claimedTraditionHistory;
    if (phone !== undefined) artisan.phone = phone;

    await artisan.save();

    res.json({
      success: true,
      message: 'Artisan profile updated successfully',
      data: artisan
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArtisans,
  getArtisanById,
  getMyArtisanProfile,
  updateMyArtisanProfile
};
