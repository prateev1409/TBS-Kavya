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

// GET /api/admin/inventory - Retrieve detailed book inventory
router.get('/inventory', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Fetch all books with keeper information
        const books = await Book.find().populate('keeper_id', 'name -_id'); // Populate keeper name if user or cafe

        // Format the response to include meaningful keeper details
        const inventory = books.map(book => ({
            book_id: book.book_id,
            name: book.name,
            keeper_type: book.keeper_type,
            keeper: book.keeper_type === 'user' 
                ? (book.keeper_id ? book.keeper_id.name : 'Unknown User') 
                : (book.keeper_id ? book.keeper_id : 'No Cafe Assigned'),
            last_modified: book.last_modified,
        }));

        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/admin/books - Manually add a new book (admin-only)
router.post('/books', authMiddleware, adminMiddleware, async (req, res) => {
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
        res.status(201).json({ message: 'Book added successfully', book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;