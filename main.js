const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const todoController = require('./controllers/todo.Controller');
const path = require('path');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session and flash setup
app.use(session({
    secret: 'todo-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // 1 minute
}));
app.use(flash());

// Todo routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Add New Task' });
});
app.get('/todos', todoController.getTodos);
app.post('/add', todoController.addTodo);
app.post('/toggle/:id', todoController.toggleTodo);
app.post('/delete/:id', todoController.deleteTodo);
app.post('/update/:id', todoController.updateTodo);

// New pages routes
app.get('/about', (req, res) => {
    res.render('pages/about');
});

app.get('/contact', (req, res) => {
    res.render('pages/contact');
});

app.post('/contact', (req, res) => {
    // Handle contact form submission here
    res.redirect('/');
});

module.exports = app;
