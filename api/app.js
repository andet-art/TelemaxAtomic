const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'public/uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
