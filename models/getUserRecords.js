const User = require('./user.js');

const getUserRecords = function (req, res, next) {
    if(!req.session.isAdmin) {
        User.findOne({username: req.session.username}, function (err, user) {
            if (err) {
                console.log(err);
            }
            req.body.userrecords = {records: user.records}
            next()
        })
    }
    else{
        User.find({},'username records', function (err, users) {
            if (err){
                console.log(err);
            }
            var arr = [];
            users.forEach(function (user) {
                var username = user.username;
                user.records.forEach(function (record) {
                    arr.push({
                        username: username,
                        text: record.text,
                        priority: record.priority,
                        isCompleted: record.isCompleted,
                        _id: record._id
                    })
                })
            })
            req.body.userrecords = arr;
            next();
        });

    }
}

module.exports = getUserRecords;