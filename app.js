const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User.js');
const { saveMessage, saveSeenMessage } = require('./utils/messageFunctions.js');


// To require router files
const userRouter = require('./router/user.js');
const postRouter = require('./router/post.js');
const commentRouter = require('./router/comment.js');
const messageRouter = require('./router/messages.js');
const userStatRouter = require('./router/userstat.js');


if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

// MongoDB Atlas
const ATLAS_URL = process.env.MONGODB_ATLAS_URL;

app.use(cookieParser(process.env.COOKIE_CODE));

const store = MongoStore.create({
    mongoUrl: ATLAS_URL,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 3600,
});

store.on('error', () => {
    console.log("MongoDB Session Store Error:", err);
});

app.use(session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 7 * 24 * 3600,
        maxAge: 1000 * 7 * 24 * 3600,
        httpOnly: true,
        // secure: true
    }
}));


app.use(flash());

// Passport Execution
app.use(passport.session());
app.use(passport.initialize());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));


// URL encoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method Override
app.use(methodOverride('_method'));

// Views engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Static files
app.use(express.static(path.join(__dirname, "/public")));


// MongoDB connection
async function main() {
    await mongoose.connect(ATLAS_URL);
}

main()
    .then(() => console.log("- Database connected -"))
    .catch((err) => console.log("MongoDB Error:", err));


app.use((req, res, next) => {
    res.locals.postCreated = req.flash('submit');
    res.locals.errOccurred = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


// Other Routes
app.use('/user', userStatRouter);
app.use('/post', postRouter);
app.use('/messages', messageRouter);
app.use('/:username/post/:id', commentRouter);
app.use('/', userRouter);


// 404
app.all('*', (req, res, next) => {
    res.render('error/404.ejs');
});

// Error-Handling Middleware
app.use((err, req, res, next) => {
    // Default to a 500 status code if no status is set
    const status = err.status || 500;

    console.log(err);

    // Respond with the error details
    res.status(status).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: status,
        },
    });
});

// Start Server
const server = app.listen(8080, () => {
    console.log("http://localhost:8080/");
});



// WebSocket
const wss = new WebSocket.Server({ server });

const userMap = new Map();

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.messageId) {
            saveSeenMessage(parsedMessage)
                .then(async (savedMessage) => {
                    wss.clients.forEach(function each(client) {
                        const recipientWs = userMap.get(savedMessage.recipient);
                        if (recipientWs === client && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(savedMessage));
                        }
                    });
                })
                .catch(error => {
                    console.error('Error saving message to database:', error);
                });
        } else if (parsedMessage.message) {
            saveMessage(parsedMessage)
                .then((savedMessage) => {
                    wss.clients.forEach(function each(client) {
                        const recipientWs = userMap.get(savedMessage.recipient);
                        if (recipientWs === client && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(savedMessage));
                        }
                    });
                })
                .catch(error => {
                    console.error('Error saving message to database:', error);
                });
        } else if (parsedMessage.id) {
            // Associate user ID with WebSocket connection
            userMap.set(parsedMessage.id, ws);
        }
    });

    ws.on('close', function close() {
        // Remove WebSocket connection from the map when closed
        userMap.forEach((value, key) => {
            if (value === ws) {
                userMap.delete(key);
            }
        });
    });
});



