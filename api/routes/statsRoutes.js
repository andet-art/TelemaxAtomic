const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/', verifyToken, isAdmin, getStats);

module.exports = router;
