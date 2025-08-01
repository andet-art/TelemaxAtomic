const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ totalRevenue }]] = await db.query('SELECT SUM(total_price) AS totalRevenue FROM orders');

    res.json({ totalUsers, totalOrders, totalRevenue });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Error retrieving stats' });
  }
};