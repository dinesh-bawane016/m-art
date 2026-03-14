const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config({ path: __dirname + '/.env' });

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ─── API Routes ──────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/artworks', require('./routes/artworks'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/chat', require('./routes/chat'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'M-Art API is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Caught:", err);
  const errMsg = err.message || err.description || err.name || 'Internal Server Error';
  res.status(500).json({ error: errMsg });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 M-Art server running on http://localhost:${PORT}`);
});
