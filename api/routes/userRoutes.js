import express from 'express';
import { register, login } from '../controllers/authController.js';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// 🔐 Auth
router.post('/register', register);
router.post('/login', login);

// 👤 User Profile (protected)
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router;
