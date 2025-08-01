const express = require('express');
const router = express.Router();
const { getUsers, getAllUsers, createUser, deleteUsers } = require('../Controllers/userControllers');

router.get('/users/:id', getUsers);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.delete('/users', deleteUsers);

module.exports = router;