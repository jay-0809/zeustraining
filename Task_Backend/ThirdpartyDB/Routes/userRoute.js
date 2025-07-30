const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const { getUser, getUsers, createUser } = require('../Controllers/userController');

const userLimiter = rateLimit({
    windowMs: 15 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per minute
    message: {
        message: "Rate limit exceeded. Only 100 batches per minute allowed"
    }
});
// Route to get user details
router.get('/users/:id', userLimiter, getUser);
router.get('/users', getUsers);
router.post('/users', createUser);

module.exports = router;