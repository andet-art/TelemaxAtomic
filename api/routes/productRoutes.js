import express from 'express';
import mysql from 'mysql2/promise';
import {
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// DB connection config (ensure .env has DB_HOST, DB_USER, DB_PASS, DB_NAME)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'your_db_user',
  password: process.env.DB_PASS || 'your_db_pass',
  database: process.env.DB_NAME || 'your_db_name'
};

// Public route: Get all products with their photos
router.get('/', async (req, res, next) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [products] = await conn.execute('SELECT * FROM products');
    const [photos]   = await conn.execute('SELECT product_id, url FROM product_photos');
    await conn.end();

    const productsWithPhotos = products.map(product => ({
      ...product,
      photos: photos
        .filter(photo => photo.product_id === product.id)
        .map(photo => photo.url)
    }));

    res.json(productsWithPhotos);
  } catch (err) {
    console.error('Error in GET /api/products:', err);
    next(err);
  }
});

// Public route: Get a single product by ID with its photos
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const conn = await mysql.createConnection(dbConfig);
    const [products] = await conn.execute('SELECT * FROM products WHERE id = ?', [id]);
    const [photos]   = await conn.execute('SELECT url FROM product_photos WHERE product_id = ?', [id]);
    await conn.end();

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    product.photos = photos.map(p => p.url);
    res.json(product);
  } catch (err) {
    console.error('Error in GET /api/products/:id:', err);
    next(err);
  }
});

// Admin routes (protected)
router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;
