require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then listen
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[FestiveRoots Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[FestiveRoots Server] API Base: http://localhost:${PORT}/api`);
  });
});
