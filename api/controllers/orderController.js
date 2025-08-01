import * as Order from '../models/orderModel.js';

export const createOrder = async (req, res, next) => {
  try {
    await Order.createOrder(req.body);
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const [rows] = await Order.getAllOrders();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const [rows] = await Order.getOrderById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Order not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    await Order.deleteOrder(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
};
