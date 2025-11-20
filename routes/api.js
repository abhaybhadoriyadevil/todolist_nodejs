const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.Controller');
const todoController = require('../controllers/todo.Controller');
const verifyToken = require('../middleware/authMiddleware');

// Auth Routes
router.post('/auth/signup', authController.signupAPI);
router.post('/auth/login', authController.loginAPI);

// Protected Todo Routes
router.use('/todos', verifyToken);
router.get('/todos', todoController.getTodosAPI);
router.post('/todos', todoController.addTodoAPI);
router.put('/todos/:id', todoController.updateTodoAPI);
router.delete('/todos/:id', todoController.deleteTodoAPI);

module.exports = router;
