const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
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

// GET /api/books - Retrieve list of books with case-insensitive filtering
router.get('/', async (req, res) => {
    try {
        const { genre, author, language } = req.query;
        let query = {};

        if (genre) query.genre = { $regex: genre, $options: 'i' };
        if (author) query.author = { $regex: author, $options: 'i' };
        if (language) query.language = { $regex: language, $options: 'i' };

        const books = await Book.find(query);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/books/filters - Retrieve unique values for filters
router.get('/filters', async (req, res) => {
    try {
        const authors = await Book.distinct('author');
        const publishers = await Book.distinct('publisher');
        const genres = await Book.distinct('genre');
        const languages = await Book.distinct('language');

        res.status(200).json({ authors, publishers, genres, languages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/books/:book_id - Retrieve a specific book
router.get('/:book_id', async (req, res) => {
    try {
        const { book_id } = req.params;
        const book = await Book.findOne({ book_id });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/books - Create a new book (admin-only)
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    [
        body('name').notEmpty().withMessage('name is required').trim(),
        body('author').notEmpty().withMessage('author is required').trim(),
        body('language').notEmpty().withMessage('language is required').trim(),
        body('ratings').optional().isInt({ min: 0, max: 5 }).withMessage('ratings must be between 0 and 5'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
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
                ratings,
                is_free,
                available,
                keeper_id,
            } = req.body;

            const book = new Book({
                name,
                author,
                language,
                publisher,
                genre,
                description,
                image_url,
                audio_url,
                ratings: ratings || 0,
                is_free: is_free || false,
                available: available !== undefined ? available : true,
                keeper_id: keeper_id || null,
            });

            await book.save();
            res.status(201).json({ message: 'Book created successfully', book });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// PUT /api/books/:book_id - Update a book (admin-only)
router.put('/:book_id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { book_id } = req.params;
        const updates = req.body;

        const book = await Book.findOne({ book_id });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        Object.assign(book, updates);
        book.updatedAt = Date.now();
        await book.save();

        res.status(200).json({ message: 'Book updated successfully', book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/books/:book_id - Delete a book (admin-only)
router.delete('/:book_id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { book_id } = req.params;
        const book = await Book.findOne({ book_id });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        await book.deleteOne();
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;