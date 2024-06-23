const wrapAsync = require("./wrapAsync");
const Post = require('../models/post.js');
const CustomError = require('./ErrorClass.js');
const mongoose = require('mongoose');

const postExist = wrapAsync(async (req, res, next) => {
    const id = req.params.id;

    // Id Validations
    validateMongoId(id);

    const post = await Post.findById(id);
    post ? next() : next(new CustomError(404, "Post not found!"));
});

const validateMongoId = (id) => {
    if (!id) {
        throw new CustomError(400, "Id cannot be empty!");
    } else if (!mongoose.isValidObjectId(id)) {
        throw new CustomError(400, "Invalid id!");
    }
}

module.exports = { postExist, validateMongoId };