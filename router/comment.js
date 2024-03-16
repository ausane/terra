// Require Express
const express = require('express');
const router = express.Router({ mergeParams: true });

// Error Handling
const wrapAsync = require('../utils/wrapAsync.js');
const { postExist } = require('../utils/PostExist.js');
const { isAuthenticated } = require('../utils/isAuthenticated.js');
const { ValidateComment } = require('../utils/ValidationSchema.js');

// Require Controllers
const { comments, submitComment } = require('../controllers/comment.js');


// To Get Post with that Comments
router
    .get("/", isAuthenticated, postExist, wrapAsync(comments));


// To Create
router
    .post('/comment/submit', isAuthenticated, postExist, ValidateComment, wrapAsync(submitComment));


// Export Router
module.exports = router;