const localStrategy = require('passport-local');
const bCrypt = require('bcrypt-nodejs');
const User = require('../models/user.js');

const isPasswordValid = function (user, password) {
    return bCrypt.compareSync(password, user.password);
}

const loginStrategy = new localStrategy({passReqToCallback: true},
    function (req, username, password, done) {
        User.findOne({username: username}, function (err, user) {
            if (err) {
                console.log("Login error", err);
                return done(err);
            }
            if (!user) {
                console.log("User not found")
                return done(null, false, {message: "Username is incorrect."});

            }
            if (!isPasswordValid(user, password)) {
                console.log("Invalid password")
                return done(null, false, {message: "Password is incorrect."});
            }
            if (user.isAdmin){
                req.session.isAdmin = true;
            }
            else {
                req.session.isAdmin = false;
            }
            req.session.username = user.username;
            return done(null, user);
        });
    }
);

module.exports = loginStrategy;