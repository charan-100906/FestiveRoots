const Region = require('../models/Region');

// @desc    Get all active regions
// @route   GET /api/regions
// @access  Public
const getRegions = async (req, res, next) => {
  try {
    const regions = await Region.find({ isActive: true }).sort({ state: 1, district: 1 });
    res.json({ success: true, data: regions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all regions for admin
// @route   GET /api/regions/admin/all
// @access  Private (Admin)
const getAdminRegions = async (req, res, next) => {
  try {
    const regions = await Region.find().sort({ state: 1, district: 1 });
    res.json({ success: true, data: regions });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new region entry
// @route   POST /api/regions
// @access  Private (Admin)
const createRegion = async (req, res, next) => {
  try {
    const { state, district, townVillage, craftHeritage, description, image } = req.body;
    if (!state || !district || !craftHeritage) {
      return res.status(400).json({
        success: false,
        message: 'State, district, and craft heritage are required'
      });
    }

    const region = await Region.create({
      state: state.trim(),
      district: district.trim(),
      townVillage: townVillage ? townVillage.trim() : '',
      craftHeritage: craftHeritage.trim(),
      description: description || '',
      image: image || '',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Region created successfully',
      data: region
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update region
// @route   PUT /api/regions/:id
// @access  Private (Admin)
const updateRegion = async (req, res, next) => {
  try {
    const region = await Region.findById(req.params.id);
    if (!region) {
      return res.status(404).json({ success: false, message: 'Region not found' });
    }

    const { state, district, townVillage, craftHeritage, description, image, isActive } = req.body;

    if (state) region.state = state.trim();
    if (district) region.district = district.trim();
    if (townVillage !== undefined) region.townVillage = townVillage.trim();
    if (craftHeritage) region.craftHeritage = craftHeritage.trim();
    if (description !== undefined) region.description = description;
    if (image !== undefined) region.image = image;
    if (isActive !== undefined) region.isActive = Boolean(isActive);

    await region.save();

    res.json({
      success: true,
      message: 'Region updated successfully',
      data: region
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle region active status
// @route   DELETE /api/regions/:id
// @access  Private (Admin)
const deleteRegion = async (req, res, next) => {
  try {
    const region = await Region.findById(req.params.id);
    if (!region) {
      return res.status(404).json({ success: false, message: 'Region not found' });
    }

    region.isActive = !region.isActive;
    await region.save();

    res.json({
      success: true,
      message: `Region ${region.isActive ? 'activated' : 'deactivated'} successfully`,
      data: region
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRegions,
  getAdminRegions,
  createRegion,
  updateRegion,
  deleteRegion
};
