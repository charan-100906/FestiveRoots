const Product = require('../models/Product');
const ArtisanProfile = require('../models/ArtisanProfile');
const Category = require('../models/Category');
const Festival = require('../models/Festival');

// @desc    Get all approved products (public browsing with rich filters & search)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      festival,
      state,
      district,
      craftType,
      artisanId,
      minPrice,
      maxPrice,
      isMadeToOrder,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {
      approvalStatus: 'APPROVED',
      isActive: true
    };

    // Keyword search (name, craftType, description, claimedOrigin)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { craftType: searchRegex },
        { description: searchRegex },
        { claimedOrigin: searchRegex },
        { state: searchRegex },
        { district: searchRegex },
        { categoryName: searchRegex },
        { festivalName: searchRegex }
      ];
    }

    // Category filter
    if (category) {
      // Support either Category ID or Category Slug
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) query.category = cat._id;
      }
    }

    // Festival filter
    if (festival) {
      if (festival.match(/^[0-9a-fA-F]{24}$/)) {
        query.festival = festival;
      } else {
        const fest = await Festival.findOne({ slug: festival });
        if (fest) query.festival = fest._id;
      }
    }

    // Regional filters
    if (state && state !== 'all') {
      query.state = new RegExp('^' + state.trim() + '$', 'i');
    }
    if (district && district !== 'all') {
      query.district = new RegExp('^' + district.trim() + '$', 'i');
    }

    // Craft type
    if (craftType && craftType !== 'all') {
      query.craftType = new RegExp(craftType.trim(), 'i');
    }

    // Artisan filter
    if (artisanId) {
      query.artisan = artisanId;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Made to order filter
    if (isMadeToOrder !== undefined) {
      query.isMadeToOrder = isMadeToOrder === 'true';
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // newest by default
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { ratingAverage: -1 };
    else if (sort === 'popular') sortOption = { numReviews: -1 };

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('artisan', 'businessName craftSpecialization state district townVillage verificationStatus profileImage')
      .populate('category', 'name slug')
      .populate('festival', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: products,
      pagination: {
        total: totalProducts,
        page: pageNum,
        pages: Math.ceil(totalProducts / limitNum) || 1,
        limit: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('artisan', 'businessName craftSpecialization state district townVillage bio profileImage verificationStatus claimedTraditionHistory')
      .populate('category', 'name slug description')
      .populate('festival', 'name slug description approximateMonth');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Artisan only)
// @route   POST /api/products
// @access  Private (Artisan)
const createProduct = async (req, res, next) => {
  try {
    const artisanProfile = await ArtisanProfile.findOne({ user: req.user._id });
    if (!artisanProfile) {
      return res.status(403).json({
        success: false,
        message: 'No artisan profile associated with this account. Please create your artisan profile first.'
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      images,
      categoryId,
      festivalId,
      state,
      district,
      townVillage,
      craftType,
      claimedOrigin,
      stock,
      isMadeToOrder,
      preparationTimeDays,
      estimatedDispatchDays
    } = req.body;

    if (!name || !description || !price || !categoryId || !craftType || !claimedOrigin) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, craft type, and claimed origin'
      });
    }

    // Verify category exists
    const categoryDoc = await Category.findById(categoryId);
    if (!categoryDoc) {
      return res.status(400).json({ success: false, message: 'Selected category does not exist' });
    }

    // Optional festival check
    let festivalName = '';
    if (festivalId) {
      const festivalDoc = await Festival.findById(festivalId);
      if (festivalDoc) festivalName = festivalDoc.name;
    }

    // Handle images
    let productImages = [];
    if (Array.isArray(images) && images.length > 0) {
      productImages = images;
    } else if (typeof images === 'string') {
      productImages = [images];
    } else {
      productImages = ['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80']; // Fallback heritage image
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images: productImages,
      artisan: artisanProfile._id,
      artisanUser: req.user._id,
      category: categoryDoc._id,
      categoryName: categoryDoc.name,
      festival: festivalId || undefined,
      festivalName,
      state: state || artisanProfile.state,
      district: district || artisanProfile.district,
      townVillage: townVillage || artisanProfile.townVillage,
      craftType,
      claimedOrigin,
      originVerificationStatus: 'DECLARED_BY_ARTISAN',
      originVerificationDetails: `Self-declared by artisan ${artisanProfile.businessName || req.user.name}. Cluster audit pending.`,
      stock: Number(stock) || 1,
      isMadeToOrder: Boolean(isMadeToOrder),
      preparationTimeDays: Number(preparationTimeDays) || 3,
      estimatedDispatchDays: Number(estimatedDispatchDays) || 5,
      approvalStatus: 'PENDING',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Product submitted successfully! It has been placed in the queue for administrator review.',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Artisan can update their own; Admin can update any)
// @route   PUT /api/products/:id
// @access  Private (Artisan / Admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Ownership check: must be the artisan who created it or an administrator
    if (req.user.role !== 'admin' && product.artisanUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own products'
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      images,
      categoryId,
      festivalId,
      state,
      district,
      townVillage,
      craftType,
      claimedOrigin,
      stock,
      isMadeToOrder,
      preparationTimeDays,
      estimatedDispatchDays,
      isActive
    } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (images) product.images = Array.isArray(images) ? images : [images];
    if (craftType) product.craftType = craftType;
    if (claimedOrigin) product.claimedOrigin = claimedOrigin;
    if (stock !== undefined) product.stock = Number(stock);
    if (isMadeToOrder !== undefined) product.isMadeToOrder = Boolean(isMadeToOrder);
    if (preparationTimeDays !== undefined) product.preparationTimeDays = Number(preparationTimeDays);
    if (estimatedDispatchDays !== undefined) product.estimatedDispatchDays = Number(estimatedDispatchDays);
    if (isActive !== undefined) product.isActive = Boolean(isActive);
    if (state) product.state = state;
    if (district) product.district = district;
    if (townVillage) product.townVillage = townVillage;

    if (categoryId) {
      const cat = await Category.findById(categoryId);
      if (cat) {
        product.category = cat._id;
        product.categoryName = cat.name;
      }
    }

    if (festivalId !== undefined) {
      if (festivalId) {
        const fest = await Festival.findById(festivalId);
        if (fest) {
          product.festival = fest._id;
          product.festivalName = fest.name;
        }
      } else {
        product.festival = undefined;
        product.festivalName = '';
      }
    }

    // If an artisan edits crucial fields, reset approval status to PENDING for review safety
    if (req.user.role !== 'admin' && (name || description || price)) {
      product.approvalStatus = 'PENDING';
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Artisan / Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.user.role !== 'admin' && product.artisanUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own products'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get artisan's own products (including pending & rejected)
// @route   GET /api/products/artisan/my-products
// @access  Private (Artisan)
const getArtisanProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ artisanUser: req.user._id })
      .populate('category', 'name slug')
      .populate('festival', 'name slug')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product image file
// @route   POST /api/products/upload-image
// @access  Private (Artisan / Admin)
const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    // Return the relative URL path to the uploaded image
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getArtisanProducts,
  uploadProductImage
};
