// Controller functions
const Todo = require('../models/todo');

exports.getTodos = async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.render('index', { todos });
};

exports.addTodo = async (req, res) => {
  const todo = new Todo({ task: req.body.task });
  await todo.save();
  res.redirect('/');
};

exports.toggleTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.redirect('/');
};

exports.deleteTodo = async (req, res) => {
  await Todo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
