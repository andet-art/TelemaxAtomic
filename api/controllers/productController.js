const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.addProduct = async (req, res) => {
  const { name, description, price, imageUrl, category } = req.body;
  try {
    await db.query(
      'INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, imageUrl, category]
    );
    res.status(201).json({ message: 'Product added' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product' });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};