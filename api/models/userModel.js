import db from '../config/db.js';

/**
 * Create a new user in the database.
 * @param {Object} user - User data (first_name, last_name, email, password, is_admin)
 * @returns {number} - Newly created user's ID
 */
export const createUser = async (user) => {
  const [result] = await db.query(
    'INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES (?, ?, ?, ?, ?)',
    [user.first_name, user.last_name, user.email, user.password, user.is_admin || false]
  );
  return result.insertId;
};

/**
 * Find a user by their email address.
 * @param {string} email
 * @returns {Object|null} - User data or null if not found
 */
export const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

/**
 * Find a user by their ID.
 * @param {number} id
 * @returns {Object|null} - User data or null if not found
 */
export const findUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};
