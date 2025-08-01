import db from '../config/db.js';

export const createOrder = (order) => {
  return db.query('INSERT INTO orders SET ?', [order]);
};

export const getAllOrders = () => {
  return db.query('SELECT * FROM orders');
};

export const getOrderById = (id) => {
  return db.query('SELECT * FROM orders WHERE id = ?', [id]);
};

export const deleteOrder = (id) => {
  return db.query('DELETE FROM orders WHERE id = ?', [id]);
};
