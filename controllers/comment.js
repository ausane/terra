const Comment = require('../models/comment.js');
const Post = require('../models/schema.js');


// To Get Post with that Comments
const comments = async (req, res, next) => {
    const id = req.params.id;

    const post = await Post.findById(id).populate('comments').populate('user');
    const cmts = await Comment.find({ _id: { $in: post.comments } });

    const posts = await Promise.all(cmts.map(cmt => Post.findById(cmt.postId).populate('user')));
    posts.sort((a, b) => b.timestamp.time - a.timestamp.time);


    const comment = await Comment.findOne({ postId: id });
    const ances = [];

    if (comment) {
        const commentPost = await Post.find({ _id: { $in: comment.ancestorsIds } }).sort({ 'timestamp.time': 1 }).populate('user');
        ances.push(...commentPost);
    }

    res.render("comments.ejs", { post, posts, ances });
}


// To Post Comment Callback
const submitComment = async (req, res, next) => {
    // Require Elements
    const previousPath = req.headers.referer;
    const id = req.params.id;
    const post = await Post.findById(id);
    const comment = await Comment.findOne({ postId: id });

    const postDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const postTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const newPost = new Post({
        user: req.user,
        content: req.body.content,
        timestamp: {
            date: postDate,
            clock: postTime,
            time: Date.now(),
            year: new Date().getFullYear()
        },
    });

    // Add posted comment to db
    const newComment = new Comment({
        postId: newPost,
        parentId: post
    });

    newComment.ancestorsIds.push(post);

    if (comment) {
        newComment.ancestorsIds.push(...comment.ancestorsIds);
    }

    post.comments.push(newComment);


    await newComment.save();
    await newPost.save();
    await post.save();

    // Redirect to previous path
    req.flash('submit', 'Your comment was created!');
    res.redirect(previousPath);
}


// Export Controllers to Router
module.exports = { comments, submitComment }

