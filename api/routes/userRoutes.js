import express from 'express';
import {
  signup,
  signin,
  getAllUsers,
  getUserById,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/', getAllUsers); // GET /api/users → all users
router.get('/:id', getUserById); // GET /api/users/:id → used in Profile page

export default router;
