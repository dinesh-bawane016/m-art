const express = require('express');
const Review = require('../models/Review');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/reviews/artist/:artistId - Get all reviews for an artist
router.get('/artist/:artistId', async (req, res) => {
  try {
    const reviews = await Review.find({ artist_id: req.params.artistId })
      .populate('buyer_id', 'name avatar_url')
      .populate('artwork_id', 'title')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({ reviews, avgRating, totalReviews: reviews.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews - Buyer creates a review
router.post('/', protect, authorize('Buyer'), async (req, res) => {
  try {
    const { artwork_id, artist_id, rating, comment } = req.body;

    // Verify the user actually bought this artwork
    const order = await Order.findOne({ buyer_id: req.user._id, artwork_id, status: 'Completed' });
    if (!order) {
      return res.status(403).json({ error: 'You can only review artworks you have purchased.' });
    }

    const review = await Review.create({
      buyer_id: req.user._id,
      artwork_id,
      artist_id,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'You have already reviewed this artwork.' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
