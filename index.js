const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const session = require('express-session');
const assert = require('assert');
//const sessionStorageMongo = require('connect-mongodb-session');
const app = express();

const register = function(req, res) {
    const dbURL = 'mongodb://localhost:27017';
    const dbName = 'TODOLIST';

    mongoClient.connect(dbURL, function (err, client) {
        assert.equal(null, err);
        console.log("DB connection established");

        const db = client.db(dbName);
        db.collection('users').find({name: req.body.login}).toArray(function (err, result) {

            try {
                if (result[0].name == req.body.login) {
                    client.close();
                    res.render('register', {message: "Name's already taken"});
                }
            }
            catch(err){

                if(!req.body.login || !req.body.pass){
                    res.render('register', {message: "You must set up your login and password"});
                }
                else{
                    var toInsert = {name: req.body.login, pass: req.body.pass, role: 'user'};
                    const db = client.db(dbName);
                    db.collection('users').insertOne(toInsert, function (err) {
                        assert.equal(err, null);
                        console.log('inserted');
                    });
                    req.session.role = 'user';
                    client.clos();
                    res.redirect('/main');
                }
            }
        });

    })
};

const login = function (req, res) {
    const dbURL = 'mongodb://localhost:27017';
    const dbName = 'TODOLIST';

    mongoClient.connect(dbURL, function (err, client) {
        assert.equal(null, err);
        console.log("DB connection established");

        const db = client.db(dbName);
        db.collection('users').find({name: req.body.login, pass: req.body.pass}).toArray(function (err, result) {
            try {
                if ((result[0].name == req.body.login) &&
                    (result[0].pass == req.body.pass)) {
                    client.close();
                    req.session.role = 'user';
                    res.redirect('./main');
                }
            }
            catch (err) {
                client.close();
                res.render('login', {message: "Login or password doesn't match."})
            }
        })
    })
};

const actionTodoRecord = function(action, text, priority, status){

    const dbURL = 'mongodb://localhost:27017';
    const dbName = 'TODOLIST';

    switch (action){
        case 'add':
            var filter = {};
            var object = {$set: {todos:
                        {text: text, priority: priority, status: status}}};
            break;
        case 'update':
            var filter = {todos: {text: text}};
            var object = {$set: {todos:
                        {priority: priority, status: status}}};
            break;

    }

    mongoClient.connect(dbURL, function (err, client) {
        assert.equal(null, err);
        console.log("DB connection established");

        const db = client.db(dbName);
        db.collection('users').updateOne(filter, object, function (err) {
            assert.equal(err, null);
            console.log(action + "successfully");
        })

    });
};

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array());
app.use(session({secret: "honestly i don't understand this field"}));

app.get('/', function (req, res) {
    res.render('index', {title: 'it works', message: 'definitely'});
});

app.get('/register', function (req, res) {
    res.render('register');
});
app.post('/register', register);

app.get('/login', function (req, res) {
    res.render('login');
});
app.post('/login', login);

app.get('/main', function (req, res) {
    switch (req.session.role){
        case 'user':
            res.render('mainpage');
            break;
        case 'admin':
            res.render('admin');
            break;
        default:
            res.render('index', {title: 'Welcome', message: 'Please login or register.'});
            break;
    }
});
app.listen(3002);