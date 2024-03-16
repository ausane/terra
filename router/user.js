// Require Express
const express = require('express');
const router = express.Router();

// Error Handler
const wrapAsync = require('../utils/wrapAsync');

// Authentication & Autherization with Passport
const passport = require('passport');
const { isAuthenticated, saveRedirectUrl } = require('../utils/isAuthenticated.js');
const { ValidateProfileUpdate } = require('../utils/ValidationSchema.js');

// Require Controllers
const { homePage, getSignup, postSignup, loginPage,
    doneLogin, logOut, userProfile, homeRoute,
    explorePage, searchPeople, searchPage, userLikes,
    userBookmarks, userReplies, updateUserProfile } = require('../controllers/user.js');


// Home Page
router
    .get('/', isAuthenticated, homePage);

// Main Pages  
router.get('/home', isAuthenticated, wrapAsync(homeRoute));
router.get('/explore', isAuthenticated, wrapAsync(explorePage));
router.get('/search', isAuthenticated, wrapAsync(searchPage));
router.post('/search-people', isAuthenticated, wrapAsync(searchPeople));


// To SignUp
router
    .route('/signup')
    .get(getSignup)
    .post(wrapAsync(postSignup));

// To LogIn
router
    .route('/login')
    .get(loginPage)
    .post(
        saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        doneLogin
    );

// To LogOut
router
    .get('/logout', isAuthenticated, logOut);

// To Render User Profile
router.get('/:username', isAuthenticated, wrapAsync(userProfile));
router.get('/:username/likes', isAuthenticated, wrapAsync(userLikes));
router.get('/:username/bookmarks', isAuthenticated, wrapAsync(userBookmarks));
router.get('/:username/replies', isAuthenticated, wrapAsync(userReplies));

// To Update User's Profile
router
    .put(
        '/:username/profile/update',
        isAuthenticated,
        ValidateProfileUpdate,
        wrapAsync(updateUserProfile)
    );


// Export Router
module.exports = router;