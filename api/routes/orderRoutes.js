const express = require('express');
const router = express.Router();
const { createOrder, getOrdersByUser } = require('../controllers/orderController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getOrdersByUser);

module.exports = router;