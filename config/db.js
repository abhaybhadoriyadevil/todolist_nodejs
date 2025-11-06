// MongoDB connection
const mongoose = require('mongoose');

// Allow configuring the MongoDB URI via environment (works for Atlas or local)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todolistDB';

// Optional: control strictQuery (avoid Mongoose deprecation noise on some versions)
mongoose.set('strictQuery', false);

// Connect without deprecated options (these are ignored in recent drivers)
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected:', mongoURI))
  .catch(err => console.error('MongoDB connection error:', err));

// Helpful connection event handlers for runtime diagnostics
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error (event):', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

module.exports = mongoose;
