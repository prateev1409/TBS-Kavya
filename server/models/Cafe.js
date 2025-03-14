const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  average_bill: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  ratings: { type: Number, min: 0, max: 5, default: 0 },
  specials: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cafe', cafeSchema);