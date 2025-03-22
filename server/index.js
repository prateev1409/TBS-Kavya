const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const logger = require('./utils/logger');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const bookRoutes = require('./routes/books');
const cafeRoutes = require('./routes/cafes');
const cafePortalRoutes = require('./routes/cafePortal');
const clientPortalRoutes = require('./routes/clientPortal');
const adminPortalRoutes = require('./routes/adminPortal');

// Load environment variables from .env file
dotenv.config();

// Validate critical environment variables
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables');
    process.exit(1);
}
if (!process.env.MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

const app = express();

// Configure CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? 'https://your-frontend-domain.com' // Replace with your production frontend URL
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies or auth headers if needed
};
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// Log all incoming requests with body
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url} - IP: ${req.ip} - Body: ${JSON.stringify(req.body)}`);
    next();
});

// Rate limiting for sensitive routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per window (admin routes are more sensitive)
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

const transactionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    // Optional: specify the database name if not included in MONGODB_URI
    // dbName: 'your_database_name',
})
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

// Routes
app.use('/api/auth', authLimiter, authRoutes); // Apply rate limiting to auth routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionLimiter, transactionRoutes); // Apply rate limiting to transaction routes
app.use('/api/books', bookRoutes);
app.use('/api/cafes', cafeRoutes); // Handles /api/cafes/* routes (e.g., /api/cafes, /api/cafes/:cafe_id)
app.use('/api/cafe', cafePortalRoutes); // Handles /api/cafe/* routes (e.g., /api/cafe/:cafe_id/requests)
app.use('/api/client', clientPortalRoutes);
app.use('/api/admin', adminLimiter, adminPortalRoutes); // Apply rate limiting to admin routes

// Global error handler
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message} - Stack: ${err.stack}`);
    res.status(500).json({ error: 'Something went wrong, please try again later' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});