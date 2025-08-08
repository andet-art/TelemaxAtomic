import db from '../config/db.js';

// Fetch all orders (rows only)
export const getAllOrdersFromDB = () => {
  return db.execute(
    'SELECT * FROM orders ORDER BY timestamp DESC'
  );
};

// (you can add the other model methods here if you need them later)
export const getOrderById = (id) =>
  db.execute('SELECT * FROM orders WHERE id = ?', [id]);

export const deleteOrder = (id) =>
  db.execute('DELETE FROM orders WHERE id = ?', [id]);
