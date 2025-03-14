const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed
  subscription_validity: { type: Date },
  subscription_type: { type: String, enum: ['basic', 'standard', 'premium'], default: 'basic' },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', default: null },
  role: { type: String, default: 'user' }, // e.g., 'user', 'admin'
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);