import bcrypt from 'bcrypt';

/**
 * Hash a plain-text password using bcrypt
 * @param {string} password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain-text password to a hashed password
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>} Match result
 */
export const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
