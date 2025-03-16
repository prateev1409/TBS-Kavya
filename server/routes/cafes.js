const express = require('express');
const router = express.Router();
const Cafe = require('../models/Cafe');
const User = require('../models/User');

// Middleware to verify JWT (already implemented)
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

// Middleware to check cafe owner role and ownership
const cafeOwnerMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'cafe') {
            return res.status(403).json({ error: 'Cafe owner access required' });
        }
        const { cafe_id } = req.params;
        if (user.user_id !== cafe_id) {
            return res.status(403).json({ error: 'You can only modify your own cafe' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/cafes - Retrieve list of cafes with filtering
router.get('/', async (req, res) => {
    try {
        const { location, ratings } = req.query;
        let query = {};

        if (location) query.location = new RegExp(location, 'i'); // Case-insensitive search
        if (ratings) query.ratings = { $gte: parseInt(ratings) };

        const cafes = await Cafe.find(query);
        res.status(200).json(cafes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/cafes/:cafe_id - Retrieve a specific cafe
router.get('/:cafe_id', async (req, res) => {
    try {
        const { cafe_id } = req.params;
        const cafe = await Cafe.findOne({ cafe_id });
        if (!cafe) {
            return res.status(404).json({ error: 'Cafe not found' });
        }
        res.status(200).json(cafe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/cafes - Create a new cafe (admin-only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const {
            name,
            location,
            average_bill,
            discount,
            ratings,
            specials,
        } = req.body;

        // Generate unique cafe_id (e.g., CAFE001)
        let cafe_id = 'CAFE001';
        let count = 1;
        while (await Cafe.findOne({ cafe_id })) {
            count++;
            cafe_id = `CAFE${count.toString().padStart(3, '0')}`;
        }

        const cafe = new Cafe({
            cafe_id,
            name,
            location,
            average_bill: average_bill || 0,
            discount: discount || 0,
            ratings: ratings || 0,
            specials,
        });

        await cafe.save();
        res.status(201).json({ message: 'Cafe created successfully', cafe });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/cafes/:cafe_id - Update a cafe (admin or cafe owner)
router.put('/:cafe_id', authMiddleware, async (req, res) => {
    try {
        const { cafe_id } = req.params;
        const updates = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Allow update if user is admin or cafe owner of this cafe
        if (user.role !== 'admin' && (user.role !== 'cafe' || user.user_id !== cafe_id)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const cafe = await Cafe.findOne({ cafe_id });
        if (!cafe) {
            return res.status(404).json({ error: 'Cafe not found' });
        }

        Object.assign(cafe, updates);
        await cafe.save();

        res.status(200).json({ message: 'Cafe updated successfully', cafe });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/cafes/:cafe_id - Delete a cafe (admin-only)
router.delete('/:cafe_id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { cafe_id } = req.params;
        const cafe = await Cafe.findOne({ cafe_id });
        if (!cafe) {
            return res.status(404).json({ error: 'Cafe not found' });
        }

        await cafe.remove();
        res.status(200).json({ message: 'Cafe deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;