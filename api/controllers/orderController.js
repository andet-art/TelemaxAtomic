import db from '../config/db.js';
import { getAllOrdersFromDB } from '../models/orderModel.js';

export const createOrder = async (req, res) => {
  console.log('📩 /api/orders endpoint hit');

  try {
    const { customer, paymentMethod, items, summary, timestamp } = req.body;

    if (
      !customer ||
      !items ||
      items.length === 0 ||
      !summary ||
      !paymentMethod
    ) {
      return res
        .status(400)
        .json({ error: 'Missing required order fields.' });
    }

    // Format timestamp for MySQL DATETIME
    const formattedTimestamp = timestamp.replace('T', ' ').replace('Z', '');

    // 1) Insert the order
    const [orderResult] = await db.execute(
      `INSERT INTO orders (
         full_name, email, phone,
         address1, address2, city, postal_code, country,
         payment_method, subtotal, tax, shipping, total, timestamp
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer.fullName,
        customer.email,
        customer.phone,
        customer.address1,
        customer.address2,
        customer.city,
        customer.postalCode,
        customer.country,
        paymentMethod,
        summary.subtotal,
        summary.tax,
        summary.shipping,
        summary.total,
        formattedTimestamp,
      ]
    );
    const orderId = orderResult.insertId;

    // 2) Insert each item for that order
    const itemInserts = items.map((item) =>
      db.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.id, item.quantity, item.price]
      )
    );
    await Promise.all(itemInserts);

    // 3) Return the fresh list of orders
    const [orders] = await getAllOrdersFromDB();
    res.status(201).json(orders);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    // destructure so we only send back the rows array
    const [orders] = await getAllOrdersFromDB();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
