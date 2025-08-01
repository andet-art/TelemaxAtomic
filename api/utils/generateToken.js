import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object with `id` and `is_admin`
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('❌ JWT_SECRET not defined in environment variables');
  }

  return jwt.sign(
    {
      id: user.id,
      is_admin: user.is_admin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export default generateToken;
