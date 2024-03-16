const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    ancestorsIds: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }]
});

module.exports = mongoose.model("Comment", commentSchema);