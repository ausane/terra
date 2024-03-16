const Joi = require('joi');

// Post Schema
module.exports.postSchema = Joi.object({
    content: Joi.string()
        .min(1)
        .max(450)
        .required(),
});

// Comment Schema
module.exports.commentSchema = Joi.object({
    content: Joi.string()
        .min(1)
        .max(450)
        .required(),
});

// Profile Schema
module.exports.profileSchema = Joi.object({
    name: Joi.string().min(1).max(15).required(),
    picture: Joi.string().default('default.jpg'),
    bio: Joi.string().min(0).max(150).required(),
    website: Joi.string().min(0).max(40).required(),
    location: Joi.string().min(0).max(40).required()
});

// Chat Schema
module.exports.chatSchema = Joi.object({
    user1: Joi.string().required(),
    user2: Joi.string().required(),
    messages: Joi.array().items(Joi.object({
        author: Joi.string().required(),
        message: Joi.string().min(1).max(450).required(),
        timestamp: Joi.number().required()
    })).required()
});