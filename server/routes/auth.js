const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseAdmin');

router.post('/register', async (req, res) => {
    try {
        const { name, phone_number, email, password } = req.body;

        // Server-side validation
        if (!name || !phone_number || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (password.length < 8 || !/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({ message: "Password must be 8+ characters with a special character" });
        }
        if (!/^\d{10}$/.test(phone_number)) {
            return res.status(400).json({ message: "Phone number must be 10 digits" });
        }
        // Check if the user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // Generate a unique user_id
        let count = await User.countDocuments();
        let user_id = `User_${String(count + 1).padStart(3, '0')}`; // e.g., User_001, User_002, ...

        // Create a new user
        const newUser = new User({
           user_id,
            name,
            phone_number,
            email,
            password,
            role: 'user'
        });

        // Save to database
        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ message: "User registered successfully!", token });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error" });
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
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log('Generated token:', token); // Debug log
        res.status(200).json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/google', async (req, res) => {
    try {
        const { idToken, name, email, phone_number } = req.body;

        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (decodedToken.email !== email) {
            return res.status(400).json({ message: 'Email mismatch' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            // Register new user
            if (!name || !email || !phone_number) {
                return res.status(400).json({ message: 'Name, email, and phone number are required' });
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
            if (!/^\d{10}$/.test(phone_number)) {
                return res.status(400).json({ message: "Phone number must be 10 digits" });
            }

            let count = await User.countDocuments();
            let user_id = `User_${String(count + 1).padStart(3, '0')}`;

            user = new User({
                user_id,
                name,
                phone_number,
                email,
                password: null, // No password for Google users
                role: 'user'
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ 
            token, 
            user: { id: user._id, email: user.email, role: user.role },
            message: user.password ? "Logged in with Google" : "Registered and logged in with Google"
        });
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        res.status(500).json({ message: 'Internal server error' });
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

        // Create a new admin user
        const newUser = new User({
            user_id,
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
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ message: "Admin user registered successfully!", token });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/refresh-token', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No token provided or invalid format');
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token received for refresh:', token);

    try {
        // Verify the token (ignore expiration for refresh purposes)
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('User not found for token:', decoded.id);
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a new token with fresh timestamps
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const newToken = jwt.sign(
            { id: user._id, role: user.role, iat: currentTime },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log('Refreshed token:', newToken);
        res.status(200).json({ token: newToken });
    } catch (err) {
        console.error('Token refresh failed:', err.message);
        res.status(401).json({ error: 'Invalid token: ' + err.message });
    }
});

module.exports = router;