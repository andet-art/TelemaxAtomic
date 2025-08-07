import express from 'express';
import { createOrder } from '../controllers/orderController.js';

const router = express.Router();

// This handles POST /api/orders
router.post('/', createOrder);

export default router;
