// Require Express
const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../utils/isAuthenticated.js');

const { findMessages, searchToMessage, sendConversation } = require('../controllers/messages.js');


router
    .get('/', isAuthenticated, findMessages);

router
    .post('/search', isAuthenticated, searchToMessage);

router
    .post('/to/:id', isAuthenticated, sendConversation);

// Export Router
module.exports = router;
