const { postSchema, commentSchema, profileSchema, chatSchema } = require('../models/mongodb/joi.js');
const CustomError = require('./ErrorClass.js');

module.exports.ValidatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map(e => e.message).join('/');
        next(new CustomError(400, errorMessage));
    } else {
        next();
    }
}

module.exports.ValidateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map(e => e.message).join('/');
        next(new CustomError(400, errorMessage));
    } else {
        next();
    }
}

module.exports.ValidateProfileUpdate = (req, res, next) => {
    const { error } = profileSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map(e => e.message).join('/');
        next(new CustomError(400, errorMessage));
    } else {
        next();
    }
}

module.exports.ValidateChat = (req, res, next) => {
    const { error } = chatSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map(e => e.message).join('/');
        next(new CustomError(400, errorMessage));
    } else {
        next();
    }
}

