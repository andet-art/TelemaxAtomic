import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.delete('/:id', deleteOrder);

export default router;
