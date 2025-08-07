import db from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const { customer, paymentMethod, items, summary, timestamp } = req.body;

    // Step 1: Insert order
    const [orderResult] = await db.execute(
      `INSERT INTO orders (
        full_name, email, phone, address1, address2, city, postal_code, country,
        payment_method, subtotal, tax, shipping, total, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer.fullName, customer.email, customer.phone,
        customer.address1, customer.address2, customer.city,
        customer.postalCode, customer.country, paymentMethod,
        summary.subtotal, summary.tax, summary.shipping, summary.total,
        timestamp
      ]
    );

    const orderId = orderResult.insertId;

    // Step 2: Insert each item
    const itemInserts = items.map(item =>
      db.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      )
    );

    await Promise.all(itemInserts);

    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (err) {
    console.error('[ORDER ERROR]', err);
    res.status(500).json({ error: 'Something went wrong with your order!' });
  }
};
