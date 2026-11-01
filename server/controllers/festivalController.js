const Festival = require('../models/Festival');

// @desc    Get all active festivals
// @route   GET /api/festivals
// @access  Public
const getFestivals = async (req, res, next) => {
  try {
    const festivals = await Festival.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: festivals });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all festivals for admin
// @route   GET /api/festivals/admin/all
// @access  Private (Admin)
const getAdminFestivals = async (req, res, next) => {
  try {
    const festivals = await Festival.find().sort({ createdAt: -1 });
    res.json({ success: true, data: festivals });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new festival
// @route   POST /api/festivals
// @access  Private (Admin)
const createFestival = async (req, res, next) => {
  try {
    const { name, description, approximateMonth, image } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Festival name is required' });
    }

    const festivalExists = await Festival.findOne({ name: new RegExp('^' + name.trim() + '$', 'i') });
    if (festivalExists) {
      return res.status(400).json({ success: false, message: 'A festival with this name already exists' });
    }

    const festival = await Festival.create({
      name: name.trim(),
      description: description || '',
      approximateMonth: approximateMonth || '',
      image: image || '',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Festival created successfully',
      data: festival
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update festival
// @route   PUT /api/festivals/:id
// @access  Private (Admin)
const updateFestival = async (req, res, next) => {
  try {
    const festival = await Festival.findById(req.params.id);
    if (!festival) {
      return res.status(404).json({ success: false, message: 'Festival not found' });
    }

    const { name, description, approximateMonth, image, isActive } = req.body;

    if (name) festival.name = name.trim();
    if (description !== undefined) festival.description = description;
    if (approximateMonth !== undefined) festival.approximateMonth = approximateMonth;
    if (image !== undefined) festival.image = image;
    if (isActive !== undefined) festival.isActive = Boolean(isActive);

    await festival.save();

    res.json({
      success: true,
      message: 'Festival updated successfully',
      data: festival
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle active state of festival
// @route   DELETE /api/festivals/:id
// @access  Private (Admin)
const deleteFestival = async (req, res, next) => {
  try {
    const festival = await Festival.findById(req.params.id);
    if (!festival) {
      return res.status(404).json({ success: false, message: 'Festival not found' });
    }

    festival.isActive = !festival.isActive;
    await festival.save();

    res.json({
      success: true,
      message: `Festival ${festival.isActive ? 'activated' : 'deactivated'} successfully`,
      data: festival
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFestivals,
  getAdminFestivals,
  createFestival,
  updateFestival,
  deleteFestival
};
