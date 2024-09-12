const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    createdAt: {
        type: String,
        required: true,
        default: Date.now()
    },
    picture: {
        type: String,
        require: true,
        default: 'default.jpeg'
    },
    bio: {
        type: String,
        require: true
    },
    website: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }],
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }],
    chatIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
