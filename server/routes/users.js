const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Add this import

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

// Middleware to check admin role
const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/users/profile - Retrieve the authenticated user's profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            subscription_type: user.subscription_type,
            subscription_validity: user.subscription_validity,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users - Retrieve list of users with case-insensitive filtering
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { subscription_type, role } = req.query;
        let query = {};

        if (subscription_type) query.subscription_type = { $regex: subscription_type, $options: 'i' };
        if (role) query.role = { $regex: role, $options: 'i' };

        const users = await User.find(query);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/filters - Retrieve unique values for filters
router.get('/filters', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const subscription_types = await User.distinct('subscription_type');
        const roles = await User.distinct('role');

        res.status(200).json({ subscription_types, roles });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/:user_id - Retrieve a specific user
router.get('/:user_id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/users - Create a new user (admin-only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, email, phone_number, password, subscription_type, role } = req.body;

        const user = new User({
            name,
            email,
            phone_number,
            password,
            subscription_type: subscription_type || 'basic',
            role: role || 'user',
            subscription_validity: new Date(),
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/users/:user_id - Update a user (admin-only)
router.put('/:user_id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { user_id } = req.params;
        const updates = req.body;

        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        Object.assign(user, updates);
        user.updatedAt = Date.now();
        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/users/:user_id - Delete a user (admin-only)
router.delete('/:user_id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/users/create-subscription - Create or update user subscription
router.post('/create-subscription', authMiddleware, async (req, res) => {
    try {
        const { tier } = req.body;
        if (!['basic', 'standard', 'premium'].includes(tier)) {
            return res.status(400).json({ error: 'Invalid subscription tier' });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.subscription_type = tier;
        user.subscription_validity = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year validity
        user.updatedAt = Date.now();
        await user.save();

        res.status(200).json({ message: 'Subscription updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;