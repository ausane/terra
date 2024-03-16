const Post = require('../models/schema.js');

module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        if (req.originalUrl !== '/favicon.ico') {
            req.session.redirectUrl = req.originalUrl;
            res.redirect('/login');
        } else {
            next();
        }
    }
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}

module.exports.isAuthorised = async (req, res, next) => {
    const id = req.params.id;

    const post = await Post.findById(id).populate('user');

    if (post && post.user._id.equals(req.user._id)) {
        next();
    } else {
        req.flash('error', 'You do not have access to do that');
        return res.redirect('/home');
    }
}