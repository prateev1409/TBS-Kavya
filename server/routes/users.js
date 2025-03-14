const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user (email, phone)
router.put('/update-user', authMiddleware, async (req, res) => {
  const { email, phone } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (email) user.email = email;
    if (phone) user.phone_number = phone;
    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create subscription
router.post('/create-subscription', authMiddleware, async (req, res) => {
  const { tier } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.subscription_type = tier;
    user.subscription_validity = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days validity
    await user.save();
    res.json({ message: 'Subscription created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;