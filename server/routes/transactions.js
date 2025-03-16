const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // Add this line
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
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

// POST /api/transactions - Create a new transaction (pickup request)
router.post(
    '/',
    authMiddleware,
    [
        body('book_id').notEmpty().withMessage('book_id is required').trim(),
        body('cafe_id').notEmpty().withMessage('cafe_id is required').trim(),
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { book_id, cafe_id } = req.body;

        try {
            // Verify the book exists and is available
            const book = await Book.findOne({ book_id });
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }
            if (book.keeper_type === 'user') {
                return res.status(400).json({ error: 'Book is currently with a user' });
            }

            // Verify the cafe exists
            const cafe = await Cafe.findOne({ cafe_id });
            if (!cafe) {
                return res.status(404).json({ error: 'Cafe not found' });
            }

            // Verify the user exists
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Check if user already has a book (based on subscription limits)
            if (user.book_id && user.subscription_type === 'basic') {
                return res.status(400).json({ error: 'Basic subscription allows only one book at a time' });
            }

            // Generate a unique transaction_id (manual increment for simplicity)
            const lastTransaction = await Transaction.findOne().sort({ transaction_id: -1 });
            const transaction_id = lastTransaction ? lastTransaction.transaction_id + 1 : 1;

            // Create the transaction
            const transaction = new Transaction({
                transaction_id,
                book_id,
                user_id: user.user_id,
                cafe_id,
                status: 'pickup_pending',
            });

            await transaction.save();

            res.status(201).json({ message: 'Pickup request created successfully', transaction });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// POST /api/transactions/scan/book/:book_id - Verify book QR code
router.post('/scan/book/:book_id', authMiddleware, async (req, res) => {
    const { book_id } = req.params;

    try {
        // Verify the book exists
        const book = await Book.findOne({ book_id });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        if (book.keeper_type === 'user') {
            return res.status(400).json({ error: 'Book is currently with a user' });
        }

        // Find a pending transaction for this book
        const transaction = await Transaction.findOne({ book_id, status: 'pickup_pending' });
        if (!transaction) {
            return res.status(404).json({ error: 'No pending transaction found for this book' });
        }

        res.status(200).json({ message: 'Book verified successfully', transaction_id: transaction.transaction_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/transactions/scan/user/:user_id - Verify user QR code and approve transaction
router.post('/scan/user/:user_id', authMiddleware, async (req, res) => {
    const { user_id } = req.params;

    try {
        // Verify the user exists
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the authenticated user's transaction (should match scanned user_id)
        const transaction = await Transaction.findOne({ user_id, status: 'pickup_pending' });
        if (!transaction) {
            return res.status(404).json({ error: 'No pending transaction found for this user' });
        }

        // Verify the book is still available
        const book = await Book.findOne({ book_id: transaction.book_id });
        if (!book || book.keeper_type === 'user') {
            return res.status(400).json({ error: 'Book is no longer available' });
        }

        // Approve the transaction
        transaction.status = 'picked_up';
        transaction.processed_at = new Date();
        await transaction.save();

        // Update the book
        book.keeper_type = 'user';
        book.keeper_id = user.user_id;
        await book.save();

        // Update the user
        user.book_id = transaction.book_id;
        user.book_pickup_time = new Date();
        await user.save();

        res.status(200).json({ message: 'Transaction approved, book picked up successfully', transaction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/transactions/drop-off/:book_id - Initiate drop-off process
router.put('/drop-off/:book_id', authMiddleware, async (req, res) => {
    const { book_id } = req.params;
    const { cafe_id } = req.body;

    try {
        // Validate request body
        if (!cafe_id) {
            return res.status(400).json({ error: 'cafe_id is required' });
        }

        // Verify the user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify the book exists and is with the user
        const book = await Book.findOne({ book_id });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        if (book.keeper_type !== 'user' || book.keeper_id !== user.user_id) {
            return res.status(400).json({ error: 'Book is not currently with this user' });
        }

        // Find the transaction for this book and user
        const transaction = await Transaction.findOne({ book_id, user_id: user.user_id, status: 'picked_up' });
        if (!transaction) {
            return res.status(404).json({ error: 'No active transaction found for this book' });
        }

        // Verify the cafe exists
        const cafe = await Cafe.findOne({ cafe_id });
        if (!cafe) {
            return res.status(404).json({ error: 'Cafe not found' });
        }

        // Update transaction to dropoff_pending
        transaction.status = 'dropoff_pending';
        transaction.cafe_id = cafe_id;
        transaction.processed_at = new Date();
        await transaction.save();

        res.status(200).json({ message: 'Drop-off request initiated successfully', transaction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/transactions/complete/:transaction_id - Complete drop-off process
router.put('/complete/:transaction_id', authMiddleware, async (req, res) => {
    const { transaction_id } = req.params;

    try {
        // Find the transaction
        const transaction = await Transaction.findOne({ transaction_id, status: 'dropoff_pending' });
        if (!transaction) {
            return res.status(404).json({ error: 'No pending drop-off transaction found' });
        }

        // Verify the book
        const book = await Book.findOne({ book_id: transaction.book_id });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Verify the user
        const user = await User.findOne({ user_id: transaction.user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update transaction to dropped_off
        transaction.status = 'dropped_off';
        transaction.processed_at = new Date();
        await transaction.save();

        // Reset book ownership
        book.keeper_type = 'cafe';
        book.keeper_id = transaction.cafe_id;
        await book.save();

        // Clear user's book assignment
        user.book_id = null;
        user.book_pickup_time = null;
        await user.save();

        res.status(200).json({ message: 'Book drop-off completed successfully', transaction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;