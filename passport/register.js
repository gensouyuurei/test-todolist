const localStrategy = require('passport-local');
const bCrypt = require('bcrypt-nodejs');
const User = require('../models/user.js');

const hash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

const registerStrategy = new localStrategy({passReqToCallback: true},
    function (req, username, password, done) {
        findOrCreateUser = function () {
            User.findOne({username: username}, function (err, user) {
                if (err) {
                    console.log("signup error: " + err);
                    return done(err);
                }
                if (user) {
                    console.log('already exists: ' + username);
                    return done(null, false, {message: "That username is already taken"});
                }
                var newUser = new User();
                newUser.username = username;
                req.session.username = username;
                newUser.password = hash(password);

                if (req.body.createAdmin) {
                    newUser.isAdmin = true;
                    req.session.isAdmin = true;
                }
                else {
                    newUser.isAdmin = false;
                    req.session.isAdmin = false;
                }
                newUser.save(function (err) {
                    if (err) {
                        console.log("Error saving user");
                        throw err;
                    }
                    return done(null, newUser);
                })
            });
        }
        process.nextTick(findOrCreateUser);
    }
);

module.exports = registerStrategy;