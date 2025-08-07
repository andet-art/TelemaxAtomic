import express from 'express';
import db from '../config/db.js'; // make sure this path is correct

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message, referral } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await db.execute(
      `INSERT INTO contact (name, email, subject, message, referral)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, subject, message, referral]
    );
    res.status(200).json({ message: 'Message received successfully!' });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
