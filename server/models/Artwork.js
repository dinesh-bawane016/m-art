const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least 1'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    image_url: {
      type: String,
    },
    size: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Sold'],
      default: 'Available',
    },
    artist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artwork', artworkSchema);
