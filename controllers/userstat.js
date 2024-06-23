const User = require('../models/user.js');
const Post = require('../models/post.js');
const { validateMongoId } = require('../utils/PostExist.js');


const profileUpdate = async (req, res, next) => {
    try {
        res.render('partials/form.ejs', { user: req.user });
    } catch (error) {
        next(error);
    }
}

const followRequest = async (req, res, next) => {
    try {
        const { follower_id, followee_id } = req.body;

        validateMongoId(follower_id);
        validateMongoId(followee_id);

        if (follower_id !== followee_id) {
            const follower = await User.findById(follower_id);
            const followee = await User.findById(followee_id);

            if (!follower || !followee) {
                throw new CustomError(404, "User not found!");
            }

            if (follower.following.includes(followee._id)) {
                follower.following.pull(followee._id);
                followee.followers.pull(follower._id);

                await follower.save();
                await followee.save();

                res.json({ "followee": `${followee.username}`, "message": "unfollowed" });
            } else {
                follower.following.push(followee);
                followee.followers.push(follower);

                await follower.save();
                await followee.save();

                res.json({ "followee": `${followee.username}`, "message": "followed" });
            }


        } else {
            throw new CustomError(400, "You cannot follow your own account!");
        }
    } catch (error) {
        next(error);
    }
}


const likePost = async (req, res, next) => {
    try {
        const { user_id, post_id } = req.body;

        validateMongoId(user_id);
        validateMongoId(post_id);

        const user = await User.findById(user_id);
        const post = await Post.findById(post_id);

        if (!user || !post) {
            throw new CustomError(404, "User or post not found!");
        }

        if (post.likes.includes(user._id)) {
            post.likes.pull(user);
            user.likes.pull(post);
        } else {
            post.likes.push(user);
            user.likes.push(post);
        }

        await user.save();
        await post.save();

        res.status(200).json({ message: "Like status updated successfully" });
    } catch (error) {
        next(error);
    }
}

const bookmarkPost = async (req, res, next) => {
    try {
        const { user_id, post_id } = req.body;

        validateMongoId(user_id);
        validateMongoId(post_id);

        const user = await User.findById(user_id);
        const post = await Post.findById(post_id);

        if (!user || !post) {
            throw new CustomError(404, "User or post not found!");
        }

        if (post.bookmarks.includes(user._id)) {
            post.bookmarks.pull(user);
            user.bookmarks.pull(post);
        } else {
            post.bookmarks.push(user);
            user.bookmarks.push(post);
        }

        await user.save();
        await post.save();

        res.json({ 'message': 'saved' });
    } catch (error) {
        next(error);
    }
}


module.exports = { profileUpdate, followRequest, likePost, bookmarkPost };