import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { createUser, findUserByEmail } from '../models/userModel.js';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await createUser(name, email, hashedPassword);

  const token = jwt.sign({ id: userId, email }, config.jwtSecret, { expiresIn: '7d' });

  res.status(201).json({ token });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email }, config.jwtSecret, { expiresIn: '7d' });

  res.json({ token });
};
