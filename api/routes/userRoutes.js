import express from 'express';
import { signup, signin, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/', getAllUsers); // ✅ New

export default router;