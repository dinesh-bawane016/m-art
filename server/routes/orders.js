const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Artwork = require('../models/Artwork');
const { protect, authorize } = require('../middleware/auth');
const sendEmail = require('../utils/email');

const router = express.Router();

// POST /api/orders/create-payment - Create Razorpay order
router.post('/create-payment', protect, authorize('Buyer'), async (req, res) => {
  try {
    const { items } = req.body;
    let totalAmount = 0;

    for (const item of items) {
      const artwork = await Artwork.findById(item.artwork_id);
      if (artwork && artwork.status !== 'Sold') {
        totalAmount += artwork.price;
      }
    }

    if (totalAmount === 0) return res.status(400).json({ error: 'No items in order' });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = { amount: Math.round(totalAmount * 100), currency: 'INR', receipt: `rcpt_${Date.now()}` };
    const order = await razorpay.orders.create(options);
    res.json({ order, totalAmount, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).json({ error: err.error?.description || err.message || 'Payment Error' });
  }
});

// POST /api/orders/verify-payment - Verify signature and place real order
router.post('/verify-payment', protect, authorize('Buyer'), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items } = req.body;

    const payload = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                    .update(payload)
                                    .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    const orders = [];
    const orderedItemsForEmail = []; // To store details for the email

    for (const item of items) {
      const artwork = await Artwork.findById(item.artwork_id);
      if (!artwork || artwork.status === 'Sold') continue;

      const order = await Order.create({
        buyer_id: req.user._id,
        artwork_id: artwork._id,
        total_amount: artwork.price,
        status: 'Completed',
      });
      artwork.status = 'Sold';
      await artwork.save();
      orders.push(order);
      orderedItemsForEmail.push({
        title: artwork.title,
        price: artwork.price,
        orderId: order._id.toString()
      });
    }

    // Generate HTML for the ordered items
    const itemsHtml = orderedItemsForEmail.map(item => `
      <div style="border-bottom: 1px solid #e5e7eb; padding: 12px 0;">
        <p style="margin: 0; font-weight: bold; color: #111827; font-size: 16px;">${item.title}</p>
        <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Order ID: ${item.orderId}</p>
        <p style="margin: 4px 0 0; color: #111827; font-weight: 500;">₹${item.price.toLocaleString('en-IN')}</p>
      </div>
    `).join('');

    // Send Email Notification
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h1 style="color: #111827; text-align: center;">Order Confirmed!</h1>
        <p style="color: #4b5563;">Hello ${req.user.name},</p>
        <p style="color: #4b5563;">Thank you for your purchase. We have successfully processed your payment of ₹${orders.reduce((acc, o) => acc + o.total_amount, 0).toLocaleString('en-IN')}.</p>
        
        <div style="margin: 24px 0; background-color: #f9fafb; padding: 16px; border-radius: 6px; border: 1px solid #f3f4f6;">
          <h3 style="margin-top: 0; margin-bottom: 12px; color: #111827; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Order Details</h3>
          ${itemsHtml}
        </div>

        <p style="color: #4b5563;">Your newly acquired artworks are now listed in your orders dashboard.</p>
        <div style="text-align: center;">
          <a href="http://localhost:5173/profile" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">View Your Collection</a>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center;">M-Art Marketplace</p>
      </div>
    `;

    // Fire & Forget (don't await so we don't slow down the response)
    sendEmail({
      email: req.user.email,
      subject: 'M-Art Order Confirmation & Receipt',
      html: emailHtml
    }).catch(console.error);

    res.status(201).json({ message: 'Payment verified and order placed', orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/my — Buyer: own orders
router.get('/my', protect, authorize('Buyer'), async (req, res) => {
  try {
    const orders = await Order.find({ buyer_id: req.user._id })
      .populate('artwork_id', 'title price image_url category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/artist — Artist: orders of their artworks
router.get('/artist', protect, authorize('Artist'), async (req, res) => {
  try {
    const artworkIds = await Artwork.find({ artist_id: req.user._id }).select('_id');
    const orders = await Order.find({ artwork_id: { $in: artworkIds.map((a) => a._id) } })
      .populate('buyer_id', 'name email')
      .populate('artwork_id', 'title price image_url')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders — Admin: all orders
router.get('/', protect, authorize('Admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('buyer_id', 'name email')
      .populate('artwork_id', 'title price image_url')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/stats — Admin: aggregate analytics
router.get('/stats', protect, authorize('Admin'), async (req, res) => {
  try {
    const revenueStats = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total_amount' }, totalOrders: { $sum: 1 } } }
    ]);
    
    // Revenue by category
    const categoryStats = await Order.aggregate([
      { $match: { status: 'Completed' } },
      {
        $lookup: {
          from: 'artworks',
          localField: 'artwork_id',
          foreignField: '_id',
          as: 'artwork'
        }
      },
      { $unwind: '$artwork' },
      {
        $group: {
          _id: '$artwork.category',
          revenue: { $sum: '$total_amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const totalRevenue = revenueStats[0]?.totalRevenue || 0;
    const totalOrders = revenueStats[0]?.totalOrders || 0;

    res.json({ totalRevenue, totalOrders, categoryStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
