import express from 'express';
import db from '../config/db.js'; // adjust path if needed

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message, referral } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  try {
    const sql = `
      INSERT INTO contact (name, email, subject, message, referral)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.execute(sql, [name, email, subject, message, referral]);

    res.status(200).json({ message: 'Message received successfully!' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

export default router;
