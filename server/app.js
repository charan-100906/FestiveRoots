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
// Dynamic CORS origin configuration to support Vercel, Render, and custom client URLs
const explicitOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((u) => u.trim()) : [])
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. curl, Postman, health check pings)
      if (!origin) return callback(null, true);

      // Check explicit origin list
      if (explicitOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel domains (*.vercel.app) and Render domains (*.onrender.com)
      if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
        return callback(null, true);
      }

      // Default allow for seamless deployment connectivity
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
