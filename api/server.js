// api/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import modelRoutes from './routes/modelRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Setup for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://134.122.71.254',
  'http://134.122.71.254:4000',
];

// ✅ CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ JSON body parser
app.use(express.json());

// ✅ Static file serving for uploads
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'public/uploads'))
);

// ✅ Static file serving for version‐controlled assets
app.use(
  '/assets',
  express.static(path.join(__dirname, '..', 'assets'))
);

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contact', contactRoutes);

// ✅ Error handling middleware
app.use(errorHandler);

// ✅ Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://134.122.71.254:${PORT}`);
});
