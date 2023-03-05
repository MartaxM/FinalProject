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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Funtions to search users for passport.config

// return user if found by username
async function getUserByUsername(un) {
    let user = await User.findOne({ username: un }).lean();
    // let normalUser = {
    //     id : user._id.toString(),
    //     username : user.username,
    //     password : user.password
    // }
    return user;
}

// return user if found by id
async function getUserById(iden) {
    let user = await User.findOne({ _id: iden }).lean();
    return user;
}

// Initializing passport using the config
const initializePassport = require('./passport-config')
const { authenticate } = require('passport')
initializePassport(passport, getUserByUsername, getUserById)

app.use(session({
    secret: "WDADAWUFHAF",
    name: "project",
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'strict',
    }
    // cookie: { secure: true }
}))

// To use the sessions from passport
app.use(passport.initialize())
app.use(passport.session())

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

app.use("/api", router);

//functions

function checkAuthenticated(req, res, next) {
    //console.log(req.session.passport.user);
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
app.post('/api/user/login', passport.authenticate('local', {}), (req, res) => {
    //console.log(req.session.passport.user);
    res.sendStatus(200)
});

//LOGOUT
app.post('/api/user/logout', checkAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.sendStatus(200);
    });
});

//CHECK IF AUTHENTICATED
app.get('/api/user/logged_in', checkAuthenticated, (req, res) => {
    res.sendStatus(200)
})

//CREATE POST
app.post('/api/post/create', checkAuthenticated, (req, res, next) => {
    try {
        Post.create({
            post_user: req.user._id,
            title: req.body.title,
            text: req.body.text,
            code: req.body.code
        }).then(
            (postCreated) => {
                if (postCreated) {
                    res.status(200).send({post_id: postCreated._id.toString()})
                }
            }
        ).catch((err) => {
            console.log(err);
            res.send(400).send("Bad request");
        })
    } catch {
        res.status(500).send("Something went wrong");
    }
})

//ADD COMENT
app.post('/api/post/:post_id/comment/create', checkAuthenticated, (req, res, next) => {
    try {
        Post.findById(req.params.post_id)
            .then((postFound) => {
                if (postFound) {
                    Comment.create({
                        comment_user: req.user._id,
                        text: req.body.text
                    }).then((commentCreated) => {
                        if (commentCreated) {
                            postFound.comments.push(commentCreated._id);
                            postFound.save();
                            res.status(200).send("Comment created")
                        }
                    })
                } else {
                    res.status(404).send("Post not found")
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send("Bad request");
            })
    } catch {
        res.status(500).send("Something went wrong");
    }
})

//GET POST DETAILS
app.get('/api/post/:post_id/details', (req, res, next) => {
    try {
        Post.findById(req.params.post_id)
            .select("-_id -__v")
            .populate({
                path: 'comments',
                populate: {
                    path: 'comment_user',
                    select: "username -_id"
                },
                select: "text"
            }).populate({
                path: 'post_user',
                select: "username -_id"
            })
            .lean()
            .then((postFound) => {
                if (postFound) {
                    res.status(200).json(postFound)
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send("Bad request");
            })
    } catch {
        res.status(500).send("Something went wrong");
    }
})

// GET ALL POSTS
app.get('/api/posts', (req, res, next) => {
    try {
        Post.find().select("-__v -comments").populate(
            {
                path: "post_user",
                select: "username -_id"
            }
        ).lean().then(
            (posts) => {
                res.status(200).send(posts);
            }
        )
    } catch {
        res.status(500).send("Something went wrong");
    }
})


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

var corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

module.exports = app;
