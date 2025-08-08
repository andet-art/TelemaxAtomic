// controllers/userController.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import {
  createUser,
  findUserByEmail,
  getAllUsersFromDB,
  findUserById,
} from '../models/userModel.js';

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(name, email, hashedPassword);

    // Sign JWT
    const token = jwt.sign(
      { id: userId, email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ token });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Signin
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2️⃣ Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3️⃣ Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // 4️⃣ Strip password before returning user
    const { password: pw, ...userWithoutPassword } = user;

    // 5️⃣ Return both token and user object
    return res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersFromDB();
    // Optionally strip passwords here if included
    const sanitized = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
    return res.json(sanitized);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get user by ID (used in Profile)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Strip password
    const { password, ...rest } = user;
    return res.json(rest);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
};
