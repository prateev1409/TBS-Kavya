const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transaction_id: { type: Number, required: true, unique: true, autoIncrement: true },
    book_id: { type: String, required: true, ref: 'Book' },
    user_id: { type: String, required: true, ref: 'User' },
    cafe_id: { type: String, required: true, ref: 'Cafe' },
    status: { type: String, enum: ['pickup_pending', 'picked_up', 'dropoff_pending', 'dropped_off'], default: 'pickup_pending' },
    created_at: { type: Date, default: Date.now },
    processed_at: { type: Date },
});

module.exports = mongoose.model('Transaction', transactionSchema);