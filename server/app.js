var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
var router = express.Router();

var app = express();
app.use(bodyParser.json())

// Funtions to search users for passport.config

// return user if found by username
async function getUserByUsername(un) {
    var user = await User.findOne({ username: un }).lean();
    return user;
}

// return user if found by id
async function getUserById(id) {
    var user = await User.findById(new mongoose.Types.ObjectId(id)).lean();
    return user;
}

// Initializing passport using the config
const initializePassport = require('./passport-config')
const { authenticate } = require('passport')
initializePassport(passport, getUserByUsername, getUserById)

// app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: "WDADAWUFHAF",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}))

// To use the sessions from passport
app.use(passport.initialize())
// app.use(passport.session())

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// mongoose settings
const mongoDB = "mongodb://127.0.0.1:27017/finalproject";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error"));

// Import Schemas
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.use("/api", router);

//functions

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.sendStatus(401)
}

// API functions

// REGISTER
app.post('/api/user/register', async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] }).lean()
            .then((foundUser) => {
                if (foundUser) {
                    if (foundUser.email === req.body.email) {
                        res.status(403).send('Email in use');
                    }
                    else {
                        res.status(403).send('Username in use');
                    }
                } else {
                    User.create({
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword
                    });
                    res.sendStatus(200);
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(400).send("Bad request");
            });
    } catch {
        res.status(500).send("Something went wrong");
    }
})

//LOGIN
app.post('/api/user/login', passport.authenticate('local', {}), (req, res) => res.sendStatus(200))

//LOGOUT
app.post('/api/user/logout', (req, res, next) =>{
    req.logout( (err) => {
        if (err) { return next(err); }
        res.sendStatus(200);
    });
});

//CHECK IF AUTHENTICATED
app.get('/api/logged_in', checkAuthenticated, (req, res) => {
    res.sendStatus(200)
})

//CREATE POST

//ADD COMENT


// Preparing for production or development environment
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve("..", "client", "build")));
    app.get("/*", (req, res) =>
        res.sendFile(path.resolve("..", "client", "build", "index.html"))
    );
} else if (process.env.NODE_ENV === "development") {
    var corsOptions = {
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));

}

app.use(express.static(path.resolve("..", "client", "build")));
app.get("/*", (req, res) =>
    res.sendFile(path.resolve("..", "client", "build", "index.html"))
);

module.exports = app;
