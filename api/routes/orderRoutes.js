import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  deleteOrder
} from '../controllers/orderController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// 🛒 Create order (must be logged in)
router.post('/', verifyToken, createOrder);

// 🔐 Admin-only access to all orders
router.get('/', verifyToken, isAdmin, getOrders);
router.get('/:id', verifyToken, isAdmin, getOrder);
router.delete('/:id', verifyToken, isAdmin, deleteOrder);

export default router;
