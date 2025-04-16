const mongoose = require('mongoose');

const subscriptionPaymentSchema = new mongoose.Schema({
    transaction_date: { type: Date, default: Date.now },
    payment_id: { type: String, required: true }, // Razorpay payment ID
    user_id: { type: String, required: true }, // References User.user_id
    user_email: { type: String, required: true },
    validity: { type: Date, required: true }, // Transaction date + 30 days
    subscription_type: { type: String, enum: ['basic', 'standard', 'premium'], required: true },
    amount: { type: Number, required: true }, // Amount in INR
    isCodeApplied: { type: Boolean, default: false }, // Whether coupon was applied
    isActive: { type: Boolean, default: true } // Whether payment is active
});

module.exports = mongoose.model('SubscriptionPayment', subscriptionPaymentSchema);