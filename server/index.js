const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const bookRoutes = require('./routes/books');
const cafeRoutes = require('./routes/cafes');
const cafePortalRoutes = require('./routes/cafePortal');
const clientPortalRoutes = require('./routes/clientPortal');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cafes', cafeRoutes);
app.use('/api/cafe', cafePortalRoutes);
app.use('/api/client', clientPortalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));