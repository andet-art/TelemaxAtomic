import { createUser, findUserByEmail } from '../models/userModel.js';
import { hashPassword, comparePasswords } from '../utils/hashPassword.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await hashPassword(password);
    const id = await createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    const token = generateToken({ id, email });

    // Return the newly created user (without password)
    res.status(201).json({
      token,
      user: {
        id,
        first_name,
        last_name,
        email,
        role: 'user', // optional if you have role field
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    // Strip password before returning user
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};
