const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

// SIGNUP CONTROLLER
exports.signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      req.flash('error_msg', 'Username already exists');
      res.redirect('/signup');
    } else {
      const newUser = new User({
        username,
        password
      });
      await newUser.save();
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/login');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/signup');
  }
};

// SIGNUP API CONTROLLER
exports.signupAPI = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// LOGIN API CONTROLLER
exports.loginAPI = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login API Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
