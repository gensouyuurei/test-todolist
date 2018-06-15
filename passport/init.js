const passport = require('passport');
const loginStrategy = require('./login.js');
const registerStrategy = require('./register.js');
const User = require('../models/user.js');

passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use('login', loginStrategy);
passport.use('register', registerStrategy);

module.exports = passport;
