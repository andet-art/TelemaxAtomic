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

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
