const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

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

// GET /api/client/books - Retrieve list of books with filtering and availability
router.get('/books', authMiddleware, async (req, res) => {
    try {
        const { genre, author, language, availableOnly } = req.query;
        let query = {};

        if (genre) query.genre = genre;
        if (author) query.author = author;
        if (language) query.language = language;
        if (availableOnly === 'true') {
            query.keeper_type = 'cafe'; // Only show books available at cafes
            query.keeper_id = null; // No keeper_id means available
        }

        const books = await Book.find(query);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/client/reservations - Retrieve current reservations for the user
router.get('/reservations', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('book_id');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find active transaction (picked_up status)
        const transaction = await Transaction.findOne({
            user_id: user.user_id,
            status: 'picked_up',
        }).populate('book_id');

        const reservations = transaction ? [transaction] : [];
        res.status(200).json({ reservations, currentBook: user.book_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;