import express from 'express';
import { getStats } from '../controllers/statsController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// 🔐 Only authenticated admins can access stats
router.get('/', verifyToken, isAdmin, getStats);

export default router;
