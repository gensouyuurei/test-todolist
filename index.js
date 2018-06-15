require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

const passport = require('./passport/init.js');
const getUserRecords = require('./models/getUserRecords.js');
const addRecord = require('./models/addRecord.js');
const completeTask = require('./models/completeTask.js');

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: "honestly i don't understand this field"}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/register', function (req, res) {
    res.render('register', {createAdmin: process.env.createAdmin});
});
app.post('/register', passport.authenticate('register', {
    successRedirect: '/main',
    failureRedirect: '/register'
}));

app.get('/login', function (req, res) {
    res.render('login');
});
app.post('/login', passport.authenticate('login', {
    successRedirect: '/main',
    failureRedirect: '/login'
}));

app.get('/main', function (req, res, next){
    if (req.isAuthenticated()) {return next();}
    else {res.redirect('/');}
}, getUserRecords, function (req, res) {
    res.render('mainpage', {
        user: req.body.userrecords,
        isAdmin: req.session.isAdmin,
    });
});
app.post('/main', function (req, res, next){
    if (req.isAuthenticated()) {return next();}
    else {res.redirect('/');}
}, completeTask, getUserRecords, function (req, res) {
    res.render('mainpage', {
        user: req.body.userrecords,
        isAdmin: req.session.isAdmin,
        sortPriority: req.body.sortPriority,
        sortStatus: req.body.sortStatus
    });
});
/*
app.put('/main', function (req,res,next){console.log("Post id: " + req.params.completeTask); next();}, completeTask, function (req, res) {
    res.redirect('/main');
});
*/
app.get('/main/add', function (req, res, next){
    if (req.isAuthenticated()) {return next();}
    else {res.redirect('/');}
}, function (req, res) {
    res.render('addRecord');
})
app.post('/main/add', function (req, res, next){
    if (req.isAuthenticated()) {return next();}
    else {res.redirect('/');}
}, addRecord, function (req, res){
    res.redirect('/main');
})

app.listen(3002);