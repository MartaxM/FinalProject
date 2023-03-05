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


// Funtions to search users, used to initialize passport

/**
 * @param {*} un username
 * @returns user with that username if found, null if not
 * 
 * Uses mongoose function
 */
async function getUserByUsername(un) {
    let user = await User.findOne({ username: un }).lean();
    return user;
}

/**
 * 
 * @param {*} iden id
 * @returns user with that id if found, null if not
 * 
 * Uses mongoose function
 */
async function getUserById(iden) {
    let user = await User.findOne({ _id: iden }).lean();
    return user;
}

// Initializing passport using the config file
const initializePassport = require('./passport-config')
const { authenticate } = require('passport')
initializePassport(passport, getUserByUsername, getUserById)


/**
 * Session configuration
 */

app.use(session({
    secret: "WDADAWUFHAF",
    name: "project",
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'strict',
    }
}))

/**
 * Use the sessions from passport
 *  */ 
app.use(passport.initialize())
app.use(passport.session())

/**
 * mongoose settings
 *  */ 
const mongoDB = "mongodb://127.0.0.1:27017/finalproject";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error"));

/**
 * Import Schemas
 *  */ 
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

app.use("/api", router);

/**
 * 
 * @param {*} req request
 * @param {*} res response
 * @param {*} next callback
 * 
 * Function to check if the session is valid
 * Will send status 401 if not
 */
function checkAuthenticated(req, res, next) {
    //console.log(req.session.passport.user);
    if (req.isAuthenticated()) {
        return next()
    }
    res.sendStatus(401)
}

// API functions

/**
 * REGISTER
 * POST
 * 
 * Registers an user
 * The request needs to contain username, email and password
 * Does not allow repeated usernames or emails
 * Uses mongoose functions
 */
app.post('/api/user/register', async (req, res, next) => {
    try {
        //Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //Find if an user exists with that email or username
        User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] }).lean()
            .then((foundUser) => {
                //If the user is found, do not create user, send error message
                if (foundUser) {
                    if (foundUser.email === req.body.email) {
                        res.status(403).send({msg:'Email in use'});
                    }
                    else {
                        res.status(403).send({msg:'Username in use'});
                    }
                } else {
                    //Else, create user
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

/**
 * LOGIN
 * POST
 * 
 * Allows log in
 * Passport handles the authentication
 * Will send status 200 if log in was a success
 */
app.post('/api/user/login', passport.authenticate('local', {}), (req, res) => {
    //console.log(req.session.passport.user);
    res.sendStatus(200)
});

/**
 * LOGOUT
 * POST
 * 
 * Allows log out
 * Only possible if authenticated (does not make sense to logout if not logged in)
 * Ends the session
 */
app.post('/api/user/logout', checkAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.sendStatus(200);
    });
});

/**
 * LOGGED IN
 * GET
 * 
 * Allows frontend to confirm with server if logged in
 */

app.get('/api/user/logged_in', checkAuthenticated, (req, res) => {
    res.sendStatus(200)
})

/**
 * CREATE POST
 * POST
 * 
 * Creates a post, associated with an user
 * Requires valid session, will register the current user id as the user who wrote the post
 * The request needs to contain title, text and code snippet
 * Uses mongoose functions
 */

app.post('/api/post/create', checkAuthenticated, (req, res, next) => {
    try {
        //Create post
        Post.create({
            post_user: req.user._id,
            title: req.body.title,
            text: req.body.text,
            code: req.body.code
        }).then(
            (postCreated) => {
                if (postCreated) {
                    //If created, send its id
                    res.status(200).send({ post_id: postCreated._id.toString() })
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

/**
 * CREATE COMMENT
 * POST
 * 
 * Creates a comment, associated to a post and an user
 * Requires valid session, will register the current user id as the user who wrote the comment
 * The request needs to contain text
 * Uses mongoose functions
 */

app.post('/api/post/:post_id/comment/create', checkAuthenticated, (req, res, next) => {
    try {
        //Find if post exists
        Post.findById(req.params.post_id)
            .then((postFound) => {
                //If it does, create comment
                if (postFound) {
                    Comment.create({
                        comment_user: req.user._id,
                        text: req.body.text
                    }).then((commentCreated) => {
                        if (commentCreated) {
                            //If created, add its _id to the post
                            postFound.comments.push(commentCreated._id);
                            postFound.save();
                            res.status(200).send("Comment created")
                        }
                    })
                } else {
                    //If not, do not create comment
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

//

/**
 * GET POST DETAILS
 * GET
 * 
 * Sends the information of a Post identified by post_id
 * Said information includes:
 *  username of the creator, title, text, code snippet and list of comments
 * The comments are composed of:
 *  username of comment creator, comment _id and text 
 *  
 * Does not require session
 * Uses mongoose functions
 * 
 * Populate is used to get the comments and usernames, because Posts include the ObjectId of the users 
 * and the comments, and the comments include the ObjectId of their writer
 * 
 * Their model files have comments
 */

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
                //If found, send result of query
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

/**
 * GET ALL POSTS
 * GET
 * 
 * Sends all posts information
 * Said information includes:
 *  username of the creator, title, text and code snippet
 *  
 * Does not require session
 * Uses mongoose functions
 * 
 * Populate is used to get the comments and usernames, because Post includes the ObjectId of the user
 * who wrote it
 * 
 * More explanation on their model files
 */
app.get('/api/posts', (req, res, next) => {
    try {
        Post.find().select("-__v -comments").populate(
            {
                path: "post_user",
                select: "username -_id"
            }
        ).lean().then(
            (posts) => {
                //sends result of query
                res.status(200).send(posts);
            }
        )
    } catch {
        res.status(500).send("Something went wrong");
    }
})

/**
 * Preparing for production or development environment depending on env variable
 * If there is not a variable set, production is the default
 */

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve("..", "client", "build")));
    app.get("/*", (req, res) =>
        res.sendFile(path.resolve("..", "client", "build", "index.html"))
    );
} else if (process.env.NODE_ENV === "development") {
    //cors options so that frontend can access
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
