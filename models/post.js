const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        date: {
            type: String,
            required: true,
        },
        clock: {
            type: String,
            required: true,
        },
        time: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        }
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});


module.exports = mongoose.model("Post", postSchema);