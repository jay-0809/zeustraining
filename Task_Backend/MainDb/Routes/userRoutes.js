const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../Controllers/userControllers');

router.get('users/:id', getUsers);
router.post('users', createUser);

module.exports = router;