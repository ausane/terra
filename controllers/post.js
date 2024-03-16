const Comment = require('../models/comment.js');
const Post = require('../models/schema.js');
const User = require('../models/User.js');


// To Submit Post Callback
const submitPost = async (req, res) => {
    const previousPath = req.headers.referer;

    const username = req.user.username;
    const content = req.body.content.trim();

    const user = await User.findByUsername(username);

    // Get the formatted time with options
    const postTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    // Get the formatted date with options
    const postDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });


    // Save Post to Database 
    const newPost = new Post({
        user: user,
        content: content,
        timestamp: {
            date: postDate,
            clock: postTime,
            time: Date.now(),
            year: new Date().getFullYear()
        },
    });

    await newPost.save();

    // Redirect to previous path
    req.flash('submit', 'Your post was created!');
    res.redirect(previousPath);
}


// To Delete Post Callback
const deletePost = async (req, res) => {
    const id = req.params.id;

    // To Delete Post By Id
    const post = await Post.findByIdAndDelete(id);

    // To Delete All Comments Of That Post
    const commentPosts = await Comment.find({ _id: { $in: post.comments } });
    if (commentPosts) {
        await Promise.all(commentPosts.map(cmt => Post.findOneAndDelete({ _id: cmt.postId })));
        await Comment.deleteMany({ _id: { $in: post.comments } });
    }

    // To Pull Out Comment From Parent Post's Comments Array
    const comment = await Comment.findOneAndDelete({ postId: id });
    if (comment) {
        const parentPost = await Post.findById(comment.parentId);
        await Post.findByIdAndUpdate(parentPost, { $pull: { comments: comment._id } });
    }

    // const flashMessage = req.flash('delete', 'Your post was deleted!');
    res.json({ 'message': 'Your post was deleted!' });
}


// To Update Post Callback
const updatePost = async (req, res) => {
    const previousPath = req.headers.referer;
    const updatedPost = req.body;
    const id = req.params.id;

    await Post.findByIdAndUpdate(id, updatedPost, { new: true });

    req.flash('submit', 'Your post was updated!');
    res.redirect(previousPath);
}

// Export Callbacks to Router
module.exports = { submitPost, deletePost, updatePost };