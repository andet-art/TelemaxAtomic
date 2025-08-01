const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [userRows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = userRows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
