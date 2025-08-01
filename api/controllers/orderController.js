import * as Order from '../models/orderModel.js';

export const createOrder = async (req, res, next) => {
  try {
    const { user_id, total_amount, status, items } = req.body;

    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing or invalid order data' });
    }

    await Order.createOrder(req.body);
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('Error creating order:', err.message);
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const [orders] = await Order.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const [order] = await Order.getOrderById(req.params.id);
    if (!order.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order[0]);
  } catch (err) {
    console.error('Error fetching order:', err.message);
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    await Order.deleteOrder(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('Error deleting order:', err.message);
    next(err);
  }
};
