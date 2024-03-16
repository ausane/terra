// Require Express
const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../utils/isAuthenticated.js');

const { profileUpdate, followRequest, likePost, bookmarkPost } = require('../controllers/userstat.js');



router
    .post('/profile/update-form', isAuthenticated, profileUpdate)

router
    .post('/follow-request', isAuthenticated, followRequest);

router
    .post('/like/post', isAuthenticated, likePost);

router
    .post('/bookmark/post', isAuthenticated, bookmarkPost);


// Export Router
module.exports = router;