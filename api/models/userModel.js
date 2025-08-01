const db = require('../config/db');

const createUser = (user) => {
  const { firstName, lastName, email, password, role } = user;
  return db.query(
    'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastName, email, password, role || 'user']
  );
};

const findUserByEmail = (email) => {
  return db.query('SELECT * FROM users WHERE email = ?', [email]);
};

const findUserById = (id) => {
  return db.query('SELECT id, first_name, last_name, email, role FROM users WHERE id = ?', [id]);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
