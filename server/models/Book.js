  const mongoose = require('mongoose');

  const bookSchema = new mongoose.Schema({
    book_id:{ type: String, required: true }, //AutoGenerated , in the format First Letters of the BOOK NAME and then some number
    is_free: { type: Boolean, default: false },
    name: { type: String, required: true },
    author: { type: String, required: true },
    language: { type: String, required: true },
    publisher: { type: String },
    genre: { type: String },
    description: { type: String },
    image_url: { type: String },
    audio_url: { type: String },
    ratings: { type: Number, min: 0, max: 5, default: 0 },
    available: { type: Boolean, default: true }, //Shows up for the reservation only if available
    keeper_id: { type: String }, // References either a user_id or cafe_id
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('Book', bookSchema);