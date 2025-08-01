import db from '../config/db.js';

/**
 * Create a new product.
 * @param {Object} product - Product details
 */
export const createProduct = (product) => {
  return db.query('INSERT INTO products SET ?', [product]);
};

/**
 * Get all products.
 */
export const getAllProducts = () => {
  return db.query('SELECT * FROM products ORDER BY created_at DESC');
};

/**
 * Get product by ID.
 * @param {number} id - Product ID
 */
export const getProductById = (id) => {
  return db.query('SELECT * FROM products WHERE id = ?', [id]);
};

/**
 * Update product by ID.
 * @param {number} id - Product ID
 * @param {Object} product - Updated product data
 */
export const updateProduct = (id, product) => {
  return db.query('UPDATE products SET ? WHERE id = ?', [product, id]);
};

/**
 * Delete product by ID.
 * @param {number} id - Product ID
 */
export const deleteProduct = (id) => {
  return db.query('DELETE FROM products WHERE id = ?', [id]);
};
