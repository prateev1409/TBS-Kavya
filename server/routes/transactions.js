const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Cafe = require('../models/Cafe');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

// GET /api/transactions - Retrieve list of transactions with case-insensitive filtering
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) query.status = { $regex: status, $options: 'i' };

    const transactions = await Transaction.find(query)
      .populate('book_id')
      .populate('user_id')
      .populate('cafe_id');
    res.status(200).json(transactions);
  } catch (err) {
    logger.error(`Error fetching transactions: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/filters - Retrieve unique values for filters
router.get('/filters', authMiddleware, async (req, res) => {
  try {
    const statuses = await Transaction.distinct('status');
    res.status(200).json({ statuses });
  } catch (err) {
    logger.error(`Error fetching transaction filters: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/transactions - Create a new transaction (pickup request)
router.post(
  '/',
  authMiddleware,
  [
    body('book_id').notEmpty().withMessage('book_id is required').trim(),
    body('cafe_id').notEmpty().withMessage('cafe_id is required').trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error on POST /api/transactions: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }

    const { book_id, cafe_id } = req.body;

    try {
      // Find the book by book_id and get its ObjectId
      const book = await Book.findOne({ book_id });
      if (!book) {
        logger.warn(`Book not found: ${book_id}`);
        return res.status(404).json({ error: 'Book not found' });
      }
      if (!book.available) {
        logger.warn(`Book unavailable: ${book_id}`);
        return res.status(400).json({ error: 'Book is currently unavailable' });
      }

      // Find the cafe by cafe_id and get its ObjectId
      const cafe = await Cafe.findOne({ cafe_id });
      if (!cafe) {
        logger.warn(`Cafe not found: ${cafe_id}`);
        return res.status(404).json({ error: 'Cafe not found' });
      }

      // Find the user by userId (from JWT) and get their ObjectId
      const user = await User.findById(req.userId);
      if (!user) {
        logger.warn(`User not found: ${req.userId}`);
        return res.status(404).json({ error: 'User not found' });
      }

      // Check subscription limit for basic users
      if (user.book_id && user.subscription_type === 'basic') {
        logger.warn(`Subscription limit exceeded for user: ${user.user_id}`);
        return res.status(400).json({ error: 'Basic subscription allows only one book at a time' });
      }

      // Create the transaction
      const transactionData = {
        book_id: book._id,
        user_id: user._id,
        cafe_id: cafe._id,
        status: 'pickup_pending',
      };

      // Fallback: Generate transaction_id if not set by the pre-save hook
      if (!transactionData.transaction_id) {
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 5;

        while (!isUnique && attempts < maxAttempts) {
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const newTransactionId = `TXN_${timestamp}_${randomStr}`;

          console.log(`Fallback - Attempt ${attempts + 1}: Checking uniqueness of transaction_id: ${newTransactionId}`);
          const existingTransaction = await Transaction.findOne({ transaction_id: newTransactionId });
          if (!existingTransaction) {
            transactionData.transaction_id = newTransactionId;
            isUnique = true;
          }
          attempts++;
        }

        if (!isUnique) {
          throw new Error('Failed to generate a unique transaction_id after multiple attempts');
        }
        console.log('Fallback - Generated transaction_id:', transactionData.transaction_id);
      }

      const transaction = new Transaction(transactionData);
      console.log('Transaction before save:', transaction);

      await transaction.save();
      logger.info(`Transaction created successfully: ${transaction.transaction_id} for user: ${user.user_id}`);

      // Update book availability
      book.available = false;
      book.updatedAt = Date.now();
      await book.save();

      // Update user to track the book they have
      user.book_id = book.book_id;
      user.updatedAt = Date.now();
      await user.save();

      res.status(201).json({ message: 'Pickup request created successfully', transaction });
    } catch (err) {
      logger.error(`Error creating transaction: ${err.message}, Stack: ${err.stack}`);
      res.status(500).json({ error: `Failed to create transaction: ${err.message}` });
    }
  }
);

// POST /api/transactions/scan/book/:book_id - Verify book QR code
router.post('/scan/book/:book_id', authMiddleware, async (req, res) => {
  const { book_id } = req.params;

  try {
    const book = await Book.findOne({ book_id });
    if (!book) {
      logger.warn(`Book not found during scan: ${book_id}`);
      return res.status(404).json({ error: 'Book not found' });
    }
    /*if (!book.available) {
      logger.warn(`Book unavailable during scan: ${book_id}`);
      return res.status(400).json({ error: 'Book is currently unavailable' });
    }*/

    const transaction = await Transaction.findOne({ book_id: book._id, status: 'pickup_pending' });
    if (!transaction) {
      logger.warn(`No pending transaction for book: ${book_id}`);
      return res.status(404).json({ error: 'No pending transaction found for this book' });
    }

    logger.info(`Book QR code verified successfully: ${book_id}, transaction: ${transaction.transaction_id}`);
    res.status(200).json({ message: 'Book verified successfully', transaction_id: transaction.transaction_id });
  } catch (err) {
    logger.error(`Error scanning book QR code: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/transactions/scan/user/:user_id - Verify user QR code and approve transaction
router.post('/scan/user/:user_id', authMiddleware, async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findOne({ user_id });
    if (!user) {
      logger.warn(`User not found during scan: ${user_id}`);
      return res.status(404).json({ error: 'User not found' });
    }

    const transaction = await Transaction.findOne({ user_id: user._id, status: 'pickup_pending' });
    if (!transaction) {
      logger.warn(`No pending transaction for user: ${user_id}`);
      return res.status(404).json({ error: 'No pending transaction found for this user' });
    }

    const book = await Book.findById(transaction.book_id);
    //if (!book || !book.available) 
    if (!book ){
      logger.warn(`Book no longer available for transaction: ${transaction.book_id}`);
      return res.status(400).json({ error: 'Book is no longer available' });
    }

    transaction.status = 'picked_up';
    transaction.processed_at = new Date();
    await transaction.save();

    book.available = false;
    book.keeper_id = user.user_id;
    book.updatedAt = Date.now();
    await book.save();

    user.book_id = book.book_id;
    user.updatedAt = Date.now();
    await user.save();

    logger.info(`Transaction approved successfully: ${transaction.transaction_id}, user: ${user_id}`);
    res.status(200).json({ message: 'Transaction approved, book picked up successfully', transaction });
  } catch (err) {
    logger.error(`Error approving transaction: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/transactions/drop-off/:book_id - Initiate drop-off process
router.put('/drop-off/:book_id', authMiddleware, async (req, res) => {
  const { book_id } = req.params;
  const { cafe_id } = req.body;

  try {
    if (!cafe_id) {
      logger.warn(`Missing cafe_id in drop-off request for book: ${book_id}`);
      return res.status(400).json({ error: 'cafe_id is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      logger.warn(`User not found for drop-off: ${req.userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    const book = await Book.findOne({ book_id });
    if (!book) {
      logger.warn(`Book not found for drop-off: ${book_id}`);
      return res.status(404).json({ error: 'Book not found' });
    }
    if (book.available || book.keeper_id !== user.user_id) {
      logger.warn(`Book not with user for drop-off: ${book_id}, user: ${user.user_id}`);
      return res.status(400).json({ error: 'Book is not currently with this user' });
    }

    const transaction = await Transaction.findOne({ book_id: book._id, user_id: user._id, status: 'picked_up' });
    if (!transaction) {
      logger.warn(`No active transaction for drop-off: ${book_id}, user: ${user.user_id}`);
      return res.status(404).json({ error: 'No active transaction found for this book' });
    }

    const cafe = await Cafe.findOne({ cafe_id });
    if (!cafe) {
      logger.warn(`Cafe not found for drop-off: ${cafe_id}`);
      return res.status(404).json({ error: 'Cafe not found' });
    }

    transaction.status = 'dropoff_pending';
    transaction.cafe_id = cafe._id;
    transaction.processed_at = new Date();
    await transaction.save();

    logger.info(`Drop-off request initiated: ${transaction.transaction_id}, book: ${book_id}`);
    res.status(200).json({ message: 'Drop-off request initiated successfully', transaction });
  } catch (err) {
    logger.error(`Error initiating drop-off: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/transactions/complete/:transaction_id - Complete drop-off process
router.put('/complete/:transaction_id', authMiddleware, async (req, res) => {
  const { transaction_id } = req.params;

  try {
    console.log(`Completing transaction with transaction_id: ${transaction_id}`);
    const transaction = await Transaction.findOne({ transaction_id, status: 'dropoff_pending' });
    if (!transaction) {
      logger.warn(`No pending drop-off transaction: ${transaction_id}`);
      return res.status(404).json({ error: 'No pending drop-off transaction found' });
    }

    const book = await Book.findById(transaction.book_id);
    if (!book) {
      logger.warn(`Book not found for drop-off completion: ${transaction.book_id}`);
      return res.status(404).json({ error: 'Book not found' });
    }

    const user = await User.findById(transaction.user_id);
    if (!user) {
      logger.warn(`User not found for drop-off completion: ${transaction.user_id}`);
      return res.status(404).json({ error: 'User not found' });
    }

    const cafe = await Cafe.findById(transaction.cafe_id);
    if (!cafe) {
      logger.warn(`Cafe not found for drop-off completion: ${transaction.cafe_id}`);
      return res.status(404).json({ error: 'Cafe not found' });
    }

    // Update transaction status
    transaction.status = 'dropped_off';
    transaction.processed_at = new Date();
    await transaction.save();

    // Update book: make it available and set keeper_id to cafe's string cafe_id
    book.available = true;
    book.keeper_id = cafe.cafe_id; // Use the string cafe_id (e.g., CAFE_006)
    book.updatedAt = new Date();
    await book.save();

    // Clear user's book_id
    user.book_id = null;
    user.updatedAt = new Date();
    await user.save();

    logger.info(`Drop-off completed successfully: ${transaction.transaction_id}`);
    res.status(200).json({ message: 'Book drop-off completed successfully', transaction });
  } catch (err) {
    logger.error(`Error completing drop-off: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;