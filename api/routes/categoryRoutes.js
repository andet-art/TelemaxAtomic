// routes/categoryRoutes.js
import express from 'express';
import db from '../config/db';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM categories');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
