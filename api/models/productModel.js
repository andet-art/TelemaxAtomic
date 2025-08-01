const db = require('../config/db');

const getAllProducts = () => db.query('SELECT * FROM products');

const addProduct = (product) => {
  const { name, description, price, imageUrl, category } = product;
  return db.query(
    'INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, imageUrl, category]
  );
};

const deleteProduct = (id) => db.query('DELETE FROM products WHERE id = ?', [id]);

module.exports = {
  getAllProducts,
  addProduct,
  deleteProduct,
};

