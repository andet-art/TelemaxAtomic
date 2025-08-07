import db from '../config/db.js';

export const createOrder = async (req, res) => {
  // 🟢 Step 1: Confirm route is triggered
  console.log('📩 /api/orders endpoint hit');

  try {
    // 🟢 Step 2: Log incoming data
    console.log('📦 Incoming order payload:', req.body);

    const { customer, paymentMethod, items, summary, timestamp } = req.body;

    // 🟢 Step 3: Log values going into orders
    console.log('🛠 Inserting into orders with:', [
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
      timestamp
    ]);

    // ✅ Step 4: Insert into orders table
    const [orderResult] = await db.execute(
      `INSERT INTO orders (
        full_name, email, phone, address1, address2, city, postal_code, country,
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
        timestamp
      ]
    );

    const orderId = orderResult.insertId;
    console.log('🆔 Order inserted with ID:', orderId);

    // ✅ Step 5: Insert order items
    const itemInserts = items.map(item => {
      console.log('📦 Inserting item:', item);
      return db.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    });

    await Promise.all(itemInserts);
    console.log('✅ All order items inserted.');

    // ✅ Respond with success
    res.status(201).json({ message: 'Order placed successfully!' });

  } catch (err) {
    console.error('[ORDER ERROR]', err);
    res.status(500).json({ error: 'Something went wrong with your order!' });
  }
};
