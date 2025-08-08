// src/models/orderModel.js
import db from '../config/db.js';

export const getAllOrdersFromDB = () => {
  // Returns orders with a JSON array of items each
  return db.execute(`
    SELECT 
      o.id,
      o.full_name,
      o.email,
      o.phone,
      o.address1,
      o.address2,
      o.city,
      o.postal_code,
      o.country,
      o.payment_method,
      o.subtotal,
      o.tax,
      o.shipping,
      o.total,
      o.timestamp,
      JSON_ARRAYAGG(JSON_OBJECT(
        'product_id', oi.product_id,
        'name', p.name,
        'quantity', oi.quantity,
        'price', oi.price
      )) AS items
    FROM orders AS o
    LEFT JOIN order_items AS oi 
      ON oi.order_id = o.id
    LEFT JOIN products AS p 
      ON p.id = oi.product_id
    GROUP BY o.id
    ORDER BY o.timestamp DESC
  `);
};
