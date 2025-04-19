const mongoose = require('mongoose');

const subscriptionPaymentSchema = new mongoose.Schema({
    transaction_date: { type: Date, default: Date.now },
    payment_id: { type: String, required: true },
    deposit_payment_id: { type: String },
    subscription_id: { type: String },
    plan_id: { type: String },
    user_id: { type: String, required: true },
    user_email: { type: String, required: true },
    validity: { type: Date, required: true },
    subscription_type: { type: String, enum: ['basic', 'standard', 'premium'], required: true },
    amount: { type: Number, required: true },
    isCodeApplied: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    subscription_status: { type: String, enum: ['created', 'deposit_paid', 'auto_setup_pending', 'active', 'halted', 'cancelled', 'completed', 'expired'], default: 'created' },
    deposit_status: { type: String, enum: ['n/a', 'deposited', 'refunded'], default: 'n/a' },
    cancelled_at: { type: Date }
});

module.exports = mongoose.model('SubscriptionPayment', subscriptionPaymentSchema);