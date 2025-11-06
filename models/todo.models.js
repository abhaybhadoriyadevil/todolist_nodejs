// Enhanced Todo model with advanced features
const mongoose = require('../config/db');

const todoSchema = new mongoose.Schema({
  // Core Features
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  description: { type: String },
  
  // Status and Dates
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  dueDate: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  estimatedTime: { type: Number }, // in minutes
  
  // Organization
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: { type: String, default: 'general' },
  tags: [{ type: String }]
});

// Indexes for better search performance
todoSchema.index({ title: 'text', description: 'text' });
todoSchema.index({ dueDate: 1, priority: 1, status: 1 });
todoSchema.index({ category: 1, tags: 1 });

module.exports = mongoose.model('Todo', todoSchema);
