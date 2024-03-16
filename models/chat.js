const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    user1: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    messages: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        message: {
            type: String,
            required: true
        },
        timestamp: {
            type: Number,
            required: true
        },
        seen: {
            type: Boolean,
            required: true,
            default: false
        }
    }]
});

module.exports = mongoose.model("Chat", chatSchema);