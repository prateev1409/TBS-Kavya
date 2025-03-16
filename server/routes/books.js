const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
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

// GET /api/books - Retrieve list of books with filtering
router.get('/', async (req, res) => {
    try {
        const { genre, author, language } = req.query;
        let query = {};

        if (genre) query.genre = genre;
        if (author) query.author = author;
        if (language) query.language = language;

        const books = await Book.find(query);
        res.status(200).json(books);
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
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
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
        } = req.body;

        // Generate unique book_id (e.g., first letters of name + number)
        const getFirstLetters = (str) => str.split(' ').map(word => word[0]).join('').toUpperCase();
        const baseId = getFirstLetters(name);
        let book_id = baseId + '1';
        let count = 1;

        while (await Book.findOne({ book_id })) {
            count++;
            book_id = `${baseId}${count}`;
        }

        const book = new Book({
            book_id,
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
            keeper_type: 'cafe', // Default to cafe ownership
            keeper_id: null,
        });

        await book.save();
        res.status(201).json({ message: 'Book created successfully', book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

        await book.remove();
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;