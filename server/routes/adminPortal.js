const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');
const User = require('../models/User');
const Cafe = require('../models/Cafe');
const Transaction = require('../models/Transaction'); // Add this line

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Received token:', authHeader); // Debug log
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No token provided or invalid format');
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message); // Debug log
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to check admin role
const adminMiddleware = async (req, res, next) => {
    try {
        console.log('User ID from token:', req.userId); // Debug log
        const user = await User.findById(req.userId);
        console.log('User found in adminMiddleware:', user); // Debug log
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (err) {
        console.error('Admin middleware error:', err.message); // Debug log
        return res.status(500).json({ error: 'Server error in admin middleware' });
    }
};

// GET /api/admin/inventory - Retrieve detailed book inventory
router.get('/inventory', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const books = await Book.find();
        console.log('Books fetched:', books); // Debug log
        const inventory = books.map(book => ({
            id: book.book_id,
            is_free: book.is_free,
            name: book.name,
            author: book.author,
            language: book.language,
            publisher: book.publisher,
            genre: book.genre,
            description: book.description,
            image_url: book.image_url,
            audio_url: book.audio_url,
            pdf_url: book.pdf_url,
            ratings: book.ratings,
            available: book.available,
            keeper_id: book.keeper_id || '',
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
        }));

        return res.status(200).json(inventory);
    } catch (err) {
        console.error('Error fetching inventory:', err.message); // Debug log
        return res.status(500).json({ error: 'Failed to fetch book inventory' });
    }
});

// Function to generate book_id in the format <Initials>_<Number>
const generateBookId = async (bookName) => {
    // Step 1: Extract initials from the book name
    const words = bookName.trim().split(/\s+/); // Split by whitespace
    const initials = words
        .map(word => word.charAt(0).toUpperCase()) // Take the first letter of each word and capitalize it
        .join(''); // Join the letters (e.g., "Dodo The Duck" → "DTD")

    // Step 2: Count existing books with the same initials (both old and new formats)
    const regexNewFormat = new RegExp(`^${initials}_\\d+$`); // Match new format like "DTD_1"
    const regexOldFormat = new RegExp(`^${initials}\\d+$`); // Match old format like "DTD1"
    const countNewFormat = await Book.countDocuments({ book_id: regexNewFormat });
    const countOldFormat = await Book.countDocuments({ book_id: regexOldFormat });

    // Step 3: Generate the next number (total count + 1)
    const totalCount = countNewFormat + countOldFormat;
    const nextNumber = totalCount + 1; // No padding, just the number (e.g., 1, 2, 3, ...)

    // Step 4: Generate the book_id with an underscore
    const bookId = `${initials}_${nextNumber}`; // e.g., "DTD_1"

    return bookId;
};

// POST /api/admin/books - Manually add a new book (admin-only)
router.post(
    '/books',
    authMiddleware,
    adminMiddleware,
    [
        body('name')
            .notEmpty()
            .withMessage('name is required')
            .trim()
            .matches(/^[A-Za-z\s]+$/)
            .withMessage('name must contain only letters and spaces'),
        body('author').notEmpty().withMessage('author is required').trim(),
        body('language').notEmpty().withMessage('language is required').trim(),
        body('ratings').optional().isInt({ min: 0, max: 5 }).withMessage('ratings must be between 0 and 5'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array()); // Debug log
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const {
                name,
                author,
                language,
                publisher,
                genre,
                description,
                image_url,
                audio_url,
                pdf_url,
                ratings,
                is_free,
                available,
                keeper_id,
            } = req.body;

            console.log('Received book data:', req.body); // Debug log

            // Generate the book_id
            const bookId = await generateBookId(name);
            console.log('Generated book_id:', bookId); // Debug log

            const book = new Book({
                book_id: bookId, // Set the generated book_id
                name,
                author,
                language,
                publisher,
                genre,
                description,
                image_url,
                audio_url,
                pdf_url,
                ratings: ratings || 0,
                is_free: is_free || false,
                available: available !== undefined ? available : true,
                keeper_id: keeper_id || null,
            });

            await book.save();
            console.log('Book saved:', book); // Debug log
            return res.status(201).json({ message: 'Book added successfully', book });
        } catch (err) {
            console.error('Error adding book:', err.message); // Debug log
            return res.status(500).json({ error: 'Failed to add book: ' + err.message });
        }
    }
);

// PUT /api/admin/transactions/approve/:transaction_id - Approve a transaction (admin-only)
router.put(
    '/transactions/approve/:transaction_id',
    authMiddleware,
    adminMiddleware,
    [
        body('book_id').notEmpty().withMessage('book_id is required').trim(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { transaction_id } = req.params;
        const { book_id } = req.body;

        try {
            // Find the transaction
            const transaction = await Transaction.findOne({ transaction_id });
            if (!transaction) {
                console.log(`Transaction not found: ${transaction_id}`);
                return res.status(404).json({ error: 'Transaction not found' });
            }

            // Check if transaction is in pickup_pending state
            if (transaction.status !== 'pickup_pending') {
                console.log(`Transaction ${transaction_id} is not in pickup_pending state`);
                return res.status(400).json({ error: 'Transaction must be in pickup_pending state to approve' });
            }

            // Find the book by book_id
            const book = await Book.findOne({ book_id });
            if (!book) {
                console.log(`Book not found: ${book_id}`);
                return res.status(404).json({ error: 'Book not found' });
            }

            // Find the user associated with the transaction
            const user = await User.findById(transaction.user_id);
            if (!user) {
                console.log(`User not found for transaction: ${transaction_id}`);
                return res.status(404).json({ error: 'User not found' });
            }

            // Update transaction status
            transaction.book_id = book._id; // Update book_id to the correct ObjectId
            transaction.status = 'picked_up';
            transaction.processed_at = new Date();
            await transaction.save();

            // Update book
            book.available = false;
            book.keeper_id = user.user_id;
            book.updatedAt = new Date();
            await book.save();

            // Update user
            user.book_id = book.book_id;
            user.updatedAt = new Date();
            await user.save();

            console.log(`Transaction ${transaction_id} approved successfully`);
            return res.status(200).json({ message: 'Transaction approved successfully', transaction });
        } catch (err) {
            console.error('Error approving transaction:', err.message);
            return res.status(500).json({ error: 'Failed to approve transaction: ' + err.message });
        }
    }
);

module.exports = router;