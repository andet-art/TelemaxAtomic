const db = require('../config/db');

const createOrder = async (userId, totalPrice) => {
  const [result] = await db.query(
    'INSERT INTO orders (user_id, total_price) VALUES (?, ?)',
    [userId, totalPrice]
  );
  return result.insertId;
};

const addOrderItem = (orderId, productId, quantity) => {
  return db.query(
    'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
    [orderId, productId, quantity]
  );
};

const getOrdersByUserId = (userId) => {
  return db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
};

module.exports = {
  createOrder,
  addOrderItem,
  getOrdersByUserId,
};
