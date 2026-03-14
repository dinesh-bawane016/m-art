const express = require('express');
const Artwork = require('../models/Artwork');
const User = require('../models/User');
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/artworks — public, only verified artists' work
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      // Look for any verified artists matching the search name
      const matchedArtists = await User.find({
        role: 'Artist',
        is_verified: true,
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      const matchedArtistIds = matchedArtists.map((a) => a._id);

      // Need all verified artists to ensure we don't accidentally load rejected ones
      const allVerified = await User.find({ role: 'Artist', is_verified: true }).select('_id');
      const allVerifiedIds = allVerified.map((a) => a._id);

      filter.$and = [
        { artist_id: { $in: allVerifiedIds } },
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { artist_id: { $in: matchedArtistIds } }
          ]
        }
      ];
    } else {
      const verifiedArtists = await User.find({ role: 'Artist', is_verified: true }).select('_id');
      const verifiedIds = verifiedArtists.map((a) => a._id);
      filter.artist_id = { $in: verifiedIds };
    }

    // Determine sort logic
    let sortQuery = { createdAt: -1 }; // Default Newest
    if (sort === 'price_asc') sortQuery = { price: 1 };
    else if (sort === 'price_desc') sortQuery = { price: -1 };

    const artworks = await Artwork.find(filter)
      .populate('artist_id', 'name email')
      .sort(sortQuery);

    res.json(artworks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/artworks/artist/me — Artist's own artworks
router.get('/artist/me', protect, authorize('Artist'), async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist_id: req.user._id }).sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/artworks/all — Admin: get ALL artworks regardless of verification
router.get('/all', protect, authorize('Admin'), async (req, res) => {
  try {
    const artworks = await Artwork.find()
      .populate('artist_id', 'name email is_verified')
      .sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/artworks/:id
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate('artist_id', 'name email');
    if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
    res.json(artwork);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/artworks — Artist only
router.post('/', protect, authorize('Artist'), upload.single('image'), async (req, res) => {
  try {
    const { title, price, category, size } = req.body;
    let image_url = req.body.image_url;

    if (req.file && req.file.path) {
      image_url = req.file.path;
    }

    const artwork = await Artwork.create({
      title,
      price,
      category,
      size,
      image_url,
      artist_id: req.user._id,
    });
    res.status(201).json(artwork);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/artworks/:id — Artist only (own artwork)
router.put('/:id', protect, authorize('Artist'), upload.single('image'), async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
    if (artwork.artist_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this artwork' });
    }

    const { title, price, category, status, size } = req.body;
    if (title) artwork.title = title;
    if (price) artwork.price = price;
    if (category) artwork.category = category;
    if (status) artwork.status = status;
    if (size !== undefined) artwork.size = size;

    if (req.file && req.file.path) {
      artwork.image_url = req.file.path;
    } else if (req.body.image_url) {
      artwork.image_url = req.body.image_url;
    }

    await artwork.save();
    res.json(artwork);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/artworks/:id — Artist (own) or Admin
router.delete('/:id', protect, authorize('Artist', 'Admin'), async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ error: 'Artwork not found' });

    if (req.user.role === 'Artist' && artwork.artist_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this artwork' });
    }

    await artwork.deleteOne();
    res.json({ message: 'Artwork deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
