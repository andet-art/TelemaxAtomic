import db from '../config/db.js';

/**
 * Create a new order.
 * @param {Object} order - Order data including user_id, total_amount, status, etc.
 */
export const createOrder = (order) => {
  return db.query('INSERT INTO orders SET ?', [order]);
};

/**
 * Get all orders in the system.
 */
export const getAllOrders = () => {
  return db.query('SELECT * FROM orders ORDER BY created_at DESC');
};

/**
 * Get a specific order by its ID.
 * @param {number} id - Order ID
 */
export const getOrderById = (id) => {
  return db.query('SELECT * FROM orders WHERE id = ?', [id]);
};

/**
 * Delete an order by its ID.
 * @param {number} id - Order ID
 */
export const deleteOrder = (id) => {
  return db.query('DELETE FROM orders WHERE id = ?', [id]);
};
