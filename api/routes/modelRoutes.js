// routes/modelRoutes.js
import express from 'express';
import db from '../config/db.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT id, name, category_id FROM models');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
