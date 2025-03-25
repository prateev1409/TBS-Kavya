const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const SubscriptionPayment = require('../models/SubscriptionPayment');
const Razorpay = require('razorpay');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
        console.log('User found in adminMiddleware:', user);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (err) {
        console.error('Admin middleware error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// GET /api/users/profile - Retrieve the authenticated user's profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            subscription_type: user.subscription_type,
            subscription_validity: user.subscription_validity,
            book_id: user.book_id,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users - Retrieve list of users with case-insensitive filtering
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { subscription_type, role } = req.query;
        let query = {};

        if (subscription_type) query.subscription_type = { $regex: subscription_type, $options: 'i' };
        if (role) query.role = { $regex: role, $options: 'i' };

        const users = await User.find(query);
        console.log('Users fetched:', users);
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/filters - Retrieve unique values for filters
router.get('/filters', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const subscription_types = await User.distinct('subscription_type');
        const roles = await User.distinct('role');

        console.log('Filter options fetched:', { subscription_types, roles });
        res.status(200).json({ subscription_types, roles });
    } catch (err) {
        console.error('Error fetching user filters:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/:user_id - Retrieve a specific user
router.get('/:user_id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User fetched:', user);
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/users - Create a new user (admin-only)
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .trim(),
        body('email')
            .isEmail()
            .withMessage('Valid email is required')
            .trim(),
        body('phone_number')
            .notEmpty()
            .withMessage('Phone number is required')
            .trim(),
        body('password')
            .notEmpty()
            .withMessage('Password is required'),
        body('subscription_type')
            .optional()
            .isIn(['basic', 'standard', 'premium'])
            .withMessage('Subscription type must be basic, standard, or premium'),
        body('role')
            .optional()
            .isIn(['user', 'admin', 'cafe'])
            .withMessage('Role must be user or admin or cafe'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, phone_number, password, subscription_type, role } = req.body;

            const user = new User({
                name,
                email,
                phone_number,
                password,
                subscription_type: subscription_type || 'basic',
                role: role || 'user',
                subscription_validity: new Date(),
            });

            // Fallback: Generate user_id if not set by the model
            if (!user.user_id) {
                console.log('user_id not set by model, generating manually...');
                const count = await User.countDocuments();
                user.user_id = `User_${String(count + 1).padStart(3, '0')}`;
                console.log('Manually generated user_id:', user.user_id);
            }

            let savedUser;
            let attempts = 0;
            const maxAttempts = 3;

            // Retry saving the user in case of duplicate user_id
            while (attempts < maxAttempts) {
                try {
                    savedUser = await user.save();
                    break; // Success, exit the loop
                } catch (err) {
                    if (err.code === 11000 && err.keyPattern && err.keyPattern.user_id) {
                        // Duplicate key error for user_id, retry with a new user_id
                        attempts++;
                        console.log(`Duplicate user_id detected, retrying (${attempts}/${maxAttempts})...`);
                        const count = await User.countDocuments();
                        user.user_id = `User_${String(count + 1).padStart(3, '0')}`;
                        continue;
                    }
                    throw err; // Other errors, throw immediately
                }
            }

            if (!savedUser) {
                throw new Error('Failed to save user after multiple attempts due to duplicate user_id');
            }

            console.log('User created:', savedUser);
            res.status(201).json({ message: 'User created successfully', user: savedUser });
        } catch (err) {
            console.error('Error creating user:', err.message);
            res.status(500).json({ error: err.message });
        }
    }
);

// PUT /api/users/:user_id - Update a user (admin-only)
router.put(
    '/:user_id',
    authMiddleware,
    adminMiddleware,
    [
        body('name')
            .optional()
            .notEmpty()
            .withMessage('Name cannot be empty')
            .trim(),
        body('email')
            .optional()
            .isEmail()
            .withMessage('Valid email is required')
            .trim(),
        body('phone_number')
            .optional()
            .notEmpty()
            .withMessage('Phone number cannot be empty')
            .trim(),
        body('password')
            .optional()
            .notEmpty()
            .withMessage('Password cannot be empty'),
        body('subscription_type')
            .optional()
            .isIn(['basic', 'standard', 'premium'])
            .withMessage('Subscription type must be basic, standard, or premium'),
        body('role')
            .optional()
            .isIn(['user', 'admin', 'cafe'])
            .withMessage('Role must be user or admin or cafe'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { user_id } = req.params;
            const updates = req.body;

            const user = await User.findOne({ user_id });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            Object.assign(user, updates);
            await user.save(); // updatedAt will be set by the pre-save hook

            console.log('User updated:', user);
            res.status(200).json({ message: 'User updated successfully', user });
        } catch (err) {
            console.error('Error updating user:', err.message);
            res.status(500).json({ error: err.message });
        }
    }
);

// DELETE /api/users/:user_id - Delete a user (admin-only)
router.delete('/:user_id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.deleteOne();
        console.log('User deleted:', user);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/users/create-subscription - Create a Razorpay order for subscription
router.post('/create-subscription', authMiddleware, async (req, res) => {
    try {
        // Initialize Razorpay instance inside the route handler
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const { tier, amount } = req.body;
        if (!['basic', 'standard', 'premium'].includes(tier)) {
            return res.status(400).json({ error: 'Invalid subscription tier' });
        }
        if (!amount || typeof amount !== 'number') {
            return res.status(400).json({ error: 'Amount is required and must be a number' });
        }

        // Define expected amounts for each plan (in INR)
        const planAmounts = {
            basic: 9.99,
            standard: 14.99,
            premium: 19.99,
        };
        if (planAmounts[tier] !== amount) {
            return res.status(400).json({ error: `Invalid amount for ${tier} plan. Expected ${planAmounts[tier]} INR` });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a Razorpay order
        const options = {
            amount: amount * 100, // Convert to paise (Razorpay expects amount in paise)
            currency: 'INR',
            receipt: `receipt_${user.user_id}_${Date.now()}`,
            notes: {
                user_id: user.user_id,
                tier: tier,
            },
        };

        const order = await razorpay.orders.create(options);
        console.log(`Razorpay order created for user ${user.user_id}: ${order.id}`);

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID, // Send the Key ID to the frontend
        });
    } catch (err) {
        console.error('Error creating Razorpay order:', err.message);
        res.status(500).json({ error: `Failed to create order: ${err.message}` });
    }
});

// POST /api/users/verify-subscription-payment - Verify Razorpay payment and update subscription
router.post('/verify-subscription-payment', authMiddleware, async (req, res) => {
    try {
        // Initialize Razorpay instance inside the route handler
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tier, amount } = req.body;

        // Validate the request
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !tier || !amount) {
            return res.status(400).json({ error: 'Missing required payment details' });
        }

        // Verify the payment signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            console.warn(`Payment verification failed for order ${razorpay_order_id}`);
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's subscription
        const transactionDate = new Date();
        user.subscription_type = tier;
        user.subscription_validity = new Date(transactionDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days validity
        await user.save();

        // Store the payment details in SubscriptionPayment
        const subscriptionPayment = new SubscriptionPayment({
            transaction_date: transactionDate,
            payment_id: razorpay_payment_id,
            user_id: user.user_id,
            user_email: user.email,
            validity: user.subscription_validity,
            subscription_type: tier,
            amount: amount,
        });
        await subscriptionPayment.save();

        console.log(`Payment verified and subscription updated for user ${user.user_id}: Plan ${tier}`);
        res.status(200).json({ message: 'Payment verified and subscription updated successfully' });
    } catch (err) {
        console.error('Error verifying Razorpay payment:', err.message);
        res.status(500).json({ error: `Failed to verify payment: ${err.message}` });
    }
});

module.exports = router;