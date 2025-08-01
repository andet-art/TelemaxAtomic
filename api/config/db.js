import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import config from './config.js';

dotenv.config();

const db = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional test connection on startup
try {
  const connection = await db.getConnection();
  console.log('✅ Connected to MySQL');
  connection.release();
} catch (err) {
  console.error('❌ MySQL connection failed:', err.message);
}

export default db;
