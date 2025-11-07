const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todolistDB';

mongoose.set('strictQuery', false);

// MongoDB Atlas connection options (simplified as most are default now)
const connectionOptions = {
  retryWrites: true,
  w: 'majority'
};

mongoose.connect(mongoURI, connectionOptions)
  .then(() => console.log('✅ MongoDB Atlas connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error (event):', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

module.exports = mongoose;
  console.warn('MongoDB disconnected');


module.exports = mongoose;
