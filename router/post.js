// Require Express
const express = require('express');
const router = express.Router();

// Error Handling
const wrapAsync = require('../utils/wrapAsync.js');
const { ValidatePost } = require('../utils/ValidationSchema.js');

// Authentication & Autherization
const { postExist } = require('../utils/PostExist.js');
const { isAuthenticated, isAuthorised } = require('../utils/isAuthenticated.js');

// Require Controllers
const { submitPost, deletePost, updatePost } = require('../controllers/post.js');


// To post
router
    .post('/submit', isAuthenticated, ValidatePost, wrapAsync(submitPost));

// To Delete
router
    .delete('/:id/delete', isAuthenticated, postExist, isAuthorised, wrapAsync(deletePost));

// To Update
router
    .put('/:id/update', isAuthenticated, postExist, isAuthorised, ValidatePost, wrapAsync(updatePost));


// Export Router
module.exports = router;