// Require Schema
const User = require('../models/User.js');
const Post = require('../models/schema.js');
const Comment = require('../models/comment.js');


// To Redirect Home Page
const homePage = (req, res) => {
    res.redirect('/home');
}

// To Render Home Page
const homeRoute = async (req, res, next) => {
    const data = await Post.find().populate('user').sort({ "timestamp.time": -1 });
    const cmts = await Promise.all(data.map(post => Comment.findOne({ postId: post._id })));
    const posts = data.filter(doc1 => !cmts.filter(Boolean).some(doc2 => doc2.postId.equals(doc1._id)));

    res.render("main.ejs", { posts });
}

// Explore Page
const explorePage = async (req, res, next) => {
    res.render('search.ejs', { posts: null, matchedUsers: null });
}

// Search People
const searchPeople = async (req, res, next) => {
    const searchTerm = req.body.searchTerm;

    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i');

        const matchedUsers = await User.find({
            $or: [
                { username: regex },
                { name: regex }
            ]
        });
        res.json(matchedUsers);
    } else {
        res.redirect('/explore');
    }
}

// Search Page
const searchPage = async (req, res, next) => {
    const searchTerm = req.query.q;

    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i');

        const matchedUsers = await User.find({
            $or: [
                { username: regex },
                { name: regex }
            ]
        });
        const posts = await Post.find({ content: regex }).populate('user');
        res.render('search.ejs', { posts, matchedUsers });
    } else {
        res.redirect('/explore');
    }
}

// To Render Signup Page
const getSignup = (req, res) => {
    req.user ? res.redirect('/home') : res.render('users/signup.ejs');
}

// To Signup
const postSignup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Regular expression to validate username
        const usernameRegex = /^[a-zA-Z0-9_]+$/;

        if (!usernameRegex.test(username)) {
            throw new Error("Invalid username. Usernames can only contain letters (a-z, A-Z), numbers (0-9), and underscores (_). Please remove any spaces or special characters.");
        } else if (username.length > 15) {
            throw new Error("Username cannot exceed 15 characters!");
        } else if (username.startsWith('_')) {
            throw new Error("Usernames cannot begin with an underscore (_)!");
        }

        const newUser = new User({ username, email });

        // Add name and createdAt property
        newUser.name = username;
        newUser.createdAt = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const user = await User.register(newUser, password);

        req.login(user, (error) => {
            if (error) {
                return next(error);
            } else {
                req.flash('submit', 'Signup successful!');
                res.redirect('/home');
            }
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    }
}

// To Render Login Page
const loginPage = (req, res) => {
    req.user ? res.redirect('/home') : res.render('users/login.ejs');
}

// To Login 
const doneLogin = (req, res) => {
    req.flash('submit', 'Login successful!');
    const url = res.locals.redirectUrl || '/home';
    res.redirect(url);
}

// To LogOut
const logOut = (req, res, next) => {
    req.logOut((error) => {
        if (error) {
            next(error);
        } else {
            req.flash('error', 'You have logged out!');
            res.redirect('/login');
        }
    });
}

// To Render User Profile
const userProfile = async (req, res) => {
    const username = req.params.username;
    const user = await User.findByUsername(username);

    if (user) {
        const data = await Post.find({ user: user._id }).populate('user').sort({ "timestamp.time": -1 });
        const cmts = await Promise.all(data.map(post => Comment.findOne({ postId: post._id })));
        const posts = data.filter(doc1 => !cmts.filter(Boolean).some(doc2 => doc2.postId.equals(doc1._id)));

        res.render('profile.ejs', { user, posts });
    } else {
        res.render('error/404.ejs');
    }
}


const userLikes = async (req, res, next) => {
    const username = req.params.username;

    const user = await User.findByUsername(username)
        .populate({
            path: 'likes',
            populate: {
                path: 'user',
                model: 'User'
            }
        });

    if (user) {
        const posts = user.likes;
        posts.sort((a, b) => b.timestamp.time - a.timestamp.time);

        res.render('profile.ejs', { user, posts });
    } else {
        res.render('error/404.ejs');
    }
}

const userBookmarks = async (req, res, next) => {
    const username = req.params.username;

    const user = await User.findByUsername(username)
        .populate({
            path: 'bookmarks',
            populate: {
                path: 'user',
                model: 'User'
            }
        });

    if (user) {
        const posts = user.bookmarks;
        posts.sort((a, b) => b.timestamp.time - a.timestamp.time);

        res.render('profile.ejs', { user, posts });
    } else {
        res.render('error/404.ejs');
    }
}


const userReplies = async (req, res, next) => {
    const username = req.params.username;
    const user = await User.findByUsername(username);

    if (user) {
        const data = await Post.find({ user: user._id }).populate('user').sort({ "timestamp.time": -1 });
        const cmts = await Promise.all(data.map(post => Comment.findOne({ postId: post._id })));
        const posts = data.filter(doc1 => cmts.filter(Boolean).some(doc2 => doc2.postId.equals(doc1._id)));

        res.render('profile.ejs', { user, posts });
    } else {
        res.render('error/404.ejs');
    }
}

const updateUserProfile = async (req, res) => {
    const previousPath = req.headers.referer;
    const username = req.params.username;
    const user = await User.findByUsername(username);

    if (user && (req.user.username === username)) {
        const { name, picture, bio, website, location } = req.body;

        await User.updateOne(
            { username: username },
            { $set: { name: name, picture: picture, bio: bio, website: website, location: location } }
        );

        res.redirect(previousPath);
    } else {
        res.render('error/404.ejs');
    }
}

// Export Callbacks to User Router
module.exports = {
    homePage, getSignup, postSignup, loginPage,
    doneLogin, logOut, userProfile, homeRoute,
    explorePage, searchPeople, searchPage, userLikes,
    userBookmarks, userReplies, updateUserProfile
}
