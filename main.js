const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const todoController = require('./controllers/todoController');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Todo routes
app.get('/', todoController.getTodos);
app.post('/add', todoController.addTodo);
app.post('/toggle/:id', todoController.toggleTodo);
app.post('/delete/:id', todoController.deleteTodo);

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
