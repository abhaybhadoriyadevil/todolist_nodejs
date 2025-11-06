// Enhanced Todo Controller with Error Handling and Advanced Features
const mongoose = require('mongoose');
const Todo = require('../models/todo.models');

/**
 * Get todos with filtering, sorting, and pagination for todos page
 */
exports.getTodos = async (req, res) => {
    try {
        const {
            search = '',
            sort = 'createdAt',
            order = 'desc',
            status = 'all',
            priority = 'all',
            category = 'all',
            tag = '',
            startDate = '',
            endDate = '',
            page = 1,
            limit = 10
        } = req.query;

    // Build filter conditions
    const filter = {};
    
    // Text search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Status filter
    if (status !== 'all') {
      filter.status = status;
    }

    // Priority filter
    if (priority !== 'all') {
      filter.priority = priority;
    }

    // Category filter
    if (category !== 'all') {
      filter.category = category;
    }

    // Tag filter
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    // Date range filter
    if (startDate && endDate) {
      filter.dueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Todo.countDocuments(filter);

    // Fetch todos with sorting and pagination
    const todos = await Todo.find(filter)
      .sort({ [sort]: order })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const pageCount = Math.ceil(total / limit);

    // Get statistics
    const stats = await Todo.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Prepare flash messages if available
    const successMessage = req.flash ? req.flash('success') : null;
    
    res.render('pages/todos', {
        todos,
        total,
        search,
        status,
        sort,
        order,
        success: successMessage,
        error: req.flash('error'),
        stats
    });
  } catch (error) {
    console.error('Error fetching todos:', error);

    // Only call flash if it's available
    if (req.flash) {
      req.flash('error', 'Failed to load todos');
    }
    res.render('index', { 
      todos: [],
      error: 'Failed to load todos. Please try again.' 
    });
  }
};

/**
 * Add a new todo with validation
 */
exports.addTodo = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      category,
      tags,
      estimatedTime
    } = req.body;

    // Validate input
    if (!title || title.trim().length === 0) {
      req.flash('error', 'Task title cannot be empty');
      return res.redirect('/');
    }

    // Process tags
    const processedTags = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const todo = new Todo({
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate || null,
      priority: priority || 'medium',
      category: category || 'general',
      tags: processedTags,
      estimatedTime: parseInt(estimatedTime) || null,
      createdAt: new Date()
    });

    await todo.save();
    req.flash('success', 'Task added successfully');
    res.redirect('/');
  } catch (error) {
    console.error('Error adding todo:', error);
    req.flash('error', 'Failed to add task');
    res.redirect('/');
  }
};

/**
 * Toggle todo status with optimistic update
 */
exports.toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo) {
      req.flash('error', 'Task not found');
      return res.redirect('/');
    }

    todo.completed = !todo.completed;
  todo.completedAt = todo.completed ? new Date() : null;
  // keep status in sync
  todo.status = todo.completed ? 'completed' : 'pending';
    await todo.save();

    // For AJAX requests
    if (req.xhr) {
      return res.json({ 
        success: true, 
        completed: todo.completed,
        message: `Task marked as ${todo.completed ? 'completed' : 'incomplete'}`
      });
    }

    req.flash('success', `Task marked as ${todo.completed ? 'completed' : 'incomplete'}`);
    res.redirect('/');
  } catch (error) {
    console.error('Error toggling todo:', error);
    if (req.xhr) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update task status' 
      });
    }
    req.flash('error', 'Failed to update task status');
    res.redirect('/');
  }
};

/**
 * Delete todo with confirmation
 */
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Delete failed: Invalid ID format');
      req.flash('error', 'Invalid task ID format');
      return res.redirect('/todos');
    }

    console.log('Attempting to delete todo with ID:', id);

    const result = await Todo.findByIdAndDelete(id);
    
    if (!result) {
      console.error('Delete failed: Task not found with ID:', id);
      req.flash('error', 'Task not found');
      return res.redirect('/todos');
    }

    console.log('Successfully deleted todo with ID:', id);
    req.flash('success', 'Task successfully deleted');
    
    return res.redirect('/todos');

  } catch (error) {
    console.error('Error in deleteTodo:', error);
    req.flash('error', 'Failed to delete task. Please try again.');
    return res.redirect('/todos');
  }
};

/**
 * Update todo details
 */
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, dueDate, priority, tags, estimatedTime } = req.body;

    // Validate input
    if (!title || title.trim().length === 0) {
      req.flash('error', 'Task title cannot be empty');
      return res.redirect('/');
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      req.flash('error', 'Task not found');
      return res.redirect('/');
    }

    todo.title = title.trim();
    todo.description = description || '';
    todo.category = category || todo.category;
    todo.dueDate = dueDate || todo.dueDate;
    todo.priority = priority || todo.priority;
    todo.tags = tags ? tags.split(',').map(t => t.trim()) : todo.tags;
    todo.estimatedTime = estimatedTime ? parseInt(estimatedTime) : todo.estimatedTime;
    todo.updatedAt = new Date();

    await todo.save();

    if (req.xhr) {
      return res.json({ 
        success: true, 
        todo,
        message: 'Task updated successfully' 
      });
    }

    req.flash('success', 'Task updated successfully');
    res.redirect('/');
  } catch (error) {
    console.error('Error updating todo:', error);
    if (req.xhr) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update task' 
      });
    }
    req.flash('error', 'Failed to update task');
    res.redirect('/');
  }
};
