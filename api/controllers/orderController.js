// src/controllers/orderController.js

import db from '../config/db.js';
import { getAllOrdersFromDB } from '../models/orderModel.js';

export const createOrder = async (req, res) => {
  console.log('📩 /api/orders endpoint hit');
  try {
    const { customer, paymentMethod, items, summary, timestamp } = req.body;
    if (!customer || !items?.length || !summary || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required order fields.' });
    }

    const formattedTimestamp = timestamp.replace('T', ' ').replace('Z', '');
    const orderValues = [
      customer.fullName,
      customer.email,
      customer.phone,
      customer.address1,
      customer.address2 || '',
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

    // 1) Insert the order
    const [orderResult] = await db.execute(
      `INSERT INTO orders (
         full_name, email, phone,
         address1, address2, city, postal_code, country,
         payment_method, subtotal, tax, shipping, total, timestamp
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      orderValues
    );
    const orderId = orderResult.insertId;

    // 2) Insert each item
    const itemPromises = items.map(item =>
      db.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.id, item.quantity, item.price]
      )
    );
    await Promise.all(itemPromises);

    // 3) Return updated list
    const [rows] = await getAllOrdersFromDB();
    const parsed = rows.map(o => {
      let itemsArr = [];
      if (o.items_concat) {
        try {
          itemsArr = JSON.parse('[' + o.items_concat + ']');
        } catch (e) {
          console.warn(`⚠️ Failed to parse items for order ${o.id}`, e);
        }
      }
      return {
        id:            o.id,
        fullName:      o.fullName,
        email:         o.email,
        phone:         o.phone,
        address1:      o.address1,
        address2:      o.address2,
        city:          o.city,
        postalCode:    o.postalCode,
        country:       o.country,
        paymentMethod: o.paymentMethod,
        subtotal:      o.subtotal,
        tax:           o.tax,
        shipping:      o.shipping,
        total:         o.total,
        timestamp:     o.timestamp,
        items:         itemsArr,
      };
    });

    res.status(201).json(parsed);
  } catch (error) {
    console.error('❌ Error creating order:', error);
    // include the real error message for debugging
    res.status(500).json({ error: 'Server error', detail: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const [rows] = await getAllOrdersFromDB();
    const parsed = rows.map(o => {
      let itemsArr = [];
      if (o.items_concat) {
        try {
          itemsArr = JSON.parse('[' + o.items_concat + ']');
        } catch (e) {
          console.warn(`⚠️ Failed to parse items for order ${o.id}`, e);
        }
      }
      return {
        id:            o.id,
        fullName:      o.fullName,
        email:         o.email,
        phone:         o.phone,
        address1:      o.address1,
        address2:      o.address2,
        city:          o.city,
        postalCode:    o.postalCode,
        country:       o.country,
        paymentMethod: o.paymentMethod,
        subtotal:      o.subtotal,
        tax:           o.tax,
        shipping:      o.shipping,
        total:         o.total,
        timestamp:     o.timestamp,
        items:         itemsArr,
      };
    });
    res.status(200).json(parsed);
  } catch (error) {
    console.error('❌ Full error fetching orders:', error);
    // DEBUG: send actual error for troubleshooting
    res.status(500).json({
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 5)
    });
  }
};
