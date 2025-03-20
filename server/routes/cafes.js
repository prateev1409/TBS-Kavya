const express = require('express');
const router = express.Router();
const Cafe = require('../models/Cafe');
const User = require('../models/User');

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

// GET /api/cafes - Retrieve list of cafes with case-insensitive filtering
router.get('/', async (req, res) => {
    try {
        const { location, average_bill, ratings } = req.query;
        let query = {};

        if (location) query.location = { $regex: location, $options: 'i' };
        if (average_bill) query.average_bill = Number(average_bill);
        if (ratings) query.ratings = Number(ratings);

        const cafes = await Cafe.find(query);
        res.status(200).json(cafes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/cafes/filters - Retrieve unique values for filters
router.get('/filters', async (req, res) => {
    try {
        const locations = await Cafe.distinct('location');
        const average_bills = await Cafe.distinct('average_bill');
        const ratings = await Cafe.distinct('ratings');

        res.status(200).json({ locations, average_bills, ratings });
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
        const { name, location, average_bill, discount, ratings, specials } = req.body;

        const cafe = new Cafe({
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

// PUT /api/cafes/:cafe_id - Update a cafe (admin-only)
router.put('/:cafe_id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { cafe_id } = req.params;
        const updates = req.body;

        const cafe = await Cafe.findOne({ cafe_id });
        if (!cafe) {
            return res.status(404).json({ error: 'Cafe not found' });
        }

        Object.assign(cafe, updates);
        cafe.updatedAt = Date.now();
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

        await cafe.deleteOne();
        res.status(200).json({ message: 'Cafe deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;