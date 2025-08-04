const express = require('express');
const router = express.Router();

const { getUserTempData, togglePause, storeUserTempData, getAllUserTempData, deleteAllUserTempData } = require('../Controllers/userTempControllers');

router.get('/', getAllUserTempData);
router.get('/:lastFetchId', getUserTempData);
router.post('/pause', togglePause);
router.post('/store', storeUserTempData);
router.delete('/', deleteAllUserTempData);

module.exports = router;

