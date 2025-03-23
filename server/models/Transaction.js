const mongoose = require('mongoose');
const {Counter} = require('./Counter');
// Function to get the next sequence value
const getNextSequenceValue = async (sequenceName) => {
    const Counter = mongoose.model('Counter');
    const counter = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return counter.sequence_value;
};

const transactionSchema = new mongoose.Schema({
    transaction_id: { type: String, required: true, unique: true },
    book_id: { type: String, required: true, ref: 'Book' },
    user_id: { type: String, required: true, ref: 'User' },
    cafe_id: { type: String, required: true, ref: 'Cafe' },
    status: { type: String, enum: ['pickup_pending', 'picked_up', 'dropoff_pending', 'dropped_off'], default: 'pickup_pending' },
    created_at: { type: Date, default: Date.now },
    processed_at: { type: Date },
});

// Pre-save hook to auto-generate transaction_id
transactionSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.transaction_id = await getNextSequenceValue('transaction_id');
    }
    next();
});

module.exports = mongoose.model('Transaction', transactionSchema);