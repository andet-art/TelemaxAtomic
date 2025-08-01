import db from '../config/db.js';

export const getStats = async (req, res, next) => {
  try {
    const [[userCount]] = await db.query('SELECT COUNT(*) AS users FROM users');
    const [[productCount]] = await db.query('SELECT COUNT(*) AS products FROM products');
    const [[orderCount]] = await db.query('SELECT COUNT(*) AS orders FROM orders');

    res.json({
      users: userCount.users,
      products: productCount.products,
      orders: orderCount.orders
    });
  } catch (err) {
    next(err);
  }
};
