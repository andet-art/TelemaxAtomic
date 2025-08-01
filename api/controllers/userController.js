const db = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, first_name, last_name, email, role FROM users WHERE id = ?', [req.user.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

exports.updateProfile = async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    await db.query('UPDATE users SET first_name = ?, last_name = ? WHERE id = ?', [
      firstName,
      lastName,
      req.user.id,
    ]);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};
