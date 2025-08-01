const db = require('../config/db');

exports.createOrder = async (req, res) => {
  const { userId, items, totalPrice } = req.body;

  try {
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, total_price) VALUES (?, ?)',
      [userId, totalPrice]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.productId, item.quantity]
      );
    }

    res.status(201).json({ message: 'Order created', orderId });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

exports.getOrdersByUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};