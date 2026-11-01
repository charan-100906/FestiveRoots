const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const artisanRoutes = require('./routes/artisanRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const festivalRoutes = require('./routes/festivalRoutes');
const regionRoutes = require('./routes/regionRoutes');
const orderRoutes = require('./routes/orderRoutes');
const fulfilmentRoutes = require('./routes/fulfilmentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.CLIENT_URL].filter(Boolean),
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'FestiveRoots Regional Artisan Marketplace API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/festivals', festivalRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/fulfilments', fulfilmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
