const helmet = require("helmet");
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('./config/db');
const todoController = require('./controllers/todo.Controller');
const authController = require('./controllers/auth.Controller');
const path = require('path');
const passport = require('passport');

// Passport Config
require('./config/passport')(passport);

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

// Session and flash setup
app.use(session({
    secret: 'todo-secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Middleware to ensure user is authenticated
const { ensureAuthenticated } = require('./config/auth');

// Todo routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Add New Task' });
});
app.get('/todos', ensureAuthenticated, todoController.getTodos);
app.post('/add', ensureAuthenticated, todoController.addTodo);
app.post('/toggle/:id', ensureAuthenticated, todoController.toggleTodo);
app.post('/delete/:id', ensureAuthenticated, todoController.deleteTodo);
app.post('/update/:id', ensureAuthenticated, todoController.updateTodo);

// New pages routes
app.get('/about', (req, res) => {
    res.render('pages/about');
});

app.get('/contact', (req, res) => {
    res.render('pages/contact');
});



app.get('/signup', (req, res) => {
    res.render('pages/signup');
});

app.post('/signup', authController.signup);

// Login route
app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/todos',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
});

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

module.exports = app;
