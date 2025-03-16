const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
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

// Middleware to check cafe owner role and ownership
const cafeOwnerMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'cafe' && user.role !== 'admin') {
            return res.status(403).json({ error: 'Cafe owner or admin access required' });
        }
        const { cafe_id } = req.params;
        if (user.role === 'cafe' && user.user_id !== cafe_id) {
            return res.status(403).json({ error: 'You can only access your own cafe' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/cafe/:cafe_id/requests - Retrieve pending transactions for the cafe
router.get('/:cafe_id/requests', authMiddleware, cafeOwnerMiddleware, async (req, res) => {
    try {
        const { cafe_id } = req.params;

        // Verify the cafe exists
        const cafe = await Cafe.findOne({ cafe_id });
        if (!cafe) {
            return res.status(404).json({ error: 'Cafe not found' });
        }

        // Find pending transactions (pickup_pending or dropoff_pending)
        const transactions = await Transaction.find({
            cafe_id,
            status: { $in: ['pickup_pending', 'dropoff_pending'] },
        }).populate('book_id user_id');

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/cafe/:cafe_id/discounts - Retrieve discount benefits for the cafe
router.get('/:cafe_id/discounts', authMiddleware, cafeOwnerMiddleware, async (req, res) => {
    try {
        const { cafe_id } = req.params;

        // Verify the cafe exists
        const cafe = await Cafe.findOne({ cafe_id });
        if (!cafe) {
            return res.status(404).json({ error: 'Cafe not found' });
        }

        // Return the discount benefits (could be expanded based on subscription tiers)
        const discountBenefits = {
            cafe_id: cafe.cafe_id,
            name: cafe.name,
            discount: cafe.discount,
            message: `This cafe offers a ${cafe.discount}% discount based on user subscription tier.`,
        };

        res.status(200).json(discountBenefits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;