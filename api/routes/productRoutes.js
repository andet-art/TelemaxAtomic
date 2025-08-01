const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct, deleteProduct } = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/', getAllProducts);
router.post('/', verifyToken, isAdmin, addProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
