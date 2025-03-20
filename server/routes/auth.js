const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { name, phone_number, email, password } = req.body;
  try {
    const user = new User({ name, phone_number, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ error: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Invalid credentials' });
      }
      console.log('User found:', user); // Debug log
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Generated token:', token); // Debug log
      res.status(200).json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
router.post('/logout', (req, res) => {
  // Client-side will handle token removal
  res.json({ message: 'Logged out successfully' });
});

router.post('/signup-admin', async (req, res) => {
  try {
      const { name, phone_number, email, password, subscription_type } = req.body;

      // Check if the user already exists
      let existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "User with this email already exists." });
      }

      // Generate a unique user_id
      let count = await User.countDocuments();
      let user_id = `User_${String(count + 1).padStart(3, '0')}`; // e.g., User_001, User_002, ...

      // Hash the password
      //const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new admin user
      const newUser = new User({
          user_id, // <-- Now user_id is explicitly assigned
          name,
          phone_number,
          email,
          password,
          subscription_type: subscription_type || 'premium',
          role: 'admin'
      });

      // Save to database
      await newUser.save();

      // Generate JWT Token
      const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ message: "Admin user registered successfully!", token });
  } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;