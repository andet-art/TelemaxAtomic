// api/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Allowed origins (local dev + production IP)
const allowedOrigins = [
  'http://localhost:8080',
  'http://134.122.71.254',
  'http://134.122.71.254:4000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Your API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

// ✅ Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://134.122.71.254:${PORT}`);
});
