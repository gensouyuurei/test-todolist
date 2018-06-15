const mongoose = require('mongoose')
mongoose.connect(process.env.dbURL);
const usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: Boolean,
    records: [{text: String, priority: Number, isCompleted: Boolean}]
});
const User = mongoose.model('user', usersSchema);

module.exports = User;