import db from '../config/db.js';

export const createUser = async (user) => {
  const [result] = await db.query(
    'INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES (?, ?, ?, ?, ?)',
    [user.first_name, user.last_name, user.email, user.password, user.is_admin || false]
  );
  return result.insertId;
};

export const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};
