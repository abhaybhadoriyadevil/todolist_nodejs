// Enhanced Todo Controller with Error Handling and Advanced Features
const Todo = require('../models/todo.models');

/**
 * Get todos with filtering, sorting, and pagination
 */
exports.getTodos = async (req, res) => {
  try {
    const {
      search = '',
      sort = 'createdAt',
      order = 'desc',
      status = 'all',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter conditions
    const filter = {};
    if (search) {
      filter.task = { $regex: search, $options: 'i' };
    }
    if (status !== 'all') {
      filter.completed = status === 'completed';
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

    // Prepare flash messages if available
    const successMessage = req.flash ? req.flash('success') : null;
    
    res.render('index', {
      todos,
      currentPage: page,
      pageCount,
      total,
      search,
      status,
      sort,
      order,
      success: successMessage
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
    const { task, category, dueDate, priority } = req.body;

    // Validate input
    if (!task || task.trim().length === 0) {
      req.flash('error', 'Task cannot be empty');
      return res.redirect('/');
    }

    const todo = new Todo({
      task: task.trim(),
      category: category || 'general',
      dueDate: dueDate || null,
      priority: priority || 'medium',
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
    const todo = await Todo.findById(id);

    if (!todo) {
      req.flash('error', 'Task not found');
      return res.redirect('/');
    }

    await Todo.findByIdAndRemove(id);

    // For AJAX requests
    if (req.xhr) {
      return res.json({ 
        success: true, 
        message: 'Task deleted successfully' 
      });
    }

    req.flash('success', 'Task deleted successfully');
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting todo:', error);
    if (req.xhr) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete task' 
      });
    }
    req.flash('error', 'Failed to delete task');
    res.redirect('/');
  }
};

/**
 * Update todo details
 */
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, category, dueDate, priority } = req.body;

    // Validate input
    if (!task || task.trim().length === 0) {
      req.flash('error', 'Task cannot be empty');
      return res.redirect('/');
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      req.flash('error', 'Task not found');
      return res.redirect('/');
    }

    todo.task = task.trim();
    todo.category = category;
    todo.dueDate = dueDate;
    todo.priority = priority;
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
