// /api/routes/orderRoutes.js
import express from 'express';
import { createOrder } from '../controllers/orderController.js';

const router = express.Router();

<<<<<<< HEAD
router.post('/', createOrder); // ✅ This is critical — NOT '/orders'
=======
router.post('/orders', createOrder);
>>>>>>> 01738f75dee92684ffadfb63e82b448eb613f677

export default router;
