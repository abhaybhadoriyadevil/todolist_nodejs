// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User.model');

// PASSPORT STRATEGY
// passport.use(
//   new LocalStrategy(async (username, password, done) => {
//     try {
//       const user = await User.findOne({ username });

//       if (!user)
//         return done(null, false, { message: "User not found" });

//       const match = await bcrypt.compare(password, user.password);

//       if (!match)
//         return done(null, false, { message: "Incorrect password" });

//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   })
// );

// // SESSION SUPPORT
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

// SIGNUP CONTROLLER
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashed
    });

    await user.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/signup');
  }
};
