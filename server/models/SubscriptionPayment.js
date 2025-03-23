const mongoose = require('mongoose');

const subscriptionPaymentSchema = new mongoose.Schema({
    transaction_date: { type: Date, default: Date.now },
    payment_id: { type: String, required: true }, // Razorpay payment ID
    user_id: { type: String, required: true }, // References User.user_id
    user_email: { type: String, required: true },
    validity: { type: Date, required: true }, // Transaction date + 30 days
    subscription_type: { type: String, enum: ['basic', 'standard', 'premium'], required: true },
    amount: { type: Number, required: true }, // Amount in INR
});

module.exports = mongoose.model('SubscriptionPayment', subscriptionPaymentSchema);