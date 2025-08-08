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
  const { name, email, password } = req.body;

  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await createUser(name, email, hashedPassword);

  const token = jwt.sign({ id: userId, email }, config.jwtSecret, { expiresIn: '7d' });

  res.status(201).json({ token });
};

// Signin
export const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email }, config.jwtSecret, { expiresIn: '7d' });

  res.json({ token, user }); // Optionally return full user here too
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersFromDB();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID (used in Profile)
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
