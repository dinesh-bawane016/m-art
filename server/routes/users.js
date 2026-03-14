const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const upload = require('../middleware/upload');
const Artwork = require('../models/Artwork');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// PUT /api/users/profile — Any logged-in user
router.put('/profile', protect, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.file && req.file.path) {
      user.avatar_url = req.file.path;
    }

    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      avatar_url: user.avatar_url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/password — Any logged-in user
router.put('/password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!req.body.currentPassword || !req.body.newPassword) {
      return res.status(400).json({ error: 'Please provide both passwords' });
    }

    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/wishlist — Any logged-in user
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'artist_id', select: 'name email' }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/wishlist/:artworkId — Toggle wishlist
router.post('/wishlist/:artworkId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const artworkId = req.params.artworkId;
    const isWishlisted = user.wishlist.includes(artworkId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== artworkId);
    } else {
      user.wishlist.push(artworkId);
    }

    await user.save();
    res.json({ message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users — Admin: all users
router.get('/', protect, authorize('Admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/unverified-artists — Admin
router.get('/unverified-artists', protect, authorize('Admin'), async (req, res) => {
  try {
    const artists = await User.find({ role: 'Artist', is_verified: false }).select('-password');
    const artistsWithArt = await Promise.all(
      artists.map(async (artist) => {
        const artworks = await Artwork.find({ artist_id: artist._id }).select('title image_url');
        return { ...artist.toObject(), artworks };
      })
    );
    console.log("SERVER LOG:", JSON.stringify(artistsWithArt, null, 2));
    res.json(artistsWithArt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/stats — Admin: dashboard stats
router.get('/stats', protect, authorize('Admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalArtists = await User.countDocuments({ role: 'Artist', is_verified: true });
    const pendingVerifications = await User.countDocuments({ role: 'Artist', is_verified: false });

    res.json({ totalUsers, totalArtists, pendingVerifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/artist/:id — Public artist profile
router.get('/artist/:id', async (req, res) => {
  try {
    const artist = await User.findOne({ _id: req.params.id, role: 'Artist', is_verified: true })
      .select('name avatar_url createdAt');
      
    if (!artist) return res.status(404).json({ error: 'Artist not found or not verified' });

    // Get all artworks for this artist
    const artworks = await Artwork.find({ artist_id: artist._id }).sort({ createdAt: -1 });

    res.json({ artist, artworks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:id/verify — Admin: approve artist
router.put('/:id/verify', protect, authorize('Admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role !== 'Artist') return res.status(400).json({ error: 'User is not an artist' });

    user.is_verified = true;
    await user.save();
    res.json({ message: `${user.name} has been verified`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:id/reject — Admin: reject artist
router.put('/:id/reject', protect, authorize('Admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.deleteOne();
    res.json({ message: `${user.name} has been rejected and removed` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
