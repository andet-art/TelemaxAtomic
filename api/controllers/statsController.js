import db from '../config/db.js';

export const getStats = async (req, res, next) => {
  try {
    const [[{ users }]] = await db.query('SELECT COUNT(*) AS users FROM users');
    const [[{ products }]] = await db.query('SELECT COUNT(*) AS products FROM products');
    const [[{ orders }]] = await db.query('SELECT COUNT(*) AS orders FROM orders');

    res.json({ users, products, orders });
  } catch (err) {
    console.error('Error fetching stats:', err.message);
    next(err);
  }
};
