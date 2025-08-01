import { createUser, findUserByEmail } from '../models/userModel.js';
import { hashPassword, comparePasswords } from '../utils/hashPassword.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await hashPassword(password);
    const id = await createUser({ first_name, last_name, email, password: hashed });
    const token = generateToken({ id, is_admin: false });

    res.status(201).json({ id, email, token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await comparePasswords(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ id: user.id, email: user.email, token });
  } catch (err) {
    next(err);
  }
};
