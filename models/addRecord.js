const User = require('./user.js');

const addRecord = function (req, res, next) {
    var newdata = {
        text: req.body.text,
        priority: req.body.priority,
        isCompleted: false
    }
    User.findOne({username: req.session.username}, function (err, user) {
        if (err){
            console.log(err);
        }
        user.records.push(newdata);
        user.save();
        next();
    });
};

module.exports = addRecord;