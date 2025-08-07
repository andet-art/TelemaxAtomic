import db from '../config/db.js';

export const createOrder = async (req, res) => {
  console.log('📩 /api/orders endpoint hit');

  try {
    const { customer, paymentMethod, items, summary, timestamp } = req.body;

    // 🧠 Validate required fields
    if (!customer || !items || items.length === 0 || !summary || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required order fields.' });
    }

    console.log('📦 Incoming order payload:', req.body);

    // ✅ Format timestamp to MySQL format
    const formattedTimestamp = timestamp.replace('T', ' ').replace('Z', '');

    const orderValues = [
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
    ];

    console.log('🛠 Inserting into orders with:', orderValues);

    // ✅ Insert into orders table
    const [orderResult] = await db.execute(
      `INSERT INTO orders (
        full_name, email, phone, address1, address2, city, postal_code, country,
        payment_method, subtotal, tax, shipping, total, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      orderValues
    );

    const orderId = orderResult.insertId;
    console.log('🆔 Order inserted with ID:', orderId);

    // ✅ Insert into order_items table
    const itemInserts = items.map((item) => {
      console.log('📦 Inserting item:', item);
      return db.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    });

    await Promise.all(itemInserts);
    console.log('✅ All order items inserted.');

    // ✅ Respond success
    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (err) {
    console.error('[ORDER ERROR]', err);
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};
