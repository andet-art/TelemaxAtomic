// /api/routes/orderRoutes.js
import express from 'express';
import { createOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder); // ✅ This is critical — NOT '/orders'

export default router;
