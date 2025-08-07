import db from '../config/db.js';

export const createUser = async (name, email, hashedPassword) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
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

// ✅ New
export const getAllUsersFromDB = async () => {
  const [rows] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
  return rows;
};
