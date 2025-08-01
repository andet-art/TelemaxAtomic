import db from '../config/db.js';

export const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

export const updateProfile = async (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'First and last name are required' });
  }

  try {
    await db.query(
      'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
      [firstName, lastName, req.user.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ message: 'Error updating profile' });
  }
};
