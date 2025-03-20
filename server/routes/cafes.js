const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Cafe = require('../models/Cafe');
const User = require('../models/User');

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No token provided or invalid format');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded);
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
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
        console.log('User found in adminMiddleware:', user);
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
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .trim(),
        body('location')
            .notEmpty()
            .withMessage('Location is required')
            .trim(),
        body('average_bill')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Average bill must be a positive number'),
        body('discount')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Discount must be a positive number'),
        body('ratings')
            .optional()
            .isFloat({ min: 0, max: 5 })
            .withMessage('Ratings must be between 0 and 5'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, location, average_bill, discount, ratings, specials } = req.body;

            // Generate a unique cafe_id
            const cafeCount = await Cafe.countDocuments();
            const cafeIdNumber = cafeCount + 1;
            const cafe_id = `cafe_${String(cafeIdNumber).padStart(3, '0')}`; // e.g., cafe_001, cafe_002, etc.

            const cafe = new Cafe({
                cafe_id, // Add the generated cafe_id
                name,
                location,
                average_bill: average_bill || 0,
                discount: discount || 0,
                ratings: ratings || 0,
                specials,
            });

            await cafe.save();
            console.log('Cafe created:', cafe);
            res.status(201).json({ message: 'Cafe created successfully', cafe });
        } catch (err) {
            console.error('Error creating cafe:', err.message);
            res.status(500).json({ error: err.message });
        }
    }
);

// PUT /api/cafes/:cafe_id - Update a cafe (admin-only)
router.put(
    '/:cafe_id',
    authMiddleware,
    adminMiddleware,
    [
        body('name')
            .optional()
            .notEmpty()
            .withMessage('Name cannot be empty')
            .trim(),
        body('location')
            .optional()
            .notEmpty()
            .withMessage('Location cannot be empty')
            .trim(),
        body('average_bill')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Average bill must be a positive number'),
        body('discount')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Discount must be a positive number'),
        body('ratings')
            .optional()
            .isFloat({ min: 0, max: 5 })
            .withMessage('Ratings must be between 0 and 5'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

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

            console.log('Cafe updated:', cafe);
            res.status(200).json({ message: 'Cafe updated successfully', cafe });
        } catch (err) {
            console.error('Error updating cafe:', err.message);
            res.status(500).json({ error: err.message });
        }
    }
);

// DELETE /api/cafes/:cafe_id - Delete a cafe (admin-only)
router.delete('/:cafe_id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { cafe_id } = req.params;
        const cafe = await Cafe.findOne({ cafe_id });
        if (!cafe) {
            return res.status(404).json({ error: 'Cafe not found' });
        }

        await cafe.deleteOne();
        console.log('Cafe deleted:', cafe);
        res.status(200).json({ message: 'Cafe deleted successfully' });
    } catch (err) {
        console.error('Error deleting cafe:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;