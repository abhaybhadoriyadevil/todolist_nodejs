// Enhanced Todo model with advanced features
const mongoose = require('../config/db');

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

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
  tags: [{ type: String }],
  
  // Task Details
  subtasks: [subtaskSchema],
  attachments: [{
    filename: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  comments: [commentSchema],
  
  // Recurring Tasks
  recurring: {
    isRecurring: { type: Boolean, default: false },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'none'],
      default: 'none'
    },
    endDate: { type: Date }
  },
  
  // Reminders
  reminders: [{
    date: { type: Date },
    notified: { type: Boolean, default: false }
  }]
});

// Indexes for better search performance
todoSchema.index({ title: 'text', description: 'text' });
todoSchema.index({ dueDate: 1, priority: 1, status: 1 });
todoSchema.index({ category: 1, tags: 1 });

module.exports = mongoose.model('Todo', todoSchema);
