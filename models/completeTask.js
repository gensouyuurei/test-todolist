const User = require('./user.js');

const completeTask = function (req, res, next){
    if(req.body.completeTask) {
        User.updateOne({'records._id': req.body.completeTask}, {$set: {
            'records.$.isCompleted': true
            }}, function (err) {
            if (err){
                console.log(err);
            }
            else{
                return next();
            }
        })
    }
    else return next();
};

module.exports = completeTask;